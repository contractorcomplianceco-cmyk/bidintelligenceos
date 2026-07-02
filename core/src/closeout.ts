import { VerticalId } from "./verticals";

/* ------------------------------------------------------------------ */
/*  Job Closeout                                                       */
/* ------------------------------------------------------------------ */

export type CloseoutStage =
  | "Punch List"
  | "Documentation"
  | "Final Billing"
  | "Warranty"
  | "Complete";

export const CLOSEOUT_STAGES: CloseoutStage[] = [
  "Punch List",
  "Documentation",
  "Final Billing",
  "Warranty",
  "Complete",
];

export type RetainageStatus = "Held" | "Requested" | "Released";

export type PunchStatus = "Open" | "In Progress" | "Verified" | "Closed";

export interface FeedsBidDna {
  /** One-line takeaway that trains future estimates for this job type */
  headline: string;
  /** Estimate vs actual highlight rows that flow into Bid DNA */
  estimateVsActual: {
    label: string;
    estimated: number;
    actual: number;
    /** positive = came in under estimate, negative = overran */
    variancePct: number;
  }[];
  /** Qualitative learnings captured for the estimating library */
  learnings: string[];
}

export interface CloseoutJob {
  id: string;
  /** Links back to jobDeployments where applicable */
  deploymentId?: string;
  name: string;
  client: string;
  location: string;
  vertical: VerticalId;
  contractValue: number;
  completion: number;
  stage: CloseoutStage;
  stageIndex: number;
  projectManager: string;
  substantialCompletion: string;
  targetCloseout: string;
  projectedRoi: number;
  finalRoi: number;
  punchItemsRemaining: number;
  retainageAmount: number;
  retainageStatus: RetainageStatus;
  changeOrdersValue: number;
  docsComplete: number;
  docsTotal: number;
  feedsBidDna: FeedsBidDna;
}

