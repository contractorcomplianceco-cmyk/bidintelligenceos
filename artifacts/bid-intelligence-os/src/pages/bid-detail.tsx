import { Layout } from "@/components/layout";
import { Link, useParams, useLocation } from "wouter";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Building2,
  CalendarClock,
  ListChecks,
  Calculator,
  ShieldAlert,
  FileText,
  Users,
  CheckCircle2,
  Circle,
  Lock,
  Target,
  ShieldCheck,
  Pencil,
} from "lucide-react";
import { seedBids, bidDetails, documentReadiness, competitorSignals } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

const COST_TEMPLATE = [
  { label: "Equipment & Materials", pct: 0.43 },
  { label: "Field Labor", pct: 0.3 },
  { label: "Subcontractors", pct: 0.1 },
  { label: "Equipment & Rentals", pct: 0.05 },
  { label: "General Conditions", pct: 0.07 },
  { label: "Contingency", pct: 0.05 },
];

function levelColor(level: string) {
  if (level === "High") return { color: "#EF4444", bg: "rgba(239,68,68,0.1)" };
  if (level === "Medium") return { color: "#F59E0B", bg: "rgba(245,158,11,0.1)" };
  return { color: "#22C55E", bg: "rgba(34,197,94,0.1)" };
}

export default function BidDetail() {
  const params = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const bid = seedBids.find((b) => b.id === params.id);
  const detail = bid ? bidDetails[bid.id] : undefined;

  if (!bid || !detail) {
    return (
      <Layout>
        <div className="max-w-xl mx-auto text-center py-24">
          <h2 className="text-2xl font-bold text-white">Bid not found</h2>
          <p className="text-[#8A96B0] mt-2">This opportunity is no longer available.</p>
          <Link
            href="/bids"
            className="inline-flex items-center gap-2 mt-6 text-[#38BDF8] hover:text-white transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Bids
          </Link>
        </div>
      </Layout>
    );
  }

  const costLines = COST_TEMPLATE.map((c) => ({
    label: c.label,
    amount: Math.round((bid.amount * c.pct) / 1000) * 1000,
  }));

  const kpis = [
    { label: "Bid Value", value: `$${(bid.amount / 1000000).toFixed(2)}M`, icon: Calculator, color: "#38BDF8" },
    { label: "Fit Score", value: `${bid.fit ?? "-"}%`, icon: Target, color: "#38BDF8" },
    { label: "Confidence", value: `${bid.confidence ?? "-"}%`, icon: ShieldCheck, color: "#22C55E" },
    { label: "Days Remaining", value: `${bid.daysRemaining ?? "-"}`, icon: CalendarClock, color: "#F59E0B" },
  ];

  return (
    <Layout>
      <div className="space-y-6 max-w-[1500px] mx-auto">
        {/* Back + header */}
        <div>
          <Link
            href="/bids"
            className="inline-flex items-center gap-1.5 text-xs text-[#8A96B0] hover:text-[#38BDF8] transition-colors font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Bids Workspace
          </Link>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-[#1C253B] bg-gradient-to-br from-[#0F1830] to-[#111A2E] p-6 lg:p-7">
          <div className="absolute inset-0 blueprint-texture opacity-10" aria-hidden="true" />
          <div className="relative flex flex-col lg:flex-row lg:items-start justify-between gap-5">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`inline-block px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest rounded ${
                    bid.publicPrivate === "Public"
                      ? "bg-[#38BDF8]/10 text-[#38BDF8]"
                      : "bg-purple-500/10 text-purple-400"
                  }`}
                >
                  {bid.publicPrivate}
                </span>
                <span className="inline-block px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest rounded bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/20">
                  {bid.status}
                </span>
                <span className="text-[11px] text-[#8A96B0] uppercase tracking-widest">{bid.type}</span>
              </div>
              <h2 className="mt-3 text-2xl lg:text-3xl font-bold text-white tracking-tight">{bid.name}</h2>
              <div className="mt-2 flex items-center gap-4 flex-wrap text-sm text-[#8A96B0]">
                <span className="inline-flex items-center gap-1.5">
                  <Building2 className="w-4 h-4" /> {bid.recipient}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" /> {bid.location}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CalendarClock className="w-4 h-4" /> Due {bid.date}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => toast({ title: "Edit bid", description: "Opening the bid record for editing." })}
                className="inline-flex items-center gap-2 rounded-lg border border-[#1C253B] bg-[#0B1222] px-4 py-2.5 text-sm font-medium text-[#c2cad6] hover:bg-[#151D2E] transition-colors"
              >
                <Pencil className="w-4 h-4" /> Edit
              </button>
              <button
                onClick={() => navigate("/scope-analyzer")}
                className="inline-flex items-center gap-2 rounded-lg bg-[#38BDF8] px-4 py-2.5 text-sm font-semibold text-[#06080B] hover:bg-[#5cccfa] transition-colors"
              >
                Open Analysis Workspace <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((k) => (
            <div key={k.label} className="rounded-xl border border-[#1C253B] bg-[#0F1830] p-4">
              <div className="flex items-center gap-2 mb-2">
                <k.icon className="w-4 h-4" style={{ color: k.color }} />
                <span className="text-[10px] font-bold text-[#8A96B0] uppercase tracking-wider">{k.label}</span>
              </div>
              <div className="text-2xl font-bold text-white tracking-tight">{k.value}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Summary + scope */}
            <div className="rounded-xl border border-[#1C253B] bg-[#0F1830] overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3.5 border-b border-[#1C253B]">
                <ListChecks className="w-4 h-4 text-[#38BDF8]" />
                <h3 className="text-sm font-bold text-white tracking-wide">SCOPE SUMMARY</h3>
              </div>
              <div className="p-5">
                <p className="text-sm text-[#c2cad6] leading-relaxed">{detail.summary}</p>
                <ul className="mt-4 space-y-2.5">
                  {detail.scopeItems.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-[#c2cad6]">
                      <CheckCircle2 className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/scope-analyzer"
                  className="inline-flex items-center gap-1.5 mt-5 text-xs text-[#38BDF8] hover:text-white transition-colors font-medium"
                >
                  Open full scope analysis <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Cost summary */}
            <div className="rounded-xl border border-[#1C253B] bg-[#0F1830] overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3.5 border-b border-[#1C253B]">
                <Calculator className="w-4 h-4 text-[#38BDF8]" />
                <h3 className="text-sm font-bold text-white tracking-wide">COST SUMMARY</h3>
              </div>
              <div className="p-5">
                <div className="space-y-2.5">
                  {costLines.map((line) => (
                    <div key={line.label} className="flex items-center justify-between">
                      <span className="text-sm text-[#8A96B0]">{line.label}</span>
                      <span className="text-sm font-medium text-[#c2cad6]">
                        ${line.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                  <div className="h-px w-full bg-[#1C253B] my-1" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">Target Bid Value</span>
                    <span className="text-base font-bold text-[#38BDF8]">
                      ${bid.amount.toLocaleString()}
                    </span>
                  </div>
                </div>
                <p className="mt-4 text-[11px] text-[#5b6680] leading-relaxed">
                  Illustrative breakdown for this demo. Final pricing is set in the analysis
                  workspace and requires review before submission.
                </p>
                <Link
                  href="/cost-inputs"
                  className="inline-flex items-center gap-1.5 mt-3 text-xs text-[#38BDF8] hover:text-white transition-colors font-medium"
                >
                  Adjust cost inputs <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Timeline */}
            <div className="rounded-xl border border-[#1C253B] bg-[#0F1830] overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3.5 border-b border-[#1C253B]">
                <CalendarClock className="w-4 h-4 text-[#38BDF8]" />
                <h3 className="text-sm font-bold text-white tracking-wide">TIMELINE</h3>
              </div>
              <div className="p-5">
                <ol className="space-y-4">
                  {detail.milestones.map((m, i) => (
                    <li key={m.label} className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        {m.status === "done" ? (
                          <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />
                        ) : m.status === "active" ? (
                          <div className="w-5 h-5 rounded-full border-2 border-[#38BDF8] flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-[#38BDF8]" />
                          </div>
                        ) : (
                          <Circle className="w-5 h-5 text-[#3E4752]" />
                        )}
                        {i < detail.milestones.length - 1 && (
                          <div className="w-px h-6 bg-[#1C253B] mt-1" />
                        )}
                      </div>
                      <div className="pt-0.5">
                        <div
                          className={`text-sm font-medium ${
                            m.status === "upcoming" ? "text-[#8A96B0]" : "text-white"
                          }`}
                        >
                          {m.label}
                        </div>
                        <div className="text-[11px] text-[#5b6680]">{m.date}</div>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Owner contact */}
            <div className="rounded-xl border border-[#1C253B] bg-[#0F1830] p-5">
              <h3 className="text-sm font-bold text-white tracking-wide mb-3">OWNER CONTACT</h3>
              <div className="text-sm font-semibold text-white">{detail.contact.name}</div>
              <div className="text-xs text-[#8A96B0] mt-0.5">{detail.contact.role}</div>
              <div className="text-xs text-[#8A96B0]">{detail.contact.org}</div>
              {bid.nextAction && (
                <div className="mt-4 rounded-lg border border-[#1C253B] bg-[#0B1222] p-3">
                  <div className="text-[10px] uppercase tracking-widest text-[#5b6680]">Next Action</div>
                  <div className="text-sm text-white mt-1">{bid.nextAction}</div>
                  <div className="text-[11px] text-[#8A96B0]">by {bid.nextActionDate}</div>
                </div>
              )}
            </div>

            {/* Risks */}
            <div className="rounded-xl border border-[#1C253B] bg-[#0F1830] overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3.5 border-b border-[#1C253B]">
                <ShieldAlert className="w-4 h-4 text-[#F59E0B]" />
                <h3 className="text-sm font-bold text-white tracking-wide">RISK FLAGS</h3>
              </div>
              <div className="p-3">
                {detail.risks.map((r) => {
                  const c = levelColor(r.level);
                  return (
                    <div
                      key={r.label}
                      className="flex items-center justify-between px-2 py-2.5 border-b border-[#151D2E] last:border-0"
                    >
                      <span className="text-sm text-[#c2cad6] pr-2">{r.label}</span>
                      <span
                        className="shrink-0 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded"
                        style={{ color: c.color, background: c.bg }}
                      >
                        {r.level}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Documents */}
            <div className="rounded-xl border border-[#1C253B] bg-[#0F1830] overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#1C253B]">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#38BDF8]" />
                  <h3 className="text-sm font-bold text-white tracking-wide">DOCUMENTS</h3>
                </div>
                <Link href="/documents" className="text-xs text-[#38BDF8] hover:text-white transition-colors font-medium">
                  View all
                </Link>
              </div>
              <div className="p-3">
                {documentReadiness.map((doc) => (
                  <div key={doc.id} className="flex items-center gap-2 px-2 py-2">
                    {doc.status === "complete" ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
                    ) : (
                      <ShieldAlert className="w-3.5 h-3.5 text-yellow-500" />
                    )}
                    <span className={`text-sm ${doc.status === "complete" ? "text-[#8A96B0]" : "text-white"}`}>
                      {doc.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Competitor context */}
            <div className="rounded-xl border border-[#1C253B] bg-[#0F1830] overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#1C253B]">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#38BDF8]" />
                  <h3 className="text-sm font-bold text-white tracking-wide">COMPETITOR CONTEXT</h3>
                </div>
                <Link href="/competitors" className="text-xs text-[#38BDF8] hover:text-white transition-colors font-medium">
                  View all
                </Link>
              </div>
              <div className="p-3">
                {competitorSignals.slice(0, 3).map((s) => (
                  <div key={s.id} className="flex items-center justify-between px-2 py-2">
                    <span className="text-sm text-[#c2cad6]">{s.name}</span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                        s.threat === "High"
                          ? "text-red-400 bg-red-400/10"
                          : s.threat === "Medium"
                          ? "text-yellow-500 bg-yellow-500/10"
                          : "text-slate-400 bg-slate-400/10"
                      }`}
                    >
                      {s.threat}
                    </span>
                  </div>
                ))}
                <p className="px-2 pt-2 text-[10px] text-[#5b6680] leading-relaxed">
                  Based on lawful, publicly available signals only.
                </p>
              </div>
            </div>

            {/* Next steps actions */}
            <div className="rounded-xl border border-[#38BDF8]/25 bg-[#0F1830] p-5 space-y-2.5">
              <h3 className="text-sm font-bold text-white tracking-wide mb-1">NEXT STEPS</h3>
              <button
                onClick={() => navigate("/bid-fit")}
                className="w-full inline-flex items-center justify-between rounded-lg border border-[#1C253B] bg-[#0B1222] px-4 py-2.5 text-sm font-medium text-[#c2cad6] hover:bg-[#151D2E] transition-colors"
              >
                Evaluate bid-fit score <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate("/strategy-memo")}
                className="w-full inline-flex items-center justify-between rounded-lg border border-[#1C253B] bg-[#0B1222] px-4 py-2.5 text-sm font-medium text-[#c2cad6] hover:bg-[#151D2E] transition-colors"
              >
                <span className="inline-flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-[#8A96B0]" /> Internal strategy memo
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate("/package-builder")}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#38BDF8] px-4 py-2.5 text-sm font-semibold text-[#06080B] hover:bg-[#5cccfa] transition-colors"
              >
                Build vendor bid package <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[10px] text-[#5b6680] text-center pt-1">
                Internal strategy stays separate from the vendor-facing package. Review required before export.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
