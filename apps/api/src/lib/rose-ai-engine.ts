import { computeComplianceEligibility } from "./compliance-eligibility.js";
import { parseStateFromLocation } from "./state-parse.js";

export type ScopeRfi = { title: string; detail: string; severity: "high" | "medium" };
export type ScopeRisk = { label: string; level: "High" | "Medium" | "Low"; score: number; detail: string };

export type ScopeAnalysisPayload = {
  projectName: string;
  deliverables: string;
  timeline: string;
  complexityIndicator: { title: string; detail: string };
  rfis: ScopeRfi[];
  risks: ScopeRisk[];
  scopeItems: string[];
  roseVerdict: "green" | "yellow" | "red";
  roseNarrative: string;
  recommendedActions: string[];
  requiredForms: string[];
  engine: "rose-rules" | "openai";
  disclaimer: string;
};

type BidContext = {
  name: string;
  recipient: string;
  type: string;
  location: string;
  amount: number;
  date: string;
  scopeSummary?: string | null;
  publicPrivate?: string | null;
  documentCount?: number;
};

const COMPLEXITY_KEYWORDS = [
  { pattern: /night\s*shift|after.?hours|10\s*pm/i, label: "restricted operations window" },
  { pattern: /tsa|secure\s*facility|airport/i, label: "security-cleared site access" },
  { pattern: /rigging|crane|rooftop|rtu/i, label: "specialized rigging" },
  { pattern: /bms|bacnet|controls/i, label: "controls integration" },
  { pattern: /lead|asbestos|abatement/i, label: "hazardous material exposure" },
  { pattern: /prevailing\s*wage|davis.?bacon/i, label: "prevailing wage compliance" },
];

function splitScopeItems(scopeSummary: string): string[] {
  const lines = scopeSummary
    .split(/\n|;/)
    .map((s) => s.trim())
    .filter((s) => s.length > 8);
  if (lines.length > 0) return lines.slice(0, 8);
  return scopeSummary.length > 20 ? [scopeSummary] : ["Scope narrative pending — add detail or upload documents in Phase 3."];
}

function detectComplexity(scope: string) {
  const hits = COMPLEXITY_KEYWORDS.filter((k) => k.pattern.test(scope)).map((k) => k.label);
  return hits;
}

function buildRfis(bid: BidContext, scope: string, complianceFlags: string[]): ScopeRfi[] {
  const rfis: ScopeRfi[] = [];
  if (!/bms|controls|bacnet/i.test(scope)) {
    rfis.push({
      title: "Controls / BMS integration",
      detail: "Confirm existing BMS protocol and gateway requirements before pricing integration labor.",
      severity: "medium",
    });
  }
  if (!/staging|rigging|crane/i.test(scope) && /rtu|rooftop|rigging|crane/i.test(scope)) {
    rfis.push({
      title: "Staging & rigging logistics",
      detail: "No defined staging or crane path in the scope narrative — confirm lift plan and laydown area.",
      severity: "high",
    });
  }
  if (bid.publicPrivate === "Public" && !/bond|emr|safety/i.test(scope)) {
    rfis.push({
      title: "Public bid forms & bonding",
      detail: "Verify bid bond percentage, EMR submission, and any non-collusion affidavit requirements.",
      severity: "medium",
    });
  }
  if (complianceFlags.length > 0) {
    rfis.push({
      title: "Jurisdiction compliance validation",
      detail: complianceFlags[0] ?? "Research Hub flags require reviewer attention before submission.",
      severity: "high",
    });
  }
  if (rfis.length === 0) {
    rfis.push({
      title: "Specification cross-check",
      detail: "Run division cross-reference against uploaded specs when document intake is live.",
      severity: "medium",
    });
  }
  return rfis.slice(0, 5);
}

