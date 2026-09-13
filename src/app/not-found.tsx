import Link from "next/link";
import { ButtonLink } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="grid min-h-dvh place-items-center bg-paper px-5 py-24 text-center">
      <div className="max-w-md">
        <p className="font-display text-8xl font-semibold italic text-maroon-700">404</p>
        <h1 className="text-title mt-4 text-ink">Halaman ini tidak ada</h1>
        <p className="mt-3 leading-relaxed text-sand-700">
          Mungkin tautannya sudah diganti atau ada salah ketik. Coba mulai lagi dari beranda.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <ButtonLink href="/">Ke beranda</ButtonLink>
          <Link
            href="/kontak"
            className="text-sm font-semibold text-maroon-700 underline decoration-maroon-300 underline-offset-4 hover:decoration-maroon-700"
          >
            Hubungi kami
          </Link>
        </div>
        <p className="mt-10 text-sm text-sand-600">
          Sedang cari bacaan?{" "}
          <Link href="/konten" className="font-semibold text-maroon-700 underline underline-offset-4">
            Buka halaman konten
          </Link>
        </p>
      </div>
    </div>
  );
}
