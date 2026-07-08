import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { computeBidScore, serializePublicBidScore } from "@workspace/cca-core";

describe("serializePublicBidScore", () => {
  it("exposes category points without forbidden engine keys", () => {
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
    const result = computeBidScore({ amount: 500_000, confidence: 70, fit: 75 }, compliance);
    const publicScore = serializePublicBidScore(result, { id: "CCA-SCORE-1", bidId: "CCA-BID-1" });
    const json = JSON.stringify(publicScore);

    assert.equal(publicScore.totalScore, result.totalScore);
    assert.ok(publicScore.categories.length >= 10);
    assert.equal(json.includes("multiplier"), false);
    assert.equal(json.includes("targetMargin"), false);
  });
});
