/**
 * BuildConnect — subcontractor network module seed data.
 *
 * BuildConnect is a connected add-on for BidIntelligenceOS built on a
 * NO-SELF-PERFORM model: the prime contractor wins the bid and the vetted
 * trade network executes the work. All scores below are decision-support
 * signals derived from recorded job history — not guarantees. Contractors
 * verify licensing and insurance (via ComplianceConnect) before any award.
 */

export type SubAvailability = "available" | "booked-until" | "limited";
export type RateSignal = "competitive" | "market" | "premium";

export interface NetworkSub {
  id: string;
  company: string;
  trade: string;
  region: string;
  availability: SubAvailability;
  /** Date paired with availability (e.g. "booked-until" → return date) */
  availabilityDate?: string;
  /** 0-100 decision-support score from recorded delivery history */
  performanceScore: number;
  /** 0-100 decision-support score from recorded reliability history */
  reliabilityScore: number;
  jobsCompleted: number;
  avgResponseHrs: number;
  rateSignal: RateSignal;
  certifications: string[];
  activeAssignments: number;
}

export const networkSubs: NetworkSub[] = [
  {
    id: "sub-titan",
    company: "Titan Sheet Metal",
    trade: "Roofing",
    region: "Cedar Park, TX",
    availability: "available",
    performanceScore: 91,
    reliabilityScore: 88,
    jobsCompleted: 214,
    avgResponseHrs: 3,
    rateSignal: "market",
    certifications: ["OSHA 30", "Fall Protection", "Manufacturer Certified"],
    activeAssignments: 2,
  },
  {
    id: "sub-summit-mech",
    company: "Summit Mechanical",
    trade: "HVAC",
    region: "Austin, TX",
    availability: "limited",
    availabilityDate: "Partial crews thru Jul 18",
    performanceScore: 87,
    reliabilityScore: 92,
    jobsCompleted: 178,
    avgResponseHrs: 4,
    rateSignal: "premium",
    certifications: ["EPA 608", "NATE", "OSHA 30"],
    activeAssignments: 3,
  },
  {
    id: "sub-apex",
    company: "Apex Electrical",
    trade: "Electrical",
    region: "Round Rock, TX",
    availability: "available",
    performanceScore: 94,
    reliabilityScore: 90,
    jobsCompleted: 302,
    avgResponseHrs: 2,
    rateSignal: "competitive",
    certifications: ["Master License", "OSHA 30", "NFPA 70E"],
    activeAssignments: 2,
  },
  {
    id: "sub-trueline",
    company: "TrueLine Plumbing",
    trade: "Plumbing",
    region: "Austin, TX",
    availability: "booked-until",
    availabilityDate: "Jul 22, 2025",
    performanceScore: 85,
    reliabilityScore: 83,
    jobsCompleted: 156,
    avgResponseHrs: 5,
    rateSignal: "market",
    certifications: ["Master Plumber License", "Backflow Certified", "OSHA 10"],
    activeAssignments: 1,
  },
  {
    id: "sub-bedrock",
    company: "Bedrock Concrete",
    trade: "Concrete",
    region: "Georgetown, TX",
    availability: "available",
    performanceScore: 82,
    reliabilityScore: 79,
    jobsCompleted: 121,
    avgResponseHrs: 6,
    rateSignal: "competitive",
    certifications: ["ACI Flatwork Finisher", "OSHA 30"],
    activeAssignments: 0,
  },
  {
    id: "sub-cleanline",
    company: "CleanLine Drywall",
    trade: "Drywall",
    region: "Pflugerville, TX",
    availability: "limited",
    availabilityDate: "1 crew open next week",
    performanceScore: 78,
    reliabilityScore: 81,
    jobsCompleted: 98,
    avgResponseHrs: 7,
    rateSignal: "competitive",
    certifications: ["OSHA 10", "Level 5 Finish Certified"],
    activeAssignments: 1,
  },
  {
    id: "sub-beacon",
    company: "Beacon Fire & Alarm",
    trade: "Fire & Alarm",
    region: "Galveston, TX",
    availability: "available",
    performanceScore: 89,
    reliabilityScore: 86,
    jobsCompleted: 143,
    avgResponseHrs: 4,
    rateSignal: "premium",
    certifications: ["NICET II", "OSHA 30", "State Fire License"],
    activeAssignments: 1,
  },
  {
    id: "sub-pureair",
    company: "PureAir Abatement",
    trade: "Abatement",
    region: "Austin, TX",
    availability: "booked-until",
    availabilityDate: "Jul 15, 2025",
    performanceScore: 84,
    reliabilityScore: 88,
    jobsCompleted: 87,
    avgResponseHrs: 5,
    rateSignal: "market",
    certifications: ["EPA RRP", "IICRC", "OSHA 30"],
    activeAssignments: 2,
  },
  {
    id: "sub-summit-rig",
    company: "Summit Rigging",
    trade: "Crane / Rigging",
    region: "Northline, TX",
    availability: "limited",
    availabilityDate: "Weather-dependent picks only",
    performanceScore: 76,
    reliabilityScore: 72,
    jobsCompleted: 64,
    avgResponseHrs: 8,
    rateSignal: "premium",
    certifications: ["NCCCO Certified", "OSHA 30", "Rigging Level II"],
    activeAssignments: 1,
  },
  {
    id: "sub-greenscape",
    company: "GreenScape Grounds",
    trade: "Sitework",
    region: "Multi-site, TX",
    availability: "available",
    performanceScore: 80,
    reliabilityScore: 84,
    jobsCompleted: 132,
    avgResponseHrs: 6,
    rateSignal: "competitive",
    certifications: ["OSHA 10", "SWPPP Certified"],
    activeAssignments: 0,
  },
];

