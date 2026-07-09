import { createHash, randomBytes } from "node:crypto";

/** Single-use accept token (raw) and SHA-256 hash for storage. */
export function generateInviteToken(): { token: string; tokenHash: string } {
  const token = randomBytes(32).toString("base64url");
  const tokenHash = hashInviteToken(token);
  return { token, tokenHash };
}

export function hashInviteToken(token: string): string {
  return createHash("sha256").update(token.trim()).digest("hex");
}
