/**
 * pursuitRoi — WOW W7 (Rose handoff).
 * Cold-start honesty: relative index heuristic compressed so even a perfect index stays < 0.6.
 */

import type { ConfidenceResult } from "@workspace/cca-core";

export type PursuitRoiRecommendation = "Pursue" | "Bid-Light" | "No-Bid";

export type PursuitRoiInputs = {
  result: ConfidenceResult;
  amount: number;
  pursuitHours?: number;
  pursuitCostDollars?: number;
  expectedMarginPct?: number;
  /** Only used in learning mode — calibrated from outcomes. */
  calibratedWinRate?: number;
  /** Fully loaded $/hr when converting pursuitHours. */
  hourlyRate?: number;
};

export type PursuitRoiResult = {
  recommendation: PursuitRoiRecommendation;
  pursuitCost: number;
  winLikelihood: number;
  winLikelihoodBasis: "relative-index-heuristic" | "calibrated-outcomes";
  expectedMargin: number;
  expectedValue: number;
  roiRatio: number;
  assumptions: string[];
};

const DEFAULT_HOURLY = 175;
const DEFAULT_MARGIN_PCT = 0.08;

/**
 * Compress pursuit index 0–100 → win likelihood in (0, 0.6) for startup mode.
 * Never implies near-certain win without calibrated outcomes.
 */
export function relativeIndexToWinLikelihood(totalScore: number): number {
  const x = Math.max(0, Math.min(100, totalScore)) / 100;
  // Smooth saturation: 0 → ~0.05, 50 → ~0.30, 100 → ~0.59
  return Math.round((0.05 + 0.54 * (1 - Math.exp(-2.2 * x))) * 1000) / 1000;
}

export function pursuitRoi(inputs: PursuitRoiInputs): PursuitRoiResult {
  const { result, amount } = inputs;
  const assumptions: string[] = [];

  let pursuitCost = inputs.pursuitCostDollars;
  if (pursuitCost == null) {
    const hours = inputs.pursuitHours ?? 40;
    const rate = inputs.hourlyRate ?? DEFAULT_HOURLY;
    pursuitCost = hours * rate;
    assumptions.push(
      inputs.pursuitHours == null
        ? `Defaulted pursuitHours=40 @ $${rate}/hr`
        : `Converted pursuitHours=${hours} @ $${rate}/hr`,
    );
  }

  const marginPct = inputs.expectedMarginPct ?? DEFAULT_MARGIN_PCT;
  if (inputs.expectedMarginPct == null) {
    assumptions.push(`Defaulted expectedMarginPct=${DEFAULT_MARGIN_PCT} (8%)`);
  }

  const expectedMargin = Math.round(amount * marginPct * 100) / 100;

  let winLikelihood: number;
  let winLikelihoodBasis: PursuitRoiResult["winLikelihoodBasis"];

  if (result.mode === "learning" && inputs.calibratedWinRate != null) {
    winLikelihood = Math.max(0, Math.min(1, inputs.calibratedWinRate));
    winLikelihoodBasis = "calibrated-outcomes";
    assumptions.push(`Used calibratedWinRate=${winLikelihood}`);
  } else {
    winLikelihood = relativeIndexToWinLikelihood(result.totalScore);
    winLikelihoodBasis = "relative-index-heuristic";
    assumptions.push(
      "Startup cold-start: winLikelihood is a relative-index heuristic compressed <0.6 — not a calibrated win rate",
    );
    if (result.mode === "learning" && inputs.calibratedWinRate == null) {
      assumptions.push("Learning mode but no calibratedWinRate provided — fell back to heuristic");
    }
  }

  // Cap check for honesty
  if (winLikelihoodBasis === "relative-index-heuristic" && winLikelihood >= 0.6) {
    winLikelihood = 0.599;
    assumptions.push("Hard-clamped winLikelihood to <0.6 (cold-start honesty)");
  }

  const expectedValue = Math.round(winLikelihood * expectedMargin * 100) / 100;
  const roiRatio =
    pursuitCost > 0 ? Math.round((expectedValue / pursuitCost) * 1000) / 1000 : 0;

  let recommendation: PursuitRoiRecommendation;
  if (result.gatesOutcome?.hardKill || result.verdict === "No-Go") {
    recommendation = "No-Bid";
    assumptions.push("Hard-gate No-Go / No-Go verdict → No-Bid");
  } else if (expectedValue < 0 || expectedValue < pursuitCost * 0.5) {
    recommendation = "No-Bid";
    assumptions.push("Negative or weak EV vs pursuit cost → No-Bid");
  } else if (result.verdict === "Strong Go" && roiRatio >= 1.5) {
    recommendation = "Pursue";
  } else if (roiRatio >= 0.8 || result.verdict === "Conditional Go") {
    recommendation = "Bid-Light";
  } else {
    recommendation = "No-Bid";
  }

  return {
    recommendation,
    pursuitCost,
    winLikelihood,
    winLikelihoodBasis,
    expectedMargin,
    expectedValue,
    roiRatio,
    assumptions,
  };
}
