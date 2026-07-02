import { useMemo, useRef, useState } from "react";
import {
  Compass,
  ScanSearch,
  BrainCircuit,
  TrendingUp,
  ArrowRight,
  ArrowLeft,
  PlayCircle,
  Volume2,
  Music,
  X,
} from "lucide-react";
import { markWalkthroughComplete } from "@/lib/demo-mode";
import {
  WALKTHROUGH_VIDEO_URL,
  PROMO_SOURCE,
  PROMO_AUDIO_FALLBACK_PATH,
} from "@/lib/demo-links";

/**
 * DemoWalkthrough — the demo entry modal. "Launch Demo" on the landing page
 * opens this modal first; "Enter Demo" inside it is the only path into the
 * dashboard, and the X returns to the landing page.
 *
 * Behavior:
 * - The promo film plays first (muted autoplay where technically possible;
 *   the visitor clicks to enable sound). The source is VITE_PROMO_FILM_URL
 *   when set, otherwise the default local file /promo/promo-video.mp4.
 * - If the promo video file is missing, a temporary audio preview
 *   (/promo/composite_audio.mp3) is offered instead.
 * - Choices: "Watch Walkthrough" (opens VITE_WALKTHROUGH_VIDEO_URL in a new
 *   tab, hidden when unset), "Watch Promo" (opens the promo in a new tab,
 *   hidden while the video file is missing), and "Enter Demo" (closes the
 *   modal, routes into the dashboard, and disables the modal via
 *   localStorage).
 * - A quick 5-step guided tour remains available as a secondary option.
 */

type Step = {
  icon: typeof Compass;
  kicker: string;
  title: string;
  body: string;
  points: string[];
};

const STEPS: Step[] = [
  {
    icon: Compass,
    kicker: "Step 1 · What it is",
    title: "Welcome to CCA BidIntelligenceOS",
    body: "A bid intelligence workspace built for commercial trade contractors — HVAC, roofing, electrical, concrete, facilities, and more. It brings your entire bid-to-job lifecycle into one command center.",
    points: [
      "One workspace from opportunity to closeout",
      "Built around how trade contractors actually bid",
      "Adapts to your business vertical",
    ],
  },
  {
    icon: ScanSearch,
    kicker: "Step 2 · What it analyzes",
    title: "Every angle of an opportunity",
    body: "The platform structures each bid across scope, cost inputs, fit, and risk — so nothing gets decided on a hunch.",
    points: [
      "Scope analysis and cost structuring",
      "Bid-fit scoring against your strengths and capacity",
      "Market signals, compliance posture, and job-site risk",
    ],
  },
  {
    icon: BrainCircuit,
    kicker: "Step 3 · How results are generated",
    title: "Decision support, not auto-pilot",
    body: "Insights are assembled from your inputs and the platform's structured bid data, then flagged for your review. Nothing is auto-submitted, and no outcome is ever guaranteed.",
    points: [
      "Every recommendation is framed \"flagged for review\"",
      "You always see the rationale behind an insight",
      "Final calls stay with you — the OS informs, you decide",
    ],
  },
  {
    icon: TrendingUp,
    kicker: "Step 4 · The value",
    title: "Research less, win more",
    body: "Contractors use BidIntelligenceOS to spend less time assembling research and more time on the bids worth winning — then feed every outcome back into smarter future bids.",
    points: [
      "Faster go / no-go decisions with structured intelligence",
      "Vendor-ready bid packages without exposing internal strategy",
      "Won jobs flow straight into deployment, tracking, and closeout",
    ],
  },
];

/** Classify the promo URL so we can embed it with muted autoplay. */
function promoEmbed(url: string):
  | { kind: "video"; src: string }
  | { kind: "iframe"; src: string } {
  if (/\.(mp4|webm|ogv|ogg|mov)(\?|#|$)/i.test(url)) {
    return { kind: "video", src: url };
  }
  // YouTube — normalize to the embed player with muted autoplay.
  const yt = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/i,
  );
  if (yt) {
    return {
      kind: "iframe",
      src: `https://www.youtube.com/embed/${yt[1]}?autoplay=1&mute=1&playsinline=1&rel=0`,
    };
  }
  // Vimeo — normalize to the player with muted autoplay.
  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
  if (vm) {
    return {
      kind: "iframe",
      src: `https://player.vimeo.com/video/${vm[1]}?autoplay=1&muted=1`,
    };
  }
  // Unknown host — embed as-is (autoplay depends on the host's own policy).
  return { kind: "iframe", src: url };
}

