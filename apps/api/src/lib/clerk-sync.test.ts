import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  ClerkNotProvisionedError,
  provisionClerkIdentityWithDeps,
  type ClerkIdentity,
  type ClerkProvisionDeps,
} from "./clerk-sync.js";
import { mapClerkRole } from "./clerk-config.js";

const here = dirname(fileURLToPath(import.meta.url));

const stranger: ClerkIdentity = {
  clerkUserId: "user_stranger_unmapped",
  email: "stranger@example.com",
  name: "Stranger",
};

describe("fail-closed Clerk provisioning (Rose invitation-only)", () => {
  it("unmapped Clerk identity → not_provisioned and creates zero orgs/memberships", async () => {
    let orgCreates = 0;
    let membershipCreates = 0;
    let ensureUserCalls = 0;

    const deps: ClerkProvisionDeps = {
      findMembership: async () => null,
      ensureUser: async () => {
        ensureUserCalls += 1;
      },
      acceptPendingInvite: async () => {
        // Fail-closed path must not create org/membership when invite is absent.
        return null;
      },
    };

    const result = await provisionClerkIdentityWithDeps(stranger, deps);

    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.reason, "not_provisioned");
    assert.equal(orgCreates, 0);
    assert.equal(membershipCreates, 0);
    assert.equal(ensureUserCalls, 0, "unmapped identity must not ensure/create a user row");
  });

  it("valid pending invite joins only the invited organization with invite role", async () => {
    const invitedOrg = "CCA-ORG-INVITED-ONLY";
    let acceptedFor: string | null = null;
    let ensureUserCalls = 0;

    const deps: ClerkProvisionDeps = {
      findMembership: async () => null,
      ensureUser: async () => {
        ensureUserCalls += 1;
      },
      acceptPendingInvite: async (identity) => {
        acceptedFor = identity.email;
        return { orgId: invitedOrg, role: "member" };
      },
    };

    const result = await provisionClerkIdentityWithDeps(
      { clerkUserId: "user_invited", email: "invited@contractor.com", name: "Invited" },
      deps,
    );

    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.equal(result.payload.orgId, invitedOrg);
    assert.equal(result.payload.role, "member");
    assert.equal(result.payload.userId, "user_invited");
    assert.equal(acceptedFor, "invited@contractor.com");
    // ensureUser is only for existing-membership path; invite path creates user inside acceptPendingInvite
    assert.equal(ensureUserCalls, 0);
  });

  it("existing membership is allowed without creating a new org", async () => {
    let inviteCalls = 0;
    const deps: ClerkProvisionDeps = {
      findMembership: async () => ({ orgId: "CCA-ORG-EXISTING", role: "admin" }),
      ensureUser: async () => {},
      acceptPendingInvite: async () => {
        inviteCalls += 1;
        return { orgId: "SHOULD-NOT", role: "owner" };
      },
    };

    const result = await provisionClerkIdentityWithDeps(stranger, deps);
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.equal(result.payload.orgId, "CCA-ORG-EXISTING");
    assert.equal(result.payload.role, "admin");
    assert.equal(inviteCalls, 0);
  });

  it("random Clerk identity is never owner via ADMIN_EMAILS / mapClerkRole", async () => {
    process.env.ADMIN_EMAILS = "stranger@example.com,carmenaburoda@gmail.com";
    assert.equal(mapClerkRole("stranger@example.com"), "owner", "mapClerkRole still maps ADMIN_EMAILS");

    const deps: ClerkProvisionDeps = {
      findMembership: async () => null,
      ensureUser: async () => {},
      acceptPendingInvite: async () => null,
    };
    const result = await provisionClerkIdentityWithDeps(stranger, deps);
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.reason, "not_provisioned");
    // No payload → never granted owner (or any role)
  });

  it("ClerkNotProvisionedError carries 403 not_provisioned", () => {
    const err = new ClerkNotProvisionedError();
    assert.equal(err.status, 403);
    assert.equal(err.reason, "not_provisioned");
  });

  it("clerk-sync source no longer auto-creates organizations or mapClerkRole auth", () => {
    const src = readFileSync(join(here, "clerk-sync.ts"), "utf8");
    assert.equal(src.includes("insert(organizations"), false);
    assert.equal(src.includes("mapClerkRole"), false);
    assert.equal(src.includes("nextId(\"CCA-ORG\")"), false);
    assert.equal(src.includes("not_provisioned"), true);
    assert.equal(src.includes("acceptPendingInvite"), true);
  });
});
