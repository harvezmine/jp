import { startTransition, type FormEvent } from "react";

/**
 * React 19 mengosongkan field form yang tidak dikontrol setiap kali prop
 * `action` selesai — termasuk saat server mengembalikan pesan error, sehingga
 * isian pengurus (tanggal, deskripsi, lokasi, …) hilang dan harus diketik ulang.
 * Mengirim lewat onSubmit menghindari reset itu; `pending` tetap berjalan.
 */
export function submitKeepingValues(dispatch: (formData: FormData) => void) {
  return (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => dispatch(formData));
  };
}
