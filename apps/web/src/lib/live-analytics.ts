import type { Bid } from "@core/data";
import type { WinLossAnalytics } from "@/hooks/use-bids";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function monthKey(isoDate: string): string {
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return isoDate.slice(0, 7);
  return `${MONTHS[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`;
}

function decidedBids(bids: Bid[]): Bid[] {
  return bids.filter((b) => ["Won", "Lost", "No-Bid"].includes(b.status));
}

export function buildLiveWinRateSeries(bids: Bid[]): { month: string; rate: number }[] {
  const decided = decidedBids(bids);
  if (decided.length === 0) return [];

  const byMonth = new Map<string, { won: number; total: number }>();
  for (const bid of decided) {
    const key = monthKey(bid.date);
    const bucket = byMonth.get(key) ?? { won: 0, total: 0 };
    bucket.total += 1;
    if (bid.status === "Won") bucket.won += 1;
    byMonth.set(key, bucket);
  }

  return [...byMonth.entries()]
    .map(([month, { won, total }]) => ({
      month,
      rate: Math.round((won / total) * 100),
    }))
    .slice(-12);
}

export function buildLiveOutcomeTimeline(bids: Bid[]): { month: string; won: number; lost: number; noDecision: number }[] {
  const decided = decidedBids(bids);
  if (decided.length === 0) return [];

  const byMonth = new Map<string, { won: number; lost: number; noDecision: number }>();
  for (const bid of decided) {
    const key = monthKey(bid.date);
    const bucket = byMonth.get(key) ?? { won: 0, lost: 0, noDecision: 0 };
    const valueM = +(bid.amount / 1_000_000).toFixed(2);
    if (bid.status === "Won") bucket.won += valueM;
    else if (bid.status === "Lost") bucket.lost += valueM;
    else bucket.noDecision += valueM;
    byMonth.set(key, bucket);
  }

  return [...byMonth.entries()].map(([month, v]) => ({ month, ...v })).slice(-12);
}

