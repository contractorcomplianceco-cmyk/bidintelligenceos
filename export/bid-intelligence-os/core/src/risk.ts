/* ------------------------------------------------------------------ */
/*  Risk & Change Orders                                               */
/*  Decision-support seed data. AI-detected signals are flagged for    */
/*  human review only — no guaranteed outcomes, no pricing formulas.   */
/* ------------------------------------------------------------------ */

export type RiskCategory = "Weather" | "Labor" | "Permit" | "Scope" | "Cost";
export type RiskSeverity = "Critical" | "High" | "Medium" | "Low";
export type RiskStatus = "Open" | "Mitigating" | "Resolved";
export type DetectionSource = "Risk Radar AI" | "Field report via VoiceConnect" | "PM review";

export interface RiskItem {
  id: string;
  category: RiskCategory;
  severity: RiskSeverity;
  jobId: string;
  jobName: string;
  title: string;
  description: string;
  detectedBy: DetectionSource;
  recommendedAction: string;
  status: RiskStatus;
  detectedAt: string;
  owner: string;
}

export const riskItems: RiskItem[] = [
  {
    id: "risk-cedar-rain",
    category: "Weather",
    severity: "Critical",
    jobId: "job-cedar",
    jobName: "Cedar Ridge Roof Replacement",
    title: "80% storm probability collides with dry-in window",
    description:
      "Wednesday storm probability is forecast at 80% during the scheduled south-building dry-in. An open deck exposes the interior to water intrusion and rework.",
    detectedBy: "Risk Radar AI",
    recommendedAction: "Flagged for review: shift dry-in to Friday and stage tarps for overnight protection.",
    status: "Mitigating",
    detectedAt: "2h ago",
    owner: "Priya Nair",
  },
  {
    id: "risk-northline-crane",
    category: "Weather",
    severity: "High",
    jobId: "job-northline",
    jobName: "Northline HVAC Retrofit",
    title: "Wind gusts threaten Thursday rooftop crane pick",
    description:
      "Gusts to 22 mph are forecast during the crane pick for the rooftop unit set. Rigging tolerances tighten sharply above 20 mph.",
    detectedBy: "Risk Radar AI",
    recommendedAction: "Flagged for review: confirm go/no-go with Summit Rigging by Wed 4 PM and hold a Friday backup slot.",
    status: "Open",
    detectedAt: "5h ago",
    owner: "Dana Whitfield",
  },
  {
    id: "risk-harbor-labor",
    category: "Labor",
    severity: "High",
    jobId: "job-harbor",
    jobName: "Harbor Point TI Electrical",
    title: "Lead journeyman overallocated at 104% utilization",
    description:
      "Grace Lin is booked across trim-out and the final inspection prep in the same window, driving utilization above 100% and risking a slipped inspection.",
    detectedBy: "Risk Radar AI",
    recommendedAction: "Flagged for review: pull available service tech Jesse Park to cover trim-out and protect the Jul 9 inspection.",
    status: "Open",
    detectedAt: "1d ago",
    owner: "Dana Whitfield",
  },
  {
    id: "risk-harbor-permit",
    category: "Permit",
    severity: "Critical",
    jobId: "job-harbor",
    jobName: "Harbor Point TI Electrical",
    title: "Electrical permit expires before final inspection",
    description:
      "The electrical permit expires Jul 12, four days after the requested final inspection. A lapse would force a re-submittal and stall energization.",
    detectedBy: "Risk Radar AI",
    recommendedAction: "Flagged for review: file the permit renewal now so it clears ahead of the final inspection request.",
    status: "Mitigating",
    detectedAt: "1d ago",
    owner: "Grace Lin",
  },
  {
    id: "risk-summit-scope",
    category: "Scope",
    severity: "High",
    jobId: "job-summit",
    jobName: "Summit Plaza Restoration",
    title: "Adjuster scope gap on Category 3 water extent",
    description:
      "Field moisture mapping shows affected drywall extending eight feet beyond the approved adjuster scope. Unapproved work would erode margin.",
    detectedBy: "Field report via VoiceConnect",
    recommendedAction: "Flagged for review: document with photos and submit a supplement before mitigation continues past the approved line.",
    status: "Open",
    detectedAt: "6h ago",
    owner: "Devon Clarke",
  },
  {
    id: "risk-gateway-cost",
    category: "Cost",
    severity: "Medium",
    jobId: "job-gateway",
    jobName: "Gateway Ventures Buildout",
    title: "MEP rough-in labor trending over plan",
    description:
      "Rough-in hours are running ahead of the planned burn curve. Sustained at this pace, projected margin drifts below the target band.",
    detectedBy: "Risk Radar AI",
    recommendedAction: "Flagged for review: rebalance the rough-in crew and confirm the inspection date to avoid idle standby.",
    status: "Mitigating",
    detectedAt: "3h ago",
    owner: "Hal Jennings",
  },
  {
    id: "risk-cedar-sub",
    category: "Labor",
    severity: "Medium",
    jobId: "job-cedar",
    jobName: "Cedar Ridge Roof Replacement",
    title: "Sheet metal sub reporting a schedule slip",
    description:
      "Titan Sheet Metal flagged a two-day slip on detailing crews, which could cascade into the dry-in sequence already under weather pressure.",
    detectedBy: "Field report via VoiceConnect",
    recommendedAction: "Flagged for review: sequence detailing behind the weather-cleared dry-in and confirm crew availability.",
    status: "Open",
    detectedAt: "8h ago",
    owner: "Sam Okafor",
  },
  {
    id: "risk-northline-scope",
    category: "Scope",
    severity: "Medium",
    jobId: "job-northline",
    jobName: "Northline HVAC Retrofit",
    title: "Rooftop structural review may add curb work",
    description:
      "The pending rooftop structural review could require additional curb reinforcement not carried in the base scope for two of the units.",
    detectedBy: "Risk Radar AI",
    recommendedAction: "Flagged for review: hold curb material commitment until the structural review returns, then price a change order if needed.",
    status: "Open",
    detectedAt: "1d ago",
    owner: "Marcus Ruiz",
  },
  {
    id: "risk-summit-permit",
    category: "Permit",
    severity: "High",
    jobId: "job-summit",
    jobName: "Summit Plaza Restoration",
    title: "Carrier sign-off blocking rebuild start",
    description:
      "Adjuster scope approval is blocked pending carrier sign-off. Rebuild crews cannot mobilize until the documentation clears.",
    detectedBy: "PM review",
    recommendedAction: "Flagged for review: escalate to the carrier desk and stage abatement so the rebuild can start on approval.",
    status: "Mitigating",
    detectedAt: "2d ago",
    owner: "Priya Nair",
  },
  {
    id: "risk-metro-cost",
    category: "Cost",
    severity: "Low",
    jobId: "job-metro",
    jobName: "Metro Retail Facilities Contract",
    title: "Travel cost creeping across multi-site routes",
    description:
      "Route mileage is trending slightly above plan across the 14-store contract, a minor pressure on the service margin.",
    detectedBy: "Risk Radar AI",
    recommendedAction: "Flagged for review: cluster service tickets by region to trim windshield time next cycle.",
    status: "Resolved",
    detectedAt: "3d ago",
    owner: "Dana Whitfield",
  },
  {
    id: "risk-gateway-weather",
    category: "Weather",
    severity: "Low",
    jobId: "job-gateway",
    jobName: "Gateway Ventures Buildout",
    title: "Heat index above 100 for exterior labor",
    description:
      "Heat index tops 100 Tue–Wed. Exterior framing crews face productivity loss and heat-safety exposure during afternoon hours.",
    detectedBy: "Risk Radar AI",
    recommendedAction: "Flagged for review: shift exterior labor to early mornings and add scheduled hydration breaks.",
    status: "Mitigating",
    detectedAt: "4h ago",
    owner: "Hal Jennings",
  },
];

