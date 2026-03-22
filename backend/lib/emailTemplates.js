/**
 * Perfiai markasına uyumlu HTML e-postalar (inline CSS, tablo düzeni).
 * tr / en içerik; kayıt diline göre şablon seçilir.
 */

const BRAND_NAME = "Perfiai";
const VIOLET = "#7c3aed";
const VIOLET_DARK = "#6d28d9";
const PINK = "#ec4899";
const INK = "#1c1917";
const MUTED = "#78716c";
const LINE = "#e7e5e4";
const PAGE_BG = "#f5f5f4";

const MAX_DISPLAY_NAME_LEN = 80;

/** @param {unknown} raw */
export function normalizeEmailLocale(raw) {
  const s = String(raw || "").trim().toLowerCase();
  return s === "en" ? "en" : "tr";
}

function escHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function safeNameHtml(name) {
  const n = String(name ?? "")
    .trim()
    .slice(0, MAX_DISPLAY_NAME_LEN);
  if (!n) return "";
  return escHtml(n);
}

function safeNameText(name) {
  return String(name ?? "")
    .trim()
    .slice(0, MAX_DISPLAY_NAME_LEN)
    .replace(/[\r\n]/g, " ");
}

/** @param {unknown} name @param {"tr"|"en"} locale */
function greetingHtml(name, locale) {
  const inner = safeNameHtml(name);
  if (locale === "en") {
    if (!inner) return "Hello,";
    return `Hello ${inner},`;
  }
  if (!inner) return "Merhaba,";
  return `Merhaba ${inner},`;
}

/** @param {unknown} name @param {"tr"|"en"} locale */
function greetingText(name, locale) {
  const inner = safeNameText(name);
  if (locale === "en") {
    if (!inner) return "Hello,";
    return `Hello ${inner},`;
  }
  if (!inner) return "Merhaba,";
  return `Merhaba ${inner},`;
}

/** @param {"tr"|"en"} locale */
export function verificationEmailSubject(locale) {
  return locale === "en"
    ? "Perfiai — Verify your email"
    : "Perfiai - E-posta adresinizi doğrulayın";
}

/** @param {"tr"|"en"} locale */
export function loginCodeEmailSubject(locale) {
  return locale === "en" ? "Perfiai — Your sign-in code" : "Perfiai - Giriş kodunuz";
}

const VERIFY = {
  tr: {
    htmlLang: "tr",
    docTitle: `${BRAND_NAME} — E-posta doğrulama`,
    tagline: "AI ile parfüm keşfi",
    heading: "Hesabınızı doğrulayın",
    welcome: "Sizi aramızda görmekten çok mutluyuz!",
    intro: `${BRAND_NAME}&apos;de hesabınız oluşturuldu. E-posta adresinizi onaylamak için aşağıdaki düğmeye tıklayın.`,
    cta: "E-postamı doğrula",
    pasteLink: "Düğme çalışmıyorsa bu bağlantıyı tarayıcıya yapıştırın:",
    timeLabel: "Süre",
    timeBody:
      "Bu bağlantı <strong>3 dakika</strong> geçerlidir. Süre dolarsa uygulamadan &quot;Doğrulama e-postasını tekrar gönder&quot; ile yeni link isteyebilirsiniz.",
    footer1: "Bu e-postayı siz talep etmediyseniz yok sayabilirsiniz.",
    goTo: `${BRAND_NAME}&apos;e git`,
    footer2: "Parfüm keşfi, puanlama ve yorumlar",
    textHead: `${BRAND_NAME} — E-posta doğrulama`,
    textIntro: `${BRAND_NAME}'de hesabınız oluşturuldu. E-posta adresinizi doğrulamak için bağlantıya tıklayın:`,
    textTime:
      "Bu bağlantı 3 dakika geçerlidir. Süre dolarsa uygulamadan yeni doğrulama e-postası isteyin.",
  },
  en: {
    htmlLang: "en",
    docTitle: `${BRAND_NAME} — Verify your email`,
    tagline: "AI-powered fragrance discovery",
    heading: "Confirm your email",
    welcome: "We're so happy to have you with us!",
    intro: `Your ${BRAND_NAME} account is almost ready. Please verify your email address using the button below.`,
    cta: "Verify my email",
    pasteLink: "If the button doesn&apos;t work, copy and paste this link into your browser:",
    timeLabel: "Expiry",
    timeBody:
      "This link is valid for <strong>3 minutes</strong>. If it expires, request a new verification email from the app.",
    footer1: "If you didn&apos;t create an account, you can safely ignore this email.",
    goTo: `Open ${BRAND_NAME}`,
    footer2: "Discover fragrances, rate, and comment",
    textHead: `${BRAND_NAME} — Email verification`,
    textIntro: `Your ${BRAND_NAME} account was created. Open the link below to verify your email:`,
    textTime:
      "This link is valid for 3 minutes. If it expires, request a new verification email from the app.",
  },
};

