import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";
import { useLiveData } from "@/lib/data-mode";
import {
  scheduleEvents as demoScheduleEvents,
  permitItems as demoPermits,
  crewMembers as demoCrew,
  subcontractors as demoSubs,
  jobsiteWeather as demoWeather,
  costRecords as demoCostRecords,
  type ScheduleEvent,
  type PermitItem,
  type CrewMember,
  type Subcontractor,
  type JobsiteWeather,
  type CostRecord,
} from "@core/operations";
import {
  closeoutJobs as demoCloseoutJobs,
  closeoutStats as demoCloseoutStats,
  type CloseoutJob,
} from "@core/closeout";
import {
  riskItems as demoRisks,
  changeOrders as demoChangeOrders,
  riskStats as demoRiskStats,
  type RiskItem,
  type ChangeOrder,
} from "@core/risk";
import { samplePackages as demoPackages } from "@core/bid-packages";

export type OpsScheduleEvent = {
  id: string;
  title: string;
  jobId: string;
  jobName: string;
  assignee: string;
  startTime: string;
  endTime?: string;
  dayIndex: number;
  type: string;
  status: string;
  critical: boolean;
  weatherSensitive?: boolean;
  permitDependent?: boolean;
  inspectionDependent?: boolean;
};

export type OpsPermit = {
  id: string;
  jobId: string;
  jobName: string;
  name: string;
  kind: string;
  status: string;
  submittedDate?: string;
  expirationDate?: string;
  inspectionDate?: string;
  dependency?: string;
  critical: boolean;
  derivedFrom?: "payload" | "jurisdiction" | "compliance-gate";
};

export type OpsAlert = {
  id: string;
  severity: string;
  category: string;
  title: string;
  detail: string;
  time: string;
  action: string;
  jobName?: string;
  resolved: boolean;
};

export type LivePackageSection = {
  id: string;
  type: string;
  title: string;
  required?: boolean;
  enabled: boolean;
  content?: unknown;
};

export type LivePackage = {
  id: string;
  bidId: string;
  name: string;
  contractor: string;
  recipient: string;
  project: string;
  projectType: string;
  location?: string;
  date: string;
  documentCount: number;
  documents: {
    id: string;
    fileName: string;
    mimeType: string;
    sizeBytes: number;
    extractionStatus: string;
    humanReviewed: boolean;
    createdAt: string;
  }[];
  humanReviewed: boolean;
  verdict: string;
  complianceItems: { label: string; status: string }[];
  sections: LivePackageSection[];
};

export type OpsPunchListItem = {
  id: string;
  jobId: string;
  jobName: string;
  item: string;
  trade: string;
  status: string;
  assignee: string;
  priority: string;
  dueDate: string;
};

export type OpsCloseoutDoc = {
  id: string;
  requirement: string;
  description: string;
  status: string;
};

export type OpsCloseoutJob = CloseoutJob & {
  punchList?: OpsPunchListItem[];
  closeoutDocs?: OpsCloseoutDoc[];
};

export type OpsCloseoutResponse = {
  jobs: OpsCloseoutJob[];
  stats: typeof demoCloseoutStats;
  punchList: OpsPunchListItem[];
  bidDnaFeedSeries: { name: string; projected: number; final: number; jobId: string }[];
  completionChart: { name: string; completion: number; stage: string; jobId: string }[];
};

function mapScheduleEvent(e: OpsScheduleEvent): ScheduleEvent {
  return {
    id: e.id,
    jobId: e.jobId,
    jobName: e.jobName,
    title: e.title,
    assignee: e.assignee,
    startTime: e.startTime,
    endTime: e.endTime ?? "16:00",
    dayIndex: e.dayIndex,
    type: e.type as ScheduleEvent["type"],
    status: e.status as ScheduleEvent["status"],
    critical: e.critical,
    weatherSensitive: Boolean(e.weatherSensitive),
    permitDependent: Boolean(e.permitDependent),
    inspectionDependent: Boolean(e.inspectionDependent),
  };
}

function mapPermit(p: OpsPermit): PermitItem & { derivedFrom?: OpsPermit["derivedFrom"] } {
  return {
    id: p.id,
    jobId: p.jobId,
    jobName: p.jobName,
    name: p.name,
    kind: p.kind as PermitItem["kind"],
    status: p.status as PermitItem["status"],
    submittedDate: p.submittedDate,
    expirationDate: p.expirationDate,
    inspectionDate: p.inspectionDate,
    dependency: p.dependency,
    critical: p.critical,
    derivedFrom: p.derivedFrom,
  };
}

function useOpsQueryKey(module: string) {
  const { isAuthenticated } = useAuth();
  const live = useLiveData(isAuthenticated);
  return { live, queryKey: ["ops", module, live ? "live" : "demo"] as const };
}

export function useOpsScheduling() {
  const { live, queryKey } = useOpsQueryKey("scheduling");

  return useQuery({
    queryKey,
    queryFn: async (): Promise<ScheduleEvent[]> => {
      if (!live) return demoScheduleEvents;
      const data = await apiFetch<{ events: OpsScheduleEvent[] }>("/api/v1/ops/scheduling");
      return data.events.map(mapScheduleEvent);
    },
    staleTime: 60_000,
  });
}

