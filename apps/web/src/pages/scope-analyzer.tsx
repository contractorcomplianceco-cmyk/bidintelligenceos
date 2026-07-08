import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  Info,
  ArrowRight,
  Search,
  FileText,
  CheckSquare,
  Loader2,
  ShieldCheck,
  Lock,
  Sparkles,
} from "lucide-react";
import { Link, useSearch } from "wouter";
import { useScopeAnalysis, useApproveScopeAnalysis } from "@/hooks/use-bids";
import { useAuth } from "@/lib/auth-context";
import { useLiveData } from "@/lib/data-mode";
import { VerdictBadge } from "@/components/roseos/brand";
import type { Verdict } from "@core/roseos";
import { useToast } from "@/hooks/use-toast";

const DEMO_PAYLOAD = {
  projectName: "Terminal B HVAC Retrofit & Piping Upgrade",
  deliverables:
    "Replacement of 3 rooftop RTUs, modification of existing ductwork, BMS integration, and chilled water piping replacement.",
  timeline: "Phased delivery over 8 weeks — night shifts (10 PM–5 AM) due to airport operations.",
  complexityIndicator: {
    title: "Key complexity drivers",
    detail: "Specialized rigging for rooftop units and TSA security protocols for site personnel.",
  },
  rfis: [
    { title: "BMS Integration Specs", detail: "Confirm BACnet compatibility or gateway requirements.", severity: "high" },
    { title: "Staging Area Logistics", detail: "No defined staging area for crane rigging in logistics plan.", severity: "medium" },
  ],
  risks: [
    { label: "Deadline Risk", level: "High", score: 85, detail: "Tight submission window." },
    { label: "Schedule Risk", level: "Medium", score: 55, detail: "Night shift only operations." },
  ],
  scopeItems: ["RTU replacement", "Duct modifications", "BMS integration", "Chilled water piping"],
  roseVerdict: "yellow" as const,
  roseNarrative: "Demo scope brief — sign in and run analysis on a saved bid for live ROSEOS output.",
  recommendedActions: ["Sign in to run live scope analysis", "Human reviewer approval required"],
  requiredForms: ["Bid Form", "Bid Bond (5%)", "Non-Collusion Affidavit", "Safety Record / EMR"],
  engine: "demo",
  disclaimer: "Powered by AI. Reviewed by humans required before client-facing use.",
  humanReviewed: false,
};

function riskColor(level: string) {
  if (level === "High") return "text-red-700 bg-red-50 border-red-200";
  if (level === "Medium") return "text-amber-700 bg-amber-50 border-amber-200";
  return "text-emerald-700 bg-emerald-50 border-emerald-200";
}

