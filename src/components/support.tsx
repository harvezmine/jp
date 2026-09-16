import { CopyButton } from "@/components/copy-button";
import { Icon } from "@/components/icons";
import { Parallax, ParallaxImage } from "@/components/parallax";
import { Reveal } from "@/components/reveal";
import { ButtonLink, Container } from "@/components/ui";
import { photos } from "@/lib/photos";
import { site, waLink } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Yang ikut berjalan berkat support. Sengaja tidak menjanjikan bantuan materi. */
const uses = [
  { icon: Icon.hands, title: "Doa dan pendampingan", body: "Supaya tetap gratis bagi siapa pun yang datang." },
  { icon: Icon.play, title: "Renungan singkat", body: "Video dan tulisan pendek yang kami bagikan setiap minggu." },
  { icon: Icon.book, title: "Kelas di Ruang Belajar", body: "Untuk yang ingin terus bertumbuh." },
];

/** "0000000000" → "000 000 0000", supaya nomor rekening mudah dibaca. */
const formatAccount = (value: string) => value.replace(/^(\d{3})(\d{3})(\d+)$/, "$1 $2 $3");

export function SupportSection({ className = "bg-paper" }: { className?: string }) {
  const { support } = site;
  const hasAccount = Boolean(support.bank && support.accountNumber && !/^0+$/.test(support.accountNumber));

  return (
    <section id="support" className={cn("relative scroll-mt-20 overflow-hidden py-20 sm:py-28 lg:py-40", className)}>
      <Container size="wide">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <Reveal>
              <h2 className="text-display text-ink">
                Beri support untuk <span className="italic text-maroon-700">Janji Pengharapan.</span>
              </h2>
            </Reveal>
            <Reveal delay={80}>
              <p className="text-lead mt-5 max-w-md text-sand-700 sm:mt-6">
                Mau ikut ambil bagian? Kamu bisa memberi support lewat transfer. Doa dan pendampingan tetap gratis untuk
                siapa saja.
              </p>
            </Reveal>

            <ul className="mt-10 border-t border-sand-300/70 sm:mt-12">
              {uses.map((u, i) => (
                <Reveal
                  as="li"
                  key={u.title}
                  delay={120 + i * 80}
                  className="group flex items-center gap-5 border-b border-sand-300/70 py-5 sm:py-6"
                >
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-maroon-700 text-sand-50 shadow-warm transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-105">
                    <u.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-display text-xl font-semibold text-ink">{u.title}</p>
                    <p className="mt-1 leading-relaxed text-sand-700">{u.body}</p>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>

          <div className="relative mx-auto w-full max-w-xl lg:col-span-6 lg:max-w-none">
            <Parallax
              speed={-3}
              className="absolute inset-x-0 top-0 hidden aspect-[4/3] translate-x-4 -translate-y-4 rounded-[2rem] border border-maroon-200 sm:block"
            />
            <Reveal variant="curtain" duration={1100} className="relative">
              <ParallaxImage
                src={photos.support}
                alt="Tiga lilin menyala di dalam gelap"
                sizes="(min-width: 1024px) 45vw, 576px"
                strength={8}
                className="aspect-[4/3] rounded-[2rem] bg-sand-200"
              />
            </Reveal>

            {/* Kartu rekening, menumpuk di atas foto */}
            <Parallax speed={4} className="relative -mt-16 px-3 sm:-mt-28 sm:px-8">
              <Reveal delay={200}>
                <div className="bg-maroon-deep relative isolate overflow-hidden rounded-[1.75rem] p-6 text-sand-50 shadow-deep sm:p-8">
                  <div aria-hidden className="bg-grain pointer-events-none absolute inset-0 -z-10 opacity-[0.1]" />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-12 -top-12 -z-10 h-40 w-40 rounded-full bg-gold-400/20 blur-3xl"
                  />
                  {hasAccount ? (
                    <>
                      <p className="text-sm text-sand-200/75">Transfer ke {support.bank}</p>
                      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
                        <div>
                          <p className="font-display text-[1.75rem] font-semibold tabular-nums tracking-wide sm:text-4xl">
                            {formatAccount(support.accountNumber)}
                          </p>
                          <p className="mt-1 text-sm text-sand-200/75">a.n. {support.accountName}</p>
                        </div>
                        <CopyButton value={support.accountNumber} label="Salin nomor" />
                      </div>
                      <div className="mt-6 flex flex-col gap-4 border-t border-sand-50/12 pt-6 sm:flex-row sm:items-center sm:justify-between">
                        <p className="max-w-60 text-sm leading-relaxed text-sand-200/75">
                          Sudah transfer? Kabari kami lewat WhatsApp.
                        </p>
                        <ButtonLink
                          href={waLink("Halo, saya sudah kirim support untuk Janji Pengharapan.")}
                          external
                          variant="light"
                          className="shrink-0 self-start sm:self-auto"
                        >
                          <Icon.whatsapp className="h-4 w-4" />
                          Kabari tim
                        </ButtonLink>
                      </div>
                    </>
                  ) : (
                    <>
                      <h3 className="font-display text-2xl text-sand-50">Ingin memberi support?</h3>
                      <p className="mt-3 text-sm leading-7 text-sand-200/85">
                        Tanya info rekening ke tim JP. Kami balas secepatnya.
                      </p>
                      <ButtonLink
                        href={waLink("Halo, saya ingin memberi support untuk Janji Pengharapan. Boleh minta info rekeningnya?")}
                        external
                        variant="light"
                        className="mt-6"
                      >
                        {site.whatsapp && <Icon.whatsapp className="h-4 w-4" />}
                        Tanya info rekening
                      </ButtonLink>
                    </>
                  )}
                </div>
              </Reveal>
            </Parallax>
          </div>
        </div>
      </Container>
    </section>
  );
}
