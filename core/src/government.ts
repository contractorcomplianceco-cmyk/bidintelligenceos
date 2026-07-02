/**
 * Government Contracting — seed data for the core readiness module.
 *
 * Tracks federal/state registration & credentials, set-aside certifications,
 * and public solicitation pipeline, and rolls them into a readiness posture.
 *
 * Decision-support only. Readiness tracking does NOT guarantee award outcomes.
 * Always verify current requirements and status on official sources (SAM.gov).
 */

export type CredentialStatus = "active" | "expiring" | "action-needed";

export interface RegistrationItem {
  id: string;
  label: string;
  value: string;
  status: CredentialStatus;
  /** Optional renewal / verification date */
  detail: string;
}

export type SetAside =
  | "Small Business"
  | "WOSB"
  | "SDVOSB"
  | "HUBZone"
  | "8(a)"
  | "None";

export type SolicitationType = "RFP" | "RFQ" | "IFB";

export type Eligibility = "eligible" | "review-needed" | "ineligible";

export interface GovOpportunity {
  id: string;
  solicitation: string;
  agency: string;
  title: string;
  type: SolicitationType;
  setAside: SetAside;
  naics: string;
  deadline: string;
  daysLeft: number;
  eligibility: Eligibility;
  /** Completed document checklist items */
  checklistDone: number;
  /** Total document checklist items */
  checklistTotal: number;
}

export type CertStatus = "certified" | "in-progress" | "not-pursued" | "expiring";

export interface SetAsideCertification {
  id: string;
  cert: string;
  authority: string;
  status: CertStatus;
  detail: string;
}

export interface GovReadinessComponent {
  key: string;
  label: string;
  score: number;
}

export type GovAlertKind =
  | "sam-expiring"
  | "missing-docs"
  | "deadline"
  | "eligibility";

export type GovAlertSeverity = "high" | "medium" | "low";

export interface GovAlert {
  id: string;
  kind: GovAlertKind;
  severity: GovAlertSeverity;
  title: string;
  detail: string;
}

export const REGISTRATION_ITEMS: RegistrationItem[] = [
  {
    id: "reg-sam",
    label: "SAM.gov Registration",
    value: "Active",
    status: "expiring",
    detail: "Renews 2026-04-12 — begin renewal 60 days out.",
  },
  {
    id: "reg-uei",
    label: "Unique Entity ID (UEI)",
    value: "PBX7•••K4M9",
    status: "active",
    detail: "Validated with SAM.gov entity record.",
  },
  {
    id: "reg-cage",
    label: "CAGE Code",
    value: "8•••2",
    status: "active",
    detail: "Assigned and current with DLA.",
  },
  {
    id: "reg-ein",
    label: "EIN Verification",
    value: "Verified",
    status: "active",
    detail: "TIN matched to legal business name.",
  },
  {
    id: "reg-w9",
    label: "W-9 on File",
    value: "Current",
    status: "active",
    detail: "Signed W-9 dated within 12 months.",
  },
  {
    id: "reg-cap",
    label: "Capability Statement",
    value: "Needs update",
    status: "action-needed",
    detail: "Last revised 14 months ago — refresh NAICS and past performance.",
  },
  {
    id: "reg-pastperf",
    label: "Past Performance Records",
    value: "7 records",
    status: "active",
    detail: "Federal + state references indexed for proposals.",
  },
];

