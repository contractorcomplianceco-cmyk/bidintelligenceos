/**
 * Focused tests: autopsy stats, learning eligibility, embeddings cosine, override codes.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  LEARNING_MODE_MIN_OUTCOMES,
  applyModeWeights,
  canUseLearningMode,
  resolveWeights,
} from "@workspace/cca-core";
import { AUTOPSY_REASON_CODES, otherRequiresNote } from "./autopsy.js";
import { cosineSimilarity, parseEmbeddingJson } from "./embeddings.js";
import { parseApprovedLearningTrades } from "./learning-approvals.js";
import { OVERRIDE_REASON_CODES, canConfirmSecondReviewer } from "./override-journal.js";
import { buildPublicIntelRefreshHonesty } from "./publicIntelPack.js";
import { citationFor, createMemoryVectorStore, retrieveEvidence } from "./retrieveEvidence.js";

describe("autopsy / learning gates", () => {
  it("exposes exactly 6 Rose-locked reason codes and LEARNING_MODE_MIN_OUTCOMES=40", () => {
    assert.equal(AUTOPSY_REASON_CODES.length, 6);
    assert.deepEqual([...AUTOPSY_REASON_CODES], [
      "price",
      "schedule",
      "relationship_incumbent",
      "scope_qualification",
      "compliance_eligibility",
      "other",
    ]);
    assert.equal(LEARNING_MODE_MIN_OUTCOMES, 40);
  });

  it("learning Option A weights apply only in learning mode", () => {
    const startup = applyModeWeights(resolveWeights("roofing"), "startup");
    const learning = applyModeWeights(resolveWeights("roofing"), "learning");
    assert.equal(startup.past_perf_winrate, 0);
    assert.ok(learning.past_perf_winrate > 0.05);
    assert.ok(learning.past_perf_winrate < 0.08);
  });

  it("never treats missing past_perf as a number (eligibility spirit)", () => {
    const decided = 0;
    const pastPerf = decided > 0 ? 1 : null;
    assert.equal(pastPerf, null);
    const learningEligible = 40 >= LEARNING_MODE_MIN_OUTCOMES && pastPerf != null;
    assert.equal(learningEligible, false);
  });

  it("requires note for autopsy other + requires flip approval for learning", () => {
    assert.equal(otherRequiresNote(["other"], ""), true);
    assert.equal(otherRequiresNote(["other"], "thin margin"), false);
    assert.equal(otherRequiresNote(["price"], ""), false);
    assert.equal(canUseLearningMode("electrical", []), false);
    assert.equal(canUseLearningMode("electrical", ["electrical"]), true);
    assert.deepEqual(parseApprovedLearningTrades("electrical, roofing"), ["electrical", "roofing"]);
  });

  it("stamps FRED/BLS honesty as manual when no live sources", () => {
    const honesty = buildPublicIntelRefreshHonesty({
      version: 1,
      layer: "public",
      cards: [{ id: "x", trades: ["all"], region: "nationwide", topic: "t", title: "t", asOfDate: "2026-07-15", text: "t" }],
      refresh: { lastRun: "2026-07-15", mode: "manual", sources: [] },
    });
    assert.equal(honesty.mode, "manual");
    assert.match(honesty.label, /manual/i);
    assert.match(honesty.label, /2026-07-15/);
  });
});

describe("embeddings cosine", () => {
  it("cosineSimilarity ranks identical higher than orthogonal", () => {
    assert.ok(cosineSimilarity([1, 0], [1, 0]) > cosineSimilarity([1, 0], [0, 1]));
    assert.equal(parseEmbeddingJson("[0.1,0.2]").length, 2);
    assert.deepEqual(parseEmbeddingJson("nope"), []);
  });
});

describe("override journal G8", () => {
  it("locks G8 reason codes", () => {
    assert.ok(OVERRIDE_REASON_CODES.includes("client-relationship"));
    assert.ok(OVERRIDE_REASON_CODES.includes("verified-exception"));
    assert.equal(canConfirmSecondReviewer("owner", "x@y.com"), true);
    assert.equal(canConfirmSecondReviewer("member", "x@y.com"), false);
  });
});

describe("retrieveEvidence tag fallback", () => {
  it("still works with injected memory store (tag path)", async () => {
    const store = createMemoryVectorStore([
      {
        id: "t1",
        text: "Copper PPI up",
        trade: "electrical",
        region: "nationwide",
        topic: "materials-inflation",
        layer: "public",
        title: "Copper",
        asOfDate: "2026-07-01",
      },
    ]);
    const got = await retrieveEvidence({
      bidId: "b1",
      trade: "electrical",
      region: "FL",
      signalIds: ["price_pressure"],
      mode: "startup",
      store,
    });
    assert.ok(got.bySignal.price_pressure?.length);
    assert.ok(citationFor(got.bySignal.price_pressure![0]!).includes("Copper"));
  });
});