export function buildLiveLossReasons(bids: Bid[]): { reason: string; count: number }[] {
  const lost = bids.filter((b) => b.status === "Lost" && b.reason);
  if (lost.length === 0) return [];

  const counts = new Map<string, number>();
  for (const bid of lost) {
    const reason = bid.reason!.trim();
    counts.set(reason, (counts.get(reason) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([reason, count]) => ({ reason, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
}

export function buildLiveOutcomeByType(
  bids: Bid[],
  winLoss?: WinLossAnalytics,
): { type: string; won: number; lost: number }[] {
  if (winLoss && winLoss.summary.decided > 0) {
    const won = winLoss.byOutcome.find((b) => b.outcome === "won")?.count ?? 0;
    const lost = winLoss.byOutcome.find((b) => b.outcome === "lost")?.count ?? 0;
    const noBid = winLoss.byOutcome.find((b) => b.outcome === "no-bid")?.count ?? 0;
    const rows: { type: string; won: number; lost: number }[] = [];
    if (won + lost > 0) rows.push({ type: "Decided", won, lost });
    if (noBid > 0) rows.push({ type: "No-Bid", won: 0, lost: noBid });
    return rows;
  }

  const byType = new Map<string, { won: number; lost: number }>();
  for (const bid of decidedBids(bids)) {
    const type = bid.type || "General";
    const bucket = byType.get(type) ?? { won: 0, lost: 0 };
    if (bid.status === "Won") bucket.won += 1;
    else bucket.lost += 1;
    byType.set(type, bucket);
  }
  return [...byType.entries()].map(([type, v]) => ({ type, ...v }));
}

export function hasLiveChartData(bids: Bid[]): boolean {
  return decidedBids(bids).length >= 2;
}

export function hasLiveOutcomeTimeline(bids: Bid[]): boolean {
  return decidedBids(bids).length >= 1;
}

export function hasLiveMarginTrend(
  records: { jobId: string; grossMargin: number }[],
  jobs: { id: string; startDate: string }[],
): boolean {
  const dated = new Set(jobs.map((j) => j.id));
  return records.filter((r) => dated.has(r.jobId)).length >= 2;
}

export function buildLiveMarginTrend(
  records: { jobId: string; grossMargin: number }[],
  jobs: { id: string; startDate: string }[],
): { month: string; margin: number }[] {
  const dateByJob = new Map(jobs.map((j) => [j.id, j.startDate]));
  const byMonth = new Map<string, { sum: number; count: number; sortKey: number }>();

  for (const r of records) {
    const date = dateByJob.get(r.jobId);
    if (!date) continue;
    const key = monthKey(date);
    const sortKey = new Date(date).getTime();
    const bucket = byMonth.get(key) ?? { sum: 0, count: 0, sortKey };
    bucket.sum += r.grossMargin;
    bucket.count += 1;
    bucket.sortKey = Number.isNaN(sortKey) ? bucket.sortKey : Math.min(bucket.sortKey, sortKey);
    byMonth.set(key, bucket);
  }

  return [...byMonth.entries()]
    .sort((a, b) => a[1].sortKey - b[1].sortKey)
    .map(([month, { sum, count }]) => ({
      month,
      margin: Math.round((sum / count) * 10) / 10,
    }))
    .slice(-12);
}

export function buildLiveCostSnapshot(
  records: { estimatedCost: number; actualCost: number }[],
): { week: string; budget: number; actual: number }[] {
  if (records.length === 0) return [];
  return [
    {
      week: "Portfolio",
      budget: records.reduce((s, r) => s + r.estimatedCost, 0),
      actual: records.reduce((s, r) => s + r.actualCost, 0),
    },
  ];
}

export type LiveLearningInsight = {
  key: "momentum" | "strength" | "loss" | "fade";
  title: string;
  body: string;
  tone: string;
};

export function hasLiveLearningLoop(bids: Bid[], winLoss?: WinLossAnalytics): boolean {
  if (winLoss?.summary.decided !== undefined) return winLoss.summary.decided >= 3;
  return decidedBids(bids).length >= 3;
}

export function buildLiveLearningLoopInsights(
  bids: Bid[],
  winLoss: WinLossAnalytics | undefined,
  lossReasons: { reason: string; count: number }[],
  outcomeByType: { type: string; won: number; lost: number }[],
  options?: {
    currentWinRate?: number | null;
    winRateDelta?: number;
    fadeRiskCount?: number;
    fadeRiskLabels?: string[];
    marginDelta?: number;
  },
): LiveLearningInsight[] {
  if (!hasLiveLearningLoop(bids, winLoss)) return [];

  const totalWon = winLoss
    ? (winLoss.byOutcome.find((b) => b.outcome === "won")?.count ?? 0)
    : bids.filter((b) => b.status === "Won").length;
  const totalLost = winLoss
    ? (winLoss.byOutcome.find((b) => b.outcome === "lost")?.count ?? 0)
    : bids.filter((b) => b.status === "Lost").length;
  const currentWinRate =
    options?.currentWinRate ??
    winLoss?.summary.winRate ??
    (totalWon + totalLost > 0 ? Math.round((totalWon / (totalWon + totalLost)) * 100) : 0);
  const winRateDelta = options?.winRateDelta ?? 0;

  const bestType =
    outcomeByType.length > 0
      ? [...outcomeByType].sort(
          (a, b) => b.won / (b.won + b.lost || 1) - a.won / (a.won + a.lost || 1),
        )[0]
      : { type: "General", won: totalWon, lost: totalLost };

  const weakestType =
    outcomeByType.length > 0
      ? [...outcomeByType].sort(
          (a, b) => a.won / (a.won + a.lost || 1) - b.won / (b.won + b.lost || 1),
        )[0]
      : bestType;

  const topLossReason =
    lossReasons.length > 0
      ? lossReasons[0]
      : { reason: "Unrecorded loss factor", count: totalLost };

  const bestRate = Math.round((bestType.won / (bestType.won + bestType.lost || 1)) * 100);
  const weakRate = Math.round((weakestType.won / (weakestType.won + weakestType.lost || 1)) * 100);
  const fadeCount = options?.fadeRiskCount ?? 0;
  const fadeLabels = options?.fadeRiskLabels ?? [];
  const marginDelta = options?.marginDelta ?? 0;

  const insights: LiveLearningInsight[] = [
    {
      key: "momentum",
      title: winRateDelta >= 0 ? "Win rate momentum is positive" : "Win rate needs attention",
      body: `Win rate is ${currentWinRate}% (${winRateDelta >= 0 ? "+" : ""}${winRateDelta}pp vs prior period). ${
        winRateDelta >= 0
          ? `Sustaining responsiveness on ${bestType.type} bids is compounding results.`
          : `Review qualification and follow-up cadence on ${weakestType.type} bids to recover momentum.`
      }`,
      tone: winRateDelta >= 0 ? "#22C55E" : "#EF4444",
    },
    {
      key: "strength",
      title: `${bestType.type} is the strongest vertical`,
      body: `${bestType.type} converts at ${bestRate}% (${bestType.won} won / ${bestType.lost} lost). Prioritize similar scopes in the pipeline.`,
      tone: "#38BDF8",
    },
    {
      key: "loss",
      title: `"${topLossReason.reason}" drives the most losses`,
      body: `${topLossReason.count} loss${topLossReason.count === 1 ? "" : "es"} tied to this factor. ${weakestType.type} lags at ${weakRate}% win rate — revisit qualification and pricing posture there.`,
      tone: "#EF4444",
    },
  ];

  if (fadeCount > 0) {
    insights.push({
      key: "fade",
      title: "Profit-fade pattern detected on active jobs",
      body: `${fadeCount} active job${fadeCount === 1 ? "" : "s"} flagged High profit-fade risk${
        fadeLabels.length ? ` (${fadeLabels.join(", ")})` : ""
      }. Margin trend is ${marginDelta >= 0 ? "up" : "down"} ${Math.abs(marginDelta)}pp overall — change orders and labor burn need active recovery.`,
      tone: "#F59E0B",
    });
  }

  return insights;
}
