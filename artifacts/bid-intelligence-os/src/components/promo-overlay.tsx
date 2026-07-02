import { useEffect, useState } from "react";
import { X, ArrowRight, CalendarCheck } from "lucide-react";

/**
 * PromoOverlay — fullscreen dark overlay that frames the promo film.
 *
 * The film is served at "/promo/" (the app is mounted at "/", so this absolute
 * path is correct). The iframe manages its own play/audio/progress state; this
 * overlay frames it, provides a way to close, and listens for the film's
 * "bios-promo-ended" postMessage to show the end-state CTA over the frozen
 * final frame.
 */
export function PromoOverlay({
  onClose,
  onEnterApp,
}: {
  onClose: () => void;
  onEnterApp: () => void;
}) {
  const [ended, setEnded] = useState(false);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      // The film is served same-origin at /promo/ — ignore messages from anywhere else.
      if (e.origin !== window.location.origin) return;
      if (e.data && typeof e.data === "object" && e.data.type === "bios-promo-ended") {
        setEnded(true);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const handleEnterApp = () => {
    try {
      sessionStorage.setItem("cca-promo-seen", "1");
    } catch {
      /* ignore */
    }
    onEnterApp();
  };

  const handleRequestDemo = () => {
    onClose();
    // Let the overlay unmount, then bring the visitor to the marketing CTA.
    requestAnimationFrame(() => {
      document
        .getElementById("cta")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

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

        {/* End-state CTA over the frozen final frame */}
        {ended && (
          <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center gap-3 pb-8 pt-16 bg-gradient-to-t from-black/85 via-black/50 to-transparent animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={handleRequestDemo}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#38BDF8] text-[#04111e] text-sm font-bold hover:bg-[#5ecbfa] transition-colors shadow-[0_0_50px_-10px_rgba(56,189,248,0.8)]"
                data-testid="button-promo-request-demo"
              >
                <CalendarCheck className="w-4 h-4" />
                Request Demo
              </button>
              <button
                onClick={handleEnterApp}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[#38BDF8]/50 bg-[#38BDF8]/10 text-white text-sm font-bold hover:bg-[#38BDF8]/20 transition-colors backdrop-blur-sm"
                data-testid="button-promo-enter-app"
              >
                Enter Command Center
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[11px] text-white/50">
              Decision-support intelligence — you stay in control of every bid, job, and outcome.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
