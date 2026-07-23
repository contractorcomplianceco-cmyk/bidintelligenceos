import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { ClerkNotProvisionedError } from "../lib/clerk-sync.js";

/**
 * Mirrors requireAuth's ClerkNotProvisionedError branch without loading full DB/Clerk stack.
 */
function handleAuthError(error: unknown, res: { statusCode: number; body: unknown }) {
  if (error instanceof ClerkNotProvisionedError) {
    res.statusCode = error.status;
    res.body = {
      error: "Forbidden",
      reason: error.reason,
      message: error.message,
    };
    return;
  }
  throw error;
}

describe("requireAuth Clerk fail-closed response", () => {
  it("unmapped Clerk identity → 403 not_provisioned", () => {
    const res = { statusCode: 0, body: null as unknown };
    handleAuthError(new ClerkNotProvisionedError(), res);
    assert.equal(res.statusCode, 403);
    const body = res.body as { error: string; reason: string };
    assert.equal(body.error, "Forbidden");
    assert.equal(body.reason, "not_provisioned");
  });
});