function buildRisks(bid: BidContext, scope: string, compliancePoints: number): ScopeRisk[] {
  const complexity = detectComplexity(scope);
  const risks: ScopeRisk[] = [];

  const deadlineDays = bid.date ? Math.ceil((Date.parse(bid.date) - Date.now()) / 86_400_000) : 14;
  if (deadlineDays < 7) {
    risks.push({
      label: "Deadline pressure",
      level: "High",
      score: 82,
      detail: `Decision/submission window inside ${Math.max(deadlineDays, 0)} days — package assembly risk is elevated.`,
    });
  }

  if (complexity.length >= 2) {
    risks.push({
      label: "Execution complexity",
      level: "High",
      score: 78,
      detail: `Multiple complexity drivers detected: ${complexity.join(", ")}.`,
    });
  } else if (complexity.length === 1) {
    risks.push({
      label: "Execution complexity",
      level: "Medium",
      score: 55,
      detail: `Complexity driver: ${complexity[0]}.`,
    });
  }

  if (compliancePoints < 5) {
    risks.push({
      label: "Compliance eligibility",
      level: compliancePoints < 3 ? "High" : "Medium",
      score: compliancePoints < 3 ? 75 : 50,
      detail: "Jurisdiction rules are incomplete or awaiting human approval in Research Hub.",
    });
  }

  if (bid.amount >= 2_000_000) {
    risks.push({
      label: "Financial exposure",
      level: "Medium",
      score: 48,
      detail: "Contract value above $2M — executive review recommended on margin and bonding capacity.",
    });
  }

  if (risks.length === 0) {
    risks.push({
      label: "Baseline delivery",
      level: "Low",
      score: 28,
      detail: "No acute risk signals in scope narrative — continue standard estimator review.",
    });
  }

  return risks;
}

function roseVerdictFromSignals(risks: ScopeRisk[], compliancePoints: number): "green" | "yellow" | "red" {
  const high = risks.filter((r) => r.level === "High").length;
  if (high >= 2 || compliancePoints < 3) return "red";
  if (high >= 1 || compliancePoints < 6) return "yellow";
  return "green";
}

function roseNarrative(bid: BidContext, verdict: "green" | "yellow" | "red", risks: ScopeRisk[]): string {
  const value = bid.amount >= 1_000_000 ? `$${(bid.amount / 1_000_000).toFixed(2)}M` : `$${Math.round(bid.amount / 1000)}K`;
  const leadRisk = risks.find((r) => r.level === "High")?.label ?? "delivery variables";
  if (verdict === "green") {
    return `ROSEOS sees a disciplined path on ${bid.name} (${value}). Scope narrative is sufficiently defined for estimator packaging — proceed after human reviewer sign-off on this AI brief.`;
  }
  if (verdict === "yellow") {
    return `ROSEOS flags ${leadRisk} on ${bid.name} (${value}). Adjust strategy before client-facing numbers — this is decision-support, not a bid guarantee.`;
  }
  return `ROSEOS recommends executive review before pursuing ${bid.name} (${value}). ${leadRisk} and compliance signals need human resolution first.`;
}

function requiredForms(bid: BidContext): string[] {
  const base = ["Scope review checklist", "Estimator sign-off sheet"];
  if (bid.publicPrivate === "Public") {
    return [
      ...base,
      "Bid form / proposal cover",
      "Bid bond (if required)",
      "Non-collusion affidavit",
      "Safety record / EMR",
      "List of proposed subcontractors",
    ];
  }
  return [...base, "Proposal transmittal", "Insurance certificate"];
}

