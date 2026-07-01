import { useMemo } from "react";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { crewMembers, subcontractors, CrewStatus, SubStatus } from "@/lib/operations";
import { useToast } from "@/hooks/use-toast";
import {
  Users,
  HardHat,
  TrendingUp,
  AlertTriangle,
  Phone,
  MessageSquarePlus,
  ShieldCheck,
  Briefcase,
  Award,
  Building2,
  CalendarClock,
} from "lucide-react";

const crewStatusStyles: Record<CrewStatus, string> = {
  Available: "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20",
  Assigned: "bg-[#38BDF8]/10 text-[#38BDF8] border-[#38BDF8]/20",
  Overallocated: "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20",
  PTO: "bg-slate-500/10 text-slate-400 border-slate-500/20",
};

const subStatusStyles: Record<SubStatus, string> = {
  "On Track": "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20",
  Delayed: "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20",
  "At Risk": "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20",
  "Not Started": "bg-slate-500/10 text-slate-400 border-slate-500/20",
  Complete: "bg-[#38BDF8]/10 text-[#38BDF8] border-[#38BDF8]/20",
};

function utilizationColor(util: number): string {
  if (util >= 100) return "#EF4444";
  if (util >= 90) return "#F59E0B";
  if (util === 0) return "#8A96B0";
  return "#38BDF8";
}

