import type { Request } from "express";
import { readAuthFromRequest } from "./auth.js";
import { isClerkAuthEnabled } from "./clerk-config.js";
import { resolveClerkAuthPayload } from "./clerk-sync.js";

export async function resolveAuthFromRequest(req: Request) {
  if (isClerkAuthEnabled()) {
    const clerkAuth = await resolveClerkAuthPayload(req);
    if (clerkAuth) return clerkAuth;
  }
  return readAuthFromRequest(req);
}
