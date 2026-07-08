import { createHash } from "node:crypto";

type BidInputFields = {
  id: string;
  name: string;
  recipient: string;
  type: string;
  location: string;
  amount: number;
  status: string;
  scopeSummary?: string | null;
  publicPrivate?: string | null;
  confidence?: number | null;
  fit?: number | null;
  riskScore?: number | null;
};

/** Stable hash of bid fields used for scoring — no PII beyond org-scoped bid id. */
export function hashBidScoreInputs(bid: BidInputFields): string {
  const payload = {
    bidId: bid.id,
    name: bid.name,
    recipient: bid.recipient,
    type: bid.type,
    location: bid.location,
    amount: bid.amount,
    status: bid.status,
    scopeSummary: bid.scopeSummary ?? "",
    publicPrivate: bid.publicPrivate ?? "",
    confidence: bid.confidence ?? null,
    fit: bid.fit ?? null,
    riskScore: bid.riskScore ?? null,
  };
  return createHash("sha256").update(JSON.stringify(payload)).digest("hex").slice(0, 16);
}

export function logScoreAccess(params: {
  userId: string;
  orgId: string;
  bidId: string;
  inputHash: string;
}) {
  console.log(
    JSON.stringify({
      event: "bid_score_compute",
      userId: params.userId,
      orgId: params.orgId,
      bidId: params.bidId,
      inputHash: params.inputHash,
      timestamp: new Date().toISOString(),
    }),
  );
}
