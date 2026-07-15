import { eq } from "drizzle-orm";
import {
  computeBidScore,
  serializePublicBidScore,
  type RoseGateFlags,
  type RoseSignalInputs,
} from "@workspace/cca-core";
import { getDb } from "../db/client.js";
import { bidScores, bids } from "../db/schema.js";
import { computeComplianceEligibility } from "./compliance-eligibility.js";
import { nextId, nowIso } from "./ids.js";
import { parseStateFromLocation } from "./state-parse.js";

type BidRow = typeof bids.$inferSelect;

export type ScoreRequestOptions = {
  /** Override bid.type; defaults to bid.type or "generic". */
  trade?: string;
  signals?: RoseSignalInputs;
  roseGates?: RoseGateFlags;
  mode?: "startup" | "learning";
};

export async function persistBidScoreForBid(
  bid: BidRow,
  orgId: string,
  opts: ScoreRequestOptions = {},
) {
  const trade = opts.trade?.trim() || bid.type?.trim() || "generic";
  const state = parseStateFromLocation(bid.location);
  const compliance = await computeComplianceEligibility(state, {
    trade,
    projectType: bid.publicPrivate,
  });

  const result = computeBidScore(
    {
      amount: bid.amount,
      confidence: bid.confidence ?? undefined,
      fit: bid.fit ?? undefined,
      riskScore: bid.riskScore ?? undefined,
      daysRemaining: bid.daysRemaining ?? undefined,
      margin: bid.margin ?? undefined,
      publicPrivate: bid.publicPrivate ?? undefined,
      trade,
      mode: opts.mode ?? "startup",
      signals: opts.signals,
      roseGates: opts.roseGates,
    },
    compliance,
  );

  const ts = nowIso();
  const id = nextId("CCA-SCORE");
  const db = getDb();

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
