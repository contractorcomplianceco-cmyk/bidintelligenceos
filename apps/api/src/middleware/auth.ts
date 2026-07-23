import type { Request, Response, NextFunction } from "express";
import type { AuthPayload } from "../lib/auth.js";
import { ClerkNotProvisionedError } from "../lib/clerk-sync.js";
import { resolveAuthFromRequest } from "../lib/resolve-auth.js";

export type AuthedRequest = Request & { auth: AuthPayload };

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  void (async () => {
    try {
      const auth = await resolveAuthFromRequest(req);
      if (!auth) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      (req as AuthedRequest).auth = auth;
      next();
    } catch (error) {
      if (error instanceof ClerkNotProvisionedError) {
        res.status(error.status).json({
          error: "Forbidden",
          reason: error.reason,
          message: error.message,
        });
        return;
      }
      next(error);
    }
  })();
}
