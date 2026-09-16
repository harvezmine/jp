/**
 * Foto sementara dari Unsplash (bebas dipakai) supaya desain bisa dinilai.
 * Ganti dengan foto kegiatan JP yang asli: simpan file di public/images/jp/,
 * lalu ubah nilainya menjadi "/images/jp/nama-file.jpg".
 */
const unsplash = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=2000&q=80`;

export const photos = {
  hero: unsplash("1484627147104-f5197bcd6651"),

  aboutTable: unsplash("1528605248644-14dd04022da1"),
  aboutPrayer: unsplash("1609234656388-0ff363383899"),
  aboutFriends: unsplash("1529156069898-49953e39b3ac"),
  aboutHands: unsplash("1437603568260-1950d3ca6eab"),

  ruangHope: unsplash("1438232992991-995b7058bbb3"),
  // Frame asli dari reel Instagram JP, dipotong di atas judul yang tertanam di video.
  ruangHopeDetail: "/images/jp/insight-studio.jpg",
  ruangPrayer: unsplash("1478147427282-58a87a120781"),
  ruangPrayerDetail: unsplash("1602523961358-f9f03dd557db"),
  ruangStory: unsplash("1508963493744-76fce69379c0"),
  ruangStoryDetail: unsplash("1604881991720-f91add269bed"),
  ruangLearn: unsplash("1523240795612-9a054b0db644"),
  ruangLearnDetail: unsplash("1531545514256-b1400bc00f31"),

  help: unsplash("1544027993-37dbfe43562a"),
  // Sengaja simbolis dan tanpa wajah orang: foto anak-anak sebelumnya mengesankan
  // mereka penerima bantuan JP, dan JP tidak menyalurkan bantuan ekonomi secara khusus.
  support: unsplash("1602523961358-f9f03dd557db"),
  quotes: unsplash("1508672019048-805c876b67e2"),
  invite: unsplash("1496275068113-fff8c90750d1"),

  heroAbout: unsplash("1511632765486-a01980e01a18"),
  heroServices: unsplash("1531206715517-5c0ba140b2b8"),
  heroContent: unsplash("1445445290350-18a3b86e0b5a"),
  heroEvents: unsplash("1517457373958-b7bdd4587205"),
  heroContact: unsplash("1491438590914-bc09fcaaf77a"),

  storyStart: "/images/jp/insight-studio-2.jpg",
  storyGrow: unsplash("1473186505569-9c61870c11f9"),
  // Sengaja bukan foto relawan membagikan bantuan: JP tidak menjanjikan bantuan materi.
  storyToday: unsplash("1609234656388-0ff363383899"),
} as const;

export const coverPool = [
  unsplash("1445445290350-18a3b86e0b5a"),
  unsplash("1504052434569-70ad5836ab65"),
  unsplash("1491841550275-ad7854e35ca6"),
  unsplash("1484627147104-f5197bcd6651"),
  unsplash("1499209974431-9dddcece7f88"),
  unsplash("1473186505569-9c61870c11f9"),
  unsplash("1437603568260-1950d3ca6eab"),
  unsplash("1470116945706-e6bf5d5a53ca"),
  unsplash("1532629345422-7515f3d16bb6"),
];

export const eventPool = [
  unsplash("1602523961358-f9f03dd557db"),
  unsplash("1529070538774-1843cb3265df"),
  unsplash("1593113598332-cd288d649433"),
  unsplash("1506869640319-fe1a24fd76dc"),
  unsplash("1511795409834-ef04bbd61622"),
];

export const socialPool = [
  unsplash("1491438590914-bc09fcaaf77a"),
  unsplash("1464207687429-7505649dae38"),
  unsplash("1491841550275-ad7854e35ca6"),
  unsplash("1499209974431-9dddcece7f88"),
  unsplash("1506869640319-fe1a24fd76dc"),
  unsplash("1511632765486-a01980e01a18"),
];

/** Pilih foto yang sama untuk kunci yang sama, supaya tidak berganti tiap render. */
export function pickPhoto(key: string, pool: readonly string[] = coverPool) {
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  return pool[hash % pool.length];
}
