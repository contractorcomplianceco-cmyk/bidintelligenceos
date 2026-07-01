/**
 * Industry use-case content shared by the marketing page and the in-app
 * Industry Use Cases screen. Icons are referenced by string key and mapped to
 * lucide components at render time to keep this file free of JSX.
 */
export type IndustryIconKey =
  | "roofing"
  | "storm"
  | "gc"
  | "hvac"
  | "engineering"
  | "electrical"
  | "plumbing"
  | "facility"
  | "insurance"
  | "custom";

export interface IndustryUseCase {
  id: string;
  name: string;
  icon: IndustryIconKey;
  tagline: string;
  painPoints: string[];
  features: string[];
  /** What the Command Center emphasizes when this industry mode is active */
  dashboardShows: string[];
}

/**
 * Maps a global vertical id (from `verticals.ts`) to the closest industry
 * use-case id so the topbar Business Type selector preselects the matching
 * use-case mode. Verticals without a dedicated use case fall back to "custom".
 */
export const VERTICAL_TO_USE_CASE: Record<string, string> = {
  gc: "gc",
  hvac: "hvac",
  roofing: "roofing",
  electrical: "electrical",
  plumbing: "plumbing",
  restoration: "insurance",
  facility: "facility",
  concrete: "engineering",
  landscaping: "engineering",
  specialty: "custom",
  custom: "custom",
};

export function useCaseIdForVertical(verticalId: string): string {
  return VERTICAL_TO_USE_CASE[verticalId] ?? "custom";
}

