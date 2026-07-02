import { Layout } from "@/components/layout";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { activateOnKey } from "@/lib/a11y";
import {
  ArrowRight,
  Video,
  Film,
  ScanEye,
  AlertTriangle,
  FileText,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Camera,
  Wrench,
  ClipboardCheck,
} from "lucide-react";

const VIOLET = "#7C3AED";

const WALKTHROUGHS = [
  {
    icon: Video,
    site: "Riverside Medical — Roof & Mechanical",
    meta: "Bldg A exterior + rooftop units",
    duration: "08:42",
    date: "Today, 10:12 AM",
    scopeItems: 18,
    issues: 4,
    status: "Draft bid created",
    done: true,
  },
  {
    icon: Film,
    site: "Cedar Logistics — Warehouse Interior",
    meta: "Slab, dock doors, lighting",
    duration: "12:20",
    date: "Yesterday",
    scopeItems: 26,
    issues: 6,
    status: "Draft bid created",
    done: true,
  },
  {
    icon: Camera,
    site: "Harbor Point — Water Damage Loss",
    meta: "Units 2A–2C mitigation walk",
    duration: "06:15",
    date: "2 days ago",
    scopeItems: 14,
    issues: 8,
    status: "Under review",
    done: false,
  },
  {
    icon: ScanEye,
    site: "Metro Transit — Platform Retrofit",
    meta: "Structural & finishes survey",
    duration: "15:48",
    date: "3 days ago",
    scopeItems: 31,
    issues: 3,
    status: "Under review",
    done: false,
  },
];

const STATS = [
  { label: "Walkthroughs this week", value: "7" },
  { label: "Scope items extracted", value: "89" },
  { label: "Draft bids created", value: "3" },
];

const PILLARS = [
  {
    icon: ScanEye,
    title: "Walkthrough-to-Bid AI",
    body: "Reads your video walkthrough, extracts visible scope, and drafts a bid-ready package for review.",
  },
  {
    icon: Wrench,
    title: "Damage & Condition Detection",
    body: "Flags visible damage, deficiencies, and conditions with timestamps so nothing is missed.",
  },
  {
    icon: ClipboardCheck,
    title: "Automatic Documentation",
    body: "Generates a documentation packet — captioned frames, notes, and detected issues — for the record.",
  },
];

const FEEDS = [
  "Walkthrough-to-bid drafts",
  "Detected damage & condition notes",
  "Visual scope item lists",
  "Auto-generated documentation packets",
];

