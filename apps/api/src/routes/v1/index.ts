import { Router } from "express";
import authRoutes from "./auth.js";
import bidsRoutes from "./bids.js";
import orgRoutes from "./org.js";
import jobsRoutes from "./jobs.js";
import intelligenceRoutes from "./intelligence.js";
import researchRoutes from "./research.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/bids", bidsRoutes);
router.use("/org", orgRoutes);
router.use("/jobs", jobsRoutes);
router.use("/intelligence", intelligenceRoutes);
router.use("/research", researchRoutes);

export default router;
