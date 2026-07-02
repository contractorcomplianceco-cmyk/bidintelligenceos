import { Layout } from "@/components/layout";
import { Link } from "wouter";
import { ADD_ONS, type AddOn } from "@/lib/add-ons";
import {
  Blocks,
  Mic,
  Video,
  Crosshair,
  LineChart,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Plug,
  Network,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  mic: Mic,
  video: Video,
  crosshair: Crosshair,
  "line-chart": LineChart,
  network: Network,
  "shield-check": ShieldCheck,
};

function StatusChip({ status }: { status: AddOn["status"] }) {
  if (status === "connected") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        Connected
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest">
      <Sparkles className="w-3 h-3" />
      Coming Soon
    </span>
  );
}

export default function AddOns() {
  return (
    <Layout>
      <div className="space-y-6 max-w-[1600px] mx-auto">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm p-6 lg:p-8">
          <div className="absolute top-0 right-0 p-6 opacity-[0.04] pointer-events-none">
            <Blocks className="w-48 h-48 text-[#2563EB]" />
          </div>
          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 text-[#0284C7] border border-sky-200 px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
              <Plug className="w-3 h-3" />
              Add-On Marketplace
            </span>
            <h1 className="mt-3 text-2xl lg:text-4xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
              <Blocks className="h-8 w-8 text-[#2563EB]" />
              Extend BidIntelligenceOS
            </h1>
            <p className="mt-3 text-slate-500 max-w-3xl leading-relaxed">
              Add-ons are separate products that connect into BidIntelligenceOS. Each one captures
              field intelligence in its own way — voice, video, or market signals — and feeds
              review-ready drafts and context back into the OS. Connect what you need; every add-on
              is licensed separately.
            </p>
          </div>
        </div>

        {/* Add-on grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {ADD_ONS.map((addon) => {
            const Icon = ICONS[addon.iconKey] ?? Blocks;
            const connected = addon.status === "connected";
            return (
              <div
                key={addon.id}
                className="rounded-xl border border-[#E2E8F0] bg-white shadow-sm overflow-hidden flex flex-col"
              >
                <div className="p-5 border-b border-[#E2E8F0]">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: `${addon.color}14`, border: `1px solid ${addon.color}33` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: addon.color }} />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900 leading-tight">{addon.name}</h3>
                        <p className="text-xs font-medium mt-0.5" style={{ color: addon.color }}>
                          {addon.tagline}
                        </p>
                      </div>
                    </div>
                    <StatusChip status={addon.status} />
                  </div>
                  <p className="mt-3 text-sm text-slate-500 leading-relaxed">{addon.description}</p>
                </div>

                <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-5 flex-1">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                      Capabilities
                    </div>
                    <ul className="space-y-1.5">
                      {addon.capabilities.map((c) => (
                        <li key={c} className="flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: addon.color }} />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                      What it feeds into the OS
                    </div>
                    <ul className="space-y-1.5">
                      {addon.dataFlows.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-xs text-slate-700">
                          <ArrowRight className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#2563EB]" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="px-5 py-4 border-t border-[#E2E8F0] bg-[#F1F5F9]">
                  <Link href={addon.href}>
                    <button
                      className="inline-flex items-center gap-2 text-sm font-semibold rounded-lg px-4 py-2 transition-colors hover:brightness-105"
                      style={
                        connected
                          ? { background: "#2563EB", color: "#FFFFFF" }
                          : { background: "#FFFFFF", color: "#334155", border: "1px solid #CBD5E1" }
                      }
                    >
                      {connected ? "Open add-on" : "View details & join waitlist"}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Integration architecture strip */}
        <div className="rounded-2xl border border-[#E2E8F0] bg-white shadow-sm p-6 lg:p-8">
          <div className="text-center mb-6">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#0284C7]">
              Integration Architecture
            </span>
            <h3 className="mt-2 text-xl font-bold text-slate-900 tracking-tight">
              Add-ons flow into one intelligence core
            </h3>
            <p className="mt-2 text-sm text-slate-500 max-w-xl mx-auto">
              Each add-on captures signals in the field and streams review-ready drafts and context
              into BidIntelligenceOS.
            </p>
          </div>
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-center gap-4">
            <div className="grid grid-cols-2 gap-3 flex-1 max-w-md mx-auto">
              {ADD_ONS.map((addon) => {
                const Icon = ICONS[addon.iconKey] ?? Blocks;
                return (
                  <div
                    key={addon.id}
                    className="rounded-lg border border-[#E2E8F0] bg-[#F1F5F9] px-3 py-2.5 flex items-center gap-2"
                  >
                    <Icon className="w-4 h-4 shrink-0" style={{ color: addon.color }} />
                    <span className="text-xs font-semibold text-slate-700 truncate">{addon.name}</span>
                  </div>
                );
              })}
            </div>
            <ArrowRight className="hidden lg:block w-7 h-7 text-[#2563EB] shrink-0" />
            <div className="lg:hidden flex justify-center">
              <ArrowRight className="w-6 h-6 text-[#2563EB] rotate-90" />
            </div>
            <div className="rounded-xl border-2 border-[#2563EB]/30 bg-sky-50 px-6 py-5 text-center shrink-0">
              <Sparkles className="w-6 h-6 text-[#2563EB] mx-auto" />
              <div className="mt-2 text-sm font-bold text-slate-900">BidIntelligenceOS</div>
              <div className="text-[11px] text-slate-500">Bids · Risk · Cost · Deployment</div>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div className="flex items-start gap-2 text-xs text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#0A8A8F]" />
          <p className="leading-relaxed max-w-4xl">
            Add-ons are independent products licensed separately from BidIntelligenceOS. All add-on
            output is decision-support and requires human review before any bid is built or exported.
            Market and competitor add-ons use lawful, public data sources only.
          </p>
        </div>
      </div>
    </Layout>
  );
}
