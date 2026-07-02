/**
 * MarketWatchOS — LIVE Opportunity Radar seed data for BidIntelligenceOS.
 *
 * MarketWatchOS is a real-time job + bid opportunity DETECTION engine (not an
 * analytics dashboard). It scans lawful, PUBLIC signals — storm events, permit
 * spikes, insurance claim surges, RFP releases, contract expirations, material
 * price moves, labor shortages, and regional booms — and turns them into scored,
 * trade-specific opportunity alerts that feed the bid pipeline.
 *
 * GUARDRAILS: All signals are drawn from lawful, public sources only. Every
 * score is decision-support scoring — no outcome is guaranteed. Competition
 * density reflects public activity signals only. No internal pricing formula is
 * exposed.
 */

export type AlertLevel = "high" | "medium" | "critical-window";
export type RegionHeat = "low" | "building" | "hot" | "surging";
export type CompetitionDensity = "low" | "moderate" | "high";
export type SignalType = "job" | "bid" | "market";

export interface RadarAlert {
  id: string;
  level: AlertLevel;
  title: string;
  summary: string;
  /** Decision-support opportunity score, 0-100 */
  opportunityScore: number;
  trade: string;
  region: string;
  regionHeat: RegionHeat;
  /** Derived from public activity signals only */
  competitionDensity: CompetitionDensity;
  urgency: string;
  signalType: SignalType;
  /** Public data source note */
  source: string;
  detectedAgo: string;
  suggestedAction: string;
}

export type SignalTrend = "up" | "down" | "steady";

export interface SignalSummary {
  label: string;
  currentReading: string;
  trend: SignalTrend;
}

