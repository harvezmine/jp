"use client";

import { useEffect } from "react";

const order = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/**
 * Menandai hari ini (zona waktu Jakarta) di kalender mingguan dengan menambah
 * kelas `is-today` ke elemen ber-[data-weekday]. Dijalankan di browser supaya
 * halaman yang dirender statis tetap menunjuk hari yang benar.
 */
export function TodayMarker() {
  useEffect(() => {
    const name = new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      timeZone: "Asia/Jakarta",
    }).format(new Date());
    const index = order.indexOf(name);
    document
      .querySelectorAll<HTMLElement>(`[data-weekday="${index}"]`)
      .forEach((el) => el.classList.add("is-today"));
  }, []);

  return null;
}
