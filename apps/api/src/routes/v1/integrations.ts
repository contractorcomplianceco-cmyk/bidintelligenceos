import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import {
  computeVideoConnectStats,
  fetchVideoConnectWalkthroughs,
  getVideoConnectStatus,
} from "../../lib/video-connect-fetch.js";

const router = Router();
router.use(requireAuth);

router.get("/voice-connect/status", (_req, res) => {
  res.json({ available: false, phase: 5, message: "VoiceConnect integration planned" });
});

router.get("/video-connect/status", async (_req, res) => {
  const status = await getVideoConnectStatus();
  res.json(status);
});

router.get("/video-connect/walkthroughs", async (_req, res) => {
  const status = await getVideoConnectStatus();
  if (!status.available) {
    res.status(503).json({ error: status.message, status });
    return;
  }
  const walkthroughs = await fetchVideoConnectWalkthroughs();
  res.json({
    walkthroughs,
    stats: computeVideoConnectStats(walkthroughs),
    status,
  });
});

export default router;
