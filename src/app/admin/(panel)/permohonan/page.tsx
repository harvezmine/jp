import Link from "next/link";

import { AdminPageHeader } from "@/components/admin/page-header";
import { Icon } from "@/components/icons";
import { Badge, Card, EmptyState } from "@/components/ui";
import { adminDb } from "@/lib/admin-auth";
import {
  HELP_CATEGORY_LABEL,
  HELP_STATUS_LABEL,
  type HelpRequest,
  type HelpStatus,
} from "@/lib/types";
import { cn, formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

const filters: { key: HelpStatus | "semua"; label: string }[] = [
  { key: "semua", label: "Semua" },
  { key: "baru", label: "Baru" },
  { key: "diproses", label: "Ditangani" },
  { key: "selesai", label: "Selesai" },
  { key: "ditutup", label: "Ditutup" },
];

const statusTone = {
  baru: "gold",
  diproses: "clay",
  selesai: "green",
  ditutup: "sand",
} as const;

export default async function AdminPermohonanPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const active = filters.some((f) => f.key === status) ? status! : "semua";

  const supabase = await adminDb();
  let q = supabase.from("help_requests").select("*").order("created_at", { ascending: false });
  if (active !== "semua") q = q.eq("status", active);

  const { data } = await q;
  const requests = (data ?? []) as HelpRequest[];

  return (
    <>
      <AdminPageHeader
        title="Permohonan Pertolongan"
        description="Setiap permohonan yang masuk lewat formulir. Tandai statusnya agar tidak ada yang terlewat."
      />

      <div className="-mx-1 mb-5 flex gap-2 overflow-x-auto px-1 pb-1">
        {filters.map((f) => (
          <Link
            key={f.key}
            href={f.key === "semua" ? "/admin/permohonan" : `/admin/permohonan?status=${f.key}`}
            className={cn(
              "shrink-0 rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors",
              active === f.key
                ? "border-maroon-600 bg-maroon-50 text-maroon-700"
                : "border-sand-300 text-sand-700 hover:border-maroon-300",
            )}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {requests.length ? (
        <ul className="space-y-3">
          {requests.map((r) => (
            <li key={r.id}>
              <Link href={`/admin/permohonan/${r.id}`}>
                <Card interactive className="p-4 sm:p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-display text-sm font-semibold text-maroon-700">
                      {r.ref_code}
                    </span>
                    <Badge tone={statusTone[r.status]}>{HELP_STATUS_LABEL[r.status]}</Badge>
                    {r.urgency === "darurat" && <Badge tone="red">Darurat</Badge>}
                    {r.urgency === "mendesak" && <Badge tone="gold">Mendesak</Badge>}
                    {r.is_confidential && (
                      <Badge tone="maroon">
                        <Icon.shield className="h-3 w-3" />
                        Rahasia
                      </Badge>
                    )}
                  </div>

                  <p className="mt-2.5 font-medium text-ink">
                    {r.is_anonymous ? "Anonim" : r.name || "Tanpa nama"}
                    <span className="font-normal text-sand-600">
                      {" "}
                      · {HELP_CATEGORY_LABEL[r.category]}
                    </span>
                  </p>

                  <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-sand-700">
                    {r.is_confidential ? "Ditandai rahasia — buka untuk membaca." : r.message}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-sand-500">
                    <span>{formatDateTime(r.created_at)}</span>
                    {r.city && <span>· {r.city}</span>}
                    {r.handled_by && <span>· ditangani {r.handled_by}</span>}
                  </div>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          title={active === "semua" ? "Belum ada permohonan" : "Tidak ada yang cocok"}
          description={
            active === "semua"
              ? "Permohonan dari formulir pertolongan akan muncul di sini."
              : "Coba pilih filter status yang lain."
          }
        />
      )}
    </>
  );
}
