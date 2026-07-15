/**
 * G8 override journal — append-only reason-coded overrides.
 * Gate Strong-Go manual-heavy second reviewer confirmation.
 */

import { and, desc, eq } from "drizzle-orm";
import { getDb } from "../db/client.js";
import { bidScores, scoreOverrideJournal } from "../db/schema.js";
import { adminEmailSet } from "./clerk-config.js";
import { nextId, nowIso } from "./ids.js";
import { hashBidScoreInputs, logScoreAccess } from "./score-access-log.js";

export const OVERRIDE_REASON_CODES = [
  "client-relationship",
  "strategic-loss-leader",
  "verified-exception",
  "data-corrected",
  "other",
] as const;

export type OverrideReasonCode = (typeof OVERRIDE_REASON_CODES)[number];

export type OverrideJournalEntry = {
  id: string;
  orgId: string;
  bidId: string;
  scoreId?: string;
  gateId?: string;
  fromVerdict?: string;
  toVerdict?: string;
  overrideRole: string;
  reasonCode: string;
  reasonText?: string;
  userId: string;
  createdAt: string;
};

export function canConfirmSecondReviewer(role: string, email: string): boolean {
  const r = role.toLowerCase();
  if (r === "owner" || r === "admin") return true;
  return adminEmailSet().has(email.toLowerCase());
}

export function canOverrideVerdict(role: string, email: string): boolean {
  return canConfirmSecondReviewer(role, email);
}

export async function recordSecondReviewer(params: {
  bidId: string;
  orgId: string;
  userId: string;
  scoreId?: string;
}): Promise<{ scoreId: string; secondReviewerUserId: string; secondReviewerAt: string }> {
  const db = getDb();
  const ts = nowIso();
  let scoreId = params.scoreId;
  if (!scoreId) {
    const rows = await db
      .select()
      .from(bidScores)
      .where(and(eq(bidScores.bidId, params.bidId), eq(bidScores.orgId, params.orgId)))
      .orderBy(desc(bidScores.createdAt))
      .limit(1);
    scoreId = rows[0]?.id;
  }
  if (!scoreId) {
    throw new Error("No score snapshot to attach second reviewer");
  }
  await db
    .update(bidScores)
    .set({
      secondReviewerUserId: params.userId,
      secondReviewerAt: ts,
    })
    .where(eq(bidScores.id, scoreId));
  return { scoreId, secondReviewerUserId: params.userId, secondReviewerAt: ts };
}

export async function appendOverrideJournal(params: {
  orgId: string;
  bidId: string;
  scoreId?: string;
  gateId?: string;
  fromVerdict?: string;
  toVerdict?: string;
  overrideRole: string;
  reasonCode: OverrideReasonCode;
  reasonText?: string;
  userId: string;
  bidForHash?: { id: string; name: string; recipient: string; type: string; location: string; amount: number; status: string };
}): Promise<OverrideJournalEntry> {
  const db = getDb();
  const id = nextId("CCA-OVR");
  const ts = nowIso();
  await db.insert(scoreOverrideJournal).values({
    id,
    orgId: params.orgId,
    bidId: params.bidId,
    scoreId: params.scoreId ?? null,
    gateId: params.gateId ?? null,
    fromVerdict: params.fromVerdict ?? null,
    toVerdict: params.toVerdict ?? null,
    overrideRole: params.overrideRole,
    reasonCode: params.reasonCode,
    reasonText: params.reasonText?.trim().slice(0, 500) || null,
    userId: params.userId,
    createdAt: ts,
  });
  if (params.bidForHash) {
    logScoreAccess({
      userId: params.userId,
      orgId: params.orgId,
      bidId: params.bidId,
      inputHash: hashBidScoreInputs(params.bidForHash),
      event: "verdict_override",
      from: params.fromVerdict,
      to: params.toVerdict,
      gateId: params.gateId,
      verdict: params.toVerdict,
    });
  }
  return {
    id,
    orgId: params.orgId,
    bidId: params.bidId,
    scoreId: params.scoreId,
    gateId: params.gateId,
    fromVerdict: params.fromVerdict,
    toVerdict: params.toVerdict,
    overrideRole: params.overrideRole,
    reasonCode: params.reasonCode,
    reasonText: params.reasonText,
    userId: params.userId,
    createdAt: ts,
  };
}

export async function listOverrideJournal(
  bidId: string,
  orgId: string,
): Promise<OverrideJournalEntry[]> {
  const db = getDb();
  const rows = await db
    .select()
    .from(scoreOverrideJournal)
    .where(and(eq(scoreOverrideJournal.bidId, bidId), eq(scoreOverrideJournal.orgId, orgId)))
    .orderBy(desc(scoreOverrideJournal.createdAt))
    .limit(50);
  return rows.map((r) => ({
    id: r.id,
    orgId: r.orgId,
    bidId: r.bidId,
    scoreId: r.scoreId ?? undefined,
    gateId: r.gateId ?? undefined,
    fromVerdict: r.fromVerdict ?? undefined,
    toVerdict: r.toVerdict ?? undefined,
    overrideRole: r.overrideRole,
    reasonCode: r.reasonCode,
    reasonText: r.reasonText ?? undefined,
    userId: r.userId,
    createdAt: r.createdAt,
  }));
}
