import { VerticalId } from "./verticals";

/* ------------------------------------------------------------------ */
/*  Bid DNA — learning engine seed data                                */
/*                                                                     */
/*  Decision-support only. These figures reflect historical           */
/*  estimate-vs-actual outcomes captured from completed jobs and are   */
/*  surfaced to guide human review. No internal pricing formula or     */
/*  margin strategy is represented here.                               */
/* ------------------------------------------------------------------ */

export type LearningStatus = "applied" | "suggested" | "under-review";
export type ConfidenceLevel = "High" | "Medium" | "Low";

/* ------------------------------------------------------------------ */
/*  Per job-type estimate-vs-actual profiles                           */
/* ------------------------------------------------------------------ */

export interface BidDnaProfile {
  id: string;
  jobType: string;
  vertical: VerticalId;
  /** Number of completed jobs contributing to this profile */
  sampleSize: number;
  estimatedCost: number;
  actualCost: number;
  estimatedHours: number;
  actualHours: number;
  estimatedDurationDays: number;
  actualDurationDays: number;
  /** Positive = actual over estimate (under-bid); negative = came in under */
  costVariancePct: number;
  hoursVariancePct: number;
  durationVariancePct: number;
  /** Blended estimate accuracy % for the most recent quarter */
  currentAccuracy: number;
  /** Accuracy % across the last 6 quarters (oldest → newest) */
  accuracyTrend: number[];
  topDriver: string;
}

export const bidDnaProfiles: BidDnaProfile[] = [
  {
    id: "dna-hvac-rooftop",
    jobType: "HVAC Rooftop Retrofit",
    vertical: "hvac",
    sampleSize: 34,
    estimatedCost: 598000,
    actualCost: 641200,
    estimatedHours: 1820,
    actualHours: 2010,
    estimatedDurationDays: 78,
    actualDurationDays: 86,
    costVariancePct: 7.2,
    hoursVariancePct: 10.4,
    durationVariancePct: 10.3,
    currentAccuracy: 91.4,
    accuracyTrend: [79.2, 81.6, 84.1, 86.9, 89.3, 91.4],
    topDriver: "Crane/rigging time on rooftop unit sets",
  },
  {
    id: "dna-roof-tearoff",
    jobType: "Commercial Re-Roof / Tear-Off",
    vertical: "roofing",
    sampleSize: 41,
    estimatedCost: 372000,
    actualCost: 389400,
    estimatedHours: 1140,
    actualHours: 1226,
    estimatedDurationDays: 42,
    actualDurationDays: 49,
    costVariancePct: 4.7,
    hoursVariancePct: 7.5,
    durationVariancePct: 16.7,
    currentAccuracy: 88.6,
    accuracyTrend: [72.4, 76.8, 80.3, 83.5, 86.2, 88.6],
    topDriver: "Weather-driven schedule slippage on dry-in",
  },
  {
    id: "dna-elec-ti",
    jobType: "Electrical Tenant Improvement",
    vertical: "electrical",
    sampleSize: 29,
    estimatedCost: 233000,
    actualCost: 228700,
    estimatedHours: 1460,
    actualHours: 1502,
    estimatedDurationDays: 64,
    actualDurationDays: 66,
    costVariancePct: -1.8,
    hoursVariancePct: 2.9,
    durationVariancePct: 3.1,
    currentAccuracy: 93.8,
    accuracyTrend: [83.1, 85.4, 88.0, 90.2, 92.1, 93.8],
    topDriver: "Gear lead-time buffers now well calibrated",
  },
  {
    id: "dna-resto-mit",
    jobType: "Water Mitigation & Rebuild",
    vertical: "restoration",
    sampleSize: 22,
    estimatedCost: 198000,
    actualCost: 214600,
    estimatedHours: 980,
    actualHours: 1094,
    estimatedDurationDays: 58,
    actualDurationDays: 71,
    costVariancePct: 8.4,
    hoursVariancePct: 11.6,
    durationVariancePct: 22.4,
    currentAccuracy: 82.3,
    accuracyTrend: [68.9, 71.2, 74.8, 77.6, 80.1, 82.3],
    topDriver: "Carrier supplement approval cycle time",
  },
  {
    id: "dna-gc-buildout",
    jobType: "GC Ground-Up Buildout",
    vertical: "gc",
    sampleSize: 18,
    estimatedCost: 968000,
    actualCost: 1024300,
    estimatedHours: 4200,
    actualHours: 4515,
    estimatedDurationDays: 210,
    actualDurationDays: 231,
    costVariancePct: 5.8,
    hoursVariancePct: 7.5,
    durationVariancePct: 10.0,
    currentAccuracy: 86.9,
    accuracyTrend: [74.5, 77.9, 80.6, 83.1, 85.0, 86.9],
    topDriver: "MEP rough-in coordination & inspection holds",
  },
  {
    id: "dna-facility-svc",
    jobType: "Facility Service Contract",
    vertical: "facility",
    sampleSize: 47,
    estimatedCost: 405000,
    actualCost: 396800,
    estimatedHours: 2600,
    actualHours: 2548,
    estimatedDurationDays: 365,
    actualDurationDays: 365,
    costVariancePct: -2.0,
    hoursVariancePct: -2.0,
    durationVariancePct: 0,
    currentAccuracy: 94.6,
    accuracyTrend: [86.2, 88.1, 90.0, 91.8, 93.2, 94.6],
    topDriver: "Route density & first-time-fix rate stable",
  },
];

