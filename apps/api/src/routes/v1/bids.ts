import { Router } from "express";
import { and, desc, eq, isNull } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "../../db/client.js";
import { bidScores, bids } from "../../db/schema.js";
import {
  AUTOPSY_REASON_CODES,
  countOutcomesForTrade,
  getAutopsyForBid,
  otherRequiresNote,
  recordAutopsy,
  syncBidStatusFromOutcome,
} from "../../lib/autopsy.js";
import { rowToBid } from "../../lib/bid-mapper.js";
import { persistBidScoreForBid } from "../../lib/bid-score-service.js";
import { resolveApprovedLearningTrades } from "../../lib/learning-approvals.js";
import {
  canUseLearningMode,
  serializePublicBidScore,
  type BidScoreResult,
  type RoseSignalInputs,
} from "@workspace/cca-core";
import { organizations } from "../../db/schema.js";
import bidDocumentsRoutes from "./bid-documents.js";
import { computeComplianceEligibility } from "../../lib/compliance-eligibility.js";
import { nextId, nowIso } from "../../lib/ids.js";
import {
  appendOverrideJournal,
  canConfirmSecondReviewer,
  canOverrideVerdict,
  listOverrideJournal,
  OVERRIDE_REASON_CODES,
  recordSecondReviewer,
} from "../../lib/override-journal.js";
import { hashBidScoreInputs, logScoreAccess } from "../../lib/score-access-log.js";
import { computeWinLossAnalytics } from "../../lib/win-loss-analytics.js";
import { parseStateFromLocation } from "../../lib/state-parse.js";
import { buildPackageBuilderProjection } from "../../lib/ops-projection.js";
import { generatePackageDocx, packageDocxFilename } from "../../lib/package-docx-export.js";
import { generatePackagePdf, packagePdfFilename } from "../../lib/package-pdf-export.js";
import { requireAuth, type AuthedRequest } from "../../middleware/auth.js";
import { orgScopeMiddleware } from "../../middleware/org-scope.js";

const router = Router();
router.use(requireAuth);
router.use(orgScopeMiddleware);

const AI_REVIEW_DISCLAIMER =
  "Powered by AI · Reviewed by humans — required before client-facing use.";

const bidInputSchema = z.object({
  name: z.string().min(1),
  recipient: z.string().optional(),
  type: z.string().optional(),
  location: z.string().optional(),
  amount: z.number().optional(),
  date: z.string().optional(),
  status: z.string().optional(),
  notes: z.string().optional(),
  scopeSummary: z.string().optional(),
  publicPrivate: z.enum(["Public", "Private"]).optional(),
  nextAction: z.string().optional(),
  nextActionDate: z.string().optional(),
  confidence: z.number().optional(),
  fit: z.number().optional(),
});

const outcomeSchema = z
  .object({
    outcome: z.enum(["won", "lost", "no-bid"]),
    reason: z.string().max(1000).optional(),
    /** Autopsy fields: outcome + 6 Rose reason codes; `other` requires a note */
    reasonCodes: z.array(z.enum(AUTOPSY_REASON_CODES)).max(6).optional(),
    competitorNotes: z.string().max(500).optional(),
    trade: z.string().max(64).optional(),
    scoredSnapshotId: z.string().max(80).optional(),
  })
  .superRefine((val, ctx) => {
    if (otherRequiresNote(val.reasonCodes ?? [], val.competitorNotes ?? val.reason)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "reason code 'other' requires a one-line note",
        path: ["competitorNotes"],
      });
    }
  });

const autopsyPatchSchema = z
  .object({
    outcome: z.enum(["won", "lost", "no-bid"]).optional(),
    reasonCodes: z.array(z.enum(AUTOPSY_REASON_CODES)).max(6).optional(),
    competitorNotes: z.string().max(500).optional().nullable(),
    trade: z.string().max(64).optional(),
    scoredSnapshotId: z.string().max(80).optional().nullable(),
  })
  .superRefine((val, ctx) => {
    if (
      val.competitorNotes !== null &&
      otherRequiresNote(val.reasonCodes ?? [], val.competitorNotes)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "reason code 'other' requires a one-line note",
        path: ["competitorNotes"],
      });
    }
  });

