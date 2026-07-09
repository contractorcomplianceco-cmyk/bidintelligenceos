import type { ReactNode } from "react";
import { Layout } from "@/components/layout";
import { useAuth } from "@/lib/auth-context";
import { useLiveData } from "@/lib/data-mode";
import { OpsModuleEmpty } from "@/components/ops-module-empty";

type OpsModuleGateProps = {
  title: string;
  subtitle?: string;
  module: string;
  icon?: ReactNode;
  children: ReactNode;
};

/** Renders children in demo sessions; honest empty state for authenticated team users. */
export function OpsModuleGate({ title, subtitle, module, icon, children }: OpsModuleGateProps) {
  const { isAuthenticated } = useAuth();
  const live = useLiveData(isAuthenticated);

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
          <OpsModuleEmpty module={module} />
        </div>
      </Layout>
    );
  }

  return <>{children}</>;
}
