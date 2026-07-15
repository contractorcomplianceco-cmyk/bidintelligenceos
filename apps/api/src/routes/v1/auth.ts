import { Router } from "express";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb, withPgOrgScope, withPgUserScope } from "../../db/client.js";
import { users, organizations, organizationMembers } from "../../db/schema.js";
import { hashPassword, verifyPassword, clearAuthCookie, setAuthCookie } from "../../lib/auth.js";
import {
  isClerkAuthEnabled,
  isSmokeAllowlistedEmail,
  isSmokeLegacyLoginEnabled,
} from "../../lib/clerk-config.js";
import { nextId, nowIso } from "../../lib/ids.js";
import { requireAuth, type AuthedRequest } from "../../middleware/auth.js";

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
  orgName: z.string().min(1).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post("/register", async (req, res) => {
  if (isClerkAuthEnabled()) {
    res.status(400).json({ error: "Registration is managed by Clerk. Use Sign in." });
    return;
  }
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const { email, password, name, orgName } = parsed.data;
  const db = getDb();

  const existing = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);
  if (existing.length > 0) {
    res.status(409).json({ error: "Email already registered" });
    return;
  }

  const userId = nextId("CCA-USR");
  const orgId = nextId("CCA-ORG");
  const memberId = nextId("CCA-MEM");
  const ts = nowIso();
  const passwordHash = await hashPassword(password);

  await db.insert(users).values({
    id: userId,
    email: email.toLowerCase(),
    passwordHash,
    name,
    createdAt: ts,
  });

  await db.insert(organizations).values({
    id: orgId,
    name: orgName ?? `${name}'s Company`,
    vertical: "general-contractor",
    profileJson: "{}",
    createdAt: ts,
    updatedAt: ts,
  });

  await withPgOrgScope(orgId, async () => {
    await getDb().insert(organizationMembers).values({
      id: memberId,
      orgId,
      userId,
      role: "owner",
    });
  });

  setAuthCookie(res, { userId, orgId, email: email.toLowerCase(), role: "owner" });
  res.status(201).json({ user: { id: userId, email, name }, org: { id: orgId, name: orgName ?? `${name}'s Company` } });
});

router.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const { email, password } = parsed.data;
  const normalizedEmail = email.toLowerCase();

  if (isClerkAuthEnabled()) {
    const smokeOk = isSmokeLegacyLoginEnabled() && isSmokeAllowlistedEmail(normalizedEmail);
    if (!smokeOk) {
      res.status(400).json({ error: "Sign in with Clerk at /login." });
      return;
    }
  }

  const db = getDb();

  const rows = await db.select().from(users).where(eq(users.email, normalizedEmail)).limit(1);
  const user = rows[0];
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const memberships = await withPgUserScope(user.id, async () =>
    getDb()
      .select()
      .from(organizationMembers)
      .where(eq(organizationMembers.userId, user.id))
      .limit(1),
  );
  const membership = memberships[0];
  if (!membership) {
    res.status(403).json({ error: "No organization membership" });
    return;
  }

  setAuthCookie(res, {
    userId: user.id,
    orgId: membership.orgId,
    email: user.email,
    role: membership.role,
  });

  res.json({
    user: { id: user.id, email: user.email, name: user.name },
    org: { id: membership.orgId },
  });
});

router.post("/logout", (_req, res) => {
  clearAuthCookie(res);
  res.json({ ok: true });
});

router.get("/config", (_req, res) => {
  const clerk = isClerkAuthEnabled();
  const smokeLogin = clerk && isSmokeLegacyLoginEnabled();
  res.json({
    clerk,
    /** True when email/password form works (pure legacy, or Clerk + smoke overlay). */
    legacyLogin: !clerk || smokeLogin,
    /** True when Clerk is on and BIOS_SMOKE_PASSWORD enables allowlisted smoke login. */
    smokeLogin,
  });
});

router.get("/me", requireAuth, async (req, res) => {
  const auth = (req as unknown as AuthedRequest).auth;
  const db = getDb();
  const userRows = await db.select().from(users).where(eq(users.id, auth.userId)).limit(1);
  const orgRows = await db.select().from(organizations).where(eq(organizations.id, auth.orgId)).limit(1);
  const user = userRows[0];
  const org = orgRows[0];
  if (!user || !org) {
    res.status(404).json({ error: "User or org not found" });
    return;
  }
  res.json({
    user: { id: user.id, email: user.email, name: user.name, role: auth.role },
    org: {
      id: org.id,
      name: org.name,
      vertical: org.vertical,
      profile: JSON.parse(org.profileJson || "{}"),
    },
  });
});

export default router;
