"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/* Primitif form yang dipakai bersama oleh form pertolongan, kontak, dan admin. */

const controlBase =
  "form-control w-full min-w-0 rounded-xl border bg-white px-4 py-3.5 text-base text-ink outline-none transition placeholder:text-sand-700 focus:border-maroon-600 disabled:opacity-60";

export function Field({
  label,
  htmlFor,
  hint,
  error,
  optional,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm font-semibold text-ink">
        {label}
        {optional && <span className="text-xs font-normal text-sand-600">opsional</span>}
      </label>
      {hint && (
        <p id={`${htmlFor}-hint`} className="mt-1 text-xs leading-relaxed text-sand-700">
          {hint}
        </p>
      )}
      <div className="mt-2">{children}</div>
      {error && (
        <p id={`${htmlFor}-error`} role="alert" className="mt-1.5 text-sm font-medium text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

export function Input({ error, className, ...props }: React.ComponentProps<"input"> & { error?: string }) {
  return (
    <input
      {...props}
      aria-invalid={error ? true : undefined}
      aria-describedby={
        [props["aria-describedby"], error && props.id ? `${props.id}-error` : ""].filter(Boolean).join(" ") || undefined
      }
      className={cn(controlBase, error ? "border-red-400" : "border-sand-300", className)}
    />
  );
}

export function Textarea({ error, className, ...props }: React.ComponentProps<"textarea"> & { error?: string }) {
  return (
    <textarea
      {...props}
      aria-invalid={error ? true : undefined}
      aria-describedby={
        [props["aria-describedby"], error && props.id ? `${props.id}-error` : ""].filter(Boolean).join(" ") || undefined
      }
      className={cn(
        controlBase,
        "min-h-36 resize-y leading-relaxed",
        error ? "border-red-400" : "border-sand-300",
        className,
      )}
    />
  );
}

export function Select({ error, className, children, ...props }: React.ComponentProps<"select"> & { error?: string }) {
  return (
    <select
      {...props}
      aria-invalid={error ? true : undefined}
      aria-describedby={
        [props["aria-describedby"], error && props.id ? `${props.id}-error` : ""].filter(Boolean).join(" ") || undefined
      }
      className={cn(
        controlBase,
        "appearance-none bg-[length:16px] bg-[right_1rem_center] bg-no-repeat pr-10",
        error ? "border-red-400" : "border-sand-300",
        className,
      )}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%23765b48' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='m4 6 4 4 4-4'/%3E%3C/svg%3E\")",
      }}
    >
      {children}
    </select>
  );
}

/** Kartu pilihan besar, jauh lebih mudah ditekan di HP daripada radio kecil. */
export function OptionCard({
  name,
  value,
  checked,
  onChange,
  title,
  description,
  icon,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  title: string;
  description?: string;
  icon?: ReactNode;
}) {
  return (
    <label
      className={cn(
        "form-option flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-all duration-200",
        checked
          ? "border-maroon-600 bg-maroon-50 ring-1 ring-maroon-600"
          : "border-sand-300 bg-white hover:border-maroon-300 hover:bg-sand-50",
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="sr-only"
      />
      {icon && (
        <span
          className={cn(
            "grid h-9 w-9 shrink-0 place-items-center rounded-lg transition-colors",
            checked ? "bg-maroon-700 text-sand-50" : "bg-sand-100 text-sand-700",
          )}
        >
          {icon}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className={cn("block text-sm font-semibold", checked ? "text-maroon-800" : "text-ink")}>{title}</span>
        {description && <span className="mt-0.5 block text-xs leading-relaxed text-sand-700">{description}</span>}
      </span>
      <span
        aria-hidden
        className={cn(
          "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 transition-colors",
          checked ? "border-maroon-700 bg-maroon-700" : "border-sand-300",
        )}
      >
        {checked && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
      </span>
    </label>
  );
}

export function Checkbox({
  name,
  checked,
  onChange,
  title,
  description,
}: {
  name: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  title: string;
  description?: string;
}) {
  return (
    <label
      className={cn(
        "form-option flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors",
        checked
          ? "border-maroon-600 bg-maroon-50"
          : "border-sand-300 bg-white hover:border-maroon-300 hover:bg-sand-50",
      )}
    >
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <span
        aria-hidden
        className={cn(
          "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border-2 transition-colors",
          checked ? "border-maroon-700 bg-maroon-700" : "border-sand-300",
        )}
      >
        {checked && (
          <svg
            viewBox="0 0 24 24"
            className="h-3 w-3"
            fill="none"
            stroke="white"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m5 12.5 4.5 4.5L19 7.5" />
          </svg>
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-ink">{title}</span>
        {description && <span className="mt-0.5 block text-xs leading-relaxed text-sand-700">{description}</span>}
      </span>
    </label>
  );
}
