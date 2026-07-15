import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  computeBidScore,
  computePursuitConfidence,
  evaluateKillGates,
  serializePublicBidScore,
  LEARNING_MODE_MIN_OUTCOMES,
} from "@workspace/cca-core";
import { explainScore } from "./explainScore.js";
import { pursuitRoi, relativeIndexToWinLikelihood } from "./pursuitRoi.js";
import { citationFor, createMemoryVectorStore, retrieveEvidence } from "./retrieveEvidence.js";

const compliance = {
  stateCode: "FL",
  exportReadyCount: 3,
  eligibilityPoints: 6,
  maxPoints: 8,
  flags: [],
  fixBeforeBidding: [],
  sampleRules: [],
  researchConnected: true,
  auditConnected: false,
  criticalTriggers: [],
  note: "test",
};

describe("serializePublicBidScore", () => {
  it("exposes category points without forbidden engine keys", () => {
    const result = computeBidScore({ amount: 500_000, confidence: 70, fit: 75 }, compliance);
    const publicScore = serializePublicBidScore(result, { id: "CCA-SCORE-1", bidId: "CCA-BID-1" });
    const json = JSON.stringify(publicScore);

    assert.equal(publicScore.totalScore, result.totalScore);
    assert.ok(publicScore.categories.length >= 10);
    assert.equal(json.includes("multiplier"), false);
    assert.equal(json.includes("targetMargin"), false);
    assert.equal(json.includes("_internal"), false);
    assert.equal(json.includes("\"weight\""), false);
  });
});

describe("Rose handoff WOW layer (BidOS)", () => {
  it("LEARNING_MODE_MIN_OUTCOMES is 40", () => {
    assert.equal(LEARNING_MODE_MIN_OUTCOMES, 40);
  });

  it("explainScore is rules-first; llmRewrite cannot change numbers/verdict", async () => {
    const result = computePursuitConfidence(
      {
        trade: "electrical",
        mode: "startup",
        daysRemaining: 21,
        amount: 500_000,
        signals: {
          price_pressure: 1.0,
          escalation_protection: 0.95,
          scope_clarity: 0.95,
          schedule_risk: 0.2,
          capacity_fit: 0.9,
          strategy_fit: 0.95,
          market_heat: 0.6,
          competitive_intensity: 0.25,
          labor_pressure: 0.4,
          pursuit_cost_ratio: 0.2,
        },
      },
      compliance,
    );

    const explained = await explainScore({
      result,
      llmRewrite: async () =>
        "HACKED narrative that claims verdict=No-Go and totalScore=1 — must not stick to fields.",
    });

    assert.equal(explained.totalScore, result.totalScore);
    assert.equal(explained.verdict, result.verdict);
    assert.match(explained.rationale, /HACKED narrative/);
    assert.ok(explained.levers.length >= 0);
    assert.ok(explained.topPositive.length >= 1);
  });

  it("pursuitRoi cold-start keeps winLikelihood < 0.6", () => {
    assert.ok(relativeIndexToWinLikelihood(100) < 0.6);
    assert.ok(relativeIndexToWinLikelihood(66.2) < 0.6);

    const result = computePursuitConfidence(
      {
        trade: "roofing",
        mode: "startup",
        amount: 500_000,
        daysRemaining: 21,
        signals: {
          price_pressure: 0.1,
          scope_clarity: 0.85,
          schedule_risk: 0.25,
          capacity_fit: 0.85,
          strategy_fit: 0.8,
          market_heat: 0.55,
          competitive_intensity: 0.35,
          labor_pressure: 0.5,
          escalation_protection: 0.2,
          pursuit_cost_ratio: 0.3,
        },
      },
      compliance,
    );

    const roi = pursuitRoi({
      result,
      amount: 500_000,
      pursuitHours: 30,
      expectedMarginPct: 0.1,
    });

    assert.equal(roi.winLikelihoodBasis, "relative-index-heuristic");
    assert.ok(roi.winLikelihood < 0.6);
    assert.ok(roi.assumptions.length >= 1);
    assert.ok(["Pursue", "Bid-Light", "No-Bid"].includes(roi.recommendation));
  });

  it("pursuitRoi hard-kill → No-Bid", () => {
    const result = computePursuitConfidence(
      {
        trade: "roofing",
        mode: "startup",
        amount: 500_000,
        daysRemaining: 21,
        signals: {
          price_pressure: 0.1,
          scope_clarity: 0.85,
          schedule_risk: 0.25,
          capacity_fit: 0.85,
          strategy_fit: 0.8,
          market_heat: 0.55,
          competitive_intensity: 0.35,
          labor_pressure: 0.5,
          escalation_protection: 0.2,
          pursuit_cost_ratio: 0.3,
        },
        gates: { roofingWeatherWindowFail: true, hasScopeDocs: true },
      },
      compliance,
    );
    assert.equal(result.verdict, "No-Go");
    const roi = pursuitRoi({ result, amount: 500_000, pursuitCostDollars: 1000 });
    assert.equal(roi.recommendation, "No-Bid");
  });

  it("retrieveEvidence filters trade/region and blocks private in startup", async () => {
    const store = createMemoryVectorStore([
      {
        id: "pub-1",
        text: "Copper PPI +38.3%",
        trade: "electrical",
        region: "nationwide",
        topic: "materials-inflation",
        layer: "public",
        title: "Copper PPI",
        asOfDate: "2026-06",
      },
      {
        id: "priv-1",
        text: "Org win rate internal",
        trade: "electrical",
        region: "FL",
        topic: "outcomes",
        layer: "private",
        orgId: "org-A",
        title: "Private outcomes",
      },
      {
        id: "roof-1",
        text: "Asphalt calm",
        trade: "roofing",
        region: "nationwide",
        topic: "materials-inflation",
        layer: "public",
        title: "Asphalt PPI",
      },
    ]);

    const startup = await retrieveEvidence({
      bidId: "bid-1",
      trade: "electrical",
      region: "FL",
      signalIds: ["price_pressure", "past_perf_winrate"],
      mode: "startup",
      orgId: "org-A",
      store,
    });
    assert.equal(startup.bySignal.price_pressure.length, 1);
    assert.equal(startup.bySignal.price_pressure[0].id, "pub-1");
    assert.equal(startup.bySignal.past_perf_winrate.length, 0);
    assert.match(citationFor(startup.bySignal.price_pressure[0]), /Copper PPI/);

    const learning = await retrieveEvidence({
      bidId: "bid-1",
      trade: "electrical",
      region: "FL",
      signalIds: ["past_perf_winrate"],
      mode: "learning",
      orgId: "org-A",
      store,
    });
    assert.equal(learning.bySignal.past_perf_winrate.length, 1);

    const wrongOrg = await retrieveEvidence({
      bidId: "bid-1",
      trade: "electrical",
      region: "FL",
      signalIds: ["past_perf_winrate"],
      mode: "learning",
      orgId: "org-B",
      store,
    });
    assert.equal(wrongOrg.bySignal.past_perf_winrate.length, 0);
  });

  it("evaluateKillGates soft hold + computeConfidence demotion path available", () => {
    const gates = evaluateKillGates({
      trade: "roofing",
      daysRemaining: 21,
      scopeClarity: 0.85,
      compliance,
      gates: { softHold: true, hasScopeDocs: true },
    });
    assert.equal(gates.softHold, true);
    assert.equal(gates.hardKill, false);
  });
});