export function useOpsPermits() {
  const { live, queryKey } = useOpsQueryKey("permits");

  return useQuery({
    queryKey,
    queryFn: async (): Promise<PermitItem[]> => {
      if (!live) return demoPermits;
      const data = await apiFetch<{ permits: OpsPermit[] }>("/api/v1/ops/permits");
      return data.permits.map(mapPermit);
    },
    staleTime: 60_000,
  });
}

export function useOpsLabor() {
  const { live, queryKey } = useOpsQueryKey("labor");

  return useQuery({
    queryKey,
    queryFn: async (): Promise<{ crew: CrewMember[]; subs: Subcontractor[] }> => {
      if (!live) return { crew: demoCrew, subs: demoSubs };
      const data = await apiFetch<{
        crewMembers: CrewMember[];
        subcontractors: Subcontractor[];
      }>("/api/v1/ops/labor");
      return { crew: data.crewMembers, subs: data.subcontractors };
    },
    staleTime: 60_000,
  });
}

export function useOpsWeather() {
  const { live, queryKey } = useOpsQueryKey("weather");

  return useQuery({
    queryKey,
    queryFn: async (): Promise<JobsiteWeather[]> => {
      if (!live) return demoWeather;
      const data = await apiFetch<{ sites: JobsiteWeather[] }>("/api/v1/ops/weather");
      return data.sites;
    },
    staleTime: 60_000,
  });
}

export function useOpsCloseout() {
  const { live, queryKey } = useOpsQueryKey("closeout");

  return useQuery({
    queryKey,
    queryFn: async (): Promise<OpsCloseoutResponse> => {
      if (!live) {
        return {
          jobs: demoCloseoutJobs,
          stats: demoCloseoutStats,
          punchList: [],
          bidDnaFeedSeries: [],
          completionChart: [],
        };
      }
      return apiFetch("/api/v1/ops/closeout");
    },
    staleTime: 60_000,
  });
}

export function useOpsCostRoi() {
  const { live, queryKey } = useOpsQueryKey("cost-roi");

  return useQuery({
    queryKey,
    queryFn: async (): Promise<{
      records: CostRecord[];
      summary: {
        totalContract: number;
        totalCostToDate: number;
        avgMargin: number;
        avgProjectedRoi: number;
      };
    }> => {
      if (!live) {
        const totalContract = demoCostRecords.reduce((s, r) => s + r.bidAmount, 0);
        const totalCostToDate = demoCostRecords.reduce((s, r) => s + r.actualCost, 0);
        return {
          records: demoCostRecords,
          summary: {
            totalContract,
            totalCostToDate,
            avgMargin: demoCostRecords.reduce((s, r) => s + r.grossMargin, 0) / demoCostRecords.length,
            avgProjectedRoi: demoCostRecords.reduce((s, r) => s + r.projectedRoi, 0) / demoCostRecords.length,
          },
        };
      }
      return apiFetch("/api/v1/ops/cost-roi");
    },
    staleTime: 60_000,
  });
}

export function useOpsRisk() {
  const { live, queryKey } = useOpsQueryKey("risk");

  return useQuery({
    queryKey,
    queryFn: async (): Promise<{
      risks: RiskItem[];
      changeOrders: ChangeOrder[];
      stats: typeof demoRiskStats;
    }> => {
      if (!live) {
        return { risks: demoRisks, changeOrders: demoChangeOrders, stats: demoRiskStats };
      }
      const data = await apiFetch<{
        risks: RiskItem[];
        changeOrders: ChangeOrder[];
        stats: typeof demoRiskStats;
      }>("/api/v1/ops/risk");
      return data;
    },
    staleTime: 60_000,
  });
}

export function useOpsPackageBuilder() {
  const { live, queryKey } = useOpsQueryKey("package-builder");

  return useQuery({
    queryKey,
    queryFn: async (): Promise<LivePackage[]> => {
      if (!live) {
        return demoPackages.map((p) => ({
          id: p.id,
          bidId: p.id,
          name: p.name,
          contractor: p.contractor,
          recipient: p.recipient,
          project: p.project,
          projectType: p.projectType,
          date: p.date,
          documentCount: 0,
          documents: [],
          humanReviewed: false,
          verdict: "demo",
          complianceItems: [],
          sections: p.sections.map((s) => ({
            id: s.id,
            type: s.type,
            title: s.title,
            required: s.required,
            enabled: true,
            content: s.content,
          })),
        }));
      }
      const data = await apiFetch<{ packages: LivePackage[] }>("/api/v1/ops/package-builder");
      return data.packages;
    },
    staleTime: 60_000,
  });
}

export function useOpsAlerts() {
  const { live, queryKey } = useOpsQueryKey("alerts");

  return useQuery({
    queryKey,
    enabled: live,
    queryFn: async (): Promise<OpsAlert[]> => {
      const data = await apiFetch<{ alerts: OpsAlert[] }>("/api/v1/ops/alerts");
      return data.alerts;
    },
    staleTime: 60_000,
  });
}
