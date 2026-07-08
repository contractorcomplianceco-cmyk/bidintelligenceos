/**
 * Pull contractor compliance from the CCA Audit Engine API (Audit-Risk-Model).
 * Server-only — never import in apps/web.
 */

export type AuditEngineTrigger = {
  key: string;
  label: string;
  domain: string;
  cleared: boolean;
};

export type AuditEngineScorecard = {
  auditId: number;
  layerANormalized: number;
  layerABand: string;
  overallScore: number;
  layerBBand: string;
  activeTriggerCount: number;
  finalStatus: string;
  finalLevel: string;
  finalReason: string;
  triggers: AuditEngineTrigger[];
};

export type AuditEngineSummary = {
  id: number;
  auditCode: string;
  clientName: string;
  homeState: string | null;
  activeStates: string[] | null;
  primaryTrades: string[] | null;
  projectTypes: string[] | null;
  status: string;
  layerANormalized: number;
  overallScore: number;
  finalStatus: string;
  finalLevel: string;
  activeTriggerCount: number;
  updatedAt: string;
};

function auditApiBase(): string | null {
  const raw = process.env.AUDIT_ENGINE_API_URL?.trim() || process.env.CCA_AUDIT_API_URL?.trim();
  if (!raw) return null;
  return raw.replace(/\/$/, "");
}

const STATE_NAME_TO_CODE: Record<string, string> = {
  alabama: "AL",
  alaska: "AK",
  arizona: "AZ",
  arkansas: "AR",
  california: "CA",
  colorado: "CO",
  connecticut: "CT",
  delaware: "DE",
  florida: "FL",
  georgia: "GA",
  hawaii: "HI",
  idaho: "ID",
  illinois: "IL",
  indiana: "IN",
  iowa: "IA",
  kansas: "KS",
  kentucky: "KY",
  louisiana: "LA",
  maine: "ME",
  maryland: "MD",
  massachusetts: "MA",
  michigan: "MI",
  minnesota: "MN",
  mississippi: "MS",
  missouri: "MO",
  montana: "MT",
  nebraska: "NE",
  nevada: "NV",
  "new hampshire": "NH",
  "new jersey": "NJ",
  "new mexico": "NM",
  "new york": "NY",
  "north carolina": "NC",
  "north dakota": "ND",
  ohio: "OH",
  oklahoma: "OK",
  oregon: "OR",
  pennsylvania: "PA",
  "rhode island": "RI",
  "south carolina": "SC",
  "south dakota": "SD",
  tennessee: "TN",
  texas: "TX",
  utah: "UT",
  vermont: "VT",
  virginia: "VA",
  washington: "WA",
  "west virginia": "WV",
  wisconsin: "WI",
  wyoming: "WY",
};

function normalizeStateCode(value: string | null | undefined): string | null {
  if (!value?.trim()) return null;
  const trimmed = value.trim();
  if (/^[A-Z]{2}$/i.test(trimmed)) return trimmed.toUpperCase();
  return STATE_NAME_TO_CODE[trimmed.toLowerCase()] ?? null;
}

export function isAuditEngineConfigured() {
  return Boolean(auditApiBase());
}

function normalizeList(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string" && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch {
      return value.split(/[,;|]/).map((s) => s.trim()).filter(Boolean);
    }
  }
  return [];
}

function stateMatches(audit: AuditEngineSummary, stateCode: string) {
  const upper = stateCode.toUpperCase();
  const home = normalizeStateCode(audit.homeState);
  if (home === upper) return true;
  const active = normalizeList(audit.activeStates).map((s) => normalizeStateCode(s) ?? s.toUpperCase());
  return active.some((s) => s === upper);
}

function tradeMatches(audit: AuditEngineSummary, trade: string | null | undefined) {
  if (!trade?.trim()) return true;
  const needle = trade.trim().toLowerCase();
  const trades = normalizeList(audit.primaryTrades).map((t) => t.toLowerCase());
  if (trades.length === 0) return true;
  return trades.some((t) => t.includes(needle) || needle.includes(t));
}

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const headers: Record<string, string> = { Accept: "application/json" };
    const token = process.env.AUDIT_ENGINE_API_TOKEN?.trim();
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(url, { headers, signal: AbortSignal.timeout(12_000) });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function fetchAuditSummaries(): Promise<AuditEngineSummary[]> {
  const base = auditApiBase();
  if (!base) return [];
  const data = await fetchJson<AuditEngineSummary[] | { audits?: AuditEngineSummary[] }>(`${base}/api/audits`);
  if (!data) return [];
  if (Array.isArray(data)) return data;
  return data.audits ?? [];
}

export async function fetchAuditScorecard(auditId: number): Promise<AuditEngineScorecard | null> {
  const base = auditApiBase();
  if (!base) return null;
  return fetchJson<AuditEngineScorecard>(`${base}/api/audits/${auditId}/scorecard`);
}

export async function findBestAuditForBid(
  stateCode: string | null,
  trade?: string | null,
): Promise<{ summary: AuditEngineSummary; scorecard: AuditEngineScorecard } | null> {
  if (!stateCode || !isAuditEngineConfigured()) return null;
  const audits = await fetchAuditSummaries();
  const candidates = audits
    .filter((a) => stateMatches(a, stateCode) && tradeMatches(a, trade))
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
  const summary = candidates[0];
  if (!summary) return null;
  const scorecard = await fetchAuditScorecard(summary.id);
  if (!scorecard) return { summary, scorecard: summaryToScorecard(summary) };
  return { summary, scorecard };
}

function summaryToScorecard(summary: AuditEngineSummary): AuditEngineScorecard {
  return {
    auditId: summary.id,
    layerANormalized: summary.layerANormalized,
    layerABand: "",
    overallScore: summary.overallScore,
    layerBBand: "",
    activeTriggerCount: summary.activeTriggerCount,
    finalStatus: summary.finalStatus,
    finalLevel: summary.finalLevel,
    finalReason: "",
    triggers: [],
  };
}

export function compliancePointsFromAuditScorecard(card: AuditEngineScorecard): {
  points: number;
  flags: string[];
  fixBeforeBidding: string[];
  criticalTriggers: { key: string; label: string; cleared: boolean }[];
} {
  const flags: string[] = [];
  const fixBeforeBidding: string[] = [];
  const criticalTriggers = (card.triggers ?? []).map((t) => ({
    key: t.key,
    label: t.label,
    cleared: Boolean(t.cleared),
  }));
  const active = criticalTriggers.filter((t) => !t.cleared);

  for (const t of active.slice(0, 6)) {
    flags.push(`Critical trigger: ${t.label}`);
    fixBeforeBidding.push(`Clear audit trigger — ${t.label}`);
  }

  if (card.finalStatus === "Critical Review Required") {
    if (card.finalReason) flags.push(card.finalReason);
    fixBeforeBidding.push("Resolve audit critical review before pursuing this bid.");
    return { points: active.length > 0 ? 0 : 1, flags, fixBeforeBidding, criticalTriggers };
  }

  let points = 4;
  const norm = card.layerANormalized ?? 0;
  if (active.length === 0 && norm >= 85) points = 8;
  else if (active.length === 0 && norm >= 70) points = 7;
  else if (active.length === 0 && norm >= 55) points = 6;
  else if (active.length > 0) points = Math.min(2, points);

  if (card.activeTriggerCount > 0 && active.length === 0) {
    flags.push(`${card.activeTriggerCount} audit trigger(s) flagged on record.`);
  }

  return { points, flags, fixBeforeBidding, criticalTriggers };
}
