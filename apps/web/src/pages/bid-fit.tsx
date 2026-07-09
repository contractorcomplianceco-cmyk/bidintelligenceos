import { useMemo } from "react";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, Target, ShieldCheck, Activity, Loader2 } from "lucide-react";
import { Link, useSearch } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { useLiveData } from "@/lib/data-mode";
import { useBid, useBidScore, useComplianceEligibility } from "@/hooks/use-bids";
import { DemoDataBadge } from "@/components/demo-data-badge";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

const DEMO_SCORES = {
  overall: 78,
  confidence: 65,
  risk: 42,
  marginPressure: 80,
  relationship: 90,
  scopeClarity: 60,
  capacityFit: 85,
  compliance: 100,
};

function verdictToFitLabel(verdict: string) {
  if (verdict === "Strong Go") return "Strong Fit";
  if (verdict === "Conditional Go") return "Conditional Fit";
  if (verdict === "Executive Review Required") return "Review Required";
  if (verdict === "No-Go") return "Poor Fit";
  return "Fit Pending";
}

function verdictToRecommendation(verdict: string) {
  if (verdict === "Strong Go") return "Proceed to Bid";
  if (verdict === "Conditional Go") return "Proceed with Mitigations";
  if (verdict === "Executive Review Required") return "Executive Review First";
  if (verdict === "No-Go") return "Do Not Bid";
  return "Compute Score First";
}

