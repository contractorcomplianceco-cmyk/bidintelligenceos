import { Construction } from "lucide-react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

type OpsModuleEmptyProps = {
  module: string;
  description?: string;
};

export function OpsModuleEmpty({ module, description }: OpsModuleEmptyProps) {
  return (
    <Empty className="border border-[#E2E8F0] bg-white">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Construction className="text-[#0284C7]" />
        </EmptyMedia>
        <EmptyTitle>{module}</EmptyTitle>
        <EmptyDescription>
          {description ??
            "This screen lights up when you have live jobs and bids. Open Won Jobs or Deployment to add work."}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <p className="text-[11px] text-slate-500">
          Record bids and won jobs to populate the modules that are already live.
        </p>
      </EmptyContent>
    </Empty>
  );
}
