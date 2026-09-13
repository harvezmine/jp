import type { Metadata } from "next";
import Link from "next/link";

import { LoginForm } from "@/components/admin/login-form";
import { LogoMark } from "@/components/logo";
import { MIN_PASSWORD_LENGTH, isAdminConfigured } from "@/lib/admin-session";

export const metadata: Metadata = { title: "Masuk" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="bg-maroon-deep grid min-h-screen place-items-center px-5 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-sand-50/10 text-sand-50">
            <LogoMark className="h-8 w-8" />
          </span>
          <h1 className="font-display mt-5 text-2xl font-semibold text-sand-50">
            Panel Pengurus
          </h1>
          <p className="mt-1.5 text-sm text-sand-300/70">Janji Pengharapan</p>
        </div>

        <div className="animate-rise mt-8 rounded-2xl bg-cream p-6 shadow-warm-lg sm:p-7">
          {isAdminConfigured() ? (
            <LoginForm next={next} />
          ) : (
            <div className="text-sm leading-relaxed text-sand-700">
              <p className="font-semibold text-ink">Admin panel belum dikonfigurasi.</p>
              <p className="mt-2">
                Salin <code className="rounded bg-sand-200 px-1.5 py-0.5 text-xs">.env.example</code>{" "}
                menjadi <code className="rounded bg-sand-200 px-1.5 py-0.5 text-xs">.env.local</code>,
                isi kredensial Supabase (termasuk service-role key) dan{" "}
                <code className="rounded bg-sand-200 px-1.5 py-0.5 text-xs">ADMIN_PASSWORD</code>{" "}
                minimal {MIN_PASSWORD_LENGTH} karakter, lalu jalankan ulang server.
              </p>
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-sand-300/60">
          <Link href="/" className="hover:text-gold-400">
            ← Kembali ke situs
          </Link>
        </p>
      </div>
    </div>
  );
}