export const closeoutJobs: CloseoutJob[] = [
  {
    id: "co-riverside",
    name: "Riverside Distribution Center",
    client: "Lonestar Logistics",
    location: "San Marcos, TX",
    vertical: "gc",
    contractValue: 1180000,
    completion: 100,
    stage: "Warranty",
    stageIndex: 3,
    projectManager: "Marcus Ruiz",
    substantialCompletion: "May 30, 2025",
    targetCloseout: "Jul 15, 2025",
    projectedRoi: 17.5,
    finalRoi: 19.2,
    punchItemsRemaining: 2,
    retainageAmount: 59000,
    retainageStatus: "Requested",
    changeOrdersValue: 46800,
    docsComplete: 4,
    docsTotal: 5,
    feedsBidDna: {
      headline:
        "Tilt-up warehouse shells are estimating ~2 pts conservative on concrete — tighten the placement crew productivity assumption.",
      estimateVsActual: [
        { label: "Concrete / Flatwork", estimated: 268000, actual: 251400, variancePct: 6.2 },
        { label: "Subcontractors", estimated: 402000, actual: 418900, variancePct: -4.2 },
        { label: "General Conditions", estimated: 94000, actual: 88600, variancePct: 5.7 },
      ],
      learnings: [
        "Change order recovery hit 100% — early RFI logging paid off on this delivery method.",
        "Sub buyout on structural steel ran hot; flag mill lead times earlier in the estimate.",
      ],
    },
  },
  {
    id: "co-oakwell",
    deploymentId: "job-harbor",
    name: "Oakwell Medical Office TI",
    client: "Oakwell Health Partners",
    location: "Round Rock, TX",
    vertical: "electrical",
    contractValue: 412000,
    completion: 98,
    stage: "Documentation",
    stageIndex: 1,
    projectManager: "Dana Whitfield",
    substantialCompletion: "Jun 18, 2025",
    targetCloseout: "Jul 22, 2025",
    projectedRoi: 15.8,
    finalRoi: 14.1,
    punchItemsRemaining: 6,
    retainageAmount: 20600,
    retainageStatus: "Held",
    changeOrdersValue: 12400,
    docsComplete: 2,
    docsTotal: 5,
    feedsBidDna: {
      headline:
        "Healthcare TI gear lead times pushed labor into overtime — bump the schedule contingency for permitted medical scopes.",
      estimateVsActual: [
        { label: "Labor", estimated: 96000, actual: 104300, variancePct: -8.6 },
        { label: "Gear & Fixtures", estimated: 88000, actual: 90100, variancePct: -2.4 },
        { label: "Materials", estimated: 52000, actual: 49200, variancePct: 5.4 },
      ],
      learnings: [
        "Switchgear arrived 3 weeks late — model longer procurement windows for medical TI bids.",
        "Low-voltage rough-in beat estimate; the prefab assumption is holding across recent jobs.",
      ],
    },
  },
  {
    id: "co-maplecrest",
    name: "Maplecrest Apartments Re-Roof",
    client: "Maplecrest Residential",
    location: "Pflugerville, TX",
    vertical: "roofing",
    contractValue: 528000,
    completion: 100,
    stage: "Final Billing",
    stageIndex: 2,
    projectManager: "Priya Nair",
    substantialCompletion: "Jun 6, 2025",
    targetCloseout: "Jul 10, 2025",
    projectedRoi: 18.9,
    finalRoi: 16.4,
    punchItemsRemaining: 3,
    retainageAmount: 26400,
    retainageStatus: "Held",
    changeOrdersValue: 21900,
    docsComplete: 3,
    docsTotal: 5,
    feedsBidDna: {
      headline:
        "Weather delays trimmed squares-per-day — raise the rain-contingency factor for summer multifamily re-roofs.",
      estimateVsActual: [
        { label: "Labor", estimated: 132000, actual: 148700, variancePct: -12.7 },
        { label: "Materials", estimated: 176000, actual: 171200, variancePct: 2.7 },
        { label: "Disposal", estimated: 22000, actual: 24800, variancePct: -12.7 },
      ],
      learnings: [
        "Two rain-outs added crew days — the productivity assumption was optimistic for June.",
        "Manufacturer warranty registration slowed billing; pre-stage the paperwork at dry-in.",
      ],
    },
  },
  {
    id: "co-summit-plaza",
    deploymentId: "job-summit",
    name: "Summit Plaza Water Restoration",
    client: "Meridian Insurance (Claim #RS-40912)",
    location: "Austin, TX",
    vertical: "restoration",
    contractValue: 274000,
    completion: 100,
    stage: "Complete",
    stageIndex: 4,
    projectManager: "Devon Clarke",
    substantialCompletion: "May 14, 2025",
    targetCloseout: "Jun 20, 2025",
    projectedRoi: 22.5,
    finalRoi: 24.8,
    punchItemsRemaining: 0,
    retainageAmount: 0,
    retainageStatus: "Released",
    changeOrdersValue: 38200,
    docsComplete: 5,
    docsTotal: 5,
    feedsBidDna: {
      headline:
        "Supplement recovery outperformed — thorough moisture documentation is a repeatable margin driver on carrier work.",
      estimateVsActual: [
        { label: "Labor", estimated: 78000, actual: 71400, variancePct: 8.5 },
        { label: "Supplements", estimated: 30000, actual: 38200, variancePct: 27.3 },
        { label: "Subcontractors", estimated: 62000, actual: 58900, variancePct: 5.0 },
      ],
      learnings: [
        "Daily moisture logs unlocked a full supplement approval — bake this into the estimate scope.",
        "Abatement sub came in under quote; keep PureAir on the preferred bidder list.",
      ],
    },
  },
  {
    id: "co-northgate",
    name: "Northgate Retail HVAC Upgrade",
    client: "Northgate Property Group",
    location: "Georgetown, TX",
    vertical: "hvac",
    contractValue: 356000,
    completion: 96,
    stage: "Punch List",
    stageIndex: 0,
    projectManager: "Dana Whitfield",
    substantialCompletion: "Jun 24, 2025",
    targetCloseout: "Aug 1, 2025",
    projectedRoi: 20.2,
    finalRoi: 18.7,
    punchItemsRemaining: 9,
    retainageAmount: 17800,
    retainageStatus: "Held",
    changeOrdersValue: 9600,
    docsComplete: 1,
    docsTotal: 5,
    feedsBidDna: {
      headline:
        "Controls commissioning ran long — add commissioning hours for multi-RTU retail packages.",
      estimateVsActual: [
        { label: "Equipment", estimated: 148000, actual: 149900, variancePct: -1.3 },
        { label: "Labor", estimated: 84000, actual: 91200, variancePct: -8.6 },
        { label: "Subcontractors", estimated: 46000, actual: 44100, variancePct: 4.1 },
      ],
      learnings: [
        "Balancing and controls startup exceeded the plan — the commissioning line item is too thin.",
        "Crane pick landed on schedule; the weather-window assumption held for rooftop sets.",
      ],
    },
  },
];

