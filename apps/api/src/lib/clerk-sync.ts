import { clerkClient, getAuth } from "@clerk/express";
import type { Request } from "express";
import { eq } from "drizzle-orm";
import { getDb, withPgOrgScope } from "../db/client.js";
import { organizationMembers, organizations, users } from "../db/schema.js";
import type { AuthPayload } from "./auth.js";
import { isClerkAuthEnabled, mapClerkRole } from "./clerk-config.js";
import { nextId, nowIso } from "./ids.js";

const CLERK_PASSWORD_PLACEHOLDER = "!clerk-sso!";

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

  const role = mapClerkRole(email);
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

  const memberships = await db
    .select()
    .from(organizationMembers)
    .where(eq(organizationMembers.userId, userId))
    .limit(1);

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
    await withPgOrgScope(orgId, async () => {
      await getDb().insert(organizationMembers).values({
        id: nextId("CCA-MEM"),
        orgId,
        userId,
        role,
      });
    });
  }

  return { userId, orgId, email, role };
}
