import { CCACrest } from "@/components/cca-crest";
import {
  ArrowRight,
  LayoutDashboard,
  Target,
  FileText,
  LineChart,
  ShieldCheck,
} from "lucide-react";

const highlights = [
  {
    icon: LayoutDashboard,
    title: "Cockpit Intelligence",
    desc: "A single command deck for active bids, follow-ups, and pipeline value.",
  },
  {
    icon: Target,
    title: "Guided Bid Analysis",
    desc: "Scope, cost inputs, and bid-fit scoring that focus your estimating effort.",
  },
  {
    icon: FileText,
    title: "Vendor-Ready Packages",
    desc: "Assemble polished, client-facing proposals — review-required before export.",
  },
  {
    icon: LineChart,
    title: "Win / Loss Insights",
    desc: "Learn what wins work and where margin slips, outcome by outcome.",
  },
];

export default function DemoLanding({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="min-h-[100dvh] bg-[#0A0E1A] text-slate-200 font-sans relative overflow-hidden flex flex-col">
      {/* Ambient background */}
      <div className="absolute inset-0 blueprint-texture opacity-40 pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-[36rem] h-[36rem] rounded-full bg-[#38BDF8]/10 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-48 -left-40 w-[36rem] h-[36rem] rounded-full bg-[#22C55E]/5 blur-[120px] pointer-events-none" />

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between px-6 lg:px-12 py-6">
        <div className="flex items-center gap-3">
          <CCACrest className="w-8 h-8 text-[#38BDF8]" />
          <h1 className="font-bold text-base text-white tracking-tight leading-none">
            <span className="text-[#38BDF8]">CCA</span> BidIntelligenceOS
          </h1>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#1C253B] bg-[#0F1830] text-[10px] font-bold uppercase tracking-widest text-[#8A96B0]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
          Interactive Demo
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex-1 flex items-center px-6 lg:px-12 py-10">
        <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#38BDF8]/20 bg-[#38BDF8]/10 text-[#38BDF8] text-xs font-semibold tracking-wide mb-6">
              <ShieldCheck className="w-3.5 h-3.5" />
              A product of Contractor Connect
            </div>
            <h2 className="text-4xl lg:text-6xl font-bold text-white tracking-tight leading-[1.05]">
              Research Less,
              <br />
              <span className="text-[#38BDF8]">Win More.</span>
            </h2>
            <p className="mt-6 text-base lg:text-lg text-[#8A96B0] leading-relaxed max-w-md">
              The bid intelligence cockpit for commercial trade contractors —
              analyze opportunities, structure pricing, build vendor-ready
              packages, and track outcomes in one workspace.
            </p>

            <div className="mt-9 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <button
                onClick={onEnter}
                className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#38BDF8] text-[#0A0E1A] font-semibold text-sm tracking-wide hover:bg-[#5cc6fb] transition-all shadow-[0_0_30px_rgba(56,189,248,0.35)] hover:shadow-[0_0_40px_rgba(56,189,248,0.5)]"
              >
                Launch Live Demo
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </button>
              <span className="text-xs text-[#8A96B0]">
                No sign-in required · Sample data
              </span>
            </div>
          </div>

          {/* Highlights */}
          <div className="grid sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 fill-mode-both">
            {highlights.map((h) => {
              const Icon = h.icon;
              return (
                <div
                  key={h.title}
                  className="rounded-xl border border-[#1C253B] bg-[#0F1830]/80 backdrop-blur-sm p-5 hover:border-[#2A3756] transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#38BDF8]/10 border border-[#38BDF8]/20 flex items-center justify-center mb-3">
                    <Icon className="w-4.5 h-4.5 text-[#38BDF8]" />
                  </div>
                  <h3 className="text-sm font-semibold text-white">{h.title}</h3>
                  <p className="mt-1.5 text-xs text-[#8A96B0] leading-relaxed">
                    {h.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#1C253B] px-6 lg:px-12 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[#8A96B0] text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-[#38BDF8]" />
          <span>
            Interactive prototype — output is for demonstration and requires
            review before use.
          </span>
        </div>
        <span className="text-white/90">
          CCA BidIntelligenceOS is a product of Contractor Connect
        </span>
      </footer>
    </div>
  );
}
