import { clerkClient, getAuth } from "@clerk/express";
import type { Request } from "express";
import { and, eq } from "drizzle-orm";
import { getDb, withPgOrgScope } from "../db/client.js";
import { orgInvites, organizationMembers, users } from "../db/schema.js";
import type { AuthPayload } from "./auth.js";
import { isClerkAuthEnabled } from "./clerk-config.js";
import { nextId, nowIso } from "./ids.js";
import { normalizeMemberRole } from "./rbac.js";

const CLERK_PASSWORD_PLACEHOLDER = "!clerk-sso!";

/** Thrown when a valid Clerk session exists but Bid has no invite/membership. */
export class ClerkNotProvisionedError extends Error {
  readonly status = 403;
  readonly reason = "not_provisioned" as const;

  constructor(
    message = "Bid Intelligence access requires an invitation. This identity is not provisioned.",
  ) {
    super(message);
    this.name = "ClerkNotProvisionedError";
  }
}

export type ClerkIdentity = {
  clerkUserId: string;
  email: string;
  name: string;
};

export type ClerkSyncResult =
  | { ok: true; payload: AuthPayload }
  | { ok: false; reason: "not_provisioned" };

export type ClerkProvisionDeps = {
  findMembership: (userId: string) => Promise<{ orgId: string; role: string } | null>;
  ensureUser: (identity: ClerkIdentity) => Promise<void>;
  acceptPendingInvite: (
    identity: ClerkIdentity,
  ) => Promise<{ orgId: string; role: string } | null>;
};

/**
 * Fail-closed Clerk → Bid authorization (Rose 2026-07-23).
 * - Existing membership → allow
 * - Valid pending org invite → join that org only (role from invite)
 * - Otherwise → not_provisioned (no org, membership, or role minted)
 * Never uses ADMIN_EMAILS for automatic customer organization authorization.
 */
export async function provisionClerkIdentityWithDeps(
  identity: ClerkIdentity,
  deps: ClerkProvisionDeps,
): Promise<ClerkSyncResult> {
  const email = identity.email.toLowerCase();
  const existing = await deps.findMembership(identity.clerkUserId);
  if (existing) {
    await deps.ensureUser(identity);
    return {
      ok: true,
      payload: {
        userId: identity.clerkUserId,
        orgId: existing.orgId,
        email,
        role: existing.role,
      },
    };
  }

  const invited = await deps.acceptPendingInvite(identity);
  if (!invited) {
    return { ok: false, reason: "not_provisioned" };
  }

  return {
    ok: true,
    payload: {
      userId: identity.clerkUserId,
      orgId: invited.orgId,
      email,
      role: invited.role,
    },
  };
}

async function ensureUserRow(identity: ClerkIdentity): Promise<void> {
  const db = getDb();
  const existingUser = await db.select().from(users).where(eq(users.id, identity.clerkUserId)).limit(1);
  if (existingUser[0]) return;
  await db.insert(users).values({
    id: identity.clerkUserId,
    email: identity.email.toLowerCase(),
    passwordHash: CLERK_PASSWORD_PLACEHOLDER,
    name: identity.name,
    createdAt: nowIso(),
  });
}

async function findMembership(userId: string): Promise<{ orgId: string; role: string } | null> {
  const rows = await getDb()
    .select()
    .from(organizationMembers)
    .where(eq(organizationMembers.userId, userId))
    .limit(1);
  const row = rows[0];
  return row ? { orgId: row.orgId, role: row.role } : null;
}

async function acceptPendingInviteForEmail(
  identity: ClerkIdentity,
): Promise<{ orgId: string; role: string } | null> {
  const db = getDb();
  const email = identity.email.toLowerCase();
  const pending = await db
    .select()
    .from(orgInvites)
    .where(and(eq(orgInvites.email, email), eq(orgInvites.status, "pending")))
    .limit(1);
  const invite = pending[0];
  if (!invite) return null;
  if (new Date(invite.expiresAt).getTime() < Date.now()) return null;

  const ts = nowIso();
  const role = normalizeMemberRole(invite.role);
  await ensureUserRow(identity);

  await withPgOrgScope(invite.orgId, async () => {
    const scopedDb = getDb();
    const existing = await scopedDb
      .select()
      .from(organizationMembers)
      .where(
        and(eq(organizationMembers.orgId, invite.orgId), eq(organizationMembers.userId, identity.clerkUserId)),
      )
      .limit(1);
    if (!existing[0]) {
      await scopedDb.insert(organizationMembers).values({
        id: nextId("CCA-MEM"),
        orgId: invite.orgId,
        userId: identity.clerkUserId,
        role,
      });
    }
    await scopedDb
      .update(orgInvites)
      .set({
        status: "accepted",
        acceptedAt: ts,
        acceptedByUserId: identity.clerkUserId,
        updatedAt: ts,
      })
      .where(eq(orgInvites.id, invite.id));
  });

  return { orgId: invite.orgId, role };
}

const defaultDeps: ClerkProvisionDeps = {
  findMembership,
  ensureUser: ensureUserRow,
  acceptPendingInvite: acceptPendingInviteForEmail,
};

export async function provisionClerkIdentity(identity: ClerkIdentity): Promise<ClerkSyncResult> {
  return provisionClerkIdentityWithDeps(identity, defaultDeps);
}

export async function resolveClerkAuthPayload(req: Request): Promise<AuthPayload | null> {
  if (!isClerkAuthEnabled()) return null;

  const { userId } = getAuth(req);
  if (!userId) return null;

  const clerkUser = await clerkClient.users.getUser(userId);
  const email =
    clerkUser.primaryEmailAddress?.emailAddress?.toLowerCase() ??
    clerkUser.emailAddresses?.[0]?.emailAddress?.toLowerCase();
  if (!email) {
    throw new ClerkNotProvisionedError("Clerk identity has no email; Bid access denied.");
  }

  const name =
    [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ").trim() ||
    clerkUser.username ||
    email.split("@")[0] ||
    "CCA User";

  const result = await provisionClerkIdentity({ clerkUserId: userId, email, name });
  if (!result.ok) {
    throw new ClerkNotProvisionedError();
  }
  return result.payload;
}
