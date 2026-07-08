type Verdict = "green" | "yellow" | "red";
import { computeComplianceEligibility } from "./compliance-eligibility.js";
import { parseStateFromLocation } from "./state-parse.js";

type BidRow = {
  id: string;
  name: string;
  amount: number;
  status: string;
  location: string;
  humanReviewed?: boolean | null;
  analysisStatus?: string | null;
  nextActionDate?: string | null;
};

type ScoreRow = {
  bidId: string;
  totalScore: number;
  verdict: string;
  humanReviewed: boolean;
};

export type LiveRoseInsight = {
  id: string;
  section: "bid-risk" | "compliance";
  verdict: Verdict;
  title: string;
  subject: string;
  rationale: string;
  recommendation: string;
  sourceModule: "BidIntelligenceOS";
  sourceSignal: string;
  confidence: "High" | "Medium" | "Low";
  detectedAgo: string;
  href?: string;
  humanReviewed: boolean;
};

function verdictColor(score: number, humanReviewed: boolean): Verdict {
  if (!humanReviewed) return "yellow";
  if (score >= 80) return "green";
  if (score >= 65) return "yellow";
  return "red";
}

export async function buildLiveRoseInsights(bids: BidRow[], scores: ScoreRow[]): Promise<LiveRoseInsight[]> {
  const insights: LiveRoseInsight[] = [];
  const scoreByBid = new Map(scores.map((s) => [s.bidId, s]));

  for (const bid of bids.slice(0, 12)) {
    const score = scoreByBid.get(bid.id);
    const state = parseStateFromLocation(bid.location);
    const compliance = state ? await computeComplianceEligibility(state) : null;

    if (score && !score.humanReviewed) {
      insights.push({
        id: `rose-live-${bid.id}-review`,
        section: "bid-risk",
        verdict: "yellow",
        title: `${bid.name} — AI score awaiting human approval`,
        subject: bid.name,
        rationale: `Bid Intelligence scored ${Math.round(score.totalScore)}/100 (${score.verdict}) but humanReviewed is false.`,
        recommendation: "Reviewer must approve the score snapshot before client-facing use or executive circulation.",
        sourceModule: "BidIntelligenceOS",
        sourceSignal: "Bid score snapshot",
        confidence: "High",
        detectedAgo: "just now",
        href: `/bids/${bid.id}`,
        humanReviewed: false,
      });
    } else if (score) {
      insights.push({
        id: `rose-live-${bid.id}-score`,
        section: "bid-risk",
        verdict: verdictColor(score.totalScore, score.humanReviewed),
        title: `${bid.name} — ${score.verdict}`,
        subject: bid.name,
        rationale: `Live pipeline score ${Math.round(score.totalScore)}/100 from 12-category Bid Intelligence model.`,
        recommendation:
          score.verdict === "Strong Go"
            ? "Proceed toward packaging after estimator validation."
            : "Adjust strategy or schedule executive review before submission.",
        sourceModule: "BidIntelligenceOS",
        sourceSignal: "Bid score + compliance gates",
        confidence: score.humanReviewed ? "High" : "Medium",
        detectedAgo: "just now",
        href: `/bids/${bid.id}`,
        humanReviewed: score.humanReviewed,
      });
    }

    if (compliance && compliance.eligibilityPoints < 5) {
      insights.push({
        id: `rose-live-${bid.id}-compliance`,
        section: "compliance",
        verdict: compliance.eligibilityPoints < 3 ? "red" : "yellow",
        title: `Compliance eligibility gap — ${compliance.stateCode ?? "state TBD"}`,
        subject: bid.name,
        rationale: compliance.flags[0] ?? "Jurisdiction rules incomplete in Research Hub export-ready view.",
        recommendation: "Resolve Research Hub validation before relying on compliance points in bid decisions.",
        sourceModule: "BidIntelligenceOS",
        sourceSignal: "Research Hub export-ready bridge",
        confidence: "High",
        detectedAgo: "just now",
        href: `/bids/${bid.id}`,
        humanReviewed: true,
      });
    }

    if (bid.analysisStatus === "completed" && !bid.humanReviewed) {
      insights.push({
        id: `rose-live-${bid.id}-scope`,
        section: "bid-risk",
        verdict: "yellow",
        title: `Scope AI brief ready — ${bid.name}`,
        subject: bid.name,
        rationale: "Scope analysis generated with aiGenerated=true; reviewer has not approved yet.",
        recommendation: "Open Scope Analyzer, validate RFIs and risks, then approve for estimators.",
        sourceModule: "BidIntelligenceOS",
        sourceSignal: "Scope analysis queue",
        confidence: "Medium",
        detectedAgo: "just now",
        href: `/scope-analyzer?bidId=${bid.id}`,
        humanReviewed: false,
      });
    }
  }

  return insights.slice(0, 8);
}

export function executivePosture(insights: LiveRoseInsight[]): Verdict {
  if (insights.some((i) => i.verdict === "red")) return "red";
  if (insights.filter((i) => i.verdict === "yellow").length >= 2) return "yellow";
  return "green";
}
