/**
 * Perfiai Backend API
 * GET /perfumes - Liste (pagination, search, filter)
 * GET /perfumes/:id - Tek parfüm detayı
 * Auth: register, login, rate, comment (giriş gerekli)
 */

import express from "express";
import cors from "cors";
import crypto from "crypto";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET || "perfiai-dev-secret-change-in-prod";
const SITE_URL = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

const DATA_PATH = join(__dirname, "..", "data", "perfumes.json");
const USERS_PATH = join(__dirname, "..", "data", "users.json");
const COMMENTS_PATH = join(__dirname, "..", "data", "perfume_comments.json");
const VERIFICATION_TOKENS_PATH = join(__dirname, "..", "data", "verification_tokens.json");
const LOGIN_CODES_PATH = join(__dirname, "..", "data", "login_codes.json");
// SentenceTransformers ile önceden üretilmiş embedding dosyası
const EMBEDDINGS_PATH = join(
  __dirname,
  "..",
  "data",
  "perfume_embeddings_st.json"
);
const USER_RATINGS_PATH = join(__dirname, "..", "data", "user_ratings.json");

let perfumes = [];
let userRatings = {}; // { perfumeId: { sum, count } }
let perfumeEmbeddings = [];
let embeddingsReady = false;
let embeddingsLoadingPromise = null;

function loadPerfumes() {
  try {
    const data = readFileSync(DATA_PATH, "utf-8");
    perfumes = JSON.parse(data);
    return perfumes;
  } catch (err) {
    console.error("Veri yüklenemedi:", err.message);
    return [];
  }
}

loadPerfumes();

function computePerfumeFacets() {
  const accordSet = new Set();
  const longevitySet = new Set();
  const sillageSet = new Set();
  for (const p of perfumes) {
    for (const a of p.accords || []) {
      const s = String(a).trim();
      if (s) accordSet.add(s);
    }
    if (p.longevity) longevitySet.add(String(p.longevity).toLowerCase());
    if (p.sillage) sillageSet.add(String(p.sillage).toLowerCase());
  }
  return {
    accords: [...accordSet].sort((a, b) => a.localeCompare(b, "en")),
    longevity: [...longevitySet].sort(),
    sillage: [...sillageSet].sort(),
  };
}

const perfumeFacets = computePerfumeFacets();

function loadUserRatings() {
  if (!existsSync(USER_RATINGS_PATH)) return {};
  try {
    const raw = readFileSync(USER_RATINGS_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveUserRatings() {
  try {
    writeFileSync(USER_RATINGS_PATH, JSON.stringify(userRatings, null, 2), "utf-8");
  } catch (err) {
    console.error("user_ratings yazılamadı:", err.message);
  }
}

userRatings = loadUserRatings();

let users = [];
function loadUsers() {
  if (!existsSync(USERS_PATH)) return [];
  try {
    return JSON.parse(readFileSync(USERS_PATH, "utf-8"));
  } catch {
    return [];
  }
}
function saveUsers() {
  writeFileSync(USERS_PATH, JSON.stringify(users, null, 2), "utf-8");
}
users = loadUsers();

let comments = {}; // { perfumeId: [{ id, userId, userName, text, createdAt }] }
function loadComments() {
  if (!existsSync(COMMENTS_PATH)) return {};
  try {
    return JSON.parse(readFileSync(COMMENTS_PATH, "utf-8"));
  } catch {
    return {};
  }
}
function saveComments() {
  writeFileSync(COMMENTS_PATH, JSON.stringify(comments, null, 2), "utf-8");
}
comments = loadComments();

let verificationTokens = {}; // { token: { userId, expiresAt } }
function loadVerificationTokens() {
  if (!existsSync(VERIFICATION_TOKENS_PATH)) return {};
  try {
    return JSON.parse(readFileSync(VERIFICATION_TOKENS_PATH, "utf-8"));
  } catch {
    return {};
  }
}
function saveVerificationTokens() {
  writeFileSync(VERIFICATION_TOKENS_PATH, JSON.stringify(verificationTokens, null, 2), "utf-8");
}
verificationTokens = loadVerificationTokens();

let loginCodes = {}; // { email: { code, expiresAt } }
function loadLoginCodes() {
  if (!existsSync(LOGIN_CODES_PATH)) return {};
  try {
    return JSON.parse(readFileSync(LOGIN_CODES_PATH, "utf-8"));
  } catch {
    return {};
  }
}
function saveLoginCodes() {
  writeFileSync(LOGIN_CODES_PATH, JSON.stringify(loginCodes, null, 2), "utf-8");
}
loginCodes = loadLoginCodes();

function createTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;
  return nodemailer.createTransport({
    host,
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    secure: process.env.SMTP_SECURE === "1",
    auth: { user, pass },
  });
}

function verificationUrlForToken(token) {
  return `${SITE_URL.replace(/\/$/, "")}/auth/verify?token=${encodeURIComponent(token)}`;
}

async function sendVerificationEmail(email, token) {
  const transporter = createTransporter();
  const verifyUrl = verificationUrlForToken(token);
  if (!transporter) {
    console.warn(
      "[Perfiai] SMTP yapılandırılmamış (SMTP_HOST / SMTP_USER / SMTP_PASS). Doğrulama e-postası gönderilmedi.\n" +
        `         Yerel test için bu adresi kullanın: ${verifyUrl}`
    );
    return false;
  }
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: "Perfiai - E-posta adresinizi doğrulayın",
      html: `
      <p>Merhaba,</p>
      <p>Perfiai hesabınızı oluşturdunuz. E-posta adresinizi doğrulamak için aşağıdaki bağlantıya tıklayın:</p>
      <p><a href="${verifyUrl}" style="color:#7c3aed;font-weight:bold">E-postamı doğrula</a></p>
      <p>Veya bu linki tarayıcınıza kopyalayın: ${verifyUrl}</p>
      <p>Bu link 24 saat geçerlidir.</p>
      <p>— Perfiai</p>
    `,
    });
    return true;
  } catch (err) {
    console.error("[Perfiai] Doğrulama e-postası gönderilemedi:", err?.message || err);
    console.warn(`         Bağlantı (manuel deneme): ${verifyUrl}`);
    return false;
  }
}

async function sendLoginCodeEmail(email, code) {
  const transporter = createTransporter();
  if (!transporter) {
    console.warn(
      "[Perfiai] SMTP yapılandırılmamış - giriş kodu e-postayla gönderilemedi.\n" +
        `         Yerel test kodu (${email}): ${code}`
    );
    return false;
  }
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: "Perfiai - Giriş kodunuz",
      html: `
      <p>Merhaba,</p>
      <p>Perfiai giriş kodunuz: <strong style="font-size:24px;letter-spacing:4px">${code}</strong></p>
      <p>Bu kod 10 dakika geçerlidir.</p>
      <p>— Perfiai</p>
    `,
    });
    return true;
  } catch (err) {
    console.error("[Perfiai] Giriş kodu e-postası gönderilemedi:", err?.message || err);
    console.warn(`         Kod (${email}): ${code}`);
    return false;
  }
}

