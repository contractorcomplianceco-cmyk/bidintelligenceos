import { BarChart3 } from "lucide-react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export function AnalyticsChartEmpty({ label }: { label: string }) {
  return (
    <Empty className="h-64 border-0 bg-transparent p-4">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <BarChart3 className="text-slate-400" />
        </EmptyMedia>
        <EmptyTitle className="text-sm">{label}</EmptyTitle>
        <EmptyDescription>
          Record more bid outcomes to populate this chart. Win/loss KPIs above reflect live data.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
