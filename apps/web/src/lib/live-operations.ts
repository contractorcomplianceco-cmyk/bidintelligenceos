import type { AlertItem, AlertSeverity, BriefingItem, DailyBriefing } from "@core/operations";
import type { CommandCenterProjection } from "@/hooks/use-command-center";
import type { OpsAlert } from "@/hooks/use-ops";

type RoseInsight = {
  id: string;
  title: string;
  verdict: string;
  summary: string;
  recommendation?: string;
};

type RoseStats = {
  activeBids: number;
  overdueFollowUps: number;
  totalBids: number;
  pendingHumanReview?: number;
};

function priorityToSeverity(priority: string): AlertSeverity {
  if (priority === "P0" || priority === "P1") return "Critical";
  if (priority === "P2") return "High";
  if (priority === "P3") return "Medium";
  return "Info";
}

function verdictToSeverity(verdict: string): AlertSeverity {
  if (verdict === "red") return "Critical";
  if (verdict === "yellow") return "High";
  return "Medium";
}

function mapOpsAlert(a: OpsAlert): AlertItem {
  const severity = (["Critical", "High", "Medium", "Info"].includes(a.severity)
    ? a.severity
    : "Medium") as AlertSeverity;
  const category = (["Weather", "Permit", "Cost", "Labor", "Subcontractor", "Follow-Up", "ROI", "Schedule"].includes(
    a.category,
  )
    ? a.category
    : "Follow-Up") as AlertItem["category"];
  return {
    id: a.id,
    severity,
    category,
    title: a.title,
    detail: a.detail,
    time: a.time,
    action: a.action,
    jobName: a.jobName,
    resolved: a.resolved,
  };
}

export function buildLiveAlerts(
  projection: CommandCenterProjection | undefined,
  roseInsights: RoseInsight[] = [],
  opsAlerts: OpsAlert[] = [],
): AlertItem[] {
  const alerts: AlertItem[] = [];

  projection?.events.forEach((event, i) => {
    if (event.event_type === "bid_pipeline_snapshot") return;
    alerts.push({
      id: `live-${event.source_record_id ?? i}`,
      severity: priorityToSeverity(event.priority),
      category: "Follow-Up",
      title: event.title,
      detail: event.description,
      time: "Today",
      action: "Review bid",
      resolved: false,
    });
  });

  roseInsights
    .filter((i) => i.verdict !== "green")
    .forEach((insight) => {
      alerts.push({
        id: `rose-${insight.id}`,
        severity: verdictToSeverity(insight.verdict),
        category: "Follow-Up",
        title: insight.title,
        detail: insight.summary,
        time: "Today",
        action: insight.recommendation ?? "Review insight",
        resolved: false,
      });
    });

  if (projection && projection.counts.compliance_blocked > 0) {
    alerts.push({
      id: "live-compliance",
      severity: "High",
      category: "Follow-Up",
      title: `${projection.counts.compliance_blocked} bids with compliance gaps`,
      detail: "Eligibility score below threshold on active scored bids. Review before submitting.",
      time: "Today",
      action: "Open bid-fit",
      resolved: false,
    });
  }

  const seen = new Set(alerts.map((a) => a.id));
  for (const ops of opsAlerts) {
    if (!seen.has(ops.id)) alerts.push(mapOpsAlert(ops));
  }

  return alerts;
}

export function buildLiveBriefing(
  projection: CommandCenterProjection | undefined,
  roseStats: RoseStats | undefined,
  roseInsights: RoseInsight[] = [],
  userName?: string,
): DailyBriefing {
  const firstName = userName?.split(" ")[0] ?? "there";
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? `Good morning, ${firstName}.` : hour < 17 ? `Good afternoon, ${firstName}.` : `Good evening, ${firstName}.`;

  const overdue = projection?.counts.overdue_follow_ups ?? roseStats?.overdueFollowUps ?? 0;
  const active = projection?.counts.active_bids ?? roseStats?.activeBids ?? 0;
  const compliance = projection?.counts.compliance_blocked ?? 0;
  const pendingReview = roseStats?.pendingHumanReview ?? 0;

  const summaryParts: string[] = [];
  if (overdue > 0) summaryParts.push(`${overdue} bid${overdue === 1 ? "" : "s"} need follow-up`);
  if (compliance > 0) summaryParts.push(`${compliance} with compliance gaps`);
  if (pendingReview > 0) summaryParts.push(`${pendingReview} awaiting human review`);
  const summary =
    summaryParts.length > 0
      ? `You have ${summaryParts.join(", ")} across ${active} active bids.`
      : active > 0
        ? `${active} active bids in pipeline — no overdue follow-ups flagged today.`
        : "No active bids yet. Intake a new opportunity to start your pipeline brief.";

  const items: BriefingItem[] = [];

  projection?.tasks.slice(0, 5).forEach((task, i) => {
    items.push({
      id: `task-${i}`,
      category: "Follow-Up",
      headline: task.title,
      detail: task.next_step,
      priority: priorityToSeverity(task.priority),
      action: "Open bid",
    });
  });

  roseInsights
    .filter((i) => i.verdict !== "green")
    .slice(0, 3)
    .forEach((insight) => {
      items.push({
        id: `rose-brief-${insight.id}`,
        category: "Follow-Up",
        headline: insight.title,
        detail: insight.summary,
        priority: verdictToSeverity(insight.verdict),
        action: insight.recommendation ?? "Review ROSEOS insight",
      });
    });

  return {
    greeting,
    date: new Date().toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    summary,
    stats: [
      { label: "Active bids", value: String(active) },
      { label: "Overdue follow-ups", value: String(overdue) },
      { label: "Compliance gaps", value: String(compliance) },
      { label: "Pending review", value: String(pendingReview) },
    ],
    items,
  };
}
