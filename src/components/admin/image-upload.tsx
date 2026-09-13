"use client";

import { useState } from "react";

import { Icon } from "@/components/icons";
import { Input } from "@/components/form-fields";
import { cn } from "@/lib/utils";

const MAX_MB = 5;

/**
 * Unggah gambar ke Supabase Storage (bucket "media") dan simpan URL publiknya
 * ke field tersembunyi. Tetap bisa diisi manual bila pengurus sudah punya URL.
 */
export function ImageUpload({
  name,
  defaultValue,
  label = "Gambar sampul",
}: {
  name: string;
  defaultValue?: string | null;
  label?: string;
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file: File) => {
    setError(null);

    if (!file.type.startsWith("image/")) {
      setError("File harus berupa gambar.");
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`Ukuran maksimal ${MAX_MB} MB. Perkecil dulu gambarnya.`);
      return;
    }

    setBusy(true);
    try {
      const body = new FormData();
      body.append("file", file);
      // redirect: "manual" — kalau sesi habis, middleware mengalihkan ke login;
      // jangan sampai HTML halaman login dibaca sebagai JSON.
      const res = await fetch("/admin/upload", { method: "POST", body, redirect: "manual" });
      const json = res.headers.get("content-type")?.includes("application/json")
        ? ((await res.json()) as { url?: string; error?: string })
        : null;

      if (!res.ok || !json?.url) {
        setError(json?.error ?? "Sesi berakhir. Muat ulang halaman lalu masuk lagi.");
        return;
      }
      setUrl(json.url);
    } catch (err) {
      console.error("[upload]", err);
      setError("Gagal mengunggah. Periksa koneksi, lalu coba lagi.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <p className="text-sm font-semibold text-ink">{label}</p>
      <input type="hidden" name={name} value={url} />

      <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-start">
        <label
          className={cn(
            "relative grid h-32 w-full shrink-0 cursor-pointer place-items-center overflow-hidden rounded-xl border-2 border-dashed transition-colors sm:w-48",
            busy ? "border-sand-300 bg-sand-100" : "border-sand-300 bg-white hover:border-maroon-400",
          )}
        >
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            disabled={busy}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) upload(file);
              e.target.value = "";
            }}
          />
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="flex flex-col items-center gap-1.5 text-sand-600">
              <Icon.image className="h-6 w-6" />
              <span className="text-xs font-medium">{busy ? "Mengunggah…" : "Pilih gambar"}</span>
            </span>
          )}
        </label>

        <div className="min-w-0 flex-1">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="atau tempel URL gambar di sini"
          />
          <p className="mt-1.5 text-xs text-sand-600">
            JPG/PNG/WebP, maksimal {MAX_MB} MB. Ukuran ideal 1200×630.
          </p>
          {url && (
            <button
              type="button"
              onClick={() => setUrl("")}
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-red-700"
            >
              <Icon.trash className="h-3.5 w-3.5" />
              Hapus gambar
            </button>
          )}
          {error && <p className="mt-2 text-xs font-medium text-red-700">{error}</p>}
        </div>
      </div>
    </div>
  );
}