/* ------------------------------------------------------------------ */
/*  Change Orders                                                      */
/* ------------------------------------------------------------------ */

export type ChangeOrderStatus = "Draft" | "Submitted" | "Approved" | "Disputed";

export interface ChangeOrder {
  id: string;
  coNumber: string;
  jobId: string;
  jobName: string;
  title: string;
  origin: string;
  amount: number;
  status: ChangeOrderStatus;
  daysPending: number;
  submittedTo: string;
  detectedBy: DetectionSource;
}

export const changeOrders: ChangeOrder[] = [
  {
    id: "co-summit-01",
    coNumber: "CO-2041",
    jobId: "job-summit",
    jobName: "Summit Plaza Restoration",
    title: "Cat-3 water extent supplement — added drywall & antimicrobial",
    origin: "Scope gap detected — flagged for review",
    amount: 18600,
    status: "Submitted",
    daysPending: 6,
    submittedTo: "Meridian Insurance",
    detectedBy: "Field report via VoiceConnect",
  },
  {
    id: "co-northline-01",
    coNumber: "CO-2038",
    jobId: "job-northline",
    jobName: "Northline HVAC Retrofit",
    title: "Rooftop curb reinforcement for units 3 & 4",
    origin: "Structural review finding — flagged for review",
    amount: 12400,
    status: "Draft",
    daysPending: 2,
    submittedTo: "Northline Medical Center",
    detectedBy: "Risk Radar AI",
  },
  {
    id: "co-harbor-01",
    coNumber: "CO-2033",
    jobId: "job-harbor",
    jobName: "Harbor Point TI Electrical",
    title: "Added circuits for tenant server room",
    origin: "Owner-requested change",
    amount: 9200,
    status: "Approved",
    daysPending: 0,
    submittedTo: "Harbor Point Developers",
    detectedBy: "PM review",
  },
  {
    id: "co-gateway-01",
    coNumber: "CO-2029",
    jobId: "job-gateway",
    jobName: "Gateway Ventures Buildout",
    title: "Revised MEP routing around relocated shear wall",
    origin: "Design conflict detected — flagged for review",
    amount: 24800,
    status: "Disputed",
    daysPending: 11,
    submittedTo: "Gateway Ventures",
    detectedBy: "Risk Radar AI",
  },
  {
    id: "co-cedar-01",
    coNumber: "CO-2044",
    jobId: "job-cedar",
    jobName: "Cedar Ridge Roof Replacement",
    title: "Deck repair — rotted sheathing discovered at tear-off",
    origin: "Field condition detected — flagged for review",
    amount: 7300,
    status: "Submitted",
    daysPending: 3,
    submittedTo: "Cedar Ridge Apartments",
    detectedBy: "Field report via VoiceConnect",
  },
  {
    id: "co-gateway-02",
    coNumber: "CO-2046",
    jobId: "job-gateway",
    jobName: "Gateway Ventures Buildout",
    title: "Upgraded lobby finishes per owner selection",
    origin: "Owner-requested change",
    amount: 15200,
    status: "Draft",
    daysPending: 1,
    submittedTo: "Gateway Ventures",
    detectedBy: "PM review",
  },
  {
    id: "co-harbor-02",
    coNumber: "CO-2036",
    jobId: "job-harbor",
    jobName: "Harbor Point TI Electrical",
    title: "Fire alarm device count increase per AHJ comment",
    origin: "Permit review finding — flagged for review",
    amount: 5400,
    status: "Approved",
    daysPending: 0,
    submittedTo: "Harbor Point Developers",
    detectedBy: "Risk Radar AI",
  },
  {
    id: "co-metro-01",
    coNumber: "CO-2049",
    jobId: "job-metro",
    jobName: "Metro Retail Facilities Contract",
    title: "Added rooftop unit replacement — store #7",
    origin: "Service ticket escalation",
    amount: 8900,
    status: "Submitted",
    daysPending: 4,
    submittedTo: "Metro Retail Group",
    detectedBy: "PM review",
  },
];

