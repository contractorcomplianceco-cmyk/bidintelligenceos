/**
 * Optional BidOS trade strings for Rose Confidence Engine.
 * All Gap-Fill trades are LOCKED (Rose G11 ALL APPROVED 2026-07-14).
 * Generic fallback MUST show honesty banner (cca-core GENERIC_TRADE_HONESTY_BANNER).
 */

export type BidOsTradeOption = {
  id: string;
  label: string;
  /** locked = Rose v1 / G11; fallback = generic */
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

export function listBidOsTradeIds(): string[] {
  return BIDOS_OPTIONAL_TRADES.map((t) => t.id);
}