const overrideSchema = z.object({
  reasonCode: z.enum(OVERRIDE_REASON_CODES),
  reasonText: z.string().max(500).optional(),
  gateId: z.string().max(64).optional(),
  fromVerdict: z.string().max(64).optional(),
  toVerdict: z.string().max(64).optional(),
  scoreId: z.string().max(80).optional(),
});

router.get("/", async (req, res) => {
  const { orgId } = (req as unknown as AuthedRequest).auth;
  const db = getDb();
  const rows = await db
    .select()
    .from(bids)
    .where(and(eq(bids.orgId, orgId), isNull(bids.deletedAt)));
  res.json({ bids: rows.map(rowToBid) });
});

router.use("/:bidId/documents", bidDocumentsRoutes);

router.get("/analytics/win-loss", async (req, res) => {
  const { orgId } = (req as unknown as AuthedRequest).auth;
  const analytics = await computeWinLossAnalytics(orgId);
  res.json(analytics);
});

async function loadBidForOrg(bidId: string, orgId: string) {
  const db = getDb();
  const rows = await db
    .select()
    .from(bids)
    .where(and(eq(bids.id, bidId), eq(bids.orgId, orgId), isNull(bids.deletedAt)))
    .limit(1);
  return rows[0] ?? null;
}

router.get("/:id/compliance-eligibility", async (req, res) => {
  const { orgId } = (req as unknown as AuthedRequest).auth;
  const bid = await loadBidForOrg(req.params.id, orgId);
  if (!bid) {
    res.status(404).json({ error: "Bid not found" });
    return;
  }
  const state = parseStateFromLocation(bid.location);
  const eligibility = await computeComplianceEligibility(state, { trade: bid.type, projectType: bid.publicPrivate });
  res.json({ eligibility });
});

router.get("/:id/score", async (req, res) => {
  const { orgId } = (req as unknown as AuthedRequest).auth;
  const bid = await loadBidForOrg(req.params.id, orgId);
  if (!bid) {
    res.status(404).json({ error: "Bid not found" });
    return;
  }
  const db = getDb();
  const rows = await db
    .select()
    .from(bidScores)
    .where(and(eq(bidScores.bidId, req.params.id), eq(bidScores.orgId, orgId)))
    .orderBy(desc(bidScores.createdAt))
    .limit(1);
  if (!rows[0]) {
    res.json({ score: null });
    return;
  }
  const row = rows[0];
  const stored: BidScoreResult = {
    totalScore: row.totalScore,
    maxScore: 100,
    verdict: row.verdict as BidScoreResult["verdict"],
    categories: JSON.parse(row.categoriesJson),
    gates: JSON.parse(row.gatesJson),
    compliance: JSON.parse(row.complianceJson),
    aiGenerated: Boolean(row.aiGenerated),
    humanReviewed: Boolean(row.humanReviewed),
    disclaimer: AI_REVIEW_DISCLAIMER,
  };
  res.json({
    score: serializePublicBidScore(stored, {
      id: row.id,
      bidId: row.bidId,
      lockedAt: row.lockedAt,
      createdAt: row.createdAt,
      reviewedBy: row.reviewedBy ?? undefined,
      reviewedAt: row.reviewedAt ?? undefined,
    }),
  });
});