export const INDUSTRY_USE_CASES: IndustryUseCase[] = [
  {
    id: "roofing",
    name: "Roofing",
    icon: "roofing",
    tagline: "Move fast after storms and capture roof scope accurately the first time.",
    painPoints: [
      "Fast site walks after storm events",
      "Accurate roof scope capture",
      "Weather delays",
      "Insurance documentation",
      "Material price volatility",
      "Crew scheduling",
      "Warranty and permit tracking",
    ],
    features: [
      "Storm damage bid workflow",
      "Roof measurement and site photo checklist",
      "Weather risk monitoring",
      "Rain-out rescheduling",
      "Insurance-ready documentation",
      "Material and labor variance tracking",
    ],
    dashboardShows: [
      "Weather-sensitive jobs",
      "Rain-out risks",
      "Roof access notes",
      "Material delivery",
      "Warranty docs",
      "Insurance documentation",
      "Crew schedule",
      "Permit / inspection status",
    ],
  },
  {
    id: "storm",
    name: "Storm Damage / Restoration",
    icon: "storm",
    tagline: "Respond in hours, document every claim, and stop cost leakage.",
    painPoints: [
      "Emergency response speed",
      "Claim documentation",
      "Adjuster communication",
      "Photos and voice notes",
      "Scope supplements",
      "Change orders",
      "Job cost leakage",
    ],
    features: [
      "VoiceConnect claim / site capture",
      "Photo and note tagging",
      "Supplement opportunity detection",
      "Client / adjuster update generator",
      "Emergency scheduling",
      "Cost-to-completion tracking",
    ],
    dashboardShows: [
      "Claim documentation",
      "Photo packets",
      "Adjuster notes",
      "Emergency response schedule",
      "Supplement opportunities",
      "Client approval status",
    ],
  },
  {
    id: "gc",
    name: "General Contractor",
    icon: "gc",
    tagline: "Level sub bids, catch scope gaps, and keep the critical path honest.",
    painPoints: [
      "Managing multiple trades",
      "Scope gaps",
      "Bid leveling",
      "Subcontractor delays",
      "Change orders",
      "Permit dependencies",
      "Timeline slippage",
    ],
    features: [
      "Sub bid comparison",
      "Trade scope gap detection",
      "Subcontractor scorecards",
      "Critical path scheduling",
      "Permit dependency map",
      "Change order detection",
      "Daily executive project briefing",
    ],
    dashboardShows: [
      "Subcontractor bid status",
      "Trade coordination",
      "Critical path",
      "Permit blockers",
      "Sub delays",
      "Change order exposure",
    ],
  },
  {
    id: "hvac",
    name: "HVAC",
    icon: "hvac",
    tagline: "Track long-lead equipment and coordinate controls, access, and startup.",
    painPoints: [
      "Equipment lead times",
      "Rooftop unit access",
      "Controls scope",
      "Mechanical / electrical coordination",
      "Permit and inspection dates",
      "Startup and commissioning",
    ],
    features: [
      "Equipment lead-time alerts",
      "Controls and electrical scope checklist",
      "Rooftop access notes",
      "Commissioning checklist",
      "Warranty / submittal tracking",
      "Cost variance monitoring",
    ],
    dashboardShows: [
      "Equipment lead times",
      "Controls scope",
      "Crane / roof access",
      "Startup / commissioning",
      "Inspection and warranty docs",
    ],
  },
  {
    id: "engineering",
    name: "General Engineering",
    icon: "engineering",
    tagline: "Sequence permits, deploy equipment, and manage weather-sensitive earthwork.",
    painPoints: [
      "Site conditions",
      "Equipment deployment",
      "Civil scope complexity",
      "Permit sequencing",
      "Subcontractor coordination",
      "Weather impacts",
    ],
    features: [
      "Field condition capture",
      "Equipment and crew deployment planning",
      "Permit sequencing",
      "Weather-sensitive scheduling",
      "Civil scope risk flags",
      "Daily progress reporting",
    ],
    dashboardShows: [
      "Site condition flags",
      "Equipment allocation",
      "Crew deployment",
      "Permit sequencing",
      "Weather-sensitive earthwork",
      "Civil scope risk",
    ],
  },
  {
    id: "electrical",
    name: "Electrical",
    icon: "electrical",
    tagline: "Manage long-lead gear, utility coordination, and change-order exposure.",
    painPoints: [
      "Panel schedules",
      "Utility coordination",
      "Long-lead gear",
      "Inspection timing",
      "Low-voltage exclusions",
      "Change order exposure",
    ],
    features: [
      "Long-lead item tracking",
      "Permit and inspection tracker",
      "Utility coordination checklist",
      "Scope clarification prompts",
      "Change order detection",
      "Closeout documentation",
    ],
    dashboardShows: [
      "Long-lead gear status",
      "Permit / inspection tracker",
      "Utility coordination",
      "Change order exposure",
      "Closeout documentation",
    ],
  },
  {
    id: "plumbing",
    name: "Plumbing",
    icon: "plumbing",
    tagline: "Track inspection dependencies and underground conflicts before they cost you.",
    painPoints: [
      "Underground conflicts",
      "Inspection dependencies",
      "Fixture counts",
      "Material changes",
      "Coordination with GC and other trades",
    ],
    features: [
      "Inspection dependency tracker",
      "Material quantity checklist",
      "Site conflict notes",
      "VoiceConnect walkthrough capture",
      "Labor and sub tracking",
      "Cost-to-completion monitoring",
    ],
    dashboardShows: [
      "Inspection dependencies",
      "Underground conflict notes",
      "Fixture counts",
      "Material changes",
      "Labor / sub tracking",
    ],
  },
  {
    id: "facility",
    name: "Facility Maintenance",
    icon: "facility",
    tagline: "Standardize multi-location service with SLA tracking and clean reporting.",
    painPoints: [
      "Multi-location work",
      "Service response times",
      "Recurring maintenance",
      "Documentation consistency",
      "Vendor / client reporting",
    ],
    features: [
      "Multi-location service matrix",
      "SLA / response tracking",
      "Recurring work schedules",
      "Client update generator",
      "Cost by location",
      "Performance dashboards",
    ],
    dashboardShows: [
      "Multi-location service matrix",
      "SLA / response times",
      "Recurring work schedules",
      "Cost by location",
      "Performance dashboards",
    ],
  },
  {
    id: "insurance",
    name: "Insurance / Restoration",
    icon: "insurance",
    tagline: "Build claim packages, catch supplements, and protect job profitability.",
    painPoints: [
      "Claim scope documentation",
      "Adjuster revisions",
      "Supplement requests",
      "Photos and notes",
      "Time-sensitive approvals",
    ],
    features: [
      "Claim package builder",
      "Photo / voice note organization",
      "Supplement detector",
      "Adjuster communication drafts",
      "Restoration timeline",
      "Job profitability tracking",
    ],
    dashboardShows: [
      "Claim scope documentation",
      "Adjuster revisions",
      "Supplement requests",
      "Time-sensitive approvals",
      "Job profitability",
    ],
  },
  {
    id: "custom",
    name: "Custom Business Type",
    icon: "custom",
    tagline: "Configure the workflow, labels, and dashboard focus to match your operation.",
    painPoints: [
      "Workflows that don't match your trade",
      "Generic labels and phases",
      "Scattered field information",
      "Inconsistent documentation",
      "Cost visibility across jobs",
    ],
    features: [
      "Configurable job phases",
      "Custom cost and labor categories",
      "Tailored bid intake fields",
      "VoiceConnect field capture",
      "Cost and ROI tracking",
      "Daily intelligent briefings",
    ],
    dashboardShows: [
      "Configurable KPIs",
      "Custom job phases",
      "Cost variance",
      "Follow-ups due",
      "Daily briefing",
    ],
  },
];
