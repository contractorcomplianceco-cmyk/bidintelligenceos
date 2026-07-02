import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  COMPLIANCE_ITEMS,
  OVERALL_READINESS,
  READINESS_SCORES,
  AUDIT_CHECKLIST,
  PERMIT_READINESS,
  INTEGRATION_FLOWS,
  COMPLIANCE_GUARDRAIL,
  itemsByCategory,
  type ComplianceItem,
  type ComplianceStatus,
} from "@core/compliance";
import {
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Circle,
  FileCheck2,
  ScrollText,
  Wallet,
  Stamp,
  Workflow,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

const EMERALD = "#059669";

const CATEGORY_META: Record<
  ComplianceItem["category"],
  { label: string; icon: typeof ScrollText }
> = {
  licensing: { label: "Licenses", icon: ScrollText },
  insurance: { label: "Insurance", icon: ShieldCheck },
  bonding: { label: "Bonds", icon: Wallet },
};

function statusChip(status: ComplianceStatus) {
  switch (status) {
    case "active":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "expiring":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "action-needed":
      return "bg-red-50 text-red-700 border-red-200";
  }
}

function statusLabel(status: ComplianceStatus) {
  switch (status) {
    case "active":
      return "Active";
    case "expiring":
      return "Expiring";
    case "action-needed":
      return "Action needed";
  }
}

function scoreColor(score: number) {
  if (score >= 85) return EMERALD;
  if (score >= 70) return "#D97706";
  return "#DC2626";
}

export default function ComplianceConnect() {
  const doneCount = AUDIT_CHECKLIST.filter((i) => i.done).length;
  const ringDeg = (OVERALL_READINESS / 100) * 360;

  return (
    <Layout>
      <div className="space-y-6 max-w-[1600px] mx-auto">
        {/* Header */}
        <Card className="bg-white shadow-sm border-[#E2E8F0] overflow-hidden relative rounded-xl">
          <div className="absolute top-0 right-0 p-6 opacity-[0.06] pointer-events-none">
            <ShieldCheck className="w-48 h-48" style={{ color: EMERALD }} />
          </div>
          <CardContent className="p-6 lg:p-8 relative z-10">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest border"
                style={{
                  backgroundColor: "rgba(5,150,105,0.12)",
                  color: EMERALD,
                  borderColor: "rgba(5,150,105,0.3)",
                }}
              >
                <Sparkles className="w-3 h-3" />
                Connected add-on
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                <ShieldCheck className="w-3 h-3" />
                Decision support only
              </span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 tracking-tight">
              <ShieldCheck className="h-8 w-8" style={{ color: EMERALD }} />
              ComplianceConnect
            </h2>
            <p className="font-medium mt-2" style={{ color: "#0284C7" }}>
              Stay bid-ready. Stay audit-ready.
            </p>
            <p className="text-slate-500 mt-3 max-w-3xl leading-relaxed">
              Licensing, insurance, and bond tracking that keeps your compliance
              posture bid-ready. Readiness scoring flags gaps before they block a
              bid, a permit, or an audit.
            </p>
          </CardContent>
        </Card>

        {/* Readiness hero */}
        <Card className="bg-white shadow-sm border-[#E2E8F0] rounded-xl">
          <CardHeader className="p-4 border-b border-[#E2E8F0]">
            <CardTitle className="text-sm font-bold text-slate-900 tracking-wide flex items-center gap-2">
              <Sparkles className="w-4 h-4" style={{ color: "#0284C7" }} />
              COMPLIANCE READINESS
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8 items-center">
              {/* Ring */}
              <div className="flex flex-col items-center">
                <div
                  className="relative w-40 h-40 rounded-full flex items-center justify-center"
                  style={{
                    background: `conic-gradient(${EMERALD} ${ringDeg}deg, #E2E8F0 ${ringDeg}deg)`,
                  }}
                >
                  <div className="absolute inset-3 rounded-full bg-white flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-slate-900">
                      {OVERALL_READINESS}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      Overall
                    </span>
                  </div>
                </div>
                <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 text-[11px] font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Bid-ready posture
                </span>
              </div>

              {/* Category bars */}
              <div className="space-y-4">
                {READINESS_SCORES.map((s) => (
                  <div key={s.key}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[12px] font-semibold text-slate-700">
                        {s.label}
                      </span>
                      <span
                        className="text-[12px] font-bold"
                        style={{ color: scoreColor(s.score) }}
                      >
                        {s.score}
                      </span>
                    </div>
                    <div className="h-2.5 rounded-full bg-[#F1F5F9] overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${s.score}%`,
                          backgroundColor: scoreColor(s.score),
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tracked items grouped by category */}
        {(Object.keys(CATEGORY_META) as ComplianceItem["category"][]).map(
          (cat) => {
            const meta = CATEGORY_META[cat];
            const Icon = meta.icon;
            const items = itemsByCategory(cat);
            return (
              <Card key={cat} className="bg-white shadow-sm border-[#E2E8F0] rounded-xl">
                <CardHeader className="p-4 border-b border-[#E2E8F0] flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold text-slate-900 tracking-wide flex items-center gap-2">
                    <Icon className="w-4 h-4" style={{ color: EMERALD }} />
                    {meta.label.toUpperCase()}
                  </CardTitle>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    {items.length} tracked
                  </span>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-[#E2E8F0] bg-[#F1F5F9]">
                          <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                            Item
                          </th>
                          <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                            Authority
                          </th>
                          <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                            Coverage / Limit
                          </th>
                          <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                            Expiry
                          </th>
                          <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item) => (
                          <tr
                            key={item.id}
                            className="border-b border-[#E2E8F0] last:border-0 hover:bg-[#F8FAFC] transition-colors"
                          >
                            <td className="px-4 py-3 align-top">
                              <div className="text-[13px] font-semibold text-slate-900">
                                {item.name}
                              </div>
                              <div className="text-[11px] text-slate-500 mt-0.5 max-w-md leading-relaxed">
                                {item.note}
                              </div>
                            </td>
                            <td className="px-4 py-3 align-top">
                              <div className="text-[12px] text-slate-700">
                                {item.authority}
                              </div>
                              <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                                {item.reference}
                              </div>
                            </td>
                            <td className="px-4 py-3 align-top text-[12px] text-slate-700">
                              {item.coverage}
                            </td>
                            <td className="px-4 py-3 align-top">
                              <div className="text-[12px] text-slate-700">
                                {item.expiry}
                              </div>
                              <div className="text-[11px] text-slate-400 mt-0.5">
                                {item.daysToExpiry} days
                              </div>
                            </td>
                            <td className="px-4 py-3 align-top">
                              <span
                                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${statusChip(item.status)}`}
                              >
                                {statusLabel(item.status)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            );
          },
        )}

        {/* Audit readiness + Permit readiness */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white shadow-sm border-[#E2E8F0] rounded-xl">
            <CardHeader className="p-4 border-b border-[#E2E8F0] flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold text-slate-900 tracking-wide flex items-center gap-2">
                <FileCheck2 className="w-4 h-4" style={{ color: EMERALD }} />
                AUDIT READINESS
              </CardTitle>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                {doneCount}/{AUDIT_CHECKLIST.length} complete
              </span>
            </CardHeader>
            <CardContent className="p-4 space-y-2.5">
              {AUDIT_CHECKLIST.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 rounded-lg border border-[#E2E8F0] bg-[#F1F5F9] p-3"
                >
                  {item.done ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                  ) : (
                    <Circle className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
                  )}
                  <div>
                    <div className="text-[13px] font-semibold text-slate-900">
                      {item.label}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      {item.detail}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-[#E2E8F0] rounded-xl">
            <CardHeader className="p-4 border-b border-[#E2E8F0]">
              <CardTitle className="text-sm font-bold text-slate-900 tracking-wide flex items-center gap-2">
                <Stamp className="w-4 h-4" style={{ color: EMERALD }} />
                PERMIT READINESS
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2.5">
              {PERMIT_READINESS.map((row) => (
                <div
                  key={row.id}
                  className="flex items-start justify-between gap-3 rounded-lg border border-[#E2E8F0] bg-[#F1F5F9] p-3"
                >
                  <div>
                    <div className="text-[13px] font-semibold text-slate-900">
                      {row.permit}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {row.jurisdiction}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 leading-relaxed max-w-sm">
                      {row.note}
                    </div>
                  </div>
                  <span
                    className={`shrink-0 inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${statusChip(row.status)}`}
                  >
                    {statusLabel(row.status)}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Integration strip */}
        <Card className="bg-white shadow-sm border-[#E2E8F0] rounded-xl">
          <CardHeader className="p-4 border-b border-[#E2E8F0]">
            <CardTitle className="text-sm font-bold text-slate-900 tracking-wide flex items-center gap-2">
              <Workflow className="w-4 h-4" style={{ color: "#0284C7" }} />
              FEEDS READINESS FLAGS INTO THE OS
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {INTEGRATION_FLOWS.map((flow) => (
                <div
                  key={flow.target}
                  className="rounded-lg border border-[#E2E8F0] bg-[#F1F5F9] p-4"
                >
                  <div className="flex items-center gap-2 text-[13px] font-bold text-slate-900">
                    <ArrowRight className="w-4 h-4" style={{ color: EMERALD }} />
                    {flow.target}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                    {flow.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Guardrail footer */}
        <Card className="bg-white rounded-xl" style={{ borderColor: "rgba(5,150,105,0.3)" }}>
          <CardContent className="p-4 flex items-start gap-3">
            <div
              className="shrink-0 rounded-lg p-2.5 border"
              style={{
                backgroundColor: "rgba(5,150,105,0.1)",
                borderColor: "rgba(5,150,105,0.3)",
              }}
            >
              <AlertTriangle className="w-5 h-5" style={{ color: EMERALD }} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 tracking-wide mb-1">
                Tracking & decision support — not a guarantee
              </h4>
              <p className="text-[12px] text-slate-500 leading-relaxed max-w-4xl">
                {COMPLIANCE_GUARDRAIL}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