const scoreBodySchema = z
  .object({
    trade: z.string().min(1).max(64).optional(),
    mode: z.enum(["startup", "learning"]).optional(),
    /** Optional Rose signal overrides (0–1; scope_clarity also accepts 1–5). */
    signals: z.record(z.string(), z.number().min(0).max(5).nullable()).optional(),
    pursuitHours: z.number().min(0).max(10_000).optional(),
    roseGates: z
      .object({
        hasScopeDocs: z.boolean().optional(),
        bondingInfeasible: z.boolean().optional(),
        roofingWeatherWindowFail: z.boolean().optional(),
        roofingActiveLeakOccupied: z.boolean().optional(),
        electricalGearLeadFail: z.boolean().optional(),
        mechanicalLeadFail: z.boolean().optional(),
        softHold: z.boolean().optional(),
        licensedTrades: z.array(z.string()).optional(),
        licenseClassGap: z.boolean().optional(),
        licenseClassGapSoft: z.boolean().optional(),
        permitUtilityUnresolved: z.boolean().optional(),
        certAhjGap: z.boolean().optional(),
        certAhjGapSoft: z.boolean().optional(),
        gcSubCoverageFail: z.boolean().optional(),
        /** G11 #11 — manual-heavy Strong Go needs second reviewer */
        manualHeavy: z.boolean().optional(),
        secondReviewerConfirmed: z.boolean().optional(),
      })
      .optional(),
  })
  .optional();

router.post("/:id/score", async (req, res) => {
  const { orgId, userId } = (req as unknown as AuthedRequest).auth;
  const bid = await loadBidForOrg(req.params.id, orgId);
  if (!bid) {
    res.status(404).json({ error: "Bid not found" });
    return;
  }
  const body = scoreBodySchema.parse(req.body ?? {});
  logScoreAccess({
    userId,
    orgId,
    bidId: bid.id,
    inputHash: hashBidScoreInputs(bid),
  });
  const score = await persistBidScoreForBid(bid, orgId, {
    trade: body?.trade,
    mode: body?.mode,
    signals: body?.signals as RoseSignalInputs | undefined,
    roseGates: body?.roseGates,
    pursuitHours: body?.pursuitHours,
  });
  res.status(201).json({ score });
});

router.post("/:id/score/approve", async (req, res) => {
  const { orgId, userId, role } = (req as unknown as AuthedRequest).auth;
  if (role !== "owner") {
    res.status(403).json({ error: "Admin approval required" });
    return;
  }
  const bid = await loadBidForOrg(req.params.id, orgId);
  if (!bid) {
    res.status(404).json({ error: "Bid not found" });
    return;
  }
  const db = getDb();
  const rows = await db
    .select()
    .from(bidScores)
    .where(and(eq(bidScores.bidId, req.params.id), eq(bidScores.orgId, orgId)))
    .orderBy(desc(bidScores.createdAt))
    .limit(1);
  if (!rows[0]) {
    res.status(404).json({ error: "No score snapshot to approve" });
    return;
  }
  const ts = nowIso();
  await db
    .update(bidScores)
    .set({ humanReviewed: true, reviewedBy: userId, reviewedAt: ts })
    .where(eq(bidScores.id, rows[0].id));
  await db.update(bids).set({ humanReviewed: true, updatedAt: ts }).where(eq(bids.id, bid.id));

  res.json({ ok: true, humanReviewed: true, reviewedAt: ts });
});

router.put("/:id/score/lock", async (req, res) => {
  const { orgId } = (req as unknown as AuthedRequest).auth;
  const bid = await loadBidForOrg(req.params.id, orgId);
  if (!bid) {
    res.status(404).json({ error: "Bid not found" });
    return;
  }
  const db = getDb();
  const rows = await db
    .select()
    .from(bidScores)
    .where(and(eq(bidScores.bidId, req.params.id), eq(bidScores.orgId, orgId)))
    .orderBy(desc(bidScores.createdAt))
    .limit(1);
  if (!rows[0]) {
    res.status(404).json({ error: "No score snapshot to lock" });
    return;
  }
  const lockedAt = rows[0].lockedAt ?? nowIso();
  await db.update(bidScores).set({ lockedAt }).where(eq(bidScores.id, rows[0].id));
  res.json({ ok: true, lockedAt });
});

