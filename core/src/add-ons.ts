/**
 * Add-On marketplace catalog for BidIntelligenceOS.
 *
 * Add-ons are separate, independently licensed products that connect into the
 * OS. Each entry describes how the add-on captures field data and what it feeds
 * back INTO BidIntelligenceOS. `iconKey` is a lucide key mapped at render time.
 */
export type AddOnStatus = "connected" | "coming-soon";

export interface AddOn {
  id: string;
  name: string;
  tagline: string;
  description: string;
  /** Brand accent hex for the add-on */
  color: string;
  /** lucide icon key mapped at render time */
  iconKey: string;
  status: AddOnStatus;
  href: string;
  /** What the add-on does */
  capabilities: string[];
  /** What the add-on feeds INTO BidIntelligenceOS */
  dataFlows: string[];
}

export const ADD_ONS: AddOn[] = [
  {
    id: "voice-connect",
    name: "VoiceConnect",
    tagline: "Capture it. Connect it. Build it.",
    description:
      "The voice-first field companion. Walk a site, talk through what you see, and VoiceConnect transcribes, tags, and hands it off as a draft bid — no typing required.",
    color: "#0BA3A8",
    iconKey: "mic",
    status: "connected",
    href: "/voice-connect",
    capabilities: [
      "Hands-free voice capture",
      "Field notes & photo tagging",
      "Risk & red-flag detection",
      "Scope extraction",
    ],
    dataFlows: [
      "Draft bids ready for review",
      "Tagged field notes & photos",
      "Risk flags & missing-info lists",
      "Extracted scope items",
    ],
  },
  {
    id: "video-connect",
    name: "VideoConnect",
    tagline: "Walk it on video. Let the OS read the room.",
    description:
      "Video walkthrough capture with visual intelligence. Record a site walkthrough and VideoConnect detects conditions, damage, and scope, then drafts a walkthrough-to-bid package for review.",
    color: "#7C3AED",
    iconKey: "video",
    status: "connected",
    href: "/video-connect",
    capabilities: [
      "Video walkthrough capture",
      "Visual intelligence & tagging",
      "Damage & condition detection",
      "Automatic documentation generation",
    ],
    dataFlows: [
      "Walkthrough-to-bid drafts",
      "Detected damage & condition notes",
      "Visual scope item lists",
      "Auto-generated documentation packets",
    ],
  },
  {
    id: "competitor-watch",
    name: "CompetitorWatchOS",
    tagline: "Understand lawful market signals so you can position smarter.",
    description:
      "An upcoming intelligence add-on that helps contractors understand lawful, public competitor and market signals — award history, pricing pressure, and competitor presence — without exposing internal strategy.",
    color: "#A855F7",
    iconKey: "crosshair",
    status: "coming-soon",
    href: "/competitor-watch",
    capabilities: [
      "Public bid award tracking",
      "Competitor presence mapping",
      "Pricing pressure signals",
      "Win/loss positioning guidance",
    ],
    dataFlows: [
      "Market positioning suggestions",
      "Public award benchmarks",
      "Regional competitor context",
      "Win/loss learning signals",
    ],
  },
  {
    id: "build-connect",
    name: "BuildConnect",
    tagline: "Win as the prime. Execute through the network.",
    description:
      "The subcontractor network for BidIntelligenceOS. Match won jobs to vetted trade subs, track availability and assignments, and score performance and reliability over time — no self-perform required.",
    color: "#F97316",
    iconKey: "network",
    status: "connected",
    href: "/build-connect",
    capabilities: [
      "Subcontractor marketplace & trade matching",
      "Job assignment & availability tracking",
      "Bid-per-sub and negotiation tracking",
      "Performance & reliability scoring",
    ],
    dataFlows: [
      "Matched sub shortlists for won jobs",
      "Sub availability for scheduling",
      "Performance scores into Labor & Subs",
      "Negotiated sub pricing context",
    ],
  },
  {
    id: "compliance-connect",
    name: "ComplianceConnect",
    tagline: "Stay bid-ready. Stay audit-ready.",
    description:
      "Licensing, insurance, and bond tracking that keeps your compliance posture bid-ready. Readiness scoring flags gaps before they block a bid, a permit, or an audit.",
    color: "#059669",
    iconKey: "shield-check",
    status: "connected",
    href: "/compliance-connect",
    capabilities: [
      "License, insurance & bond tracking",
      "Compliance readiness scoring",
      "Audit readiness checklists",
      "Permit readiness tracking",
    ],
    dataFlows: [
      "Compliance readiness flags on bids",
      "Expiration alerts into Alerts",
      "Permit readiness into Permits & Documents",
      "Bond capacity context for bid decisions",
    ],
  },
  {
    id: "market-watch",
    name: "MarketWatchOS",
    tagline: "Find the work before it hits the street.",
    description:
      "The Opportunity Radar engine. MarketWatchOS scans lawful, public signals — storm events, permit spikes, RFP releases, material and labor shifts — and turns them into scored, trade-specific opportunity alerts that feed straight into your bid pipeline.",
    color: "#F59E0B",
    iconKey: "line-chart",
    status: "connected",
    href: "/market-watch",
    capabilities: [
      "Job signals: storm damage, permit spikes, claim surges",
      "Bid signals: RFP/RFQ releases & bid windows",
      "Market signals: material, labor & sub availability shifts",
      "Scored opportunity alerts (0–100) by trade & region",
    ],
    dataFlows: [
      "High-opportunity alerts into Command Center",
      "Scored leads into the bid pipeline",
      "Regional demand heat for bid/no-bid decisions",
      "Material & labor cost movement warnings",
    ],
  },
];

export function getAddOn(id: string): AddOn | undefined {
  return ADD_ONS.find((a) => a.id === id);
}
