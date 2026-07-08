import { Router } from "express";
import { and, eq, isNull } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "../../db/client.js";
import { jobs } from "../../db/schema.js";
import { nextId, nowIso } from "../../lib/ids.js";
import { requireAuth, type AuthedRequest } from "../../middleware/auth.js";
import { orgScopeMiddleware } from "../../middleware/org-scope.js";

const router = Router();
router.use(requireAuth);
router.use(orgScopeMiddleware);

const jobSchema = z.object({
  bidId: z.string().optional(),
  name: z.string().min(1),
  client: z.string().optional(),
  location: z.string().optional(),
  vertical: z.string().optional(),
  contractValue: z.number().optional(),
  startDate: z.string().optional(),
  targetCompletion: z.string().optional(),
  projectManager: z.string().optional(),
  crewLead: z.string().optional(),
  currentPhase: z.string().optional(),
  phaseIndex: z.number().optional(),
  totalPhases: z.number().optional(),
  status: z.string().optional(),
  payload: z.record(z.unknown()).optional(),
});

function rowToJob(row: typeof jobs.$inferSelect) {
  return {
    id: row.id,
    bidId: row.bidId ?? undefined,
    name: row.name,
    client: row.client,
    location: row.location,
    vertical: row.vertical,
    contractValue: row.contractValue,
    startDate: row.startDate,
    targetCompletion: row.targetCompletion,
    projectManager: row.projectManager,
    crewLead: row.crewLead,
    currentPhase: row.currentPhase,
    phaseIndex: row.phaseIndex,
    totalPhases: row.totalPhases,
    status: row.status,
    payload: JSON.parse(row.payloadJson || "{}"),
  };
}

router.get("/", async (req, res) => {
  const { orgId } = (req as unknown as AuthedRequest).auth;
  const db = getDb();
  const rows = await db
    .select()
    .from(jobs)
    .where(and(eq(jobs.orgId, orgId), isNull(jobs.deletedAt)));
  res.json({ jobs: rows.map(rowToJob) });
});

router.get("/:id", async (req, res) => {
  const { orgId } = (req as unknown as AuthedRequest).auth;
  const db = getDb();
  const rows = await db
    .select()
    .from(jobs)
    .where(and(eq(jobs.id, req.params.id), eq(jobs.orgId, orgId), isNull(jobs.deletedAt)))
    .limit(1);
  if (!rows[0]) {
    res.status(404).json({ error: "Job not found" });
    return;
  }
  res.json({ job: rowToJob(rows[0]) });
});

router.post("/", async (req, res) => {
  const parsed = jobSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const { orgId } = (req as unknown as AuthedRequest).auth;
  const data = parsed.data;
  const ts = nowIso();
  const id = nextId("CCA-JOB");
  const db = getDb();

  await db.insert(jobs).values({
    id,
    orgId,
    bidId: data.bidId,
    name: data.name,
    client: data.client ?? "",
    location: data.location ?? "",
    vertical: data.vertical ?? "general-contractor",
    contractValue: data.contractValue ?? 0,
    startDate: data.startDate ?? ts.slice(0, 10),
    targetCompletion: data.targetCompletion ?? ts.slice(0, 10),
    projectManager: data.projectManager ?? "",
    crewLead: data.crewLead ?? "",
    currentPhase: data.currentPhase ?? "Mobilization",
    phaseIndex: data.phaseIndex ?? 0,
    totalPhases: data.totalPhases ?? 1,
    status: data.status ?? "Mobilizing",
    payloadJson: JSON.stringify(data.payload ?? {}),
    createdAt: ts,
    updatedAt: ts,
  });

  const rows = await db.select().from(jobs).where(eq(jobs.id, id)).limit(1);
  res.status(201).json({ job: rowToJob(rows[0]!) });
});

router.patch("/:id", async (req, res) => {
  const parsed = jobSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const { orgId } = (req as unknown as AuthedRequest).auth;
  const db = getDb();
  const existing = await db
    .select()
    .from(jobs)
    .where(and(eq(jobs.id, req.params.id), eq(jobs.orgId, orgId), isNull(jobs.deletedAt)))
    .limit(1);
  if (!existing[0]) {
    res.status(404).json({ error: "Job not found" });
    return;
  }

  const data = parsed.data;
  const ts = nowIso();
  const currentPayload = JSON.parse(existing[0].payloadJson || "{}");
  const nextPayload = data.payload ? { ...currentPayload, ...data.payload } : currentPayload;

  await db
    .update(jobs)
    .set({
      ...(data.bidId !== undefined && { bidId: data.bidId }),
      ...(data.name !== undefined && { name: data.name }),
      ...(data.client !== undefined && { client: data.client }),
      ...(data.location !== undefined && { location: data.location }),
      ...(data.vertical !== undefined && { vertical: data.vertical }),
      ...(data.contractValue !== undefined && { contractValue: data.contractValue }),
      ...(data.startDate !== undefined && { startDate: data.startDate }),
      ...(data.targetCompletion !== undefined && { targetCompletion: data.targetCompletion }),
      ...(data.projectManager !== undefined && { projectManager: data.projectManager }),
      ...(data.crewLead !== undefined && { crewLead: data.crewLead }),
      ...(data.currentPhase !== undefined && { currentPhase: data.currentPhase }),
      ...(data.phaseIndex !== undefined && { phaseIndex: data.phaseIndex }),
      ...(data.totalPhases !== undefined && { totalPhases: data.totalPhases }),
      ...(data.status !== undefined && { status: data.status }),
      ...(data.payload !== undefined && { payloadJson: JSON.stringify(nextPayload) }),
      updatedAt: ts,
    })
    .where(eq(jobs.id, req.params.id));

  const rows = await db.select().from(jobs).where(eq(jobs.id, req.params.id)).limit(1);
  res.json({ job: rowToJob(rows[0]!) });
});

export default router;