/* ------------------------------------------------------------------ */
/*  Profit Fade Signals                                               */
/* ------------------------------------------------------------------ */

export interface ProfitFadePoint {
  week: string;
  projected: number;
}

export interface ProfitFadeSignal {
  jobId: string;
  jobName: string;
  baselineMargin: number;
  currentMargin: number;
  fadeDrivers: string[];
  trend: ProfitFadePoint[];
}

export const profitFadeSignals: ProfitFadeSignal[] = [
  {
    jobId: "job-cedar",
    jobName: "Cedar Ridge Roof Replacement",
    baselineMargin: 25.0,
    currentMargin: 20.3,
    fadeDrivers: ["Weather standby days", "Deck repair rework", "Sub schedule slip"],
    trend: [
      { week: "Wk 1", projected: 25.0 },
      { week: "Wk 2", projected: 24.4 },
      { week: "Wk 3", projected: 23.1 },
      { week: "Wk 4", projected: 22.0 },
      { week: "Wk 5", projected: 21.2 },
      { week: "Wk 6", projected: 20.3 },
    ],
  },
  {
    jobId: "job-gateway",
    jobName: "Gateway Ventures Buildout",
    baselineMargin: 18.5,
    currentMargin: 15.9,
    fadeDrivers: ["MEP rough-in labor overrun", "Disputed change order", "Design rework"],
    trend: [
      { week: "Wk 1", projected: 18.5 },
      { week: "Wk 2", projected: 18.1 },
      { week: "Wk 3", projected: 17.4 },
      { week: "Wk 4", projected: 16.8 },
      { week: "Wk 5", projected: 16.3 },
      { week: "Wk 6", projected: 15.9 },
    ],
  },
  {
    jobId: "job-harbor",
    jobName: "Harbor Point TI Electrical",
    baselineMargin: 16.2,
    currentMargin: 14.4,
    fadeDrivers: ["Overtime on trim-out", "Permit renewal delay"],
    trend: [
      { week: "Wk 1", projected: 16.2 },
      { week: "Wk 2", projected: 15.9 },
      { week: "Wk 3", projected: 15.5 },
      { week: "Wk 4", projected: 15.1 },
      { week: "Wk 5", projected: 14.7 },
      { week: "Wk 6", projected: 14.4 },
    ],
  },
  {
    jobId: "job-northline",
    jobName: "Northline HVAC Retrofit",
    baselineMargin: 22.0,
    currentMargin: 21.1,
    fadeDrivers: ["Crane reschedule risk", "Pending curb change order"],
    trend: [
      { week: "Wk 1", projected: 22.0 },
      { week: "Wk 2", projected: 21.8 },
      { week: "Wk 3", projected: 21.6 },
      { week: "Wk 4", projected: 21.4 },
      { week: "Wk 5", projected: 21.2 },
      { week: "Wk 6", projected: 21.1 },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Aggregate Stats                                                   */
/* ------------------------------------------------------------------ */

export interface RiskStats {
  openRisks: number;
  highSeverity: number;
  mitigating: number;
  resolved: number;
  pendingChangeOrders: number;
  changeOrderValueAtStake: number;
  approvedChangeOrderValue: number;
  disputedChangeOrderValue: number;
  jobsWithProfitFade: number;
  avgMarginFade: number;
}

const openRisks = riskItems.filter((r) => r.status !== "Resolved").length;
const highSeverity = riskItems.filter(
  (r) => (r.severity === "Critical" || r.severity === "High") && r.status !== "Resolved"
).length;
const mitigating = riskItems.filter((r) => r.status === "Mitigating").length;
const resolved = riskItems.filter((r) => r.status === "Resolved").length;

const pendingCOs = changeOrders.filter(
  (c) => c.status === "Draft" || c.status === "Submitted"
);
const changeOrderValueAtStake = pendingCOs.reduce((s, c) => s + c.amount, 0);
const approvedChangeOrderValue = changeOrders
  .filter((c) => c.status === "Approved")
  .reduce((s, c) => s + c.amount, 0);
const disputedChangeOrderValue = changeOrders
  .filter((c) => c.status === "Disputed")
  .reduce((s, c) => s + c.amount, 0);

const avgMarginFade =
  profitFadeSignals.reduce((s, p) => s + (p.baselineMargin - p.currentMargin), 0) /
  profitFadeSignals.length;

export const riskStats: RiskStats = {
  openRisks,
  highSeverity,
  mitigating,
  resolved,
  pendingChangeOrders: pendingCOs.length,
  changeOrderValueAtStake,
  approvedChangeOrderValue,
  disputedChangeOrderValue,
  jobsWithProfitFade: profitFadeSignals.length,
  avgMarginFade,
};
