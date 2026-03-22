/**
 * SMTP bağlantısını doğrular ve isteğe bağlı test e-postası gönderir.
 * Kullanım (backend klasöründen): npm run smtp-check
 * Alıcı belirtmek için: npm run smtp-check -- senin@email.com
 */
import dotenv from "dotenv";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";

const __dirname = dirname(fileURLToPath(import.meta.url));
const backendRoot = join(__dirname, "..");
const projectRoot = join(__dirname, "..", "..");

dotenv.config({ path: join(projectRoot, ".env") });
dotenv.config({ path: join(backendRoot, ".env"), override: true });

const host = process.env.SMTP_HOST?.trim();
const user = process.env.SMTP_USER?.trim();
const pass = process.env.SMTP_PASS?.replace(/\s+/g, "").trim();

if (!host || !user || !pass) {
  console.error("Eksik: SMTP_HOST, SMTP_USER veya SMTP_PASS (.env)");
  process.exit(1);
}

const port = parseInt(process.env.SMTP_PORT || "587", 10);
const secure = process.env.SMTP_SECURE === "1" || port === 465;
const requireTls = !secure && process.env.SMTP_REQUIRE_TLS !== "0";
const relaxTlsVerify =
  process.env.SMTP_TLS_REJECT_UNAUTHORIZED === "0" ||
  process.env.SMTP_TLS_REJECT_UNAUTHORIZED === "false";

const transport = nodemailer.createTransport({
  host,
  port,
  secure,
  auth: { user, pass },
  connectionTimeout: 25_000,
  greetingTimeout: 20_000,
  tls: {
    minVersion: "TLSv1.2",
    ...(relaxTlsVerify ? { rejectUnauthorized: false } : {}),
  },
  ...(requireTls ? { requireTLS: true } : {}),
});

const testTo = process.argv[2]?.trim() || user;

try {
  console.log("SMTP verify() deneniyor…");
  await transport.verify();
  console.log("✓ verify() başarılı");
  console.log("Test e-postası gönderiliyor →", testTo);
  await transport.sendMail({
    from: process.env.SMTP_FROM || user,
    to: testTo,
    subject: "Perfiai SMTP test",
    text: "Bu bir test mesajıdır. Bu e-postayı görüyorsan SMTP çalışıyor.",
  });
  console.log("✓ Gönderim tamam (Gelen kutusu / spam kontrol et)");
} catch (e) {
  console.error("✗ Hata:", e?.message || e);
  if (e?.code) console.error("  Kod:", e.code);
  console.error("\nİpucu: .env içine SMTP_TLS_REJECT_UNAUTHORIZED=0 ekleyip tekrar dene (sadece yerel).");
  process.exit(1);
}
