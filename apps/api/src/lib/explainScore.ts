/**
 * explainScore — WOW W1 + W2 (Rose handoff).
 * Rules-first; optional llmRewrite may ONLY reword rationale — never numbers/verdict.
 */

import type { ConfidenceResult, SignalInputs, SignalKey } from "@workspace/cca-core";
import { getTradeBands, goodness, INVERTED_SIGNALS } from "@workspace/cca-core";

export type EvidenceBySignal = Record<string, { citation?: string }[]>;

export type SensitivityLever = {
  signal: SignalKey;
  action: string;
  from: number;
  to: number;
  projectedGain: number;
  projectedScore: number;
  flipsBand: boolean;
};

export type ScoreExplanation = {
  headline: string;
  rationale: string;
  honestyLabel: string;
  totalScore: number;
  verdict: string;
  topPositive: { key: string; label: string; contribution: number; citation?: string }[];
  topNegative: { key: string; label: string; contribution: number; citation?: string }[];
  levers: SensitivityLever[];
};

export type ExplainScoreParams = {
  result: ConfidenceResult;
  inputs?: SignalInputs;
  evidenceBySignal?: EvidenceBySignal;
  /** Optional rewriter — MUST only change rationale prose. */
  llmRewrite?: (rationale: string) => string | Promise<string>;
};

const LEVER_TARGETS: Partial<Record<SignalKey, { to: number; action: string }>> = {
  escalation_protection: { to: 0.95, action: "Lock materials via PO / fixed quote" },
  scope_clarity: { to: 0.95, action: "Obtain complete drawings / one-line / gear schedule" },
  capacity_fit: { to: 0.9, action: "Confirm crew / bonding / equipment capacity" },
  schedule_risk: { to: 0.2, action: "Pre-order long-lead gear / extend schedule buffer" },
  competitive_intensity: { to: 0.25, action: "Improve competitive positioning / selectivity" },
  pursuit_cost_ratio: { to: 0.2, action: "Reduce pursuit effort or raise opportunity value" },
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function projectScore(
  result: ConfidenceResult,
  signal: SignalKey,
  newRaw: number,
): number {
  const weights = result._internal?.weights;
  const raws = result._internal?.rawSignals;
  if (!weights || !raws) return result.totalScore;

  let weighted = 0;
  for (const [key, w] of Object.entries(weights) as [SignalKey, number][]) {
    if (w <= 0) continue;
    const raw = key === signal ? clamp(newRaw, 0, 1) : raws[key];
    weighted += w * goodness(key, raw);
  }
  return Math.round(weighted * 1000) / 10;
}

/**
 * Rules-first explanation. llmRewrite cannot change numbers or verdict
 * (enforced by returning a frozen numeric payload and only swapping rationale).
 */
export async function explainScore(params: ExplainScoreParams): Promise<ScoreExplanation> {
  const { result, evidenceBySignal } = params;
  const drivers = [...(result.drivers ?? [])].sort((a, b) => b.contribution - a.contribution);
  const mid = drivers.length ? drivers.reduce((s, d) => s + d.contribution, 0) / drivers.length : 0;

  const topPositive = drivers
    .filter((d) => d.contribution >= mid)
    .slice(0, 3)
    .map((d) => ({
      key: d.key,
      label: d.label,
      contribution: d.contribution,
      citation: evidenceBySignal?.[d.key]?.[0]?.citation,
    }));

  const topNegative = [...drivers]
    .sort((a, b) => a.goodness - b.goodness)
    .slice(0, 3)
    .map((d) => ({
      key: d.key,
      label: d.label,
      contribution: d.contribution,
      citation: evidenceBySignal?.[d.key]?.[0]?.citation,
    }));

  const bands = result.bands ?? getTradeBands(result.trade);
  const levers: SensitivityLever[] = [];
  const raws = result._internal?.rawSignals;

  if (raws) {
    for (const [signal, cfg] of Object.entries(LEVER_TARGETS) as [SignalKey, { to: number; action: string }][]) {
      const from = raws[signal];
      if (from == null) continue;
      // Only propose improvements on risk signals that are currently bad, or goodness signals that are low
      const isRisk = INVERTED_SIGNALS.has(signal);
      if (isRisk && from <= cfg.to) continue;
      if (!isRisk && from >= cfg.to) continue;

      const projectedScore = projectScore(result, signal, cfg.to);
      const projectedGain = Math.round((projectedScore - result.totalScore) * 10) / 10;
      if (projectedGain <= 0.5) continue;

      const currentBand =
        result.totalScore >= bands.goMin
          ? "go"
          : result.totalScore >= bands.conditionalMin
            ? "cond"
            : "nogo";
      const projectedBand =
        projectedScore >= bands.goMin ? "go" : projectedScore >= bands.conditionalMin ? "cond" : "nogo";

      levers.push({
        signal,
        action: cfg.action,
        from,
        to: cfg.to,
        projectedGain,
        projectedScore,
        flipsBand: currentBand !== projectedBand,
      });
    }
    levers.sort((a, b) => b.projectedGain - a.projectedGain);
  }

  const honestyLabel = result.honestyLabel;
  let rationale =
    `${honestyLabel} Score ${result.totalScore}/100 → ${result.verdict} ` +
    `(${result.trade} band Go≥${bands.goMin}). ` +
    (result.evidenceCapApplied
      ? "Evidence-quality cap applied (LOW on a material-weight signal). "
      : "") +
    (result.gatesOutcome?.hardKill
      ? "Hard kill gate forced No-Go. "
      : result.gatesOutcome?.softHold || result.gatesOutcome?.dataHold
        ? "Soft/data hold demoted Strong Go if applicable. "
        : "") +
    `Top lift: ${topPositive[0]?.label ?? "n/a"}; top drag: ${topNegative[0]?.label ?? "n/a"}.`;

  if (params.llmRewrite) {
    const rewritten = await params.llmRewrite(rationale);
    // Enforce: only rationale text may change — numbers/verdict frozen below
    if (typeof rewritten === "string" && rewritten.trim()) {
      rationale = rewritten;
    }
  }

  return {
    headline: `${result.verdict} · ${result.totalScore}/100 · ${result.trade}`,
    rationale,
    honestyLabel,
    totalScore: result.totalScore,
    verdict: result.verdict,
    topPositive,
    topNegative,
    levers: levers.slice(0, 5),
  };
}
