/**
 * Backend API base URL.
 * 127.0.0.1 often works more reliably than localhost (avoids IPv6 issues).
 */
const DEFAULT_API = "http://127.0.0.1:3001";

export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || DEFAULT_API;

export function apiUrl(path: string): string {
  const base = API_BASE.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}
