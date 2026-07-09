import { Router } from "express";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "../../db/client.js";
import { organizations } from "../../db/schema.js";
import { nowIso } from "../../lib/ids.js";
import { requireAuth, type AuthedRequest } from "../../middleware/auth.js";
import { orgScopeMiddleware } from "../../middleware/org-scope.js";

const router = Router();
router.use(requireAuth);
router.use(orgScopeMiddleware);

const licenseEntrySchema = z.object({
  name: z.string(),
  id: z.string().optional(),
  status: z.string().optional(),
  expires: z.string().optional(),
});

/** Optional enterprise fields live in organizations.profile_json alongside company prefs. */
const orgProfileSchema = z
  .object({
    licenses: z.array(licenseEntrySchema).optional(),
    certifications: z.array(z.string()).optional(),
  })
  .passthrough();

const profileSchema = z.object({
  name: z.string().min(1).optional(),
  vertical: z.string().optional(),
  profile: orgProfileSchema.optional(),
});

router.get("/profile", async (req, res) => {
  const { orgId } = (req as AuthedRequest).auth;
  const db = getDb();
  const rows = await db.select().from(organizations).where(eq(organizations.id, orgId)).limit(1);
  const org = rows[0];
  if (!org) {
    res.status(404).json({ error: "Organization not found" });
    return;
  }
  res.json({
    org: {
      id: org.id,
      name: org.name,
      vertical: org.vertical,
      profile: JSON.parse(org.profileJson || "{}"),
    },
  });
});

router.patch("/profile", async (req, res) => {
  const parsed = profileSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const { orgId } = (req as AuthedRequest).auth;
  const db = getDb();
  const data = parsed.data;
  const ts = nowIso();

  const existing = await db.select().from(organizations).where(eq(organizations.id, orgId)).limit(1);
  if (!existing[0]) {
    res.status(404).json({ error: "Organization not found" });
    return;
  }

  const currentProfile = JSON.parse(existing[0].profileJson || "{}");
  const nextProfile = data.profile ? { ...currentProfile, ...data.profile } : currentProfile;

  await db
    .update(organizations)
    .set({
      ...(data.name !== undefined && { name: data.name }),
      ...(data.vertical !== undefined && { vertical: data.vertical }),
      ...(data.profile !== undefined && { profileJson: JSON.stringify(nextProfile) }),
      updatedAt: ts,
    })
    .where(eq(organizations.id, orgId));

  const rows = await db.select().from(organizations).where(eq(organizations.id, orgId)).limit(1);
  const org = rows[0]!;
  res.json({
    org: {
      id: org.id,
      name: org.name,
      vertical: org.vertical,
      profile: JSON.parse(org.profileJson || "{}"),
    },
  });
});

export default router;