/* ------------------------------------------------------------------ */
/*  Learned adjustments feed                                           */
/* ------------------------------------------------------------------ */

export interface DnaLearning {
  id: string;
  title: string;
  detail: string;
  jobType: string;
  vertical: VerticalId;
  confidence: ConfidenceLevel;
  status: LearningStatus;
  /** Estimated adjustment magnitude, framed as a directional signal */
  adjustment: string;
  sampleSize: number;
  /** Related deployment for cross-linking realism */
  relatedJob?: string;
  discovered: string;
  category: string;
}

export const dnaLearnings: DnaLearning[] = [
  {
    id: "learn-1",
    title: "HVAC rooftop jobs: crane time consistently underestimated ~12%",
    detail:
      "Across 34 completed rooftop retrofits, crane and rigging hours ran ~12% above estimate — most often on multi-unit sets requiring a second pick. Suggested adjustment surfaced for estimator review before the next similar bid.",
    jobType: "HVAC Rooftop Retrofit",
    vertical: "hvac",
    confidence: "High",
    status: "applied",
    adjustment: "+12% crane/rigging hours",
    sampleSize: 34,
    relatedJob: "Northline HVAC Retrofit",
    discovered: "Jun 18, 2025",
    category: "Labor / Equipment",
  },
  {
    id: "learn-2",
    title: "Roofing dry-in: weather buffer too thin in Q2/Q3",
    detail:
      "Tear-off and dry-in phases slipped an average of 7 days in spring/summer bids where fewer than 2 rain-contingency days were carried. Recommend reviewing weather buffers on weather-sensitive roofing scopes.",
    jobType: "Commercial Re-Roof / Tear-Off",
    vertical: "roofing",
    confidence: "High",
    status: "applied",
    adjustment: "+2 weather-contingency days",
    sampleSize: 41,
    relatedJob: "Cedar Ridge Roof Replacement",
    discovered: "May 30, 2025",
    category: "Schedule / Weather",
  },
  {
    id: "learn-3",
    title: "Restoration: supplement approval cycle drives duration overruns",
    detail:
      "Rebuild duration ran ~22% over on claims where carrier supplement approval exceeded 10 business days. Signal suggests carrying an approval-cycle assumption line for adjuster-dependent scopes.",
    jobType: "Water Mitigation & Rebuild",
    vertical: "restoration",
    confidence: "Medium",
    status: "suggested",
    adjustment: "+10 day approval assumption",
    sampleSize: 22,
    relatedJob: "Summit Plaza Restoration",
    discovered: "Jun 24, 2025",
    category: "Schedule / Documentation",
  },
  {
    id: "learn-4",
    title: "Electrical TI: gear lead-time buffers now well-calibrated",
    detail:
      "After adding a 3-week gear lead-time buffer last year, material-driven delays dropped to near zero across 29 jobs. Model recommends retaining the current assumption — no change needed.",
    jobType: "Electrical Tenant Improvement",
    vertical: "electrical",
    confidence: "High",
    status: "applied",
    adjustment: "Retain 3-wk gear buffer",
    sampleSize: 29,
    relatedJob: "Harbor Point TI Electrical",
    discovered: "Apr 12, 2025",
    category: "Materials / Procurement",
  },
  {
    id: "learn-5",
    title: "GC buildouts: MEP rough-in coordination adds hidden hours",
    detail:
      "Rough-in phases on multi-trade buildouts averaged ~7.5% more field hours than estimated, concentrated around inspection re-work. Under review pending a larger sample before it is suggested to estimators.",
    jobType: "GC Ground-Up Buildout",
    vertical: "gc",
    confidence: "Medium",
    status: "under-review",
    adjustment: "+7.5% rough-in labor",
    sampleSize: 18,
    relatedJob: "Gateway Ventures Buildout",
    discovered: "Jun 8, 2025",
    category: "Labor / Coordination",
  },
  {
    id: "learn-6",
    title: "Facility contracts: route density estimates are reliable",
    detail:
      "Recurring service contracts landed within 2% of estimate across 47 renewals. First-time-fix and route density assumptions are holding — flagged as a positive benchmark for similar bids.",
    jobType: "Facility Service Contract",
    vertical: "facility",
    confidence: "High",
    status: "applied",
    adjustment: "No change — benchmark",
    sampleSize: 47,
    relatedJob: "Metro Retail Facilities Contract",
    discovered: "Mar 20, 2025",
    category: "Productivity",
  },
  {
    id: "learn-7",
    title: "Roofing disposal weight underestimated on older decks",
    detail:
      "Tear-offs over saturated or multi-layer decks generated ~15% more disposal tonnage than estimated. Signal suggests a deck-condition question during intake to sharpen disposal line items.",
    jobType: "Commercial Re-Roof / Tear-Off",
    vertical: "roofing",
    confidence: "Low",
    status: "under-review",
    adjustment: "+15% disposal tonnage",
    sampleSize: 41,
    discovered: "Jun 27, 2025",
    category: "Materials / Disposal",
  },
];

