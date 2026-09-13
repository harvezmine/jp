import Link from "next/link";
import type { ReactNode } from "react";

import { Icon } from "@/components/icons";

export function AdminPageHeader({
  title,
  description,
  backHref,
  action,
}: {
  title: string;
  description?: string;
  backHref?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 sm:mb-8">
      {backHref && (
        <Link
          href={backHref}
          className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-sand-600 transition-colors hover:text-maroon-700"
        >
          <Icon.arrowLeft className="h-4 w-4" />
          Kembali
        </Link>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">{title}</h1>
          {description && (
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-sand-700">{description}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  );
}
