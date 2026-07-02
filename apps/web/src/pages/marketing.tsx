import { useRef, useState, useEffect } from "react";
import {
  Clapperboard,
  ArrowRight,
  PlayCircle,
  ShieldCheck,
  Search,
  PackageCheck,
  HardHat,
  CalendarClock,
  ClipboardCheck,
  CloudLightning,
  DollarSign,
  Mic,
  Building2,
  Wind,
  Home,
  Zap,
  GitBranch,
  TrendingUp,
  CheckCircle2,
  Droplets,
  Wrench,
  SlidersHorizontal,
  Ruler,
  Eye,
  Lock,
  Sparkles,
  Radar,
  AlertTriangle,
  ShieldAlert,
  Dna,
  RotateCcw,
  Video,
  BarChart3,
  ScanEye,
  Camera,
  Network,
  Landmark,
  FileCheck,
  BellRing,
  Gauge,
  Target,
  Signal,
  type LucideIcon,
} from "lucide-react";
import { CCACrest } from "@/components/cca-crest";
import { WalkthroughPlayer } from "@/components/walkthrough/walkthrough-player";
import { VoiceConnectMarketingSection } from "@/components/voice-connect/marketing-section";
import { INDUSTRY_USE_CASES, type IndustryIconKey } from "@core/industry-use-cases";
import { COMPETITORWATCH } from "@core/competitorwatch";
import { AI_FEATURES } from "@core/ai-features";
import heroImage from "@/assets/hero-construction.jpg";
import logoLockup from "@/assets/bidintelligence-logo.png";
import brandShield from "@/assets/brand-shield.png";
import brandLockup from "@/assets/brand-lockup.png";
import { WALKTHROUGH_VIDEO_URL, PROMO_FILM_URL } from "@/lib/demo-links";

const INDUSTRY_ICONS: Record<IndustryIconKey, LucideIcon> = {
  roofing: Home,
  storm: CloudLightning,
  gc: Building2,
  hvac: Wind,
  engineering: Ruler,
  electrical: Zap,
  plumbing: Droplets,
  facility: Wrench,
  insurance: ShieldCheck,
  custom: SlidersHorizontal,
};

const PAIN_POINTS = [
  {
    icon: Mic,
    title: "The gap between walkthrough and bid submission",
    body: "Site notes, photos, and risks live in your head or a phone. BidIntelligenceOS turns the walkthrough into a bid-ready draft — nothing gets lost between the field and the proposal.",
  },
  {
    icon: Search,
    title: "Scope gaps become change orders",
    body: "Missing spec sections, unanswered RFIs, and undisclosed exclusions surface after you've won. We flag them before they cost you margin.",
  },
  {
    icon: TrendingUp,
    title: "Guessing at pricing and win probability",
    body: "Confidence scoring, market signals, and win/loss learning replace gut-feel with decision-support you can defend.",
  },
  {
    icon: AlertTriangle,
    title: "Margin fades after the award",
    body: "Labor burn, sub overages, weather delays, and uncaptured change orders quietly erode profit. Profit-fade alerts catch the drift early.",
  },
];

const INDUSTRIES = [
  { icon: Building2, label: "GC" },
  { icon: Wind, label: "HVAC" },
  { icon: ShieldCheck, label: "Insurance" },
  { icon: Home, label: "Roofing" },
  { icon: Zap, label: "Electrical" },
];

const KPIS = [
  { label: "Open Bid Value", value: "$18.74M", delta: "+18.3% vs last 30d" },
  { label: "Win Rate", value: "63%", delta: "+6% vs last 30d" },
  { label: "Avg Confidence", value: "74%", delta: "+11% vs last 30d" },
  { label: "Active Bids", value: "28", delta: "+12% vs last 30d" },
];

const PREVIEW_ROWS = [
  { project: "Greenway Mixed-Use", value: "$4.2M", conf: 78, status: "In Progress" },
  { project: "Riverside Tower", value: "$7.5M", conf: 82, status: "Submitted" },
  { project: "Main St. Bridge Rehab", value: "$1.1M", conf: 71, status: "Pursuing" },
];

const MODULES = [
  {
    icon: Search,
    title: "Bid Intelligence",
    body: "Identify smarter opportunities and analyze scope with confidence scoring.",
  },
  {
    icon: PackageCheck,
    title: "Bid Package Builder",
    body: "Build compliant, competitive, vendor-ready bid packages — faster.",
  },
  {
    icon: HardHat,
    title: "Won Job Deployment",
    body: "Move seamlessly from award to a fully staffed, scheduled execution plan.",
  },
  {
    icon: CalendarClock,
    title: "Scheduling",
    body: "Build intelligent schedules, sequence phases, and stay on track.",
  },
  {
    icon: ClipboardCheck,
    title: "Permits Tracking",
    body: "Track, monitor, and manage permits, expirations, and renewals with ease.",
  },
  {
    icon: CloudLightning,
    title: "Weather Watch",
    body: "Monitor jobsite conditions and reduce weather-related schedule risk.",
  },
  {
    icon: DollarSign,
    title: "Cost & ROI",
    body: "Track costs, margins, and profitability against plan in real time.",
  },
  {
    icon: Mic,
    title: "VoiceConnect",
    body: "Ask, listen, act. Get field-ready answers fast, hands-free.",
  },
  {
    icon: ShieldAlert,
    title: "Risk & Change Orders",
    body: "Risk radar, change-order detection, and profit-fade alerts protect margin after the award.",
  },
  {
    icon: ClipboardCheck,
    title: "Job Closeout",
    body: "Punch lists, documentation, retainage, and final ROI — every job closes clean.",
  },
  {
    icon: Dna,
    title: "Bid DNA Learning Engine",
    body: "Compares estimate vs. actual on every closed job so future bids get sharper.",
  },
];

const STEPS = [
  {
    icon: Search,
    step: "01",
    title: "Analyze Scope",
    body: "Extract, clarify, and validate scope with confidence scoring.",
  },
  {
    icon: GitBranch,
    step: "02",
    title: "Build Strategy",
    body: "Assemble the right team, plan resources, and structure winning bids.",
  },
  {
    icon: TrendingUp,
    step: "03",
    title: "Deploy & Track Jobs",
    body: "Deploy with precision — labor, subs, cost, ROI, risk radar, and weather in one view.",
  },
  {
    icon: RotateCcw,
    step: "04",
    title: "Close & Learn",
    body: "Close out clean, then feed estimate-vs-actual into Bid DNA so the next bid starts sharper.",
  },
];