function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : req.body?.token;
  if (!token) {
    return res.status(401).json({ error: "Giriş yapmanız gerekiyor" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = users.find((u) => u.id === decoded.id);
    if (!user) return res.status(401).json({ error: "Kullanıcı bulunamadı" });
    // verified undefined = eski kullanıcı, doğrulama atlanır
    const verified = user.verified === undefined ? true : !!user.verified;
    req.user = { id: user.id, email: user.email, name: user.name, verified };
    next();
  } catch {
    return res.status(401).json({ error: "Geçersiz veya süresi dolmuş oturum" });
  }
}

function requireVerified(req, res, next) {
  if (!req.user.verified) {
    return res.status(403).json({ error: "Değerlendirme ve yorum için e-posta doğrulaması gerekli" });
  }
  next();
}

// Yorum moderasyonu: kötü içerik engelle (basit blocklist + OpenAI Moderation opsiyonel)
const BAD_WORDS = new Set([
  "kötü", "berbat", "pis", "çöp", "rezalet", "berbat", "iğrenç", "değersiz",
  "fuck", "shit", "damn", "ass", "hate", "stupid", "ugly", "trash", "garbage",
  "bok", "siktir", "amk", "orospu", "göt", "salak", "aptal", "mal",
]);
function moderateText(text) {
  if (!text || typeof text !== "string") return { ok: false, reason: "Boş yorum" };
  const t = text.trim();
  if (t.length < 3) return { ok: false, reason: "Yorum çok kısa (en az 3 karakter)" };
  if (t.length > 500) return { ok: false, reason: "Yorum çok uzun (en fazla 500 karakter)" };
  const lower = t.toLowerCase();
  for (const w of BAD_WORDS) {
    if (lower.includes(w)) return { ok: false, reason: "Yorumunuz uygun değil" };
  }
  return { ok: true };
}

// Mevcut rating + kullanıcı değerlendirmeleri → birleşik puan (Bayesian ortalama)
const BASE_WEIGHT = 5; // mevcut rating sanki 5 kişi vermiş gibi
function computeCombinedRating(perfume, ur = userRatings) {
  const base = typeof perfume.rating === "number" ? perfume.rating : 0;
  const urData = ur[String(perfume.id)];
  if (!urData || urData.count === 0) {
    return base > 0 ? base : null;
  }
  const combined =
    (base * BASE_WEIGHT + urData.sum) / (BASE_WEIGHT + urData.count);
  return Math.round(combined * 10) / 10;
}

function enrichWithRating(p) {
  const combined = computeCombinedRating(p);
  const urData = userRatings[String(p.id)];
  return {
    ...p,
    rating: combined ?? (typeof p.rating === "number" ? p.rating : undefined),
    user_rating_count: urData?.count ?? 0,
  };
}

// Bir parfümü embedding için tek satırlık metne çevir
function getPerfumeText(perfume) {
  const parts = [];
  if (perfume.brand) parts.push(String(perfume.brand));
  if (perfume.name) parts.push(String(perfume.name));
  if (perfume.gender) parts.push(`gender: ${perfume.gender}`);
  if (perfume.accords && perfume.accords.length > 0) {
    parts.push(`accords: ${perfume.accords.join(", ")}`);
  }
  if (perfume.notes) {
    const top = perfume.notes.top?.join(", ");
    const middle = perfume.notes.middle?.join(", ");
    const base = perfume.notes.base?.join(", ");
    if (top) parts.push(`top notes: ${top}`);
    if (middle) parts.push(`middle notes: ${middle}`);
    if (base) parts.push(`base notes: ${base}`);
  }
  if (perfume.short_description) {
    parts.push(String(perfume.short_description));
  }
  if (perfume.short_description_tr) {
    parts.push(`TR: ${String(perfume.short_description_tr)}`);
  }
  if (perfume.season && perfume.season.length > 0) {
    parts.push(`season: ${perfume.season.join(", ")}`);
  }
  return parts.join(" | ");
}

async function embedText(text) {
  // Öncelik: lokal SentenceTransformers servisi (Python + FastAPI)
  if (process.env.USE_ST_EMBEDDING === "1") {
    const url =
      process.env.SENTENCE_EMBEDDING_URL ||
      "http://localhost:8001/embed";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `SentenceTransformers embedding isteği başarısız oldu: ${response.status} - ${errorText}`
      );
    }

    const json = await response.json();
    if (!json.embedding || !Array.isArray(json.embedding)) {
      throw new Error("SentenceTransformers cevabı beklenen formatta değil.");
    }

    return json.embedding;
  }

  // Aksi halde (isteğe bağlı) OpenAI embedding
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Embedding için ne USE_ST_EMBEDDING ne de OPENAI_API_KEY tanımlı."
    );
  }

  const model =
    process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small";

  const response = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      input: text,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Embedding isteği başarısız oldu: ${response.status} - ${errorText}`
    );
  }

  const json = await response.json();
  if (!json.data || !json.data[0]?.embedding) {
    throw new Error("Embedding cevabı beklenen formatta değil.");
  }

  return json.data[0].embedding;
}

function cosineSimilarity(a, b) {
  if (!a || !b || a.length !== b.length) return 0;
  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i += 1) {
    const va = a[i];
    const vb = b[i];
    dot += va * vb;
    normA += va * va;
    normB += vb * vb;
  }

  if (!normA || !normB) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

function loadEmbeddingsFromDisk() {
  if (!existsSync(EMBEDDINGS_PATH)) return null;
  try {
    const raw = readFileSync(EMBEDDINGS_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch (err) {
    console.error("Embedding dosyası okunamadı:", err.message);
  }
  return null;
}

function saveEmbeddingsToDisk(embeddings) {
  try {
    writeFileSync(
      EMBEDDINGS_PATH,
      JSON.stringify(embeddings),
      "utf-8"
    );
  } catch (err) {
    console.error("Embedding dosyası yazılamadı:", err.message);
  }
}

async function ensureEmbeddings() {
  if (embeddingsReady) return perfumeEmbeddings;
  if (embeddingsLoadingPromise) return embeddingsLoadingPromise;

  embeddingsLoadingPromise = (async () => {
    // Diskten yüklemeyi dene
    const fromDisk = loadEmbeddingsFromDisk();
    if (fromDisk && fromDisk.length === perfumes.length) {
      perfumeEmbeddings = fromDisk;
      embeddingsReady = true;
      console.log(
        `Embedding dosyasından yüklendi: ${fromDisk.length} parfüm`
      );
      return perfumeEmbeddings;
    }

    // Aksi halde yeniden üret
    console.log(
      "Embedding dosyası bulunamadı veya boyut tutmuyor, yeniden oluşturuluyor..."
    );
    const embeddings = [];

    for (let i = 0; i < perfumes.length; i += 1) {
      const perfume = perfumes[i];
      const text = getPerfumeText(perfume);
      try {
        // Çok uzun metinleri kes
        const truncatedText =
          text.length > 2000 ? `${text.slice(0, 2000)}...` : text;
        const embedding = await embedText(truncatedText);
        embeddings.push(embedding);
      } catch (err) {
        console.error(
          `Embedding alınamadı (id=${perfume.id || i}):`,
          err.message
        );
        embeddings.push(null);
      }

      if (i > 0 && i % 20 === 0) {
        console.log(`Embedding ilerleme: ${i}/${perfumes.length}`);
      }
    }

    saveEmbeddingsToDisk(embeddings);
    perfumeEmbeddings = embeddings;
    embeddingsReady = true;
    console.log("Embedding üretimi tamamlandı.");

    return perfumeEmbeddings;
  })();

  return embeddingsLoadingPromise;
}

function detectLanguage(text) {
  if (!text) return "unknown";
  const lower = text.toLowerCase();
  const hasTurkishChars = /[çğıöşü]/.test(lower);
  const hasEnglishOnly =
    /[a-z]/.test(lower) && !hasTurkishChars;

  if (hasTurkishChars) return "tr";
  if (hasEnglishOnly) return "en";
  return "unknown";
}

function normalizeRating(rating) {
  if (typeof rating !== "number" || Number.isNaN(rating)) return 0;
  const min = 2.5;
  const max = 5.0;
  const clamped = Math.min(max, Math.max(min, rating));
  return (clamped - min) / (max - min); // 0–1 arası
}

function buildTagsFromPerfume(perfume) {
  const tags = [];
  const accords = perfume.accords || [];
  const season = perfume.season || [];

  for (const acc of accords.slice(0, 3)) {
    tags.push(acc.toLowerCase());
  }

  for (const s of season.slice(0, 2)) {
    tags.push(s.toLowerCase());
  }

  if (perfume.gender) {
    tags.push(String(perfume.gender).toLowerCase());
  }

  return Array.from(new Set(tags));
}

function buildReasonForMatch(perfume, query, lang) {
  const q = (query || "").toLowerCase();
  const accords = (perfume.accords || []).map((a) => a.toLowerCase());
  const season = (perfume.season || []).map((s) => s.toLowerCase());

  const pickedAccords = accords.slice(0, 2);
  const pickedSeasons = season.slice(0, 2);

  if (lang === "tr") {
    const parts = [];
    if (pickedAccords.length > 0) {
      parts.push(
        `${pickedAccords.join(", ")} karakterinde bir koku profiline sahip`
      );
    }
    if (pickedSeasons.length > 0) {
      parts.push(
        `${pickedSeasons.join(", ")} dönemlerinde kullanıma uygun`
      );
    }
    const base =
      parts.length > 0
        ? parts.join(" ve ") + "."
        : "Parfüm notaları ve genel profili isteğinle iyi eşleşiyor.";

    if (q.includes("ofis") || q.includes("günlük")) {
      return `${base} Günlük/ofis kullanımı için de dengeli bir yapıda.`;
    }
    if (q.includes("gece") || q.includes("date") || q.includes("randevu")) {
      return `${base} Akşam ve özel buluşmalar için de uygun bir karaktere sahip.`;
    }
    return base;
  }

  // Varsayılan: İngilizce veya bilinmeyen
  const parts = [];
  if (pickedAccords.length > 0) {
    parts.push(
      `It has a ${pickedAccords.join(", ")} style scent profile`
    );
  }
  if (pickedSeasons.length > 0) {
    parts.push(
      `suitable for ${pickedSeasons.join(", ")} wear`
    );
  }
  const base =
    parts.length > 0
      ? parts.join(" and ") + "."
      : "Its notes and overall profile match your request well.";

  if (q.includes("office") || q.includes("daily")) {
    return `${base} Works well as a daily office fragrance.`;
  }
  if (q.includes("night") || q.includes("date")) {
    return `${base} Also fits evening and date-night situations.`;
  }
  return base;
}

async function generateReasonWithLLM(perfume, query, lang) {
  // LLM devre dışıysa veya base URL tanımlı değilse kural tabanlı metoda dön
  const baseUrl = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
  const enabled = process.env.OLLAMA_ENABLED === "1";

  if (!enabled) {
    return buildReasonForMatch(perfume, query, lang);
  }

  try {
    const model = process.env.OLLAMA_MODEL || "llama3";

    const userLang = lang === "tr" ? "Turkish" : "English";
    const instruction =
      lang === "tr"
        ? "Kullanıcının parfüm isteğine ve parfümün özelliklerine göre bu parfümün neden iyi bir eşleşme olduğunu 1 kısa cümle ile açıkla. Resmi olma, doğal konuş."
        : "In one short, natural sentence, explain why this perfume matches the user's request. Be informal, friendly, and concise.";

    const prompt = {
      model,
      messages: [
        {
          role: "system",
          content:
            "You are an assistant that explains perfume recommendations in a very short, user-friendly way. Always respond in a single sentence in the requested language.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `
