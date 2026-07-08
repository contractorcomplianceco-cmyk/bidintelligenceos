import type { bids } from "../db/schema.js";

type BidRow = typeof bids.$inferSelect;

export type ApiBid = {
  id: string;
  name: string;
  recipient: string;
  type: string;
  location: string;
  amount: number;
  date: string;
  status: string;
  outcome?: string;
  reason?: string;
  margin?: number;
  notes?: string;
  expectedDecisionDate?: string;
  contactPerson?: string;
  clarificationRequested?: boolean;
  lastTouch?: string;
  nextAction?: string;
  nextActionDate?: string;
  confidence?: number;
  fit?: number;
  riskScore?: number;
  publicPrivate?: "Public" | "Private";
  daysRemaining?: number;
  scopeSummary?: string;
  analysisStatus?: string;
  aiGenerated?: boolean;
  humanReviewed?: boolean;
};

export function rowToBid(row: BidRow): ApiBid {
  return {
    id: row.id,
    name: row.name,
    recipient: row.recipient,
    type: row.type,
    location: row.location,
    amount: row.amount,
    date: row.date,
    status: row.status,
    outcome: row.outcome ?? undefined,
    reason: row.reason ?? undefined,
    margin: row.margin ?? undefined,
    notes: row.notes ?? undefined,
    expectedDecisionDate: row.expectedDecisionDate ?? undefined,
    contactPerson: row.contactPerson ?? undefined,
    clarificationRequested: row.clarificationRequested ?? undefined,
    lastTouch: row.lastTouch ?? undefined,
    nextAction: row.nextAction ?? undefined,
    nextActionDate: row.nextActionDate ?? undefined,
    confidence: row.confidence ?? undefined,
    fit: row.fit ?? undefined,
    riskScore: row.riskScore ?? undefined,
    publicPrivate: (row.publicPrivate as "Public" | "Private") ?? undefined,
    daysRemaining: row.daysRemaining ?? undefined,
    scopeSummary: row.scopeSummary ?? undefined,
    analysisStatus: row.analysisStatus ?? undefined,
    aiGenerated: row.aiGenerated ?? undefined,
    humanReviewed: row.humanReviewed ?? undefined,
  };
}
