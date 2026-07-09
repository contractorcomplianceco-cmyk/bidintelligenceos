import { Router } from "express";
import authRoutes from "./auth.js";
import bidsRoutes from "./bids.js";
import orgRoutes from "./org.js";
import jobsRoutes from "./jobs.js";
import intelligenceRoutes from "./intelligence.js";
import researchRoutes from "./research.js";
import commandCenterRoutes from "./command-center.js";
import opsRoutes from "./ops.js";
import integrationsRoutes from "./integrations.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/bids", bidsRoutes);
router.use("/org", orgRoutes);
router.use("/jobs", jobsRoutes);
router.use("/intelligence", intelligenceRoutes);
router.use("/research", researchRoutes);
router.use("/command-center", commandCenterRoutes);
router.use("/ops", opsRoutes);
router.use("/integrations", integrationsRoutes);

export default router;
