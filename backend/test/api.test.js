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
