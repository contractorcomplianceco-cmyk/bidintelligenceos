import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { Layout } from "@/components/layout";
import { DemoDataBadge } from "@/components/demo-data-badge";
import { OpsModuleEmpty } from "@/components/ops-module-empty";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  REGISTRATION_ITEMS,
  GOV_OPPORTUNITIES,
  SET_ASIDE_CERTIFICATIONS,
  GOV_READINESS,
  GOV_READINESS_COMPONENTS,
  GOV_ALERTS,
  type CredentialStatus,
  type Eligibility,
  type SolicitationType,
  type SetAside,
  type CertStatus,
  type GovAlertSeverity,
} from "@core/government";
import { useAuth } from "@/lib/auth-context";
import { useLiveData } from "@/lib/data-mode";
import { useBids, type ComplianceEligibility } from "@/hooks/use-bids";
import { apiFetch } from "@/lib/api-client";
import {
  buildLiveGovernmentView,
  isGovernmentBid,
  parseStateFromLocation,
  readinessLabel,
  GOV_GUARDRAIL,
} from "@/lib/live-government";
import {
  Landmark,
  Sparkles,
  ShieldCheck,
  BadgeCheck,
  FileText,
  Award,
  Bell,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";

const GOV_ACCENT = "#2563EB";

function credChip(status: CredentialStatus) {
  switch (status) {
    case "active":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "expiring":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "action-needed":
      return "bg-red-50 text-red-700 border-red-200";
  }
}

function credLabel(status: CredentialStatus) {
  switch (status) {
    case "active":
      return "Active";
    case "expiring":
      return "Expiring";
    case "action-needed":
      return "Action needed";
  }
}

function eligChip(e: Eligibility) {
  switch (e) {
    case "eligible":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "review-needed":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "ineligible":
      return "bg-red-50 text-red-700 border-red-200";
  }
}

function eligLabel(e: Eligibility) {
  switch (e) {
    case "eligible":
      return "Eligible";
    case "review-needed":
      return "Review needed";
    case "ineligible":
      return "Ineligible";
  }
}

function typeChip(t: SolicitationType) {
  switch (t) {
    case "RFP":
      return "bg-sky-50 text-sky-700 border-sky-200";
    case "RFQ":
      return "bg-indigo-50 text-indigo-700 border-indigo-200";
    case "IFB":
      return "bg-violet-50 text-violet-700 border-violet-200";
  }
}

function setAsideChip(s: SetAside) {
  if (s === "None") return "bg-slate-100 text-slate-600 border-slate-200";
  return "bg-sky-50 text-sky-700 border-sky-200";
}

function certMeta(status: CertStatus): {
  chip: string;
  label: string;
  icon: typeof CheckCircle2;
} {
  switch (status) {
    case "certified":
      return { chip: "bg-emerald-50 text-emerald-700 border-emerald-200", label: "Certified", icon: CheckCircle2 };
    case "expiring":
      return { chip: "bg-amber-50 text-amber-700 border-amber-200", label: "Expiring", icon: Clock };
    case "in-progress":
      return { chip: "bg-sky-50 text-sky-700 border-sky-200", label: "In progress", icon: Clock };
    case "not-pursued":
      return { chip: "bg-slate-100 text-slate-600 border-slate-200", label: "Not pursued", icon: XCircle };
  }
}

function alertSeverity(sev: GovAlertSeverity) {
  switch (sev) {
    case "high":
      return { chip: "bg-red-50 text-red-700 border-red-200", dot: "#DC2626" };
    case "medium":
      return { chip: "bg-amber-50 text-amber-700 border-amber-200", dot: "#D97706" };
    case "low":
      return { chip: "bg-sky-50 text-sky-700 border-sky-200", dot: "#0284C7" };
  }
}

function scoreColor(score: number) {
  if (score >= 85) return "#059669";
  if (score >= 70) return "#D97706";
  return "#DC2626";
}

function daysChip(days: number) {
  if (days <= 14) return "bg-red-50 text-red-700 border-red-200";
  if (days <= 30) return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-slate-100 text-slate-600 border-slate-200";
}

export default function Government() {
  const { isAuthenticated } = useAuth();
  const live = useLiveData(isAuthenticated);
  const { data: allBids = [], isLoading: bidsLoading } = useBids();

  const govBids = useMemo(
    () => (live ? allBids.filter(isGovernmentBid) : []),
    [live, allBids],
  );

  const states = useMemo(() => {
    const set = new Set<string>();
    for (const bid of govBids) {
      const st = parseStateFromLocation(bid.location);
      if (st) set.add(st);
    }
    return [...set].slice(0, 8);
  }, [govBids]);

  const complianceQueries = useQueries({
    queries: states.map((state) => ({
      queryKey: ["compliance-eligibility", state],
      queryFn: async () => {
        const data = await apiFetch<{ eligibility: ComplianceEligibility }>(
          `/api/v1/research/compliance-eligibility?state=${encodeURIComponent(state)}`,
        );
        return data.eligibility;
      },
      staleTime: 60_000,
      enabled: live,
    })),
  });

  const complianceLoading = live && complianceQueries.some((q) => q.isLoading);

  const complianceByState = useMemo(() => {
    const map = new Map<string, ComplianceEligibility>();
    for (let i = 0; i < states.length; i++) {
      const entry = complianceQueries[i]?.data;
      if (entry) map.set(states[i], entry);
    }
    return map;
  }, [states, complianceQueries]);

  const liveView = useMemo(
    () => (live ? buildLiveGovernmentView(govBids, complianceByState) : null),
    [live, govBids, complianceByState],
  );

  const registrationItems = live && liveView ? liveView.registrationItems : REGISTRATION_ITEMS;
  const opportunities = live && liveView ? liveView.opportunities : GOV_OPPORTUNITIES;
  const certifications = live && liveView ? liveView.certifications : SET_ASIDE_CERTIFICATIONS;
  const alerts = live && liveView ? liveView.alerts : GOV_ALERTS;
  const readiness = live && liveView ? liveView.readiness : GOV_READINESS;
  const readinessComponents =
    live && liveView ? liveView.readinessComponents : GOV_READINESS_COMPONENTS;

  const ringDeg = (readiness / 100) * 360;
  const readinessStatus = readinessLabel(readiness);

  if (live && (bidsLoading || complianceLoading)) {
    return (
      <Layout>
        <div className="space-y-6 max-w-[1600px] mx-auto">
          <p className="text-sm text-slate-500">Loading government pipeline from bids and jurisdiction compliance…</p>
        </div>
      </Layout>
    );
  }

  if (live && liveView && !liveView.hasData) {
    return (
      <Layout>
        <div className="space-y-6 max-w-[1600px] mx-auto">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <Landmark className="h-7 w-7" style={{ color: GOV_ACCENT }} />
              Government Contracting
            </h1>
            <p className="text-slate-500 mt-1">
              SAM registration, set-aside certifications, and federal/state opportunity tracking.
            </p>
          </div>
          <OpsModuleEmpty
            module="Government contracting pipeline"
            description={
              allBids.length > 0
                ? `You have ${allBids.length} bid${allBids.length === 1 ? "" : "s"} on file, but none qualify as Public/GC government work with a state location. Tag bids as Public or GC and include a state in the location field, or connect jurisdiction compliance research.`
                : "Record Public or GC bids with state locations in Bid Intelligence, or connect jurisdiction compliance research, to populate this module."
            }
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 max-w-[1600px] mx-auto">
        {!live && <DemoDataBadge />}
        {/* Header */}
        <Card className="bg-white shadow-sm border-[#E2E8F0] overflow-hidden relative rounded-xl">
          <div className="absolute top-0 right-0 p-6 opacity-[0.06] pointer-events-none">
            <Landmark className="w-48 h-48" style={{ color: GOV_ACCENT }} />
          </div>
          <CardContent className="p-6 lg:p-8 relative z-10">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                <Landmark className="w-3 h-3" />
                Core module · GOV
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                <ShieldCheck className="w-3 h-3" />
                {live ? "Live bids + jurisdiction" : "Public data · decision support"}
              </span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 tracking-tight">
              <Landmark className="h-8 w-8" style={{ color: GOV_ACCENT }} />
              Government Contracting Readiness
            </h2>
            <p className="font-medium mt-2" style={{ color: "#0284C7" }}>
              {live
                ? "Pipeline derived from your Public/GC bids and jurisdiction compliance — no seed contracts."
                : "Registration, certifications, and solicitation pursuit — kept bid-ready."}
            </p>
            <p className="text-slate-500 mt-3 max-w-3xl leading-relaxed">
              {live
                ? "Opportunities map from active public-sector bids; registration and readiness scores reflect Research Hub jurisdiction rules and audit gates for each bid state."
                : "Track your SAM.gov registration and credentials, monitor set-aside certifications, and prioritize public federal, state, and municipal solicitations from one readiness view."}
            </p>
          </CardContent>
        </Card>

        {/* Readiness hero */}
        <Card className="bg-white shadow-sm border-[#E2E8F0] rounded-xl">
          <CardHeader className="p-4 border-b border-[#E2E8F0]">
            <CardTitle className="text-sm font-bold text-slate-900 tracking-wide flex items-center gap-2">
              <Sparkles className="w-4 h-4" style={{ color: "#0284C7" }} />
              CONTRACTING READINESS
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8 items-center">
              <div className="flex flex-col items-center">
                <div
                  className="relative w-40 h-40 rounded-full flex items-center justify-center"
                  style={{
                    background: `conic-gradient(${GOV_ACCENT} ${ringDeg}deg, #E2E8F0 ${ringDeg}deg)`,
                  }}
                >
                  <div className="absolute inset-3 rounded-full bg-white flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-slate-900">
                      {readiness}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      Overall
                    </span>
                  </div>
                </div>
                <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 text-[11px] font-semibold">
                  <Clock className="w-3.5 h-3.5" />
                  {readinessStatus}
                </span>
              </div>

              <div className="space-y-4">
                {readinessComponents.map((c) => (
                  <div key={c.key}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[12px] font-semibold text-slate-700">
                        {c.label}
                      </span>
                      <span
                        className="text-[12px] font-bold"
                        style={{ color: scoreColor(c.score) }}
                      >
                        {c.score}
                      </span>
                    </div>
                    <div className="h-2.5 rounded-full bg-[#F1F5F9] overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${c.score}%`,
                          backgroundColor: scoreColor(c.score),
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Registration & credentials */}
        {registrationItems.length > 0 && (
          <Card className="bg-white shadow-sm border-[#E2E8F0] rounded-xl">
            <CardHeader className="p-4 border-b border-[#E2E8F0]">
              <CardTitle className="text-sm font-bold text-slate-900 tracking-wide flex items-center gap-2">
                <BadgeCheck className="w-4 h-4" style={{ color: GOV_ACCENT }} />
                {live ? "JURISDICTION & COMPLIANCE" : "REGISTRATION & CREDENTIALS"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {registrationItems.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg border border-[#E2E8F0] bg-[#F1F5F9] p-3.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        {item.label}
                      </span>
                      <span
                        className={`shrink-0 inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${credChip(item.status)}`}
                      >
                        {credLabel(item.status)}
                      </span>
                    </div>
                    <div className="text-[15px] font-bold text-slate-900 mt-1.5 font-mono">
                      {item.value}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Opportunity pipeline */}
        {opportunities.length > 0 && (
          <Card className="bg-white shadow-sm border-[#E2E8F0] rounded-xl">
            <CardHeader className="p-4 border-b border-[#E2E8F0] flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold text-slate-900 tracking-wide flex items-center gap-2">
                <FileText className="w-4 h-4" style={{ color: GOV_ACCENT }} />
                OPPORTUNITY PIPELINE
              </CardTitle>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                {opportunities.length} {live ? "public-sector bids" : "public solicitations"}
              </span>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[#E2E8F0] bg-[#F1F5F9]">
                      <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        Solicitation
                      </th>
                      <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        Type
                      </th>
                      <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        Set-aside
                      </th>
                      <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        NAICS
                      </th>
                      <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        Deadline
                      </th>
                      <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        Documents
                      </th>
                      <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        Eligibility
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {opportunities.map((opp) => {
                      const pct = Math.round(
                        (opp.checklistDone / opp.checklistTotal) * 100,
                      );
                      return (
                        <tr
                          key={opp.id}
                          className="border-b border-[#E2E8F0] last:border-0 hover:bg-[#F8FAFC] transition-colors"
                        >
                          <td className="px-4 py-3 align-top">
                            <div className="text-[13px] font-semibold text-slate-900">
                              {opp.title}
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              {opp.agency}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                              {opp.solicitation}
                            </div>
                          </td>
                          <td className="px-4 py-3 align-top">
                            <span
                              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${typeChip(opp.type)}`}
                            >
                              {opp.type}
                            </span>
                          </td>
                          <td className="px-4 py-3 align-top">
                            <span
                              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${setAsideChip(opp.setAside)}`}
                            >
                              {opp.setAside}
                            </span>
                          </td>
                          <td className="px-4 py-3 align-top text-[12px] text-slate-700 font-mono">
                            {opp.naics}
                          </td>
                          <td className="px-4 py-3 align-top">
                            <div className="text-[12px] text-slate-700">
                              {opp.deadline}
                            </div>
                            <span
                              className={`mt-1 inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${daysChip(opp.daysLeft)}`}
                            >
                              {opp.daysLeft} days left
                            </span>
                          </td>
                          <td className="px-4 py-3 align-top min-w-[140px]">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[11px] text-slate-500">
                                {opp.checklistDone}/{opp.checklistTotal}
                              </span>
                              <span className="text-[11px] font-bold text-slate-700">
                                {pct}%
                              </span>
                            </div>
                            <div className="h-2 rounded-full bg-[#F1F5F9] overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${pct}%`,
                                  backgroundColor: scoreColor(pct),
                                }}
                              />
                            </div>
                          </td>
                          <td className="px-4 py-3 align-top">
                            <span
                              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${eligChip(opp.eligibility)}`}
                            >
                              {eligLabel(opp.eligibility)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Set-aside certifications + Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {certifications.length > 0 && (
            <Card className="bg-white shadow-sm border-[#E2E8F0] rounded-xl">
              <CardHeader className="p-4 border-b border-[#E2E8F0]">
                <CardTitle className="text-sm font-bold text-slate-900 tracking-wide flex items-center gap-2">
                  <Award className="w-4 h-4" style={{ color: GOV_ACCENT }} />
                  SET-ASIDE CERTIFICATIONS
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-2.5">
                {certifications.map((cert) => {
                  const meta = certMeta(cert.status);
                  const Icon = meta.icon;
                  return (
                    <div
                      key={cert.id}
                      className="flex items-start justify-between gap-3 rounded-lg border border-[#E2E8F0] bg-[#F1F5F9] p-3"
                    >
                      <div>
                        <div className="text-[13px] font-semibold text-slate-900">
                          {cert.cert}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {cert.authority}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1 leading-relaxed max-w-sm">
                          {cert.detail}
                        </div>
                      </div>
                      <span
                        className={`shrink-0 inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${meta.chip}`}
                      >
                        <Icon className="w-3 h-3" />
                        {meta.label}
                      </span>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}

          {alerts.length > 0 && (
            <Card className="bg-white shadow-sm border-[#E2E8F0] rounded-xl">
              <CardHeader className="p-4 border-b border-[#E2E8F0] flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-bold text-slate-900 tracking-wide flex items-center gap-2">
                  <Bell className="w-4 h-4" style={{ color: GOV_ACCENT }} />
                  READINESS ALERTS
                </CardTitle>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  {alerts.length} active
                </span>
              </CardHeader>
              <CardContent className="p-4 space-y-2.5">
                {alerts.map((alert) => {
                  const sev = alertSeverity(alert.severity);
                  return (
                    <div
                      key={alert.id}
                      className="flex items-start gap-3 rounded-lg border border-[#E2E8F0] bg-[#F1F5F9] p-3"
                    >
                      <span
                        className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                        style={{ backgroundColor: sev.dot }}
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="text-[13px] font-semibold text-slate-900">
                            {alert.title}
                          </div>
                          <span
                            className={`shrink-0 inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${sev.chip}`}
                          >
                            {alert.severity}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                          {alert.detail}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Guardrail footer */}
        <Card className="bg-white rounded-xl border-sky-200">
          <CardContent className="p-4 flex items-start gap-3">
            <div className="shrink-0 rounded-lg bg-sky-50 border border-sky-200 p-2.5">
              <AlertTriangle className="w-5 h-5 text-sky-700" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 tracking-wide mb-1">
                Readiness tracking is decision support — not a guarantee
              </h4>
              <p className="text-[12px] text-slate-500 leading-relaxed max-w-4xl">
                {GOV_GUARDRAIL}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
