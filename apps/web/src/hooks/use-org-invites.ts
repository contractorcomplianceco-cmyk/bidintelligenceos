import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";

export type OrgInvite = {
  id: string;
  orgId: string;
  email: string;
  role: string;
  status: string;
  expiresAt: string;
  createdAt: string;
  invitedByUserId: string;
};

export type OrgMember = {
  userId: string;
  email: string;
  name: string;
  role: string;
  orgId: string;
};

export function useOrgMembers(enabled: boolean) {
  return useQuery({
    queryKey: ["org-members"],
    queryFn: () => apiFetch<{ members: OrgMember[] }>("/api/v1/org/members").then((d) => d.members),
    enabled,
    staleTime: 30_000,
  });
}

export function useOrgInvites(enabled: boolean) {
  return useQuery({
    queryKey: ["org-invites"],
    queryFn: () => apiFetch<{ invites: OrgInvite[] }>("/api/v1/org/invites").then((d) => d.invites),
    enabled,
    staleTime: 15_000,
  });
}

export function useCreateOrgInvite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { email: string; role: string }) =>
      apiFetch<{ invite: OrgInvite; acceptUrl: string; token: string }>("/api/v1/org/invites", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["org-invites"] });
    },
  });
}

export function useRevokeOrgInvite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<{ ok: boolean; id: string }>(`/api/v1/org/invites/${encodeURIComponent(id)}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["org-invites"] });
    },
  });
}

export function useAcceptOrgInvite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (token: string) =>
      apiFetch<{ ok: boolean; orgId: string; message: string }>("/api/v1/org/invites/accept", {
        method: "POST",
        body: JSON.stringify({ token }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["org-members"] });
      qc.invalidateQueries({ queryKey: ["org-invites"] });
      qc.invalidateQueries({ queryKey: ["org-profile"] });
    },
  });
}
