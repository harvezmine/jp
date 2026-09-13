import { AdminPageHeader } from "@/components/admin/page-header";
import { QuoteManager } from "@/components/admin/quote-manager";
import { adminDb } from "@/lib/admin-auth";
import type { Quote } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminQuotesPage() {
  const supabase = await adminDb();
  const { data } = await supabase.from("quotes").select("*").order("created_at", { ascending: false });

  return (
    <>
      <AdminPageHeader
        title="Kutipan"
        description="Kalimat pendek dan ayat yang tampil di beranda serta tab Kutipan."
      />
      <QuoteManager quotes={(data ?? []) as Quote[]} />
    </>
  );
}
