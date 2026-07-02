/**
 * ROSEOS — executive AI decision-intelligence layer seed data.
 *
 * ROSEOS sits ABOVE the operating modules (BidIntelligenceOS, MarketWatchOS,
 * BuildConnect, ComplianceConnect, ContractorConnect). It is NOT a chatbot —
 * it reads signals from every connected module and issues executive-level
 * recommendations using a three-tier verdict system:
 *
 *   GREEN LIGHT  — proceed
 *   YELLOW FLAG  — adjust strategy
 *   RED ALERT    — avoid or revise
 *
 * GUARDRAILS: ROSEOS provides intelligence, not execution. Every verdict is
 * decision-support only and is flagged for human review — no bid, pricing,
 * compliance, bonding, or award outcome is ever guaranteed, and no internal
 * pricing formula is represented or exposed here.
 */

export type Verdict = "green" | "yellow" | "red";

export type RoseSection =
  | "executive"
  | "bid-risk"
  | "job-risk"
  | "market-strategy"
  | "compliance";

export type SourceModule =
  | "BidIntelligenceOS"
  | "MarketWatchOS"
  | "BuildConnect"
  | "ComplianceConnect"
  | "ContractorConnect";

export const VERDICT_META: Record<
  Verdict,
  { label: string; action: string; color: string; bg: string; border: string }
> = {
  green: {
    label: "Green Light",
    action: "Proceed",
    color: "#15803D",
    bg: "#F0FDF4",
    border: "#BBF7D0",
  },
  yellow: {
    label: "Yellow Flag",
    action: "Adjust strategy",
    color: "#B45309",
    bg: "#FFFBEB",
    border: "#FDE68A",
  },
  red: {
    label: "Red Alert",
    action: "Avoid or revise",
    color: "#B91C1C",
    bg: "#FEF2F2",
    border: "#FECACA",
  },
};

export interface RoseInsight {
  id: string;
  section: Exclude<RoseSection, "executive">;
  verdict: Verdict;
  title: string;
  /** The entity the insight is attached to (bid, job, opportunity, credential) */
  subject: string;
  /** Why ROSEOS reached this verdict — plain-language rationale */
  rationale: string;
  /** Executive recommendation — always framed for human review */
  recommendation: string;
  sourceModule: SourceModule;
  /** The specific signal feed inside the module */
  sourceSignal: string;
  confidence: "High" | "Medium" | "Low";
  detectedAgo: string;
  /** Optional in-app route for drill-down */
  href?: string;
}