const LOGIN = {
  tr: {
    htmlLang: "tr",
    docTitle: `${BRAND_NAME} — Giriş kodu`,
    tagline: "Güvenli giriş",
    welcomeExtra: "Sizi tekrar aramızda görmek çok güzel!",
    heading: "Giriş kodunuz",
    hint: "Bu kodu yalnızca siz istediyseniz aşağıya girin. Kimseyle paylaşmayın.",
    timeLine:
      "Kod <strong>3 dakika</strong> geçerlidir. Süre dolunca giriş ekranından yeni kod isteyin.",
    footer: "Bu e-postayı siz istemediyseniz güvenle yok sayın.",
    textHead: `${BRAND_NAME} — Giriş kodunuz`,
    textCodeLabel: "Kodunuz:",
    textTime: "Bu kod 3 dakika geçerlidir.",
  },
  en: {
    htmlLang: "en",
    docTitle: `${BRAND_NAME} — Sign-in code`,
    tagline: "Secure sign-in",
    welcomeExtra: "Great to see you again!",
    heading: "Your sign-in code",
    hint: "If you requested this code, enter it in the app. Never share it with anyone.",
    timeLine:
      "This code is valid for <strong>3 minutes</strong>. When it expires, request a new code from the sign-in screen.",
    footer: "If you didn&apos;t request this email, you can safely ignore it.",
    textHead: `${BRAND_NAME} — Sign-in code`,
    textCodeLabel: "Your code:",
    textTime: "This code is valid for 3 minutes.",
  },
};

/**
 * @param {string} verifyUrl
 * @param {{ siteUrl?: string; name?: string; locale?: string }} [opts]
 */