export async function runRoseScopeAnalysis(bid: BidContext): Promise<ScopeAnalysisPayload> {
  const scope = (bid.scopeSummary ?? "").trim() || `General ${bid.type || "construction"} scope for ${bid.name} at ${bid.location}.`;
  const state = parseStateFromLocation(bid.location);
  const compliance = await computeComplianceEligibility(state);
  const complexityHits = detectComplexity(scope);

  const rfis = buildRfis(bid, scope, compliance.flags);
  const risks = buildRisks(bid, scope, compliance.eligibilityPoints);
  const roseVerdict = roseVerdictFromSignals(risks, compliance.eligibilityPoints);

  const timeline =
    complexityHits.includes("restricted operations window")
      ? "Phased delivery likely required — night/weekend windows may constrain labor productivity."
      : bid.date
        ? `Target decision date ${bid.date}; align internal submittal 48–72 hours ahead of owner deadline.`
        : "Set a decision date to activate timeline risk monitoring.";

  const deliverables =
    scope.length > 40
      ? scope
      : `${bid.type || "Trade"} services for ${bid.recipient || "client"} — expand scope narrative or upload specs for richer extraction.`;

  const recommendedActions = [
    "Human reviewer: validate AI scope brief before client distribution.",
    ...(bid.documentCount && bid.documentCount > 0
      ? [`${bid.documentCount} spec document(s) on file — AI merged extracted text; verify before client use.`]
      : []),
    compliance.eligibilityPoints < 6
      ? "Resolve Research Hub jurisdiction flags for this state."
      : "Compliance eligibility acceptable — confirm trade-specific rules with estimator.",
    roseVerdict !== "green" ? "Schedule executive review before pricing lock." : "Proceed to cost inputs after reviewer approval.",
  ];

  return {
    projectName: bid.name,
    deliverables,
    timeline,
    complexityIndicator: {
      title: complexityHits.length ? "Key complexity drivers" : "Standard delivery profile",
      detail:
        complexityHits.length > 0
          ? complexityHits.join("; ")
          : "No acute complexity keywords detected — continue normal preconstruction review.",
    },
    rfis,
    risks,
    scopeItems: splitScopeItems(scope),
    roseVerdict,
    roseNarrative: roseNarrative(bid, roseVerdict, risks),
    recommendedActions,
    requiredForms: requiredForms(bid),
    engine: "rose-rules",
    disclaimer: "Powered by AI. Reviewed by humans required before client-facing use.",
  };
}

async function tryOpenAiEnhance(bid: BidContext, base: ScopeAnalysisPayload): Promise<ScopeAnalysisPayload> {
  const apiKey = process.env.BIOS_OPENAI_API_KEY ?? process.env.OPENAI_API_KEY;
  if (!apiKey) return base;

  const model = process.env.BIOS_OPENAI_MODEL ?? "gpt-4o-mini";
  const prompt = `You are ROSEOS, CCA's executive bid intelligence layer. Rewrite ONLY the narrative fields as JSON.
Bid: ${JSON.stringify(bid)}
Base analysis: ${JSON.stringify({ roseVerdict: base.roseVerdict, risks: base.risks.map((r) => r.label) })}
Return JSON: {"roseNarrative":"...","recommendedActions":["..."],"deliverables":"..."}
Keep decision-support tone. No guarantees. Under 120 words for narrative.`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.3,
        max_tokens: 500,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: "Executive construction bid intelligence. JSON only." },
          { role: "user", content: prompt },
        ],
      }),
    });
    if (!response.ok) return base;
    const data = (await response.json()) as { choices?: { message?: { content?: string } }[] };
    const content = data.choices?.[0]?.message?.content;
    if (!content) return base;
    const parsed = JSON.parse(content) as Partial<ScopeAnalysisPayload>;
    return {
      ...base,
      roseNarrative: parsed.roseNarrative ?? base.roseNarrative,
      deliverables: parsed.deliverables ?? base.deliverables,
      recommendedActions: parsed.recommendedActions?.length ? parsed.recommendedActions : base.recommendedActions,
      engine: "openai",
    };
  } catch {
    return base;
  }
}

export async function generateScopeAnalysis(bid: BidContext): Promise<ScopeAnalysisPayload> {
  const base = await runRoseScopeAnalysis(bid);
  return tryOpenAiEnhance(bid, base);
}
