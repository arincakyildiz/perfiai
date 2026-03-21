/**
 * Perfiai API temel testleri
 * Çalıştırma: npm test (backend klasöründen)
 * Sunucu otomatik başlatılır ve kapatılır.
 */

import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, "..", "..");
const API_URL = "http://localhost:3001";

let serverProcess = null;

function waitForServer(maxAttempts = 20) {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const check = async () => {
      try {
        const res = await fetch(API_URL);
        if (res.ok) return resolve();
      } catch (_) {}
      attempts++;
      if (attempts >= maxAttempts) return reject(new Error("Sunucu başlamadı"));
      setTimeout(check, 500);
    };
    check();
  });
}

async function runTests() {
  console.log("Perfiai API Testleri\n");

  // Sunucuyu başlat
  serverProcess = spawn("node", ["server.js"], {
    cwd: join(PROJECT_ROOT, "backend"),
    env: { ...process.env, PORT: "3001" },
    stdio: ["ignore", "pipe", "pipe"],
  });

  serverProcess.stderr?.on("data", (d) => process.stderr.write(d));

  try {
    await waitForServer();
    console.log("✓ Sunucu hazır\n");

    let passed = 0;
    let failed = 0;

    // GET /
    try {
      const res = await fetch(API_URL);
      const json = await res.json();
      if (res.ok && json.name === "Perfiai API") {
        console.log("✓ GET / - API bilgisi");
        passed++;
      } else throw new Error("Beklenmeyen cevap");
    } catch (e) {
      console.log("✗ GET / -", e.message);
      failed++;
    }

    // GET /perfumes
    try {
      const res = await fetch(`${API_URL}/perfumes?limit=5`);
      const json = await res.json();
      if (res.ok && Array.isArray(json.data) && json.total >= 0) {
        console.log("✓ GET /perfumes - Liste");
        passed++;
      } else throw new Error("Beklenmeyen cevap");
    } catch (e) {
      console.log("✗ GET /perfumes -", e.message);
      failed++;
    }

    // GET /perfumes/:id
    try {
      const res = await fetch(`${API_URL}/perfumes/1`);
      const json = await res.json();
      if (res.ok && json.id && json.brand) {
        console.log("✓ GET /perfumes/1 - Detay");
        passed++;
      } else if (res.status === 404) {
        console.log("✓ GET /perfumes/1 - 404 (id yok)");
        passed++;
      } else throw new Error("Beklenmeyen cevap");
    } catch (e) {
      console.log("✗ GET /perfumes/:id -", e.message);
      failed++;
    }

    // GET /stats
    try {
      const res = await fetch(`${API_URL}/stats`);
      const json = await res.json();
      if (res.ok && typeof json.total === "number") {
        console.log("✓ GET /stats - İstatistik");
        passed++;
      } else throw new Error("Beklenmeyen cevap");
    } catch (e) {
      console.log("✗ GET /stats -", e.message);
      failed++;
    }

    // GET /me/favorites — yetkisiz
    try {
      const res = await fetch(`${API_URL}/me/favorites`);
      if (res.status === 401) {
        console.log("✓ GET /me/favorites - 401 (giriş yok)");
        passed++;
      } else throw new Error(`Beklenen 401, alınan ${res.status}`);
    } catch (e) {
      console.log("✗ GET /me/favorites auth -", e.message);
      failed++;
    }

    // Kayıt + beğenilenler CRUD
    try {
      const testEmail = `favtest_${Date.now()}@example.invalid`;
      const reg = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: testEmail, name: "Fav Test" }),
      });
      const regJson = await reg.json();
      if (!reg.ok || !regJson.token) throw new Error("Kayıt başarısız");
      const authH = { Authorization: `Bearer ${regJson.token}` };

      let res = await fetch(`${API_URL}/me/favorites`, { headers: authH });
      let j = await res.json();
      if (!res.ok || !Array.isArray(j.ids)) throw new Error("GET favorites boş liste bekleniyordu");
      if (j.ids.length !== 0) throw new Error("Yeni kullanıcıda liste boş olmalı");

      res = await fetch(`${API_URL}/me/favorites`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authH },
        body: JSON.stringify({ perfumeId: "1" }),
      });
      j = await res.json();
      if (!res.ok || !j.ids?.includes("1")) throw new Error("POST favorite başarısız");

      res = await fetch(`${API_URL}/me/favorites/1`, {
        method: "DELETE",
        headers: authH,
      });
      j = await res.json();
      if (!res.ok || j.ids?.length !== 0) throw new Error("DELETE favorite başarısız");

      console.log("✓ /me/favorites - CRUD (test kullanıcı)");
      passed++;
    } catch (e) {
      console.log("✗ /me/favorites CRUD -", e.message);
      failed++;
    }

    // POST /ai-search
    try {
      const res = await fetch(`${API_URL}/ai-search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: "yaz için ferah narenciye",
          limit: 3,
        }),
      });
      const json = await res.json();
      if (res.ok && Array.isArray(json.data) && json.mode) {
        console.log("✓ POST /ai-search - AI arama");
        passed++;
      } else throw new Error("Beklenmeyen cevap");
    } catch (e) {
      console.log("✗ POST /ai-search -", e.message);
      failed++;
    }

    // POST /ai-help
    try {
      const bad = await fetch(`${API_URL}/ai-help`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (bad.status !== 400) throw new Error(`Beklenen 400, alınan ${bad.status}`);

      const res = await fetch(`${API_URL}/ai-help`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: "Kıyaslama nasıl çalışır?",
          path: "/compare",
          locale: "tr",
        }),
      });
      const json = await res.json();
      if (
        res.ok &&
        json.ok &&
        typeof json.answer === "string" &&
        json.answer.length > 0 &&
        (json.mode === "rules" || json.mode === "llm")
      ) {
        console.log("✓ POST /ai-help - Yardım");
        passed++;
      } else throw new Error("Beklenmeyen cevap");
    } catch (e) {
      console.log("✗ POST /ai-help -", e.message);
      failed++;
    }

    console.log(`\n${passed} geçti, ${failed} başarısız`);
    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error("Hata:", err.message);
    process.exit(1);
  } finally {
    if (serverProcess) serverProcess.kill();
  }
}

runTests();