const TRUST = [
  { value: "1,000+", label: "Contractors" },
  { value: "$18.7B+", label: "Project Value Analyzed" },
  { value: "11", label: "Trade Verticals" },
  { value: "AI + Human", label: "Reviewed Execution" },
];

/**
 * MarketWatchOS — LIVE flagship add-on: Opportunity Radar.
 * Framed strictly around lawful, public, and published signals only.
 */
const MARKETWATCH = {
  name: "MarketWatchOS",
  status: "Now Live",
  tagline: "Opportunity Radar — find the work before it hits the street.",
  shortDescription:
    "The Opportunity Radar engine is live. MarketWatchOS scans lawful, public signals — storm events, permit spikes, RFP/RFQ releases, and material & labor shifts — and turns them into scored, trade-specific opportunity alerts (0–100) that flow straight into your bid pipeline.",
  features: [
    { title: "Job signals", description: "Storm damage, permit spikes, and claim surges surface new work by trade & region." },
    { title: "Bid signals", description: "Public RFP/RFQ releases and open bid windows tracked as they hit the street." },
    { title: "Market signals", description: "Material, labor, and sub-availability shifts read from public and published sources." },
    { title: "Scored opportunity alerts", description: "Every signal is scored 0–100 by fit, trade, and regional demand heat." },
    { title: "Regional demand heat", description: "See where demand is rising or cooling before you commit bid resources." },
    { title: "Pipeline handoff", description: "High-opportunity alerts feed the Command Center and your bid pipeline." },
  ],
  radarAlerts: [
    { title: "Hail event — Denver metro", trade: "Roofing", score: 92, tag: "Storm signal" },
    { title: "School district RFP released", trade: "GC", score: 87, tag: "Bid signal" },
    { title: "Permit spike — mixed-use core", trade: "Electrical", score: 78, tag: "Job signal" },
    { title: "Steel pricing easing", trade: "Market", score: 64, tag: "Market signal" },
  ],
  guardrail:
    "MarketWatchOS uses lawful, public, and published signals only. It does not access private company systems, confidential pricing, or non-public bid information. Scored alerts are decision-support you review — not guaranteed outcomes.",
};

/**
 * Government Contracting — built-in module framing (compact strip).
 * Public registrations & lawful deadline tracking only.
 */
const GOVERNMENT = {
  tagline: "Built-in module for public-sector pursuits.",
  points: [
    { icon: FileCheck, title: "SAM / UEI / CAGE tracking", body: "Keep registrations current with status and renewal visibility." },
    { icon: Target, title: "Set-aside tracking", body: "Track 8(a), SDVOSB, WOSB, and HUBZone eligibility against opportunities." },
    { icon: Gauge, title: "Readiness score", body: "A single score for how bid-ready your government profile is right now." },
    { icon: BellRing, title: "Deadline alerts", body: "Proposal and registration deadlines surface before they lapse." },
  ],
  guardrail:
    "Government Contracting tracks your public registrations and lawful, published solicitation data — decision-support you review, not guaranteed awards.",
};

