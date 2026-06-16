export interface Bid {
  id: string;
  name: string;
  recipient: string;
  type: string;
  location: string;
  amount: number;
  date: string;
  status: "Draft" | "Submitted" | "Follow-Up Due" | "Shortlisted" | "Clarification Requested" | "Won" | "Lost" | "Withdrawn" | "No Decision" | "In Progress" | "Review";
  outcome?: "Won" | "Lost" | "No Decision";
  reason?: string;
  margin?: number;
  notes?: string;
  expectedDecisionDate?: string;
  contactPerson?: string;
  clarificationRequested?: boolean;
  lastTouch?: string;
  nextAction?: string;
  nextActionDate?: string;
  confidence?: number;
  fit?: number;
  riskScore?: number;
  publicPrivate?: "Public" | "Private";
  daysRemaining?: number;
}

export const seedBids: Bid[] = [
  {
    id: "1",
    name: "Commercial HVAC Retrofit",
    recipient: "Metro Facilities Group",
    publicPrivate: "Private",
    type: "HVAC",
    location: "Nashville, TN",
    amount: 4210000,
    date: "2025-05-28",
    daysRemaining: 8,
    status: "In Progress",
    fit: 92,
    confidence: 85,
    nextAction: "Submit clarifications",
    nextActionDate: "May 22",
  },
  {
    id: "2",
    name: "Roofing Replacement",
    recipient: "Atlanta Public Schools",
    publicPrivate: "Public",
    type: "Roofing",
    location: "Atlanta, GA",
    amount: 2870000,
    date: "2025-05-30",
    daysRemaining: 10,
    status: "In Progress",
    fit: 88,
    confidence: 72,
    nextAction: "Site visit follow-up",
    nextActionDate: "May 21",
  },
  {
    id: "3",
    name: "Concrete Repair",
    recipient: "Orange County BOCC",
    publicPrivate: "Public",
    type: "Concrete",
    location: "Orlando, FL",
    amount: 1980000,
    date: "2025-06-05",
    daysRemaining: 16,
    status: "Review",
    fit: 76,
    confidence: 60,
    nextAction: "Confirm scope",
    nextActionDate: "May 23",
  },
  {
    id: "4",
    name: "Multi-Location Maintenance",
    recipient: "National Retail Corp.",
    publicPrivate: "Private",
    type: "Facilities Maintenance",
    location: "Southeast Region",
    amount: 9680000,
    date: "2025-06-10",
    daysRemaining: 21,
    status: "In Progress",
    fit: 84,
    confidence: 78,
    nextAction: "Pricing strategy",
    nextActionDate: "May 26",
  }
];

export const followUpQueue = [
  { id: "1", client: "Metro Facilities Group", action: "Clarifications", priority: "High", date: "May 22" },
  { id: "2", client: "Atlanta Public Schools", action: "Site Visit Follow-Up", priority: "High", date: "May 21" },
  { id: "3", client: "Orange County BOCC", action: "Scope Confirmation", priority: "Medium", date: "May 23" },
  { id: "4", client: "National Retail Corp.", action: "Pricing Discussion", priority: "Medium", date: "May 26" }
];

export const competitorSignals = [
  { id: "1", name: "ABC Mechanical", activity: "Active in 3 bids", threat: "High", trend: "up" },
  { id: "2", name: "Titan Builders", activity: "Active in 2 bids", threat: "Medium", trend: "flat" },
  { id: "3", name: "Summit Roofing", activity: "Submitted 1 bid", threat: "High", trend: "up" },
  { id: "4", name: "ProConcrete Co.", activity: "Active in 1 bid", threat: "Low", trend: "down" }
];

export const documentReadiness = [
  { id: "1", name: "Bid Form", status: "complete" },
  { id: "2", name: "Insurance (ACORD)", status: "complete" },
  { id: "3", name: "Bonding", status: "complete" },
  { id: "4", name: "Safety Program", status: "complete" },
  { id: "5", name: "Financials", status: "complete" },
  { id: "6", name: "W-9", status: "warning" },
];

export const analyticsData = {
  winRateOverTime: [
    { month: "Jan", rate: 32 },
    { month: "Feb", rate: 35 },
    { month: "Mar", rate: 38 },
    { month: "Apr", rate: 34 },
    { month: "May", rate: 40 },
    { month: "Jun", rate: 42 },
    { month: "Jul", rate: 45 },
    { month: "Aug", rate: 41 },
    { month: "Sep", rate: 46 },
    { month: "Oct", rate: 48 },
    { month: "Nov", rate: 52 },
    { month: "Dec", rate: 55 }
  ],
  bidOutcomeTimeline: [
    { month: "Jun", won: 1.2, lost: 0.5, noDecision: 0.2 },
    { month: "Jul", won: 1.5, lost: 0.8, noDecision: 0.1 },
    { month: "Aug", won: 0.9, lost: 0.4, noDecision: 0.3 },
    { month: "Sep", won: 1.8, lost: 0.6, noDecision: 0.2 },
    { month: "Oct", won: 1.1, lost: 0.7, noDecision: 0.1 },
    { month: "Nov", won: 2.0, lost: 0.9, noDecision: 0.4 },
    { month: "Dec", won: 2.4, lost: 1.1, noDecision: 0.3 },
    { month: "Jan", won: 1.7, lost: 0.5, noDecision: 0.2 },
    { month: "Feb", won: 1.3, lost: 0.8, noDecision: 0.1 },
    { month: "Mar", won: 1.6, lost: 0.4, noDecision: 0.2 },
    { month: "Apr", won: 2.1, lost: 0.6, noDecision: 0.3 },
    { month: "May", won: 2.8, lost: 0.5, noDecision: 0.1 }
  ],
  marginTrend: [
    { month: "Jan", margin: 15.2 },
    { month: "Feb", margin: 15.8 },
    { month: "Mar", margin: 16.1 },
    { month: "Apr", margin: 16.5 },
    { month: "May", margin: 17.2 },
    { month: "Jun", margin: 18.6 }
  ],
  projectTypes: [
    { type: "HVAC", won: 12, lost: 4 },
    { type: "Electrical", won: 8, lost: 6 },
    { type: "Plumbing", won: 5, lost: 8 },
    { type: "Concrete", won: 7, lost: 2 },
    { type: "Roofing", won: 3, lost: 7 }
  ],
  lossReasons: [
    { reason: "Price too high", count: 14 },
    { reason: "Lack of specific experience", count: 6 },
    { reason: "Schedule mismatch", count: 4 },
    { reason: "Compliance/Bonding", count: 2 },
    { reason: "Incumbent preferred", count: 8 }
  ]
};
