/**
 * Demo media URLs.
 *
 * Default promo: apps/web/public/promo/promo-video.mp4
 * Override:      VITE_PROMO_FILM_URL (must be .mp4/.webm/.mov/.m4v)
 *
 * IMPORTANT: No pre-rendered promo video exists in git history. Only
 * composite_audio.mp3 was exported from Replit. Upload promo-video.mp4
 * to enable the visual promo popup.
 */

function readUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

const base = import.meta.env.BASE_URL.replace(/\/?$/, "/");

/** Default bundled promo video path (file must be uploaded — not in repo). */
export const PROMO_VIDEO_FILE = `${base}promo/promo-video.mp4`;

/** Temporary audio-only fallback when promo-video.mp4 is missing. */
export const PROMO_AUDIO_FALLBACK = `${base}promo/composite_audio.mp3`;

export const PROMO_FILM_URL = readUrl(import.meta.env.VITE_PROMO_FILM_URL);

export const WALKTHROUGH_VIDEO_URL = readUrl(
  import.meta.env.VITE_WALKTHROUGH_VIDEO_URL,
);

export const HAS_INLINE_WALKTHROUGH = true;

export function isVideoMedia(url: string): boolean {
  return /\.(mp4|webm|ogv|mov|m4v)(\?|#|$)/i.test(url);
}

/** Resolved promo video URL: env override (video only) or default mp4 path. */
export function resolvePromoVideoUrl(): string {
  if (PROMO_FILM_URL && isVideoMedia(PROMO_FILM_URL)) {
    return PROMO_FILM_URL;
  }
  return PROMO_VIDEO_FILE;
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
