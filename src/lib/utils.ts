/** Gabung className, buang yang falsy. */
export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

const TZ = "Asia/Jakarta";

export function formatDate(iso: string | null | undefined) {
  if (!iso) return "";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: TZ,
  }).format(new Date(iso));
}

export function formatDateShort(iso: string | null | undefined) {
  if (!iso) return "";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: TZ,
  }).format(new Date(iso));
}

export function formatTime(iso: string | null | undefined) {
  if (!iso) return "";
  return (
    new Intl.DateTimeFormat("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: TZ,
    }).format(new Date(iso)) + " WIB"
  );
}

export function formatDateTime(iso: string | null | undefined) {
  if (!iso) return "";
  return `${formatDate(iso)} · ${formatTime(iso)}`;
}

/** "12 Mar" dipecah untuk kartu tanggal event. */
export function dateParts(iso: string) {
  const d = new Date(iso);
  return {
    day: new Intl.DateTimeFormat("id-ID", { day: "numeric", timeZone: TZ }).format(d),
    month: new Intl.DateTimeFormat("id-ID", { month: "short", timeZone: TZ }).format(d),
    weekday: new Intl.DateTimeFormat("id-ID", { weekday: "long", timeZone: TZ }).format(d),
  };
}

export function readingTime(body: string | null | undefined) {
  if (!body) return 1;
  return Math.max(1, Math.round(body.trim().split(/\s+/).length / 200));
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Kode referensi permohonan, mis. JP-K4F92X — dipakai pemohon untuk menanyakan status. */
export function makeRefCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return `JP-${out}`;
}

/** ISO → nilai <input type="datetime-local"> dalam WIB — hasilnya sama di server maupun browser. */
export function toWibInput(iso: string | null | undefined) {
  if (!iso) return "";
  // Locale sv-SE memformat tanggal sebagai "YYYY-MM-DD HH:MM".
  return new Intl.DateTimeFormat("sv-SE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: TZ,
  })
    .format(new Date(iso))
    .replace(" ", "T");
}

/**
 * Nilai <input type="datetime-local"> (tanpa zona waktu) → ISO, dibaca sebagai WIB.
 * Tanpa ini `new Date()` memakai zona waktu server: di VPS ber-UTC, acara jam
 * 19.00 tersimpan sebagai 02.00 WIB keesokan harinya. WIB tidak mengenal DST.
 */
export function fromWibInput(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) return null;
  const date = new Date(`${value}:00+07:00`);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}
