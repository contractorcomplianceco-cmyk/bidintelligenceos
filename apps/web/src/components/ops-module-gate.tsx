import type { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/layout";
import { useAuth } from "@/lib/auth-context";
import { useLiveData } from "@/lib/data-mode";
import { apiFetch } from "@/lib/api-client";
import { OpsModuleEmpty } from "@/components/ops-module-empty";

export type IntegrationStatus = {
  available: boolean;
  configured?: boolean;
  connected?: boolean;
  phase: number;
  message: string;
  appUrl?: string;
  error?: string;
};

type OpsModuleGateProps = {
  title: string;
  subtitle?: string;
  module: string;
  icon?: ReactNode;
  statusPath?: string;
  /** Live UI when integration status reports available (authed team users only). */
  connectedChildren?: ReactNode;
  children: ReactNode;
};

/** Renders demo fixtures for anonymous sessions; honest empty or live integration for authed users. */
export function OpsModuleGate({
  title,
  subtitle,
  module,
  icon,
  statusPath,
  connectedChildren,
  children,
}: OpsModuleGateProps) {
  const { isAuthenticated } = useAuth();
  const live = useLiveData(isAuthenticated);
  const { data: status, isLoading, isError } = useQuery({
    queryKey: ["integration-status", statusPath],
    queryFn: () => apiFetch<IntegrationStatus>(statusPath!),
    enabled: live && Boolean(statusPath),
  });

  if (live) {
    if (statusPath && isLoading) {
      return (
        <Layout>
          <div className="space-y-6 max-w-[1600px] mx-auto">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
                {icon}
                {title}
              </h1>
              {subtitle && <p className="text-slate-500 mt-1">{subtitle}</p>}
            </div>
            <p className="text-sm text-slate-500">Checking integration status…</p>
          </div>
        </Layout>
      );
    }

    if (status?.available && connectedChildren) {
      return <>{connectedChildren}</>;
    }

    const description =
      status?.message ??
      (isError
        ? "Could not reach the integration status endpoint. Try again or contact your administrator."
        : undefined);

    return (
      <Layout>
        <div className="space-y-6 max-w-[1600px] mx-auto">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              {icon}
              {title}
            </h1>
            {subtitle && <p className="text-slate-500 mt-1">{subtitle}</p>}
          </div>
          <OpsModuleEmpty module={module} description={description} />
          {status?.configured && !status.connected && status.error && (
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 max-w-xl">
              Connection error: {status.error}
            </p>
          )}
        </div>
      </Layout>
    );
  }

  return <>{children}</>;
}
