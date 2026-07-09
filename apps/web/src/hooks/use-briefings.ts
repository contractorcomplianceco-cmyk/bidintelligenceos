import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AlertSeverity } from "@core/operations";
import { apiFetch } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";
import { useLiveData } from "@/lib/data-mode";

export type ArchivedBriefing = {
  id: string;
  date: string;
  summary: string;
  highlight: AlertSeverity;
  archivedAt?: string;
};

export function useBriefingArchive() {
  const { isAuthenticated } = useAuth();
  const live = useLiveData(isAuthenticated);

  return useQuery({
    queryKey: ["briefing-archive", live ? "live" : "demo"],
    enabled: live,
    queryFn: () => apiFetch<{ archive: ArchivedBriefing[] }>("/api/v1/briefings/archive"),
    staleTime: 60_000,
  });
}

export function useArchiveBriefing() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (input: { date: string; summary: string; highlight: AlertSeverity }) =>
      apiFetch<{ entry: ArchivedBriefing; archive: ArchivedBriefing[] }>("/api/v1/briefings/archive", {
        method: "POST",
        body: JSON.stringify(input),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["briefing-archive"] });
    },
  });
}
