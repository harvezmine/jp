import { CopyButton } from "@/components/copy-button";
import { Icon } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { ButtonLink, Container } from "@/components/ui";
import { site, waLink } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Ajakan singkat dengan informasi rekening yang mudah dibaca dan disalin. */
export function SupportSection({ className = "bg-paper" }: { className?: string }) {
  const { support } = site;
  const hasAccount = Boolean(support.bank && support.accountNumber && !/^0+$/.test(support.accountNumber));

  return (
    <section id="support" aria-labelledby="support-heading" className={cn("scroll-mt-20 py-14 sm:py-16", className)}>
      <Container size="wide">
        <Reveal>
          <div className="grid overflow-hidden rounded-3xl border border-sand-300/70 bg-cream shadow-warm md:grid-cols-2">
            <div className="flex flex-col items-start bg-maroon-900 p-7 sm:p-10 lg:p-12">
              <div className="mb-7 flex items-center gap-3 text-sand-200">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-sand-200/25" aria-hidden="true">
                  <Icon.hands className="h-5 w-5" />
                </span>
                <p className="text-xs font-medium tracking-[0.14em] uppercase">Dukungan pelayanan</p>
              </div>
              <h2 id="support-heading" className="max-w-sm font-display text-[1.75rem] font-semibold leading-snug text-cream sm:text-3xl lg:text-4xl">
                Untuk mendukung pelayanan <span className="text-gold-400">Janji Pengharapan</span>
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-sand-200">Terima kasih sudah mengambil bagian.</p>
            </div>

            <div className="flex min-w-0 flex-col justify-center p-7 sm:p-10 lg:p-12">
              {hasAccount ? (
                <div className="w-full">
                  <p className="border-b border-sand-300/70 pb-5 text-sm font-semibold leading-relaxed text-maroon-800">Bank {support.bank}</p>
                  <dl className="py-5">
                    <dt className="text-xs text-sand-700">Nomor rekening</dt>
                    <dd className="mt-1.5 text-[1.75rem] font-semibold tabular-nums tracking-[0.04em] text-ink sm:text-3xl lg:text-4xl">
                      {support.accountNumber}
                    </dd>
                    <dt className="sr-only">Atas nama</dt>
                    <dd className="mt-2 text-sm leading-relaxed text-sand-700">a.n. {support.accountName}</dd>
                  </dl>
                  <CopyButton value={support.accountNumber} label="Salin nomor rekening" className="w-full justify-center" />
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                  <ButtonLink
                    href={waLink(
                      "Halo, saya ingin mendukung pelayanan Janji Pengharapan. Boleh minta info rekeningnya?",
                    )}
                    external
                  >
                    {site.whatsapp && <Icon.whatsapp className="h-4 w-4" />}
                    Tanya info rekening
                  </ButtonLink>
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
