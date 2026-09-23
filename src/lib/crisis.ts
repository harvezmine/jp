/**
 * Jalur pertolongan cepat, ditampilkan di footer, di formulir saat memilih
 * "Darurat", dan di halaman pertolongan.
 *
 * ⚠️ Sebelumnya di sini ada tiga jalur: 119 (gawat darurat & ambulans), 119 tekan 8
 * (konseling SEJIWA Kemenkes), dan healing119.id. Ketiganya dicabut atas permintaan
 * gereja pada 23 September 2026 dan diganti satu jalur: WhatsApp tim JP.
 *
 * Konsekuensinya sudah disampaikan dan diterima: situs ini tidak lagi memberi jalan
 * memanggil ambulans. Kalau ada yang ingin mengembalikan nomor resmi, sumbernya ada
 * di docs/audit-jp-tiga-pergumulan.md.
 */
import { site, waLink } from "./site";

export const crisis = {
  contact: {
    label: site.phoneDisplay || "WhatsApp tim JP",
    href: waLink("Halo Janji Pengharapan, saya butuh pertolongan sekarang."),
  },
  /**
   * Jawaban FAQ "kalau keadaannya mendesak". Dulu kalimat ini disalin persis di
   * tiga halaman (Ruang Doa, Ruang Cerita, Layanan), jadi sekali berubah harus
   * diubah di tiga tempat. Sekarang satu sumber.
   */
  formNote:
    `Formulir ini tidak dipantau setiap saat, jadi jangan menunggu balasannya kalau keadaannya mendesak. ` +
    `Langsung hubungi tim kami lewat WhatsApp di ${site.phoneDisplay || "nomor JP"}.`,
} as const;
