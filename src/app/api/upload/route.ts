import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { uploadMedia } from "@/lib/storage";
import { timingSafeEqual } from "crypto";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_VIDEO_SIZE = 60 * 1024 * 1024; // 60 MB

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "video/mp4",
  "video/webm",
]);

/** Magic-byte signatures for the allowed image/video formats. */
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
  // WebM: EBML header 1A 45 DF A3
  if (buffer[0] === 0x1a && buffer[1] === 0x45 && buffer[2] === 0xdf && buffer[3] === 0xa3) return "video/webm";
  // MP4: "ftyp" box with an mp4/isom-family brand
  if (buffer.toString("ascii", 4, 8) === "ftyp") {
    const brand = buffer.toString("ascii", 8, 12);
    if (["isom", "iso2", "mp41", "mp42", "avc1", "dash", "mp71", "M4V ", "MSNV"].includes(brand)) return "video/mp4";
  }
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

    const isVideoUpload = file.type.startsWith("video/");
    const maxSize = isVideoUpload ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
    if (file.size > maxSize) {
      return NextResponse.json({ error: `File exceeds the ${maxSize / 1024 / 1024}MB limit` }, { status: 413 });
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json({ error: "Only JPEG, PNG, WebP, AVIF images and MP4/WebM videos are allowed" }, { status: 415 });
    }

    // Convert Web File to Node Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Verify the file's actual bytes match an allowed format —
    // the declared MIME type is client-controlled and can't be trusted.
    const sniffed = sniffMimeType(buffer);
    if (!sniffed) {
      return NextResponse.json({ error: "File content is not a valid image or video" }, { status: 415 });
    }

    // Generate unique filename — extension derived from sniffed type, not user input
    const ext = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif", "video/mp4": "mp4", "video/webm": "webm" }[sniffed];
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
