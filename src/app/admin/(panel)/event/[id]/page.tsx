import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/page-header";
import { EventEditor } from "@/components/admin/event-editor";
import { adminDb } from "@/lib/admin-auth";
import type { JPEvent } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await adminDb();
  const { data } = await supabase.from("events").select("*").eq("id", id).maybeSingle();

  if (!data) notFound();

  return (
    <>
      <AdminPageHeader title="Ubah event" backHref="/admin/event" />
      <EventEditor event={data as JPEvent} />
    </>
  );
}
