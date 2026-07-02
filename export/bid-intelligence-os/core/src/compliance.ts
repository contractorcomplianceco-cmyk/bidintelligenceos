/**
 * ComplianceConnect — seed data for the connected compliance add-on.
 *
 * Tracks licenses, insurance, and bonds and turns their status into a
 * readiness posture that feeds flags into bids, alerts, and permits.
 *
 * Decision-support only. Tracking and reminders do NOT guarantee compliance,
 * bonding, or licensing outcomes — always verify with the issuing authorities.
 */

export type ComplianceCategory =
  | "licensing"
  | "insurance"
  | "bonding"
  | "permits"
  | "audit";

export type ComplianceStatus = "active" | "expiring" | "action-needed";

export interface ComplianceItem {
  id: string;
  category: Exclude<ComplianceCategory, "permits" | "audit">;
  name: string;
  /** Issuing authority / carrier / surety */
  authority: string;
  /** Reference or policy / license number (masked) */
  reference: string;
  status: ComplianceStatus;
  /** ISO expiry / renewal date */
  expiry: string;
  /** Days until expiry (negative = lapsed) */
  daysToExpiry: number;
  /** Coverage limit or bonding capacity */
  coverage: string;
  note: string;
}

export interface ReadinessScore {
  key: ComplianceCategory;
  label: string;
  score: number;
}

export interface AuditChecklistItem {
  id: string;
  label: string;
  detail: string;
  done: boolean;
}

export interface PermitReadinessRow {
  id: string;
  permit: string;
  jurisdiction: string;
  status: ComplianceStatus;
  note: string;
}

export interface IntegrationFlow {
  target: string;
  description: string;
}

export const COMPLIANCE_ITEMS: ComplianceItem[] = [
  // Licensing
  {
    id: "lic-gc-state",
    category: "licensing",
    name: "State GC License (Class A)",
    authority: "State Contractors Licensing Board",
    reference: "GC-•••4821",
    status: "active",
    expiry: "2026-08-31",
    daysToExpiry: 214,
    coverage: "Unlimited project value",
    note: "Renewal packet auto-tracked; continuing education credits current.",
  },
  {
    id: "lic-electrical",
    category: "licensing",
    name: "Electrical Trade License",
    authority: "State Electrical Board",
    reference: "EL-•••1170",
    status: "expiring",
    expiry: "2026-03-15",
    daysToExpiry: 45,
    coverage: "Commercial & industrial",
    note: "Renewal window open — submit before expiry to avoid a lapse flag on bids.",
  },
  {
    id: "lic-mechanical",
    category: "licensing",
    name: "Mechanical Trade License",
    authority: "State Mechanical Board",
    reference: "ME-•••0934",
    status: "active",
    expiry: "2026-11-02",
    daysToExpiry: 277,
    coverage: "HVAC & process piping",
    note: "Qualifying party on file; no action required.",
  },
  {
    id: "lic-business",
    category: "licensing",
    name: "City Business License",
    authority: "Metro Business Licensing",
    reference: "BL-•••5522",
    status: "action-needed",
    expiry: "2026-02-10",
    daysToExpiry: 11,
    coverage: "Local operations",
    note: "Renewal fee unpaid — resolve to keep municipal bids eligible. Verify with the city clerk.",
  },
  // Insurance
  {
    id: "ins-gl",
    category: "insurance",
    name: "General Liability",
    authority: "Continental Surety & Casualty",
    reference: "GL-•••7788",
    status: "active",
    expiry: "2026-07-01",
    daysToExpiry: 153,
    coverage: "$2M per occ / $4M aggregate",
    note: "Additional-insured endorsement template on file for owner requirements.",
  },
  {
    id: "ins-wc",
    category: "insurance",
    name: "Workers' Compensation",
    authority: "State Fund Insurance",
    reference: "WC-•••3301",
    status: "active",
    expiry: "2026-06-15",
    daysToExpiry: 137,
    coverage: "Statutory / $1M employer's liability",
    note: "Experience mod 0.92 — favorable for prequalification.",
  },
  {
    id: "ins-auto",
    category: "insurance",
    name: "Commercial Auto",
    authority: "Continental Surety & Casualty",
    reference: "CA-•••6640",
    status: "expiring",
    expiry: "2026-03-28",
    daysToExpiry: 58,
    coverage: "$1M combined single limit",
    note: "Carrier requesting updated fleet schedule before renewal.",
  },
  {
    id: "ins-umbrella",
    category: "insurance",
    name: "Umbrella / Excess Liability",
    authority: "Meridian Specialty",
    reference: "UM-•••2214",
    status: "active",
    expiry: "2026-07-01",
    daysToExpiry: 153,
    coverage: "$5M excess",
    note: "Stacks over GL and auto to meet higher-limit owner requirements.",
  },
  // Bonding
  {
    id: "bond-capacity",
    category: "bonding",
    name: "Bid Bond Capacity",
    authority: "Keystone Surety",
    reference: "Aggregate program",
    status: "active",
    expiry: "2026-12-31",
    daysToExpiry: 336,
    coverage: "$12M single / $30M aggregate",
    note: "Capacity confirmed by surety; approx. $19M available headroom.",
  },
  {
    id: "bond-performance",
    category: "bonding",
    name: "Performance Bond",
    authority: "Keystone Surety",
    reference: "PB-•••9005",
    status: "active",
    expiry: "2026-10-15",
    daysToExpiry: 259,
    coverage: "Up to $12M per project",
    note: "Rate and terms reconfirmed quarterly; last review current.",
  },
  {
    id: "bond-payment",
    category: "bonding",
    name: "Payment Bond",
    authority: "Keystone Surety",
    reference: "PY-•••9006",
    status: "expiring",
    expiry: "2026-03-05",
    daysToExpiry: 35,
    coverage: "Up to $12M per project",
    note: "Surety renewal underway — updated financials requested.",
  },
  {
    id: "bond-license",
    category: "bonding",
    name: "License / Contractor Bond",
    authority: "Keystone Surety",
    reference: "LB-•••1188",
    status: "action-needed",
    expiry: "2026-02-20",
    daysToExpiry: 21,
    coverage: "$25K statutory",
    note: "Continuation certificate not yet returned — confirm with surety and board.",
  },
];

