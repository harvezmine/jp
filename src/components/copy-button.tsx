"use client";

import { useEffect, useState } from "react";

import { Icon } from "@/components/icons";
import { cn } from "@/lib/utils";

/** Tombol salin ke clipboard, dengan konfirmasi singkat "Tersalin". */
export function CopyButton({
  value,
  label = "Salin",
  className,
}: {
  value: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(id);
  }, [copied]);

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
        } catch {
          // Clipboard diblokir browser; pengguna masih bisa menyalin manual.
        }
      }}
      className={cn(
        "inline-flex min-h-12 shrink-0 items-center gap-2 rounded-xl border border-maroon-200 bg-maroon-50 px-4 text-sm font-semibold text-maroon-800 transition-colors duration-300 hover:border-maroon-400 hover:bg-maroon-100 active:scale-[0.98]",
        className,
      )}
    >
      {copied ? <Icon.check className="h-4 w-4" /> : <Icon.copy className="h-4 w-4" />}
      <span aria-live="polite">{copied ? "Tersalin" : label}</span>
    </button>
  );
}
