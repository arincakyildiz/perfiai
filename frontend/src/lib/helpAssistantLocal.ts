/**
 * Çevrimdışı / API yokken yardım asistanı yanıtları.
 * Backend `buildHelpFallback` ile aynı anahtar kelime mantığı (senkron tutulmalı).
 */
import type { Locale } from "@/lib/translations";

export function localHelpAnswer(
  question: string,
  pathHint: string | undefined,
  locale: Locale
): string {
  const q = question.toLowerCase();
  const lang = locale === "en" ? "en" : "tr";

  if (lang === "tr") {
    if (/(kıyas|karşılaştır|compare|yan\s*yana|vs)/.test(q)) {
      return [
        "Kıyaslama için üst menüden «Kıyasla» sayfasına git.",
        "Parfümleri seçerek en fazla 4 kokuyu yan yana notalar, mevsim ve puan açısından görebilirsin.",
        "Bir özellik kilitliyse giriş yap veya ücretsiz hesap oluştur.",
      ].join("\n");
    }
    if (/(filtre|keşif|liste|explore|mevcut\s*parfüm|daralt)/.test(q)) {
      return [
        "«Mevcut Parfümler» sayfasında tüm liste ve gelişmiş filtreler var.",
        "Marka, cinsiyet, mevsim, accord, yıl, puan, kalıcılık ve iz gibi seçeneklerle sonuçları daralt.",
        "Üstteki metin kutusu ile marka, isim veya nota ara.",
      ].join("\n");
    }
    if (/(giriş|kayıt|hesap|üye|login|register|şifre|e-?posta)/.test(q)) {
      return [
        "Sağ üstteki profil / giriş alanından e-posta ile kayıt olabilir veya giriş yapabilirsin.",
        "Kıyaslama veya kişisel listeler için hesap gerekebilir.",
      ].join("\n");
    }
    if (/(beğeni|favori|kalp|kaydet)/.test(q)) {
      return [
        "Parfüm kartındaki kalp ikonuna tıklayarak beğenilerine ekle.",
        "Menüden «Beğendiklerim» ile koleksiyonunu görürsün.",
      ].join("\n");
    }
    if (/(marka|brand|dior|chanel)/.test(q)) {
      return [
        "Menüden «Markalar»a git; bir markaya tıklayınca o markanın tüm parfümleri listelenir.",
      ].join("\n");
    }
    if (/(ai|arama|nasıl|bul|kutu|ana\s*sayfa|doğal\s*dil|tarif)/.test(q)) {
      return [
        "Ana sayfadaki büyük kutuya istediğin kokuyu doğal cümleyle yaz (örn. «ferah yaz parfümü», «tatlı vanilya»).",
        "«AI ile Ara» ile sonuçları getir; Türkçe ve İngilizce yazabilirsin.",
      ].join("\n");
    }
    const pathNote =
      typeof pathHint === "string" && pathHint
        ? `\n\n(Şu anki sayfa: ${pathHint})`
        : "";
    return (
      [
        "Şunları deneyebilirsin:",
        "• Ana sayfa: doğal dil ile AI arama",
        "• Mevcut Parfümler: gelişmiş filtreler ve liste",
        "• Kıyasla: 2–4 parfüm karşılaştırma",
        "• Beğendiklerim ve Markalar",
        "",
        "Sorunu biraz daha net yazarsan daha iyi yönlendirebilirim.",
      ]
        .join("\n")
        .trim() + pathNote
    );
  }

  if (/(compare|side\s*by\s*side|versus|\bvs\b)/.test(q)) {
    return [
      "Open «Compare» in the menu, pick perfumes, and view up to four side by side (notes, season, ratings).",
      "Sign in or create a free account if a feature is locked.",
    ].join("\n");
  }
  if (/(filter|explore|browse|list|narrow)/.test(q)) {
    return [
      "«All Perfumes» (/explore) has the full list and advanced filters.",
      "Filter by brand, gender, season, accords, year, rating, longevity, sillage, and use the text box to search.",
    ].join("\n");
  }
  if (/(sign\s*in|log\s*in|register|account|password|email)/.test(q)) {
    return [
      "Use the profile / sign-in control in the top-right to register or log in with email.",
      "Some actions (e.g. compare or personal lists) may require an account.",
    ].join("\n");
  }
  if (/(favorite|heart|save)/.test(q)) {
    return [
      "Click the heart on a card to save it to your favorites.",
      "Open «Favorites» in the menu to see your list.",
    ].join("\n");
  }
  if (/(brand|dior|chanel)/.test(q)) {
    return [
      "Go to «Brands» in the menu; pick a brand to see all its perfumes.",
    ].join("\n");
  }
  if (/(ai|search|how|find|home|natural\s*language)/.test(q)) {
    return [
      "On the home page, describe the scent you want in plain language, then tap «AI Search».",
      "Turkish and English queries both work.",
    ].join("\n");
  }
  const pathNote =
    typeof pathHint === "string" && pathHint
      ? `\n\n(Current page: ${pathHint})`
      : "";
  return (
    [
      "Try:",
      "• Home: natural-language AI search",
      "• All Perfumes: filters and browse",
      "• Compare: 2–4 perfumes side by side",
      "• Favorites and Brands",
      "",
      "Rephrase your question for a more specific tip.",
    ].join("\n") + pathNote
  );
}
