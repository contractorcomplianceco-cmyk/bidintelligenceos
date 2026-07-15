/**
 * Bid outcome autopsy (Rose G3 / G5 spirit) — ≤8 product fields.
 * Org-scoped; per-trade outcome counts feed learning-mode eligibility.
 * Never invent win rates.
 */

import { and, desc, eq } from "drizzle-orm";
import { LEARNING_MODE_MIN_OUTCOMES } from "@workspace/cca-core";
import { getDb } from "../db/client.js";
import { bidAutopsies, bidScores, bids } from "../db/schema.js";
import { nextId, nowIso } from "./ids.js";

export const AUTOPSY_REASON_CODES = [
  "price",
  "relationship",
  "capacity",
  "scope",
  "schedule",
  "competitor-strength",
  "compliance",
  "strategic-no-bid",
  "other",
] as const;

export type AutopsyReasonCode = (typeof AUTOPSY_REASON_CODES)[number];

export type AutopsyInput = {
  outcome: "won" | "lost" | "no-bid";
  reasonCodes?: AutopsyReasonCode[];
  competitorNotes?: string;
  trade?: string;
  scoredSnapshotId?: string;
};

export type AutopsyRecord = {
  id: string;
  orgId: string;
  bidId: string;
  outcome: string;
  reasonCodes: string[];
  competitorNotes?: string;
  trade: string;
  scoredSnapshotId?: string;
  createdAt: string;
  updatedAt: string;
};

export type TradeOutcomeStats = {
  trade: string;
  outcomeCount: number;
  won: number;
  lost: number;
  noBid: number;
  /** wins/(wins+losses) only when decided ≥1; never invented */
  pastPerfWinrate: number | null;
  learningEligible: boolean;
};

function parseCodes(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const v = JSON.parse(raw) as unknown;
    return Array.isArray(v) ? v.map(String) : [];
  } catch {
    return [];
  }
}

function rowToAutopsy(row: typeof bidAutopsies.$inferSelect): AutopsyRecord {
  return {
    id: row.id,
    orgId: row.orgId,
    bidId: row.bidId,
    outcome: row.outcome,
    reasonCodes: parseCodes(row.reasonCodesJson),
    competitorNotes: row.competitorNotes ?? undefined,
    trade: row.trade,
    scoredSnapshotId: row.scoredSnapshotId ?? undefined,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function getLatestScoreId(bidId: string, orgId: string): Promise<string | null> {
  const db = getDb();
  const rows = await db
    .select()
    .from(bidScores)
    .where(and(eq(bidScores.bidId, bidId), eq(bidScores.orgId, orgId)))
    .orderBy(desc(bidScores.createdAt))
    .limit(1);
  return rows[0]?.id ?? null;
}

export async function recordAutopsy(
  bidId: string,
  orgId: string,
  input: AutopsyInput,
  bidTradeFallback?: string,
): Promise<AutopsyRecord> {
  const db = getDb();
  const ts = nowIso();
  const trade = (input.trade?.trim() || bidTradeFallback?.trim() || "generic").toLowerCase();
  const reasonCodes = (input.reasonCodes ?? []).slice(0, 6);
  const competitorNotes = input.competitorNotes?.trim().slice(0, 500) || null;
  const scoredSnapshotId =
    input.scoredSnapshotId?.trim() || (await getLatestScoreId(bidId, orgId)) || null;

  const existing = await db
    .select()
    .from(bidAutopsies)
    .where(and(eq(bidAutopsies.bidId, bidId), eq(bidAutopsies.orgId, orgId)))
    .limit(1);

  if (existing[0]) {
    await db
      .update(bidAutopsies)
      .set({
        outcome: input.outcome,
        reasonCodesJson: JSON.stringify(reasonCodes),
        competitorNotes,
        trade,
        scoredSnapshotId,
        updatedAt: ts,
      })
      .where(eq(bidAutopsies.id, existing[0].id));
    const rows = await db.select().from(bidAutopsies).where(eq(bidAutopsies.id, existing[0].id)).limit(1);
    return rowToAutopsy(rows[0]!);
  }

  const id = nextId("CCA-AUTOPSY");
  await db.insert(bidAutopsies).values({
    id,
    orgId,
    bidId,
    outcome: input.outcome,
    reasonCodesJson: JSON.stringify(reasonCodes),
    competitorNotes,
    trade,
    scoredSnapshotId,
    createdAt: ts,
    updatedAt: ts,
  });
  const rows = await db.select().from(bidAutopsies).where(eq(bidAutopsies.id, id)).limit(1);
  return rowToAutopsy(rows[0]!);
}

export async function getAutopsyForBid(bidId: string, orgId: string): Promise<AutopsyRecord | null> {
  const db = getDb();
  const rows = await db
    .select()
    .from(bidAutopsies)
    .where(and(eq(bidAutopsies.bidId, bidId), eq(bidAutopsies.orgId, orgId)))
    .limit(1);
  return rows[0] ? rowToAutopsy(rows[0]) : null;
}

/** Count org-scoped autopsies for a trade (won/lost/no-bid). */
export async function countOutcomesForTrade(orgId: string, trade: string): Promise<TradeOutcomeStats> {
  const db = getDb();
  const t = trade.trim().toLowerCase() || "generic";
  const rows = await db
    .select()
    .from(bidAutopsies)
    .where(and(eq(bidAutopsies.orgId, orgId), eq(bidAutopsies.trade, t)));

  let won = 0;
  let lost = 0;
  let noBid = 0;
  for (const r of rows) {
    if (r.outcome === "won") won += 1;
    else if (r.outcome === "lost") lost += 1;
    else if (r.outcome === "no-bid") noBid += 1;
  }
  const outcomeCount = won + lost + noBid;
  const decided = won + lost;
  const pastPerfWinrate = decided > 0 ? won / decided : null;
  return {
    trade: t,
    outcomeCount,
    won,
    lost,
    noBid,
    pastPerfWinrate,
    learningEligible:
      outcomeCount >= LEARNING_MODE_MIN_OUTCOMES && pastPerfWinrate != null,
  };
}

/** Sync classic bid status/outcome columns when autopsy is recorded. */
export async function syncBidStatusFromOutcome(
  bidId: string,
  outcome: "won" | "lost" | "no-bid",
  reasonNote?: string,
): Promise<void> {
  const statusByOutcome = {
    won: "Won",
    lost: "Lost",
    "no-bid": "No-Bid",
  } as const;
  const db = getDb();
  const ts = nowIso();
  const existing = await db.select().from(bids).where(eq(bids.id, bidId)).limit(1);
  if (!existing[0]) return;
  const outcomeNote = reasonNote ? `Outcome reason: ${reasonNote}` : undefined;
  const notes = [existing[0].notes, outcomeNote].filter(Boolean).join("\n\n");
  await db
    .update(bids)
    .set({
      status: statusByOutcome[outcome],
      outcome,
      reason: reasonNote ?? existing[0].reason,
      notes: notes || null,
      updatedAt: ts,
    })
    .where(eq(bids.id, bidId));
}