export default function Labor() {
  const { toast } = useToast();

  const stats = useMemo(() => {
    const assigned = crewMembers.filter((c) => c.status !== "PTO" && c.status !== "Available");
    const utilizationBase = crewMembers.filter((c) => c.utilization > 0);
    const avgUtil =
      utilizationBase.length > 0
        ? Math.round(
            utilizationBase.reduce((sum, c) => sum + c.utilization, 0) / utilizationBase.length,
          )
        : 0;
    const overallocated = crewMembers.filter((c) => c.status === "Overallocated").length;
    const subsAtRisk = subcontractors.filter(
      (s) => s.status === "At Risk" || s.status === "Delayed",
    ).length;
    return {
      crewCount: crewMembers.length,
      assignedCount: assigned.length,
      avgUtil,
      overallocated,
      subsAtRisk,
      subCount: subcontractors.length,
    };
  }, []);

  const conflictCrew = crewMembers.find((c) => c.status === "Overallocated");

  const handleCall = (name: string, contact?: string) => {
    toast({
      title: `Calling ${name}`,
      description: contact ? `Dialing ${contact}...` : "Opening dialer...",
    });
  };

  const handleLogUpdate = (name: string) => {
    toast({
      title: "Update logged",
      description: `Field update recorded for ${name}.`,
    });
  };

  const kpis = [
    {
      label: "Crew Members",
      value: String(stats.crewCount),
      sub: `${stats.assignedCount} actively assigned`,
      icon: Users,
      color: "#38BDF8",
    },
    {
      label: "Avg Utilization",
      value: `${stats.avgUtil}%`,
      sub: "Across active crew",
      icon: TrendingUp,
      color: "#22C55E",
    },
    {
      label: "Overallocated",
      value: String(stats.overallocated),
      sub: "Crew above 100%",
      icon: AlertTriangle,
      color: "#EF4444",
    },
    {
      label: "Subs At Risk",
      value: String(stats.subsAtRisk),
      sub: `of ${stats.subCount} subcontractors`,
      icon: Building2,
      color: "#F59E0B",
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white flex items-center gap-3">
              <HardHat className="w-7 h-7 text-[#38BDF8]" />
              Labor &amp; Subcontractors
            </h1>
            <p className="text-[#8A96B0] mt-1">
              Crew utilization, subcontractor status, and conflict detection across active jobs.
            </p>
          </div>
          <div className="text-[11px] text-[#8A96B0] italic">Decision-support guidance only.</div>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi) => (
            <Card
              key={kpi.label}
              className="bg-[#0F1830] border-[#1C253B] shadow-sm relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <kpi.icon className="w-10 h-10" style={{ color: kpi.color }} />
              </div>
              <CardContent className="p-4 relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <kpi.icon className="w-4 h-4" style={{ color: kpi.color }} />
                  <span className="text-[10px] font-bold text-[#8A96B0] uppercase tracking-wider">
                    {kpi.label}
                  </span>
                </div>
                <div className="text-3xl font-bold text-white tracking-tight">{kpi.value}</div>
                <p className="text-[10px] text-[#8A96B0] mt-1 font-medium tracking-wide">{kpi.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Labor-conflict detection callout */}
        {conflictCrew && (
          <div className="rounded-xl border border-[#EF4444]/30 bg-[#EF4444]/10 p-4 flex items-start gap-3">
            <div className="mt-0.5 shrink-0 rounded-lg bg-[#EF4444]/15 p-2">
              <AlertTriangle className="w-5 h-5 text-[#EF4444]" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#EF4444]">
                  Labor Conflict Detected
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#EF4444] bg-[#EF4444]/15 px-1.5 py-0.5 rounded">
                  {conflictCrew.utilization}%
                </span>
              </div>
              <p className="text-sm text-white font-semibold mt-1">
                {conflictCrew.name} is overallocated on {conflictCrew.assignedJob}
              </p>
              <p className="text-[12px] text-[#8A96B0] mt-0.5">
                {conflictCrew.role} scheduled at {conflictCrew.utilization}% capacity. Rebalance
                hours or add support to protect the schedule. Review before committing changes.
              </p>
            </div>
          </div>
        )}

        {/* Crew Section */}
        <Card className="bg-[#0F1830] border-[#1C253B]">
          <CardHeader className="p-4 border-b border-[#1C253B] flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              <Users className="w-4 h-4 text-[#38BDF8]" /> CREW
            </CardTitle>
            <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest">
              <span className="flex items-center gap-1.5 text-[#22C55E]">
                <span className="w-2 h-2 rounded-full bg-[#22C55E]" />Available
              </span>
              <span className="flex items-center gap-1.5 text-[#38BDF8]">
                <span className="w-2 h-2 rounded-full bg-[#38BDF8]" />Assigned
              </span>
              <span className="flex items-center gap-1.5 text-[#EF4444]">
                <span className="w-2 h-2 rounded-full bg-[#EF4444]" />Overallocated
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2 h-2 rounded-full bg-slate-400" />PTO
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-[#1C253B]">
              {crewMembers.map((crew) => (
                <div
                  key={crew.id}
                  className="p-4 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-center hover:bg-[#151D2E] transition-colors"
                >
                  <div className="md:col-span-3">
                    <div className="font-semibold text-white text-sm">{crew.name}</div>
                    <div className="text-[11px] text-[#8A96B0] flex items-center gap-1 mt-0.5">
                      <Briefcase className="w-3 h-3" /> {crew.role}
                    </div>
                  </div>
                  <div className="md:col-span-3">
                    <div className="text-[10px] font-bold text-[#8A96B0] uppercase tracking-widest mb-0.5">
                      Assigned Job
                    </div>
                    <div className="text-xs text-white">{crew.assignedJob ?? "Unassigned"}</div>
                  </div>
                  <div className="md:col-span-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold text-[#8A96B0] uppercase tracking-widest">
                        Utilization
                      </span>
                      <span
                        className="text-xs font-bold"
                        style={{ color: utilizationColor(crew.utilization) }}
                      >
                        {crew.utilization}%
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-[#1C253B] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${Math.min(crew.utilization, 100)}%`,
                          backgroundColor: utilizationColor(crew.utilization),
                        }}
                      />
                    </div>
                  </div>
                  <div className="md:col-span-3 flex flex-wrap items-center gap-2 md:justify-end">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border ${crewStatusStyles[crew.status]}`}
                    >
                      {crew.status}
                    </span>
                    {crew.certifications.map((cert) => (
                      <span
                        key={cert}
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium text-[#8A96B0] bg-[#1C253B] border border-[#2A3756]"
                      >
                        <Award className="w-3 h-3" /> {cert}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Subcontractors Section */}
        <Card className="bg-[#0F1830] border-[#1C253B]">
          <CardHeader className="p-4 border-b border-[#1C253B] flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#0BA3A8]" /> SUBCONTRACTORS
            </CardTitle>
            <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold uppercase tracking-widest">
              <span className="flex items-center gap-1.5 text-[#22C55E]">
                <span className="w-2 h-2 rounded-full bg-[#22C55E]" />On Track
              </span>
              <span className="flex items-center gap-1.5 text-[#F59E0B]">
                <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />Delayed
              </span>
              <span className="flex items-center gap-1.5 text-[#EF4444]">
                <span className="w-2 h-2 rounded-full bg-[#EF4444]" />At Risk
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2 h-2 rounded-full bg-slate-400" />Not Started
              </span>
              <span className="flex items-center gap-1.5 text-[#38BDF8]">
                <span className="w-2 h-2 rounded-full bg-[#38BDF8]" />Complete
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {subcontractors.map((sub) => (
                <div
                  key={sub.id}
                  className="rounded-xl border border-[#1C253B] bg-[#111A2E] p-4 hover:border-[#2A3756] transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold text-white text-sm">{sub.name}</div>
                      <div className="text-[11px] text-[#8A96B0] mt-0.5">{sub.trade}</div>
                    </div>
                    <span
                      className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border ${subStatusStyles[sub.status]}`}
                    >
                      {sub.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div>
                      <div className="text-[10px] font-bold text-[#8A96B0] uppercase tracking-widest mb-0.5">
                        Assigned Job
                      </div>
                      <div className="text-xs text-white">{sub.assignedJob}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-[#8A96B0] uppercase tracking-widest mb-0.5">
                        Quote
                      </div>
                      <div className="text-xs text-white font-medium">
                        ${sub.quoteAmount.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-[#8A96B0] uppercase tracking-widest mb-0.5 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> COI Expires
                      </div>
                      <div
                        className={`text-xs font-medium ${
                          sub.coiExpires.includes("Jul 2025") ? "text-[#F59E0B]" : "text-white"
                        }`}
                      >
                        {sub.coiExpires}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-[#8A96B0] uppercase tracking-widest mb-0.5 flex items-center gap-1">
                        <CalendarClock className="w-3 h-3" /> Contact
                      </div>
                      <div className="text-xs text-white">{sub.contact}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-4">
                    <button
                      onClick={() => handleCall(sub.name, sub.contact)}
                      className="flex-1 py-2 bg-[#1C253B] hover:bg-[#2A3756] text-white text-xs font-semibold rounded transition-colors flex items-center justify-center gap-2"
                    >
                      <Phone className="w-3.5 h-3.5" /> Call
                    </button>
                    <button
                      onClick={() => handleLogUpdate(sub.name)}
                      className="flex-1 py-2 bg-[#0BA3A8]/15 hover:bg-[#0BA3A8]/25 text-[#0BA3A8] text-xs font-semibold rounded transition-colors flex items-center justify-center gap-2 border border-[#0BA3A8]/30"
                    >
                      <MessageSquarePlus className="w-3.5 h-3.5" /> Log update
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
