import { and, desc, eq, isNull } from "drizzle-orm";
import { getDb } from "../db/client.js";
import { bidScores, bids } from "../db/schema.js";

/** Sanitized projection for CCA Command Center (no PII — counts and statuses only). */
export async function buildCommandCenterProjection(orgId: string) {
  const db = getDb();
  const bidRows = await db
    .select()
    .from(bids)
    .where(and(eq(bids.orgId, orgId), isNull(bids.deletedAt)));

  const active = bidRows.filter((b) => !["Won", "Lost", "No-Bid"].includes(b.status));
  const overdue = active.filter((b) => {
    if (!b.nextActionDate) return false;
    return b.nextActionDate < new Date().toISOString().slice(0, 10);
  });

  const verdictCounts: Record<string, number> = {};
  let complianceBlocked = 0;

  for (const bid of active) {
    const scores = await db
      .select()
      .from(bidScores)
      .where(and(eq(bidScores.bidId, bid.id), eq(bidScores.orgId, orgId)))
      .orderBy(desc(bidScores.createdAt))
      .limit(1);
    const snap = scores[0];
    if (!snap) continue;
    verdictCounts[snap.verdict] = (verdictCounts[snap.verdict] ?? 0) + 1;
    try {
      const compliance = JSON.parse(snap.complianceJson) as { eligibilityPoints?: number };
      if ((compliance.eligibilityPoints ?? 0) < 4) complianceBlocked += 1;
    } catch {
      /* ignore */
    }
  }

  const now = new Date().toISOString();

  return {
    source_app: "bid_intelligence_os",
    generated_at: now,
    org_id: orgId,
    counts: {
      total_bids: bidRows.length,
      active_bids: active.length,
      overdue_follow_ups: overdue.length,
      compliance_blocked: complianceBlocked,
    },
    verdicts: verdictCounts,
    events: [
      {
        event_type: "bid_pipeline_snapshot",
        source_system: "bid_intelligence_os",
        title: "Bid pipeline snapshot",
        description: `${active.length} active bids; ${overdue.length} overdue follow-ups.`,
        priority: overdue.length > 0 ? "P1" : "P2",
        sensitivity: "internal",
        payload: {
          active_bids: active.length,
          overdue_follow_ups: overdue.length,
          compliance_blocked: complianceBlocked,
          verdicts: verdictCounts,
        },
        occurred_at: now,
      },
      ...overdue.slice(0, 8).map((b) => ({
        event_type: "bid_follow_up_overdue",
        source_system: "bid_intelligence_os",
        source_record_id: b.id,
        title: `Overdue follow-up: ${b.name}`,
        description: b.nextAction || "Follow-up date passed.",
        priority: "P1" as const,
        sensitivity: "internal" as const,
        related_route: `/bids/${b.id}`,
        payload: { bid_id: b.id, status: b.status, next_action_date: b.nextActionDate },
        occurred_at: now,
      })),
    ],
    tasks: overdue.slice(0, 5).map((b) => ({
      title: `Follow up: ${b.name}`,
      source_type: "bid_intelligence_os",
      source_label: "BidIntelligenceOS",
      priority: "P1" as const,
      status: "open" as const,
      related_route: `/bids/${b.id}`,
      external_record_id: b.id,
      next_step: b.nextAction || "Review bid and update next action.",
    })),
  };
}
