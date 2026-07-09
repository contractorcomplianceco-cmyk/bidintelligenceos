import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { activateOnKey } from "@shared/a11y";
import { Search, Calendar, Phone, Activity, HeartPulse, HardHat, Radar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useBids } from "@/hooks/use-bids";
import { useJobs } from "@/hooks/use-jobs";
import { useAuth } from "@/lib/auth-context";
import { useLiveData } from "@/lib/data-mode";
import { apiFetch } from "@/lib/api-client";
import { DemoDataBadge } from "@/components/demo-data-badge";
import { OpsModuleEmpty } from "@/components/ops-module-empty";

const MONITORING_STATUSES = new Set([
  "Submitted",
  "Shortlisted",
  "Follow-Up Due",
  "Clarification Requested",
  "In Progress",
  "Review",
]);

type HealthResponse = {
  status: "ok" | "degraded";
  database?: { ok?: boolean; driver?: string };
};

function getStatusBadge(status: string) {
  switch (status) {
    case "Submitted":
      return <Badge variant="outline" className="bg-blue-950/40 text-blue-400 border-blue-900/50 px-2.5 py-0.5">{status}</Badge>;
    case "Shortlisted":
      return <Badge variant="outline" className="bg-purple-950/40 text-purple-400 border-purple-900/50 px-2.5 py-0.5 shadow-[0_0_10px_rgba(168,85,247,0.15)]">{status}</Badge>;
    case "Follow-Up Due":
      return <Badge variant="outline" className="bg-red-950/40 text-red-400 border-red-900/50 px-2.5 py-0.5 font-bold uppercase tracking-wider text-[10px]">{status}</Badge>;
    case "In Progress":
    case "Review":
      return <Badge variant="outline" className="bg-sky-950/40 text-sky-400 border-sky-900/50 px-2.5 py-0.5">{status}</Badge>;
    default:
      return <Badge variant="outline" className="bg-slate-800 text-slate-300 border-slate-700">{status}</Badge>;
  }
}

