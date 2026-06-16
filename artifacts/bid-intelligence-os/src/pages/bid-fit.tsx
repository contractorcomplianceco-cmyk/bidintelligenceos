import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, Target, ShieldCheck, Activity } from "lucide-react";
import { Link } from "wouter";

export default function BidFit() {
  const scores = {
    overall: 78,
    confidence: 65,
    risk: 42,
    marginPressure: 80,
    relationship: 90,
    scopeClarity: 60,
    capacityFit: 85,
    compliance: 100
  };

  const getScoreColor = (score: number, invert = false) => {
    const isGood = invert ? score < 50 : score >= 70;
    const isWarning = invert ? score >= 50 && score < 75 : score >= 50 && score < 70;
    
    if (isGood) return "bg-teal-500";
    if (isWarning) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getScoreTextClass = (score: number, invert = false) => {
    const isGood = invert ? score < 50 : score >= 70;
    const isWarning = invert ? score >= 50 && score < 75 : score >= 50 && score < 70;
    
    if (isGood) return "text-teal-400";
    if (isWarning) return "text-yellow-500";
    return "text-red-400";
  };

  const MetricBar = ({ label, score, invert = false, description }: { label: string, score: number, invert?: boolean, description?: string }) => (
    <div className="space-y-2 group">
      <div className="flex justify-between items-end">
        <div>
          <span className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">{label}</span>
          {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
        </div>
        <span className={`text-sm font-bold font-mono ${getScoreTextClass(score, invert)}`}>{score}/100</span>
      </div>
      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden shadow-inner">
        <div 
          className={`h-full ${getScoreColor(score, invert)} shadow-[0_0_8px_currentColor] opacity-90`} 
          style={{ width: `${score}%` }} 
        />
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="space-y-8 max-w-5xl mx-auto">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
             <Target className="h-8 w-8 text-teal-500" />
             Bid Fit Analysis
          </h2>
          <p className="text-slate-400 mt-2 text-lg">Data-driven scoring based on your profile, historical success, and extracted scope.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Main Score Card */}
          <Card className="md:col-span-1 bg-slate-900/90 border-slate-700 shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute inset-0 bg-gradient-to-b from-teal-500/5 to-transparent pointer-events-none"></div>
            <div className="absolute top-0 right-0 p-6 opacity-[0.03]">
              <Target className="h-40 w-40" />
            </div>
            <CardHeader className="relative z-10 pb-0 border-b border-slate-800/50 bg-slate-950/30">
              <CardTitle className="text-lg text-white font-semibold">Bid Fit Score</CardTitle>
              <CardDescription className="text-slate-400">Overall match for your business</CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 flex flex-col items-center justify-center py-12">
              <div className="relative flex items-center justify-center h-48 w-48">
                <svg className="w-full h-full transform -rotate-90 filter drop-shadow-lg">
                  <circle cx="96" cy="96" r="84" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-800" />
                  <circle 
                    cx="96" cy="96" r="84" 
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
                  <span className="text-6xl font-black text-white tracking-tighter">{scores.overall}</span>
                  <span className="text-xs text-teal-400 font-bold uppercase tracking-widest mt-2 bg-teal-950/50 px-2 py-1 rounded-full border border-teal-900/50">Strong Fit</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="relative z-10 bg-slate-950 border-t border-slate-800 mt-auto p-6">
              <div className="w-full space-y-3 text-center">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">System Recommendation</p>
                <Badge className="w-full justify-center py-2.5 text-sm bg-teal-600 hover:bg-teal-500 text-white border-transparent shadow-lg font-semibold tracking-wide">
                  Proceed to Bid
                </Badge>
              </div>
            </CardFooter>
          </Card>

          {/* Detailed Metrics */}
          <Card className="md:col-span-2 bg-slate-900/80 border-slate-800 shadow-md">
            <CardHeader className="border-b border-slate-800 pb-4">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                 <Activity className="w-5 h-5 text-slate-400" />
                 Decision Drivers
              </CardTitle>
              <CardDescription className="text-slate-400">Key factors influencing the mathematical fit score.</CardDescription>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-x-10 gap-y-8 pt-8">
              <MetricBar 
                label="Win Probability Estimate" 
                score={scores.confidence} 
                description="Based on historical trade success"
              />
              <MetricBar 
                label="Risk Profile" 
                score={scores.risk} 
                invert 
                description="Aggregated deadline and scope risks"
              />
              <MetricBar 
                label="Relationship Strength" 
                score={scores.relationship} 
                description="Historical engagement with Client"
              />
              <MetricBar 
                label="Margin Pressure" 
                score={scores.marginPressure} 
                invert
                description="Competitiveness required to win"
              />
              <MetricBar 
                label="Capacity Alignment" 
                score={scores.capacityFit} 
                description="Alignment with current crew availability"
              />
              <MetricBar 
                label="Scope Clarity" 
                score={scores.scopeClarity} 
                description="Completeness of provided documents"
              />
            </CardContent>
          </Card>

          <Card className="md:col-span-3 bg-slate-900/80 border-slate-800 shadow-md">
            <CardHeader className="pb-4 border-b border-slate-800">
              <CardTitle className="flex items-center gap-2 text-lg text-white">
                <ShieldCheck className="h-5 w-5 text-teal-500" />
                Compliance & Readiness Check
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 p-5 rounded-xl border border-slate-700 bg-slate-950/50 shadow-inner">
                <div className="h-14 w-14 rounded-full bg-teal-900/30 flex items-center justify-center flex-shrink-0 border border-teal-800/50 shadow-[0_0_15px_rgba(20,184,166,0.15)]">
                  <CheckCircle2 className="h-7 w-7 text-teal-400" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-lg text-slate-200">100% Document Readiness</p>
                  <p className="text-sm text-slate-400 mt-1 leading-relaxed">Your company profile has all required bonding, insurance, and licensing verified and on file for this specific client and jurisdiction.</p>
                </div>
                <div className="w-full md:w-auto shrink-0 mt-2 md:mt-0">
                  <Link href="/strategy-memo">
                    <Button className="w-full md:w-auto bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 shadow-sm h-11 px-6">
                      Build Strategy Memo <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center pt-4">
          <p className="text-xs text-slate-500 max-w-2xl mx-auto font-medium uppercase tracking-widest leading-relaxed">
            Confidence estimates and fit scores are decision-support guidance only and do not guarantee bid outcomes.
          </p>
        </div>
      </div>
    </Layout>
  );
}
