import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";

export type VideoConnectIntegrationStatus = {
  configured: boolean;
  connected: boolean;
  available: boolean;
  phase: number;
  message: string;
  appUrl?: string;
  error?: string;
};

export type VideoConnectWalkthrough = {
  id: string;
  site: string;
  meta?: string | null;
  duration?: string | null;
  date?: string | null;
  scopeItems?: number | null;
  issues?: number | null;
  status: string;
  done?: boolean;
  bidId?: string | null;
};

export type VideoConnectWalkthroughsResponse = {
  walkthroughs: VideoConnectWalkthrough[];
  stats: {
    walkthroughsThisWeek: number;
    scopeItemsExtracted: number;
    draftBidsCreated: number;
  };
  status: VideoConnectIntegrationStatus;
};

export function useVideoConnectStatus(enabled: boolean) {
  return useQuery({
    queryKey: ["integration-status", "/api/v1/integrations/video-connect/status"],
    queryFn: () =>
      apiFetch<VideoConnectIntegrationStatus>("/api/v1/integrations/video-connect/status"),
    enabled,
  });
}

export function useVideoConnectWalkthroughs(enabled: boolean) {
  return useQuery({
    queryKey: ["video-connect-walkthroughs"],
    queryFn: () =>
      apiFetch<VideoConnectWalkthroughsResponse>("/api/v1/integrations/video-connect/walkthroughs"),
    enabled,
    retry: false,
  });
}
