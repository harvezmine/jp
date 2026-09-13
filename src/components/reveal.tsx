import type { CSSProperties, ElementType, ReactNode } from "react";

const animations = {
  up: "fade-up",
  down: "fade-down",
  left: "fade-right",
  right: "fade-left",
  fade: "fade",
  scale: "zoom-in-up",
  zoom: "zoom-out",
  /** Tirai dari bawah, cocok untuk foto. Didefinisikan di globals.css. */
  curtain: "curtain",
} as const;

export type RevealVariant = keyof typeof animations;

type RevealProps = {
  children: ReactNode;
  variant?: RevealVariant;
  /** Milidetik. AOS hanya mengenal kelipatan 50, jadi nilai dibulatkan. */
  delay?: number;
  duration?: number;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
};

const toStep = (ms: number) => Math.min(3000, Math.max(0, Math.round(ms / 50) * 50));

/**
 * Animasi masuk saat scroll lewat AOS. Komponen ini hanya menulis atribut
 * data-aos, jadi tetap server component; AOS sendiri dijalankan oleh
 * MotionProvider (components/motion.tsx).
 */
export function Reveal({
  children,
  variant = "up",
  delay = 0,
  duration,
  as: Tag = "div",
  className,
  style,
}: RevealProps) {
  return (
    <Tag
      data-aos={animations[variant]}
      data-aos-delay={delay ? toStep(delay) : undefined}
      data-aos-duration={duration ? toStep(duration) : undefined}
      className={className}
      style={style}
    >
      {children}
    </Tag>
  );
}