export default function ScopeAnalyzer() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const bidId = params.get("bidId") ?? undefined;
  const { isAuthenticated } = useAuth();
  const live = useLiveData(isAuthenticated);
  const { data: analysisData, isLoading } = useScopeAnalysis(bidId, live);
  const approve = useApproveScopeAnalysis();
  const { toast } = useToast();

  const analysis = live ? analysisData?.analysis : null;
  const payload = analysis?.payload ?? (live ? null : DEMO_PAYLOAD);
  const complete = Boolean(payload);
  const humanReviewed = analysis?.humanReviewed ?? false;

  const handleApprove = async () => {
    if (!bidId) return;
    try {
      await approve.mutateAsync(bidId);
      toast({ title: "Scope brief approved", description: "Marked human-reviewed for estimator use." });
    } catch (e) {
      toast({
        title: "Approval failed",
        description: e instanceof Error ? e.message : "Could not approve",
        variant: "destructive",
      });
    }
  };

  if (live && bidId && isLoading) {
    return (
      <Layout>
        <div className="max-w-xl mx-auto text-center py-24 text-slate-500 flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading scope analysis…
        </div>
      </Layout>
    );
  }

  if (live && bidId && !payload) {
    return (
      <Layout>
        <div className="max-w-xl mx-auto text-center py-24 space-y-4">
          <h2 className="text-xl font-bold text-slate-900">No analysis yet</h2>
          <p className="text-slate-500">Queue scope analysis from New Bid or the bid record first.</p>
          <Link href={`/bids/${bidId}`} className="text-[#0284C7] font-semibold inline-flex items-center gap-1">
            Back to bid <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </Layout>
    );
  }

  if (!payload) return null;

  const topRisk = [...payload.risks].sort((a, b) => b.score - a.score)[0];
  const roseVerdict = payload.roseVerdict as Verdict;

  return (
    <Layout>
      <div className="space-y-8 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
              <Search className="h-8 w-8 text-teal-600" />
              Scope Analyzer
            </h2>
            <p className="text-slate-500 mt-2 text-lg">
              {live ? "Live ROSEOS scope brief" : "Demo scope brief"} — {payload.disclaimer}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {complete && (
              <Badge className="bg-teal-50 text-teal-800 border border-teal-200 gap-1">
                <Sparkles className="w-3 h-3" />
                {payload.engine === "openai" ? "AI-enhanced" : payload.engine === "demo" ? "Demo" : "ROSEOS rules"}
              </Badge>
            )}
            {humanReviewed ? (
              <Badge className="bg-emerald-50 text-emerald-800 border border-emerald-200 gap-1">
                <ShieldCheck className="w-3 h-3" /> Human approved
              </Badge>
            ) : (
              <Badge variant="outline" className="gap-1 text-amber-800 border-amber-300">
                <Lock className="w-3 h-3" /> Pending review
              </Badge>
            )}
            <VerdictBadge verdict={roseVerdict} />
          </div>
        </div>

        {analysis?.summary && (
          <Card className="border-[#0BA3A8]/30 bg-gradient-to-r from-teal-50/80 to-white">
            <CardContent className="pt-5 text-sm text-slate-800 leading-relaxed">{analysis.summary}</CardContent>
          </Card>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white border-[#E2E8F0] shadow-sm overflow-hidden">
              <div className="h-1 w-full bg-teal-500" />
              <CardHeader className="border-b border-[#E2E8F0] pb-4 bg-[#F8FAFC]">
                <CardTitle className="text-lg text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-slate-500" />
                  Extracted Scope Summary
                </CardTitle>
                <CardDescription className="text-slate-500">{payload.projectName}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 pt-6 text-sm">
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Core Deliverables</span>
                  <p className="text-slate-700 leading-relaxed mt-1">{payload.deliverables}</p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Timeline / Phasing</span>
                  <p className="text-slate-700 leading-relaxed mt-1">{payload.timeline}</p>
                </div>
                <ul className="space-y-2">
                  {payload.scopeItems.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-slate-700">
                      <CheckSquare className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex gap-3 items-start">
                    <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-blue-700">{payload.complexityIndicator.title}</span>
                      <p className="text-slate-700 mt-1 leading-relaxed">{payload.complexityIndicator.detail}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-[#E2E8F0] shadow-sm">
              <CardHeader className="border-b border-[#E2E8F0] pb-4">
                <CardTitle className="text-lg text-slate-900">Required Clarifications (RFIs)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                {payload.rfis.map((rfi) => (
                  <div key={rfi.title} className="flex gap-4 p-3 rounded-md border border-[#E2E8F0]">
                    <AlertTriangle
                      className={`h-5 w-5 shrink-0 mt-0.5 ${rfi.severity === "high" ? "text-red-600" : "text-amber-600"}`}
                    />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{rfi.title}</p>
                      <p className="text-sm text-slate-500 mt-1">{rfi.detail}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-white border-red-200 shadow-sm">
              <CardHeader className="bg-red-50 pb-4 border-b border-red-200">
                <CardTitle className="text-red-700 text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Risk Assessment
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {topRisk && (
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-xs font-semibold text-slate-500 uppercase">Overall</span>
                      <span className="text-xs text-red-700 font-bold uppercase">{topRisk.level}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-red-500" style={{ width: `${topRisk.score}%` }} />
                    </div>
                  </div>
                )}
                {payload.risks.map((r) => (
                  <div key={r.label} className="space-y-1">
                    <Badge variant="outline" className={`w-full justify-start font-semibold py-1 ${riskColor(r.level)}`}>
                      {r.label}: {r.level}
                    </Badge>
                    <p className="text-xs text-slate-500 pl-1">{r.detail}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-white border-[#E2E8F0] shadow-sm">
              <CardHeader className="pb-3 border-b border-[#E2E8F0]">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-slate-500">Required Forms</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                {payload.requiredForms.map((item, i) => (
                  <div key={item} className="flex items-center space-x-3">
                    <Checkbox id={`doc-${i}`} defaultChecked={i < 2} className="border-[#CBD5E1]" />
                    <label htmlFor={`doc-${i}`} className="text-sm font-medium text-slate-700">
                      {item}
                    </label>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="p-5 bg-white border border-[#E2E8F0] rounded-xl space-y-4 shadow-sm">
              <p className="text-xs text-slate-500 font-medium uppercase tracking-widest text-center">
                Powered by AI · Reviewed by humans
              </p>
              {live && bidId && !humanReviewed && (
                <Button
                  className="w-full bg-teal-700 hover:bg-teal-600"
                  onClick={handleApprove}
                  disabled={approve.isPending}
                >
                  {approve.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ShieldCheck className="w-4 h-4 mr-2" />}
                  Approve scope brief
                </Button>
              )}
              {bidId && (
                <Link href={`/bids/${bidId}`}>
                  <Button variant="outline" className="w-full">
                    View bid record <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
