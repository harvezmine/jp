import { AdminPageHeader } from "@/components/admin/page-header";
import { ServiceManager } from "@/components/admin/service-manager";
import { adminDb } from "@/lib/admin-auth";
import type { Service } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminLayananPage() {
  const supabase = await adminDb();
  const { data } = await supabase.from("services").select("*").order("sort_order");

  return (
    <>
      <AdminPageHeader
        title="Layanan"
        description="Daftar layanan yang tampil di halaman Layanan dan beranda."
      />
      <ServiceManager services={(data ?? []) as Service[]} />
    </>
  );
}
