/**
 * Learning-flip approval list (Rose #1 LOCKED).
 * First flip per trade requires explicit approval — never silent learning.
 *
 * Sources (union):
 * - BIOS_APPROVED_LEARNING_TRADES=electrical,roofing (comma-separated env)
 * - org.profileJson.approvedLearningTrades: string[]
 */

export function parseApprovedLearningTrades(...sources: Array<unknown>): string[] {
  const out = new Set<string>();
  for (const src of sources) {
    if (typeof src === "string") {
      for (const part of src.split(",")) {
        const t = part.trim().toLowerCase();
        if (t) out.add(t);
      }
      continue;
    }
    if (Array.isArray(src)) {
      for (const item of src) {
        if (typeof item === "string") {
          const t = item.trim().toLowerCase();
          if (t) out.add(t);
        }
      }
    }
  }
  return [...out];
}

export function getApprovedLearningTradesFromEnv(): string[] {
  return parseApprovedLearningTrades(process.env.BIOS_APPROVED_LEARNING_TRADES);
}

export function getApprovedLearningTradesFromOrgProfile(
  profileJson: string | null | undefined,
): string[] {
  if (!profileJson) return [];
  try {
    const profile = JSON.parse(profileJson) as { approvedLearningTrades?: unknown };
    return parseApprovedLearningTrades(profile.approvedLearningTrades);
  } catch {
    return [];
  }
}

export function resolveApprovedLearningTrades(
  profileJson?: string | null,
): string[] {
  return parseApprovedLearningTrades(
    process.env.BIOS_APPROVED_LEARNING_TRADES,
    (() => {
      if (!profileJson) return [];
      try {
        return (JSON.parse(profileJson) as { approvedLearningTrades?: unknown })
          .approvedLearningTrades;
      } catch {
        return [];
      }
    })(),
  );
}
