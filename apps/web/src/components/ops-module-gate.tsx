import type { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/layout";
import { useAuth } from "@/lib/auth-context";
import { useLiveData } from "@/lib/data-mode";
import { apiFetch } from "@/lib/api-client";
import { OpsModuleEmpty } from "@/components/ops-module-empty";

type IntegrationStatus = {
  available: boolean;
  phase: number;
  message: string;
};

type OpsModuleGateProps = {
  title: string;
  subtitle?: string;
  module: string;
  icon?: ReactNode;
  statusPath?: string;
  children: ReactNode;
};

/** Renders children in demo sessions; honest empty state for authenticated team users. */
export function OpsModuleGate({ title, subtitle, module, icon, statusPath, children }: OpsModuleGateProps) {
  const { isAuthenticated } = useAuth();
  const live = useLiveData(isAuthenticated);
  const { data: status } = useQuery({
    queryKey: ["integration-status", statusPath],
    queryFn: () => apiFetch<IntegrationStatus>(statusPath!),
    enabled: live && Boolean(statusPath),
  });

  if (live) {
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
          <OpsModuleEmpty module={module} description={status?.message} />
        </div>
      </Layout>
    );
  }

  return <>{children}</>;
}
