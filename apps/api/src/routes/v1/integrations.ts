import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import {
  computeVideoConnectStats,
  fetchVideoConnectWalkthroughs,
  getVideoConnectStatus,
} from "../../lib/video-connect-fetch.js";
import {
  computeVoiceConnectStats,
  fetchVoiceConnectCaptures,
  getVoiceConnectStatus,
} from "../../lib/voice-connect-fetch.js";

const router = Router();
router.use(requireAuth);

router.get("/voice-connect/status", async (_req, res) => {
  const status = await getVoiceConnectStatus();
  res.json(status);
});

router.get("/voice-connect/captures", async (_req, res) => {
  const status = await getVoiceConnectStatus();
  if (!status.available) {
    res.status(503).json({ error: status.message, status });
    return;
  }
  const captures = await fetchVoiceConnectCaptures();
  res.json({
    captures,
    stats: computeVoiceConnectStats(captures),
    status,
  });
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
