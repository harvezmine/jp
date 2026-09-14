import { Icon } from "@/components/icons";
import { crisis } from "@/lib/crisis";
import { cn } from "@/lib/utils";

const items = [
  { title: "Nyawa sedang terancam", action: `Telepon ${crisis.emergency.label}`, href: crisis.emergency.href },
  { title: "Butuh bicara sekarang", action: `Telepon ${crisis.counseling.label}`, href: crisis.counseling.href },
  { title: "Dukungan psikologis daring", action: crisis.online.label, href: crisis.online.href },
] as const;

/**
 * Nomor krisis yang selalu bisa dijangkau. `row` untuk ruang yang lebar (footer),
 * `stack` untuk kolom sempit (sisi halaman pertolongan).
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
      <p className={cn("flex items-center gap-2 font-semibold", dark ? "text-sand-50" : "text-maroon-900")}>
        <Icon.phone className={cn("h-4 w-4 shrink-0", dark ? "text-gold-400" : "text-maroon-600")} />
        Butuh pertolongan sekarang juga?
      </p>
      <ul className={cn("mt-3 grid gap-1.5", layout === "row" && "sm:grid-cols-3 sm:gap-3")}>
        {items.map((item) => {
          const external = item.href.startsWith("http");
          return (
            <li key={item.title}>
              <a
                href={item.href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className={cn(
                  "-mx-3 block rounded-xl px-3 py-2 transition-colors",
                  dark ? "hover:bg-sand-50/10" : "hover:bg-sand-50",
                )}
              >
                <span className={cn("block text-xs", dark ? "text-sand-300/75" : "text-sand-700")}>{item.title}</span>
                <span className={cn("mt-0.5 block font-semibold tabular-nums", dark ? "text-gold-400" : "text-maroon-700")}>
                  {item.action}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
      <p className={cn("mt-3 text-xs leading-relaxed", dark ? "text-sand-300/65" : "text-sand-700")}>
        Layanan resmi pemerintah. Formulir JP tidak dipantau setiap saat.
      </p>
    </div>
  );
}
