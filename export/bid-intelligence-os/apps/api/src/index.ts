/**
 * BidIntelligenceOS API scaffold.
 *
 * The product is currently a 100% frontend prototype — all data is seeded
 * locally inside /core. This server exists so the project structure is
 * ready for future backend work (auth, persistence, integrations) without
 * a restructure. It intentionally serves only a health endpoint today.
 */
import express from "express";

const app = express();
app.use(express.json());

const PORT = Number(process.env.API_PORT ?? process.env.PORT ?? 5001);

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "bid-intelligence-api",
    mode: "scaffold",
    note: "Frontend is fully self-contained today; add real routes here as the backend grows.",
  });
});

app.listen(PORT, () => {
  console.log(`[api] BidIntelligenceOS API scaffold listening on http://localhost:${PORT}/api/health`);
});