/* ------------------------------------------------------------------ */
/*  Punch List                                                        */
/* ------------------------------------------------------------------ */

export interface PunchListItem {
  id: string;
  jobId: string;
  jobName: string;
  item: string;
  trade: string;
  status: PunchStatus;
  assignee: string;
  priority: "Low" | "Medium" | "High";
  dueDate: string;
}

export const punchListItems: PunchListItem[] = [
  { id: "pl-1", jobId: "co-northgate", jobName: "Northgate Retail HVAC Upgrade", item: "Rebalance RTU-3 supply air to spec", trade: "HVAC", status: "In Progress", assignee: "Marcus Ruiz", priority: "High", dueDate: "Jul 8, 2025" },
  { id: "pl-2", jobId: "co-northgate", jobName: "Northgate Retail HVAC Upgrade", item: "Seal roof curb penetration at unit 5", trade: "Roofing", status: "Open", assignee: "Sam Okafor", priority: "Medium", dueDate: "Jul 9, 2025" },
  { id: "pl-3", jobId: "co-northgate", jobName: "Northgate Retail HVAC Upgrade", item: "Program thermostat schedules per tenant", trade: "Controls", status: "Open", assignee: "Nina Petrov", priority: "Medium", dueDate: "Jul 11, 2025" },
  { id: "pl-4", jobId: "co-oakwell", jobName: "Oakwell Medical Office TI", item: "Replace two scuffed cover plates in exam 4", trade: "Electrical", status: "Verified", assignee: "Grace Lin", priority: "Low", dueDate: "Jul 7, 2025" },
  { id: "pl-5", jobId: "co-oakwell", jobName: "Oakwell Medical Office TI", item: "Correct panel schedule labeling", trade: "Electrical", status: "In Progress", assignee: "Omar Haddad", priority: "Medium", dueDate: "Jul 10, 2025" },
  { id: "pl-6", jobId: "co-oakwell", jobName: "Oakwell Medical Office TI", item: "Touch-up paint at data closet", trade: "General", status: "Open", assignee: "Carla Mendez", priority: "Low", dueDate: "Jul 12, 2025" },
  { id: "pl-7", jobId: "co-maplecrest", jobName: "Maplecrest Apartments Re-Roof", item: "Re-seat coping cap at building C parapet", trade: "Sheet Metal", status: "In Progress", assignee: "Titan Sheet Metal", priority: "High", dueDate: "Jul 6, 2025" },
  { id: "pl-8", jobId: "co-maplecrest", jobName: "Maplecrest Apartments Re-Roof", item: "Clear debris from three roof drains", trade: "Roofing", status: "Open", assignee: "Luis Marin", priority: "Medium", dueDate: "Jul 7, 2025" },
  { id: "pl-9", jobId: "co-maplecrest", jobName: "Maplecrest Apartments Re-Roof", item: "Document final flashing detail photos", trade: "Roofing", status: "Verified", assignee: "Priya Nair", priority: "Low", dueDate: "Jul 5, 2025" },
  { id: "pl-10", jobId: "co-riverside", jobName: "Riverside Distribution Center", item: "Adjust dock leveler at bay 12", trade: "Specialty", status: "In Progress", assignee: "Hal Jennings", priority: "Medium", dueDate: "Jul 9, 2025" },
  { id: "pl-11", jobId: "co-riverside", jobName: "Riverside Distribution Center", item: "Final GFI test at exterior receptacles", trade: "Electrical", status: "Open", assignee: "Apex Electrical", priority: "Low", dueDate: "Jul 11, 2025" },
];

/* ------------------------------------------------------------------ */
/*  Documentation Checklist                                           */
/* ------------------------------------------------------------------ */

export type DocStatus = "Complete" | "In Review" | "Pending" | "Blocked";

