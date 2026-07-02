import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Clapperboard,
  PlayCircle,
  Volume2,
  X,
} from "lucide-react";
import { WalkthroughPlayer } from "@/components/walkthrough/walkthrough-player";
import { PromoFilmPlayer } from "@/components/promo-film/PromoFilmPlayer";
import {
  HAS_INLINE_WALKTHROUGH,
  PROMO_FILM_URL,
  WALKTHROUGH_VIDEO_URL,
  isVideoMedia,
} from "@/lib/demo-links";

type Panel = "promo" | "walkthrough";

/**
 * Rose Demo modal — visual promo first, then walkthrough / enter choices.
 */
export function DemoWalkthrough({
  allowSound,
  initialPanel = "promo",
  onEnterPlatform,
  onDismiss,
  onGoToHub,
}: {
  allowSound: boolean;
  initialPanel?: Panel;
  onEnterPlatform: () => void;
  /** X button — return to landing page. */
  onDismiss: () => void;
  /** Video end, backdrop, or time-update fallback — open demo choice hub. */
  onGoToHub: () => void;
}) {
  const [panel, setPanel] = useState<Panel>(initialPanel);
  const [promoKey, setPromoKey] = useState(0);

  const replayPromo = () => {
    setPanel("promo");
    setPromoKey((k) => k + 1);
  };

  const openWalkthrough = () => {
    if (WALKTHROUGH_VIDEO_URL) {
      window.open(WALKTHROUGH_VIDEO_URL, "_blank", "noopener,noreferrer");
      return;
    }
    if (HAS_INLINE_WALKTHROUGH) {
      setPanel("walkthrough");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Rose Demo"
      onClick={onGoToHub}
    >
      <div
        className="relative w-full max-w-4xl rounded-2xl border border-white/10 bg-[#0B1220] shadow-[0_0_80px_rgba(56,189,248,0.2)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onDismiss}
          aria-label="Close and return to landing page"
          className="absolute top-3.5 right-3.5 z-20 p-2 rounded-lg text-slate-300 hover:text-white bg-black/50 border border-white/15 hover:bg-white/10 transition-colors"
          data-testid="button-walkthrough-dismiss"
        >
          <X className="w-4 h-4" />
        </button>

        {panel === "promo" ? (
          <>
            <PromoMedia allowSound={allowSound} replayKey={promoKey} onFinished={onGoToHub} />
            <div className="p-6 sm:p-8 text-center border-t border-white/5">
              <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#6B7794]">
                CCA BidIntelligenceOS · Rose Demo
              </span>
              <h2 className="text-2xl font-bold text-white mt-2 mb-2">
                Research Less, Win More
              </h2>
              <p className="text-sm leading-relaxed text-slate-400 mb-6 max-w-lg mx-auto">
                Watch the promo film, take the narrated walkthrough, or step
                straight into the live Command Center demo.
              </p>
              <div className="flex flex-col sm:flex-row items-stretch justify-center gap-3">
                <button
                  type="button"
                  onClick={openWalkthrough}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-[#38BDF8]/40 bg-[#38BDF8]/10 text-[#7dd3fc] font-semibold text-sm hover:bg-[#38BDF8]/20 hover:text-white transition-colors"
                  data-testid="button-watch-walkthrough"
                >
                  <PlayCircle className="w-4 h-4" />
                  Watch Walkthrough
                </button>
                <button
                  type="button"
                  onClick={replayPromo}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-white/15 bg-white/5 text-white font-semibold text-sm hover:bg-white/10 transition-colors"
                  data-testid="button-watch-promo"
                >
                  <Clapperboard className="w-4 h-4" />
                  Watch Promo
                </button>
                <button
                  type="button"
                  onClick={onEnterPlatform}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-b from-[#4CC4FB] to-[#2A9BD8] text-[#04121F] font-semibold text-sm transition-all shadow-[0_0_36px_rgba(56,189,248,0.4)] hover:shadow-[0_0_48px_rgba(56,189,248,0.6)]"
                  data-testid="button-walkthrough-enter"
                >
                  Enter Demo <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4 pr-10">
              <h2 className="text-lg font-bold text-white">Product Walkthrough</h2>
              <button
                type="button"
                onClick={replayPromo}
                className="text-xs font-semibold text-[#7dd3fc] hover:text-white transition-colors"
                data-testid="button-back-to-promo"
              >
                ← Back to Promo
              </button>
            </div>
            <WalkthroughPlayer />
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={replayPromo}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-white/15 bg-white/5 text-white font-semibold text-sm hover:bg-white/10 transition-colors"
                data-testid="button-watch-promo-inline"
              >
                <Clapperboard className="w-4 h-4" />
                Watch Promo
              </button>
              <button
                type="button"
                onClick={onEnterPlatform}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-b from-[#4CC4FB] to-[#2A9BD8] text-[#04121F] font-semibold text-sm shadow-[0_0_36px_rgba(56,189,248,0.4)]"
                data-testid="button-walkthrough-enter-inline"
              >
                Enter Demo <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PromoMedia({
  allowSound,
  replayKey,
  onFinished,
}: {
  allowSound: boolean;
  replayKey: number;
  onFinished: () => void;
}) {
  if (PROMO_FILM_URL && isVideoMedia(PROMO_FILM_URL)) {
    return (
      <HostedVideoPlayer
        url={PROMO_FILM_URL}
        allowSound={allowSound}
        replayKey={replayKey}
        onFinished={onFinished}
      />
    );
  }

  return <PromoFilmPlayer allowSound={allowSound} replayKey={replayKey} onEnded={onFinished} />;
}

function HostedVideoPlayer({
  url,
  allowSound,
  replayKey,
  onFinished,
}: {
  url: string;
  allowSound: boolean;
  replayKey: number;
  onFinished: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [needsTap, setNeedsTap] = useState(!allowSound);
  const finished = useRef(false);

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    onFinished();
  }, [onFinished]);

  useEffect(() => {
    finished.current = false;
  }, [replayKey, url]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = !allowSound;
    if (allowSound) {
      el.volume = 1;
      void el.play()
        .then(() => setNeedsTap(false))
        .catch(() => setNeedsTap(true));
    } else {
      void el.play().catch(() => undefined);
    }
  }, [allowSound, replayKey, url]);

  const enableSound = () => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = false;
    el.volume = 1;
    void el.play().then(() => setNeedsTap(false));
  };

  const handleTimeUpdate = () => {
    const el = videoRef.current;
    if (!el || !Number.isFinite(el.duration) || el.duration <= 0) return;
    if (el.currentTime >= el.duration - 0.3) finish();
  };

  return (
    <div className="relative w-full aspect-video bg-black">
      <video
        key={`${url}-${replayKey}`}
        ref={videoRef}
        src={url}
        autoPlay
        muted={!allowSound}
        playsInline
        controls
        onEnded={finish}
        onTimeUpdate={handleTimeUpdate}
        className="w-full h-full object-contain"
        data-testid="video-promo"
      />
      {needsTap && (
        <button
          type="button"
          onClick={enableSound}
          className="absolute bottom-3 right-3 z-10 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-black/75 border border-white/20 text-white text-xs font-semibold"
          data-testid="button-promo-sound"
        >
          <Volume2 className="w-3.5 h-3.5" /> Tap for sound
        </button>
      )}
    </div>
  );
}
