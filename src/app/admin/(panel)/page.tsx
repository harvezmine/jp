import Link from "next/link";

import { AdminPageHeader } from "@/components/admin/page-header";
import { Icon } from "@/components/icons";
import { Badge, ButtonLink, Card } from "@/components/ui";
import { adminDb } from "@/lib/admin-auth";
import { HELP_CATEGORY_LABEL, HELP_STATUS_LABEL, type HelpRequest } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function counts() {
  const supabase = await adminDb();
  const head = (table: string) => supabase.from(table).select("id", { count: "exact", head: true });

  const [baru, diproses, posts, quotes, events, pesan] = await Promise.all([
    head("help_requests").eq("status", "baru"),
    head("help_requests").eq("status", "diproses"),
    head("posts"),
    head("quotes"),
    head("events"),
    head("contact_messages").eq("is_read", false),
  ]);

  return {
    baru: baru.count ?? 0,
    diproses: diproses.count ?? 0,
    posts: posts.count ?? 0,
    quotes: quotes.count ?? 0,
    events: events.count ?? 0,
    pesan: pesan.count ?? 0,
  };
}

export default async function AdminDashboard() {
  const supabase = await adminDb();
  const [stats, { data: recent }] = await Promise.all([
    counts(),
    supabase
      .from("help_requests")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const requests = (recent ?? []) as HelpRequest[];

  const cards = [
    { label: "Permohonan baru", value: stats.baru, href: "/admin/permohonan?status=baru", icon: "inbox", urgent: stats.baru > 0 },
    { label: "Sedang ditangani", value: stats.diproses, href: "/admin/permohonan?status=diproses", icon: "hands" },
    { label: "Pesan belum dibaca", value: stats.pesan, href: "/admin/pesan", icon: "mail" },
    { label: "Tulisan", value: stats.posts, href: "/admin/konten", icon: "book" },
    { label: "Kutipan", value: stats.quotes, href: "/admin/quotes", icon: "quote" },
    { label: "Event", value: stats.events, href: "/admin/event", icon: "calendar" },
  ] as const;

  return (
    <>
      <AdminPageHeader
        title="Ringkasan"
        description="Sekilas kondisi hari ini — mulai dari yang paling perlu ditanggapi."
        action={
          <ButtonLink href="/admin/konten/baru">
            <Icon.plus className="h-4 w-4" />
            Tulisan baru
          </ButtonLink>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {cards.map((c) => {
          const IconComp = Icon[c.icon as keyof typeof Icon];
          return (
            <Link key={c.label} href={c.href} className="group">
              <Card
                interactive
                className={`h-full p-5 ${"urgent" in c && c.urgent ? "border-maroon-300 bg-maroon-50" : ""}`}
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-maroon-50 text-maroon-700 transition-colors group-hover:bg-maroon-700 group-hover:text-sand-50">
                  <IconComp className="h-5 w-5" />
                </span>
                <p className="font-display mt-4 text-3xl font-semibold text-ink">{c.value}</p>
                <p className="mt-1 text-xs font-medium text-sand-700">{c.label}</p>
              </Card>
            </Link>
          );
        })}
      </div>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-ink">Permohonan terbaru</h2>
          <Link href="/admin/permohonan" className="text-sm font-semibold text-maroon-700">
            Lihat semua
          </Link>
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
                      <Badge tone={r.status === "baru" ? "gold" : r.status === "selesai" ? "green" : "sand"}>
                        {HELP_STATUS_LABEL[r.status]}
                      </Badge>
                      {r.urgency === "darurat" && <Badge tone="red">Darurat</Badge>}
                      {r.is_confidential && (
                        <Badge tone="maroon">
                          <Icon.shield className="h-3 w-3" />
                          Rahasia
                        </Badge>
                      )}
                    </div>
                    <p className="mt-2 font-medium text-ink">
                      {r.is_anonymous ? "Anonim" : r.name || "Tanpa nama"}
                      <span className="font-normal text-sand-600">
                        {" "}
                        · {HELP_CATEGORY_LABEL[r.category]}
                      </span>
                    </p>
                    <p className="mt-1 line-clamp-2 text-sm text-sand-700">
                      {r.is_confidential ? "🔒 Ditandai rahasia — buka untuk membaca." : r.message}
                    </p>
                    <p className="mt-2 text-xs text-sand-500">{formatDateTime(r.created_at)}</p>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <Card className="p-8 text-center">
            <p className="text-sand-700">Belum ada permohonan yang masuk.</p>
          </Card>
        )}
      </section>
    </>
  );
}
