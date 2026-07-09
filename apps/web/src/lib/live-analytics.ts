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

export function buildLiveMarginByJob(
  records: { jobName: string; grossMargin: number }[],
): { name: string; margin: number }[] {
  return records.map((r) => ({
    name: r.jobName.split(" ").slice(0, 2).join(" "),
    margin: r.grossMargin,
  }));
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