export const radarAlerts: RadarAlert[] = [
  {
    id: "rw-1",
    level: "critical-window",
    title: "Hail corridor confirmed — Denton County",
    summary:
      "NWS confirmed 1.75\" hail across a dense residential + light-commercial corridor. Roofing and exterior claim activity typically spikes within 10-14 days.",
    opportunityScore: 94,
    trade: "Roofing",
    region: "Denton County, TX",
    regionHeat: "surging",
    competitionDensity: "moderate",
    urgency: "Act within 72 hrs — early canvassers move first",
    signalType: "job",
    source: "NWS storm reports + public damage survey",
    detectedAgo: "2 hrs ago",
    suggestedAction: "Stage roofing crews and route inspection leads to bid pipeline",
  },
  {
    id: "rw-2",
    level: "critical-window",
    title: "Federal HVAC modernization RFP released",
    summary:
      "SAM.gov posting for a multi-building mechanical modernization at a regional VA campus. Pre-bid conference in 6 days; proposals due in 21 days.",
    opportunityScore: 89,
    trade: "HVAC",
    region: "San Antonio, TX",
    regionHeat: "hot",
    competitionDensity: "high",
    urgency: "Pre-bid registration closes in 6 days",
    signalType: "bid",
    source: "SAM.gov posting (public solicitation)",
    detectedAgo: "5 hrs ago",
    suggestedAction: "Register for pre-bid and open a government bid workspace",
  },
  {
    id: "rw-3",
    level: "high",
    title: "Commercial permit spike — East Austin",
    summary:
      "Municipal permit feed shows a 38% MoM jump in commercial TI and shell permits across three ZIP codes — a leading indicator of GC and electrical demand.",
    opportunityScore: 82,
    trade: "General Contracting",
    region: "Austin, TX",
    regionHeat: "hot",
    competitionDensity: "moderate",
    urgency: "Position over next 2-3 weeks as projects release",
    signalType: "job",
    source: "Municipal permit feed (open records)",
    detectedAgo: "8 hrs ago",
    suggestedAction: "Add region to watch list and prep GC capability packet",
  },
  {
    id: "rw-4",
    level: "high",
    title: "Insurance claim surge — flood restoration",
    summary:
      "Public catastrophe bulletins indicate a claim surge after regional flooding. Water mitigation and restoration demand is building faster than local capacity.",
    opportunityScore: 86,
    trade: "Restoration",
    region: "Houston, TX",
    regionHeat: "surging",
    competitionDensity: "moderate",
    urgency: "Mitigation windows close fast — respond this week",
    signalType: "job",
    source: "State catastrophe bulletin + NWS flood data",
    detectedAgo: "11 hrs ago",
    suggestedAction: "Confirm crew availability and flag IICRC-ready subs",
  },
  {
    id: "rw-5",
    level: "critical-window",
    title: "Municipal facilities contract expiring",
    summary:
      "A citywide facilities maintenance contract is approaching expiration; renewal solicitation historically posts ~45 days prior. Incumbent recompete window opening.",
    opportunityScore: 84,
    trade: "Facilities",
    region: "Round Rock, TX",
    regionHeat: "building",
    competitionDensity: "high",
    urgency: "Solicitation expected within ~45 days",
    signalType: "bid",
    source: "Public contract registry (expiration record)",
    detectedAgo: "1 day ago",
    suggestedAction: "Draft capability statement and set solicitation alert",
  },
  {
    id: "rw-6",
    level: "high",
    title: "School district electrical RFQ posted",
    summary:
      "ISD published an RFQ for electrical upgrades across four campuses under a bond program. Qualification package due before bid invitations issue.",
    opportunityScore: 79,
    trade: "Electrical",
    region: "Fort Worth, TX",
    regionHeat: "hot",
    competitionDensity: "high",
    urgency: "Qualification package due in 12 days",
    signalType: "bid",
    source: "District procurement portal (public RFQ)",
    detectedAgo: "1 day ago",
    suggestedAction: "Assemble prequal docs and route to bid pipeline",
  },
  {
    id: "rw-7",
    level: "medium",
    title: "Steel & metal deck prices easing",
    summary:
      "Public producer price indices show structural steel and metal deck softening for a second month — a favorable input-cost signal for near-term GC bids.",
    opportunityScore: 68,
    trade: "General Contracting",
    region: "Regional / Texas",
    regionHeat: "building",
    competitionDensity: "moderate",
    urgency: "Reflect in assumptions on active estimates",
    signalType: "market",
    source: "BLS producer price index (public)",
    detectedAgo: "1 day ago",
    suggestedAction: "Review estimate assumptions for steel-heavy scopes",
  },
  {
    id: "rw-8",
    level: "medium",
    title: "Skilled electrical labor tightening",
    summary:
      "Public labor market data shows rising electrician job postings and wage pressure in the metro — a signal to lock subs early on upcoming electrical work.",
    opportunityScore: 64,
    trade: "Electrical",
    region: "Austin, TX",
    regionHeat: "hot",
    competitionDensity: "high",
    urgency: "Secure sub commitments before pipeline fills",
    signalType: "market",
    source: "BLS + public job-posting aggregates",
    detectedAgo: "2 days ago",
    suggestedAction: "Reserve electrical sub capacity via BuildConnect",
  },
  {
    id: "rw-9",
    level: "high",
    title: "Wind event — commercial roof demand",
    summary:
      "NWS storm data shows a straight-line wind event across a warehouse/industrial belt. Commercial roofing and envelope repair demand is building.",
    opportunityScore: 81,
    trade: "Roofing",
    region: "Waco, TX",
    regionHeat: "surging",
    competitionDensity: "low",
    urgency: "Low local competition — move within the week",
    signalType: "job",
    source: "NWS storm data (public)",
    detectedAgo: "2 days ago",
    suggestedAction: "Target industrial property managers with inspection offers",
  },
  {
    id: "rw-10",
    level: "medium",
    title: "Data-center construction boom",
    summary:
      "Public rezoning and site-plan filings point to a cluster of data-center projects — a multi-year MEP, electrical, and GC demand driver for the region.",
    opportunityScore: 72,
    trade: "General Contracting",
    region: "New Braunfels, TX",
    regionHeat: "building",
    competitionDensity: "moderate",
    urgency: "Long-lead — begin positioning now",
    signalType: "market",
    source: "County site-plan filings (open records)",
    detectedAgo: "3 days ago",
    suggestedAction: "Build relationships with named developers early",
  },
  {
    id: "rw-11",
    level: "high",
    title: "Healthcare TI permit cluster",
    summary:
      "Municipal permit feed shows multiple medical office tenant-improvement permits filed by one developer — recurring HVAC and electrical scope likely.",
    opportunityScore: 77,
    trade: "HVAC",
    region: "Cedar Park, TX",
    regionHeat: "hot",
    competitionDensity: "moderate",
    urgency: "Reach out before GC awards subs",
    signalType: "job",
    source: "Municipal permit feed (open records)",
    detectedAgo: "3 days ago",
    suggestedAction: "Identify the GC of record and pitch mechanical scope",
  },
  {
    id: "rw-12",
    level: "medium",
    title: "State disaster relief RFP wave",
    summary:
      "State procurement calendar signals an upcoming wave of disaster-recovery construction solicitations with set-aside components for smaller firms.",
    opportunityScore: 70,
    trade: "General Contracting",
    region: "Statewide, TX",
    regionHeat: "building",
    competitionDensity: "high",
    urgency: "Confirm registrations before wave opens",
    signalType: "bid",
    source: "State procurement calendar (public)",
    detectedAgo: "4 days ago",
    suggestedAction: "Verify SAM.gov registration and set-aside eligibility",
  },
];

export const jobSignals: SignalSummary[] = [
  { label: "Storm damage events (30d)", currentReading: "4 active corridors", trend: "up" },
  { label: "Commercial permit spikes", currentReading: "+38% MoM (3 ZIPs)", trend: "up" },
  { label: "Insurance claim surges", currentReading: "2 catastrophe zones", trend: "up" },
  { label: "Emergency service demand", currentReading: "Elevated — restoration", trend: "up" },
];

export const bidSignals: SignalSummary[] = [
  { label: "Open RFP / RFQ releases", currentReading: "5 tracked in-region", trend: "up" },
  { label: "Critical bid windows", currentReading: "3 closing < 14 days", trend: "steady" },
  { label: "Contract expirations", currentReading: "2 recompetes nearing", trend: "up" },
  { label: "Set-aside opportunities", currentReading: "Wave expected", trend: "up" },
];

export const marketSignals: SignalSummary[] = [
  { label: "Structural steel index", currentReading: "Easing 2nd month", trend: "down" },
  { label: "Skilled labor availability", currentReading: "Tightening — electrical", trend: "down" },
  { label: "Regional demand heat", currentReading: "Hot — Austin metro", trend: "up" },
  { label: "Sub availability by trade", currentReading: "Mixed — roofing tight", trend: "steady" },
];
