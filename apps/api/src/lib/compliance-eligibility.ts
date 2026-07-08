import type { BidComplianceSnapshot } from "@workspace/cca-shared";
import {
  compliancePointsFromAuditScorecard,
  findBestAuditForBid,
  isAuditEngineConfigured,
} from "./audit-engine-fetch.js";
import { fetchExportReadyForState } from "./research-hub-fetch.js";

export type ComplianceEligibility = BidComplianceSnapshot;

export type ComplianceContext = {
  trade?: string | null;
  projectType?: string | null;
};

export async function computeComplianceEligibility(
  stateCode: string | null,
  context: ComplianceContext = {},
): Promise<ComplianceEligibility> {
  if (!stateCode) {
    return {
      stateCode: null,
      exportReadyCount: 0,
      eligibilityPoints: 0,
      maxPoints: 8,
      flags: ["State not specified — add city and state to location."],
      fixBeforeBidding: ["Enter bid location with state code (e.g. Nashville, TN)."],
      sampleRules: [],
      researchConnected: false,
      auditConnected: false,
      criticalTriggers: [],
      note: "Compliance eligibility requires a state on the bid.",
    };
  }

  const research = await fetchExportReadyForState(stateCode, 25);
  const count = research.rows.length;
  const approvedCount = research.rows.filter((r) => r.human_approved).length;

  const flags: string[] = [];
  const fixBeforeBidding: string[] = [];
  let researchPoints = 0;

  if (!research.configured) {
    researchPoints = 0;
    flags.push("Research Hub bridge not configured on server.");
  } else if (count === 0) {
    researchPoints = 2;
    flags.push(`No export-ready jurisdiction rules for ${stateCode} yet.`);
    fixBeforeBidding.push(`Complete team validation for ${stateCode} research rows in Research Hub.`);
  } else {
    researchPoints = 4;
    if (approvedCount >= 5) researchPoints = 8;
    else if (approvedCount >= 2) researchPoints = 6;
    else if (approvedCount >= 1) researchPoints = 5;

    if (approvedCount < count * 0.5) {
      flags.push(`${count - approvedCount} rule(s) awaiting human approval in Research Hub.`);
      fixBeforeBidding.push("Review pending jurisdiction rules before client-facing bid decisions.");
    }
  }

  const sampleRules = research.rows.slice(0, 6).map((r) => ({
    ccaRfCode: r.cca_rf_code ?? r.risk_factor_number ?? "RF",
    status: r.workflow_stage ?? r.status ?? "unknown",
    humanApproved: Boolean(r.human_approved),
  }));

  let auditConnected = false;
  let auditId: number | undefined;
  let auditCode: string | undefined;
  let auditFinalStatus: string | undefined;
  let criticalTriggers: { key: string; label: string; cleared: boolean }[] = [];
  let auditPoints = 0;
  let auditNote = "";

  if (isAuditEngineConfigured()) {
    const match = await findBestAuditForBid(stateCode, context.trade);
    if (match) {
      auditConnected = true;
      auditId = match.summary.id;
      auditCode = match.summary.auditCode;
      auditFinalStatus = match.scorecard.finalStatus;
      const auditDerived = compliancePointsFromAuditScorecard(match.scorecard);
      auditPoints = auditDerived.points;
      flags.push(...auditDerived.flags);
      fixBeforeBidding.push(...auditDerived.fixBeforeBidding);
      criticalTriggers = auditDerived.criticalTriggers;
      auditNote = `Audit ${match.summary.auditCode} (${match.summary.clientName}) — ${match.scorecard.finalStatus}.`;
    } else {
      auditNote = `Audit engine connected; no audit matched ${stateCode}${context.trade ? ` / ${context.trade}` : ""}.`;
    }
  }

  const eligibilityPoints = auditConnected
    ? Math.min(8, auditPoints)
    : researchPoints;

  const note = [
    auditConnected ? auditNote : isAuditEngineConfigured() ? auditNote : null,
    research.configured
      ? `Research Hub: ${approvedCount} human-approved of ${count} export-ready row(s) for ${research.state ?? stateCode}.`
      : "Research Hub bridge offline.",
    auditConnected && research.configured
      ? "Compliance points driven by audit engine; Research Hub shown for jurisdiction context."
      : null,
  ]
    .filter(Boolean)
    .join(" ");

  return {
    stateCode: research.state ?? stateCode,
    exportReadyCount: count,
    eligibilityPoints,
    maxPoints: 8,
    flags: [...new Set(flags)],
    fixBeforeBidding: [...new Set(fixBeforeBidding)],
    sampleRules,
    researchConnected: research.configured,
    auditConnected,
    auditId,
    auditCode,
    auditFinalStatus,
    criticalTriggers,
    note,
  };
}
