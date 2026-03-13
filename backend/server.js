/**
 * Perfiai Backend API
 * GET /perfumes - Liste (pagination, search, filter)
 * GET /perfumes/:id - Tek parfüm detayı
 */

import express from "express";
import cors from "cors";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const DATA_PATH = join(__dirname, "..", "data", "perfumes.json");
// SentenceTransformers ile önceden üretilmiş embedding dosyası
const EMBEDDINGS_PATH = join(
  __dirname,
  "..",
  "data",
  "perfume_embeddings_st.json"
);

let perfumes = [];
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

// GET /perfumes/:id - Tek parfüm
app.get("/perfumes/:id", (req, res) => {
  const id = req.params.id;
  const perfume = perfumes.find((p) => p.id === id || p.id === parseInt(id));
  if (!perfume) {
    return res.status(404).json({ error: "Parfüm bulunamadı", id });
  }
  res.json(perfume);
});

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
    return res.json({ data: perfumes.filter((p) => p.id !== id).slice(0, limit) });
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
    .map(({ _score, ...rest }) => rest);

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
