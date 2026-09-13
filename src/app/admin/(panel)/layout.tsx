import { AdminShell } from "@/components/admin/shell";
import { adminDb } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const supabase = await adminDb();
  const { count } = await supabase
    .from("help_requests")
    .select("id", { count: "exact", head: true })
    .eq("status", "baru");

  return <AdminShell pendingCount={count ?? 0}>{children}</AdminShell>;
}
