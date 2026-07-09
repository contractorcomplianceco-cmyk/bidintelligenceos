import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";

const router = Router();
router.use(requireAuth);

router.get("/voice-connect/status", (_req, res) => {
  res.json({ available: false, phase: 5, message: "VoiceConnect integration planned" });
});

export default router;
