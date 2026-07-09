import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import { useAuth, type AuthOrg } from "@/lib/auth-context";
import { useLiveData } from "@/lib/data-mode";

export function useOrgProfile() {
  const { isAuthenticated } = useAuth();
  const live = useLiveData(isAuthenticated);

  return useQuery({
    queryKey: ["org-profile", live ? "live" : "demo"],
    enabled: live,
    queryFn: () => apiFetch<{ org: AuthOrg }>("/api/v1/org/profile").then((d) => d.org),
    staleTime: 60_000,
  });
}

export function useUpdateOrgProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { name?: string; vertical?: string; profile?: Record<string, unknown> }) =>
      apiFetch<{ org: AuthOrg }>("/api/v1/org/profile", {
        method: "PATCH",
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["org-profile"] });
    },
  });
}