export const OVERALL_READINESS = 82;

export const READINESS_SCORES: ReadinessScore[] = [
  { key: "licensing", label: "Licensing", score: 78 },
  { key: "insurance", label: "Insurance", score: 90 },
  { key: "bonding", label: "Bonding", score: 74 },
  { key: "permits", label: "Permits", score: 85 },
  { key: "audit", label: "Audit", score: 83 },
];

export const AUDIT_CHECKLIST: AuditChecklistItem[] = [
  {
    id: "audit-coi",
    label: "Certificates of insurance current",
    detail: "All active policies have matching COIs on file with additional-insured language.",
    done: true,
  },
  {
    id: "audit-license-file",
    label: "License file complete",
    detail: "State, trade, and municipal licenses scanned and indexed.",
    done: true,
  },
  {
    id: "audit-surety-letter",
    label: "Surety capacity letter refreshed",
    detail: "Current bonding capacity letter within 90 days.",
    done: true,
  },
  {
    id: "audit-safety-log",
    label: "Safety & EMR documentation",
    detail: "OSHA 300 logs and EMR letter compiled for prequalification.",
    done: false,
  },
  {
    id: "audit-w9",
    label: "W-9 and tax verification",
    detail: "W-9, EIN verification, and lien-waiver templates staged.",
    done: true,
  },
  {
    id: "audit-renewals",
    label: "Renewal reminders scheduled",
    detail: "Two items inside their renewal windows still need owner sign-off.",
    done: false,
  },
];

export const PERMIT_READINESS: PermitReadinessRow[] = [
  {
    id: "perm-building",
    permit: "Building Permit prequalification",
    jurisdiction: "Metro Building Dept.",
    status: "active",
    note: "Contractor registration verified; license and insurance on file.",
  },
  {
    id: "perm-electrical",
    permit: "Electrical Permit eligibility",
    jurisdiction: "Metro Building Dept.",
    status: "expiring",
    note: "Tied to electrical trade license renewal — clears once license is renewed.",
  },
  {
    id: "perm-municipal",
    permit: "Municipal contractor registration",
    jurisdiction: "City of Riverside",
    status: "action-needed",
    note: "Blocked by unpaid business license fee. Verify status with the city clerk.",
  },
  {
    id: "perm-mechanical",
    permit: "Mechanical Permit eligibility",
    jurisdiction: "County Permits Office",
    status: "active",
    note: "Mechanical license and insurance current.",
  },
];

export const INTEGRATION_FLOWS: IntegrationFlow[] = [
  {
    target: "Bids",
    description:
      "Readiness flags attach to bid records so gaps surface during bid/no-bid review.",
  },
  {
    target: "Alerts",
    description:
      "Expiring and action-needed items raise expiration alerts before they block work.",
  },
  {
    target: "Permits & Documents",
    description:
      "Permit readiness rows feed the Permits module and keep the document room audit-ready.",
  },
];

export const COMPLIANCE_GUARDRAIL =
  "ComplianceConnect is a tracking and decision-support tool. Readiness scores and reminders help you stay bid- and audit-ready, but they do not guarantee compliance, bonding, or licensing outcomes. Always confirm current status directly with the issuing authorities, carriers, and sureties.";

export function itemsByCategory(
  category: ComplianceItem["category"],
): ComplianceItem[] {
  return COMPLIANCE_ITEMS.filter((i) => i.category === category);
}