Language: ${userLang}

User request:
${query}

Perfume:
- Brand: ${perfume.brand || "-"}
- Name: ${perfume.name || "-"}
- Gender: ${perfume.gender || "-"}
- Accords: ${(perfume.accords || []).join(", ") || "-"}
- Season: ${(perfume.season || []).join(", ") || "-"}
- Notes:
  - Top: ${(perfume.notes?.top || []).join(", ") || "-"}
  - Middle: ${(perfume.notes?.middle || []).join(", ") || "-"}
  - Base: ${(perfume.notes?.base || []).join(", ") || "-"}
- Short description: ${perfume.short_description || "-"}

${instruction}
`.trim(),
            },
          ],
        },
      ],
      stream: false,
    };

    const response = await fetch(`${baseUrl}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(prompt),
    });

    if (!response.ok) {
      throw new Error(`LLM isteği başarısız oldu: ${response.status}`);
    }

    const json = await response.json();
    const content =
      json.choices?.[0]?.message?.content ||
      json.choices?.[0]?.message?.[0]?.text;

    if (!content || typeof content !== "string") {
      throw new Error("LLM cevabı beklenen formatta değil.");
    }

    return content.trim();
  } catch (err) {
    console.error(
      "LLM reason üretimi başarısız oldu, kural tabanlı metoda dönülüyor:",
      err.message
    );
    return buildReasonForMatch(perfume, query, lang);
  }
}

