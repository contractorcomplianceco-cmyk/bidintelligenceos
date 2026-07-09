import type { Bid } from "@core/data";
import type { ComplianceEligibility } from "@/hooks/use-bids";
import type {
  GovAlert,
  GovOpportunity,
  GovReadinessComponent,
  RegistrationItem,
  SetAsideCertification,
  SolicitationType,
  Eligibility,
  CredentialStatus,
  GovAlertSeverity,
} from "@core/government";
import { GOV_GUARDRAIL } from "@core/government";

export { GOV_GUARDRAIL };

export function parseStateFromLocation(location: string): string | null {
  const trimmed = location.trim();
  if (!trimmed) return null;
  const comma = trimmed.match(/,\s*([A-Z]{2})\b/i);
  if (comma) return comma[1].toUpperCase();
  const tail = trimmed.match(/\b([A-Z]{2})\b\s*$/i);
  if (tail) return tail[1].toUpperCase();
  return null;
}

export function isGovernmentBid(bid: Bid): boolean {
  if (bid.publicPrivate === "Public") return true;
  const t = (bid.type ?? "").toLowerCase();
  return /gc|general contractor|government|public sector|municipal|federal|state/i.test(t);
}

function daysUntil(dateStr: string | undefined): number {
  if (!dateStr) return 0;
  const target = new Date(dateStr);
  if (Number.isNaN(target.getTime())) return 0;
  return Math.max(0, Math.ceil((target.getTime() - Date.now()) / 86_400_000));
}

function solicitationTypeForBid(bid: Bid): SolicitationType {
  if (bid.status === "Clarification Requested") return "RFQ";
  if (bid.status === "Shortlisted") return "IFB";
  return "RFP";
}

function eligibilityForBid(
  bid: Bid,
  compliance?: ComplianceEligibility,
): Eligibility {
  if (!compliance) {
    return bid.fit != null && bid.fit >= 80 ? "eligible" : "review-needed";
  }
  const openTriggers = compliance.criticalTriggers.filter((t) => !t.cleared);
  if (openTriggers.length > 0) return "ineligible";
  if (compliance.fixBeforeBidding.length > 0) return "review-needed";
  if (compliance.eligibilityPoints >= compliance.maxPoints * 0.6) return "eligible";
  return "review-needed";
}

function checklistFromBid(bid: Bid, compliance?: ComplianceEligibility): { done: number; total: number } {
  if (compliance && compliance.criticalTriggers.length > 0) {
    const cleared = compliance.criticalTriggers.filter((t) => t.cleared).length;
    return { done: cleared, total: compliance.criticalTriggers.length };
  }
  const total = 5;
  let done = 0;
  if (bid.location && parseStateFromLocation(bid.location)) done += 1;
  if (bid.fit != null && bid.fit >= 70) done += 1;
  if (bid.confidence != null && bid.confidence >= 60) done += 1;
  if (bid.nextAction) done += 1;
  if (bid.status !== "Draft") done += 1;
  return { done, total };
}

export function mapBidToOpportunity(
  bid: Bid,
  compliance?: ComplianceEligibility,
): GovOpportunity {
  const deadline = bid.expectedDecisionDate ?? bid.nextActionDate ?? bid.date;
  const checklist = checklistFromBid(bid, compliance);
  return {
    id: bid.id,
    solicitation: `BID-${bid.id}`,
    agency: bid.recipient,
    title: bid.name,
    type: solicitationTypeForBid(bid),
    setAside: "None",
    naics: bid.type || "—",
    deadline,
    daysLeft: bid.daysRemaining ?? daysUntil(deadline),
    eligibility: eligibilityForBid(bid, compliance),
    checklistDone: checklist.done,
    checklistTotal: checklist.total,
  };
}

function credStatusFromCompliance(c: ComplianceEligibility): CredentialStatus {
  if (c.fixBeforeBidding.length > 0) return "action-needed";
  if (c.flags.some((f) => /expir|pending|await/i.test(f))) return "expiring";
  return "active";
}

export function buildRegistrationFromCompliance(
  complianceEntries: ComplianceEligibility[],
): RegistrationItem[] {
  if (complianceEntries.length === 0) return [];

  const items: RegistrationItem[] = [];
  for (const c of complianceEntries) {
    const state = c.stateCode ?? "—";
    items.push({
      id: `reg-jurisdiction-${state}`,
      label: `${state} jurisdiction rules`,
      value: c.exportReadyCount > 0 ? `${c.exportReadyCount} export-ready` : "None yet",
      status: credStatusFromCompliance(c),
      detail: c.note || `Research Hub ${c.researchConnected ? "connected" : "not configured"}.`,
    });

    if (c.auditConnected) {
      items.push({
        id: `reg-audit-${state}`,
        label: `${state} audit eligibility`,
        value: c.auditCode ?? "Matched",
        status: c.criticalTriggers.every((t) => t.cleared) ? "active" : "action-needed",
        detail: c.auditFinalStatus
          ? `Audit status: ${c.auditFinalStatus}`
          : "Audit engine match for trade and jurisdiction.",
      });
    }

    const approved = c.sampleRules.filter((r) => r.humanApproved).length;
    if (c.sampleRules.length > 0) {
      items.push({
        id: `reg-rules-${state}`,
        label: `${state} human-approved rules`,
        value: `${approved}/${c.sampleRules.length}`,
        status: approved >= c.sampleRules.length * 0.5 ? "active" : "expiring",
        detail:
          approved < c.sampleRules.length
            ? `${c.sampleRules.length - approved} rule(s) awaiting human approval.`
            : "All preview rules human-approved.",
      });
    }
  }

  return items.slice(0, 9);
}

