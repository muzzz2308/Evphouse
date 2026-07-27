import { supabase, isSupabaseConfigured } from "./supabase";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_PDF_BYTES = 10 * 1024 * 1024;

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const PDF_TYPES = ["application/pdf"];

function sanitizeFileName(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

/**
 * Upload a file to a public Supabase Storage bucket and return its public URL.
 */
export async function uploadFile(bucket, file, { accept = "image" } = {}) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase is not configured.");
  }

  if (accept === "image") {
    if (!IMAGE_TYPES.includes(file.type)) {
      throw new Error("Please upload a JPG, PNG, WEBP, or GIF image.");
    }
    if (file.size > MAX_IMAGE_BYTES) {
      throw new Error("Image must be 5MB or smaller.");
    }
  } else if (accept === "pdf") {
    if (!PDF_TYPES.includes(file.type)) {
      throw new Error("Please upload a PDF file.");
    }
    if (file.size > MAX_PDF_BYTES) {
      throw new Error("PDF must be 10MB or smaller.");
    }
  }

  const path = `${Date.now()}-${sanitizeFileName(file.name)}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
