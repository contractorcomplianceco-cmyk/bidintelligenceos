import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";

export type PlatformFeedStatus = {
  configured: boolean;
  message: string;
};

export function useSamGovFeedStatus(enabled: boolean) {
  return useQuery({
    queryKey: ["platform-feed", "sam-gov"],
    queryFn: () => apiFetch<PlatformFeedStatus>("/api/v1/integrations/sam-gov/status"),
    enabled,
    staleTime: 60_000,
  });
}

export function useBlsFeedStatus(enabled: boolean) {
  return useQuery({
    queryKey: ["platform-feed", "bls"],
    queryFn: () => apiFetch<PlatformFeedStatus>("/api/v1/integrations/bls/status"),
    enabled,
    staleTime: 60_000,
  });
}

export function useZohoSyncStatus(enabled: boolean) {
  return useQuery({
    queryKey: ["platform-feed", "zoho"],
    queryFn: () => apiFetch<PlatformFeedStatus>("/api/v1/integrations/zoho/status"),
    enabled,
    staleTime: 60_000,
  });
}
