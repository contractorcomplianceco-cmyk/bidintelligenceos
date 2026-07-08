import { and, eq, isNull } from "drizzle-orm";
import { getDb } from "../db/client.js";
import { bidScores, bids } from "../db/schema.js";

export type OutcomeKey = "won" | "lost" | "no-bid" | "pending";

type CategoryRow = { key: string; label: string; points: number; maxPoints: number };

function outcomeForStatus(status: string): OutcomeKey {
  if (status === "Won") return "won";
  if (status === "Lost") return "lost";
  if (status === "No-Bid") return "no-bid";
  return "pending";
}

function avgCategoryScores(scores: { categoriesJson: string }[]): CategoryRow[] {
  const acc = new Map<string, { label: string; sum: number; maxPoints: number; count: number }>();
  for (const row of scores) {
    let categories: CategoryRow[] = [];
    try {
      categories = JSON.parse(row.categoriesJson) as CategoryRow[];
    } catch {
      continue;
    }
    for (const c of categories) {
      const prev = acc.get(c.key);
      if (prev) {
        prev.sum += c.points;
        prev.count += 1;
      } else {
        acc.set(c.key, { label: c.label, sum: c.points, maxPoints: c.maxPoints, count: 1 });
      }
    }
  }
  return [...acc.entries()]
    .map(([key, v]) => ({
      key,
      label: v.label,
      points: Math.round((v.sum / v.count) * 10) / 10,
      maxPoints: v.maxPoints,
    }))
    .sort((a, b) => a.key.localeCompare(b.key));
}

export async function computeWinLossAnalytics(orgId: string) {
  const db = getDb();
  const bidRows = await db
    .select()
    .from(bids)
    .where(and(eq(bids.orgId, orgId), isNull(bids.deletedAt)));
  const scoreRows = await db.select().from(bidScores).where(eq(bidScores.orgId, orgId));

  const latestByBid = new Map<string, (typeof scoreRows)[0]>();
  for (const row of scoreRows.sort((a, b) => b.createdAt.localeCompare(a.createdAt))) {
    if (!latestByBid.has(row.bidId)) latestByBid.set(row.bidId, row);
  }

  const buckets: Record<
    OutcomeKey,
    {
      count: number;
      totalValue: number;
      scores: number[];
      verdicts: Record<string, number>;
      scoreRows: (typeof scoreRows)[0][];
    }
  > = {
    won: { count: 0, totalValue: 0, scores: [], verdicts: {}, scoreRows: [] },
    lost: { count: 0, totalValue: 0, scores: [], verdicts: {}, scoreRows: [] },
    "no-bid": { count: 0, totalValue: 0, scores: [], verdicts: {}, scoreRows: [] },
    pending: { count: 0, totalValue: 0, scores: [], verdicts: {}, scoreRows: [] },
  };

  for (const bid of bidRows) {
    const outcome = outcomeForStatus(bid.status);
    const bucket = buckets[outcome];
    bucket.count += 1;
    bucket.totalValue += bid.amount ?? 0;
    const snap = latestByBid.get(bid.id);
    if (snap) {
      bucket.scores.push(snap.totalScore);
      bucket.verdicts[snap.verdict] = (bucket.verdicts[snap.verdict] ?? 0) + 1;
      bucket.scoreRows.push(snap);
    }
  }

  const avg = (nums: number[]) =>
    nums.length ? Math.round((nums.reduce((s, n) => s + n, 0) / nums.length) * 10) / 10 : null;

  const byOutcome = (["won", "lost", "no-bid", "pending"] as OutcomeKey[]).map((outcome) => {
    const b = buckets[outcome];
    return {
      outcome,
      count: b.count,
      totalValue: b.totalValue,
      avgTotalScore: avg(b.scores),
      verdictBreakdown: b.verdicts,
      avgCategoryScores: avgCategoryScores(b.scoreRows),
    };
  });

  const decided = buckets.won.count + buckets.lost.count + buckets["no-bid"].count;
  const winRate = decided > 0 ? Math.round((buckets.won.count / decided) * 1000) / 10 : null;

  return {
    summary: {
      totalBids: bidRows.length,
      decided,
      winRate,
      scoredBids: latestByBid.size,
    },
    byOutcome,
  };
}