router.post("/:id/package/export", async (req, res) => {
  const { orgId } = (req as unknown as AuthedRequest).auth;
  const bid = await loadBidForOrg(req.params.id, orgId);
  if (!bid) {
    res.status(404).json({ error: "Bid not found" });
    return;
  }
  const db = getDb();
  const rows = await db
    .select()
    .from(bidScores)
    .where(and(eq(bidScores.bidId, req.params.id), eq(bidScores.orgId, orgId)))
    .orderBy(desc(bidScores.createdAt))
    .limit(1);
  if (!rows[0]?.humanReviewed) {
    res.status(403).json({ error: "Human review required before client-facing export" });
    return;
  }

  const format = String((req.body as { format?: string } | undefined)?.format ?? "PDF").toUpperCase();
  if (format !== "PDF" && format !== "DOCX") {
    res.status(400).json({ error: "Unsupported export format; use PDF or DOCX" });
    return;
  }

  const { packages } = await buildPackageBuilderProjection(orgId);
  const pkg = packages.find((p) => p.bidId === bid.id);
  if (!pkg) {
    res.status(404).json({ error: "Package not found for bid" });
    return;
  }

  const exportOptions = {
    bidName: bid.name,
    recipient: bid.recipient || pkg.recipient || "Client",
    projectType: bid.type,
    location: bid.location,
    sections: pkg.sections,
  };

  if (format === "DOCX") {
    const docx = await generatePackageDocx(exportOptions);
    const filename = packageDocxFilename(bid.name, bid.id);
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    );
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Length", String(docx.length));
    res.send(docx);
    return;
  }

  const pdf = await generatePackagePdf(exportOptions);
  const filename = packagePdfFilename(bid.name, bid.id);
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.setHeader("Content-Length", String(pdf.length));
  res.send(pdf);
});

router.post("/:id/outcome", async (req, res) => {
  const parsed = outcomeSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const { orgId } = (req as unknown as AuthedRequest).auth;
  const bid = await loadBidForOrg(req.params.id, orgId);
  if (!bid) {
    res.status(404).json({ error: "Bid not found" });
    return;
  }
  let autopsy;
  try {
    autopsy = await recordAutopsy(
      bid.id,
      orgId,
      {
        outcome: parsed.data.outcome,
        reasonCodes: parsed.data.reasonCodes,
        competitorNotes: parsed.data.competitorNotes ?? parsed.data.reason,
        trade: parsed.data.trade ?? bid.type,
        scoredSnapshotId: parsed.data.scoredSnapshotId,
      },
      bid.type,
    );
  } catch (e) {
    res.status(400).json({ error: e instanceof Error ? e.message : "Autopsy failed" });
    return;
  }
  await syncBidStatusFromOutcome(bid.id, parsed.data.outcome, parsed.data.reason);
  const db = getDb();
  const rows = await db.select().from(bids).where(eq(bids.id, bid.id)).limit(1);
  const tradeStats = await countOutcomesForTrade(orgId, autopsy.trade);
  res.json({ bid: rowToBid(rows[0]!), autopsy, tradeStats });
});

router.get("/:id/autopsy", async (req, res) => {
  const { orgId } = (req as unknown as AuthedRequest).auth;
  const bid = await loadBidForOrg(req.params.id, orgId);
  if (!bid) {
    res.status(404).json({ error: "Bid not found" });
    return;
  }
  const autopsy = await getAutopsyForBid(bid.id, orgId);
  const trade = autopsy?.trade || bid.type || "generic";
  const tradeStats = await countOutcomesForTrade(orgId, trade);
  res.json({ autopsy, tradeStats });
});

