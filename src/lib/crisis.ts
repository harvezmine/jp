/**
 * Nomor krisis resmi di Indonesia, dicek 15 September 2026 (sumber ada di
 * docs/audit-jp-tiga-pergumulan.md). Orang yang datang ke JP sering sedang di titik
 * terendah, jadi nomor ini tampil di footer, di formulir saat memilih "Darurat", dan
 * di halaman pertolongan.
 *
 * - 119: gawat darurat dan ambulans, untuk saat nyawa sedang terancam.
 * - 119 lalu tekan 8: SEJIWA, konseling psikologis Kemenkes. Layanan ini tidak
 *   menangani pertolongan pertama percobaan bunuh diri, jadi 119 selalu disebut dulu.
 * - healing119.id: dukungan psikologis awal, termasuk untuk pikiran bunuh diri.
 */
export const crisis = {
  emergency: { label: "119", href: "tel:119" },
  counseling: { label: "119 lalu tekan 8", href: "tel:119" },
  online: { label: "healing119.id", href: "https://healing119.id" },
} as const;