export const roseInsights: RoseInsight[] = [
  /* ------------------------------------------------------------ */
  /*  Bid Risk Review — pre-submission evaluation                  */
  /* ------------------------------------------------------------ */
  {
    id: "rose-bid-lakeside",
    section: "bid-risk",
    verdict: "green",
    title: "Lakeside Medical HVAC bid is submission-ready",
    subject: "Lakeside Medical Office HVAC — $1.24M",
    rationale:
      "Bid confidence sits in the high band, scope coverage matches the historical profile for rooftop retrofits, and crane/rigging hours already carry the Bid DNA +12% adjustment.",
    recommendation:
      "Proceed to submission after final estimator sign-off. No structural gaps detected in the package.",
    sourceModule: "BidIntelligenceOS",
    sourceSignal: "Bid confidence + Bid DNA profile match",
    confidence: "High",
    detectedAgo: "1h ago",
    href: "/bids",
  },
  {
    id: "rose-bid-westgate",
    section: "bid-risk",
    verdict: "yellow",
    title: "Westgate re-roof carries a thin weather buffer",
    subject: "Westgate Plaza Re-Roof — $496K",
    rationale:
      "The schedule carries only one rain-contingency day while Q2/Q3 roofing jobs historically slip an average of 7 days when fewer than two are carried.",
    recommendation:
      "Adjust strategy before submitting: add a second weather-contingency day or re-sequence the dry-in window, then re-run the fit review.",
    sourceModule: "BidIntelligenceOS",
    sourceSignal: "Bid DNA schedule variance pattern",
    confidence: "High",
    detectedAgo: "3h ago",
    href: "/bids",
  },
  {
    id: "rose-bid-ironworks",
    section: "bid-risk",
    verdict: "red",
    title: "Ironworks TI bid stacks three unresolved risks",
    subject: "Ironworks District TI — $318K",
    rationale:
      "The only qualified electrical lead is already overallocated, the required trade license renewal is still open, and the client's payment history flag from ContractorConnect remains unresolved.",
    recommendation:
      "Avoid or revise: hold submission until labor coverage and the license renewal clear, or re-scope the bid to a later mobilization window.",
    sourceModule: "ContractorConnect",
    sourceSignal: "Cross-module risk stack (labor + licensing + client history)",
    confidence: "Medium",
    detectedAgo: "5h ago",
    href: "/bids",
  },
  {
    id: "rose-bid-metro-renewal",
    section: "bid-risk",
    verdict: "green",
    title: "Metro Retail renewal matches a proven benchmark",
    subject: "Metro Retail Facilities Renewal — $540K",
    rationale:
      "47 completed facility contracts landed within 2% of estimate, and route density assumptions for the 14-store footprint are holding at the current SLA tier.",
    recommendation:
      "Proceed with the renewal package as drafted. Benchmark accuracy supports the current assumptions — final review still required.",
    sourceModule: "BidIntelligenceOS",
    sourceSignal: "Bid DNA facility-contract benchmark",
    confidence: "High",
    detectedAgo: "1d ago",
    href: "/bids",
  },

  /* ------------------------------------------------------------ */
  /*  Job Risk Forecasting — live execution outlook                */
  /* ------------------------------------------------------------ */
  {
    id: "rose-job-cedar",
    section: "job-risk",
    verdict: "red",
    title: "Cedar Ridge margin fade is compounding",
    subject: "Cedar Ridge Roof Replacement",
    rationale:
      "Projected margin has faded 4.7 points in six weeks while an 80% storm probability collides with the dry-in window and the sheet metal sub reports a two-day slip.",
    recommendation:
      "Avoid further exposure: shift dry-in behind the storm window, re-sequence the sub, and hold a margin review before authorizing overtime.",
    sourceModule: "BidIntelligenceOS",
    sourceSignal: "Risk Radar + profit-fade watch",
    confidence: "High",
    detectedAgo: "2h ago",
    href: "/risk",
  },
  {
    id: "rose-job-harbor",
    section: "job-risk",
    verdict: "yellow",
    title: "Harbor Point inspection window is at risk",
    subject: "Harbor Point TI Electrical",
    rationale:
      "The electrical permit expires four days after the requested final inspection and the lead journeyman is running at 104% utilization across the same window.",
    recommendation:
      "Adjust strategy: file the permit renewal now and pull the available service tech onto trim-out to protect the Jul 9 inspection.",
    sourceModule: "BidIntelligenceOS",
    sourceSignal: "Permit tracker + labor utilization",
    confidence: "High",
    detectedAgo: "6h ago",
    href: "/risk",
  },
  {
    id: "rose-job-gateway",
    section: "job-risk",
    verdict: "yellow",
    title: "Gateway rough-in burn is drifting over plan",
    subject: "Gateway Ventures Buildout",
    rationale:
      "MEP rough-in hours are running ahead of the planned burn curve and a $24.8K change order remains disputed — sustained, the margin drifts below the target band.",
    recommendation:
      "Adjust strategy: rebalance the rough-in crew, confirm the Jul 8 inspection, and escalate the disputed change order this week.",
    sourceModule: "BuildConnect",
    sourceSignal: "Sub assignment burn + change-order status",
    confidence: "Medium",
    detectedAgo: "4h ago",
    href: "/risk",
  },
  {
    id: "rose-job-metro",
    section: "job-risk",
    verdict: "green",
    title: "Metro Retail contract is tracking clean",
    subject: "Metro Retail Facilities Contract",
    rationale:
      "Cost variance is inside the plan band, the single open travel-cost signal resolved after route clustering, and the Q3 SLA review is staged.",
    recommendation:
      "Proceed on the current cadence. No executive intervention indicated this cycle.",
    sourceModule: "BidIntelligenceOS",
    sourceSignal: "Cost & ROI tracking",
    confidence: "High",
    detectedAgo: "1d ago",
    href: "/cost-roi",
  },

  /* ------------------------------------------------------------ */
  /*  Market Strategy Insights — opportunity strength review       */
  /* ------------------------------------------------------------ */
  {
    id: "rose-mkt-denton",
    section: "market-strategy",
    verdict: "green",
    title: "Denton hail corridor is a strong-fit pursuit",
    subject: "Hail corridor — Denton County, TX (score 94)",
    rationale:
      "Public storm data confirms a dense claim corridor, competition density is still moderate, and roofing crew availability plus bonding headroom support a fast pursuit.",
    recommendation:
      "Proceed within the 72-hour window: stage inspection leads into the bid pipeline while early-mover advantage holds.",
    sourceModule: "MarketWatchOS",
    sourceSignal: "Opportunity Radar public storm signals",
    confidence: "High",
    detectedAgo: "2h ago",
    href: "/market-watch",
  },
  {
    id: "rose-mkt-va",
    section: "market-strategy",
    verdict: "yellow",
    title: "VA campus RFP needs a set-aside strategy first",
    subject: "Federal HVAC modernization RFP — San Antonio (score 89)",
    rationale:
      "The opportunity scores high but competition density is high and the government readiness checklist still shows an open W-9 refresh and pending past-performance write-ups.",
    recommendation:
      "Adjust strategy: close the government-readiness gaps before the pre-bid conference in 6 days, then decide pursue/pass.",
    sourceModule: "MarketWatchOS",
    sourceSignal: "Opportunity Radar + government readiness score",
    confidence: "Medium",
    detectedAgo: "5h ago",
    href: "/government",
  },
  {
    id: "rose-mkt-plumbing",
    section: "market-strategy",
    verdict: "red",
    title: "Plumbing-led pursuits face a capacity wall",
    subject: "Plumbing trade demand — Central TX",
    rationale:
      "Open plumbing scopes outnumber available network subs, with top-tier crews booked through mid-July. New plumbing-heavy pursuits would rely on unvetted capacity.",
    recommendation:
      "Avoid new plumbing-led bids until network capacity recovers, or revise pursuit scope to trades with verified coverage.",
    sourceModule: "BuildConnect",
    sourceSignal: "Trade demand vs. network availability",
    confidence: "High",
    detectedAgo: "8h ago",
    href: "/build-connect",
  },
  {
    id: "rose-mkt-material",
    section: "market-strategy",
    verdict: "yellow",
    title: "Membrane price moves favor shorter hold windows",
    subject: "Roofing material price signal — regional",
    rationale:
      "Public distributor postings show single-ply membrane pricing trending up across two consecutive cycles, thinning margins on bids priced more than 30 days out.",
    recommendation:
      "Adjust strategy: shorten price-hold language on open roofing quotes and re-verify material lines before each submission.",
    sourceModule: "MarketWatchOS",
    sourceSignal: "Public material price index feed",
    confidence: "Medium",
    detectedAgo: "1d ago",
    href: "/market-watch",
  },

  /* ------------------------------------------------------------ */
  /*  Compliance Watch — readiness posture monitoring              */
  /* ------------------------------------------------------------ */
  {
    id: "rose-comp-business",
    section: "compliance",
    verdict: "red",
    title: "Unpaid business license fee blocks municipal bids",
    subject: "City Business License — renewal fee",
    rationale:
      "The unpaid renewal fee expires eligibility in 11 days and already blocks the municipal contractor registration that two open pursuits depend on.",
    recommendation:
      "Revise the week's priorities: resolve the fee with the city clerk before any municipal bid is submitted. Verify status directly with the issuing office.",
    sourceModule: "ComplianceConnect",
    sourceSignal: "Licensing tracker — action-needed flag",
    confidence: "High",
    detectedAgo: "3h ago",
    href: "/compliance-connect",
  },
  {
    id: "rose-comp-payment-bond",
    section: "compliance",
    verdict: "yellow",
    title: "Payment bond renewal window is tightening",
    subject: "Payment Bond — Keystone Surety (35 days)",
    rationale:
      "The surety has requested updated financials and the renewal clock overlaps two bonded pursuits in the pipeline. A lapse would pause bonded submissions.",
    recommendation:
      "Adjust the timeline: return the financial package this week and confirm continuation terms with the surety before the next bonded bid.",
    sourceModule: "ComplianceConnect",
    sourceSignal: "Bonding tracker — expiring flag",
    confidence: "High",
    detectedAgo: "1d ago",
    href: "/compliance-connect",
  },
  {
    id: "rose-comp-insurance",
    section: "compliance",
    verdict: "green",
    title: "Insurance posture supports current pursuit volume",
    subject: "GL / WC / Umbrella program",
    rationale:
      "All core policies are active with matching COIs on file, the experience mod sits at a favorable 0.92, and umbrella limits meet the highest owner requirement in the pipeline.",
    recommendation:
      "Proceed — no insurance-side constraint on active pursuits. Re-verify certificates at each award as standard practice.",
    sourceModule: "ComplianceConnect",
    sourceSignal: "Insurance readiness score",
    confidence: "High",
    detectedAgo: "2d ago",
    href: "/compliance-connect",
  },
  {
    id: "rose-comp-electrical",
    section: "compliance",
    verdict: "yellow",
    title: "Electrical license renewal gates permit eligibility",
    subject: "Electrical Trade License (45 days)",
    rationale:
      "The renewal window is open and electrical permit eligibility in the metro jurisdiction clears only once the license is renewed — one active job depends on it.",
    recommendation:
      "Adjust the filing order: submit the renewal ahead of the Harbor Point permit renewal so both clear in sequence.",
    sourceModule: "ComplianceConnect",
    sourceSignal: "Licensing tracker — expiring flag",
    confidence: "High",
    detectedAgo: "1d ago",
    href: "/compliance-connect",
  },
];

