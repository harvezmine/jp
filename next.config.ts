import type { NextConfig } from "next";

// Gambar yang diunggah lewat admin panel dilayani Supabase Storage. Izinkan host
// proyek yang sedang dipakai — cloud, domain kustom, maupun Supabase lokal.
const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL)
  : null;

const nextConfig: NextConfig = {
  // Menghasilkan .next/standalone -> jalankan `node server.js` di server sendiri.
  output: "standalone",
  // Kunci akar penelusuran file ke folder proyek ini (ada lockfile lain di $HOME).
  outputFileTracingRoot: process.cwd(),
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
      ...(supabase
        ? [
            {
              protocol: supabase.protocol === "http:" ? ("http" as const) : ("https" as const),
              hostname: supabase.hostname,
              port: supabase.port,
              pathname: "/storage/v1/object/public/**",
            },
          ]
        : []),
    ],
  },
};

export default nextConfig;
