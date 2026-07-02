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
  {
    id: "video-walkthrough-to-bid",
    name: "Walkthrough-to-Bid AI",
    icon: "video",
    summary: "Turns VideoConnect site walkthroughs into a bid-ready draft with visual scope and detected conditions.",
    capabilities: [
      "Visual scope extraction",
      "Damage & condition detection",
      "Auto documentation packet",
      "Missing information list",
      "Risk flags",
      "Bid readiness score",
    ],
    route: "/video-connect",
    note: "Draft output requires review before any bid is built or exported. No outcome is guaranteed.",
  },
  {
    id: "sub-intelligence",
    name: "Sub Intelligence",
    icon: "users",
    summary: "Decision-support view of subcontractor coverage, reliability, and scope fit across a bid.",
    capabilities: [
      "Sub coverage by trade",
      "Reliability & performance signals",
      "Scope gap & exclusion flags",
      "Quote completeness",
      "Suggested clarification questions",
    ],
    route: "/labor",
    note: "Signals are decision-support only and should be verified with your own judgment.",
  },
  {
    id: "market-pricing-intelligence",
    name: "Market Pricing Intelligence",
    icon: "trending-up",
    summary: "Directional market pricing context built from lawful, public signals to inform estimate assumptions.",
    capabilities: [
      "Regional pricing pressure",
      "Material cost movement",
      "Labor rate assumptions",
      "Lead-time & volatility warnings",
      "Public benchmark ranges",
    ],
    route: "/market-watch",
    note: "Uses lawful, public data only. Provided for decision-support and must be verified before submission.",
  },
  {
    id: "bid-simulation-engine",
    name: "Bid Simulation Engine",
    icon: "sliders",
    summary: "Explore how pricing, margin, and scope assumptions change outcomes before you commit.",
    capabilities: [
      "Margin scenario modeling",
      "Pricing sensitivity ranges",
      "Scope inclusion trade-offs",
      "Win-likelihood context",
      "Assumption stress tests",
    ],
    route: "/analytics",
    note: "Simulations are illustrative decision-support. Underlying formulas are not exposed and no outcome is guaranteed.",
  },
  {
    id: "followup-intelligence",
    name: "Follow-Up Intelligence",
    icon: "bell-ring",
    summary: "Prioritizes when, who, and what to follow up on across active bids and won jobs.",
    capabilities: [
      "When to follow up",
      "Who to contact",
      "What to say",
      "Which bid risk to address",
      "Suggested next action",
    ],
    route: "/briefings",
    note: "Suggestions are decision-support and require review before any client-facing action.",
  },
];