/* ------------------------------------------------------------------ */
/*  Executive Intelligence Summary                                     */
/* ------------------------------------------------------------------ */

export interface ExecutivePriority {
  id: string;
  verdict: Verdict;
  headline: string;
  detail: string;
  sourceModule: SourceModule;
  href: string;
}

export interface ExecutiveSummary {
  asOf: string;
  headline: string;
  narrative: string;
  postureLabel: string;
  posture: Verdict;
  priorities: ExecutivePriority[];
}

export const executiveSummary: ExecutiveSummary = {
  asOf: "Jul 1, 2025 9:41 AM",
  headline: "Portfolio posture: steady — two red-tier items need executive attention",
  narrative:
    "Across the connected modules, the pipeline and most active jobs are tracking inside plan. Two red-tier signals warrant attention this week: compounding margin fade at Cedar Ridge and a municipal-bid eligibility block from the unpaid business license fee. One high-fit market window (Denton hail corridor) is open for roughly 72 hours.",
  postureLabel: "Steady, with two escalations",
  posture: "yellow",
  priorities: [
    {
      id: "prio-cedar",
      verdict: "red",
      headline: "Contain Cedar Ridge margin fade before the storm window",
      detail: "Weather, sub slip, and fade trend are compounding on one job.",
      sourceModule: "BidIntelligenceOS",
      href: "/risk",
    },
    {
      id: "prio-license",
      verdict: "red",
      headline: "Clear the business-license fee blocking municipal bids",
      detail: "Eligibility lapses in 11 days; two pursuits depend on it.",
      sourceModule: "ComplianceConnect",
      href: "/compliance-connect",
    },
    {
      id: "prio-denton",
      verdict: "green",
      headline: "Move on the Denton hail corridor inside 72 hours",
      detail: "High-fit roofing window with moderate competition density.",
      sourceModule: "MarketWatchOS",
      href: "/market-watch",
    },
  ],
};

