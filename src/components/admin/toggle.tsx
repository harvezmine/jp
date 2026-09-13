"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/** Saklar terbit/draf. Nilainya dikirim sebagai checkbox biasa ("on"). */
export function PublishToggle({
  name,
  defaultChecked = false,
  label = "Tampilkan di situs",
  description,
}: {
  name: string;
  defaultChecked?: boolean;
  label?: string;
  description?: string;
}) {
  const [on, setOn] = useState(defaultChecked);

  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-sand-300 bg-white p-4">
      <input
        type="checkbox"
        name={name}
        checked={on}
        onChange={(e) => setOn(e.target.checked)}
        className="sr-only"
      />
      <span
        aria-hidden
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300",
          on ? "bg-maroon-700" : "bg-sand-300",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-300",
            on ? "translate-x-5.5" : "translate-x-0.5",
          )}
        />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-ink">{label}</span>
        {description && <span className="block text-xs text-sand-600">{description}</span>}
      </span>
    </label>
  );
}
