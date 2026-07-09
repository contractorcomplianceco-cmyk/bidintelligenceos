import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";
import { useLiveData } from "@/lib/data-mode";

export type CommandCenterProjection = {
  source_app: string;
  generated_at: string;
  org_id: string;
  counts: {
    total_bids: number;
    active_bids: number;
    overdue_follow_ups: number;
    compliance_blocked: number;
  };
  verdicts: Record<string, number>;
  events: {
    event_type: string;
    source_system?: string;
    source_record_id?: string;
    title: string;
    description: string;
    priority: string;
    sensitivity?: string;
    related_route?: string;
    payload?: Record<string, unknown>;
    occurred_at: string;
  }[];
  tasks: {
    title: string;
    source_type: string;
    source_label: string;
    priority: string;
    status: string;
    related_route?: string;
    external_record_id?: string;
    next_step: string;
  }[];
};

export function useCommandCenterProjection() {
  const { isAuthenticated } = useAuth();
  const live = useLiveData(isAuthenticated);

  return useQuery({
    queryKey: ["command-center-projection", live ? "live" : "demo"],
    enabled: live,
    queryFn: () => apiFetch<CommandCenterProjection>("/api/v1/command-center/projection"),
    staleTime: 60_000,
  });
}