export default function Marketing({
  onLaunchRoseDemo,
}: {
  onLaunchRoseDemo: () => void;
}) {
  const playerRef = useRef<HTMLDivElement | null>(null);

  const scrollToPlayer = () =>
    playerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });

  return (
    <div className="min-h-[100dvh] bg-[#0A0E1A] text-slate-200 font-sans">
      {/* Utility strip */}
      <div className="hidden md:block border-b border-white/5 bg-[#080B14]">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 h-9 flex items-center justify-between text-[11px] tracking-wide">
          <span className="text-[#6B7794] flex items-center">
            Powering Smarter Work Across
            <a
              href="https://demo.ccabuildconnect.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 text-[#38BDF8] font-semibold hover:text-white transition-colors"
            >
              BuildConnect
            </a>
            <span className="mx-1.5 text-[#2A3550]">·</span>
            <a
              href="https://demo.ccacontractorconnect.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#5eead4] font-semibold hover:text-white transition-colors"
            >
              ContractorConnect
            </a>
            <span className="mx-1.5 text-[#2A3550]">·</span>
            <span className="text-[#a5b4fc] font-semibold">
              QualifierConnect
              <span className="ml-1 text-[9px] uppercase tracking-wider text-[#6B7794] font-medium">
                Coming Soon
              </span>
            </span>
            <span className="mx-1.5 text-[#2A3550]">·</span>
            <a
              href="https://demo.ccacomplianceconnect.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#c084fc] font-semibold hover:text-white transition-colors"
            >
              ComplianceConnect
            </a>
          </span>
          <a
            href="https://www.contractor-compliance-authority.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#6B7794] hover:text-white transition-colors"
          >
            A product of Contractor Compliance Authority
          </a>
        </div>
      </div>

      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-[#0A0E1A]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center">
            <img src={brandLockup} alt="CCA BidIntelligenceOS" className="h-12 w-auto" />
          </div>
          <nav className="hidden lg:flex items-center gap-7 text-sm text-[#cbd5e1]">
            <a href="#platform" className="hover:text-white transition-colors">
              Platform
            </a>
            <a href="#use-cases" className="hover:text-white transition-colors">
              Use Cases
            </a>
            <a href="#voiceconnect" className="hover:text-[#5eead4] transition-colors text-[#7fe3d8]">
              VoiceConnect
            </a>
            <a href="#competitorwatch" className="hover:text-white transition-colors">
              CompetitorWatch
            </a>
            <button onClick={scrollToPlayer} className="hover:text-white transition-colors">
              Walkthrough
            </button>
          </nav>
          <div className="flex items-center gap-3">
            <button
              onClick={onLaunchRoseDemo}
              className="hidden sm:inline text-sm text-[#cbd5e1] hover:text-white transition-colors"
            >
              Sign in
            </button>
            <button
              onClick={onLaunchRoseDemo}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-b from-[#4CC4FB] to-[#2A9BD8] text-[#04121F] font-semibold text-sm hover:from-[#5cc6fb] hover:to-[#38a8e0] transition-all shadow-[0_0_24px_rgba(56,189,248,0.35)]"
            >
              Launch Rose Demo
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0" aria-hidden="true">
          <img src={heroImage} alt="" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0E1A]/85 via-[#0A0E1A]/92 to-[#0A0E1A]" />
          <div className="absolute inset-0 blueprint-texture opacity-25" />
          <div
            className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full opacity-30"
            style={{
              background:
                "radial-gradient(circle, rgba(56,189,248,0.35) 0%, rgba(56,189,248,0) 60%)",
            }}
          />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 lg:px-8 pt-16 pb-14 lg:pt-24 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#38BDF8]/30 bg-[#38BDF8]/10 backdrop-blur-sm text-[#7dd3fc] text-xs font-semibold tracking-wide mb-7">
            <ShieldCheck className="w-3.5 h-3.5" />
            A product of Contractor Connect
          </div>
          <h1 className="text-5xl lg:text-[5.5rem] font-bold tracking-tight leading-[0.98]">
            <span className="block bg-gradient-to-b from-white via-[#e7edf7] to-[#9fb0cc] bg-clip-text text-transparent drop-shadow-[0_2px_30px_rgba(0,0,0,0.6)]">
              Win Smarter Bids.
            </span>
            <span className="block mt-1 bg-gradient-to-r from-[#e7edf7] via-[#7dd3fc] to-[#38BDF8] bg-clip-text text-transparent">
              Run Smarter Work.
            </span>
          </h1>
          <p className="mt-7 max-w-2xl mx-auto text-lg text-[#cbd5e1] leading-relaxed">
            From bid intelligence to job deployment, scheduling, permits, cost, and ROI —
            one executive operating system for commercial trade contractors.
            <span className="text-[#7fe3d8]"> Research less. Win more.</span>
          </p>

          {/* Industry badges */}
          <div id="industries" className="mt-8 flex flex-wrap items-center justify-center gap-2.5 scroll-mt-24">
            {INDUSTRIES.map((ind) => (
              <span
                key={ind.label}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#1C253B] bg-[#0F1830]/70 text-sm text-[#cbd5e1]"
              >
                <ind.icon className="w-3.5 h-3.5 text-[#38BDF8]" />
                {ind.label}
              </span>
            ))}
            <span className="inline-flex items-center px-3.5 py-1.5 rounded-full border border-[#1C253B] bg-[#0F1830]/40 text-sm text-[#6B7794]">
              + 6 more
            </span>
          </div>

          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onLaunchRoseDemo}
              className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg bg-gradient-to-b from-[#4CC4FB] to-[#2A9BD8] text-[#04121F] font-semibold text-sm transition-all shadow-[0_0_36px_rgba(56,189,248,0.4)] hover:shadow-[0_0_48px_rgba(56,189,248,0.6)]"
            >
              Launch Rose Demo
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            <button
              onClick={scrollToPlayer}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg border border-white/15 bg-white/5 text-white font-semibold text-sm hover:bg-white/10 transition-colors backdrop-blur-sm"
            >
              <PlayCircle className="w-4 h-4" />
              Watch the walkthrough
            </button>
            {WALKTHROUGH_VIDEO_URL && (
              <a
                href={WALKTHROUGH_VIDEO_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="link-walkthrough-video"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg border border-[#38BDF8]/40 bg-[#38BDF8]/10 text-[#7dd3fc] font-semibold text-sm hover:bg-[#38BDF8]/20 hover:text-white transition-colors backdrop-blur-sm"
              >
                <PlayCircle className="w-4 h-4" />
                Walkthrough Video
              </a>
            )}
            {PROMO_FILM_URL && (
              <a
                href={PROMO_FILM_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="link-promo-film"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg border border-[#38BDF8]/40 bg-[#38BDF8]/10 text-[#7dd3fc] font-semibold text-sm hover:bg-[#38BDF8]/20 hover:text-white transition-colors backdrop-blur-sm"
              >
                <Clapperboard className="w-4 h-4" />
                Promo Video
              </a>
            )}
            <a
              href="#use-cases"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg border border-white/15 bg-white/5 text-white font-semibold text-sm hover:bg-white/10 transition-colors backdrop-blur-sm"
            >
              See Industry Use Cases
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Cockpit preview mockup */}
          <div className="mt-14 relative max-w-4xl mx-auto text-left">
            <div
              className="absolute -inset-x-10 -bottom-6 top-10 rounded-[2rem] opacity-40 blur-2xl"
              style={{
                background:
                  "radial-gradient(60% 60% at 50% 40%, rgba(56,189,248,0.28) 0%, rgba(56,189,248,0) 70%)",
              }}
              aria-hidden="true"
            />
            <div className="relative rounded-2xl border border-[#1C253B] bg-[#0B1122] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] overflow-hidden">
              {/* window chrome */}
              <div className="flex items-center gap-2 px-4 h-10 border-b border-[#141C30] bg-[#0A0F1E]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]/70" />
                <div className="ml-3 flex items-center gap-2 text-xs text-[#6B7794]">
                  <img src={logoLockup} alt="" className="h-4 w-auto opacity-80" />
                  <span className="hidden sm:inline">Command Center</span>
                </div>
                <span className="ml-auto text-[10px] text-[#4A5678]">Data as of May 20, 2025</span>
              </div>
              <div className="p-4 lg:p-5">
                {/* KPI tiles */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {KPIS.map((k) => (
                    <div
                      key={k.label}
                      className="rounded-xl border border-[#141C30] bg-[#0F1830] p-3.5"
                    >
                      <p className="text-[10px] uppercase tracking-wider text-[#6B7794]">
                        {k.label}
                      </p>
                      <p className="mt-1 text-xl font-bold text-white">{k.value}</p>
                      <p className="mt-0.5 text-[10px] text-[#22C55E]">{k.delta}</p>
                    </div>
                  ))}
                </div>
                {/* Active bids table */}
                <div className="mt-4 rounded-xl border border-[#141C30] bg-[#0F1830] overflow-hidden">
                  <div className="px-4 py-2.5 border-b border-[#141C30] flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#cbd5e1]">Active Bids</span>
                    <span className="text-[10px] text-[#38BDF8]">View all</span>
                  </div>
                  <div className="divide-y divide-[#141C30]">
                    {PREVIEW_ROWS.map((r) => (
                      <div
                        key={r.project}
                        className="grid grid-cols-12 items-center gap-2 px-4 py-2.5 text-xs"
                      >
                        <span className="col-span-5 text-[#e2e8f0] truncate">{r.project}</span>
                        <span className="col-span-2 text-[#94a3b8]">{r.value}</span>
                        <div className="col-span-3 flex items-center gap-2">
                          <div className="h-1.5 flex-1 rounded-full bg-[#1C253B] overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-[#38BDF8] to-[#22C55E]"
                              style={{ width: `${r.conf}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-[#8A96B0] w-7">{r.conf}%</span>
                        </div>
                        <span className="col-span-2 text-right text-[10px] text-[#7dd3fc]">
                          {r.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-y border-white/5 bg-[#080B14]">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-7 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {TRUST.map((t) => (
            <div key={t.label} className="text-center">
              <p className="text-2xl lg:text-3xl font-bold bg-gradient-to-b from-white to-[#9fb0cc] bg-clip-text text-transparent">
                {t.value}
              </p>
              <p className="mt-1 text-xs text-[#6B7794] tracking-wide">{t.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What it does */}
      <section id="platform" className="max-w-6xl mx-auto px-6 lg:px-8 py-16 lg:py-20 scroll-mt-24">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#38BDF8]">
            One Platform
          </span>
          <h2 className="mt-2 text-3xl lg:text-5xl font-bold tracking-tight bg-gradient-to-b from-white to-[#a9b7d1] bg-clip-text text-transparent">
            What BidIntelligenceOS Does
          </h2>
          <p className="mt-3 text-[#8A96B0] max-w-xl mx-auto">
            One operating system, from opportunity to closeout.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {MODULES.map((m) => (
            <div
              key={m.title}
              className="group relative rounded-xl border border-[#1C253B] bg-gradient-to-b from-[#0F1830]/80 to-[#0B1122]/80 p-6 hover:border-[#38BDF8]/40 transition-colors"
            >
              <div className="w-11 h-11 rounded-xl bg-[#38BDF8]/10 border border-[#38BDF8]/25 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(56,189,248,0.15)] group-hover:shadow-[0_0_28px_rgba(56,189,248,0.3)] transition-shadow">
                <m.icon className="w-5 h-5 text-[#38BDF8]" />
              </div>
              <h3 className="text-base font-semibold text-white">{m.title}</h3>
              <p className="mt-2 text-sm text-[#8A96B0] leading-relaxed">{m.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-[#7fe3d8]">
          <ShieldCheck className="w-4 h-4" />
          Decision-support intelligence. Human-reviewed execution.
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-6 lg:px-8 pb-8 lg:pb-12">
        <div className="rounded-2xl border border-[#1C253B] bg-gradient-to-br from-[#0F1830] to-[#0B1122] p-8 lg:p-12">
          <div className="text-center mb-10">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#38BDF8]">
              How It Works
            </span>
            <h2 className="mt-2 text-2xl lg:text-4xl font-bold text-white tracking-tight">
              Win the bid. Then run the job better.
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
            {STEPS.map((s, i) => (
              <div key={s.step} className="relative">
                <div className="rounded-xl border border-[#1C253B] bg-[#0B1122]/60 p-6 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-[#38BDF8]/10 border border-[#38BDF8]/25 flex items-center justify-center">
                      <s.icon className="w-5 h-5 text-[#38BDF8]" />
                    </div>
                    <span className="text-2xl font-bold text-[#1C2A45]">{s.step}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white">{s.title}</h3>
                  <p className="mt-2 text-sm text-[#8A96B0] leading-relaxed">{s.body}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <ArrowRight className="hidden md:block absolute top-1/2 -right-3 -translate-y-1/2 w-5 h-5 text-[#2A3550]" />
                )}
              </div>
            ))}
          </div>

          {/* The OS learns — full-lifecycle loop */}
          <div className="mt-8 relative overflow-hidden rounded-xl border border-[#38BDF8]/25 bg-gradient-to-r from-[#0B1122] via-[#0D1730] to-[#0B1122] p-6 lg:p-8">
            <div
              className="absolute -right-16 -top-16 w-56 h-56 rounded-full opacity-40 blur-2xl"
              style={{
                background:
                  "radial-gradient(circle, rgba(56,189,248,0.35) 0%, rgba(56,189,248,0) 70%)",
              }}
              aria-hidden="true"
            />
            <div className="relative flex flex-col lg:flex-row lg:items-center gap-6">
              <div className="shrink-0 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#38BDF8]/10 border border-[#38BDF8]/25 flex items-center justify-center shadow-[0_0_24px_rgba(56,189,248,0.25)]">
                  <Dna className="w-6 h-6 text-[#38BDF8]" />
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-[#7fe3d8]">
                    Bid DNA
                  </span>
                  <h3 className="text-lg font-semibold text-white leading-tight">
                    The OS learns
                  </h3>
                </div>
              </div>
              <p className="text-sm text-[#a9b7d1] leading-relaxed lg:max-w-2xl">
                Won jobs deploy, execution tracks cost and risk in real time, and every
                closeout feeds estimate-vs-actual back into Bid DNA. Each closed job makes
                the next bid a little sharper — a full-lifecycle loop that compounds over
                time. It's decision-support you review, not a guaranteed outcome.
              </p>
              <div className="shrink-0 flex items-center gap-2 text-[11px] font-medium text-[#7dd3fc] lg:ml-auto">
                <span className="px-2.5 py-1 rounded-full border border-[#1C253B] bg-[#0F1830]/70">
                  Deploy
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[#2A3550]" />
                <span className="px-2.5 py-1 rounded-full border border-[#1C253B] bg-[#0F1830]/70">
                  Track
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[#2A3550]" />
                <span className="px-2.5 py-1 rounded-full border border-[#1C253B] bg-[#0F1830]/70">
                  Close
                </span>
                <RotateCcw className="w-3.5 h-3.5 text-[#38BDF8]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pain points */}
      <section className="max-w-6xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#38BDF8]">
            The Problem
          </span>
          <h2 className="mt-2 text-3xl lg:text-5xl font-bold tracking-tight bg-gradient-to-b from-white to-[#a9b7d1] bg-clip-text text-transparent">
            Where bids leak time and margin
          </h2>
          <p className="mt-3 text-[#8A96B0] max-w-2xl mx-auto">
            The costliest gap in contracting is the one between the walkthrough and the
            submitted bid. BidIntelligenceOS closes it — and the ones that follow.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          {PAIN_POINTS.map((p) => (
            <div
              key={p.title}
              className="flex gap-4 rounded-xl border border-[#1C253B] bg-gradient-to-b from-[#0F1830]/80 to-[#0B1122]/80 p-6"
            >
              <div className="shrink-0 w-11 h-11 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/25 flex items-center justify-center">
                <p.icon className="w-5 h-5 text-[#F59E0B]" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">{p.title}</h3>
                <p className="mt-2 text-sm text-[#8A96B0] leading-relaxed">{p.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Industry use cases */}
      <section
        id="use-cases"
        className="border-y border-white/5 bg-[#080B14] scroll-mt-24"
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
          <div className="text-center mb-10">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#38BDF8]">
              Built For Your Trade
            </span>
            <h2 className="mt-2 text-3xl lg:text-5xl font-bold tracking-tight bg-gradient-to-b from-white to-[#a9b7d1] bg-clip-text text-transparent">
              Industry Use Cases
            </h2>
            <p className="mt-3 text-[#8A96B0] max-w-2xl mx-auto">
              One operating system, tuned to how each trade actually bids and builds.
              Select a business type and the workflow, checklists, and dashboard adapt.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {INDUSTRY_USE_CASES.map((ind) => {
              const Icon = INDUSTRY_ICONS[ind.icon];
              return (
                <div
                  key={ind.id}
                  className="group rounded-xl border border-[#1C253B] bg-gradient-to-b from-[#0F1830]/80 to-[#0B1122]/80 p-6 hover:border-[#38BDF8]/40 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-11 h-11 rounded-xl bg-[#38BDF8]/10 border border-[#38BDF8]/25 flex items-center justify-center shadow-[0_0_20px_rgba(56,189,248,0.15)] group-hover:shadow-[0_0_28px_rgba(56,189,248,0.3)] transition-shadow">
                      <Icon className="w-5 h-5 text-[#38BDF8]" />
                    </div>
                    <h3 className="text-base font-semibold text-white">{ind.name}</h3>
                  </div>
                  <p className="text-sm text-[#8A96B0] leading-relaxed">{ind.tagline}</p>
                  <ul className="mt-4 space-y-1.5">
                    {ind.features.slice(0, 3).map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs text-[#94a3b8]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E] mt-0.5 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
          <div id="cta" className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 scroll-mt-24">
            <button
              onClick={onLaunchRoseDemo}
              className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg bg-gradient-to-b from-[#4CC4FB] to-[#2A9BD8] text-[#04121F] font-semibold text-sm transition-all shadow-[0_0_36px_rgba(56,189,248,0.4)] hover:shadow-[0_0_48px_rgba(56,189,248,0.6)]"
            >
              View the Platform
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            <button
              onClick={onLaunchRoseDemo}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg border border-white/15 bg-white/5 text-white font-semibold text-sm hover:bg-white/10 transition-colors backdrop-blur-sm"
            >
              Launch Rose Demo
            </button>
          </div>
        </div>
      </section>

      {/* AI & automation capabilities */}
      <section className="max-w-6xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#38BDF8]">
            Intelligence, End To End
          </span>
          <h2 className="mt-2 text-3xl lg:text-5xl font-bold tracking-tight bg-gradient-to-b from-white to-[#a9b7d1] bg-clip-text text-transparent">
            AI-assisted from lead to closeout
          </h2>
          <p className="mt-3 text-[#8A96B0] max-w-2xl mx-auto">
            Decision-support intelligence at every stage — every output is human-reviewed
            before it reaches a client.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {AI_FEATURES.map((f) => (
            <div
              key={f.id}
              className="rounded-xl border border-[#1C253B] bg-gradient-to-b from-[#0F1830]/80 to-[#0B1122]/80 p-6 hover:border-[#38BDF8]/40 transition-colors"
            >
              <div className="flex items-center gap-2.5 mb-3">
                <Sparkles className="w-4 h-4 text-[#7dd3fc]" />
                <h3 className="text-sm font-semibold text-white">{f.name}</h3>
              </div>
              <p className="text-sm text-[#8A96B0] leading-relaxed">{f.summary}</p>
            </div>
          ))}
        </div>

        {/* Add-On Marketplace — flagship integrations */}
        <div className="mt-10">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-5">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#38BDF8]">
                <Sparkles className="w-3.5 h-3.5" />
                Add-On Marketplace
              </span>
              <h3 className="mt-1.5 text-xl lg:text-2xl font-bold text-white tracking-tight">
                Separate products, wired into the OS
              </h3>
              <p className="mt-2 text-sm text-[#8A96B0] leading-relaxed max-w-xl">
                Flagship add-ons are standalone products that connect to
                BidIntelligenceOS — not features locked inside it. Turn each on and
                the intelligence flows straight into your bids and jobs.
              </p>
            </div>
            {/* Marketplace badge row */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#5eead4]/30 bg-[#5eead4]/10 text-[11px] font-semibold text-[#7fe3d8]">
                <Mic className="w-3 h-3" />
                VoiceConnect
                <span className="ml-1 inline-flex items-center gap-1 text-[#5eead4]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5eead4]" />
                  Connected
                </span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#7C3AED]/40 bg-[#7C3AED]/15 text-[11px] font-semibold text-[#c4b5fd]">
                <Video className="w-3 h-3" />
                VideoConnect
                <span className="ml-1 inline-flex items-center gap-1 text-[#a78bfa]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#a78bfa]" />
                  Connected
                </span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#F97316]/40 bg-[#F97316]/15 text-[11px] font-semibold text-[#fdba74]">
                <Network className="w-3 h-3" />
                BuildConnect
                <span className="ml-1 inline-flex items-center gap-1 text-[#fb923c]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F97316]" />
                  Connected
                </span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#10B981]/40 bg-[#10B981]/15 text-[11px] font-semibold text-[#6ee7b7]">
                <ShieldCheck className="w-3 h-3" />
                ComplianceConnect
                <span className="ml-1 inline-flex items-center gap-1 text-[#34d399]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                  Connected
                </span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#5e9bf8]/40 bg-[#5e9bf8]/15 text-[11px] font-semibold text-[#bcd6ff]">
                <BarChart3 className="w-3 h-3" />
                MarketWatchOS
                <span className="ml-1 inline-flex items-center gap-1 text-[#7dd3fc]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse" />
                  Live
                </span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#a5b4fc]/30 bg-[#a5b4fc]/10 text-[11px] font-semibold text-[#c7d2fe]">
                <Radar className="w-3 h-3" />
                CompetitorWatchOS
                <span className="ml-1 inline-flex items-center gap-1 text-[#8A96B0]">
                  <Lock className="w-2.5 h-2.5" />
                  Soon
                </span>
              </span>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-5">
            {/* VoiceConnect — flagship add-on */}
            <div className="relative rounded-2xl border border-[#5eead4]/20 bg-gradient-to-br from-[#0F1830] to-[#0B1F1C] p-7">
              <div className="flex items-center gap-3 mb-4">
                <div className="shrink-0 w-12 h-12 rounded-2xl bg-[#5eead4]/10 border border-[#5eead4]/30 flex items-center justify-center shadow-[0_0_28px_rgba(94,234,212,0.25)]">
                  <Mic className="w-6 h-6 text-[#5eead4]" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-[#5eead4]">
                    Flagship Add-On · Connected
                  </span>
                  <h4 className="text-lg font-bold text-white tracking-tight">VoiceConnect</h4>
                </div>
              </div>
              <p className="text-sm text-[#a9b7d1] leading-relaxed">
                A separate field-voice product that connects to BidIntelligenceOS.
                Walkthrough notes flow into bid drafts, field observations into change
                orders, and site updates into client communications — hands-free. Ask,
                listen, act, and the intelligence follows the work.
              </p>
              <ul className="mt-4 grid sm:grid-cols-2 gap-2">
                {[
                  "Hands-free field capture",
                  "Walkthrough-to-bid",
                  "Field observations",
                  "Voice-to-change-order",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-[#94a3b8]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#5eead4] mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#voiceconnect"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#7fe3d8] hover:text-white transition-colors"
              >
                Explore VoiceConnect
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* VideoConnect — flagship add-on */}
            <div className="relative rounded-2xl border border-[#7C3AED]/25 bg-gradient-to-br from-[#0F1830] to-[#160B2E] p-7">
              <span className="absolute top-5 right-5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-[#7C3AED]/40 bg-[#7C3AED]/15 text-[10px] font-semibold uppercase tracking-wider text-[#c4b5fd]">
                <Sparkles className="w-2.5 h-2.5" />
                New
              </span>
              <div className="flex items-center gap-3 mb-4">
                <div className="shrink-0 w-12 h-12 rounded-2xl bg-[#7C3AED]/15 border border-[#7C3AED]/40 flex items-center justify-center shadow-[0_0_28px_rgba(124,58,237,0.3)]">
                  <Video className="w-6 h-6 text-[#a78bfa]" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-[#a78bfa]">
                    Flagship Add-On · Connected
                  </span>
                  <h4 className="text-lg font-bold text-white tracking-tight">VideoConnect</h4>
                </div>
              </div>
              <p className="text-sm text-[#a9b7d1] leading-relaxed">
                A separate visual-intelligence product that connects to
                BidIntelligenceOS. Capture a video walkthrough on site and it becomes
                structured visual context — surfacing conditions, potential damage, and
                scope so the walkthrough turns into a bid-ready draft you review.
              </p>
              <ul className="mt-4 grid sm:grid-cols-2 gap-2">
                {[
                  { icon: Camera, label: "Video walkthrough capture" },
                  { icon: ScanEye, label: "Visual intelligence" },
                  { icon: ShieldAlert, label: "Damage detection" },
                  { icon: PackageCheck, label: "Walkthrough-to-bid" },
                ].map((f) => (
                  <li key={f.label} className="flex items-start gap-2 text-xs text-[#94a3b8]">
                    <f.icon className="w-3.5 h-3.5 text-[#a78bfa] mt-0.5 shrink-0" />
                    <span>{f.label}</span>
                  </li>
                ))}
              </ul>
              <a
                href="/video-connect"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#c4b5fd] hover:text-white transition-colors"
              >
                Explore VideoConnect
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* BuildConnect — flagship add-on */}
            <div className="relative rounded-2xl border border-[#F97316]/25 bg-gradient-to-br from-[#0F1830] to-[#2A1206] p-7">
              <span className="absolute top-5 right-5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-[#F97316]/40 bg-[#F97316]/15 text-[10px] font-semibold uppercase tracking-wider text-[#fdba74]">
                <Sparkles className="w-2.5 h-2.5" />
                New
              </span>
              <div className="flex items-center gap-3 mb-4">
                <div className="shrink-0 w-12 h-12 rounded-2xl bg-[#F97316]/15 border border-[#F97316]/40 flex items-center justify-center shadow-[0_0_28px_rgba(249,115,22,0.3)]">
                  <Network className="w-6 h-6 text-[#fb923c]" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-[#fb923c]">
                    Flagship Add-On · Connected
                  </span>
                  <h4 className="text-lg font-bold text-white tracking-tight">BuildConnect</h4>
                </div>
              </div>
              <p className="text-sm text-[#a9b7d1] leading-relaxed">
                The subcontractor network for BidIntelligenceOS.{" "}
                <span className="text-[#fdba74] font-medium">You win, the network executes.</span>{" "}
                Match won jobs to vetted trade subs, track availability and assignments, and
                score performance and reliability over time — no self-perform required.
              </p>
              <ul className="mt-4 grid sm:grid-cols-2 gap-2">
                {[
                  { icon: Network, label: "Sub marketplace & trade matching" },
                  { icon: CalendarClock, label: "Availability & assignments" },
                  { icon: TrendingUp, label: "Performance & reliability scoring" },
                  { icon: HardHat, label: "No self-perform required" },
                ].map((f) => (
                  <li key={f.label} className="flex items-start gap-2 text-xs text-[#94a3b8]">
                    <f.icon className="w-3.5 h-3.5 text-[#fb923c] mt-0.5 shrink-0" />
                    <span>{f.label}</span>
                  </li>
                ))}
              </ul>
              <a
                href="/build-connect"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#fdba74] hover:text-white transition-colors"
              >
                Explore BuildConnect
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* ComplianceConnect — flagship add-on */}
            <div className="relative rounded-2xl border border-[#10B981]/25 bg-gradient-to-br from-[#0F1830] to-[#052A1E] p-7">
              <span className="absolute top-5 right-5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-[#10B981]/40 bg-[#10B981]/15 text-[10px] font-semibold uppercase tracking-wider text-[#6ee7b7]">
                <Sparkles className="w-2.5 h-2.5" />
                New
              </span>
              <div className="flex items-center gap-3 mb-4">
                <div className="shrink-0 w-12 h-12 rounded-2xl bg-[#10B981]/15 border border-[#10B981]/40 flex items-center justify-center shadow-[0_0_28px_rgba(16,185,129,0.3)]">
                  <ShieldCheck className="w-6 h-6 text-[#34d399]" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-[#34d399]">
                    Flagship Add-On · Connected
                  </span>
                  <h4 className="text-lg font-bold text-white tracking-tight">ComplianceConnect</h4>
                </div>
              </div>
              <p className="text-sm text-[#a9b7d1] leading-relaxed">
                Licensing, insurance, and bond readiness that keeps your compliance posture
                bid-ready. Readiness scoring flags gaps before they block a bid, a permit, or
                an audit — so you never lose work to a lapsed credential.
              </p>
              <ul className="mt-4 grid sm:grid-cols-2 gap-2">
                {[
                  { icon: ShieldCheck, label: "License & insurance tracking" },
                  { icon: FileCheck, label: "Bond readiness & capacity" },
                  { icon: Gauge, label: "Compliance readiness scoring" },
                  { icon: ClipboardCheck, label: "Audit readiness checklists" },
                ].map((f) => (
                  <li key={f.label} className="flex items-start gap-2 text-xs text-[#94a3b8]">
                    <f.icon className="w-3.5 h-3.5 text-[#34d399] mt-0.5 shrink-0" />
                    <span>{f.label}</span>
                  </li>
                ))}
              </ul>
              <a
                href="/compliance-connect"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#6ee7b7] hover:text-white transition-colors"
              >
                Explore ComplianceConnect
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
          <p className="mt-4 text-center text-xs text-[#6B7794]">
            Add-ons provide decision-support you review — not guaranteed outcomes.
          </p>
        </div>
      </section>

      {/* MarketWatchOS — LIVE flagship: Opportunity Radar */}
      <section className="max-w-6xl mx-auto px-6 lg:px-8 pb-4 scroll-mt-24">
        <div className="relative overflow-hidden rounded-2xl border border-[#38BDF8]/30 bg-gradient-to-br from-[#0F1830] to-[#0B1B33] p-8 lg:p-12">
          <div className="absolute inset-0 blueprint-texture opacity-10" aria-hidden="true" />
          <div
            className="absolute -top-32 left-0 w-[500px] h-[500px] rounded-full opacity-25 blur-2xl"
            style={{
              background:
                "radial-gradient(circle, rgba(56,189,248,0.35) 0%, rgba(56,189,248,0) 60%)",
            }}
            aria-hidden="true"
          />
          <div className="relative grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#38BDF8]/40 bg-[#38BDF8]/10 text-[#7dd3fc] text-xs font-semibold tracking-wide mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse" />
                Opportunity Radar — {MARKETWATCH.status}
              </div>
              <h2 className="text-2xl lg:text-4xl font-bold tracking-tight bg-gradient-to-b from-white to-[#bcd6ff] bg-clip-text text-transparent">
                {MARKETWATCH.name}
              </h2>
              <p className="mt-2 text-[#7dd3fc] font-medium">{MARKETWATCH.tagline}</p>
              <p className="mt-4 text-sm text-[#8A96B0] leading-relaxed">
                {MARKETWATCH.shortDescription}
              </p>
              <div className="mt-5 grid sm:grid-cols-2 gap-3">
                {MARKETWATCH.features.map((feat) => (
                  <div
                    key={feat.title}
                    className="rounded-xl border border-[#1C253B] bg-[#0B1122]/60 p-4"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <Signal className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
                      <h3 className="text-xs font-semibold text-white leading-tight">
                        {feat.title}
                      </h3>
                    </div>
                    <p className="text-[11px] text-[#8A96B0] leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-start gap-2 rounded-lg border border-[#38BDF8]/20 bg-[#0B1122]/60 p-3.5">
                <ShieldCheck className="w-4 h-4 text-[#38BDF8] mt-0.5 shrink-0" />
                <p className="text-xs text-[#94a3b8] leading-relaxed">
                  {MARKETWATCH.guardrail}
                </p>
              </div>
            </div>

            {/* Live radar alert feed */}
            <div className="rounded-2xl border border-[#141C30] bg-[#0B1122] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] overflow-hidden">
              <div className="flex items-center gap-2 px-4 h-11 border-b border-[#141C30] bg-[#0A0F1E]">
                <Radar className="w-4 h-4 text-[#38BDF8]" />
                <span className="text-xs font-semibold text-[#cbd5e1]">
                  Opportunity Radar — Live Alerts
                </span>
                <span className="ml-auto inline-flex items-center gap-1.5 text-[10px] text-[#7dd3fc]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse" />
                  Scanning public signals
                </span>
              </div>
              <div className="divide-y divide-[#141C30]">
                {MARKETWATCH.radarAlerts.map((a) => (
                  <div key={a.title} className="flex items-center gap-3 px-4 py-3.5">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-[#e2e8f0] truncate">{a.title}</p>
                      <p className="mt-0.5 text-[11px] text-[#6B7794]">
                        {a.tag} · {a.trade}
                      </p>
                    </div>
                    <div className="shrink-0 flex items-center gap-2">
                      <div className="h-1.5 w-20 rounded-full bg-[#1C253B] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#38BDF8] to-[#22C55E]"
                          style={{ width: `${a.score}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-white w-8 text-right">
                        {a.score}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-3 border-t border-[#141C30] bg-[#0A0F1E] text-[10px] text-[#6B7794]">
                Scored 0–100 by fit, trade & regional demand heat · public signals only
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Government Contracting — built-in module strip */}
      <section className="max-w-6xl mx-auto px-6 lg:px-8 pb-4">
        <div className="relative overflow-hidden rounded-2xl border border-[#5eead4]/25 bg-gradient-to-br from-[#0F1830] to-[#0B1F1C] p-8 lg:p-10">
          <div className="absolute inset-0 blueprint-texture opacity-10" aria-hidden="true" />
          <div className="relative flex flex-col lg:flex-row lg:items-start gap-8">
            <div className="lg:max-w-xs shrink-0">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#5eead4]/30 bg-[#5eead4]/10 text-[#7fe3d8] text-xs font-semibold tracking-wide mb-4">
                <Landmark className="w-3.5 h-3.5" />
                Built-In Module
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold tracking-tight bg-gradient-to-b from-white to-[#a9f0e0] bg-clip-text text-transparent">
                Government Contracting
              </h2>
              <p className="mt-2 text-[#7fe3d8] font-medium text-sm">{GOVERNMENT.tagline}</p>
              <p className="mt-3 text-sm text-[#8A96B0] leading-relaxed">
                Win in the public sector without the paperwork drag. Registrations,
                set-asides, readiness, and deadlines — tracked in one built-in module.
              </p>
            </div>
            <div className="flex-1 grid sm:grid-cols-2 gap-3">
              {GOVERNMENT.points.map((p) => (
                <div
                  key={p.title}
                  className="rounded-xl border border-[#1C253B] bg-[#0B1122]/60 p-4"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <p.icon className="w-4 h-4 text-[#5eead4] shrink-0" />
                    <h3 className="text-sm font-semibold text-white leading-tight">
                      {p.title}
                    </h3>
                  </div>
                  <p className="text-xs text-[#8A96B0] leading-relaxed">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative mt-5 flex items-start gap-2 rounded-lg border border-[#5eead4]/20 bg-[#0B1122]/60 p-3.5">
            <ShieldCheck className="w-4 h-4 text-[#5eead4] mt-0.5 shrink-0" />
            <p className="text-xs text-[#94a3b8] leading-relaxed">{GOVERNMENT.guardrail}</p>
          </div>
        </div>
      </section>

      {/* Coming-soon locked add-ons — CompetitorWatchOS + MarketWatchOS */}
      <section
        id="competitorwatch"
        className="max-w-6xl mx-auto px-6 lg:px-8 pb-16 scroll-mt-24 space-y-6"
      >
        <div className="text-center">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#a5b4fc]">
            <Lock className="w-3.5 h-3.5" />
            On The Roadmap
          </span>
          <h2 className="mt-2 text-3xl lg:text-5xl font-bold tracking-tight bg-gradient-to-b from-white to-[#c7d2fe] bg-clip-text text-transparent">
            Intelligence add-ons in development
          </h2>
          <p className="mt-3 text-[#8A96B0] max-w-2xl mx-auto">
            One more standalone add-on is coming to the marketplace — built on lawful,
            public, and contractor-provided data only.
          </p>
        </div>
        <div className="relative overflow-hidden rounded-2xl border border-[#a5b4fc]/25 bg-gradient-to-br from-[#0F1830] to-[#141033] p-8 lg:p-12">
          <div className="absolute inset-0 blueprint-texture opacity-10" aria-hidden="true" />
          <div
            className="absolute -top-32 right-0 w-[500px] h-[500px] rounded-full opacity-25 blur-2xl"
            style={{
              background:
                "radial-gradient(circle, rgba(165,180,252,0.35) 0%, rgba(165,180,252,0) 60%)",
            }}
            aria-hidden="true"
          />
          <div className="relative grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#a5b4fc]/30 bg-[#a5b4fc]/10 text-[#c7d2fe] text-xs font-semibold tracking-wide mb-5">
                <Radar className="w-3.5 h-3.5" />
                {COMPETITORWATCH.status}
              </div>
              <h2 className="text-2xl lg:text-4xl font-bold tracking-tight bg-gradient-to-b from-white to-[#c7d2fe] bg-clip-text text-transparent">
                {COMPETITORWATCH.name}
              </h2>
              <p className="mt-2 text-[#c7d2fe] font-medium">{COMPETITORWATCH.tagline}</p>
              <p className="mt-4 text-sm text-[#8A96B0] leading-relaxed">
                {COMPETITORWATCH.shortDescription}
              </p>
              <div className="mt-5 flex items-start gap-2 rounded-lg border border-[#a5b4fc]/20 bg-[#0B1122]/60 p-3.5">
                <ShieldCheck className="w-4 h-4 text-[#a5b4fc] mt-0.5 shrink-0" />
                <p className="text-xs text-[#94a3b8] leading-relaxed">
                  {COMPETITORWATCH.guardrail}
                </p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {COMPETITORWATCH.features.slice(0, 6).map((feat) => (
                <div
                  key={feat.title}
                  className="relative rounded-xl border border-[#1C253B] bg-[#0B1122]/60 p-4"
                >
                  <Lock className="absolute top-3 right-3 w-3.5 h-3.5 text-[#4A5678]" />
                  <div className="flex items-center gap-2 mb-1.5 pr-5">
                    <Eye className="w-3.5 h-3.5 text-[#a5b4fc] shrink-0" />
                    <h3 className="text-xs font-semibold text-white leading-tight">
                      {feat.title}
                    </h3>
                  </div>
                  <p className="text-[11px] text-[#8A96B0] leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </section>

      {/* Walkthrough */}
      <section
        ref={playerRef}
        className="relative max-w-5xl mx-auto px-6 lg:px-8 py-12 lg:py-16 scroll-mt-24"
      >
        <div className="text-center mb-8">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#38BDF8]">
            Product Walkthrough
          </span>
          <h2 className="mt-2 text-3xl lg:text-4xl font-bold text-white tracking-tight">
            See how a bid moves from lead to win
          </h2>
          <p className="mt-3 text-[#8A96B0] max-w-xl mx-auto">
            A narrated, 50-second tour of the workspace — from the Command Center to a
            vendor-ready package.
          </p>
        </div>
        <WalkthroughPlayer />
      </section>

      {/* VoiceConnect add-on */}
      <VoiceConnectMarketingSection onLaunchRoseDemo={onLaunchRoseDemo} />

      {/* Closing CTA */}
      <section className="max-w-6xl mx-auto px-6 lg:px-8 pb-16 pt-16">
        <div className="relative overflow-hidden rounded-2xl border border-[#38BDF8]/25 bg-gradient-to-br from-[#0F1830] to-[#111A2E] p-10 lg:p-14 text-center">
          <div className="absolute inset-0 blueprint-texture opacity-10" aria-hidden="true" />
          <div
            className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-30 blur-2xl"
            style={{
              background:
                "radial-gradient(circle, rgba(56,189,248,0.3) 0%, rgba(56,189,248,0) 60%)",
            }}
            aria-hidden="true"
          />
          <div className="relative">
            <img
              src={brandShield}
              alt="BidIntelligenceOS"
              className="w-44 h-44 lg:w-56 lg:h-56 object-contain mx-auto mb-5"
            />
            <h2 className="text-3xl lg:text-5xl font-bold tracking-tight bg-gradient-to-b from-white to-[#a9b7d1] bg-clip-text text-transparent">
              Ready to win more bids?
            </h2>
            <p className="mt-3 text-[#cbd5e1] max-w-lg mx-auto">
              Explore the full interactive demo with sample data — no setup required.
            </p>
            <button
              onClick={onLaunchRoseDemo}
              className="group mt-7 inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg bg-gradient-to-b from-[#4CC4FB] to-[#2A9BD8] text-[#04121F] font-semibold text-sm transition-all shadow-[0_0_36px_rgba(56,189,248,0.4)] hover:shadow-[0_0_48px_rgba(56,189,248,0.6)]"
            >
              Launch Rose Demo
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-[#6B7794]">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
                No setup required
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
                Sample data included
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
                Human-reviewed output
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[#8A96B0] text-xs">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#5b6680]">
              The CCA Ecosystem
            </span>
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
              <a
                href="https://demo.ccacomplianceconnect.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#c084fc]" /> ComplianceConnect
              </a>
              <a
                href="https://www.contractor-compliance-authority.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" /> Contractor Compliance Authority
              </a>
              <a
                href="https://complianceauthoritygroup.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#5eead4]" /> Compliance Authority Group
              </a>
            </div>
          </div>
          <div className="border-t border-white/5 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[#8A96B0] text-xs">
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
        </div>
      </footer>
    </div>
  );
}
