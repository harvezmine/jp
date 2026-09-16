import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/page-header";
import { HelpRequestPanel } from "@/components/admin/help-request-panel";
import { Icon } from "@/components/icons";
import { Badge, Card } from "@/components/ui";
import { adminDb } from "@/lib/admin-auth";
import {
  COMPANION_LABEL,
  CONTACT_PREF_LABEL,
  HELP_CATEGORY_LABEL,
  HELP_SOURCE_LABEL,
  PRAYER_FOR_LABEL,
  URGENCY_LABEL,
  type HelpRequest,
} from "@/lib/types";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HelpRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await adminDb();
  const { data } = await supabase.from("help_requests").select("*").eq("id", id).maybeSingle();

  if (!data) notFound();
  const r = data as HelpRequest;

  const waNumber = r.phone?.replace(/\D/g, "").replace(/^0/, "62");

  return (
    <>
      <AdminPageHeader title={r.ref_code} backHref="/admin/permohonan" />

      <div className="grid gap-5 lg:grid-cols-12 lg:gap-6">
        {/* Isi permohonan */}
        <div className="space-y-5 lg:col-span-7">
          <Card className="p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="maroon">{HELP_CATEGORY_LABEL[r.category]}</Badge>
              {r.source && r.source !== "umum" && <Badge tone="sand">{HELP_SOURCE_LABEL[r.source]}</Badge>}
              <Badge tone={r.urgency === "darurat" ? "red" : r.urgency === "mendesak" ? "gold" : "sand"}>
                {URGENCY_LABEL[r.urgency]}
              </Badge>
              {r.is_confidential && (
                <Badge tone="maroon">
                  <Icon.shield className="h-3 w-3" />
                  Rahasia
                </Badge>
              )}
            </div>

            <h2 className="font-display mt-4 text-lg font-semibold text-ink">Isi permohonan</h2>
            <p className="mt-2 whitespace-pre-wrap leading-relaxed text-sand-800">{r.message}</p>

            <p className="mt-5 border-t border-sand-200 pt-4 text-xs text-sand-500">
              Dikirim {formatDateTime(r.created_at)}
            </p>
          </Card>

          <Card className="p-5 sm:p-6">
            <h2 className="font-display text-lg font-semibold text-ink">Data pemohon</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex gap-3">
                <dt className="w-32 shrink-0 text-sand-600">Nama</dt>
                <dd className="font-medium text-ink">
                  {r.is_anonymous ? <em className="text-sand-600">Anonim</em> : r.name || "—"}
                </dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-32 shrink-0 text-sand-600">Nomor</dt>
                <dd className="font-medium text-ink">{r.phone || "—"}</dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-32 shrink-0 text-sand-600">Email</dt>
                <dd className="break-all font-medium text-ink">{r.email || "—"}</dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-32 shrink-0 text-sand-600">Kota</dt>
                <dd className="font-medium text-ink">{r.city || "—"}</dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-32 shrink-0 text-sand-600">Ingin dihubungi</dt>
                <dd className="font-medium text-ink">{CONTACT_PREF_LABEL[r.contact_preference]}</dd>
              </div>
              {r.details?.prayer_for && (
                <div className="flex gap-3">
                  <dt className="w-32 shrink-0 text-sand-600">Doa untuk</dt>
                  <dd className="font-medium text-ink">{PRAYER_FOR_LABEL[r.details.prayer_for]}</dd>
                </div>
              )}
              {r.details?.companion && (
                <div className="flex gap-3">
                  <dt className="w-32 shrink-0 text-sand-600">Pendamping</dt>
                  <dd className="font-medium text-ink">{COMPANION_LABEL[r.details.companion]}</dd>
                </div>
              )}
            </dl>

            {r.contact_preference !== "tidak_perlu" && (r.phone || r.email) && (
              <div className="mt-5 flex flex-wrap gap-2 border-t border-sand-200 pt-4">
                {waNumber && (
                  <a
                    href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
                      `Shalom, ini pengurus Janji Pengharapan. Kami menerima permohonan Anda (${r.ref_code}).`,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 items-center gap-2 rounded-full bg-maroon-700 px-4 text-sm font-semibold text-sand-50"
                  >
                    <Icon.whatsapp className="h-4 w-4" />
                    Hubungi via WhatsApp
                  </a>
                )}
                {r.phone && (
                  <a
                    href={`tel:${r.phone.replace(/\s/g, "")}`}
                    className="inline-flex h-10 items-center gap-2 rounded-full border border-sand-300 px-4 text-sm font-semibold text-ink"
                  >
                    <Icon.phone className="h-4 w-4" />
                    Telepon
                  </a>
                )}
                {r.email && (
                  <a
                    href={`mailto:${r.email}?subject=${encodeURIComponent(`Permohonan ${r.ref_code}`)}`}
                    className="inline-flex h-10 items-center gap-2 rounded-full border border-sand-300 px-4 text-sm font-semibold text-ink"
                  >
                    <Icon.mail className="h-4 w-4" />
                    Email
                  </a>
                )}
              </div>
            )}
          </Card>
        </div>

        {/* Penanganan */}
        <div className="lg:col-span-5">
          <HelpRequestPanel request={r} />
        </div>
      </div>
    </>
  );
}
