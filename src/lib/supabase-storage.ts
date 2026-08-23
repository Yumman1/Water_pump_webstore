const BUCKET = "store-assets";

function supabaseConfig(): { url: string; key: string } | null {
  const url = (process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL)?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) return null;
  return { url: url.replace(/\/$/, ""), key };
}

export function isUploadConfigured(): boolean {
  return supabaseConfig() !== null;
}

/** Upload a file to Supabase Storage and return its public URL. */
export async function uploadToSupabase(
  file: Buffer,
  filename: string,
  contentType: string,
  folder = "uploads"
): Promise<string> {
  const cfg = supabaseConfig();
  if (!cfg) {
    throw new Error("Supabase Storage is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  }

  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "-");
  const path = `${folder}/${Date.now()}-${safeName}`;

  const res = await fetch(`${cfg.url}/storage/v1/object/${BUCKET}/${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${cfg.key}`,
      "Content-Type": contentType,
      "x-upsert": "true",
    },
    body: new Uint8Array(file),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upload failed: ${text || res.statusText}`);
  }

  return `${cfg.url}/storage/v1/object/public/${BUCKET}/${path}`;
}