export default function Monitoring() {
  const [, navigate] = useLocation();
  const [query, setQuery] = useState("");
  const { isAuthenticated } = useAuth();
  const live = useLiveData(isAuthenticated);
  const { data: allBids = [] } = useBids();
  const { data: jobs = [] } = useJobs();

  const { data: health } = useQuery({
    queryKey: ["api-health", live ? "live" : "demo"],
    enabled: live,
    queryFn: () => apiFetch<HealthResponse>("/api/health"),
    refetchInterval: 60_000,
  });

  const today = new Date().toISOString().slice(0, 10);

  const activeBids = useMemo(
    () => allBids.filter((b) => MONITORING_STATUSES.has(b.status)),
    [allBids],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return activeBids;
    return activeBids.filter((b) =>
      [b.name, b.recipient, b.status, b.contactPerson ?? "", b.nextAction ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [query, activeBids]);

  const activeJobs = useMemo(
    () => jobs.filter((j) => j.status !== "Completed"),
    [jobs],
  );

  const followUpsDue = useMemo(
    () =>
      activeBids.filter(
        (b) => b.nextActionDate && b.nextActionDate.slice(0, 10) < today,
      ).length,
    [activeBids, today],
  );

  if (live && activeBids.length === 0) {
    return (
      <Layout>
        <div className="space-y-8 max-w-[1600px] mx-auto">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <Activity className="h-8 w-8 text-teal-500" />
              Bid Monitoring
            </h2>
            <p className="text-slate-400 mt-2 text-lg">Track active submissions and manage client follow-ups.</p>
          </div>
          <OpsModuleEmpty
            module="Bid Monitoring"
            description="Submit bids or move pipeline records into active statuses to populate follow-up monitoring."
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8 max-w-[1600px] mx-auto">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Activity className="h-8 w-8 text-teal-500" />
            Bid Monitoring
          </h2>
          <p className="text-slate-400 mt-2 text-lg">Track active submissions and manage client follow-ups.</p>
          {!live && <div className="mt-2"><DemoDataBadge /></div>}
        </div>

        {live && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="bg-slate-900/80 border-slate-800">
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`p-2.5 rounded-lg ${health?.status === "ok" ? "bg-emerald-950/50" : "bg-amber-950/50"}`}>
                  <HeartPulse className={`h-5 w-5 ${health?.status === "ok" ? "text-emerald-400" : "text-amber-400"}`} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Platform Health</p>
                  <p className="text-lg font-bold text-slate-200 capitalize">{health?.status ?? "checking…"}</p>
                  <p className="text-xs text-slate-500">{health?.database?.driver ?? "database"}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/80 border-slate-800">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-2.5 rounded-lg bg-sky-950/50">
                  <HardHat className="h-5 w-5 text-sky-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Active Jobs</p>
                  <p className="text-lg font-bold text-slate-200">{activeJobs.length}</p>
                  <p className="text-xs text-slate-500">{jobs.length} total deployments</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/80 border-slate-800">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-2.5 rounded-lg bg-teal-950/50">
                  <Radar className="h-5 w-5 text-teal-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Pipeline Watches</p>
                  <p className="text-lg font-bold text-slate-200">{activeBids.length}</p>
                  <p className="text-xs text-slate-500">{followUpsDue} follow-ups due</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Card className="bg-slate-900/80 border-slate-800 shadow-xl overflow-hidden">
          <CardHeader className="p-5 bg-slate-900 border-b border-slate-800">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search active pipeline..."
                className="pl-9 bg-slate-950 border-slate-700 text-slate-200 focus-visible:ring-teal-500 h-10"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-950/50">
                  <TableRow className="border-slate-800 hover:bg-transparent">
                    <TableHead className="text-slate-400 font-semibold uppercase tracking-wider text-xs h-12">Opportunity / Client</TableHead>
                    <TableHead className="text-slate-400 font-semibold uppercase tracking-wider text-xs h-12 text-right">Amount</TableHead>
                    <TableHead className="text-slate-400 font-semibold uppercase tracking-wider text-xs h-12">Status</TableHead>
                    <TableHead className="text-slate-400 font-semibold uppercase tracking-wider text-xs h-12">Contact Person</TableHead>
                    <TableHead className="text-slate-400 font-semibold uppercase tracking-wider text-xs h-12">Expected Decision</TableHead>
                    <TableHead className="text-slate-400 font-semibold uppercase tracking-wider text-xs h-12">Next Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((bid) => (
                    <TableRow
                      key={bid.id}
                      onClick={() => navigate(`/bids/${bid.id}`)}
                      onKeyDown={activateOnKey(() => navigate(`/bids/${bid.id}`))}
                      role="button"
                      tabIndex={0}
                      aria-label={`Open bid ${bid.name} details`}
                      className="group cursor-pointer hover:bg-slate-800/60 border-slate-800/50 transition-colors"
                    >
                      <TableCell className="py-4">
                        <div className="font-semibold text-slate-200">{bid.name}</div>
                        <div className="text-xs text-slate-400 flex items-center gap-2 mt-1">
                          {bid.recipient}
                          {bid.clarificationRequested && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded bg-yellow-950/30 text-yellow-500 border border-yellow-900/50 text-[10px] font-bold uppercase tracking-widest">
                              Clarification Open
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-slate-300 text-right">
                        ${bid.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(bid.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-slate-300 font-medium">
                          <Phone className="h-3.5 w-3.5 text-slate-500" />
                          {bid.contactPerson || "N/A"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <Calendar className="h-3.5 w-3.5 text-slate-500" />
                          {bid.expectedDecisionDate || "Unknown"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium text-slate-200">
                          {bid.nextAction ?? "-"}
                          {bid.lastTouch && (
                            <div className="text-xs font-normal text-slate-500 mt-1 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-600 inline-block"></span>
                              Last touch: {bid.lastTouch}
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow className="hover:bg-transparent border-slate-800/50">
                      <TableCell colSpan={6} className="text-center text-slate-500 py-12">
                        No pipeline records match &ldquo;{query}&rdquo;.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
