/**
 * Demo media URLs.
 *
 * Default promo: the restored inline Replit animated promo film.
 * Override:      VITE_PROMO_FILM_URL (must be .mp4/.webm/.mov/.m4v)
 */

function readUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export const PROMO_FILM_URL = readUrl(import.meta.env.VITE_PROMO_FILM_URL);

export const WALKTHROUGH_VIDEO_URL = readUrl(
  import.meta.env.VITE_WALKTHROUGH_VIDEO_URL,
);

export const HAS_INLINE_WALKTHROUGH = true;

export function isVideoMedia(url: string): boolean {
  return /\.(mp4|webm|ogv|mov|m4v)(\?|#|$)/i.test(url);
}

export const RELATED_DEMO_URL =
  readUrl(import.meta.env.VITE_RELATED_DEMO_URL) ??
  "https://demo.ccavoiceconnect.com/demo";

export const RELATED_DEMO_LABEL = (() => {
  const label = import.meta.env.VITE_RELATED_DEMO_LABEL;
  if (typeof label === "string" && label.trim()) return label.trim();
  return "VoiceConnect Demo";
})();

export function hasRelatedDemo(): boolean {
  return Boolean(RELATED_DEMO_URL);
}