/* ------------------------------------------------------------------ */
/*  Section metadata                                                   */
/* ------------------------------------------------------------------ */

export interface RoseSectionMeta {
  key: Exclude<RoseSection, "executive">;
  label: string;
  description: string;
}

export const ROSE_SECTIONS: RoseSectionMeta[] = [
  {
    key: "bid-risk",
    label: "Bid Risk Review",
    description: "Every bid evaluated before submission — package strength, risk stack, and readiness.",
  },
  {
    key: "job-risk",
    label: "Job Risk Forecasting",
    description: "Live execution outlook across active jobs — margin fade, schedule, labor, and permits.",
  },
  {
    key: "market-strategy",
    label: "Market Strategy Insights",
    description: "Opportunity strength reviewed against capacity, readiness, and public market signals.",
  },
  {
    key: "compliance",
    label: "Compliance Watch",
    description: "Licensing, insurance, and bonding posture monitored against the active pipeline.",
  },
];

export function insightsBySection(
  section: Exclude<RoseSection, "executive">,
): RoseInsight[] {
  return roseInsights.filter((i) => i.section === section);
}

/* ------------------------------------------------------------------ */
/*  Derived verdict stats                                              */
/* ------------------------------------------------------------------ */

export interface RoseStats {
  total: number;
  green: number;
  yellow: number;
  red: number;
  modulesMonitored: number;
}

export const roseStats: RoseStats = {
  total: roseInsights.length,
  green: roseInsights.filter((i) => i.verdict === "green").length,
  yellow: roseInsights.filter((i) => i.verdict === "yellow").length,
  red: roseInsights.filter((i) => i.verdict === "red").length,
  modulesMonitored: 5,
};

export const ROSE_GUARDRAIL =
  "ROSEOS provides intelligence, not execution. Every verdict is decision-support only and requires human review before action — no bid, pricing, compliance, bonding, or award outcome is guaranteed, and no internal pricing formula is exposed.";
