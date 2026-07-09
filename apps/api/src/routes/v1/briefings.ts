import { Router } from "express";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "../../db/client.js";
import { organizations } from "../../db/schema.js";
import { nextId, nowIso } from "../../lib/ids.js";
import { requireAuth, type AuthedRequest } from "../../middleware/auth.js";
import { orgScopeMiddleware } from "../../middleware/org-scope.js";

const router = Router();
router.use(requireAuth);
router.use(orgScopeMiddleware);

const highlightSchema = z.enum(["Critical", "High", "Medium", "Info"]);

const archiveEntrySchema = z.object({
  id: z.string(),
  date: z.string(),
  summary: z.string(),
  highlight: highlightSchema,
  archivedAt: z.string().optional(),
});

type OrgProfile = Record<string, unknown> & {
  briefingArchive?: z.infer<typeof archiveEntrySchema>[];
};

const archiveInputSchema = z.object({
  date: z.string().min(1),
  summary: z.string().min(1),
  highlight: highlightSchema,
});

const MAX_ARCHIVE_ENTRIES = 60;

function parseProfile(raw: string | null | undefined): OrgProfile {
  try {
    return JSON.parse(raw || "{}") as OrgProfile;
  } catch {
    return {};
  }
}

function sortArchive(entries: z.infer<typeof archiveEntrySchema>[]) {
  return [...entries].sort((a, b) => {
    const aTime = a.archivedAt ?? a.date;
    const bTime = b.archivedAt ?? b.date;
    return bTime.localeCompare(aTime);
  });
}

/** Org-scoped prior daily briefings stored in organizations.profile_json.briefingArchive. */
router.get("/archive", async (req, res) => {
  const { orgId } = (req as AuthedRequest).auth;
  const db = getDb();
  const rows = await db.select().from(organizations).where(eq(organizations.id, orgId)).limit(1);
  const org = rows[0];
  if (!org) {
    res.status(404).json({ error: "Organization not found" });
    return;
  }

  const profile = parseProfile(org.profileJson);
  const archive = sortArchive(profile.briefingArchive ?? []);
  res.json({ archive });
});

/** Append a briefing snapshot to the org archive (e.g. when regenerating today's brief). */
router.post("/archive", async (req, res) => {
  const parsed = archiveInputSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const { orgId } = (req as AuthedRequest).auth;
  const db = getDb();
  const rows = await db.select().from(organizations).where(eq(organizations.id, orgId)).limit(1);
  const org = rows[0];
  if (!org) {
    res.status(404).json({ error: "Organization not found" });
    return;
  }

  const profile = parseProfile(org.profileJson);
  const existing = profile.briefingArchive ?? [];
  const entry = {
    id: nextId("brief"),
    ...parsed.data,
    archivedAt: nowIso(),
  };

  const archive = sortArchive([entry, ...existing]).slice(0, MAX_ARCHIVE_ENTRIES);
  const nextProfile: OrgProfile = { ...profile, briefingArchive: archive };

  await db
    .update(organizations)
    .set({ profileJson: JSON.stringify(nextProfile), updatedAt: nowIso() })
    .where(eq(organizations.id, orgId));

  res.status(201).json({ entry, archive });
});

export default router;
