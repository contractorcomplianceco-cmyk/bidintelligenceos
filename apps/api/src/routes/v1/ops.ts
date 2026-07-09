import { Router } from "express";
import {
  buildCloseoutProjection,
  buildCostRoiProjection,
  buildLaborProjection,
  buildOpsAlertsProjection,
  buildPackageBuilderProjection,
  buildPermitsProjection,
  buildRiskProjection,
  buildSchedulingProjection,
  buildWeatherProjection,
} from "../../lib/ops-projection.js";
import { requireAuth, type AuthedRequest } from "../../middleware/auth.js";
import { orgScopeMiddleware } from "../../middleware/org-scope.js";

const router = Router();
router.use(requireAuth);
router.use(orgScopeMiddleware);

router.get("/scheduling", async (req, res) => {
  const { orgId } = (req as unknown as AuthedRequest).auth;
  const projection = await buildSchedulingProjection(orgId);
  res.json(projection);
});

router.get("/permits", async (req, res) => {
  const { orgId } = (req as unknown as AuthedRequest).auth;
  const projection = await buildPermitsProjection(orgId);
  res.json(projection);
});

router.get("/labor", async (req, res) => {
  const { orgId } = (req as unknown as AuthedRequest).auth;
  const projection = await buildLaborProjection(orgId);
  res.json(projection);
});

router.get("/weather", async (req, res) => {
  const { orgId } = (req as unknown as AuthedRequest).auth;
  const projection = await buildWeatherProjection(orgId);
  res.json(projection);
});

router.get("/closeout", async (req, res) => {
  const { orgId } = (req as unknown as AuthedRequest).auth;
  const projection = await buildCloseoutProjection(orgId);
  res.json(projection);
});

router.get("/cost-roi", async (req, res) => {
  const { orgId } = (req as unknown as AuthedRequest).auth;
  const projection = await buildCostRoiProjection(orgId);
  res.json(projection);
});

router.get("/risk", async (req, res) => {
  const { orgId } = (req as unknown as AuthedRequest).auth;
  const projection = await buildRiskProjection(orgId);
  res.json(projection);
});

router.get("/package-builder", async (req, res) => {
  const { orgId } = (req as unknown as AuthedRequest).auth;
  const projection = await buildPackageBuilderProjection(orgId);
  res.json(projection);
});

router.get("/alerts", async (req, res) => {
  const { orgId } = (req as unknown as AuthedRequest).auth;
  const projection = await buildOpsAlertsProjection(orgId);
  res.json(projection);
});

export default router;
