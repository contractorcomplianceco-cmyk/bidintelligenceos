import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertTriangle, ArrowRight, Activity, ShieldCheck, Target } from "lucide-react";
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
    
    if (isGood) return "bg-accent";
    if (isWarning) return "bg-yellow-500";
    return "bg-destructive";
  };

  const getScoreTextClass = (score: number, invert = false) => {
    const isGood = invert ? score < 50 : score >= 70;
    const isWarning = invert ? score >= 50 && score < 75 : score >= 50 && score < 70;
    
    if (isGood) return "text-accent";
    if (isWarning) return "text-yellow-500";
    return "text-destructive";
  };

  const MetricBar = ({ label, score, invert = false, description }: { label: string, score: number, invert?: boolean, description?: string }) => (
    <div className="space-y-2">
      <div className="flex justify-between items-end">
        <div>
          <span className="text-sm font-medium">{label}</span>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
        <span className={`text-sm font-bold ${getScoreTextClass(score, invert)}`}>{score}/100</span>
      </div>
      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
        <div 
          className={`h-full ${getScoreColor(score, invert)}`} 
          style={{ width: `${score}%` }} 
        />
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="space-y-6 max-w-5xl mx-auto">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Bid Fit Analysis</h2>
          <p className="text-muted-foreground">Data-driven scoring based on your profile, historical success, and extracted scope.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Main Score Card */}
          <Card className="md:col-span-1 border-primary/30 bg-card relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Target className="h-32 w-32" />
            </div>
            <CardHeader className="relative z-10 pb-0">
              <CardTitle>Bid Fit Score</CardTitle>
              <CardDescription>Overall match for your business</CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 flex flex-col items-center justify-center py-8">
              <div className="relative flex items-center justify-center h-40 w-40">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-muted" />
                  <circle 
                    cx="80" cy="80" r="70" 
                    stroke="currentColor" 
                    strokeWidth="12" 
                    fill="transparent" 
                    strokeDasharray={440} 
                    strokeDashoffset={440 - (440 * scores.overall) / 100}
                    className="text-primary transition-all duration-1000 ease-in-out" 
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-primary">{scores.overall}</span>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Strong Fit</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="relative z-10 bg-muted/20 border-t border-border mt-auto">
              <div className="w-full space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Recommended Action</p>
                <Badge className="w-full justify-center py-1.5 text-sm bg-primary hover:bg-primary">
                  Proceed to Bid
                </Badge>
              </div>
            </CardFooter>
          </Card>

          {/* Detailed Metrics */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Decision Drivers</CardTitle>
              <CardDescription>Key factors influencing the fit score.</CardDescription>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
              <MetricBar 
                label="Bid Confidence Estimate" 
                score={scores.confidence} 
                description="Probability of winning based on history"
              />
              <MetricBar 
                label="Risk Score" 
                score={scores.risk} 
                invert 
                description="Aggregated deadline and scope risks"
              />
              <MetricBar 
                label="Relationship Strength" 
                score={scores.relationship} 
                description="Historical engagement with Port Authority"
              />
              <MetricBar 
                label="Margin Pressure" 
                score={scores.marginPressure} 
                invert
                description="Competitiveness required to win"
              />
              <MetricBar 
                label="Capacity Fit" 
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

          <Card className="md:col-span-3">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <ShieldCheck className="h-4 w-4 text-accent" />
                Compliance & Document Readiness
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 p-4 rounded-lg border border-border bg-muted/10">
                <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="h-6 w-6 text-accent" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">100% Document Readiness</p>
                  <p className="text-xs text-muted-foreground mt-1">Your company profile has all required bonding, insurance, and licensing on file for this specific client.</p>
                </div>
                <Link href="/strategy-memo">
                  <Button variant="secondary">
                    Build Strategy Memo <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <p className="text-xs text-muted-foreground max-w-2xl mx-auto">
            Confidence estimates and fit scores are decision-support guidance only and do not guarantee bid outcomes. Review all factors independently before finalizing your posture.
          </p>
        </div>
      </div>
    </Layout>
  );
}
