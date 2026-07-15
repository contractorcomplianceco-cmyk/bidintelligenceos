/**
 * BidOS trade list for Rose Confidence UI (mirrors apps/api trade-options).
 * All Gap-Fill trades LOCKED except Generic / Other.
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
  { id: "generic", label: "Other / Not listed", status: "fallback" },
] as const;

export const SCOPE_CLARITY_OPTIONS: readonly { value: string; label: string }[] = [
  { value: "1", label: "1 — Vague / incomplete drawings" },
  { value: "2", label: "2 — Rough outline only" },
  { value: "3", label: "3 — Usable specs, some gaps" },
  { value: "4", label: "4 — Clear scope, minor open items" },
  { value: "5", label: "5 — Fully defined, bid-ready" },
] as const;

export const SUB_BENCH_DEPTH_OPTIONS: readonly { value: string; label: string }[] = [
  { value: "1", label: "1 — Few backup subcontractors" },
  { value: "2", label: "2 — Limited alternatives" },
  { value: "3", label: "3 — Adequate coverage" },
  { value: "4", label: "4 — Strong bench" },
  { value: "5", label: "5 — Deep bench of qualified options" },
] as const;

export function tradeLabelForId(id: string): string {
  return BIDOS_OPTIONAL_TRADES.find((t) => t.id === id)?.label ?? id;
}

export const GENERIC_TRADE_HONESTY_BANNER =
  "Select a trade so we can score this bid more accurately.";

export const STARTUP_HONESTY_BANNER =

  "We’re scoring this bid with public data and what you enter here — not your company win history yet. This is a relative confidence score to help decide go / hold / no-go — not a win percentage.";

export const LEARNING_HONESTY_BANNER =
  "Past bid outcomes now inform scoring. Expected value still compares likely return to pursuit cost — separate from the confidence score.";
