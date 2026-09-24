import { Icon } from "@/components/icons";
import { ButtonLink } from "@/components/ui";
import { crisis } from "@/lib/crisis";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Satu jalur pertolongan: WhatsApp tim JP. `row` untuk ruang lebar (footer),
 * `stack` untuk kolom sempit (sisi halaman pertolongan).
 *
 * Dulu blok ini berisi tiga baris nomor berbeda. Sekarang tujuannya satu, jadi
 * bentuknya pun satu ajakan: tiga baris yang isinya nomor sama persis cuma
 * membuat orang berhenti membaca.
 */
export function CrisisLine({
  tone = "light",
  layout = "stack",
  className,
}: {
  tone?: "light" | "dark";
  layout?: "row" | "stack";
  className?: string;
}) {
  const dark = tone === "dark";
  return (
    <div
      className={cn(
        "rounded-2xl p-5 sm:p-6",
        dark ? "bg-sand-50/[0.05] ring-1 ring-sand-50/12" : "border border-sand-300 bg-sand-100",
        className,
      )}
    >
      <div className={cn(layout === "row" && "sm:flex sm:items-center sm:justify-between sm:gap-6")}>
        <div>
          <p className={cn("flex items-center gap-2 font-semibold", dark ? "text-sand-50" : "text-maroon-900")}>
            <Icon.phone className={cn("h-4 w-4 shrink-0", dark ? "text-gold-400" : "text-maroon-600")} />
            Butuh pertolongan sekarang juga?
          </p>
          <p className={cn("mt-1.5 text-sm leading-relaxed", dark ? "text-sand-300/80" : "text-sand-700")}>
            Langsung hubungi tim kami lewat WhatsApp. Kamu tidak perlu menunggu formulir diproses.
          </p>
        </div>
        <ButtonLink
          href={crisis.contact.href}
          external
          variant={dark ? "light" : "primary"}
          className={cn("mt-4 w-full justify-center sm:w-auto", layout === "row" && "sm:mt-0 sm:shrink-0")}
        >
          {site.whatsapp && <Icon.whatsapp className="h-4 w-4" />}
          {crisis.contact.label}
        </ButtonLink>
      </div>
    </div>
  );
}