async function generateHelpWithLLM(question, pathHint, lang) {
  const baseUrl = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
  const model = process.env.OLLAMA_MODEL || "llama3";
  const userLang = lang === "tr" ? "Turkish" : "English";
  const systemContent =
    lang === "tr"
      ? `Sen Perfiai adlı parfüm keşif web sitesinin yardım asistanısın. Kısa ve net cevap ver; madde imleri kullanabilirsin (en fazla 5–7 satır).

Site özeti:
- Ana sayfa: doğal dil ile AI parfüm araması.
- /explore (Mevcut Parfümler): liste, metin araması, gelişmiş filtreler (marka, cinsiyet, mevsim, accord, yıl, puan, kalıcılık vb.).
- /compare (Kıyasla): 2–4 parfümü yan yana karşılaştırma; bazı özellikler için giriş gerekebilir.
- Beğendiklerim (kalp ikonu) ve Markalar sayfası.

Kurallar: Tıbbi teşhis veya alerji garantisi verme; odak site kullanımı olsun. Yanıtın dili: ${userLang}.`
      : `You are the in-app help assistant for Perfiai, a perfume discovery website. Answer briefly; bullet points OK (max ~5–7 lines).

Site summary:
- Home: natural-language AI perfume search.
- /explore: browse list, text search, advanced filters.
- /compare: side-by-side compare for 2–4 perfumes; login may be required for some actions.
- Favorites (heart icon) and Brands page.

Rules: No medical or allergy guarantees; focus on how to use the site. Language: ${userLang}.`;

  const prompt = {
    model,
    messages: [
      { role: "system", content: systemContent },
      {
        role: "user",
        content: `Current page path (if known): ${typeof pathHint === "string" ? pathHint : "unknown"}

User question:
${question}`.trim(),
      },
    ],
    stream: false,
  };

  const response = await fetch(`${baseUrl}/v1/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(prompt),
  });

  if (!response.ok) {
    throw new Error(`LLM status ${response.status}`);
  }

  const json = await response.json();
  const content =
    json.choices?.[0]?.message?.content ||
    json.choices?.[0]?.message?.[0]?.text;

  if (!content || typeof content !== "string") {
    throw new Error("LLM yanıtı boş");
  }

  return content.trim();
}

function buildHelpFallback(question, pathHint, lang) {
  const q = (question || "").toLowerCase();

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
    if (
      /(ai|arama|nasıl|bul|kutu|ana\s*sayfa|doğal\s*dil|tarif)/.test(q)
    ) {
      return [
        "Ana sayfadaki büyük kutuya istediğin kokuyu doğal cümleyle yaz (örn. «ferah yaz parfümü», «tatlı vanilya»).",
        "«AI ile Ara» ile sonuçları getir; Türkçe ve İngilizce yazabilirsin.",
      ].join("\n");
    }
    const pathNote =
      typeof pathHint === "string" && pathHint
        ? `\n\n(Şu anki sayfa: ${pathHint})`
        : "";
    return [
      "Şunları deneyebilirsin:",
      "• Ana sayfa: doğal dil ile AI arama",
      "• Mevcut Parfümler: gelişmiş filtreler ve liste",
      "• Kıyasla: 2–4 parfüm karşılaştırma",
      "• Beğendiklerim ve Markalar",
      "",
      "Sorunu biraz daha net yazarsan daha iyi yönlendirebilirim.",
    ]
      .join("\n")
      .trim() + pathNote;
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

// Türkçe koku kelimelerini İngilizce karşılıklarıyla genişlet (AI arama için)
const TURKISH_SCENT_MAP = {
  narenciye: "citrus",
  turunç: "citrus",
  limon: "citrus lemon",
  portakal: "citrus orange",
  bergamot: "bergamot",
  ferah: "fresh",
  serin: "fresh",
  temiz: "fresh clean",
  tatlı: "sweet",
  vanilya: "vanilla sweet",
  odunsu: "woody",
  ahşap: "woody",
  sandal: "sandalwood woody",
  "sandal ağacı": "sandalwood woody",
  baharatlı: "spicy",
  baharat: "spicy",
  çiçeksi: "floral",
  çiçek: "floral",
  yasemin: "jasmine floral",
  gül: "rose floral",
  lavanta: "lavender",
  amber: "amber",
  misk: "musky musk",
  aromatik: "aromatic",
  yaz: "summer",
  kış: "winter",
  ilkbahar: "spring",
  sonbahar: "fall",
  ofis: "office",
  günlük: "daily",
  gece: "night",
  erkek: "male",
  kadın: "female",
  kadınsı: "female floral",
  erkeksi: "male",
  unisex: "unisex",
  meyveli: "fruity",
  meyve: "fruity",
  yeşil: "green",
  okyanus: "aquatic marine",
  deniz: "aquatic marine",
  pudra: "powdery",
  sıcak: "warm",
  soğuk: "cool fresh",
  hafif: "light",
  yoğun: "intense",
  oryantal: "oriental",
  doğu: "oriental",
};

function expandQueryWithTurkish(rawQuery) {
  const lower = rawQuery.toLowerCase().trim();
  const tokens = lower.split(/\s+/).filter(Boolean);
  const expanded = new Set(tokens);
  for (const token of tokens) {
    const en = TURKISH_SCENT_MAP[token];
    if (en) {
      en.split(/\s+/).forEach((e) => expanded.add(e));
    }
  }
  return [...tokens, ...expanded].join(" ");
}

function applyCommonFilters(perfumeList, queryParams) {
  let result = [...perfumeList];

  // Filtre: brand (tam eşleşme)
  const brandFilter = (queryParams.brand || "").trim();
  if (brandFilter) {
    const brandLower = brandFilter.toLowerCase();
    result = result.filter((p) => (p.brand || "").toLowerCase() === brandLower);
  }

  // Arama (name, accords, gender, short_description) - q parametresi
  const rawQ = (queryParams.q || "").trim();
  if (rawQ) {
    const expandedQ = expandQueryWithTurkish(rawQ);
    const qTokens = expandedQ.toLowerCase().split(/\s+/).filter(Boolean);
    result = result.filter((p) => {
      const brand = (p.brand || "").toLowerCase();
      const name = (p.name || "").toLowerCase();
      const gender = (p.gender || "").toLowerCase();
      const description = (p.short_description || "").toLowerCase();
      const descriptionTr = (p.short_description_tr || "").toLowerCase();
      const accords = (p.accords || []).map((a) => a.toLowerCase());
      const noteBuckets = [
        ...(p.notes?.top || []),
        ...(p.notes?.middle || []),
        ...(p.notes?.base || []),
      ].map((n) => String(n).toLowerCase());
      const allText = [
        brand,
        name,
        gender,
        description,
        descriptionTr,
        ...accords,
        ...noteBuckets,
      ].join(" ");

      return qTokens.some((t) => allText.includes(t));
    });
  }

  // Filtre: gender
  const gender = (queryParams.gender || "").toLowerCase();
  if (gender && ["male", "female", "unisex"].includes(gender)) {
    result = result.filter((p) => (p.gender || "").toLowerCase() === gender);
  }

  // Filtre: season
  const season = (queryParams.season || "").toLowerCase();
  if (season && ["spring", "summer", "fall", "winter"].includes(season)) {
    result = result.filter((p) =>
      (p.season || []).some((s) => s.toLowerCase() === season)
    );
  }

  const minR = parseFloat(queryParams.min_rating);
  if (!Number.isNaN(minR)) {
    result = result.filter((p) => (p.rating || 0) >= minR);
  }
  const maxR = parseFloat(queryParams.max_rating);
  if (!Number.isNaN(maxR)) {
    result = result.filter((p) => (p.rating || 0) <= maxR);
  }

  const yMin = parseInt(queryParams.year_min, 10);
  if (!Number.isNaN(yMin) && yMin > 0) {
    result = result.filter((p) => (p.year || 0) >= yMin);
  }
  const yMax = parseInt(queryParams.year_max, 10);
  if (!Number.isNaN(yMax) && yMax > 0) {
    result = result.filter((p) => (p.year || 0) <= yMax);
  }

  const longevityF = (queryParams.longevity || "").trim().toLowerCase();
  if (longevityF) {
    result = result.filter(
      (p) => (p.longevity || "").toLowerCase() === longevityF
    );
  }

  const sillageF = (queryParams.sillage || "").trim().toLowerCase();
  if (sillageF) {
    result = result.filter(
      (p) => (p.sillage || "").toLowerCase() === sillageF
    );
  }

  const accRaw = (queryParams.accords || queryParams.accord || "").trim();
  if (accRaw) {
    const tokens = accRaw
      .split(/[,;]+/)
      .map((x) => x.trim().toLowerCase())
      .filter(Boolean);
    if (tokens.length) {
      const modeAll = (queryParams.accord_mode || "any").toLowerCase() === "all";
      result = result.filter((p) => {
        const pa = (p.accords || []).map((a) => String(a).toLowerCase());
        const matchOne = (t) =>
          pa.some((a) => a === t || a.includes(t) || t.includes(a));
        return modeAll
          ? tokens.every((t) => matchOne(t))
          : tokens.some((t) => matchOne(t));
      });
    }
  }

  const minRev = parseInt(queryParams.min_reviews, 10);
  if (!Number.isNaN(minRev) && minRev > 0) {
    result = result.filter((p) => (p.user_rating_count || 0) >= minRev);
  }

  // Sıralama (order: asc — rating/yıl için düşük→yüksek, isim için Z→A)
  if (!queryParams.skipSort) {
    const sort = queryParams.sort || "rating";
    const order = queryParams.order === "asc" ? -1 : 1;
    if (sort === "rating") {
      result.sort((a, b) => ((b.rating || 0) - (a.rating || 0)) * order);
    } else if (sort === "year") {
      result.sort((a, b) => ((b.year || 0) - (a.year || 0)) * order);
    } else if (sort === "name") {
      result.sort(
        (a, b) => (a.name || "").localeCompare(b.name || "") * order
      );
    }
  }

  return result;
}

function paginate(list, queryParams) {
  const page = Math.max(1, parseInt(queryParams.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(queryParams.limit) || 20));
  const total = list.length;
  const start = (page - 1) * limit;
  const items = list.slice(start, start + limit);

  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    data: items,
  };
}

// Basit "AI benzeri" skorlayıcı — tam AI değil ama
// doğal dil istekleri için daha akıllı arama hissi verir.
function scorePerfumeForQuery(perfume, rawQuery) {
  if (!rawQuery) return 0;
  const expandedQuery = expandQueryWithTurkish(rawQuery);
  const q = expandedQuery.toLowerCase();
  const tokens = q.split(/\s+/).filter(Boolean);

  const brand = (perfume.brand || "").toLowerCase();
  const name = (perfume.name || "").toLowerCase();
  const description = (perfume.short_description || "").toLowerCase();
  const accords = (perfume.accords || []).map((a) => a.toLowerCase());
  const notes = {
    top: (perfume.notes?.top || []).map((n) => n.toLowerCase()),
    middle: (perfume.notes?.middle || []).map((n) => n.toLowerCase()),
    base: (perfume.notes?.base || []).map((n) => n.toLowerCase()),
  };

  let score = 0;

  for (const token of tokens) {
    if (!token) continue;

    if (brand.includes(token)) score += 5;
    if (name.includes(token)) score += 5;
    if (description.includes(token)) score += 3;
    if (accords.some((a) => a.includes(token))) score += 3;
    if (notes.top.some((n) => n.includes(token))) score += 2;
    if (notes.middle.some((n) => n.includes(token))) score += 2;
    if (notes.base.some((n) => n.includes(token))) score += 2;
  }

  // Rating'i hafifçe hesaba kat (daha yüksek rating'ler öne çıksın)
  const rating = typeof perfume.rating === "number" ? perfume.rating : 0;
  score += rating;

  return score;
}

// GET /perfume-facets — accord / longevity / sillage benzersiz listeleri (filtre UI)
app.get("/perfume-facets", (_req, res) => {
  res.json(perfumeFacets);
});

// POST /ai-help — site kullanımı yardımı (OLLAMA_ENABLED=1 ise LLM, aksi kural tabanlı)
// Body: { question: string, path?: string, locale?: "tr" | "en" }
app.post("/ai-help", async (req, res) => {
  try {
    const { question, path: pathHint, locale } = req.body || {};
    const q = typeof question === "string" ? question.trim().slice(0, 800) : "";
    if (!q) {
      return res.status(400).json({ error: "question gerekli." });
    }
    const lang = locale === "en" ? "en" : "tr";
    const ollamaOn = process.env.OLLAMA_ENABLED === "1";
    let answer;
    let mode = "rules";
    if (ollamaOn) {
      try {
        answer = await generateHelpWithLLM(q, pathHint, lang);
        mode = "llm";
      } catch (e) {
        console.warn("ai-help LLM fallback:", e.message);
        answer = buildHelpFallback(q, pathHint, lang);
        mode = "rules";
      }
    } else {
      answer = buildHelpFallback(q, pathHint, lang);
    }
    res.json({ ok: true, answer, mode });
  } catch (e) {
    console.error("ai-help:", e);
    res.status(500).json({ error: "Yardım yanıtı üretilemedi." });
  }
});

// GET /perfumes - Liste (pagination, search, filter)
app.get("/perfumes", (req, res) => {
  const enrichedAll = perfumes.map(enrichWithRating);
  const filtered = applyCommonFilters(enrichedAll, req.query);
  const response = paginate(filtered, req.query);
  res.json(response);
});

// POST /ai-search - doğal dil istekle arama
// Body: { query: string, gender?: string, season?: string, limit?: number }
app.post("/ai-search", async (req, res) => {
  const { query, gender, season, limit } = req.body || {};

  if (!query || typeof query !== "string" || !query.trim()) {
    return res.status(400).json({ error: "query zorunlu bir alandır." });
  }

  const lang = detectLanguage(query);

  const extra = req.body || {};
  const baseFiltered = applyCommonFilters(perfumes.map(enrichWithRating), {
    q: "",
    gender,
    season,
    brand: typeof extra.brand === "string" ? extra.brand : "",
    min_rating: extra.min_rating,
    max_rating: extra.max_rating,
    year_min: extra.year_min,
    year_max: extra.year_max,
    longevity: extra.longevity,
    sillage: extra.sillage,
    accords: extra.accords,
    accord_mode: extra.accord_mode,
    min_reviews: extra.min_reviews,
    skipSort: true,
  });

  const effectiveLimit = Math.min(
    50,
    Math.max(1, parseInt(limit, 10) || 20)
  );

  const useEmbedding =
    process.env.OPENAI_API_KEY || process.env.USE_ST_EMBEDDING === "1";

  // Embedding desteklenmiyorsa eski (heuristic) skorlama ile devam et
  if (!useEmbedding) {
    const scoredFallback = baseFiltered
      .map((p) => {
        const similarityScore = scorePerfumeForQuery(p, query);
        const popularityScore = normalizeRating(p.rating);
        const finalScore =
          similarityScore * 0.7 + popularityScore * 0.3;

        return {
          ...p,
          _similarity: similarityScore,
          _popularity: popularityScore,
          _finalScore: finalScore,
        };
      })
      .filter((p) => p._finalScore > 0)
      .sort((a, b) => b._finalScore - a._finalScore);

    const itemsFallback = await Promise.all(
      scoredFallback.slice(0, effectiveLimit).map(
        async ({ _similarity, _popularity, _finalScore, ...rest }) => ({
          ...rest,
          score: _finalScore,
          similarityScore: _similarity,
          popularityScore: _popularity,
          mode: "heuristic",
          tags: buildTagsFromPerfume(rest),
          reason: await generateReasonWithLLM(rest, query, lang),
        })
      )
    );

    return res.json({
      total: itemsFallback.length,
      query,
      gender: gender || null,
      season: season || null,
      lang,
      mode: "heuristic",
      data: itemsFallback,
    });
  }

  try {
    const embeddings = await ensureEmbeddings();
    const queryEmbedding = await embedText(query);

    const scored = baseFiltered
      .map((p) => {
        const idx = perfumes.findIndex((x) => String(x.id) === String(p.id));
        const perfumeEmbedding = embeddings[idx];
        const sim = perfumeEmbedding
          ? cosineSimilarity(queryEmbedding, perfumeEmbedding)
          : 0;

        const popularityScore = normalizeRating(p.rating);
        const finalScore = sim * 0.7 + popularityScore * 0.3;

        return {
          ...p,
          _similarity: sim,
          _popularity: popularityScore,
          _finalScore: finalScore,
        };
      })
      .filter((p) => p._similarity > 0)
      .sort((a, b) => b._finalScore - a._finalScore);

    const items = await Promise.all(
      scored.slice(0, effectiveLimit).map(
        async ({ _similarity, _popularity, _finalScore, ...rest }) => ({
          ...rest,
          score: _finalScore,
          similarityScore: _similarity,
          popularityScore: _popularity,
          mode: "embedding",
          tags: buildTagsFromPerfume(rest),
          reason: await generateReasonWithLLM(rest, query, lang),
        })
      )
    );

    return res.json({
      total: items.length,
      query,
      gender: gender || null,
      season: season || null,
      lang,
      mode: "embedding",
      data: items,
    });
  } catch (err) {
    console.error("Embedding tabanlı arama hata verdi, fallback kullanılıyor:", err.message);

    // Hata durumunda heuristic'e geri dön
    const scoredFallback = baseFiltered
      .map((p) => {
        const similarityScore = scorePerfumeForQuery(p, query);
        const popularityScore = normalizeRating(p.rating);
        const finalScore =
          similarityScore * 0.7 + popularityScore * 0.3;

        return {
          ...p,
          _similarity: similarityScore,
          _popularity: popularityScore,
          _finalScore: finalScore,
        };
      })
      .filter((p) => p._similarity > 0)
      .sort((a, b) => b._finalScore - a._finalScore);

    const itemsFallback = await Promise.all(
      scoredFallback.slice(0, effectiveLimit).map(
        async ({ _similarity, _popularity, _finalScore, ...rest }) => ({
          ...rest,
          score: _finalScore,
          similarityScore: _similarity,
          popularityScore: _popularity,
          mode: "heuristic",
          tags: buildTagsFromPerfume(rest),
          reason: await generateReasonWithLLM(rest, query, lang),
        })
      )
    );

    return res.json({
      total: itemsFallback.length,
      query,
      gender: gender || null,
      season: season || null,
      lang,
      mode: "heuristic_fallback",
      data: itemsFallback,
    });
  }
});

// GET /perfumes/:id - Tek parfüm (yorumlar dahil)
app.get("/perfumes/:id", (req, res) => {
  const id = req.params.id;
  const perfume = perfumes.find((p) => p.id === id || p.id === parseInt(id));
  if (!perfume) {
    return res.status(404).json({ error: "Parfüm bulunamadı", id });
  }
  const enriched = enrichWithRating(perfume);
  enriched.comments = (comments[id] || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(enriched);
});

// POST /auth/register (Kaydet) — yeni hesap: verified=false, doğrulama e-postası (SMTP gerekli)
app.post("/auth/register", async (req, res) => {
  const { email, name } = req.body || {};
  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "Email gerekli" });
  }
  const emailNorm = email.trim().toLowerCase();
  if (emailNorm.length < 3) return res.status(400).json({ error: "Geçerli email girin" });
  let user = users.find((u) => u.email.toLowerCase() === emailNorm);
  let isNewUser = false;
  let verificationTokenForDev = null;
  let emailSent = true;

  if (!user) {
    isNewUser = true;
    user = {
      id: String(Date.now()),
      email: emailNorm,
      name: (name || emailNorm.split("@")[0]).trim().slice(0, 50),
      verified: false,
      favoritePerfumeIds: [],
    };
    users.push(user);
    saveUsers();
    const verifyToken = crypto.randomBytes(32).toString("hex");
    verificationTokenForDev = verifyToken;
    verificationTokens[verifyToken] = {
      userId: user.id,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    };
    saveVerificationTokens();
    emailSent = await sendVerificationEmail(user.email, verifyToken);
  }

  const verifiedFlag = user.verified === undefined ? true : !!user.verified;
  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name, verified: verifiedFlag },
    JWT_SECRET,
    { expiresIn: "14d" }
  );

  const baseUser = { id: user.id, email: user.email, name: user.name, verified: verifiedFlag };
  const payload = {
    ok: true,
    token,
    user: baseUser,
    emailVerificationSent: isNewUser ? emailSent : undefined,
    message: isNewUser
      ? emailSent
        ? "Kayıt başarılı. E-postanızdaki bağlantı ile adresinizi doğrulayın (spam klasörüne de bakın)."
        : "Kayıt oluşturuldu ancak doğrulama e-postası gönderilemedi. Sunucuda SMTP ayarlarını kontrol edin veya «Doğrulama e-postasını tekrar gönder» kullanın."
      : "Hoş geldiniz.",
  };

  if (isNewUser && !emailSent && process.env.NODE_ENV !== "production" && verificationTokenForDev) {
    payload.devVerificationUrl = verificationUrlForToken(verificationTokenForDev);
  }

  res.json(payload);
});

// POST /auth/send-code - Giriş kodu gönder
app.post("/auth/send-code", async (req, res) => {
  const { email } = req.body || {};
  if (!email || typeof email !== "string") return res.status(400).json({ error: "Email gerekli" });
  const emailNorm = email.trim().toLowerCase();
  const user = users.find((u) => u.email === emailNorm);
  if (!user) return res.status(404).json({ error: "Bu email ile kayıtlı hesap bulunamadı. Önce kayıt olun." });
  const code = String(Math.floor(100000 + Math.random() * 900000));
  loginCodes[emailNorm] = { code, expiresAt: Date.now() + 10 * 60 * 1000 };
  saveLoginCodes();
  const sent = await sendLoginCodeEmail(emailNorm, code);
  res.json({
    ok: true,
    emailSent: sent,
    message: sent
      ? "Giriş kodu e-postanıza gönderildi"
      : "Kod üretildi ancak e-posta gönderilemedi (SMTP yok veya hata). Geliştirme ortamında kod sunucu konsolunda.",
    ...(process.env.NODE_ENV !== "production" && !sent ? { devLoginCode: code } : {}),
  });
});

// POST /auth/verify-code - Kodu doğrula, token dön (remember=true ise 2 hafta)
app.post("/auth/verify-code", async (req, res) => {
  const { email, code, remember } = req.body || {};
  if (!email || !code || typeof email !== "string" || typeof code !== "string") {
    return res.status(400).json({ error: "Email ve kod gerekli" });
  }
  const emailNorm = email.trim().toLowerCase();
  const data = loginCodes[emailNorm];
  if (!data) return res.status(400).json({ error: "Kod süresi dolmuş. Yeni kod isteyin." });
  if (Date.now() > data.expiresAt) {
    delete loginCodes[emailNorm];
    saveLoginCodes();
    return res.status(400).json({ error: "Kod süresi dolmuş. Yeni kod isteyin." });
  }
  if (data.code !== String(code).trim()) return res.status(401).json({ error: "Geçersiz kod" });
  delete loginCodes[emailNorm];
  saveLoginCodes();
  const user = users.find((u) => u.email === emailNorm);
  if (!user) return res.status(404).json({ error: "Kullanıcı bulunamadı" });
  const verified = user.verified === undefined ? true : !!user.verified;
  const expiresIn = remember ? "14d" : "24h";
  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name, verified },
    JWT_SECRET,
    { expiresIn }
  );
  res.json({
    ok: true,
    token,
    user: { id: user.id, email: user.email, name: user.name, verified },
  });
});

// GET /auth/verify?token=xxx - E-posta doğrulama
app.get("/auth/verify", (req, res) => {
  const token = req.query.token;
  if (!token || typeof token !== "string") {
    return res.status(400).json({ error: "Doğrulama linki geçersiz" });
  }
  const data = verificationTokens[token];
  if (!data) return res.status(400).json({ error: "Doğrulama linki geçersiz veya süresi dolmuş" });
  if (Date.now() > data.expiresAt) {
    delete verificationTokens[token];
    saveVerificationTokens();
    return res.status(400).json({ error: "Doğrulama linkinin süresi dolmuş. Yeni link isteyin." });
  }
  const user = users.find((u) => u.id === data.userId);
  if (!user) return res.status(400).json({ error: "Kullanıcı bulunamadı" });
  user.verified = true;
  saveUsers();
  delete verificationTokens[token];
  saveVerificationTokens();
  res.json({ ok: true, message: "E-posta adresiniz doğrulandı" });
});

// POST /auth/resend-verification - Doğrulama e-postasını tekrar gönder (giriş gerekli)
app.post("/auth/resend-verification", requireAuth, async (req, res) => {
  const user = users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: "Kullanıcı bulunamadı" });
  if (user.verified) return res.status(400).json({ error: "E-posta zaten doğrulanmış" });
  const verifyToken = crypto.randomBytes(32).toString("hex");
  verificationTokens[verifyToken] = { userId: user.id, expiresAt: Date.now() + 24 * 60 * 60 * 1000 };
  saveVerificationTokens();
  const sent = await sendVerificationEmail(user.email, verifyToken);
  const payload = {
    ok: true,
    emailSent: sent,
    message: sent
      ? "Doğrulama e-postası tekrar gönderildi"
      : "E-posta gönderilemedi. SMTP ayarlarını kontrol edin.",
  };
  if (!sent && process.env.NODE_ENV !== "production") {
    payload.devVerificationUrl = verificationUrlForToken(verifyToken);
  }
  res.json(payload);
});

const MAX_FAVORITES = 500;

function ensureUserFavorites(user) {
  if (!user) return [];
  if (!Array.isArray(user.favoritePerfumeIds)) {
    user.favoritePerfumeIds = [];
    saveUsers();
  }
  return user.favoritePerfumeIds;
}

function perfumeIdExists(perfumeId) {
  return perfumes.some((p) => String(p.id) === String(perfumeId));
}

// GET /me/favorites — giriş gerekli, kalıcı beğenilen parfüm id listesi
app.get("/me/favorites", requireAuth, (req, res) => {
  const user = users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: "Kullanıcı bulunamadı" });
  const ids = ensureUserFavorites(user);
  res.json({ ids: [...ids] });
});

// POST /me/favorites — body: { perfumeId }
app.post("/me/favorites", requireAuth, (req, res) => {
  const perfumeId = String(req.body?.perfumeId ?? "").trim();
  if (!perfumeId) return res.status(400).json({ error: "perfumeId gerekli" });
  if (!perfumeIdExists(perfumeId)) {
    return res.status(404).json({ error: "Parfüm bulunamadı" });
  }
  const user = users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: "Kullanıcı bulunamadı" });
  const list = ensureUserFavorites(user);
  if (list.includes(perfumeId)) {
    return res.json({ ok: true, ids: [...list] });
  }
  if (list.length >= MAX_FAVORITES) {
    return res.status(400).json({ error: "Beğenilenler listesi dolu" });
  }
  list.push(perfumeId);
  saveUsers();
  res.json({ ok: true, ids: [...list] });
});

// DELETE /me/favorites/:perfumeId
app.delete("/me/favorites/:perfumeId", requireAuth, (req, res) => {
  const perfumeId = String(req.params.perfumeId);
  const user = users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: "Kullanıcı bulunamadı" });
  const list = ensureUserFavorites(user);
  user.favoritePerfumeIds = list.filter((id) => id !== perfumeId);
  saveUsers();
  res.json({ ok: true, ids: [...user.favoritePerfumeIds] });
});

// PUT /me/favorites — body: { ids: string[] } tam liste (senkron / migrasyon)
app.put("/me/favorites", requireAuth, (req, res) => {
  let bodyIds = req.body?.ids;
  if (!Array.isArray(bodyIds)) {
    return res.status(400).json({ error: "ids bir dizi olmalı" });
  }
  const unique = [...new Set(bodyIds.map((x) => String(x).trim()).filter(Boolean))].slice(
    0,
    MAX_FAVORITES
  );
  const valid = unique.filter((id) => perfumeIdExists(id));
  const user = users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: "Kullanıcı bulunamadı" });
  user.favoritePerfumeIds = valid;
  saveUsers();
  res.json({ ok: true, ids: [...valid] });
});

// GET /auth/me - token ile kullanıcı bilgisi
app.get("/auth/me", (req, res) => {
  const auth = req.headers.authorization;
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : req.query?.token;
  if (!token) return res.status(401).json({ error: "Token gerekli" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = users.find((u) => u.id === decoded.id);
    if (!user) return res.status(401).json({ error: "Kullanıcı bulunamadı" });
    const verified = user.verified === undefined ? true : !!user.verified;
    res.json({
      ok: true,
      user: { id: user.id, email: user.email, name: user.name, verified },
    });
  } catch {
    res.status(401).json({ error: "Geçersiz token" });
  }
});

// POST /perfumes/:id/rate - Kullanıcı değerlendirmesi (1-5) - GİRİŞ + DOĞRULAMA GEREKLİ
app.post("/perfumes/:id/rate", requireAuth, requireVerified, (req, res) => {
  const id = String(req.params.id);
  const perfume = perfumes.find((p) => String(p.id) === id);
  if (!perfume) {
    return res.status(404).json({ error: "Parfüm bulunamadı", id });
  }
  let rating = req.body?.rating;
  if (typeof rating !== "number") rating = parseFloat(rating);
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({ error: "rating 1-5 arası sayı olmalı" });
  }
  rating = Math.round(rating * 10) / 10;
  const clamped = Math.min(5, Math.max(1, rating));
  const userId = req.user.id;

  if (!userRatings[id]) userRatings[id] = { sum: 0, count: 0, byUser: {} };
  if (!userRatings[id].byUser) userRatings[id].byUser = {};
  const prev = userRatings[id].byUser[userId];
  if (prev !== undefined) {
    userRatings[id].sum -= prev;
    userRatings[id].sum += clamped;
  } else {
    userRatings[id].sum += clamped;
    userRatings[id].count += 1;
  }
  userRatings[id].byUser[userId] = clamped;
  saveUserRatings();

  const combined = computeCombinedRating(perfume);
  res.json({
    ok: true,
    rating: combined,
    user_rating_count: userRatings[id].count,
  });
});

// POST /perfumes/:id/comments - Yorum ekle - GİRİŞ + DOĞRULAMA GEREKLİ, MODERASYON
app.post("/perfumes/:id/comments", requireAuth, requireVerified, (req, res) => {
  const id = String(req.params.id);
  const perfume = perfumes.find((p) => String(p.id) === id);
  if (!perfume) return res.status(404).json({ error: "Parfüm bulunamadı", id });
  const text = req.body?.text;
  const mod = moderateText(text);
  if (!mod.ok) return res.status(400).json({ error: mod.reason });
  if (!comments[id]) comments[id] = [];
  const comment = {
    id: String(Date.now()),
    userId: req.user.id,
    userName: req.user.name,
    text: text.trim(),
    createdAt: new Date().toISOString(),
  };
  comments[id].push(comment);
  saveComments();
  res.json({ ok: true, comment });
});

// GET /perfumes/:id/comments - Yorumları listele (zaten /perfumes/:id içinde)

// GET /perfumes/:id/similar - Benzer parfümler (accords overlap)
app.get("/perfumes/:id/similar", (req, res) => {
  const id = req.params.id;
  const limit = Math.min(8, parseInt(req.query.limit, 10) || 6);
  const perfume = perfumes.find((p) => p.id === id || p.id === parseInt(id));
  if (!perfume) {
    return res.status(404).json({ error: "Parfüm bulunamadı", id });
  }

  const accords = new Set(
    (perfume.accords || []).map((a) => String(a).toLowerCase())
  );
  if (accords.size === 0) {
    const data = perfumes
      .filter((p) => String(p.id) !== String(id))
      .slice(0, limit)
      .map(enrichWithRating);
    return res.json({ data });
  }

  const scored = perfumes
    .filter((p) => String(p.id) !== String(id))
    .map((p) => {
      const pAccords = new Set(
        (p.accords || []).map((a) => String(a).toLowerCase())
      );
      let overlap = 0;
      for (const a of accords) {
        if (pAccords.has(a)) overlap += 1;
      }
      const score = overlap / accords.size + (p.rating || 0) * 0.1;
      return { ...p, _score: score };
    })
    .filter((p) => p._score > 0)
    .sort((a, b) => b._score - a._score)
    .slice(0, limit)
    .map(({ _score, ...rest }) => enrichWithRating(rest));

  res.json({ data: scored });
});
// GET / - API bilgisi
app.get("/", (req, res) => {
  res.json({
    name: "Perfiai API",
    version: "1.0.0",
    endpoints: {
      "GET /perfumes": "Liste (q, gender, season, page, limit, sort, order)",
      "GET /perfumes/:id": "Tek parfüm detayı",
      "POST /ai-help": "Site kullanım yardımı (question, path?, locale?)",
    },
    totalPerfumes: perfumes.length,
  });
});

// GET /stats - İstatistik
app.get("/stats", (req, res) => {
  const byGender = perfumes.reduce((acc, p) => {
    const g = p.gender || "unisex";
    acc[g] = (acc[g] || 0) + 1;
    return acc;
  }, {});
  res.json({
    total: perfumes.length,
    byGender,
  });
});

// GET /brands - Benzersiz marka listesi (filtre için)
app.get("/brands", (req, res) => {
  const brands = [...new Set(perfumes.map((p) => p.brand).filter(Boolean))].sort(
    (a, b) => a.localeCompare(b)
  );
  res.json({ brands });
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Perfiai API: http://localhost:${PORT}`);
  console.log(`  GET /perfumes - ${perfumes.length} parfüm`);
});
