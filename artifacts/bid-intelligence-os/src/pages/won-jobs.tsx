import { useMemo, useState } from "react";
import { Link } from "wouter";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/lib/context";
import { jobDeployments, BID_LIFECYCLE, type JobDeployment, type JobStatus } from "@/lib/operations";
import {
  Trophy,
  DollarSign,
  TrendingUp,
  Building2,
  MapPin,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Route,
} from "lucide-react";

const STATUS_STYLES: Record<JobStatus, string> = {
  Mobilizing: "bg-[#38BDF8]/10 text-[#38BDF8] border-[#38BDF8]/20",
  "In Progress": "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20",
  "On Hold": "bg-[#8A96B0]/10 text-[#8A96B0] border-[#8A96B0]/20",
  Delayed: "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20",
  Completed: "bg-[#0BA3A8]/10 text-[#0BA3A8] border-[#0BA3A8]/20",
};

function money(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  return `$${(n / 1_000).toFixed(0)}K`;
}

export default function WonJobs() {
  const { toast } = useToast();
  const { verticalConfig } = useAppContext();
  const [converted, setConverted] = useState(false);

  const kpis = useMemo(() => {
    const totalValue = jobDeployments.reduce((s, j) => s + j.contractValue, 0);
    const count = jobDeployments.length;
    const avgRoi =
      jobDeployments.reduce((s, j) => s + j.projectedRoi, 0) / (count || 1);
    return { totalValue, count, avgRoi };
  }, []);

  const handleConvert = () => {
    setConverted(true);
    toast({
      title: "Won bid queued for deployment",
      description:
        "Intelligent handoff drafted: schedule, labor, permits, and weather watch pre-populated. Review before activating.",
    });
  };

  const handleOpen = (job: JobDeployment) => {
    toast({
      title: `Opening ${job.name}`,
      description: "Routing to the job deployment workspace.",
    });
  };

  return (
    <Layout>
      <div className="space-y-6 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white flex items-center gap-3">
              <Trophy className="h-7 w-7 text-[#22C55E]" />
              Won Jobs
            </h1>
            <p className="text-[#8A96B0] mt-1">
              Awarded {verticalConfig.name} bids that have converted into active job
              deployments.
            </p>
          </div>
          <button
            onClick={handleConvert}
            className="inline-flex items-center gap-2 rounded-lg bg-[#0BA3A8] hover:bg-[#0BA3A8]/85 text-white text-sm font-semibold px-4 py-2.5 transition-colors shadow-lg shadow-[#0BA3A8]/10"
          >
            <Sparkles className="w-4 h-4" />
            Convert won bid to job
          </button>
        </div>

        {converted && (
          <div className="rounded-xl border border-[#0BA3A8]/30 bg-[#0BA3A8]/5 p-4 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#0BA3A8] mt-0.5 shrink-0" />
            <div className="text-sm text-[#CBD5E1]">
              <span className="font-semibold text-white">Bid to job lifecycle initiated.</span>{" "}
              The system drafted a job deployment with a proposed schedule, crew and sub
              assignments, permit tracking, and a weather watch. Decision-support guidance
              only &mdash; review before activating client-facing output.
            </div>
          </div>
        )}

        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-[#0F1830] border-[#1C253B] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <DollarSign className="w-10 h-10 text-[#22C55E]" />
            </div>
            <CardContent className="p-5 relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-[#22C55E]" />
                <span className="text-[10px] font-bold text-[#8A96B0] uppercase tracking-wider">
                  Total Won Contract Value
                </span>
              </div>
              <div className="text-3xl font-bold text-white tracking-tight">
                {money(kpis.totalValue)}
              </div>
              <p className="text-[10px] text-[#8A96B0] mt-1 font-medium tracking-wide">
                Across all active deployments
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#0F1830] border-[#1C253B] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <Trophy className="w-10 h-10 text-[#38BDF8]" />
            </div>
            <CardContent className="p-5 relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-4 h-4 text-[#38BDF8]" />
                <span className="text-[10px] font-bold text-[#8A96B0] uppercase tracking-wider">
                  Jobs Won
                </span>
              </div>
              <div className="text-3xl font-bold text-white tracking-tight">
                {kpis.count}
              </div>
              <p className="text-[10px] text-[#8A96B0] mt-1 font-medium tracking-wide">
                Bids advanced to deployment
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#0F1830] border-[#1C253B] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <TrendingUp className="w-10 h-10 text-[#0BA3A8]" />
            </div>
            <CardContent className="p-5 relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-[#0BA3A8]" />
                <span className="text-[10px] font-bold text-[#8A96B0] uppercase tracking-wider">
                  Average Projected ROI
                </span>
              </div>
              <div className="text-3xl font-bold text-white tracking-tight">
                {kpis.avgRoi.toFixed(1)}%
              </div>
              <p className="text-[10px] text-[#8A96B0] mt-1 font-medium tracking-wide">
                Projections require user verification
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Lifecycle strip */}
        <Card className="bg-[#0F1830] border-[#1C253B]">
          <CardHeader className="p-4 border-b border-[#1C253B] flex flex-row items-center gap-2">
            <Route className="w-4 h-4 text-[#38BDF8]" />
            <CardTitle className="text-sm font-bold text-white tracking-wide">
              BID TO JOB LIFECYCLE
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-1.5">
              {BID_LIFECYCLE.map((stage, i) => {
                const isWonMarker = stage === "Bid Won";
                return (
                  <div key={stage} className="flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-semibold px-2 py-1 rounded border ${
                        isWonMarker
                          ? "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/30"
                          : "bg-[#151D2E] text-[#8A96B0] border-[#1C253B]"
                      }`}
                    >
                      {stage}
                    </span>
                    {i < BID_LIFECYCLE.length - 1 && (
                      <ArrowRight className="w-3 h-3 text-[#2A3756] shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Won job cards */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {jobDeployments.map((job) => {
            const stageIndex = BID_LIFECYCLE.indexOf(job.stage);
            const stageProgress =
              ((stageIndex + 1) / BID_LIFECYCLE.length) * 100;
            return (
              <Card
                key={job.id}
                className="bg-[#0F1830] border-[#1C253B] flex flex-col hover:border-[#2A3756] transition-colors"
              >
                <CardHeader className="p-5 border-b border-[#1C253B]">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <CardTitle className="text-base font-bold text-white truncate">
                        {job.name}
                      </CardTitle>
                      <div className="flex items-center gap-3 mt-1.5 text-[11px] text-[#8A96B0]">
                        <span className="flex items-center gap-1 truncate">
                          <Building2 className="w-3 h-3 shrink-0" />
                          {job.client}
                        </span>
                        <span className="flex items-center gap-1 truncate">
                          <MapPin className="w-3 h-3 shrink-0" />
                          {job.location}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`shrink-0 inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border ${STATUS_STYLES[job.status]}`}
                    >
                      {job.status}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="p-5 flex-1 flex flex-col gap-4">
                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-lg bg-[#151D2E] border border-[#1C253B] p-3">
                      <div className="text-[9px] font-bold text-[#8A96B0] uppercase tracking-widest">
                        Contract Value
                      </div>
                      <div className="text-lg font-bold text-white mt-1">
                        {money(job.contractValue)}
                      </div>
                    </div>
                    <div className="rounded-lg bg-[#151D2E] border border-[#1C253B] p-3">
                      <div className="text-[9px] font-bold text-[#8A96B0] uppercase tracking-widest">
                        Projected ROI
                      </div>
                      <div className="text-lg font-bold text-[#22C55E] mt-1">
                        {job.projectedRoi.toFixed(1)}%
                      </div>
                    </div>
                    <div className="rounded-lg bg-[#151D2E] border border-[#1C253B] p-3">
                      <div className="text-[9px] font-bold text-[#8A96B0] uppercase tracking-widest">
                        Completion
                      </div>
                      <div className="text-lg font-bold text-white mt-1">
                        {job.completion}%
                      </div>
                    </div>
                  </div>

                  {/* Completion bar */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold text-[#8A96B0] uppercase tracking-widest">
                        Field Progress
                      </span>
                      <span className="text-[10px] font-semibold text-[#8A96B0]">
                        {job.currentPhase} &middot; Phase {job.phaseIndex + 1} of{" "}
                        {job.totalPhases}
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-[#1C253B] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#0BA3A8] to-[#38BDF8]"
                        style={{ width: `${job.completion}%` }}
                      />
                    </div>
                  </div>

                  {/* Lifecycle stage */}
                  <div className="rounded-lg bg-[#151D2E] border border-[#1C253B] p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-[#8A96B0] uppercase tracking-widest">
                        Current Lifecycle Stage
                      </span>
                      <span className="text-[10px] font-semibold text-[#38BDF8]">
                        {stageIndex + 1}/{BID_LIFECYCLE.length}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-semibold bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/20">
                        <CheckCircle2 className="w-3 h-3" />
                        {job.stage}
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-[#1C253B] overflow-hidden mt-2.5">
                      <div
                        className="h-full rounded-full bg-[#38BDF8]"
                        style={{ width: `${stageProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-auto pt-1 flex items-center justify-between gap-3">
                    <div className="text-[11px] text-[#8A96B0]">
                      Next:{" "}
                      <span className="text-white font-medium">
                        {job.nextMilestone}
                      </span>{" "}
                      &middot; {job.nextMilestoneDate}
                    </div>
                    <Link
                      href="/deployment"
                      onClick={() => handleOpen(job)}
                      className="shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-[#1C253B] hover:bg-[#2A3756] text-white text-xs font-semibold px-3 py-2 transition-colors"
                    >
                      Open Job Deployment
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <p className="text-[11px] text-[#8A96B0] italic">
          Decision-support guidance only. Projected ROI and completion figures require user
          verification and imply no guaranteed outcomes.
        </p>
      </div>
    </Layout>
  );
}
