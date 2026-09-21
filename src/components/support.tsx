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
          <div className="grid gap-7 rounded-2xl border border-sand-300/70 bg-cream p-6 sm:p-10 lg:grid-cols-2 lg:items-center lg:gap-12">
            <div>
              <h2 id="support-heading" className="max-w-md font-display text-2xl font-semibold leading-snug text-ink sm:text-3xl">
                Untuk mendukung pelayanan <span className="text-maroon-700">Janji Pengharapan</span>
              </h2>
            </div>

            <div className="min-w-0 border-t border-sand-300/70 pt-7 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-12">
              {hasAccount ? (
                <div>
                  <p className="text-sm font-medium text-sand-700">Bank {support.bank}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-3">
                    <p className="text-2xl font-semibold tabular-nums tracking-wide text-ink sm:text-3xl">
                      <span className="sr-only">Nomor rekening: </span>
                      {support.accountNumber}
                    </p>
                    <CopyButton value={support.accountNumber} label="Salin nomor" />
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-sand-700">a.n. {support.accountName}</p>
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