export const GOV_OPPORTUNITIES: GovOpportunity[] = [
  {
    id: "opp-1",
    solicitation: "W912DR-26-R-0042",
    agency: "U.S. Army Corps of Engineers",
    title: "Levee Rehabilitation — Design-Build",
    type: "RFP",
    setAside: "Small Business",
    naics: "237990",
    deadline: "2026-03-18",
    daysLeft: 48,
    eligibility: "eligible",
    checklistDone: 6,
    checklistTotal: 9,
  },
  {
    id: "opp-2",
    solicitation: "GS-07P-26-Q-0117",
    agency: "GSA Public Buildings Service",
    title: "Federal Courthouse HVAC Modernization",
    type: "RFQ",
    setAside: "HUBZone",
    naics: "238220",
    deadline: "2026-02-24",
    daysLeft: 25,
    eligibility: "review-needed",
    checklistDone: 3,
    checklistTotal: 8,
  },
  {
    id: "opp-3",
    solicitation: "VA-262-26-B-0088",
    agency: "Dept. of Veterans Affairs",
    title: "Medical Center Roof Replacement",
    type: "IFB",
    setAside: "SDVOSB",
    naics: "238160",
    deadline: "2026-02-12",
    daysLeft: 13,
    eligibility: "ineligible",
    checklistDone: 2,
    checklistTotal: 7,
  },
  {
    id: "opp-4",
    solicitation: "N40085-26-R-3301",
    agency: "NAVFAC Mid-Atlantic",
    title: "Base Electrical Distribution Upgrade",
    type: "RFP",
    setAside: "8(a)",
    naics: "238210",
    deadline: "2026-04-02",
    daysLeft: 63,
    eligibility: "review-needed",
    checklistDone: 4,
    checklistTotal: 10,
  },
  {
    id: "opp-5",
    solicitation: "DOT-FHWA-26-Q-0204",
    agency: "Federal Highway Administration",
    title: "Rest Area Facility Renovation",
    type: "RFQ",
    setAside: "WOSB",
    naics: "236220",
    deadline: "2026-03-05",
    daysLeft: 35,
    eligibility: "eligible",
    checklistDone: 7,
    checklistTotal: 8,
  },
  {
    id: "opp-6",
    solicitation: "SP4701-26-B-0450",
    agency: "Defense Logistics Agency",
    title: "Warehouse Concrete & Sitework",
    type: "IFB",
    setAside: "None",
    naics: "238110",
    deadline: "2026-02-28",
    daysLeft: 29,
    eligibility: "eligible",
    checklistDone: 5,
    checklistTotal: 6,
  },
];

export const SET_ASIDE_CERTIFICATIONS: SetAsideCertification[] = [
  {
    id: "cert-sb",
    cert: "Small Business",
    authority: "SBA self-certification",
    status: "certified",
    detail: "NAICS size standards met and profile self-certified in SAM.gov.",
  },
  {
    id: "cert-hubzone",
    cert: "HUBZone",
    authority: "SBA",
    status: "in-progress",
    detail: "Application submitted; principal-office and employee residency review pending.",
  },
  {
    id: "cert-sdvosb",
    cert: "SDVOSB",
    authority: "VA / SBA VetCert",
    status: "not-pursued",
    detail: "No qualifying service-disabled veteran owner — not eligible.",
  },
  {
    id: "cert-8a",
    cert: "8(a) Business Development",
    authority: "SBA",
    status: "in-progress",
    detail: "Eligibility documents assembling; economic and social narrative in draft.",
  },
  {
    id: "cert-wosb",
    cert: "WOSB",
    authority: "SBA WOSB program",
    status: "certified",
    detail: "Certification active; annual attestation current.",
  },
];

export const GOV_READINESS = 76;

export const GOV_READINESS_COMPONENTS: GovReadinessComponent[] = [
  { key: "registration", label: "Registration", score: 84 },
  { key: "certifications", label: "Certifications", score: 70 },
  { key: "documents", label: "Documents", score: 68 },
  { key: "pastperf", label: "Past Performance", score: 80 },
  { key: "pipeline", label: "Pipeline Readiness", score: 78 },
];

export const GOV_ALERTS: GovAlert[] = [
  {
    id: "ga-1",
    kind: "sam-expiring",
    severity: "high",
    title: "SAM.gov registration renewing soon",
    detail: "Registration expires 2026-04-12. Start renewal now to avoid an eligibility lapse. Verify at SAM.gov.",
  },
  {
    id: "ga-2",
    kind: "missing-docs",
    severity: "medium",
    title: "Capability statement outdated",
    detail: "Refresh NAICS codes and past performance before your next submission.",
  },
  {
    id: "ga-3",
    kind: "deadline",
    severity: "high",
    title: "IFB VA-262-26-B-0088 closes in 13 days",
    detail: "Document checklist only 2 of 7 complete — accelerate or de-prioritize.",
  },
  {
    id: "ga-4",
    kind: "eligibility",
    severity: "high",
    title: "Set-aside mismatch on SDVOSB solicitation",
    detail: "Company does not hold SDVOSB status. Confirm requirements before pursuing.",
  },
  {
    id: "ga-5",
    kind: "deadline",
    severity: "medium",
    title: "RFQ GS-07P closes in 25 days",
    detail: "HUBZone certification still in progress — confirm eligibility before investing effort.",
  },
];

export const GOV_GUARDRAIL =
  "Government Contracting readiness is a tracking and decision-support tool. Scores, eligibility flags, and reminders help you prioritize pursuits, but they do not guarantee award outcomes or confirm eligibility. Always verify solicitation requirements, set-aside status, and registration details on official sources such as SAM.gov before submitting.";
