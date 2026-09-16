import type { ReactNode } from "react";

import { CrisisLine } from "@/components/crisis-line";
import { HelpForm } from "@/components/help-form";
import { Reveal } from "@/components/reveal";
import { Container } from "@/components/ui";
import { cn } from "@/lib/utils";

function FormLayout({
  id,
  title,
  lead,
  aside,
  crisisOnMobile = false,
  className,
  children,
}: {
  id: string;
  title: ReactNode;
  lead: string;
  aside?: ReactNode;
  /** Formulir tanpa pertanyaan urgensi wajib menampilkan nomor krisis juga di HP. */
  crisisOnMobile?: boolean;
  className: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={cn("scroll-mt-20 overflow-clip py-20 sm:py-28 lg:py-36", className)}>
      <Container size="wide">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="min-w-0 lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <Reveal>
                <h2 className="text-display text-ink">{title}</h2>
              </Reveal>
              <Reveal delay={100}>
                <p className="text-lead mt-5 max-w-sm text-sand-700">{lead}</p>
              </Reveal>
              {aside}
              <CrisisLine className="mt-10 hidden lg:block" />
            </div>
          </div>
          <div className="min-w-0 lg:col-span-8">
            <div className="form-surface rounded-[1.75rem] p-5 sm:p-8 lg:p-10">{children}</div>
            {crisisOnMobile && <CrisisLine className="mt-6 lg:hidden" />}
          </div>
        </div>
      </Container>
    </section>
  );
}

/** Formulir khusus Ruang Doa. Tautan masuk: /ruang-doa#kirim-doa. */
export function PrayerFormSection({ className = "bg-cream" }: { className?: string }) {
  return (
    <FormLayout
      id="kirim-doa"
      className={className}
      crisisOnMobile
      title={
        <>
          Tulis <span className="italic text-maroon-700">pokok doamu.</span>
        </>
      }
      lead="Tim pendoa akan mendoakannya. Kamu boleh mengirim tanpa nama."
      aside={
        <Reveal delay={150}>
          <figure className="mt-8 rounded-2xl bg-sand-100 p-6">
            <blockquote className="font-display text-lg italic leading-snug text-maroon-900">
              &ldquo;Nyatakanlah dalam segala hal keinginanmu kepada Allah dalam doa dan permohonan dengan ucapan
              syukur.&rdquo;
            </blockquote>
            <figcaption className="mt-3 text-sm font-semibold text-maroon-600">Filipi 4:6</figcaption>
          </figure>
        </Reveal>
      }
    >
      <HelpForm source="doa" />
    </FormLayout>
  );
}

/** Formulir khusus Ruang Cerita. Tautan masuk: /ruang-cerita#ceritakan. */
export function StoryFormSection({ className = "bg-cream" }: { className?: string }) {
  return (
    <FormLayout
      id="ceritakan"
      className={className}
      title={
        <>
          Ceritakan <span className="italic text-maroon-700">pelan-pelan.</span>
        </>
      }
      lead="Tulis sebatas yang nyaman. Kamu juga bisa memilih pendamping perempuan atau laki-laki."
    >
      <HelpForm source="cerita" />
    </FormLayout>
  );
}

/** Formulir umum di akhir beranda, untuk yang belum tahu harus ke ruang mana. */
export function GeneralFormSection({ className = "bg-cream" }: { className?: string }) {
  return (
    <FormLayout
      id="cerita"
      className={className}
      title={
        <>
          Ceritakan <span className="italic text-maroon-700">di sini saja.</span>
        </>
      }
      lead="Belum tahu harus mulai dari ruang mana? Tulis saja di sini. Singkat pun tidak apa-apa."
    >
      <HelpForm />
    </FormLayout>
  );
}
