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
    id: "market-watch",
    name: "MarketWatchOS",
    tagline: "Read regional market pressure before you commit bid resources.",
    description:
      "An upcoming market-intelligence add-on that surfaces regional pricing trends, demand heat, material cost signals, and sub availability from lawful, public data — so you can time bids and protect margin.",
    color: "#F59E0B",
    iconKey: "line-chart",
    status: "coming-soon",
    href: "/market-watch",
    capabilities: [
      "Regional pricing trends",
      "Demand heat by trade & region",
      "Material cost signals",
      "Subcontractor availability signals",
    ],
    dataFlows: [
      "Regional pricing context for estimates",
      "Demand heat for bid/no-bid decisions",
      "Material cost movement warnings",
      "Sub availability inputs",
    ],
  },
];

export function getAddOn(id: string): AddOn | undefined {
  return ADD_ONS.find((a) => a.id === id);
}
