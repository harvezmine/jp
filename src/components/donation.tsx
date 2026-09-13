import { CopyButton } from "@/components/copy-button";
import { Icon } from "@/components/icons";
import { ParallaxImage } from "@/components/parallax";
import { Reveal } from "@/components/reveal";
import { ButtonLink, Container } from "@/components/ui";
import { photos } from "@/lib/photos";
import { site, waLink } from "@/lib/site";
import { cn } from "@/lib/utils";

const uses = [
  {
    icon: Icon.gift,
    title: "Bantuan kebutuhan pokok",
    body: "Sembako, obat, dan biaya mendesak untuk keluarga yang sedang kesulitan.",
  },
  {
    icon: Icon.users,
    title: "Konseling tanpa biaya",
    body: "Supaya siapa pun bisa didampingi konselor, berapa pun kemampuannya.",
  },
  {
    icon: Icon.play,
    title: "Konten dan acara",
    body: "Produksi podcast, siaran langsung, dan acara di Ruang Pengharapan.",
  },
];

/** "0000000000" → "000 000 0000", supaya nomor rekening mudah dibaca. */
const formatAccount = (value: string) => value.replace(/^(\d{3})(\d{3})(\d+)$/, "$1 $2 $3");

export function DonationSection({ className = "bg-paper" }: { className?: string }) {
  const { donation } = site;

  return (
    <section id="donasi" className={cn("relative overflow-hidden py-24 sm:py-32 lg:py-40", className)}>
      <Container size="wide">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <Reveal>
              <h2 className="text-display text-ink">
                Ikut menolong <span className="italic text-maroon-700">lewat donasi.</span>
              </h2>
            </Reveal>
            <Reveal delay={80}>
              <p className="text-lead mt-6 max-w-xl text-sand-700">
                Semua pelayanan di Janji Pengharapan gratis untuk yang membutuhkan. Itu bisa terjadi
                karena ada orang-orang yang ikut memberi.
              </p>
            </Reveal>

            <ul className="mt-12 border-t border-sand-300/70">
              {uses.map((u, i) => (
                <Reveal
                  as="li"
                  key={u.title}
                  delay={120 + i * 80}
                  className="flex gap-5 border-b border-sand-300/70 py-6"
                >
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-maroon-700 text-sand-50">
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

          <div className="lg:col-span-6">
            <Reveal variant="curtain" duration={1100}>
              <ParallaxImage
                src={photos.donation}
                alt="Anak-anak tersenyum dan melambaikan tangan ke arah kamera"
                sizes="(min-width: 1024px) 45vw, 100vw"
                strength={8}
                className="aspect-[4/3] rounded-[2rem] bg-sand-200"
              />
            </Reveal>

            {/* Kartu rekening, menumpuk di atas foto */}
            <Reveal delay={200} className="relative -mt-20 px-3 sm:-mt-28 sm:px-8">
              <div className="bg-maroon-deep relative isolate overflow-hidden rounded-[1.75rem] p-6 text-sand-50 shadow-deep sm:p-8">
                <div aria-hidden className="bg-grain pointer-events-none absolute inset-0 -z-10 opacity-[0.1]" />
                <p className="text-sm text-sand-200/75">Transfer ke rekening {donation.bank}</p>
                <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="font-display text-3xl font-semibold tabular-nums tracking-wide sm:text-4xl">
                      {formatAccount(donation.accountNumber)}
                    </p>
                    <p className="mt-1 text-sm text-sand-200/75">a.n. {donation.accountName}</p>
                  </div>
                  <CopyButton value={donation.accountNumber} label="Salin nomor" />
                </div>
                <div className="mt-6 flex flex-col gap-4 border-t border-sand-50/12 pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <p className="max-w-xs text-sm leading-relaxed text-sand-200/75">
                    Sudah transfer? Kirim buktinya lewat WhatsApp supaya bisa kami catat.
                  </p>
                  <ButtonLink
                    href={waLink("Halo, saya sudah berdonasi untuk Janji Pengharapan. Ini bukti transfernya.")}
                    external
                    variant="light"
                    className="shrink-0"
                  >
                    <Icon.whatsapp className="h-4 w-4" />
                    Konfirmasi donasi
                  </ButtonLink>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
