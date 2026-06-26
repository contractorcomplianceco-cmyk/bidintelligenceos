import { useRef } from "react";
import {
  ArrowRight,
  LayoutDashboard,
  Compass,
  PackageCheck,
  LineChart,
  ShieldCheck,
  PlayCircle,
} from "lucide-react";
import { CCACrest } from "@/components/cca-crest";
import { WalkthroughPlayer } from "@/components/walkthrough/walkthrough-player";
import { VoiceConnectMarketingSection } from "@/components/voice-connect/marketing-section";
import heroImage from "@/assets/hero-construction.jpg";

const FEATURES = [
  {
    icon: LayoutDashboard,
    title: "Cockpit Command Center",
    body: "Every active bid, win rate, deadline, and next action in one live view.",
  },
  {
    icon: Compass,
    title: "Guided Bid Analysis",
    body: "Walk through scope, cost inputs, and fit scoring before you commit.",
  },
  {
    icon: PackageCheck,
    title: "Vendor-Ready Packages",
    body: "Assemble clean, vendor-facing bid packages — internal strategy stays private.",
  },
  {
    icon: LineChart,
    title: "Win / Loss Insights",
    body: "Track outcomes over time to sharpen every future bid.",
  },
];

export default function Marketing({ onLaunchDemo }: { onLaunchDemo: () => void }) {
  const playerRef = useRef<HTMLDivElement | null>(null);

  const scrollToPlayer = () =>
    playerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });

  return (
    <div className="min-h-[100dvh] bg-[#0A0E1A] text-slate-200 font-sans">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-[#0A0E1A]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CCACrest className="w-7 h-7 text-[#38BDF8]" />
            <span className="font-bold text-sm text-white tracking-tight">
              <span className="text-[#38BDF8]">CCA</span> BidIntelligenceOS
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onLaunchDemo}
              className="hidden sm:inline text-sm text-[#cbd5e1] hover:text-white transition-colors"
            >
              Sign in
            </button>
            <button
              onClick={onLaunchDemo}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#38BDF8] text-[#0A0E1A] font-semibold text-sm hover:bg-[#5cc6fb] transition-colors shadow-[0_0_24px_rgba(56,189,248,0.3)]"
            >
              Launch the Live Demo
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0" aria-hidden="true">
          <img src={heroImage} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#0A0E1A]/70" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0E1A]/60 via-[#0A0E1A]/85 to-[#0A0E1A]" />
          <div className="absolute inset-0 blueprint-texture opacity-20" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 lg:px-8 pt-20 pb-16 lg:pt-28 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#38BDF8]/30 bg-[#38BDF8]/10 backdrop-blur-sm text-[#7dd3fc] text-xs font-semibold tracking-wide mb-7">
            <ShieldCheck className="w-3.5 h-3.5" />
            A product of Contractor Connect
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold text-white tracking-tight leading-[1.02] drop-shadow-[0_2px_30px_rgba(0,0,0,0.7)]">
            Research Less,
            <br />
            <span className="text-[#38BDF8]">Win More.</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-[#cbd5e1] leading-relaxed">
            The bid intelligence cockpit for commercial trade contractors. Analyze
            opportunities, structure pricing, build vendor-ready packages, and track
            outcomes — all in one workspace.
          </p>
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onLaunchDemo}
              className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg bg-[#38BDF8] text-[#0A0E1A] font-semibold text-sm hover:bg-[#5cc6fb] transition-all shadow-[0_0_36px_rgba(56,189,248,0.4)] hover:shadow-[0_0_48px_rgba(56,189,248,0.6)]"
            >
              Launch the Live Demo
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            <button
              onClick={scrollToPlayer}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg border border-white/15 bg-white/5 text-white font-semibold text-sm hover:bg-white/10 transition-colors backdrop-blur-sm"
            >
              <PlayCircle className="w-4 h-4" />
              Watch the walkthrough
            </button>
          </div>
        </div>
      </section>

      {/* Walkthrough */}
      <section ref={playerRef} className="relative max-w-5xl mx-auto px-6 lg:px-8 py-12 lg:py-16 scroll-mt-24">
        <div className="text-center mb-8">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#38BDF8]">
            Product Walkthrough
          </span>
          <h2 className="mt-2 text-3xl lg:text-4xl font-bold text-white tracking-tight">
            See how a bid moves from lead to win
          </h2>
          <p className="mt-3 text-[#8A96B0] max-w-xl mx-auto">
            A narrated, 50-second tour of the workspace — from the Cockpit to a
            vendor-ready package.
          </p>
        </div>
        <WalkthroughPlayer />
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-[#1C253B] bg-[#0F1830]/60 p-6 hover:border-[#38BDF8]/30 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-[#38BDF8]/10 border border-[#38BDF8]/20 flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5 text-[#38BDF8]" />
              </div>
              <h3 className="text-base font-semibold text-white">{f.title}</h3>
              <p className="mt-2 text-sm text-[#8A96B0] leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* VoiceConnect add-on */}
      <VoiceConnectMarketingSection onLaunchDemo={onLaunchDemo} />

      {/* Closing CTA */}
      <section className="max-w-6xl mx-auto px-6 lg:px-8 pb-16 pt-16">
        <div className="relative overflow-hidden rounded-2xl border border-[#38BDF8]/20 bg-gradient-to-br from-[#0F1830] to-[#111A2E] p-10 lg:p-14 text-center">
          <div className="absolute inset-0 blueprint-texture opacity-10" aria-hidden="true" />
          <div className="relative">
            <CCACrest className="w-10 h-10 text-[#38BDF8] mx-auto mb-5" />
            <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">
              Ready to win more bids?
            </h2>
            <p className="mt-3 text-[#cbd5e1] max-w-lg mx-auto">
              Explore the full interactive demo with sample data — no setup required.
            </p>
            <button
              onClick={onLaunchDemo}
              className="group mt-7 inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg bg-[#38BDF8] text-[#0A0E1A] font-semibold text-sm hover:bg-[#5cc6fb] transition-all shadow-[0_0_36px_rgba(56,189,248,0.4)]"
            >
              Launch the Live Demo
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-[#8A96B0] text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>
              Interactive prototype — output is for demonstration and requires review
              before use.
            </span>
          </div>
          <span className="text-white/80">
            CCA BidIntelligenceOS is a product of Contractor Connect
          </span>
        </div>
      </footer>
    </div>
  );
}
