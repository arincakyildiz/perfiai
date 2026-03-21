/** Türkçe kısa açıklama — merge + katalog scriptleri ortak kullanır */

const ACCORD_TR = {
  "fresh spicy": "ferah baharatlı",
  "warm spicy": "sıcak baharatlı",
  spicy: "baharatlı",
  citrus: "narenciye",
  aromatic: "aromatik",
  fresh: "ferah",
  amber: "amber",
  musky: "misk",
  musk: "misk",
  woody: "odunsu",
  lavender: "lavanta",
  herbal: "bitkisel",
  floral: "çiçeksi",
  "white floral": "beyaz çiçek",
  sweet: "tatlı",
  powdery: "pudralı",
  fruity: "meyveli",
  rose: "gül",
  aquatic: "deniz",
  vanilla: "vanilya",
  gourmand: "gurme",
  oud: "oud",
  oriental: "oryantal",
  leather: "deri",
  green: "yeşil",
  coconut: "hindistancevizi",
  coffee: "kahve",
  honey: "bal",
  smoky: "dumanlı",
  ozonic: "ozonik",
  soapy: "sabunsu",
  balsamic: "balzamik",
  "yellow floral": "sarı çiçek",
};

const GENDER_TR = {
  male: "erkeklere özel",
  female: "kadınlara özel",
  unisex: "uniseks",
};

const SEASON_TR = {
  spring: "ilkbahar",
  summer: "yaz",
  fall: "sonbahar",
  winter: "kış",
};

const LONGEVITY_TR = {
  short: "kısa süreli kalıcılık",
  moderate: "orta düzey kalıcılık",
  long: "uzun süreli kalıcılık",
  "very long": "çok uzun süreli kalıcılık",
};

const SILLAGE_TR = {
  soft: "hafif iz",
  moderate: "orta güçte iz",
  strong: "güçlü iz",
  enormous: "çok güçlü iz",
};

function trAccord(a) {
  return ACCORD_TR[String(a).toLowerCase().trim()] || a;
}

export function generateShortDescriptionTr(p) {
  const accords = (p.accords || []).slice(0, 3).map(trAccord);
  const gender = GENDER_TR[p.gender] || "herkes için";
  const seasons = p.season || [];
  const lon = LONGEVITY_TR[p.longevity] || "";
  const sil = SILLAGE_TR[p.sillage] || "";
  const parts = [];
  if (accords.length) {
    parts.push(
      `${accords.join(", ")} notalarıyla öne çıkan, ${gender} bir parfüm.`
    );
  } else {
    parts.push(
      `${gender[0].toUpperCase()}${gender.slice(1)} için özenle formüle edilmiş bir koku.`
    );
  }
  if (seasons.length === 4) {
    parts.push("Dört mevsim rahatlıkla kullanılabilir.");
  } else if (seasons.length) {
    const s = seasons.map((x) => SEASON_TR[x] || x).join(" ve ");
    parts.push(`${s[0].toUpperCase()}${s.slice(1)} ayları için ideal.`);
  }
  if (lon && sil) {
    parts.push(`${lon[0].toUpperCase()}${lon.slice(1)}, ${sil} bırakır.`);
  } else if (lon) {
    parts.push(`${lon[0].toUpperCase()}${lon.slice(1)}.`);
  }
  return parts.join(" ");
}
