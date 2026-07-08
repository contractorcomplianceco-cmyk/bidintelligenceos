import { Router } from "express";
import { and, desc, eq, isNull } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "../../db/client.js";
import { bids, bidAnalyses, bidScores, voiceConnectDrafts } from "../../db/schema.js";
import { persistBidScoreForBid } from "../../lib/bid-score-service.js";
import { nextId, nowIso } from "../../lib/ids.js";
import { getBidDocumentContext } from "../../lib/document-context.js";
import { generateScopeAnalysis } from "../../lib/rose-ai-engine.js";
import { buildLiveRoseInsights, executivePosture } from "../../lib/rose-insights.js";
import { generateRoseExecutiveBrief, isRoseBrainEnabled } from "../../lib/rose-brain.js";
import { parseVoiceTranscriptToBid } from "../../lib/voice-bid-parser.js";
import { requireAuth, type AuthedRequest } from "../../middleware/auth.js";
import { orgScopeMiddleware } from "../../middleware/org-scope.js";

const router = Router();
router.use(requireAuth);
router.use(orgScopeMiddleware);

const analyzeSchema = z.object({
  bidId: z.string(),
  scopeSummary: z.string().optional(),
});

router.post("/scope-analysis", async (req, res) => {
  const parsed = analyzeSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const { orgId } = (req as unknown as AuthedRequest).auth;
  const db = getDb();
  const bidRows = await db
    .select()
    .from(bids)
    .where(and(eq(bids.id, parsed.data.bidId), eq(bids.orgId, orgId), isNull(bids.deletedAt)))
    .limit(1);
  const bid = bidRows[0];
  if (!bid) {
    res.status(404).json({ error: "Bid not found" });
    return;
  }

  const scopeSummary = parsed.data.scopeSummary ?? bid.scopeSummary ?? "";
  const docContext = await getBidDocumentContext(parsed.data.bidId, orgId);
  const mergedScope = [scopeSummary, docContext.combinedText].filter(Boolean).join("\n\n");

  const payload = await generateScopeAnalysis({
    name: bid.name,
    recipient: bid.recipient,
    type: bid.type,
    location: bid.location,
    amount: bid.amount,
    date: bid.date,
    scopeSummary: mergedScope,
    publicPrivate: bid.publicPrivate,
    documentCount: docContext.documentCount,
  });

  const topRisk = payload.risks.sort((a, b) => b.score - a.score)[0];
  const riskScore = topRisk?.score ?? 40;
  const fit = payload.roseVerdict === "green" ? 82 : payload.roseVerdict === "yellow" ? 70 : 58;
  const confidence = payload.roseVerdict === "green" ? 78 : payload.roseVerdict === "yellow" ? 68 : 55;

  const ts = nowIso();
  const analysisId = nextId("CCA-ANL");

  await db.insert(bidAnalyses).values({
    id: analysisId,
    bidId: parsed.data.bidId,
    orgId,
    status: "completed",
    summary: payload.roseNarrative,
    payloadJson: JSON.stringify(payload),
    aiGenerated: true,
    humanReviewed: false,
    createdAt: ts,
  });

  await db
    .update(bids)
    .set({
      analysisStatus: "completed",
      scopeSummary: payload.deliverables,
      aiGenerated: true,
      humanReviewed: false,
      confidence,
      fit,
      riskScore,
      updatedAt: ts,
    })
    .where(eq(bids.id, parsed.data.bidId));

  const refreshed = (await db.select().from(bids).where(eq(bids.id, bid.id)).limit(1))[0]!;
  const score = await persistBidScoreForBid(refreshed, orgId);

  res.status(201).json({
    analysis: {
      id: analysisId,
      bidId: parsed.data.bidId,
      status: "completed",
      summary: payload.roseNarrative,
      payload,
      aiGenerated: true,
      humanReviewed: false,
      disclaimer: payload.disclaimer,
      score: { totalScore: score.totalScore, verdict: score.verdict, humanReviewed: false },
    },
  });
});

router.get("/scope-analysis/:bidId", async (req, res) => {
  const { orgId } = (req as unknown as AuthedRequest).auth;
  const db = getDb();
  const bid = await db
    .select()
    .from(bids)
    .where(and(eq(bids.id, req.params.bidId), eq(bids.orgId, orgId), isNull(bids.deletedAt)))
    .limit(1);
  if (!bid[0]) {
    res.status(404).json({ error: "Bid not found" });
    return;
  }

  const rows = await db
    .select()
    .from(bidAnalyses)
    .where(and(eq(bidAnalyses.bidId, req.params.bidId), eq(bidAnalyses.orgId, orgId)))
    .orderBy(desc(bidAnalyses.createdAt))
    .limit(1);

  if (!rows[0]) {
    res.json({ analysis: null });
    return;
  }

  const row = rows[0];
  res.json({
    analysis: {
      id: row.id,
      bidId: row.bidId,
      status: row.status,
      summary: row.summary,
      payload: JSON.parse(row.payloadJson || "{}"),
      aiGenerated: Boolean(row.aiGenerated),
      humanReviewed: Boolean(row.humanReviewed),
      createdAt: row.createdAt,
    },
  });
});

