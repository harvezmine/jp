"use client";

import { useState } from "react";
import { Icon } from "@/components/icons";

/**
 * Tombol bagikan. Di HP memakai Web Share API bawaan (muncul sheet WhatsApp,
 * IG, dll); di desktop jatuh ke salin tautan.
 */
export function ShareButtons({ title, path }: { title: string; path: string }) {
  const [copied, setCopied] = useState(false);

  const url = typeof window !== "undefined" ? `${window.location.origin}${path}` : path;

  const share = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // Pengguna membatalkan, tidak perlu ditangani.
        return;
      }
    }
    copy();
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const btn =
    "inline-flex min-h-11 items-center gap-2 rounded-full border border-sand-300 px-4 text-sm font-semibold text-sand-800 transition-colors hover:border-maroon-400 hover:text-maroon-700";

  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" onClick={share} className={btn}>
        <Icon.arrowUpRight className="h-4 w-4" />
        Bagikan
      </button>
      <a
        href={`https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={btn}
      >
        <Icon.whatsapp className="h-4 w-4" />
        WhatsApp
      </a>
      <button type="button" onClick={copy} className={btn} aria-live="polite">
        <Icon.check className="h-4 w-4" />
        {copied ? "Tautan tersalin" : "Salin tautan"}
      </button>
    </div>
  );
}