export function buildVerificationEmailHtml(verifyUrl, opts = {}) {
  const locale = normalizeEmailLocale(opts.locale);
  const S = VERIFY[locale];
  const safeUrl = escHtml(verifyUrl);
  const homeUrl = escHtml((opts.siteUrl || "").replace(/\/$/, "") || "#");
  const greet = greetingHtml(opts.name, locale);

  return `<!DOCTYPE html>
<html lang="${S.htmlLang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${escHtml(S.docTitle)}</title>
</head>
<body style="margin:0;padding:0;background-color:${PAGE_BG};-webkit-text-size-adjust:100%;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:${PAGE_BG};">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:560px;background-color:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 25px 50px -12px rgba(124,58,237,0.12);border:1px solid ${LINE};">
          <tr>
            <td style="background:linear-gradient(135deg, ${VIOLET} 0%, ${VIOLET_DARK} 45%, #4c1d95 100%);padding:28px 32px;text-align:center;">
              <div style="font-family:Segoe UI,system-ui,-apple-system,BlinkMacSystemFont,sans-serif;font-size:22px;font-weight:800;letter-spacing:-0.02em;color:#fafafa;">
                ${BRAND_NAME}
              </div>
              <div style="font-family:Segoe UI,system-ui,sans-serif;font-size:13px;color:rgba(250,250,250,0.85);margin-top:6px;">
                ${S.tagline}
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:36px 32px 28px;font-family:Segoe UI,system-ui,-apple-system,sans-serif;">
              <h1 style="margin:0 0 12px;font-size:22px;font-weight:700;color:${INK};line-height:1.3;">
                ${S.heading}
              </h1>
              <p style="margin:0 0 14px;font-size:16px;line-height:1.6;color:#44403c;">
                ${greet}
              </p>
              <p style="margin:0 0 20px;padding:14px 18px;font-size:15px;line-height:1.55;color:#5b21b6;background:linear-gradient(90deg,rgba(124,58,237,0.08) 0%,rgba(236,72,153,0.08) 100%);border-left:4px solid ${VIOLET};border-radius:0 12px 12px 0;">
                <strong style="color:${VIOLET};">${S.welcome}</strong>
              </p>
              <p style="margin:0 0 20px;font-size:16px;line-height:1.6;color:#44403c;">
                ${S.intro}
              </p>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding:8px 0 24px;">
                    <!--[if mso]>
                    <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" href="${safeUrl}" style="height:48px;v-text-anchor:middle;width:280px;" arcsize="12%" stroke="f" fillcolor="${VIOLET}">
                      <w:anchorlock/>
                      <center style="color:#ffffff;font-family:Segoe UI,sans-serif;font-size:15px;font-weight:600;">${escHtml(S.cta)}</center>
                    </v:roundrect>
                    <![endif]-->
                    <!--[if !mso]><!-- -->
                    <a href="${safeUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:16px 40px;font-family:Segoe UI,system-ui,sans-serif;font-size:16px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:14px;background:linear-gradient(90deg,${VIOLET} 0%,${PINK} 100%);box-shadow:0 10px 25px -8px rgba(124,58,237,0.45);">
                      ${S.cta}
                    </a>
                    <!--<![endif]-->
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 8px;font-size:13px;line-height:1.5;color:${MUTED};">
                ${S.pasteLink}
              </p>
              <p style="margin:0 0 24px;font-size:12px;line-height:1.5;word-break:break-all;color:${VIOLET};">
                <a href="${safeUrl}" style="color:${VIOLET};text-decoration:underline;">${safeUrl}</a>
              </p>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#faf5ff;border:1px solid #e9d5ff;border-radius:14px;">
                <tr>
                  <td style="padding:16px 18px;font-family:Segoe UI,system-ui,sans-serif;font-size:13px;line-height:1.55;color:#5b21b6;">
                    <strong style="display:block;margin-bottom:6px;color:${VIOLET};">⏱ ${S.timeLabel}</strong>
                    ${S.timeBody}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 28px;font-family:Segoe UI,system-ui,sans-serif;font-size:12px;line-height:1.5;color:${MUTED};text-align:center;">
              <p style="margin:0 0 12px;">
                ${S.footer1}
              </p>
              <p style="margin:0;">
                <a href="${homeUrl}" style="color:${VIOLET};text-decoration:none;font-weight:600;">${S.goTo}</a>
                <span style="color:${LINE};">&nbsp;·&nbsp;</span>
                <span style="color:#a8a29e;">${S.footer2}</span>
              </p>
            </td>
          </tr>
        </table>
        <p style="margin:24px 0 0;font-family:Segoe UI,system-ui,sans-serif;font-size:11px;color:#a8a29e;max-width:560px;">
          © ${new Date().getFullYear()} ${BRAND_NAME}
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * @param {string} verifyUrl
 * @param {{ name?: string; locale?: string }} [opts]
 */
export function buildVerificationEmailText(verifyUrl, opts = {}) {
  const locale = normalizeEmailLocale(opts.locale);
  const S = VERIFY[locale];
  const greet = greetingText(opts.name, locale);
  return [
    S.textHead,
    "",
    greet,
    "",
    S.welcome,
    "",
    S.textIntro,
    verifyUrl,
    "",
    S.textTime,
    "",
    `— ${BRAND_NAME}`,
  ].join("\n");
}

/**
 * @param {string} code
 * @param {{ name?: string; locale?: string }} [opts]
 */
export function buildLoginCodeEmailHtml(code, opts = {}) {
  const locale = normalizeEmailLocale(opts.locale);
  const L = LOGIN[locale];
  const safeCode = escHtml(code);
  const greet = greetingHtml(opts.name, locale);

  return `<!DOCTYPE html>
<html lang="${L.htmlLang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escHtml(L.docTitle)}</title>
</head>
<body style="margin:0;padding:0;background-color:${PAGE_BG};-webkit-text-size-adjust:100%;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:${PAGE_BG};">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:560px;background-color:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 25px 50px -12px rgba(124,58,237,0.12);border:1px solid ${LINE};">
          <tr>
            <td style="background:linear-gradient(135deg, ${VIOLET} 0%, ${VIOLET_DARK} 45%, #4c1d95 100%);padding:28px 32px;text-align:center;">
              <div style="font-family:Segoe UI,system-ui,sans-serif;font-size:22px;font-weight:800;color:#fafafa;">${BRAND_NAME}</div>
              <div style="font-family:Segoe UI,system-ui,sans-serif;font-size:13px;color:rgba(250,250,250,0.85);margin-top:6px;">${L.tagline}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:36px 32px 28px;font-family:Segoe UI,system-ui,sans-serif;text-align:center;">
              <p style="margin:0 0 12px;font-size:16px;line-height:1.5;color:#44403c;">
                ${greet}
              </p>
              <p style="margin:0 0 18px;padding:12px 16px;font-size:14px;line-height:1.5;color:#5b21b6;background:rgba(124,58,237,0.07);border-radius:12px;">
                <strong style="color:${VIOLET};">${L.welcomeExtra}</strong>
              </p>
              <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:${INK};">${L.heading}</h1>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#44403c;">
                ${L.hint}
              </p>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto 24px;background:linear-gradient(135deg,#faf5ff 0%,#fdf2f8 100%);border:2px dashed #d8b4fe;border-radius:16px;">
                <tr>
                  <td style="padding:24px 40px;font-family:ui-monospace,Consolas,monospace;font-size:32px;font-weight:800;letter-spacing:0.35em;color:${VIOLET};">
                    ${safeCode}
                  </td>
                </tr>
              </table>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#faf5ff;border:1px solid #e9d5ff;border-radius:14px;">
                <tr>
                  <td style="padding:14px 18px;font-size:13px;line-height:1.5;color:#5b21b6;">
                    <strong style="color:${VIOLET};">⏱</strong> ${L.timeLine}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 28px;font-family:Segoe UI,system-ui,sans-serif;font-size:12px;color:${MUTED};text-align:center;">
              ${L.footer}
            </td>
          </tr>
        </table>
        <p style="margin:24px 0 0;font-size:11px;color:#a8a29e;font-family:Segoe UI,sans-serif;">© ${new Date().getFullYear()} ${BRAND_NAME}</p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * @param {string} code
 * @param {{ name?: string; locale?: string }} [opts]
 */
export function buildLoginCodeEmailText(code, opts = {}) {
  const locale = normalizeEmailLocale(opts.locale);
  const L = LOGIN[locale];
  const greet = greetingText(opts.name, locale);
  return [
    L.textHead,
    "",
    greet,
    "",
    L.welcomeExtra,
    "",
    `${L.textCodeLabel} ${code}`,
    "",
    L.textTime,
    "",
    `— ${BRAND_NAME}`,
  ].join("\n");
}
