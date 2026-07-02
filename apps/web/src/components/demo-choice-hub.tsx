import type { ReactNode } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Clapperboard,
  LayoutDashboard,
  PlayCircle,
  Sparkles,
} from "lucide-react";
import logoLockup from "@/assets/bidintelligence-logo.png";
import {
  RELATED_DEMO_LABEL,
  RELATED_DEMO_URL,
  hasRelatedDemo,
} from "@/lib/demo-links";

type DemoChoiceHubProps = {
  onEnterDemo: () => void;
  onWatchWalkthrough: () => void;
  onWatchPromo: () => void;
  onReturnHome: () => void;
};

export function DemoChoiceHub({
  onEnterDemo,
  onWatchWalkthrough,
  onWatchPromo,
  onReturnHome,
}: DemoChoiceHubProps) {
  return (
    <div className="min-h-screen bg-[#0A0E1A] text-white antialiased">
      <header className="border-b border-white/10 bg-[#0B1220]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 lg:px-8">
          <button
            type="button"
            onClick={onReturnHome}
            className="flex items-center gap-3 text-left"
          >
            <img src={logoLockup} alt="BidIntelligenceOS" className="h-8 w-auto" />
          </button>
          <button
            type="button"
            onClick={onEnterDemo}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-b from-[#4CC4FB] to-[#2A9BD8] px-4 py-2 text-sm font-semibold text-[#04121F] shadow-[0_0_24px_rgba(56,189,248,0.35)]"
            data-testid="button-hub-enter-demo"
          >
            Enter Demo
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-16 lg:px-8 lg:py-24">
        <div className="text-center">
          <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#6B7794]">
            CCA BidIntelligenceOS · Rose Demo
          </span>
          <h1 className="mt-4 text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Choose your{" "}
            <span className="bg-gradient-to-r from-[#38BDF8] to-[#0BA3A8] bg-clip-text text-transparent">
              demo experience
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-400">
            Enter the live Command Center, replay the promo or narrated walkthrough, or
            explore the related VoiceConnect field demo.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
          <HubCard
            icon={<LayoutDashboard className="h-5 w-5" />}
            title="Enter BidIntelligenceOS Demo"
            description="Open the live Command Center — bids, briefings, alerts, and the full Rose OS workflow."
            featured
            action={
              <button
                type="button"
                onClick={onEnterDemo}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-b from-[#4CC4FB] to-[#2A9BD8] px-5 py-3 text-sm font-semibold text-[#04121F] shadow-[0_0_36px_rgba(56,189,248,0.4)]"
                data-testid="button-hub-enter-app"
              >
                Enter Command Center
                <ArrowRight className="h-4 w-4" />
              </button>
            }
          />

          <HubCard
            icon={<PlayCircle className="h-5 w-5" />}
            title="Watch Walkthrough"
            description="Replay the narrated product walkthrough before you enter the app."
            action={
              <button
                type="button"
                onClick={onWatchWalkthrough}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#38BDF8]/40 bg-[#38BDF8]/10 px-5 py-3 text-sm font-semibold text-[#7dd3fc] hover:bg-[#38BDF8]/20"
                data-testid="button-hub-watch-walkthrough"
              >
                Play walkthrough
                <PlayCircle className="h-4 w-4" />
              </button>
            }
          />

          <HubCard
            icon={<Clapperboard className="h-5 w-5" />}
            title="Watch Promo"
            description="Replay the Rose Demo promo film with sound."
            action={
              <button
                type="button"
                onClick={onWatchPromo}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
                data-testid="button-hub-watch-promo"
              >
                Play promo
                <Clapperboard className="h-4 w-4" />
              </button>
            }
          />

          {hasRelatedDemo() && (
            <HubCard
              icon={<Sparkles className="h-5 w-5" />}
              title="Related Demo"
              description="Explore VoiceConnect — voice-first field capture that drafts bids into BidIntelligenceOS."
              action={
                <a
                  href={RELATED_DEMO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#0BA3A8]/40 bg-[#0BA3A8]/10 px-5 py-3 text-sm font-semibold text-[#5eead4] hover:bg-[#0BA3A8]/20"
                  data-testid="button-hub-related-demo"
                >
                  {RELATED_DEMO_LABEL}
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              }
            />
          )}
        </div>

        <p className="mt-10 text-center text-sm text-slate-500">
          Prefer the marketing site?{" "}
          <button
            type="button"
            onClick={onReturnHome}
            className="text-[#7dd3fc] hover:underline"
            data-testid="button-hub-return-home"
          >
            Return to landing page
          </button>
        </p>
      </main>
    </div>
  );
}

function HubCard({
  icon,
  title,
  description,
  action,
  featured = false,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action: ReactNode;
  featured?: boolean;
}) {
  return (
    <div
      className={`flex flex-col rounded-2xl border p-6 ${
        featured
          ? "border-[#38BDF8]/40 bg-[#0B1220] shadow-[0_0_48px_rgba(56,189,248,0.12)]"
          : "border-white/10 bg-[#0B1220]/60"
      }`}
    >
      <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#38BDF8]/10 text-[#7dd3fc]">
        {icon}
      </div>
      <h2 className="mt-4 text-lg font-bold text-white">{title}</h2>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">{description}</p>
      <div className="mt-6">{action}</div>
    </div>
  );
}
