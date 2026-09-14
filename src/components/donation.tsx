import { CopyButton } from "@/components/copy-button";
import { Icon } from "@/components/icons";
import { Parallax, ParallaxImage } from "@/components/parallax";
import { Reveal } from "@/components/reveal";
import { ButtonLink, Container } from "@/components/ui";
import { photos } from "@/lib/photos";
import { site, waLink } from "@/lib/site";
import { cn } from "@/lib/utils";

const uses = [
  {
    icon: Icon.gift,
    title: "Bantuan kebutuhan pokok",
    body: "Sembako, obat, dan biaya mendesak untuk yang sedang kesulitan.",
  },
  { icon: Icon.users, title: "Konseling gratis", body: "Supaya siapa pun bisa didampingi konselor." },
  { icon: Icon.play, title: "Konten dan acara", body: "Renungan dan acara di Ruang Pengharapan." },
];

/** "0000000000" → "000 000 0000", supaya nomor rekening mudah dibaca. */
const formatAccount = (value: string) => value.replace(/^(\d{3})(\d{3})(\d+)$/, "$1 $2 $3");

export function DonationSection({ className = "bg-paper" }: { className?: string }) {
  const { donation } = site;
  const hasAccount = Boolean(donation.bank && donation.accountNumber && !/^0+$/.test(donation.accountNumber));

  return (
    <section id="donasi" className={cn("relative overflow-hidden py-20 sm:py-28 lg:py-40", className)}>
      <Container size="wide">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <Reveal>
              <h2 className="text-display text-ink">
                Ikut menolong <span className="italic text-maroon-700">lewat donasi.</span>
              </h2>
            </Reveal>
            <Reveal delay={80}>
              <p className="text-lead mt-5 max-w-md text-sand-700 sm:mt-6">
                Dukunganmu membantu kami hadir bagi lebih banyak orang. Doa dan pendampingan tetap terbuka, dengan atau
                tanpa donasi.
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
                src={photos.donation}
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
                      <p className="text-sm text-sand-200/75">Transfer ke {donation.bank}</p>
                      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
                        <div>
                          <p className="font-display text-[1.75rem] font-semibold tabular-nums tracking-wide sm:text-4xl">
                            {formatAccount(donation.accountNumber)}
                          </p>
                          <p className="mt-1 text-sm text-sand-200/75">a.n. {donation.accountName}</p>
                        </div>
                        <CopyButton value={donation.accountNumber} label="Salin nomor" />
                      </div>
                      <div className="mt-6 flex flex-col gap-4 border-t border-sand-50/12 pt-6 sm:flex-row sm:items-center sm:justify-between">
                        <p className="max-w-60 text-sm leading-relaxed text-sand-200/75">
                          Sudah berdonasi? Kamu bisa mengabari tim melalui halaman kontak.
                        </p>
                        <ButtonLink
                          href={waLink("Halo, saya sudah berdonasi untuk Janji Pengharapan. Ini bukti transfernya.")}
                          external
                          variant="light"
                          className="shrink-0 self-start sm:self-auto"
                        >
                          <Icon.whatsapp className="h-4 w-4" />
                          Konfirmasi donasi
                        </ButtonLink>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-gold-400">Berbagi pengharapan</p>
                      <h3 className="font-display mt-3 text-2xl text-sand-50">Ingin ikut mendukung?</h3>
                      <p className="mt-3 text-sm leading-7 text-sand-200/85">
                        Hubungi tim JP untuk informasi rekening dan cara berdonasi.
                      </p>
                      <ButtonLink href="/kontak" variant="light" className="mt-6">
                        Tanya cara berdonasi <Icon.arrowRight className="h-4 w-4" />
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
