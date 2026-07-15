/**
 * retrieveEvidence — BidOS evidence/RAG contract (Rose handoff).
 * Pluggable VectorStore. Never lives in cca-core.
 */

export type EvidenceLayer = "public" | "private";

export type EvidenceChunk = {
  id: string;
  text: string;
  trade: string;
  region: string;
  topic: string;
  asOfDate?: string;
  layer: EvidenceLayer;
  orgId?: string;
  sourceUrl?: string;
  title?: string;
};

export type VectorStore = {
  search(query: {
    text: string;
    trade: string;
    region?: string;
    topics?: string[];
    layer?: EvidenceLayer | "any";
    orgId?: string;
    limit?: number;
  }): Promise<EvidenceChunk[]>;
};

export type RetrieveEvidenceParams = {
  bidId: string;
  trade: string;
  region?: string;
  signalIds: string[];
  mode?: "startup" | "learning";
  orgId?: string;
  store?: VectorStore;
};

export type RetrievedEvidence = {
  bidId: string;
  trade: string;
  bySignal: Record<string, EvidenceChunk[]>;
  citations: string[];
};

const TOPIC_BY_SIGNAL: Record<string, string[]> = {
  price_pressure: ["materials-inflation", "commodities"],
  labor_pressure: ["labor", "wages"],
  market_heat: ["market", "abi", "backlog"],
  competitive_intensity: ["awards", "competitors"],
  schedule_risk: ["lead-times", "weather", "schedule"],
  escalation_protection: ["contracts", "escalation"],
  scope_clarity: ["scope-gaps"],
  capacity_fit: ["capacity"],
  strategy_fit: ["strategy"],
  pursuit_cost_ratio: ["pursuit-economics"],
  vendor_quality_proxy: ["vendors"],
  past_perf_winrate: ["outcomes"],
};

/** Build explainability citation string for a chunk. */
export function citationFor(chunk: EvidenceChunk): string {
  const asOf = chunk.asOfDate ? ` (as of ${chunk.asOfDate})` : "";
  const title = chunk.title ?? chunk.id;
  const src = chunk.sourceUrl ? ` — ${chunk.sourceUrl}` : "";
  return `[${chunk.trade}/${chunk.topic}] ${title}${asOf}${src}`;
}

function passesFilters(
  chunk: EvidenceChunk,
  trade: string,
  region: string,
  mode: "startup" | "learning",
  orgId?: string,
): boolean {
  const tradeOk = chunk.trade === trade || chunk.trade === "all";
  const regionOk =
    !region ||
    chunk.region === region ||
    chunk.region === "nationwide" ||
    chunk.region === "all";
  if (!tradeOk || !regionOk) return false;
  if (chunk.layer === "public") return true;
  // Private: learning mode only + strict org scope (defensive double-filter)
  if (mode !== "learning") return false;
  if (!orgId || !chunk.orgId) return false;
  return chunk.orgId === orgId;
}

/** In-memory stub store for offline / cold-start demos. */
export function createMemoryVectorStore(chunks: EvidenceChunk[] = []): VectorStore {
  return {
    async search(query) {
      const limit = query.limit ?? 5;
      return chunks
        .filter((c) => {
          const tradeOk = c.trade === query.trade || c.trade === "all";
          const regionOk =
            !query.region ||
            c.region === query.region ||
            c.region === "nationwide" ||
            c.region === "all";
          const topicOk =
            !query.topics?.length ||
            query.topics.some((t) => c.topic === t || c.topic === "all");
          const layerOk =
            !query.layer ||
            query.layer === "any" ||
            c.layer === query.layer;
          return tradeOk && regionOk && topicOk && layerOk;
        })
        .slice(0, limit);
    },
  };
}

/**
 * Trade+region+topic filtered retrieval per signal.
 * Public: trade ∈ {trade, all}, region ∈ {region, nationwide}.
 * Private: learning mode only, org_id-scoped.
 */
export async function retrieveEvidence(params: RetrieveEvidenceParams): Promise<RetrievedEvidence> {
  const trade = params.trade.trim().toLowerCase() || "generic";
  const region = params.region ?? "nationwide";
  const mode = params.mode ?? "startup";
  const store = params.store ?? createMemoryVectorStore([]);

  const bySignal: Record<string, EvidenceChunk[]> = {};
  const citations: string[] = [];

  for (const signalId of params.signalIds) {
    const topics = TOPIC_BY_SIGNAL[signalId] ?? [signalId];
    const raw = await store.search({
      text: signalId,
      trade,
      region,
      topics,
      layer: "any",
      orgId: params.orgId,
      limit: 5,
    });
    const filtered = raw.filter((c) => passesFilters(c, trade, region, mode, params.orgId));
    bySignal[signalId] = filtered;
    for (const c of filtered) citations.push(citationFor(c));
  }

  return { bidId: params.bidId, trade, bySignal, citations };
}
