import { CopyButton } from "@/components/copy-button";
import { Icon } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { ButtonLink, Container } from "@/components/ui";
import { site, waLink } from "@/lib/site";
import { cn } from "@/lib/utils";

/** "0000000000" → "000 000 0000", supaya nomor rekening mudah dibaca. */
const formatAccount = (value: string) => value.replace(/^(\d{3})(\d{3})(\d+)$/, "$1 $2 $3");

/**
 * Sengaja kecil: satu baris ajakan di akhir halaman. Pelayanan JP gratis, jadi
 * bagian ini tidak boleh terasa seperti meminta-minta.
 */
export function SupportSection({ className = "bg-paper" }: { className?: string }) {
  const { support } = site;
  const hasAccount = Boolean(support.bank && support.accountNumber && !/^0+$/.test(support.accountNumber));

  return (
    <section id="support" className={cn("scroll-mt-20 py-14 sm:py-16", className)}>
      <Container size="wide">
        <Reveal>
          <div className="grid gap-6 rounded-[1.75rem] border border-sand-300/70 bg-cream p-6 sm:p-8 lg:grid-cols-12 lg:items-center lg:gap-10">
            <div className="lg:col-span-7">
              <h2 className="font-display text-2xl font-semibold leading-snug text-ink sm:text-3xl">
                Beri support untuk <span className="italic text-maroon-700">Janji Pengharapan.</span>
              </h2>
              <p className="mt-3 max-w-xl leading-relaxed text-sand-700">
                Doa dan pendampingan tetap gratis untuk siapa saja. Kalau kamu ingin ikut ambil bagian, ini salah satu
                caranya.
              </p>
            </div>

            <div className="lg:col-span-5">
              {hasAccount ? (
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-sand-100 p-5 lg:justify-end">
                  <div>
                    <p className="text-xs text-sand-700">Transfer ke {support.bank}</p>
                    <p className="font-display mt-1 text-xl font-semibold tabular-nums tracking-wide text-ink">
                      {formatAccount(support.accountNumber)}
                    </p>
                    <p className="mt-0.5 text-xs text-sand-700">a.n. {support.accountName}</p>
                  </div>
                  <CopyButton value={support.accountNumber} label="Salin nomor" />
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                  <ButtonLink
                    href={waLink(
                      "Halo, saya ingin memberi support untuk Janji Pengharapan. Boleh minta info rekeningnya?",
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
