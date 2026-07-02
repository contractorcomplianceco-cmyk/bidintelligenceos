/**
 * External demo video links, configured via environment variables.
 *
 * - VITE_WALKTHROUGH_VIDEO_URL — narrated product walkthrough video
 * - VITE_PROMO_FILM_URL        — cinematic promo film
 *
 * Each link renders only when its URL is set; blank/missing values hide
 * that specific link. The videos are hosted externally — no video app
 * code ships with this repo.
 */

function readUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export const WALKTHROUGH_VIDEO_URL = readUrl(
  import.meta.env.VITE_WALKTHROUGH_VIDEO_URL,
);

export const PROMO_FILM_URL = readUrl(import.meta.env.VITE_PROMO_FILM_URL);
