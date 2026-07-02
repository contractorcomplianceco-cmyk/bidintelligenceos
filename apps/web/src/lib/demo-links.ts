/**
 * Demo video sources.
 *
 * - VITE_WALKTHROUGH_VIDEO_URL — narrated product walkthrough video
 *   (external link; the "Watch Walkthrough" button is hidden when blank).
 * - VITE_PROMO_FILM_URL — cinematic promo film. When blank, the app falls
 *   back to the default local file at /promo/promo-video.mp4
 *   (apps/web/public/promo/promo-video.mp4 in the repo).
 *
 * If the local promo video file has not been uploaded yet, the demo modal
 * detects the missing file and shows a temporary audio preview instead
 * (/promo/composite_audio.mp3).
 */

function readUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

const BASE = import.meta.env.BASE_URL ?? "/";

/** Default expected promo video path (upload the real file here). */
export const DEFAULT_PROMO_VIDEO_PATH = `${BASE}promo/promo-video.mp4`;

/** Temporary audio fallback used while the promo video is missing. */
export const PROMO_AUDIO_FALLBACK_PATH = `${BASE}promo/composite_audio.mp3`;

export const WALKTHROUGH_VIDEO_URL = readUrl(
  import.meta.env.VITE_WALKTHROUGH_VIDEO_URL,
);

/** External promo URL when configured; otherwise null (use the local default). */
export const PROMO_FILM_URL = readUrl(import.meta.env.VITE_PROMO_FILM_URL);

/** The promo source the app should try to play. */
export const PROMO_SOURCE = PROMO_FILM_URL ?? DEFAULT_PROMO_VIDEO_PATH;