export interface CloseoutChecklistItem {
  id: string;
  requirement: string;
  description: string;
  /** Doc status keyed per job id */
  statusByJob: Record<string, DocStatus>;
}

/** Ordered doc requirements every closed job must clear before final release */
export const closeoutChecklist: CloseoutChecklistItem[] = [
  {
    id: "doc-asbuilt",
    requirement: "As-Built Drawings",
    description: "Field-verified redlines reflecting installed conditions.",
    statusByJob: {
      "co-riverside": "Complete",
      "co-oakwell": "In Review",
      "co-maplecrest": "Complete",
      "co-summit-plaza": "Complete",
      "co-northgate": "Pending",
    },
  },
  {
    id: "doc-warranty",
    requirement: "Manufacturer & Labor Warranties",
    description: "Registered product warranties plus workmanship coverage letters.",
    statusByJob: {
      "co-riverside": "Complete",
      "co-oakwell": "Pending",
      "co-maplecrest": "In Review",
      "co-summit-plaza": "Complete",
      "co-northgate": "Pending",
    },
  },
  {
    id: "doc-lien",
    requirement: "Lien Waivers",
    description: "Final unconditional waivers from all subs and suppliers.",
    statusByJob: {
      "co-riverside": "In Review",
      "co-oakwell": "Pending",
      "co-maplecrest": "Complete",
      "co-summit-plaza": "Complete",
      "co-northgate": "Pending",
    },
  },
  {
    id: "doc-om",
    requirement: "O&M Manuals",
    description: "Operations & maintenance manuals and equipment cut sheets.",
    statusByJob: {
      "co-riverside": "Complete",
      "co-oakwell": "In Review",
      "co-maplecrest": "Complete",
      "co-summit-plaza": "Complete",
      "co-northgate": "Blocked",
    },
  },
  {
    id: "doc-inspection",
    requirement: "Final Inspection Sign-Offs",
    description: "AHJ final inspection cards and certificate of occupancy.",
    statusByJob: {
      "co-riverside": "Complete",
      "co-oakwell": "Pending",
      "co-maplecrest": "In Review",
      "co-summit-plaza": "Complete",
      "co-northgate": "Pending",
    },
  },
];

/* ------------------------------------------------------------------ */
/*  Stats                                                             */
/* ------------------------------------------------------------------ */

export interface CloseoutStats {
  jobsInCloseout: number;
  punchItemsOpen: number;
  retainageOutstanding: number;
  avgFinalRoi: number;
  avgProjectedRoi: number;
  docsCompletePct: number;
  jobsFeedingBidDna: number;
}

export const closeoutStats: CloseoutStats = (() => {
  const jobsInCloseout = closeoutJobs.filter((j) => j.stage !== "Complete").length;
  const punchItemsOpen = punchListItems.filter(
    (p) => p.status === "Open" || p.status === "In Progress"
  ).length;
  const retainageOutstanding = closeoutJobs
    .filter((j) => j.retainageStatus !== "Released")
    .reduce((s, j) => s + j.retainageAmount, 0);
  const avgFinalRoi =
    closeoutJobs.reduce((s, j) => s + j.finalRoi, 0) / (closeoutJobs.length || 1);
  const avgProjectedRoi =
    closeoutJobs.reduce((s, j) => s + j.projectedRoi, 0) / (closeoutJobs.length || 1);
  const docsComplete = closeoutJobs.reduce((s, j) => s + j.docsComplete, 0);
  const docsTotal = closeoutJobs.reduce((s, j) => s + j.docsTotal, 0);
  const docsCompletePct = docsTotal ? (docsComplete / docsTotal) * 100 : 0;
  return {
    jobsInCloseout,
    punchItemsOpen,
    retainageOutstanding,
    avgFinalRoi,
    avgProjectedRoi,
    docsCompletePct,
    jobsFeedingBidDna: closeoutJobs.length,
  };
})();

/** Estimate-vs-actual roll-up per closed job for the Bid DNA feed chart */
export const bidDnaFeedSeries = closeoutJobs.map((j) => ({
  name: j.name.split(" ").slice(0, 2).join(" "),
  projected: j.projectedRoi,
  final: j.finalRoi,
  jobId: j.id,
}));
