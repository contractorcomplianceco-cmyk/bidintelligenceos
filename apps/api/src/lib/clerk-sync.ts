import { clerkClient, getAuth } from "@clerk/express";
import type { Request } from "express";
import { and, eq } from "drizzle-orm";
import { getDb, withPgOrgScope } from "../db/client.js";
import { orgInvites, organizationMembers, organizations, users } from "../db/schema.js";
import type { AuthPayload } from "./auth.js";
import { isClerkAuthEnabled, mapClerkRole } from "./clerk-config.js";
import { nextId, nowIso } from "./ids.js";
import { normalizeMemberRole } from "./rbac.js";

const CLERK_PASSWORD_PLACEHOLDER = "!clerk-sso!";

async function acceptPendingInviteForEmail(userId: string, email: string): Promise<string | null> {
  const db = getDb();
  const pending = await db
    .select()
    .from(orgInvites)
    .where(and(eq(orgInvites.email, email.toLowerCase()), eq(orgInvites.status, "pending")))
    .limit(1);
  const invite = pending[0];
  if (!invite) return null;
  if (new Date(invite.expiresAt).getTime() < Date.now()) return null;

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
      .set({ status: "accepted", acceptedAt: ts, acceptedByUserId: userId, updatedAt: ts })
      .where(eq(orgInvites.id, invite.id));
  });
  return invite.orgId;
}

export async function resolveClerkAuthPayload(req: Request): Promise<AuthPayload | null> {
  if (!isClerkAuthEnabled()) return null;

  const { userId, orgId: clerkOrgId } = getAuth(req);
  if (!userId) return null;

  const clerkUser = await clerkClient.users.getUser(userId);
  const email =
    clerkUser.primaryEmailAddress?.emailAddress?.toLowerCase() ??
    clerkUser.emailAddresses?.[0]?.emailAddress?.toLowerCase();
  if (!email) return null;

  const name =
    [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ").trim() ||
    clerkUser.username ||
    email.split("@")[0] ||
    "CCA User";

  const db = getDb();
  const ts = nowIso();

  const existingUser = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!existingUser[0]) {
    await db.insert(users).values({
      id: userId,
      email,
      passwordHash: CLERK_PASSWORD_PLACEHOLDER,
      name,
      createdAt: ts,
    });
  }

  let memberships = await db
    .select()
    .from(organizationMembers)
    .where(eq(organizationMembers.userId, userId))
    .limit(1);

  if (!memberships[0]) {
    const invitedOrgId = await acceptPendingInviteForEmail(userId, email);
    if (invitedOrgId) {
      memberships = await db
        .select()
        .from(organizationMembers)
        .where(eq(organizationMembers.userId, userId))
        .limit(1);
    }
  }

  let orgId = memberships[0]?.orgId;
  if (!orgId) {
    const newOrgId = clerkOrgId ?? nextId("CCA-ORG");
    orgId = newOrgId;
    const orgName = clerkOrgId ? `${name}'s Organization` : `${name}'s Company`;
    const orgRows = await db.select().from(organizations).where(eq(organizations.id, orgId)).limit(1);
    if (!orgRows[0]) {
      await db.insert(organizations).values({
        id: orgId,
        name: orgName,
        vertical: "general-contractor",
        profileJson: "{}",
        createdAt: ts,
        updatedAt: ts,
      });
    }
    const initialRole = mapClerkRole(email);
    await withPgOrgScope(orgId, async () => {
      await getDb().insert(organizationMembers).values({
        id: nextId("CCA-MEM"),
        orgId,
        userId,
        role: initialRole,
      });
    });
    memberships = await db
      .select()
      .from(organizationMembers)
      .where(and(eq(organizationMembers.userId, userId), eq(organizationMembers.orgId, orgId)))
      .limit(1);
  }

  const role = memberships[0]?.role ?? mapClerkRole(email);

  return { userId, orgId: orgId!, email, role };
}
