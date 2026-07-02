import { X } from "lucide-react";

/**
 * PromoOverlay — fullscreen dark overlay that frames the promo film.
 *
 * The film is served at "/promo/" (the app is mounted at "/", so this absolute
 * path is correct). The iframe manages its own play/audio state; this overlay
 * only frames it and provides a way to close.
 */
export function PromoOverlay({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <button
          onClick={onClose}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/20 bg-white/10 text-white text-sm font-semibold hover:bg-white/20 transition-colors backdrop-blur-sm"
          data-testid="button-skip-promo"
        >
          Skip to site
        </button>
        <button
          onClick={onClose}
          aria-label="Close promo film"
          className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-white/20 bg-white/10 text-white hover:bg-white/20 transition-colors backdrop-blur-sm"
          data-testid="button-close-promo"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Film frame */}
      <div className="relative w-full max-w-6xl aspect-video rounded-xl overflow-hidden border border-white/10 shadow-[0_30px_120px_-20px_rgba(0,0,0,0.9)] bg-black">
        <iframe
          src="/promo/"
          title="CCA BidIntelligenceOS — Promo Film"
          className="absolute inset-0 w-full h-full"
          allow="autoplay; fullscreen"
          allowFullScreen
        />
      </div>
    </div>
  );
}
