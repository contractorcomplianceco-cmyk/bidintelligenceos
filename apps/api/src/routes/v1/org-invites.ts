import { Router } from "express";
import { and, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { getDb, withPgOrgScope } from "../../db/client.js";
import { orgInvites, organizationMembers, users } from "../../db/schema.js";
import { generateInviteToken, hashInviteToken } from "../../lib/invite-tokens.js";
import { nextId, nowIso } from "../../lib/ids.js";
import { canManageInvites, normalizeMemberRole } from "../../lib/rbac.js";
import { requireAuth, type AuthedRequest } from "../../middleware/auth.js";
import { orgScopeMiddleware } from "../../middleware/org-scope.js";

const router = Router();
router.use(requireAuth);

const createInviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(["owner", "admin", "member", "viewer"]).optional(),
});

const acceptInviteSchema = z.object({
  token: z.string().min(16),
});

function inviteExpiresAt(): string {
  return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
}

function isExpired(expiresAt: string): boolean {
  return new Date(expiresAt).getTime() < Date.now();
}

function publicInvite(row: typeof orgInvites.$inferSelect) {
  return {
    id: row.id,
    orgId: row.orgId,
    email: row.email,
    role: row.role,
    status: row.status,
    expiresAt: row.expiresAt,
    createdAt: row.createdAt,
    invitedByUserId: row.invitedByUserId,
  };
}

/** Accept invite — must be registered before /:id revoke route. */
router.post("/accept", async (req, res) => {
  const parsed = acceptInviteSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const { userId, email } = (req as AuthedRequest).auth;
  const tokenHash = hashInviteToken(parsed.data.token);
  const db = getDb();

  const rows = await db.select().from(orgInvites).where(eq(orgInvites.tokenHash, tokenHash)).limit(1);
  const invite = rows[0];
  if (!invite) {
    res.status(404).json({ error: "Invite not found or already used" });
    return;
  }
  if (invite.status !== "pending") {
    res.status(410).json({ error: `Invite is ${invite.status}` });
    return;
  }
  if (isExpired(invite.expiresAt)) {
    const ts = nowIso();
    await withPgOrgScope(invite.orgId, async () => {
      await getDb()
        .update(orgInvites)
        .set({ status: "expired", updatedAt: ts })
        .where(eq(orgInvites.id, invite.id));
    });
    res.status(410).json({ error: "Invite has expired" });
    return;
  }

  const ts = nowIso();
  const role = normalizeMemberRole(invite.role);

  await withPgOrgScope(invite.orgId, async () => {
    const scopedDb = getDb();
    const existing = await scopedDb
      .select()
      .from(organizationMembers)
      .where(and(eq(organizationMembers.orgId, invite.orgId), eq(organizationMembers.userId, userId)))
      .limit(1);

    if (!existing[0]) {
      await scopedDb.insert(organizationMembers).values({
        id: nextId("CCA-MEM"),
        orgId: invite.orgId,
        userId,
        role,
      });
    }

    await scopedDb
      .update(orgInvites)
      .set({
        status: "accepted",
        acceptedAt: ts,
        acceptedByUserId: userId,
        updatedAt: ts,
      })
      .where(eq(orgInvites.id, invite.id));
  });

  res.json({
    ok: true,
    orgId: invite.orgId,
    role,
    emailMismatch: invite.email.toLowerCase() !== email.toLowerCase(),
    message:
      invite.email.toLowerCase() !== email.toLowerCase()
        ? "Invite accepted. Clerk account email differs from invite email — membership granted."
        : "Invite accepted. You are now a member of the organization.",
  });
});

router.use(orgScopeMiddleware);

router.post("/", async (req, res) => {
  const auth = (req as AuthedRequest).auth;
  if (!canManageInvites(auth.role, auth.email)) {
    res.status(403).json({ error: "Only organization owners or admins can send invites" });
    return;
  }

  const parsed = createInviteSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const email = parsed.data.email.toLowerCase();
  const role = normalizeMemberRole(parsed.data.role ?? "member");
  const db = getDb();
  const ts = nowIso();

  const existingMemberRows = await db
    .select()
    .from(organizationMembers)
    .where(eq(organizationMembers.orgId, auth.orgId));
  if (existingMemberRows.length > 0) {
    const existingUsers = await db
      .select()
      .from(users)
      .where(inArray(users.id, existingMemberRows.map((m) => m.userId)));
    if (existingUsers.some((u) => u.email.toLowerCase() === email)) {
      res.status(409).json({ error: "User is already a member of this organization" });
      return;
    }
  }

  const pending = await db
    .select()
    .from(orgInvites)
    .where(and(eq(orgInvites.orgId, auth.orgId), eq(orgInvites.email, email), eq(orgInvites.status, "pending")))
    .limit(1);
  if (pending[0]) {
    res.status(409).json({ error: "A pending invite already exists for this email" });
    return;
  }

  const { token, tokenHash } = generateInviteToken();
  const id = nextId("CCA-INV");
  const expiresAt = inviteExpiresAt();

  await db.insert(orgInvites).values({
    id,
    orgId: auth.orgId,
    email,
    role,
    invitedByUserId: auth.userId,
    tokenHash,
    status: "pending",
    expiresAt,
    createdAt: ts,
    updatedAt: ts,
  });

  const appOrigin =
    process.env.APP_PUBLIC_URL?.trim() ||
    process.env.CORS_ORIGIN?.trim() ||
    "https://bidintelligence.cagteam.net";
  const acceptUrl = `${appOrigin.replace(/\/$/, "")}/settings?invite=${encodeURIComponent(token)}`;

  res.status(201).json({
    invite: publicInvite({
      id,
      orgId: auth.orgId,
      email,
      role,
      invitedByUserId: auth.userId,
      tokenHash,
      status: "pending",
      expiresAt,
      acceptedAt: null,
      acceptedByUserId: null,
      createdAt: ts,
      updatedAt: ts,
    }),
    acceptUrl,
    token,
  });
});

router.get("/", async (req, res) => {
  const auth = (req as AuthedRequest).auth;
  if (!canManageInvites(auth.role, auth.email)) {
    res.status(403).json({ error: "Only organization owners or admins can list invites" });
    return;
  }

  const db = getDb();
  const rows = await db
    .select()
    .from(orgInvites)
    .where(and(eq(orgInvites.orgId, auth.orgId), eq(orgInvites.status, "pending")));

  const invites = rows
    .map((row) => {
      if (isExpired(row.expiresAt)) return null;
      return publicInvite(row);
    })
    .filter(Boolean);

  res.json({ invites });
});

router.delete("/:id", async (req, res) => {
  const auth = (req as unknown as AuthedRequest).auth;
  if (!canManageInvites(auth.role, auth.email)) {
    res.status(403).json({ error: "Only organization owners or admins can revoke invites" });
    return;
  }

  const db = getDb();
  const rows = await db
    .select()
    .from(orgInvites)
    .where(and(eq(orgInvites.id, req.params.id), eq(orgInvites.orgId, auth.orgId)))
    .limit(1);
  const invite = rows[0];
  if (!invite) {
    res.status(404).json({ error: "Invite not found" });
    return;
  }
  if (invite.status !== "pending") {
    res.status(410).json({ error: `Invite is already ${invite.status}` });
    return;
  }

  const ts = nowIso();
  await db
    .update(orgInvites)
    .set({ status: "revoked", updatedAt: ts })
    .where(eq(orgInvites.id, invite.id));

  res.json({ ok: true, id: invite.id, status: "revoked" });
});

export default router;