export type AssignmentStatus =
  | "matched"
  | "negotiating"
  | "assigned"
  | "in-progress";

export interface SubAssignment {
  id: string;
  jobName: string;
  sub: string;
  trade: string;
  status: AssignmentStatus;
  bidAmount: number;
  negotiationNote: string;
}

export const subAssignments: SubAssignment[] = [
  {
    id: "asn-1",
    jobName: "Northline HVAC Retrofit",
    sub: "Apex Electrical",
    trade: "Electrical",
    status: "in-progress",
    bidAmount: 84500,
    negotiationNote:
      "Awarded at market rate. COI verified via ComplianceConnect before mobilization.",
  },
  {
    id: "asn-2",
    jobName: "Cedar Ridge Roof Replacement",
    sub: "Titan Sheet Metal",
    trade: "Roofing",
    status: "assigned",
    bidAmount: 52200,
    negotiationNote:
      "Scope and schedule confirmed. Awaiting weather window before tear-off.",
  },
  {
    id: "asn-3",
    jobName: "Gateway Ventures Buildout",
    sub: "TrueLine Plumbing",
    trade: "Plumbing",
    status: "negotiating",
    bidAmount: 96400,
    negotiationNote:
      "Sub proposed +4% for expedited top-out. Reviewing against recorded market range.",
  },
  {
    id: "asn-4",
    jobName: "Summit Plaza Restoration",
    sub: "PureAir Abatement",
    trade: "Abatement",
    status: "matched",
    bidAmount: 31500,
    negotiationNote:
      "Shortlisted from trade match. Pending availability confirmation and license check.",
  },
  {
    id: "asn-5",
    jobName: "Harbor Point TI Electrical",
    sub: "Beacon Fire & Alarm",
    trade: "Fire & Alarm",
    status: "matched",
    bidAmount: 27600,
    negotiationNote:
      "Matched on region + certification fit. Requesting formal quote for review.",
  },
];

export interface TradeDemandRow {
  trade: string;
  openJobs: number;
  availableSubs: number;
  demandLevel: "high" | "balanced" | "low";
  note: string;
}

export const tradeDemand: TradeDemandRow[] = [
  {
    trade: "Roofing",
    openJobs: 4,
    availableSubs: 1,
    demandLevel: "high",
    note: "Storm-season backlog outpacing available crews.",
  },
  {
    trade: "HVAC",
    openJobs: 3,
    availableSubs: 1,
    demandLevel: "high",
    note: "Retrofit demand steady; premium crews limited.",
  },
  {
    trade: "Electrical",
    openJobs: 2,
    availableSubs: 1,
    demandLevel: "balanced",
    note: "Coverage healthy across the region.",
  },
  {
    trade: "Plumbing",
    openJobs: 2,
    availableSubs: 0,
    demandLevel: "high",
    note: "Top-tier subs booked through mid-July.",
  },
  {
    trade: "Concrete",
    openJobs: 1,
    availableSubs: 1,
    demandLevel: "balanced",
    note: "Flatwork capacity available on short notice.",
  },
  {
    trade: "Drywall",
    openJobs: 1,
    availableSubs: 1,
    demandLevel: "low",
    note: "Ample capacity; competitive rate signals.",
  },
];
