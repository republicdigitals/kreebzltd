import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client for server-side storage operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn("Supabase credentials are not set. Storage operations will fail.");
}

export const supabase = createClient(
  supabaseUrl || "http://localhost",
  supabaseServiceKey || "dummy-key",
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export const STORAGE_BUCKET = "properties";

/**
 * Uploads a file to Supabase Storage
 */
export async function uploadMedia(
  file: Buffer,
  fileName: string,
  contentType: string
): Promise<{ path: string; url: string; error: string | null }> {
  try {
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
    return { path: "", url: "", error: "Internal server error during upload" };
  }
}

/**
 * Deletes a file from Supabase Storage
 */
export async function deleteMedia(path: string): Promise<{ error: string | null }> {
  try {
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
