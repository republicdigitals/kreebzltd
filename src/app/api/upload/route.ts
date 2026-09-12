import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { uploadMedia } from "@/lib/storage";
import { timingSafeEqual } from "crypto";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

/** Magic-byte signatures for the allowed image formats. */
function sniffMimeType(buffer: Buffer): string | null {
  if (buffer.length < 12) return null;
  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return "image/jpeg";
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) return "image/png";
  // WEBP: "RIFF"...."WEBP"
  if (buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP") return "image/webp";
  // AVIF: "ftyp" box with avif/avis brand
  if (buffer.toString("ascii", 4, 8) === "ftyp" && ["avif", "avis"].includes(buffer.toString("ascii", 8, 12))) return "image/avif";
  return null;
}

/** Constant-time bearer-token comparison — avoids timing side-channel. */
function apiKeyValid(authHeader: string | null): boolean {
  const expected = process.env.ADMIN_API_KEY;
  if (!expected || !authHeader?.startsWith("Bearer ")) return false;
  const provided = authHeader.slice(7);
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: NextRequest) {
  try {
    // Allow either a valid ADMIN NextAuth session or the ADMIN_API_KEY bearer
    // token — a customer session must not grant upload rights.
    const session = await getServerSession(authOptions);
    const isAdminSession = session?.user?.role === "ADMIN";
    const authHeader = request.headers.get("authorization");

    if (!isAdminSession && !apiKeyValid(authHeader)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File exceeds the 10MB limit" }, { status: 413 });
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json({ error: "Only JPEG, PNG, WebP, and AVIF images are allowed" }, { status: 415 });
    }

    // Convert Web File to Node Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Verify the file's actual bytes match an allowed image format —
    // the declared MIME type is client-controlled and can't be trusted.
    const sniffed = sniffMimeType(buffer);
    if (!sniffed) {
      return NextResponse.json({ error: "File content is not a valid image" }, { status: 415 });
    }

    // Generate unique filename — extension derived from sniffed type, not user input
    const ext = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif" }[sniffed];
    const fileName = `${Date.now()}-${crypto.randomUUID()}.${ext}`;

    // Upload to Supabase
    const { path, url, error } = await uploadMedia(buffer, fileName, sniffed);

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({
      path,
      url,
      mimeType: sniffed,
      size: file.size,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal server error during upload" },
      { status: 500 }
    );
  }
}