export default function VideoConnect() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  return (
    <Layout>
      <div className="space-y-8 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm p-6 lg:p-8">
          <div className="absolute top-0 right-0 p-6 opacity-[0.05] pointer-events-none">
            <Video className="w-48 h-48" style={{ color: VIOLET }} />
          </div>
          <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ background: `${VIOLET}14`, border: `1px solid ${VIOLET}33` }}
                  >
                    <Video className="w-5 h-5" style={{ color: VIOLET }} />
                  </div>
                  <span className="text-xl font-bold text-slate-900 tracking-tight">VideoConnect</span>
                </div>
                <span
                  className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Connected add-on
                </span>
              </div>
              <p className="mt-3 text-lg text-slate-900 font-semibold tracking-tight">
                Walk it on video. Let the OS read the room.
              </p>
              <p className="mt-1.5 text-sm text-slate-500 max-w-xl leading-relaxed">
                The visual field companion for CCA BidIntelligenceOS. Record a site walkthrough and
                VideoConnect applies visual intelligence — detecting conditions, damage, and scope —
                then hands off a walkthrough-to-bid draft for your review.
              </p>
            </div>
            <div
              className="shrink-0 rounded-xl border px-4 py-3 flex items-center gap-3"
              style={{ borderColor: `${VIOLET}33`, background: `${VIOLET}0D` }}
            >
              <ScanEye className="w-5 h-5" style={{ color: VIOLET }} />
              <div>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-900">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: VIOLET }} />
                  Visual intelligence
                </div>
                <div className="text-[10px] text-slate-500">Capture · Detect · Draft</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {STATS.map((s) => (
            <div key={s.label} className="rounded-xl border border-[#E2E8F0] bg-white shadow-sm p-5">
              <div className="text-[11px] uppercase tracking-widest text-slate-500">{s.label}</div>
              <div className="mt-1 text-3xl font-bold text-slate-900">{s.value}</div>
            </div>
          ))}
        </div>

        {/* Capability pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PILLARS.map((p) => (
            <div key={p.title} className="rounded-xl border border-[#E2E8F0] bg-white shadow-sm p-5">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: `${VIOLET}14`, border: `1px solid ${VIOLET}33` }}
              >
                <p.icon className="w-5 h-5" style={{ color: VIOLET }} />
              </div>
              <h3 className="mt-3 text-sm font-semibold text-slate-900">{p.title}</h3>
              <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>

        {/* Recent walkthroughs */}
        <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E2E8F0]">
            <h3 className="text-sm font-semibold text-slate-900">Recent Walkthroughs</h3>
            <Sparkles className="w-4 h-4" style={{ color: VIOLET }} />
          </div>
          {WALKTHROUGHS.map((w) => {
            const open = () =>
              w.done
                ? navigate("/bids/1")
                : toast({
                    title: "Walkthrough under review",
                    description: "This walkthrough draft is awaiting review before a bid is built.",
                  });
            return (
              <div
                key={w.site}
                onClick={open}
                onKeyDown={activateOnKey(open)}
                role="button"
                tabIndex={0}
                aria-label={w.done ? `Open draft bid from ${w.site}` : `Walkthrough ${w.site} is under review`}
                className="flex items-center gap-3 px-5 py-3.5 border-b border-[#E2E8F0] last:border-0 hover:bg-[#F1F5F9] transition-colors cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#7C3AED]"
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: `${VIOLET}14`, border: `1px solid ${VIOLET}33` }}
                >
                  <w.icon className="w-4 h-4" style={{ color: VIOLET }} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm text-slate-900 truncate">{w.site}</div>
                  <div className="text-xs text-slate-500 truncate">{w.meta} · {w.duration}</div>
                </div>
                <div className="hidden md:flex items-center gap-4 shrink-0 text-center">
                  <div>
                    <div className="text-sm font-bold text-slate-900">{w.scopeItems}</div>
                    <div className="text-[10px] uppercase tracking-widest text-slate-500">Scope</div>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-amber-600">{w.issues}</div>
                    <div className="text-[10px] uppercase tracking-widest text-slate-500">Issues</div>
                  </div>
                </div>
                <div className="hidden lg:block text-xs text-slate-500 shrink-0 w-24 text-right">{w.date}</div>
                <span
                  className={`shrink-0 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-medium border ${
                    w.done
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}
                >
                  {w.done ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                  {w.status}
                </span>
              </div>
            );
          })}
        </div>

        {/* Feeds into BidIntelligenceOS */}
        <div className="rounded-2xl border border-[#E2E8F0] bg-white shadow-sm p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            <div className="flex-1">
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: VIOLET }}>
                Feeds into BidIntelligenceOS
              </span>
              <h3 className="mt-2 text-xl font-bold text-slate-900 tracking-tight">
                From walkthrough to draft bid
              </h3>
              <p className="mt-2 text-sm text-slate-500 max-w-md leading-relaxed">
                Every walkthrough streams review-ready drafts and visual context straight into the OS
                — no re-keying, no lost detail.
              </p>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {FEEDS.map((f) => (
                  <div
                    key={f}
                    className="flex items-start gap-2 rounded-lg border border-[#E2E8F0] bg-[#F1F5F9] px-3 py-2 text-xs text-slate-700"
                  >
                    <ArrowRight className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#2563EB]" />
                    {f}
                  </div>
                ))}
              </div>
            </div>
            <div className="shrink-0 lg:w-72">
              <div className="rounded-xl border border-[#E2E8F0] bg-[#F1F5F9] p-5 flex flex-col items-center text-center">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ background: `${VIOLET}14`, border: `1px solid ${VIOLET}33` }}
                >
                  <FileText className="w-6 h-6" style={{ color: VIOLET }} />
                </div>
                <div className="mt-3 text-sm font-semibold text-slate-900">Draft walkthrough bid ready</div>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  Review the extracted scope, detected issues, and documentation before building.
                </p>
                <button
                  onClick={() => {
                    toast({
                      title: "Draft bid profile created",
                      description: "Walkthrough sent to BidIntelligenceOS. Review required before use.",
                    });
                    navigate("/bids/1");
                  }}
                  className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold text-white transition-colors hover:brightness-110"
                  style={{ background: VIOLET }}
                >
                  Create Draft Bid Profile
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="mt-2 text-[10px] text-slate-500">
                  Review required before the bid is used or exported.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div className="flex items-start gap-2 text-xs text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: VIOLET }} />
          <p className="leading-relaxed max-w-4xl">
            VideoConnect output is decision-support only. Visual detections and drafts require human
            review before any bid is built or exported. No outcome is guaranteed.
          </p>
        </div>
      </div>
    </Layout>
  );
}
