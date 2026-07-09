import type {
  AlertLevel,
  CompetitionDensity,
  RadarAlert,
  RegionHeat,
  SignalSummary,
} from "@core/market-watch";
import type { ResearchExportReadyPreview } from "@/hooks/use-bids";

function relativeUpdatedAt(iso?: string): string {
  if (!iso) return "Recently";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "Recently";
  const hours = Math.max(1, Math.round((Date.now() - then) / 3_600_000));
  if (hours < 24) return `${hours} hr${hours === 1 ? "" : "s"} ago`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

function scoreFromRow(row: ResearchExportReadyPreview["rows"][number]): number {
  let score = 62;
  if (row.humanApproved) score += 18;
  if (row.workflowStage?.toLowerCase().includes("export")) score += 8;
  if (row.teamValidationMethod) score += 6;
  return Math.min(score, 94);
}

function levelFromScore(score: number): AlertLevel {
  if (score >= 85) return "high";
  if (score >= 72) return "medium";
  return "critical-window";
}

function heatFromCount(count: number): RegionHeat {
  if (count >= 8) return "surging";
  if (count >= 4) return "hot";
  if (count >= 2) return "building";
  return "low";
}

function densityFromApprovedRatio(approved: number, total: number): CompetitionDensity {
  const ratio = total > 0 ? approved / total : 0;
  if (ratio >= 0.7) return "low";
  if (ratio >= 0.4) return "moderate";
  return "high";
}

export function hasLiveMarketWatch(preview?: ResearchExportReadyPreview | null): boolean {
  return Boolean(preview?.configured && preview.ok && preview.rows.length > 0);
}

export function buildLiveRadarAlerts(preview: ResearchExportReadyPreview): RadarAlert[] {
  const byState = preview.byState ?? {};
  const stateApproved = preview.rows.reduce<Record<string, { approved: number; total: number }>>(
    (acc, row) => {
      const key = row.stateCode ?? "Unknown";
      const bucket = acc[key] ?? { approved: 0, total: 0 };
      bucket.total += 1;
      if (row.humanApproved) bucket.approved += 1;
      acc[key] = bucket;
      return acc;
    },
    {},
  );

  return preview.rows.map((row, index) => {
    const state = row.stateCode ?? preview.state ?? "Unknown";
    const stateCount = byState[state] ?? 1;
    const approved = stateApproved[state]?.approved ?? 0;
    const total = stateApproved[state]?.total ?? 1;
    const score = scoreFromRow(row);
    const code = row.ccaRfCode ?? row.riskFactorNumber ?? `RF-${index + 1}`;

    return {
      id: row.id ?? `rh-${code}-${state}`,
      level: levelFromScore(score),
      title: `${code} — ${state} jurisdiction signal`,
      summary: `${row.workflowStage ?? "Workflow pending"} · ${
        row.teamValidationMethod ?? "Validation pending"
      }. Export-ready compliance research from Research Hub — read-only preview for bid qualification.`,
      opportunityScore: score,
      trade: "Compliance / Jurisdiction",
      region: `${state} market`,
      regionHeat: heatFromCount(stateCount),
      competitionDensity: densityFromApprovedRatio(approved, total),
      urgency:
        row.humanApproved === false
          ? "Human approval pending — verify before relying on this rule in bid decisions"
          : "Approved for export — review before client-facing use",
      signalType: "market" as const,
      source: "Research Hub export-ready preview (sanitized)",
      detectedAgo: relativeUpdatedAt(row.updatedAt),
      suggestedAction: `Cross-check ${code} against active bids in ${state}; route qualified opportunities to bid pipeline`,
    };
  });
}

export function buildLiveMarketSignals(preview: ResearchExportReadyPreview): {
  jobSignals: SignalSummary[];
  bidSignals: SignalSummary[];
  marketSignals: SignalSummary[];
} {
  const approved = preview.rows.filter((r) => r.humanApproved).length;
  const pending = preview.rows.length - approved;
  const stateCount = Object.keys(preview.byState ?? {}).length;

  return {
    jobSignals: [
      {
        label: "Export-ready rules",
        currentReading: `${preview.total} total · ${preview.count} in preview`,
        trend: preview.total > preview.count ? "up" : "steady",
      },
      {
        label: "Human-approved rows",
        currentReading: `${approved} of ${preview.count} shown`,
        trend: approved > pending ? "up" : approved < pending ? "down" : "steady",
      },
    ],
    bidSignals: [
      {
        label: "Preview state",
        currentReading: preview.state ?? "Multi-state",
        trend: "steady",
      },
      {
        label: "Validation backlog",
        currentReading: pending > 0 ? `${pending} awaiting approval` : "None in preview",
        trend: pending > 0 ? "up" : "down",
      },
    ],
    marketSignals: [
      {
        label: "States with signals",
        currentReading: `${stateCount} state${stateCount === 1 ? "" : "s"} represented`,
        trend: stateCount > 1 ? "up" : "steady",
      },
      {
        label: "Bridge status",
        currentReading: preview.configured ? "Research Hub connected" : "Not configured",
        trend: preview.ok ? "up" : "down",
      },
    ],
  };
}
