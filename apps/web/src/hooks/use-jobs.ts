import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { jobDeployments, type JobDeployment } from "@core/operations";
import { apiFetch } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";
import { useLiveData } from "@/lib/data-mode";

type ApiJob = JobDeployment & { payload?: Record<string, unknown> };

function mapApiJob(j: ApiJob): JobDeployment {
  const payload = j.payload ?? {};
  return {
    id: j.id,
    bidId: j.bidId,
    name: j.name,
    client: j.client,
    location: j.location,
    vertical: j.vertical as JobDeployment["vertical"],
    contractValue: j.contractValue,
    startDate: j.startDate,
    targetCompletion: j.targetCompletion,
    projectManager: j.projectManager,
    crewLead: j.crewLead,
    currentPhase: j.currentPhase,
    phaseIndex: j.phaseIndex,
    totalPhases: j.totalPhases,
    status: j.status as JobDeployment["status"],
    stage: (payload.stage as JobDeployment["stage"]) ?? "Execution",
    completion: (payload.completion as number) ?? 0,
    budget: (payload.budget as number) ?? j.contractValue,
    costToDate: (payload.costToDate as number) ?? 0,
    projectedRoi: (payload.projectedRoi as number) ?? 0,
    weatherSensitive: (payload.weatherSensitive as boolean) ?? false,
    crew: (payload.crew as string[]) ?? [],
    subs: (payload.subs as string[]) ?? [],
    riskLevel: (payload.riskLevel as JobDeployment["riskLevel"]) ?? "Low",
    nextMilestone: (payload.nextMilestone as string) ?? j.currentPhase,
    nextMilestoneDate: (payload.nextMilestoneDate as string) ?? j.targetCompletion,
  };
}

export function useJobs() {
  const { isAuthenticated } = useAuth();
  const live = useLiveData(isAuthenticated);

  return useQuery({
    queryKey: ["jobs", live ? "live" : "demo"],
    queryFn: async (): Promise<JobDeployment[]> => {
      if (!live) return jobDeployments;
      const data = await apiFetch<{ jobs: ApiJob[] }>("/api/v1/jobs");
      return data.jobs.map(mapApiJob);
    },
  });
}

export function useUpdateJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: { id: string } & Record<string, unknown>) =>
      apiFetch(`/api/v1/jobs/${id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["jobs"] }),
  });
}

export function useCreateJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      apiFetch("/api/v1/jobs", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["jobs"] }),
  });
}
