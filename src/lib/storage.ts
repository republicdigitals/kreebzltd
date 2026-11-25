import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const STORAGE_BUCKET = "properties";

/**
 * Storage credentials resolve in order:
 *   1. environment variables (preferred — Netlify env / .env)
 *   2. the ServerConfig table, so uploads keep working in environments
 *      where the env vars were never configured (the DB is already
 *      reachable from every deployment)
 * Anyone with database access already controls all application data, so
 * the fallback does not meaningfully widen access.
 */
let cachedClient: SupabaseClient | null = null;

async function getStorageClient(): Promise<SupabaseClient> {
  if (cachedClient) return cachedClient;

  let url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  let key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    try {
      const prisma = (await import("@/lib/prisma")).default;
      const rows = await prisma.serverConfig.findMany({
        where: { key: { in: ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"] } },
      });
      const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
      url = url || map.SUPABASE_URL;
      key = key || map.SUPABASE_SERVICE_ROLE_KEY;
    } catch (error) {
      console.error("ServerConfig lookup failed:", error);
    }
  }

  if (!url || !key) {
    throw new Error("Supabase storage is not configured — set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
  }

  cachedClient = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return cachedClient;
}

/** Uploads a file to Supabase Storage */
export async function uploadMedia(
  file: Buffer,
  fileName: string,
  contentType: string
): Promise<{ path: string; url: string; error: string | null }> {
  try {
    const supabase = await getStorageClient();
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(fileName, file, {
        contentType,
        upsert: false,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return { path: "", url: "", error: error.message };
    }

    const { data: publicUrlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(data.path);

    return {
      path: data.path,
      url: publicUrlData.publicUrl,
      error: null,
    };
  } catch (error) {
    console.error("Storage upload exception:", error);
    return { path: "", url: "", error: error instanceof Error ? error.message : "Internal server error during upload" };
  }
}

/** Deletes a file from Supabase Storage */
export async function deleteMedia(path: string): Promise<{ error: string | null }> {
  try {
    const supabase = await getStorageClient();
    const { error } = await supabase.storage.from(STORAGE_BUCKET).remove([path]);

    if (error) {
      console.error("Supabase delete error:", error);
      return { error: error.message };
    }

    return { error: null };
  } catch (error) {
    console.error("Storage delete exception:", error);
    return { error: "Internal server error during deletion" };
  }
}