/* ------------------------------------------------------------------ */
/*  Estimate accuracy over time (portfolio blended)                    */
/* ------------------------------------------------------------------ */

export interface AccuracyPoint {
  quarter: string;
  /** Overall estimate accuracy % (100 - mean abs variance) */
  accuracy: number;
  /** Mean absolute cost variance % (lower is better) */
  costVariance: number;
  /** Number of completed jobs analyzed that quarter */
  jobsAnalyzed: number;
}

export const estimateAccuracySeries: AccuracyPoint[] = [
  { quarter: "Q1 '24", accuracy: 77.8, costVariance: 14.2, jobsAnalyzed: 19 },
  { quarter: "Q2 '24", accuracy: 80.4, costVariance: 12.1, jobsAnalyzed: 24 },
  { quarter: "Q3 '24", accuracy: 83.1, costVariance: 10.3, jobsAnalyzed: 27 },
  { quarter: "Q4 '24", accuracy: 85.6, costVariance: 8.7, jobsAnalyzed: 31 },
  { quarter: "Q1 '25", accuracy: 87.9, costVariance: 7.4, jobsAnalyzed: 33 },
  { quarter: "Q2 '25", accuracy: 90.2, costVariance: 6.1, jobsAnalyzed: 38 },
];

/* ------------------------------------------------------------------ */
/*  Headline stats                                                     */
/* ------------------------------------------------------------------ */

export interface DnaStats {
  overallAccuracy: number;
  accuracyDeltaQoQ: number;
  jobsAnalyzed: number;
  activeLearnings: number;
  suggestedLearnings: number;
  underReviewLearnings: number;
  /** Percentage-point improvement in mean margin-of-error since baseline */
  marginOfErrorImprovement: number;
}

export const dnaStats: DnaStats = {
  overallAccuracy: 90.2,
  accuracyDeltaQoQ: 2.3,
  jobsAnalyzed: 191,
  activeLearnings: dnaLearnings.filter((l) => l.status === "applied").length,
  suggestedLearnings: dnaLearnings.filter((l) => l.status === "suggested").length,
  underReviewLearnings: dnaLearnings.filter((l) => l.status === "under-review").length,
  marginOfErrorImprovement: 8.1,
};

/* ------------------------------------------------------------------ */
/*  How Bid DNA works — explainer steps                                */
/* ------------------------------------------------------------------ */

export interface DnaStep {
  key: string;
  label: string;
  description: string;
}

export const dnaSteps: DnaStep[] = [
  {
    key: "capture",
    label: "Capture",
    description:
      "Every completed job feeds actual cost, hours, and duration back into the profile for its job type.",
  },
  {
    key: "compare",
    label: "Compare",
    description:
      "Actuals are measured against the original estimate to surface where and by how much a bid drifted.",
  },
  {
    key: "learn",
    label: "Learn",
    description:
      "Repeating patterns become learned adjustments with a confidence level and a clear sample size.",
  },
  {
    key: "apply",
    label: "Apply (with review)",
    description:
      "Suggestions are surfaced for an estimator to accept, adjust, or dismiss — never applied automatically.",
  },
];
