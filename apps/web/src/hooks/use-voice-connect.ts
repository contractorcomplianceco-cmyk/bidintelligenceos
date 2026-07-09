import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";

export type VoiceConnectIntegrationStatus = {
  configured: boolean;
  connected: boolean;
  available: boolean;
  phase: number;
  message: string;
  appUrl?: string;
  error?: string;
};

export type VoiceConnectCapture = {
  id: string;
  title: string;
  meta?: string | null;
  duration?: string | null;
  date?: string | null;
  itemsTagged?: number | null;
  status: string;
  done?: boolean;
  bidId?: string | null;
};

export type VoiceConnectCapturesResponse = {
  captures: VoiceConnectCapture[];
  stats: {
    capturesThisWeek: number;
    itemsAutoTagged: number;
    draftBidsCreated: number;
  };
  status: VoiceConnectIntegrationStatus;
};

export function useVoiceConnectStatus(enabled: boolean) {
  return useQuery({
    queryKey: ["integration-status", "/api/v1/integrations/voice-connect/status"],
    queryFn: () =>
      apiFetch<VoiceConnectIntegrationStatus>("/api/v1/integrations/voice-connect/status"),
    enabled,
  });
}

export function useVoiceConnectCaptures(enabled: boolean) {
  return useQuery({
    queryKey: ["voice-connect-captures"],
    queryFn: () =>
      apiFetch<VoiceConnectCapturesResponse>("/api/v1/integrations/voice-connect/captures"),
    enabled,
    retry: false,
  });
}
