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

async function sendVerificationEmail(email, token) {
  const transporter = createTransporter();
  if (!transporter) {
    console.warn("SMTP yapılandırılmamış - doğrulama e-postası gönderilemedi. Token:", token);
    return false;
  }
  const verifyUrl = `${SITE_URL.replace(/\/$/, "")}/auth/verify?token=${token}`;
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
}

async function sendLoginCodeEmail(email, code) {
  const transporter = createTransporter();
  if (!transporter) {
    console.warn("SMTP yapılandırılmamış - giriş kodu gönderilemedi. Kod:", code);
    return false;
  }
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
      const accords = (p.accords || []).map((a) => a.toLowerCase());
      const allText = [brand, name, gender, description, ...accords].join(" ");

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

  // Sıralama (order: asc=artan, desc=azalan)
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

// GET /perfumes - Liste (pagination, search, filter)
app.get("/perfumes", (req, res) => {
  const filtered = applyCommonFilters(perfumes, req.query);
  const response = paginate(filtered, req.query);
  response.data = response.data.map(enrichWithRating);
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

  // Ortak filtreleri kullan (gender, season vs.)
  const baseFiltered = applyCommonFilters(perfumes, {
    q: "",
    gender,
    season,
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
        const idx = perfumes.indexOf(p);
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

// POST /auth/register (Kaydet) - Sadece email, 2 haftalık token, kod yok
app.post("/auth/register", async (req, res) => {
  const { email, name } = req.body || {};
  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "Email gerekli" });
  }
  const emailNorm = email.trim().toLowerCase();
  if (emailNorm.length < 3) return res.status(400).json({ error: "Geçerli email girin" });
  let user = users.find((u) => u.email.toLowerCase() === emailNorm);
  if (!user) {
    user = {
      id: String(Date.now()),
      email: emailNorm,
      name: (name || emailNorm.split("@")[0]).trim().slice(0, 50),
      verified: true,
    };
    users.push(user);
    saveUsers();
  }
  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name, verified: true },
    JWT_SECRET,
    { expiresIn: "14d" }
  );
  res.json({
    ok: true,
    token,
    user: { id: user.id, email: user.email, name: user.name, verified: true },
    message: "Kayıt başarılı. 2 hafta boyunca giriş yapmanız gerekmez.",
  });
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
  await sendLoginCodeEmail(emailNorm, code);
  res.json({ ok: true, message: "Giriş kodu e-postanıza gönderildi" });
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
  await sendVerificationEmail(user.email, verifyToken);
  res.json({ ok: true, message: "Doğrulama e-postası tekrar gönderildi" });
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
