/**
 * BidOS trade list for Rose Confidence UI (mirrors apps/api trade-options).
 * All Gap-Fill trades LOCKED except Generic fallback.
 */

export type BidOsTradeOption = {
  id: string;
  label: string;
  status: "locked" | "fallback";
};

export const BIDOS_OPTIONAL_TRADES: readonly BidOsTradeOption[] = [
  { id: "electrical", label: "Electrical", status: "locked" },
  { id: "roofing", label: "Roofing", status: "locked" },
  { id: "gc", label: "General Contractor", status: "locked" },
  { id: "mechanical", label: "Mechanical / HVAC", status: "locked" },
  { id: "plumbing", label: "Plumbing", status: "locked" },
  { id: "concrete", label: "Concrete", status: "locked" },
  { id: "civil", label: "Civil / Site", status: "locked" },
  { id: "specialty", label: "Low-voltage / Fire / Specialty", status: "locked" },
  { id: "generic", label: "Generic / Unknown", status: "fallback" },
] as const;

export const GENERIC_TRADE_HONESTY_BANNER =
  "Trade not set — accuracy limited. Select a trade to improve this score.";

export const STARTUP_HONESTY_BANNER =
  "Public + this-bid only. No company history yet. Pursuit Confidence Index (relative) — not calibrated award odds.";

export const LEARNING_HONESTY_BANNER =
  "Learning mode: past outcomes inform calibrated award-odds basis. Pursuit ROI is still EV vs pursuit cost — keep those labels separate.";
