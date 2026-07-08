import { Router } from "express";
import { buildCommandCenterProjection } from "../../lib/command-center-projection.js";
import { requireAuth, type AuthedRequest } from "../../middleware/auth.js";
import { orgScopeMiddleware } from "../../middleware/org-scope.js";

const router = Router();
router.use(requireAuth);
router.use(orgScopeMiddleware);

/** Sanitized counts/events for CCA Command Center ingestion (no client PII). */
router.get("/projection", async (req, res) => {
  const { orgId } = (req as unknown as AuthedRequest).auth;
  const projection = await buildCommandCenterProjection(orgId);
  res.json(projection);
});

export default router;
