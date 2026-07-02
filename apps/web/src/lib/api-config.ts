/**
 * API base URL for backend calls.
 *
 * - VITE_API_BASE_URL — explicit override (e.g. https://api.yourdomain.com)
 * - Dev default: empty string (Vite proxies /api → local API on :5001)
 * - Prod default: empty string (same-origin when API serves the built SPA)
 */
function readBaseUrl(value: unknown): string {
  if (typeof value === "string") {
    return value.trim().replace(/\/$/, "");
  }
  return "";
}

export const API_BASE_URL = readBaseUrl(import.meta.env.VITE_API_BASE_URL);

export function apiUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return API_BASE_URL ? `${API_BASE_URL}${normalized}` : normalized;
}
