"use client";

import { useState } from "react";

import { Icon } from "@/components/icons";
import { cn } from "@/lib/utils";

/**
 * Tombol hapus dua langkah. Klik pertama meminta konfirmasi inline —
 * lebih aman daripada window.confirm dan tidak mengagetkan di layar HP.
 */
export function DeleteButton({
  action,
  id,
  label = "Hapus",
  compact = false,
}: {
  action: (formData: FormData) => void | Promise<void>;
  id: string;
  label?: string;
  compact?: boolean;
}) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full text-xs font-semibold text-sand-600 transition-colors hover:text-red-700",
          compact ? "h-9 px-2" : "h-9 px-3",
        )}
      >
        <Icon.trash className="h-4 w-4" />
        {!compact && label}
      </button>
    );
  }

  return (
    <span className="inline-flex items-center gap-1">
      <form action={action}>
        <input type="hidden" name="id" value={id} />
        <button
          type="submit"
          className="inline-flex h-9 items-center rounded-full bg-red-600 px-3 text-xs font-semibold text-white"
        >
          Yakin hapus
        </button>
      </form>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="inline-flex h-9 items-center rounded-full px-3 text-xs font-semibold text-sand-700"
      >
        Batal
      </button>
    </span>
  );
}
