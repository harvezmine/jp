import type { SVGProps } from "react";

/**
 * Ikon inline, tidak memakai library ikon supaya bundle tetap kecil.
 * Semua memakai stroke currentColor agar ikut warna teks induknya.
 */
type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export const Icon = {
  menu: (p: IconProps) => (
    <svg {...base} {...p}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
  ),
  close: (p: IconProps) => (
    <svg {...base} {...p}><path d="M6 6l12 12M18 6L6 18" /></svg>
  ),
  arrowRight: (p: IconProps) => (
    <svg {...base} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
  ),
  arrowUpRight: (p: IconProps) => (
    <svg {...base} {...p}><path d="M7 17L17 7M8 7h9v9" /></svg>
  ),
  arrowLeft: (p: IconProps) => (
    <svg {...base} {...p}><path d="M19 12H5M11 18l-6-6 6-6" /></svg>
  ),
  heart: (p: IconProps) => (
    <svg {...base} {...p}><path d="M12 20s-7-4.4-7-9.3A4.2 4.2 0 0 1 12 8a4.2 4.2 0 0 1 7 2.7C19 15.6 12 20 12 20Z" /></svg>
  ),
  hands: (p: IconProps) => (
    <svg {...base} {...p}><path d="M12 3v8M9 5.5 12 3l3 2.5" /><path d="M5 12v3a7 7 0 0 0 14 0v-3" /><path d="M5 12a2 2 0 0 1 4 0M15 12a2 2 0 0 1 4 0" /></svg>
  ),
  book: (p: IconProps) => (
    <svg {...base} {...p}><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H19v15H6.5A2.5 2.5 0 0 0 4 20.5Z" /><path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H19v3H6.5" /></svg>
  ),
  users: (p: IconProps) => (
    <svg {...base} {...p}><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0 1 12 0" /><path d="M16 5.5a3 3 0 0 1 0 5M17.5 20a6 6 0 0 0-2-4.5" /></svg>
  ),
  calendar: (p: IconProps) => (
    <svg {...base} {...p}><rect x="3" y="5" width="18" height="16" rx="2.5" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>
  ),
  clock: (p: IconProps) => (
    <svg {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
  ),
  pin: (p: IconProps) => (
    <svg {...base} {...p}><path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" /></svg>
  ),
  mail: (p: IconProps) => (
    <svg {...base} {...p}><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m4 7 8 6 8-6" /></svg>
  ),
  phone: (p: IconProps) => (
    <svg {...base} {...p}><path d="M5 3h3l2 5-2.5 1.5a12 12 0 0 0 5 5L14 12l5 2v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 3 5.2 2 2 0 0 1 5 3Z" /></svg>
  ),
  whatsapp: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.2.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.6-1.2l-.1-.5-.7-1.7c-.2-.4-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.9 11.9 0 0 0 4.6 4c2.2.9 2.2.6 2.6.5a2.6 2.6 0 0 0 1.7-1.2 2.1 2.1 0 0 0 .1-1.2Z" />
    </svg>
  ),
  instagram: (p: IconProps) => (
    <svg {...base} {...p}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" /></svg>
  ),
  tiktok: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
      <path d="M16.5 2h-3v13.2a2.6 2.6 0 1 1-2-2.5V9.6a5.7 5.7 0 1 0 5 5.6V9a7 7 0 0 0 4 1.3V7.2a4 4 0 0 1-4-4Z" />
    </svg>
  ),
  youtube: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
      <path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15V9l5.2 3Z" />
    </svg>
  ),
  play: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}><path d="M8 5.5v13l11-6.5Z" /></svg>
  ),
  quote: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
      <path d="M9.5 5C6 6.3 4 9.2 4 12.8V19h6.6v-6.6H7.3c0-2 .9-3.6 2.9-4.6Zm10 0C16 6.3 14 9.2 14 12.8V19h6.6v-6.6h-3.3c0-2 .9-3.6 2.9-4.6Z" />
    </svg>
  ),
  shield: (p: IconProps) => (
    <svg {...base} {...p}><path d="M12 3l7 3v5.5c0 4.3-3 8-7 9.5-4-1.5-7-5.2-7-9.5V6Z" /><path d="m9 12 2 2 4-4" /></svg>
  ),
  lock: (p: IconProps) => (
    <svg {...base} {...p}><rect x="5" y="10.5" width="14" height="10" rx="2.5" /><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5M12 14.5v2" /></svg>
  ),
  check: (p: IconProps) => (
    <svg {...base} {...p}><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
  ),
  chevronDown: (p: IconProps) => (
    <svg {...base} {...p}><path d="m6 9 6 6 6-6" /></svg>
  ),
  spark: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
      <path d="M12 2l1.9 6.1L20 10l-6.1 1.9L12 18l-1.9-6.1L4 10l6.1-1.9Z" />
    </svg>
  ),
  search: (p: IconProps) => (
    <svg {...base} {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
  ),
  edit: (p: IconProps) => (
    <svg {...base} {...p}><path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16Z" /><path d="m14 6 4 4" /></svg>
  ),
  trash: (p: IconProps) => (
    <svg {...base} {...p}><path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13" /></svg>
  ),
  plus: (p: IconProps) => (
    <svg {...base} {...p}><path d="M12 5v14M5 12h14" /></svg>
  ),
  logout: (p: IconProps) => (
    <svg {...base} {...p}><path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3" /><path d="m15 8 4 4-4 4M19 12H9" /></svg>
  ),
  inbox: (p: IconProps) => (
    <svg {...base} {...p}><path d="M4 13h4l1.5 3h5L16 13h4" /><path d="M5.5 5h13l1.5 8v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4Z" /></svg>
  ),
  image: (p: IconProps) => (
    <svg {...base} {...p}><rect x="3" y="4" width="18" height="16" rx="2.5" /><circle cx="8.5" cy="9.5" r="1.5" /><path d="m4 17 5-4 4 3 3-2 4 3" /></svg>
  ),
  gift: (p: IconProps) => (
    <svg {...base} {...p}><rect x="3" y="9" width="18" height="12" rx="2" /><path d="M3 13h18M12 9v12" /><path d="M12 9S10.5 3 8 4.5 10 9 12 9Zm0 0s1.5-6 4-4.5S14 9 12 9Z" /></svg>
  ),
  copy: (p: IconProps) => (
    <svg {...base} {...p}><rect x="9" y="9" width="11" height="11" rx="2.5" /><path d="M5 15V6.5A2.5 2.5 0 0 1 7.5 4H15" /></svg>
  ),
} as const;
