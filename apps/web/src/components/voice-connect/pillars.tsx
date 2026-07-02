import { HardHat, AudioLines, Share2, Lock, type LucideIcon } from "lucide-react";

export const VC_PILLARS: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: HardHat,
    title: "Built for the Field",
    body: "Voice-first, hands-free capture that works anywhere on site.",
  },
  {
    icon: AudioLines,
    title: "Intelligent Capture",
    body: "Live transcription, smart tagging, and automatic organization.",
  },
  {
    icon: Share2,
    title: "Connected Workflow",
    body: "Seamless handoff straight into CCA BidIntelligenceOS.",
  },
  {
    icon: Lock,
    title: "Secure & Trusted",
    body: "Enterprise-grade security and data protection.",
  },
];

export function FeaturePillars({ className = "" }: { className?: string }) {
  return (
    <div className={`grid sm:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {VC_PILLARS.map((p) => (
        <div
          key={p.title}
          className="rounded-xl border border-[#1C253B] bg-[#0F1830]/60 p-5 hover:border-[#0BA3A8]/40 transition-colors"
        >
          <div className="w-10 h-10 rounded-lg bg-[#0BA3A8]/10 border border-[#0BA3A8]/25 flex items-center justify-center mb-4">
            <p.icon className="w-5 h-5 text-[#0BA3A8]" />
          </div>
          <h3 className="text-sm font-semibold text-white">{p.title}</h3>
          <p className="mt-1.5 text-xs text-[#8A96B0] leading-relaxed">{p.body}</p>
        </div>
      ))}
    </div>
  );
}