function PromoPlayer({
  url,
  onMissing,
}: {
  url: string;
  onMissing: () => void;
}) {
  const embed = useMemo(() => promoEmbed(url), [url]);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [muted, setMuted] = useState(true);

  const enableSound = () => {
    const el = videoRef.current;
    if (el) {
      el.muted = false;
      el.volume = 1;
    }
    setMuted(false);
  };

  return (
    <div className="relative w-full aspect-video bg-black">
      {embed.kind === "video" ? (
        <>
          <video
            ref={videoRef}
            src={embed.src}
            autoPlay
            muted
            playsInline
            controls
            onError={onMissing}
            onVolumeChange={(e) => setMuted(e.currentTarget.muted)}
            className="w-full h-full object-contain"
            data-testid="video-promo"
          />
          {muted && (
            <button
              onClick={enableSound}
              className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-black/70 border border-white/20 text-white text-xs font-semibold hover:bg-black/90 transition-colors"
              data-testid="button-promo-sound"
            >
              <Volume2 className="w-3.5 h-3.5" /> Tap for sound
            </button>
          )}
        </>
      ) : (
        <iframe
          src={embed.src}
          title="Promo film"
          className="w-full h-full"
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
          allowFullScreen
          data-testid="iframe-promo"
        />
      )}
    </div>
  );
}

