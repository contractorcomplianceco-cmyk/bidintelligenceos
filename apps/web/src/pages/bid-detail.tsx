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
import { seedBids, bidDetails, documentReadiness, competitorSignals } from "@core/data";
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
          <h2 className="text-2xl font-bold text-slate-900">Bid not found</h2>
          <p className="text-slate-500 mt-2">This opportunity is no longer available.</p>
          <Link
            href="/bids"
            className="inline-flex items-center gap-2 mt-6 text-[#0284C7] hover:text-slate-900 transition-colors font-medium"
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
    { label: "Bid Value", value: `$${(bid.amount / 1000000).toFixed(2)}M`, icon: Calculator, color: "#0284C7" },
    { label: "Fit Score", value: `${bid.fit ?? "-"}%`, icon: Target, color: "#0284C7" },
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
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#0284C7] transition-colors font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Bids Workspace
          </Link>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-[#E2E8F0] bg-gradient-to-br from-white to-[#F8FAFC] p-6 lg:p-7">
          <div className="absolute inset-0 blueprint-texture opacity-10" aria-hidden="true" />
          <div className="relative flex flex-col lg:flex-row lg:items-start justify-between gap-5">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`inline-block px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest rounded ${
                    bid.publicPrivate === "Public"
                      ? "bg-sky-50 text-[#0284C7]"
                      : "bg-purple-50 text-purple-700 border border-purple-200"
                  }`}
                >
                  {bid.publicPrivate}
                </span>
                <span className="inline-block px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest rounded bg-sky-50 text-[#0284C7] border border-sky-200">
                  {bid.status}
                </span>
                <span className="text-[11px] text-slate-500 uppercase tracking-widest">{bid.type}</span>
              </div>
              <h2 className="mt-3 text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">{bid.name}</h2>
              <div className="mt-2 flex items-center gap-4 flex-wrap text-sm text-slate-500">
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
                className="inline-flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-[#F1F5F9] transition-colors"
              >
                <Pencil className="w-4 h-4" /> Edit
              </button>
              <button
                onClick={() => navigate("/scope-analyzer")}
                className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1d4ed8] transition-colors"
              >
                Open Analysis Workspace <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((k) => (
            <div key={k.label} className="rounded-xl border border-[#E2E8F0] bg-white p-4">
              <div className="flex items-center gap-2 mb-2">
                <k.icon className="w-4 h-4" style={{ color: k.color }} />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{k.label}</span>
              </div>
              <div className="text-2xl font-bold text-slate-900 tracking-tight">{k.value}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Summary + scope */}
            <div className="rounded-xl border border-[#E2E8F0] bg-white overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3.5 border-b border-[#E2E8F0]">
                <ListChecks className="w-4 h-4 text-[#0284C7]" />
                <h3 className="text-sm font-bold text-slate-900 tracking-wide">SCOPE SUMMARY</h3>
              </div>
              <div className="p-5">
                <p className="text-sm text-slate-700 leading-relaxed">{detail.summary}</p>
                <ul className="mt-4 space-y-2.5">
                  {detail.scopeItems.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/scope-analyzer"
                  className="inline-flex items-center gap-1.5 mt-5 text-xs text-[#0284C7] hover:text-slate-900 transition-colors font-medium"
                >
                  Open full scope analysis <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Cost summary */}
            <div className="rounded-xl border border-[#E2E8F0] bg-white overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3.5 border-b border-[#E2E8F0]">
                <Calculator className="w-4 h-4 text-[#0284C7]" />
                <h3 className="text-sm font-bold text-slate-900 tracking-wide">COST SUMMARY</h3>
              </div>
              <div className="p-5">
                <div className="space-y-2.5">
                  {costLines.map((line) => (
                    <div key={line.label} className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">{line.label}</span>
                      <span className="text-sm font-medium text-slate-700">
                        ${line.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                  <div className="h-px w-full bg-[#E2E8F0] my-1" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900">Target Bid Value</span>
                    <span className="text-base font-bold text-[#0284C7]">
                      ${bid.amount.toLocaleString()}
                    </span>
                  </div>
                </div>
                <p className="mt-4 text-[11px] text-slate-400 leading-relaxed">
                  Illustrative breakdown for this demo. Final pricing is set in the analysis
                  workspace and requires review before submission.
                </p>
                <Link
                  href="/cost-inputs"
                  className="inline-flex items-center gap-1.5 mt-3 text-xs text-[#0284C7] hover:text-slate-900 transition-colors font-medium"
                >
                  Adjust cost inputs <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Timeline */}
            <div className="rounded-xl border border-[#E2E8F0] bg-white overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3.5 border-b border-[#E2E8F0]">
                <CalendarClock className="w-4 h-4 text-[#0284C7]" />
                <h3 className="text-sm font-bold text-slate-900 tracking-wide">TIMELINE</h3>
              </div>
              <div className="p-5">
                <ol className="space-y-4">
                  {detail.milestones.map((m, i) => (
                    <li key={m.label} className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        {m.status === "done" ? (
                          <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />
                        ) : m.status === "active" ? (
                          <div className="w-5 h-5 rounded-full border-2 border-[#0284C7] flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-[#0284C7]" />
                          </div>
                        ) : (
                          <Circle className="w-5 h-5 text-slate-300" />
                        )}
                        {i < detail.milestones.length - 1 && (
                          <div className="w-px h-6 bg-[#E2E8F0] mt-1" />
                        )}
                      </div>
                      <div className="pt-0.5">
                        <div
                          className={`text-sm font-medium ${
                            m.status === "upcoming" ? "text-slate-500" : "text-slate-900"
                          }`}
                        >
                          {m.label}
                        </div>
                        <div className="text-[11px] text-slate-400">{m.date}</div>
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
            <div className="rounded-xl border border-[#E2E8F0] bg-white p-5">
              <h3 className="text-sm font-bold text-slate-900 tracking-wide mb-3">OWNER CONTACT</h3>
              <div className="text-sm font-semibold text-slate-900">{detail.contact.name}</div>
              <div className="text-xs text-slate-500 mt-0.5">{detail.contact.role}</div>
              <div className="text-xs text-slate-500">{detail.contact.org}</div>
              {bid.nextAction && (
                <div className="mt-4 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                  <div className="text-[10px] uppercase tracking-widest text-slate-400">Next Action</div>
                  <div className="text-sm text-slate-900 mt-1">{bid.nextAction}</div>
                  <div className="text-[11px] text-slate-500">by {bid.nextActionDate}</div>
                </div>
              )}
            </div>

            {/* Risks */}
            <div className="rounded-xl border border-[#E2E8F0] bg-white overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3.5 border-b border-[#E2E8F0]">
                <ShieldAlert className="w-4 h-4 text-[#F59E0B]" />
                <h3 className="text-sm font-bold text-slate-900 tracking-wide">RISK FLAGS</h3>
              </div>
              <div className="p-3">
                {detail.risks.map((r) => {
                  const c = levelColor(r.level);
                  return (
                    <div
                      key={r.label}
                      className="flex items-center justify-between px-2 py-2.5 border-b border-[#E2E8F0] last:border-0"
                    >
                      <span className="text-sm text-slate-700 pr-2">{r.label}</span>
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
            <div className="rounded-xl border border-[#E2E8F0] bg-white overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E2E8F0]">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#0284C7]" />
                  <h3 className="text-sm font-bold text-slate-900 tracking-wide">DOCUMENTS</h3>
                </div>
                <Link href="/documents" className="text-xs text-[#0284C7] hover:text-slate-900 transition-colors font-medium">
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
                    <span className={`text-sm ${doc.status === "complete" ? "text-slate-500" : "text-slate-900"}`}>
                      {doc.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Competitor context */}
            <div className="rounded-xl border border-[#E2E8F0] bg-white overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E2E8F0]">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#0284C7]" />
                  <h3 className="text-sm font-bold text-slate-900 tracking-wide">COMPETITOR CONTEXT</h3>
                </div>
                <Link href="/competitors" className="text-xs text-[#0284C7] hover:text-slate-900 transition-colors font-medium">
                  View all
                </Link>
              </div>
              <div className="p-3">
                {competitorSignals.slice(0, 3).map((s) => (
                  <div key={s.id} className="flex items-center justify-between px-2 py-2">
                    <span className="text-sm text-slate-700">{s.name}</span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                        s.threat === "High"
                          ? "text-red-700 bg-red-50 border border-red-200"
                          : s.threat === "Medium"
                          ? "text-amber-700 bg-amber-50 border border-amber-200"
                          : "text-slate-600 bg-slate-100 border border-[#E2E8F0]"
                      }`}
                    >
                      {s.threat}
                    </span>
                  </div>
                ))}
                <p className="px-2 pt-2 text-[10px] text-slate-400 leading-relaxed">
                  Based on lawful, publicly available signals only.
                </p>
              </div>
            </div>

            {/* Next steps actions */}
            <div className="rounded-xl border border-sky-200 bg-white p-5 space-y-2.5">
              <h3 className="text-sm font-bold text-slate-900 tracking-wide mb-1">NEXT STEPS</h3>
              <button
                onClick={() => navigate("/bid-fit")}
                className="w-full inline-flex items-center justify-between rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-[#F1F5F9] transition-colors"
              >
                Evaluate bid-fit score <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate("/strategy-memo")}
                className="w-full inline-flex items-center justify-between rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-[#F1F5F9] transition-colors"
              >
                <span className="inline-flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-slate-500" /> Internal strategy memo
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate("/package-builder")}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1d4ed8] transition-colors"
              >
                Build vendor bid package <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[10px] text-slate-400 text-center pt-1">
                Internal strategy stays separate from the vendor-facing package. Review required before export.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
