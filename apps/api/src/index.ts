/**
 * BidIntelligenceOS API server.
 *
 * Development: health endpoint only — the frontend is seeded locally in /core.
 * Production: also serves the built SPA from apps/web/dist (single-process deploy).
 */
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

const isProd = process.env.NODE_ENV === "production";
const PORT = Number(process.env.API_PORT ?? process.env.PORT ?? 5001);
const HOST = process.env.HOST ?? "0.0.0.0";
const corsOrigin = process.env.CORS_ORIGIN?.trim();

app.use(express.json());

if (corsOrigin) {
  app.use((_req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", corsOrigin);
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
  });
  app.options("*", (_req, res) => res.sendStatus(204));
}

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "bid-intelligence-api",
    mode: isProd ? "production" : "development",
    note: isProd
      ? "Serving built frontend and API from a single process."
      : "Frontend is fully self-contained today; add real routes here as the backend grows.",
  });
});

if (isProd) {
  const distPath = path.resolve(__dirname, "../../web/dist");
  app.use(express.static(distPath, { index: false }));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api/")) return next();
    // Missing static assets (e.g. /promo/promo-video.mp4) must 404 — not SPA HTML.
    if (/\.[a-z0-9]+$/i.test(req.path)) {
      return res.status(404).type("text/plain").send("Not found");
    }
    res.sendFile(path.join(distPath, "index.html"), (err) => {
      if (err) next(err);
    });
  });
}

app.listen(PORT, HOST, () => {
  const base = `http://${HOST === "0.0.0.0" ? "localhost" : HOST}:${PORT}`;
  console.log(`[api] BidIntelligenceOS listening on ${base}`);
  console.log(`[api] Health check: ${base}/api/health`);
  if (isProd) {
    console.log(`[api] Serving production build from apps/web/dist`);
  }
});