export default function BidFit() {
  const search = useSearch();
  const bidId = useMemo(() => new URLSearchParams(search).get("bidId") ?? undefined, [search]);
  const { isAuthenticated } = useAuth();
  const live = useLiveData(isAuthenticated);
  const { data: bid, isLoading: bidLoading } = useBid(bidId);
  const { data: scoreData, isLoading: scoreLoading } = useBidScore(bidId, live && !!bidId);
  const { data: complianceData } = useComplianceEligibility(bidId, live && !!bidId);

  const score = live && bidId ? scoreData?.score : null;
  const usingLive = live && !!bidId && !!score;

  const categoryMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const c of score?.categories ?? []) {
      map.set(c.key, Math.round((c.points / c.maxPoints) * 100));
    }
    return map;
  }, [score?.categories]);

  const scores = usingLive
    ? {
        overall: Math.round(score!.totalScore),
        confidence: categoryMap.get("win_probability") ?? categoryMap.get("confidence") ?? Math.round(score!.totalScore * 0.85),
        risk: categoryMap.get("risk") ?? (bid?.riskScore ?? 50),
        marginPressure: categoryMap.get("margin") ?? categoryMap.get("margin_pressure") ?? 50,
        relationship: categoryMap.get("relationship") ?? 70,
        scopeClarity: categoryMap.get("scope_clarity") ?? categoryMap.get("scope") ?? 60,
        capacityFit: categoryMap.get("capacity") ?? categoryMap.get("capacity_fit") ?? 75,
        compliance: complianceData?.eligibility
          ? Math.round((complianceData.eligibility.eligibilityPoints / complianceData.eligibility.maxPoints) * 100)
          : 80,
      }
    : DEMO_SCORES;

  const fitLabel = usingLive ? verdictToFitLabel(score!.verdict) : "Strong Fit";
  const recommendation = usingLive ? verdictToRecommendation(score!.verdict) : "Proceed to Bid";
  const compliancePct = scores.compliance;
  const loading = live && bidId && (bidLoading || scoreLoading);

  const getScoreColor = (scoreVal: number, invert = false) => {
    const isGood = invert ? scoreVal < 50 : scoreVal >= 70;
    const isWarning = invert ? scoreVal >= 50 && scoreVal < 75 : scoreVal >= 50 && scoreVal < 70;

    if (isGood) return "bg-teal-500";
    if (isWarning) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getScoreTextClass = (scoreVal: number, invert = false) => {
    const isGood = invert ? scoreVal < 50 : scoreVal >= 70;
    const isWarning = invert ? scoreVal >= 50 && scoreVal < 75 : scoreVal >= 50 && scoreVal < 70;

    if (isGood) return "text-[#0A8A8F]";
    if (isWarning) return "text-amber-600";
    return "text-red-600";
  };

  const MetricBar = ({
    label,
    scoreVal,
    invert = false,
    description,
  }: {
    label: string;
    scoreVal: number;
    invert?: boolean;
    description?: string;
  }) => (
    <div className="space-y-2 group">
      <div className="flex justify-between items-end">
        <div>
          <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">{label}</span>
          {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
        </div>
        <span className={`text-sm font-bold font-mono ${getScoreTextClass(scoreVal, invert)}`}>{scoreVal}/100</span>
      </div>
      <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
        <div className={`h-full ${getScoreColor(scoreVal, invert)} opacity-90`} style={{ width: `${scoreVal}%` }} />
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="space-y-8 max-w-5xl mx-auto">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
              <Target className="h-8 w-8 text-teal-600" />
              Bid Fit Analysis
            </h2>
            <p className="text-slate-500 mt-2 text-lg">
              {usingLive && bid
                ? `Live score for ${bid.name} — 12-category Bid Intelligence model.`
                : "Data-driven scoring based on your profile, historical success, and extracted scope."}
            </p>
          </div>
          {!usingLive && <DemoDataBadge />}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24 text-slate-500 gap-2">
            <Loader2 className="w-5 h-5 animate-spin" /> Loading live bid-fit score…
          </div>
        ) : live && !bidId ? (
          <Empty className="border border-[#E2E8F0] bg-white">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Target className="text-teal-600" />
              </EmptyMedia>
              <EmptyTitle>Select a bid to score</EmptyTitle>
              <EmptyDescription>
                Open a bid from the pipeline and run Go/No-Go scoring to see live Bid Fit analysis here.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-1 bg-white border-[#E2E8F0] shadow-sm relative overflow-hidden flex flex-col justify-between">
              <div className="absolute inset-0 bg-gradient-to-b from-teal-500/5 to-transparent pointer-events-none" />
              <div className="absolute top-0 right-0 p-6 opacity-[0.03]">
                <Target className="h-40 w-40" />
              </div>
              <CardHeader className="relative z-10 pb-0 border-b border-[#E2E8F0] bg-[#F8FAFC]">
                <CardTitle className="text-lg text-slate-900 font-semibold">Bid Fit Score</CardTitle>
                <CardDescription className="text-slate-500">Overall match for your business</CardDescription>
              </CardHeader>
              <CardContent className="relative z-10 flex flex-col items-center justify-center py-12">
                <div className="relative flex items-center justify-center h-48 w-48">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="96" cy="96" r="84" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-200" />
                    <circle
                      cx="96"
                      cy="96"
                      r="84"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="transparent"
                      strokeDasharray={528}
                      strokeDashoffset={528 - (528 * scores.overall) / 100}
                      className="text-teal-500 transition-all duration-1000 ease-in-out"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-6xl font-black text-slate-900 tracking-tighter">{scores.overall}</span>
                    <span className="text-xs text-[#0A8A8F] font-bold uppercase tracking-widest mt-2 bg-teal-50 px-2 py-1 rounded-full border border-teal-200">
                      {fitLabel}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="relative z-10 bg-[#F8FAFC] border-t border-[#E2E8F0] mt-auto p-6">
                <div className="w-full space-y-3 text-center">
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">System Recommendation</p>
                  <Badge className="w-full justify-center py-2.5 text-sm bg-teal-600 hover:bg-teal-500 text-white border-transparent shadow-sm font-semibold tracking-wide">
                    {recommendation}
                  </Badge>
                  {usingLive && !score?.humanReviewed && (
                    <p className="text-[10px] text-amber-700">Pending human review — not for client-facing use.</p>
                  )}
                </div>
              </CardFooter>
            </Card>

            <Card className="md:col-span-2 bg-white border-[#E2E8F0] shadow-sm">
              <CardHeader className="border-b border-[#E2E8F0] pb-4">
                <CardTitle className="text-lg text-slate-900 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-slate-500" />
                  Decision Drivers
                </CardTitle>
                <CardDescription className="text-slate-500">Key factors influencing the mathematical fit score.</CardDescription>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-x-10 gap-y-8 pt-8">
                <MetricBar label="Win Probability Estimate" scoreVal={scores.confidence} description="Based on historical trade success" />
                <MetricBar label="Risk Profile" scoreVal={scores.risk} invert description="Aggregated deadline and scope risks" />
                <MetricBar label="Relationship Strength" scoreVal={scores.relationship} description="Historical engagement with Client" />
                <MetricBar label="Margin Pressure" scoreVal={scores.marginPressure} invert description="Competitiveness required to win" />
                <MetricBar label="Capacity Alignment" scoreVal={scores.capacityFit} description="Alignment with current crew availability" />
                <MetricBar label="Scope Clarity" scoreVal={scores.scopeClarity} description="Completeness of provided documents" />
              </CardContent>
            </Card>

            <Card className="md:col-span-3 bg-white border-[#E2E8F0] shadow-sm">
              <CardHeader className="pb-4 border-b border-[#E2E8F0]">
                <CardTitle className="flex items-center gap-2 text-lg text-slate-900">
                  <ShieldCheck className="h-5 w-5 text-teal-600" />
                  Compliance & Readiness Check
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6 p-5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
                  <div className="h-14 w-14 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0 border border-teal-200">
                    <CheckCircle2 className="h-7 w-7 text-[#0A8A8F]" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-lg text-slate-900">{compliancePct}% Compliance Readiness</p>
                    <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                      {usingLive && complianceData?.eligibility?.note
                        ? complianceData.eligibility.note
                        : "Your company profile has all required bonding, insurance, and licensing verified and on file for this specific client and jurisdiction."}
                    </p>
                  </div>
                  <div className="w-full md:w-auto shrink-0 mt-2 md:mt-0 flex flex-col gap-2">
                    {bidId && (
                      <Link href={`/bids/${bidId}`}>
                        <Button variant="outline" className="w-full md:w-auto h-11 px-6">
                          Back to bid detail <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                    <Link href="/strategy-memo">
                      <Button className="w-full md:w-auto bg-slate-100 hover:bg-slate-200 text-slate-900 border border-[#E2E8F0] shadow-sm h-11 px-6">
                        Build Strategy Memo <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="text-center pt-4">
          <p className="text-xs text-slate-500 max-w-2xl mx-auto font-medium uppercase tracking-widest leading-relaxed">
            Confidence estimates and fit scores are decision-support guidance only and do not guarantee bid outcomes.
          </p>
        </div>
      </div>
    </Layout>
  );
}
