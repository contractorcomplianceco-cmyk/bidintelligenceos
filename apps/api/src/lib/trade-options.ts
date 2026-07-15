/**
 * Optional BidOS trade strings for Rose Confidence Engine.
 * Locked trades are production-ready; provisional await Rose G11 lock.
 * Generic fallback MUST show honesty banner (cca-core GENERIC_TRADE_HONESTY_BANNER).
 */

export type BidOsTradeOption = {
  id: string;
  label: string;
  /** locked = Rose v1; provisional = Gap-Fill G1; fallback = generic */
  status: "locked" | "provisional" | "fallback";
};

export const BIDOS_OPTIONAL_TRADES: readonly BidOsTradeOption[] = [
  { id: "electrical", label: "Electrical", status: "locked" },
  { id: "roofing", label: "Roofing", status: "locked" },
  { id: "gc", label: "General Contractor", status: "provisional" },
  { id: "mechanical", label: "Mechanical / HVAC", status: "provisional" },
  { id: "plumbing", label: "Plumbing", status: "provisional" },
  { id: "concrete", label: "Concrete", status: "provisional" },
  { id: "civil", label: "Civil / Site", status: "provisional" },
  { id: "specialty", label: "Low-voltage / Fire / Specialty", status: "provisional" },
  { id: "generic", label: "Generic / Unknown", status: "fallback" },
] as const;

export function listBidOsTradeIds(): string[] {
  return BIDOS_OPTIONAL_TRADES.map((t) => t.id);
}