router.post("/scope-analysis/:bidId/approve", async (req, res) => {
  const { orgId } = (req as unknown as AuthedRequest).auth;
  const db = getDb();
  const rows = await db
    .select()
    .from(bidAnalyses)
    .where(and(eq(bidAnalyses.bidId, req.params.bidId), eq(bidAnalyses.orgId, orgId)))
    .orderBy(desc(bidAnalyses.createdAt))
    .limit(1);
  if (!rows[0]) {
    res.status(404).json({ error: "No analysis to approve" });
    return;
  }

  const ts = nowIso();
  await db.update(bidAnalyses).set({ humanReviewed: true }).where(eq(bidAnalyses.id, rows[0].id));
  await db.update(bids).set({ humanReviewed: true, updatedAt: ts }).where(eq(bids.id, req.params.bidId));

  res.json({ ok: true, humanReviewed: true });
});

router.get("/roseos/summary", async (req, res) => {
  const { orgId } = (req as unknown as AuthedRequest).auth;
  const db = getDb();
  const bidRows = await db
    .select()
    .from(bids)
    .where(and(eq(bids.orgId, orgId), isNull(bids.deletedAt)));

  const scoreRows = await db.select().from(bidScores).where(eq(bidScores.orgId, orgId));

  const latestScores = new Map<string, (typeof scoreRows)[0]>();
  for (const row of scoreRows.sort((a, b) => b.createdAt.localeCompare(a.createdAt))) {
    if (!latestScores.has(row.bidId)) latestScores.set(row.bidId, row);
  }

  const active = bidRows.filter((b) => ["In Progress", "Review", "Draft"].includes(b.status));
  const overdue = bidRows.filter((b) => b.nextActionDate && b.status === "Follow-Up Due");

  const insights = await buildLiveRoseInsights(
    bidRows,
    [...latestScores.values()].map((s) => ({
      bidId: s.bidId,
      totalScore: s.totalScore,
      verdict: s.verdict,
      humanReviewed: Boolean(s.humanReviewed),
    })),
  );

  const verdict = insights.length > 0 ? executivePosture(insights) : overdue.length > 2 ? "red" : active.length > 5 ? "yellow" : "green";

  const insightCards =
    insights.length > 0
      ? insights.map((i) => ({
          id: i.id,
          title: i.title,
          verdict: i.verdict,
          summary: i.rationale,
          recommendation: i.recommendation,
          href: i.href,
          humanReviewed: i.humanReviewed,
          section: i.section,
        }))
      : [
          {
            id: "rose-fallback",
            title: "Pipeline follow-up pressure",
            verdict,
            summary:
              overdue.length > 0
                ? `${overdue.length} bid(s) need follow-up action this week.`
                : "Follow-up queue is within normal range.",
            humanReviewed: true,
          },
        ];

  const executiveBrief = await generateRoseExecutiveBrief({
    activeBids: active.length,
    overdueFollowUps: overdue.length,
    pendingHumanReview: insights.filter((i) => !i.humanReviewed).length,
    topInsights: insightCards.slice(0, 5).map((i) => ({
      title: i.title,
      verdict: i.verdict,
      rationale: i.summary,
    })),
  });

  res.json({
    verdict,
    stats: {
      activeBids: active.length,
      overdueFollowUps: overdue.length,
      totalBids: bidRows.length,
      pendingHumanReview: insights.filter((i) => !i.humanReviewed).length,
    },
    executiveBrief,
    roseBrain: isRoseBrainEnabled(),
    insights: insightCards,
    guardrail: "Powered by AI. Reviewed by humans required before client-facing use.",
  });
});

const voiceSchema = z.object({
  transcript: z.string().min(1),
  bidId: z.string().optional(),
  createBid: z.boolean().optional(),
});

router.post("/voice-connect/handoff", async (req, res) => {
  const parsed = voiceSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const { orgId } = (req as unknown as AuthedRequest).auth;
  const id = nextId("CCA-VC");
  const ts = nowIso();
  const db = getDb();
  const draft = parseVoiceTranscriptToBid(parsed.data.transcript);

  let bidId = parsed.data.bidId;
  if (!bidId && parsed.data.createBid !== false) {
    bidId = nextId("CCA-BID");
    await db.insert(bids).values({
      id: bidId,
      orgId,
      name: draft.name,
      recipient: draft.recipient,
      type: draft.type,
      location: draft.location,
      amount: draft.amount,
      date: ts.slice(0, 10),
      status: "Draft",
      notes: draft.notes,
      scopeSummary: draft.scopeSummary,
      publicPrivate: draft.publicPrivate,
      analysisStatus: "none",
      aiGenerated: true,
      humanReviewed: false,
      createdAt: ts,
      updatedAt: ts,
    });
  }

  await db.insert(voiceConnectDrafts).values({
    id,
    orgId,
    bidId,
    transcript: parsed.data.transcript,
    status: bidId ? "converted" : "pending",
    createdAt: ts,
  });

  res.status(201).json({
    draft: {
      id,
      status: bidId ? "converted" : "pending",
      bidId,
      parsed: draft,
      message: bidId
        ? "VoiceConnect transcript converted to bid draft — human review required."
        : "VoiceConnect draft saved for bid conversion.",
      href: bidId ? `/bids/${bidId}` : undefined,
    },
  });
});

export default router;
