/** @type {import('next').NextConfig} */
const authUrl =
  process.env.NEXTAUTH_URL?.trim() ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

const authSecret =
  process.env.NEXTAUTH_SECRET?.trim() || process.env.AUTH_SECRET?.trim() || "";

// Ensure NextAuth never sees an empty NEXTAUTH_URL during build/prerender.
if (!process.env.NEXTAUTH_URL?.trim()) {
  process.env.NEXTAUTH_URL = authUrl;
}
if (authSecret && !process.env.NEXTAUTH_SECRET?.trim()) {
  process.env.NEXTAUTH_SECRET = authSecret;
}

const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXTAUTH_URL: authUrl,
    ...(authSecret ? { NEXTAUTH_SECRET: authSecret } : {}),
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
};

export default nextConfig;
