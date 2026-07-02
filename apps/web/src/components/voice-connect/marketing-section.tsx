import { ArrowRight, Headphones } from "lucide-react";
import { VoiceConnectWordmark } from "./logo";
import { PhoneShowcase } from "./phones";
import { FeaturePillars } from "./pillars";

const TEAL = "#0BA3A8";

export function VoiceConnectMarketingSection({
  onLaunchRoseDemo,
}: {
  onLaunchRoseDemo: () => void;
}) {
  return (
    <section id="voiceconnect" className="relative overflow-hidden border-y border-[#0BA3A8]/15 bg-gradient-to-b from-[#0A0E1A] via-[#0B1418] to-[#0A0E1A] scroll-mt-16">
      <div
        className="absolute inset-0 opacity-[0.07]"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, #0BA3A8 0, transparent 45%), radial-gradient(circle at 80% 80%, #0BA3A8 0, transparent 45%)",
        }}
      />
      <div className="relative max-w-6xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <div className="text-center max-w-2xl mx-auto">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide mb-6"
            style={{ color: "#5eead4", background: "rgba(11,163,168,0.12)", border: "1px solid rgba(11,163,168,0.35)" }}
          >
            <Headphones className="w-3.5 h-3.5" />
            Premium Add-On
          </div>
          <div className="flex justify-center mb-5">
            <VoiceConnectWordmark textClassName="text-2xl" markClassName="h-8 w-auto text-white" />
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold text-white tracking-tight leading-[1.05]">
            Capture the field by voice.
            <br />
            <span style={{ color: TEAL }}>Build the bid back at base.</span>
          </h2>
          <p className="mt-5 text-lg text-[#cbd5e1] leading-relaxed">
            VoiceConnect is the hands-free field companion that elevates BidIntelligenceOS.
            Walk a site, talk through conditions, scope, and risks — and it transcribes,
            tags, and hands everything off as a draft bid.
          </p>
          <p className="mt-3 text-sm font-semibold tracking-wide" style={{ color: TEAL }}>
            Capture it. Connect it. Build it.
          </p>
        </div>

        <PhoneShowcase className="mt-14 max-w-3xl mx-auto" />

        <FeaturePillars className="mt-14" />

        <div className="mt-12 text-center">
          <button
            onClick={onLaunchRoseDemo}
            className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg font-semibold text-sm transition-all"
            style={{ background: TEAL, color: "#06080B", boxShadow: "0 0 36px rgba(11,163,168,0.4)" }}
          >
            See VoiceConnect in the live demo
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