router.patch("/:id/autopsy", async (req, res) => {
  const parsed = autopsyPatchSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const { orgId } = (req as unknown as AuthedRequest).auth;
  const bid = await loadBidForOrg(req.params.id, orgId);
  if (!bid) {
    res.status(404).json({ error: "Bid not found" });
    return;
  }
  const existing = await getAutopsyForBid(bid.id, orgId);
  const outcome = parsed.data.outcome ?? (existing?.outcome as "won" | "lost" | "no-bid" | undefined);
  if (!outcome) {
    res.status(400).json({ error: "outcome required when no autopsy exists yet" });
    return;
  }
  let autopsy;
  try {
    autopsy = await recordAutopsy(
      bid.id,
      orgId,
      {
        outcome,
        reasonCodes: parsed.data.reasonCodes ?? (existing?.reasonCodes as typeof AUTOPSY_REASON_CODES[number][] | undefined),
        competitorNotes:
          parsed.data.competitorNotes === null
            ? undefined
            : parsed.data.competitorNotes ?? existing?.competitorNotes,
        trade: parsed.data.trade ?? existing?.trade ?? bid.type,
        scoredSnapshotId:
          parsed.data.scoredSnapshotId === null
            ? undefined
            : parsed.data.scoredSnapshotId ?? existing?.scoredSnapshotId,
      },
      bid.type,
    );
  } catch (e) {
    res.status(400).json({ error: e instanceof Error ? e.message : "Autopsy failed" });
    return;
  }
  await syncBidStatusFromOutcome(bid.id, outcome);
  const tradeStats = await countOutcomesForTrade(orgId, autopsy.trade);
  res.json({ autopsy, tradeStats });
});

router.get("/:id/learning-status", async (req, res) => {
  const { orgId } = (req as unknown as AuthedRequest).auth;
  const bid = await loadBidForOrg(req.params.id, orgId);
  if (!bid) {
    res.status(404).json({ error: "Bid not found" });
    return;
  }
  const trade = (typeof req.query.trade === "string" && req.query.trade) || bid.type || "generic";
  const tradeStats = await countOutcomesForTrade(orgId, trade);
  const db = getDb();
  const orgRows = await db.select().from(organizations).where(eq(organizations.id, orgId)).limit(1);
  const approvedLearningTrades = resolveApprovedLearningTrades(orgRows[0]?.profileJson);
  const flipApproved = canUseLearningMode(trade, approvedLearningTrades);
  res.json({
    tradeStats,
    learning: {
      flipApproved,
      approvedLearningTrades,
      canRequestLearning: tradeStats.learningEligible && flipApproved,
    },
  });
});

router.post("/:id/score/second-reviewer", async (req, res) => {
  const { orgId, userId, role, email } = (req as unknown as AuthedRequest).auth;
  if (!canConfirmSecondReviewer(role, email)) {
    res.status(403).json({ error: "Owner/admin confirmation required" });
    return;
  }
  const bid = await loadBidForOrg(req.params.id, orgId);
  if (!bid) {
    res.status(404).json({ error: "Bid not found" });
    return;
  }
  try {
    const scoreId =
      typeof (req.body as { scoreId?: string })?.scoreId === "string"
        ? (req.body as { scoreId: string }).scoreId
        : undefined;
    const result = await recordSecondReviewer({ bidId: bid.id, orgId, userId, scoreId });
    res.json({ ok: true, ...result });
  } catch (e) {
    res.status(404).json({ error: e instanceof Error ? e.message : "Second reviewer failed" });
  }
});

router.get("/:id/score/overrides", async (req, res) => {
  const { orgId } = (req as unknown as AuthedRequest).auth;
  const bid = await loadBidForOrg(req.params.id, orgId);
  if (!bid) {
    res.status(404).json({ error: "Bid not found" });
    return;
  }
  const journal = await listOverrideJournal(bid.id, orgId);
  res.json({ journal });
});

router.post("/:id/score/override", async (req, res) => {
  const parsed = overrideSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const { orgId, userId, role, email } = (req as unknown as AuthedRequest).auth;
  if (!canOverrideVerdict(role, email)) {
    res.status(403).json({ error: "Owner/admin override required" });
    return;
  }
  const bid = await loadBidForOrg(req.params.id, orgId);
  if (!bid) {
    res.status(404).json({ error: "Bid not found" });
    return;
  }
  const entry = await appendOverrideJournal({
    orgId,
    bidId: bid.id,
    scoreId: parsed.data.scoreId,
    gateId: parsed.data.gateId,
    fromVerdict: parsed.data.fromVerdict,
    toVerdict: parsed.data.toVerdict,
    overrideRole: role,
    reasonCode: parsed.data.reasonCode,
    reasonText: parsed.data.reasonText,
    userId,
    bidForHash: bid,
  });
  res.status(201).json({ entry });
});