export function DemoWalkthrough({
  onEnterPlatform,
  onDismiss,
}: {
  onEnterPlatform: () => void;
  onDismiss: () => void;
}) {
  const [view, setView] = useState<"intro" | "tour">("intro");
  const [step, setStep] = useState(0);
  const [promoMissing, setPromoMissing] = useState(false);

  const handleEnter = () => {
    markWalkthroughComplete();
    onEnterPlatform();
  };

  const isFinal = step === STEPS.length;
  const current = STEPS[Math.min(step, STEPS.length - 1)];
  const Icon = current.icon;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#05080F]/90 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Demo introduction"
    >
      <div className="relative w-full max-w-xl rounded-2xl border border-white/10 bg-[#0B1220] shadow-[0_0_80px_rgba(56,189,248,0.15)] overflow-hidden">
        <button
          onClick={onDismiss}
          aria-label="Close and return to the landing page"
          className="absolute top-3.5 right-3.5 z-10 p-1.5 rounded-md text-slate-400 hover:text-white bg-black/30 hover:bg-white/10 transition-colors"
          data-testid="button-walkthrough-dismiss"
        >
          <X className="w-4 h-4" />
        </button>

        {view === "intro" ? (
          <div>
            {!promoMissing ? (
              <PromoPlayer
                url={PROMO_SOURCE}
                onMissing={() => setPromoMissing(true)}
              />
            ) : (
              <div className="px-6 pt-6">
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <Music className="w-4 h-4 text-[#38BDF8]" />
                    <span className="text-xs font-semibold text-slate-200">
                      Promo film coming soon — temporary audio preview
                    </span>
                  </div>
                  <audio
                    controls
                    src={PROMO_AUDIO_FALLBACK_PATH}
                    className="w-full h-9"
                    data-testid="audio-promo-fallback"
                  />
                </div>
              </div>
            )}
            <div className="p-7 sm:p-8 text-center">
              <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#6B7794]">
                CCA BidIntelligenceOS · Demo
              </span>
              <h2 className="text-2xl font-bold text-white mt-2.5 mb-2">
                Research Less, Win More
              </h2>
              <p className="text-sm leading-relaxed text-slate-400 mb-6 max-w-md mx-auto">
                The bid intelligence workspace for commercial trade contractors
                — from opportunity analysis to job closeout, seeded with
                realistic demo data.
              </p>
              <div className="flex flex-col sm:flex-row items-stretch justify-center gap-3">
                {WALKTHROUGH_VIDEO_URL && (
                  <a
                    href={WALKTHROUGH_VIDEO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-[#38BDF8]/40 bg-[#38BDF8]/10 text-[#7dd3fc] font-semibold text-sm hover:bg-[#38BDF8]/20 hover:text-white transition-colors"
                    data-testid="button-watch-walkthrough"
                  >
                    <PlayCircle className="w-4 h-4" />
                    Watch Walkthrough
                  </a>
                )}
                {!promoMissing && (
                  <a
                    href={PROMO_SOURCE}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-white/15 bg-white/5 text-slate-200 font-semibold text-sm hover:bg-white/10 hover:text-white transition-colors"
                    data-testid="button-watch-promo"
                  >
                    <PlayCircle className="w-4 h-4" />
                    Watch Promo
                  </a>
                )}
                <button
                  onClick={handleEnter}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-b from-[#4CC4FB] to-[#2A9BD8] text-[#04121F] font-semibold text-sm transition-all shadow-[0_0_36px_rgba(56,189,248,0.4)] hover:shadow-[0_0_48px_rgba(56,189,248,0.6)]"
                  data-testid="button-walkthrough-enter"
                >
                  Enter Demo <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={() => setView("tour")}
                className="mt-4 text-xs text-slate-500 hover:text-slate-300 transition-colors"
                data-testid="button-walkthrough-tour"
              >
                Prefer a quick read? Take the 5-step tour
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="h-1 bg-white/5">
              <div
                className="h-full bg-gradient-to-r from-[#38BDF8] to-[#2A9BD8] transition-all duration-300"
                style={{ width: `${((step + 1) / (STEPS.length + 1)) * 100}%` }}
              />
            </div>
            {!isFinal ? (
              <div className="p-7 sm:p-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-lg bg-[#38BDF8]/10 border border-[#38BDF8]/30 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#38BDF8]" />
                  </div>
                  <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#6B7794]">
                    {current.kicker}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white mb-2.5">{current.title}</h2>
                <p className="text-sm leading-relaxed text-slate-400 mb-5">{current.body}</p>
                <ul className="space-y-2.5 mb-7">
                  {current.points.map((p) => (
                    <li key={p} className="flex items-start gap-2.5 text-sm text-slate-300">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#38BDF8] shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() =>
                      step === 0 ? setView("intro") : setStep((s) => s - 1)
                    }
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white transition-colors"
                    data-testid="button-walkthrough-back"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <div className="flex items-center gap-1.5">
                    {[...STEPS, null].map((_, i) => (
                      <span
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full transition-colors ${
                          i === step ? "bg-[#38BDF8]" : "bg-white/15"
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => setStep((s) => s + 1)}
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-gradient-to-b from-[#4CC4FB] to-[#2A9BD8] text-[#04121F] text-sm font-semibold transition-all hover:shadow-[0_0_24px_rgba(56,189,248,0.45)]"
                    data-testid="button-walkthrough-next"
                  >
                    Next <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-7 sm:p-8 text-center">
                <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#6B7794]">
                  Step 5 · You're ready
                </span>
                <h2 className="text-2xl font-bold text-white mt-3 mb-2.5">
                  Step into the Command Center
                </h2>
                <p className="text-sm leading-relaxed text-slate-400 mb-7 max-w-sm mx-auto">
                  Explore live bids, job execution, market signals, and the
                  ROSEOS intelligence layer — all seeded with realistic demo
                  data.
                </p>
                <button
                  onClick={handleEnter}
                  className="w-full inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg bg-gradient-to-b from-[#4CC4FB] to-[#2A9BD8] text-[#04121F] font-semibold text-sm transition-all shadow-[0_0_36px_rgba(56,189,248,0.4)] hover:shadow-[0_0_48px_rgba(56,189,248,0.6)]"
                  data-testid="button-walkthrough-enter-final"
                >
                  Enter Demo <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setStep(0);
                    setView("intro");
                  }}
                  className="mt-3 text-xs text-slate-500 hover:text-slate-300 transition-colors"
                  data-testid="button-walkthrough-restart"
                >
                  Back to the start
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
