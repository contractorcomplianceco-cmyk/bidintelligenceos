import { eq } from "drizzle-orm";
import {
  computeBidScore,
  serializePublicBidScore,
  type RoseGateFlags,
  type RoseSignalInputs,
  type EvidenceQuality,
  type SignalKey,
} from "@workspace/cca-core";
import { getDb } from "../db/client.js";
import { bidScores, bids } from "../db/schema.js";
import { computeComplianceEligibility } from "./compliance-eligibility.js";
import { nextId, nowIso } from "./ids.js";
import { parseStateFromLocation } from "./state-parse.js";
import { hashBidScoreInputs, logScoreAccess } from "./score-access-log.js";

type BidRow = typeof bids.$inferSelect;

export type ScoreRequestOptions = {
  /** Override bid.type; defaults to bid.type or "generic". */
  trade?: string;
  signals?: RoseSignalInputs;
  roseGates?: RoseGateFlags;
  mode?: "startup" | "learning";
  evidenceQuality?: Partial<Record<SignalKey, EvidenceQuality>>;
};

/**
 * Persist Rose confidence score for a bid.
 * computeBidScore → computeConfidence (Rose handoff adapter).
 * Public response stays leak-safe via serializePublicBidScore.
 */
export async function persistBidScoreForBid(
  bid: BidRow,
  orgId: string,
  opts: ScoreRequestOptions = {},
  meta?: { userId?: string },
) {
  const trade = opts.trade?.trim() || bid.type?.trim() || "generic";
  const mode = opts.mode ?? "startup";
  const state = parseStateFromLocation(bid.location);
  const compliance = await computeComplianceEligibility(state, {
    trade,
    projectType: bid.publicPrivate,
  });

  // Rose handoff surface: computeConfidence (+ evaluateKillGates inside adapter).
  // Import path remains computeBidScore for BidOS compatibility.
  const result = computeBidScore(
    {
      bidId: bid.id,
      amount: bid.amount,
      confidence: bid.confidence ?? undefined,
      fit: bid.fit ?? undefined,
      riskScore: bid.riskScore ?? undefined,
      daysRemaining: bid.daysRemaining ?? undefined,
      margin: bid.margin ?? undefined,
      publicPrivate: bid.publicPrivate ?? undefined,
      trade,
      mode,
      signals: opts.signals,
      roseGates: opts.roseGates,
      evidenceQuality: opts.evidenceQuality,
    },
    compliance,
  );

  const ts = nowIso();
  const id = nextId("CCA-SCORE");
  const db = getDb();
  const inputHash = hashBidScoreInputs(bid);

  logScoreAccess({
    userId: meta?.userId ?? "system",
    orgId,
    bidId: bid.id,
    inputHash,
    event: "confidence_compute",
    trade,
    mode,
    totalScore: result.totalScore,
    verdict: result.verdict,
  });

  await db.insert(bidScores).values({
    id,
    bidId: bid.id,
    orgId,
    totalScore: result.totalScore,
    verdict: result.verdict,
    categoriesJson: JSON.stringify(result.categories),
    gatesJson: JSON.stringify(result.gates),
    complianceJson: JSON.stringify(result.compliance),
    aiGenerated: true,
    humanReviewed: false,
    lockedAt: ts,
    createdAt: ts,
  });

  await db
    .update(bids)
    .set({
      confidence: result.totalScore,
      humanReviewed: false,
      aiGenerated: true,
      updatedAt: ts,
    })
    .where(eq(bids.id, bid.id));

  return {
    ...serializePublicBidScore(result, { id, bidId: bid.id, lockedAt: ts, createdAt: ts }),
  };
}