router.get("/:id", async (req, res) => {
  const { orgId } = (req as unknown as AuthedRequest).auth;
  const db = getDb();
  const rows = await db
    .select()
    .from(bids)
    .where(and(eq(bids.id, req.params.id), eq(bids.orgId, orgId), isNull(bids.deletedAt)))
    .limit(1);
  if (!rows[0]) {
    res.status(404).json({ error: "Bid not found" });
    return;
  }
  res.json({ bid: rowToBid(rows[0]) });
});

router.post("/", async (req, res) => {
  const parsed = bidInputSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const { orgId } = (req as unknown as AuthedRequest).auth;
  const data = parsed.data;
  const ts = nowIso();
  const id = nextId("CCA-BID");
  const db = getDb();

  await db.insert(bids).values({
    id,
    orgId,
    name: data.name,
    recipient: data.recipient ?? "",
    type: data.type ?? "",
    location: data.location ?? "",
    amount: data.amount ?? 0,
    date: data.date ?? ts.slice(0, 10),
    status: data.status ?? "Draft",
    notes: data.notes,
    scopeSummary: data.scopeSummary,
    publicPrivate: data.publicPrivate,
    nextAction: data.nextAction,
    nextActionDate: data.nextActionDate,
    confidence: data.confidence,
    fit: data.fit,
    analysisStatus: "none",
    createdAt: ts,
    updatedAt: ts,
  });

  const rows = await db.select().from(bids).where(eq(bids.id, id)).limit(1);
  res.status(201).json({ bid: rowToBid(rows[0]!) });
});

router.patch("/:id", async (req, res) => {
  const parsed = bidInputSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const { orgId } = (req as unknown as AuthedRequest).auth;
  const db = getDb();
  const existing = await db
    .select()
    .from(bids)
    .where(and(eq(bids.id, req.params.id), eq(bids.orgId, orgId), isNull(bids.deletedAt)))
    .limit(1);
  if (!existing[0]) {
    res.status(404).json({ error: "Bid not found" });
    return;
  }

  const data = parsed.data;
  const ts = nowIso();
  await db
    .update(bids)
    .set({
      ...(data.name !== undefined && { name: data.name }),
      ...(data.recipient !== undefined && { recipient: data.recipient }),
      ...(data.type !== undefined && { type: data.type }),
      ...(data.location !== undefined && { location: data.location }),
      ...(data.amount !== undefined && { amount: data.amount }),
      ...(data.date !== undefined && { date: data.date }),
      ...(data.status !== undefined && { status: data.status }),
      ...(data.notes !== undefined && { notes: data.notes }),
      ...(data.scopeSummary !== undefined && { scopeSummary: data.scopeSummary }),
      ...(data.publicPrivate !== undefined && { publicPrivate: data.publicPrivate }),
      ...(data.nextAction !== undefined && { nextAction: data.nextAction }),
      ...(data.nextActionDate !== undefined && { nextActionDate: data.nextActionDate }),
      ...(data.confidence !== undefined && { confidence: data.confidence }),
      ...(data.fit !== undefined && { fit: data.fit }),
      updatedAt: ts,
    })
    .where(eq(bids.id, req.params.id));

  const rows = await db.select().from(bids).where(eq(bids.id, req.params.id)).limit(1);
  res.json({ bid: rowToBid(rows[0]!) });
});

router.delete("/:id", async (req, res) => {
  const { orgId } = (req as unknown as AuthedRequest).auth;
  const db = getDb();
  const existing = await db
    .select()
    .from(bids)
    .where(and(eq(bids.id, req.params.id), eq(bids.orgId, orgId), isNull(bids.deletedAt)))
    .limit(1);
  if (!existing[0]) {
    res.status(404).json({ error: "Bid not found" });
    return;
  }
  await db.update(bids).set({ deletedAt: nowIso(), updatedAt: nowIso() }).where(eq(bids.id, req.params.id));
  res.json({ ok: true });
});

export default router;
