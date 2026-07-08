import { config as loadEnv } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cookieParser from "cookie-parser";
import { clerkMiddleware } from "@clerk/express";
import { dbHealth, getDb } from "./db/client.js";
import { isClerkAuthEnabled } from "./lib/clerk-config.js";
import v1Routes from "./routes/v1/index.js";

const __dirnameBootstrap = path.dirname(fileURLToPath(import.meta.url));
loadEnv({ path: path.resolve(__dirnameBootstrap, "../../../.env") });

/**
 * BidIntelligenceOS API server.
 */
const app = express();

const isProd = process.env.NODE_ENV === "production";
const PORT = Number(process.env.API_PORT ?? process.env.PORT ?? 5001);
const HOST = process.env.HOST ?? "0.0.0.0";
const corsOrigin = process.env.CORS_ORIGIN?.trim();

app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());

if (isClerkAuthEnabled()) {
  app.use(
    clerkMiddleware({
      secretKey: process.env.CLERK_SECRET_KEY,
      publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
    }),
  );
}

getDb();

if (corsOrigin) {
  app.use((_req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", corsOrigin);
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    next();
  });
  app.options("*", (_req, res) => res.sendStatus(204));
}

app.get("/api/health", (_req, res) => {
  const db = dbHealth();
  res.status(db.ok ? 200 : 503).json({
    status: db.ok ? "ok" : "degraded",
    service: "bid-intelligence-api",
    mode: isProd ? "production" : "development",
    auth: isClerkAuthEnabled() ? "clerk" : "legacy",
    storage: process.env.BIOS_S3_BUCKET ? "s3" : "local",
    auditEngine: Boolean(process.env.AUDIT_ENGINE_API_URL?.trim() || process.env.CCA_AUDIT_API_URL?.trim()),
    database: db,
    note: isProd
      ? "Serving built frontend and API from a single process."
      : "API with SQLite persistence; set SESSION_SECRET in production.",
  });
});

app.use("/api/v1", v1Routes);

if (isProd) {
  const distPath = path.resolve(__dirnameBootstrap, "../../web/dist");
  app.use(express.static(distPath, { index: false }));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api/")) return next();
    if (/\.[a-z0-9]+$/i.test(req.path)) {
      return res.status(404).type("text/plain").send("Not found");
    }
    res.sendFile(path.join(distPath, "index.html"), (err) => {
      if (err) next(err);
    });
  });
}

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("[api] error", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, HOST, () => {
  const base = `http://${HOST === "0.0.0.0" ? "localhost" : HOST}:${PORT}`;
  console.log(`[api] BidIntelligenceOS listening on ${base}`);
  console.log(`[api] Health check: ${base}/api/health`);
  if (isProd) {
    console.log(`[api] Serving production build from apps/web/dist`);
  }
});
