export interface Bid {
  id: string;
  name: string;
  recipient: string;
  type: string;
  location: string;
  amount: number;
  date: string;
  status: "Draft" | "Submitted" | "Follow-Up Due" | "Shortlisted" | "Clarification Requested" | "Won" | "Lost" | "Withdrawn" | "No Decision";
  outcome?: "Won" | "Lost" | "No Decision";
  reason?: string;
  margin?: number;
  notes?: string;
  expectedDecisionDate?: string;
  contactPerson?: string;
  clarificationRequested?: boolean;
  lastTouch?: string;
  nextAction?: string;
  confidence?: number;
  riskScore?: number;
}

export const seedBids: Bid[] = [
  {
    id: "1",
    name: "Commercial HVAC Retrofit - Downtown Tower",
    recipient: "Regional Property Manager",
    type: "HVAC",
    location: "Seattle, WA",
    amount: 145000,
    date: "2023-10-15",
    status: "Won",
    outcome: "Won",
    reason: "Competitive pricing and timeline",
    margin: 22,
    notes: "Client appreciated our detailed scope breakdown.",
    expectedDecisionDate: "2023-11-01",
    contactPerson: "Jane Smith",
    clarificationRequested: false,
    lastTouch: "2023-10-25",
    nextAction: "Project Kickoff",
    confidence: 95,
    riskScore: 20
  },
  {
    id: "2",
    name: "Roofing Replacement Phase 2",
    recipient: "Commercial Building Owner",
    type: "Roofing",
    location: "Bellevue, WA",
    amount: 85000,
    date: "2023-09-02",
    status: "Lost",
    outcome: "Lost",
    reason: "Price too high",
    margin: 18,
    notes: "Competitor came in 15% lower.",
    expectedDecisionDate: "2023-09-20",
    contactPerson: "Robert Jones",
    clarificationRequested: false,
    lastTouch: "2023-09-18",
    nextAction: "Post-Loss Review",
    confidence: 40,
    riskScore: 60
  },
  {
    id: "3",
    name: "Electrical Tenant Improvement - Tech Office",
    recipient: "General Contractor",
    type: "Electrical",
    location: "Redmond, WA",
    amount: 210000,
    date: "2023-11-20",
    status: "Submitted",
    notes: "Awaiting GC feedback.",
    expectedDecisionDate: "2023-12-15",
    contactPerson: "Alice Wong",
    clarificationRequested: false,
    lastTouch: "2023-11-28",
    nextAction: "Follow up on pricing",
    confidence: 75,
    riskScore: 35
  },
  {
    id: "4",
    name: "Multi-location Maintenance Contract",
    recipient: "Franchise Operator",
    type: "Facilities Maintenance",
    location: "WA & OR",
    amount: 450000,
    date: "2023-12-05",
    status: "Shortlisted",
    notes: "Final presentation next week.",
    expectedDecisionDate: "2023-12-20",
    contactPerson: "Mark Davis",
    clarificationRequested: true,
    lastTouch: "2023-12-10",
    nextAction: "Prepare presentation",
    confidence: 85,
    riskScore: 45
  },
  {
    id: "5",
    name: "Concrete Repair - City Plaza",
    recipient: "Municipal Facilities Office",
    type: "Concrete",
    location: "Tacoma, WA",
    amount: 65000,
    date: "2023-08-10",
    status: "Won",
    outcome: "Won",
    reason: "Prior relationship and compliance",
    margin: 25,
    notes: "City required specific bonding which we had.",
    expectedDecisionDate: "2023-09-01",
    contactPerson: "Sarah Johnson",
    clarificationRequested: false,
    lastTouch: "2023-08-25",
    nextAction: "Execute Contract",
    confidence: 90,
    riskScore: 15
  },
  {
    id: "6",
    name: "Terminal B Plumbing Upgrade",
    recipient: "Port Authority",
    type: "Plumbing",
    location: "SeaTac, WA",
    amount: 320000,
    date: "2023-12-08",
    status: "Follow-Up Due",
    notes: "Waiting on spec clarification.",
    expectedDecisionDate: "2024-01-15",
    contactPerson: "Tom Wilson",
    clarificationRequested: true,
    lastTouch: "2023-12-12",
    nextAction: "Submit RFI #2",
    confidence: 60,
    riskScore: 55
  }
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
