import { AdminPageHeader } from "@/components/admin/page-header";
import { DeleteButton } from "@/components/admin/delete-button";
import { Icon } from "@/components/icons";
import { Badge, Card, EmptyState } from "@/components/ui";
import { adminDb } from "@/lib/admin-auth";
import { deleteMessage, markMessageRead } from "@/app/actions/admin";
import type { ContactMessage } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminPesanPage() {
  const supabase = await adminDb();
  const { data } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  const messages = (data ?? []) as ContactMessage[];

  return (
    <>
      <AdminPageHeader
        title="Pesan Masuk"
        description="Pesan dari formulir di halaman Kontak."
      />

      {messages.length ? (
        <ul className="space-y-3">
          {messages.map((m) => (
            <li key={m.id}>
              <Card className={`p-4 sm:p-5 ${m.is_read ? "" : "border-maroon-300 bg-maroon-50"}`}>
                <div className="flex flex-wrap items-center gap-2">
                  {!m.is_read && <Badge tone="gold">Belum dibaca</Badge>}
                  <span className="text-xs text-sand-500">{formatDateTime(m.created_at)}</span>
                </div>

                <p className="mt-2 font-medium text-ink">
                  {m.name}
                  {m.subject && <span className="font-normal text-sand-600"> · {m.subject}</span>}
                </p>
                <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-sand-800">
                  {m.message}
                </p>

                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-sand-600">
                  {m.email && (
                    <a href={`mailto:${m.email}`} className="inline-flex items-center gap-1.5 hover:text-maroon-700">
                      <Icon.mail className="h-3.5 w-3.5" />
                      {m.email}
                    </a>
                  )}
                  {m.phone && (
                    <a
                      href={`https://wa.me/${m.phone.replace(/\D/g, "").replace(/^0/, "62")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 hover:text-maroon-700"
                    >
                      <Icon.whatsapp className="h-3.5 w-3.5" />
                      {m.phone}
                    </a>
                  )}
                </div>

                <div className="mt-4 flex items-center gap-2 border-t border-sand-200 pt-3">
                  <form action={markMessageRead}>
                    <input type="hidden" name="id" value={m.id} />
                    <input type="hidden" name="next" value={m.is_read ? "false" : "true"} />
                    <button
                      type="submit"
                      className="inline-flex h-9 items-center gap-1.5 rounded-full bg-maroon-50 px-3 text-xs font-semibold text-maroon-700"
                    >
                      <Icon.check className="h-4 w-4" />
                      {m.is_read ? "Tandai belum dibaca" : "Tandai sudah dibaca"}
                    </button>
                  </form>
                  <span className="ml-auto">
                    <DeleteButton action={deleteMessage} id={m.id} />
                  </span>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          title="Belum ada pesan"
          description="Pesan dari halaman Kontak akan muncul di sini."
        />
      )}
    </>
  );
}
