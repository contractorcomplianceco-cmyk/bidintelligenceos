/**
 * AI / automation capabilities surfaced across BidIntelligenceOS.
 * All are decision-support and require user review before client-facing export.
 * `icon` is a lucide key mapped at render time; `route` links to where the
 * capability is surfaced in the app (when applicable).
 */
export interface AiFeature {
  id: string;
  name: string;
  icon: string;
  summary: string;
  capabilities: string[];
  /** In-app route where this is surfaced, if any */
  route?: string;
  note?: string;
}

export const AI_FEATURES: AiFeature[] = [
  {
    id: "walkthrough-to-bid",
    name: "Walkthrough-to-Bid AI",
    icon: "mic",
    summary: "Turns VoiceConnect site notes, photos, risks, and questions into a bid-ready draft.",
    capabilities: [
      "Scope draft",
      "Missing information list",
      "Risk flags",
      "Bid readiness score",
      "Clarification questions",
      "Bid package outline",
    ],
    route: "/voice-connect",
  },
  {
    id: "market-price-intelligence",
    name: "Market Price Intelligence",
    icon: "trending-up",
    summary: "Prototype market signals for material and labor pricing decisions.",
    capabilities: [
      "Material price movement",
      "Labor rate assumptions",
      "Regional pricing pressure",
      "Lead-time warnings",
      "Volatility flags",
      "Market benchmark range",
    ],
    route: "/cost-inputs",
    note: "Market data shown is for decision-support only and should be verified before submission.",
  },
  {
    id: "sub-quote-tracker",
    name: "Sub Quote Tracker",
    icon: "clipboard-list",
    summary: "Tracks subcontractor quotes from invite to award.",
    capabilities: [
      "Subs invited",
      "Quotes received",
      "Missing quotes",
      "Quote expiration",
      "Scope exclusions",
      "Price variance",
      "Reliability score",
    ],
    route: "/labor",
  },
  {
    id: "bid-leveling",
    name: "Bid Leveling Assistant",
    icon: "scale",
    summary: "Compares subcontractor bids apples-to-apples for GC use cases.",
    capabilities: [
      "Compare subcontractor bids",
      "Highlight missing inclusions",
      "Flag exclusions",
      "Detect unusual price spread",
      "Recommend clarification questions",
    ],
    route: "/bids",
  },
  {
    id: "scope-gap-detector",
    name: "Scope Gap Detector",
    icon: "search-check",
    summary: "Finds the holes in a scope before they become change orders.",
    capabilities: [
      "Missing spec sections",
      "Unanswered RFI items",
      "Permit issues",
      "Long-lead materials",
      "Weather-sensitive work",
      "Exclusions that should be disclosed",
    ],
    route: "/scope-analyzer",
  },
  {
    id: "change-order-detector",
    name: "Change Order Detector",
    icon: "file-diff",
    summary: "Flags field notes on won jobs that may indicate scope creep.",
    capabilities: [
      "Flags field notes that may indicate scope creep",
      "Suggests change order language",
      "Links photo / voice proof",
      "Marks client approval status",
    ],
    route: "/cost-roi",
  },
  {
    id: "profit-fade-alerts",
    name: "Profit Fade Alerts",
    icon: "trending-down",
    summary: "Warns when margin is drifting before it disappears.",
    capabilities: [
      "Labor burn rate is high",
      "Subs exceed budget",
      "Materials exceed estimate",
      "Weather delays affect labor cost",
      "Change orders are not captured",
      "ROI is drifting down",
    ],
    route: "/cost-roi",
  },
  {
    id: "follow-up-intelligence",
    name: "Follow-Up Intelligence",
    icon: "bell-ring",
    summary: "Tells you when, who, and what to follow up on.",
    capabilities: [
      "When to follow up",
      "Who to contact",
      "What to say",
      "What bid risk to address",
      "Whether to send clarification, revised pricing, or value-add note",
    ],
    route: "/",
  },
  {
    id: "client-update-generator",
    name: "Client Update Generator",
    icon: "mail",
    summary: "Drafts client-ready communications you review before sending.",
    capabilities: [
      "Bid follow-up emails",
      "Project status reports",
      "Weather delay notices",
      "Permit delay updates",
      "Change order notices",
      "Completion summaries",
    ],
    route: "/briefings",
    note: "All generated content requires review before it is sent or exported.",
  },
  {
    id: "win-loss-learning",
    name: "Win/Loss Learning Loop",
    icon: "brain",
    summary: "Turns outcomes into better future recommendations.",
    capabilities: [
      "Captures reason won / lost",
      "Compares estimated vs actual cost",
      "Learns by industry, project type, client, region, and trade",
      "Improves future recommendations",
    ],
    route: "/analytics",
  },
];