export function buildLiveAlerts(
  govBids: Bid[],
  complianceByState: Map<string, ComplianceEligibility>,
): GovAlert[] {
  const alerts: GovAlert[] = [];
  let id = 0;

  for (const bid of govBids) {
    const state = parseStateFromLocation(bid.location);
    const compliance = state ? complianceByState.get(state) : undefined;
    const days = bid.daysRemaining ?? daysUntil(bid.expectedDecisionDate ?? bid.nextActionDate ?? bid.date);

    if (days > 0 && days <= 14) {
      alerts.push({
        id: `ga-deadline-${++id}`,
        kind: "deadline",
        severity: days <= 7 ? "high" : "medium",
        title: `${bid.name} decision window in ${days} days`,
        detail: bid.nextAction
          ? `Next action: ${bid.nextAction}`
          : "Confirm pursuit timeline and document checklist before committing resources.",
      });
    }

    if (compliance) {
      for (const fix of compliance.fixBeforeBidding.slice(0, 2)) {
        alerts.push({
          id: `ga-fix-${++id}`,
          kind: "missing-docs",
          severity: "medium",
          title: `${state ?? "Jurisdiction"} — action before bidding`,
          detail: fix,
        });
      }
      for (const flag of compliance.flags.slice(0, 2)) {
        alerts.push({
          id: `ga-flag-${++id}`,
          kind: "eligibility",
          severity: /not configured|no export/i.test(flag) ? "low" : "high",
          title: `${state ?? "Jurisdiction"} compliance flag`,
          detail: flag,
        });
      }
    }
  }

  return alerts.slice(0, 8);
}

function avg(nums: number[]): number {
  if (nums.length === 0) return 0;
  return Math.round(nums.reduce((s, n) => s + n, 0) / nums.length);
}

export function buildReadiness(
  govBids: Bid[],
  complianceByState: Map<string, ComplianceEligibility>,
): { readiness: number; components: GovReadinessComponent[] } {
  const complianceEntries = [...complianceByState.values()];

  const registrationScore =
    complianceEntries.length > 0
      ? avg(
          complianceEntries.map((c) =>
            c.maxPoints > 0 ? Math.round((c.eligibilityPoints / c.maxPoints) * 100) : 0,
          ),
        )
      : 0;

  const documentsScore =
    govBids.length > 0
      ? avg(
          govBids.map((b) => {
            const state = parseStateFromLocation(b.location);
            const c = state ? complianceByState.get(state) : undefined;
            const { done, total } = checklistFromBid(b, c);
            return total > 0 ? Math.round((done / total) * 100) : 50;
          }),
        )
      : 0;

  const pipelineScore =
    govBids.length > 0
      ? avg(
          govBids.map((b) => {
            const e = eligibilityForBid(
              b,
              parseStateFromLocation(b.location)
                ? complianceByState.get(parseStateFromLocation(b.location)!)
                : undefined,
            );
            if (e === "eligible") return 85;
            if (e === "review-needed") return 65;
            return 40;
          }),
        )
      : 0;

  const pastPerfScore =
    govBids.filter((b) => b.status === "Won").length > 0
      ? Math.min(95, 60 + govBids.filter((b) => b.status === "Won").length * 10)
      : govBids.length > 0
        ? 45
        : 0;

  const certScore =
    complianceEntries.some((c) => c.auditConnected && c.criticalTriggers.every((t) => t.cleared))
      ? 75
      : complianceEntries.length > 0
        ? 55
        : 0;

  const components: GovReadinessComponent[] = [
    { key: "registration", label: "Jurisdiction readiness", score: registrationScore },
    { key: "certifications", label: "Audit & compliance gates", score: certScore },
    { key: "documents", label: "Document checklist", score: documentsScore },
    { key: "pastperf", label: "Public bid outcomes", score: pastPerfScore },
    { key: "pipeline", label: "Pipeline readiness", score: pipelineScore },
  ];

  const readiness = avg(components.filter((c) => c.score > 0).map((c) => c.score));

  return { readiness, components };
}

export type LiveGovernmentView = {
  opportunities: GovOpportunity[];
  registrationItems: RegistrationItem[];
  certifications: SetAsideCertification[];
  alerts: GovAlert[];
  readiness: number;
  readinessComponents: GovReadinessComponent[];
  hasData: boolean;
};

export function hasMeaningfulCompliance(c: ComplianceEligibility): boolean {
  return (
    c.exportReadyCount > 0 ||
    c.sampleRules.length > 0 ||
    c.researchConnected ||
    c.auditConnected ||
    c.flags.length > 0
  );
}

export function buildLiveGovernmentView(
  govBids: Bid[],
  complianceByState: Map<string, ComplianceEligibility>,
): LiveGovernmentView {
  const complianceEntries = [...complianceByState.values()].filter(hasMeaningfulCompliance);
  const opportunities = govBids.map((bid) => {
    const state = parseStateFromLocation(bid.location);
    return mapBidToOpportunity(bid, state ? complianceByState.get(state) : undefined);
  });

  const registrationItems = buildRegistrationFromCompliance(complianceEntries);
  const { readiness, components } = buildReadiness(govBids, complianceByState);
  const alerts = buildLiveAlerts(govBids, complianceByState);

  const hasData = govBids.length > 0 || complianceEntries.length > 0;

  return {
    opportunities,
    registrationItems,
    certifications: [],
    alerts,
    readiness,
    readinessComponents: components,
    hasData,
  };
}

export function readinessLabel(score: number): string {
  if (score >= 85) return "Bid-ready";
  if (score >= 70) return "Approaching bid-ready";
  if (score > 0) return "Gaps to close";
  return "No readiness data";
}
