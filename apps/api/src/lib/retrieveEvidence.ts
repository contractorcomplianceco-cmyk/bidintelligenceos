/**
 * retrieveEvidence — BidOS evidence/RAG contract (Rose handoff).
 * Pluggable VectorStore. Never lives in cca-core.
 * Prefer stored embedding vectors (cosine) when available; else tag-filter G6 pack.
 */

import { loadPublicIntelPack } from "./publicIntelPack.js";
import { countStoredEmbeddings, createDbEmbeddingStore } from "./vectorStorePg.js";

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
  schedule_risk: ["lead-times", "lead-time", "weather", "schedule"],
  escalation_protection: ["contracts", "escalation", "bidding-practice"],
  scope_clarity: ["scope-gaps", "governance"],
  capacity_fit: ["capacity", "vendor"],
  strategy_fit: ["strategy", "delivery-method"],
  pursuit_cost_ratio: ["pursuit-economics"],
  vendor_quality_proxy: ["vendors", "vendor"],
  past_perf_winrate: ["outcomes"],
};

/** Build explainability citation string for a chunk. */
export function citationFor(chunk: EvidenceChunk): string {
  const asOf = chunk.asOfDate ? ` (as of ${chunk.asOfDate})` : "";
  const title = chunk.title ?? chunk.id;
  const src = chunk.sourceUrl ? ` — ${chunk.sourceUrl}` : "";
  return `[${chunk.trade}/${chunk.topic}] ${title}${asOf}${src}`;
}

/** FL pursuits may use SE regional cards; nationwide/all always match. */
function regionMatches(chunkRegion: string, queryRegion: string): boolean {
  if (!queryRegion) return true;
  const q = queryRegion.toUpperCase();
  const c = chunkRegion.toUpperCase();
  if (c === "NATIONWIDE" || c === "ALL") return true;
  if (c === q) return true;
  if (q === "FL" && c === "SE") return true;
  if (q === "SE" && c === "FL") return true;
  return false;
}

function passesFilters(
  chunk: EvidenceChunk,
  trade: string,
  region: string,
  mode: "startup" | "learning",
  orgId?: string,
): boolean {
  const tradeOk = chunk.trade === trade || chunk.trade === "all";
  const regionOk = regionMatches(chunk.region, region);
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
          const regionOk = !query.region || regionMatches(c.region, query.region);
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
/** Tag-filter fallback: G6 P0 public pack. */
export function createPublicIntelStore(): VectorStore {
  return createMemoryVectorStore(loadPublicIntelPack());
}

/**
 * Prefer DB embedding store when rows exist; else tag-filter pack.
 * Tests may still inject params.store.
 */
export async function resolveDefaultStore(): Promise<{
  store: VectorStore;
  retrieval: "vector" | "tag-filter";
}> {
  const n = await countStoredEmbeddings();
  if (n > 0) {
    return { store: createDbEmbeddingStore(), retrieval: "vector" };
  }
  return { store: createPublicIntelStore(), retrieval: "tag-filter" };
}

export async function retrieveEvidence(params: RetrieveEvidenceParams): Promise<RetrievedEvidence> {
  const trade = params.trade.trim().toLowerCase() || "generic";
  const region = params.region ?? "nationwide";
  const mode = params.mode ?? "startup";
  let store = params.store;
  let retrieval: "vector" | "tag-filter" = "tag-filter";
  if (!store) {
    const resolved = await resolveDefaultStore();
    store = resolved.store;
    retrieval = resolved.retrieval;
  }

  const bySignal: Record<string, EvidenceChunk[]> = {};
  const citations: string[] = [];

  for (const signalId of params.signalIds) {
    const topics = TOPIC_BY_SIGNAL[signalId] ?? [signalId];
    let raw = await store.search({
      text: `${signalId} ${topics.join(" ")} ${trade}`,
      trade,
      region,
      topics,
      layer: "any",
      orgId: params.orgId,
      limit: 5,
    });
    // Vector path with zero hits → tag-filter fallback for that signal
    if (!raw.length && retrieval === "vector" && !params.store) {
      raw = await createPublicIntelStore().search({
        text: signalId,
        trade,
        region,
        topics,
        layer: "any",
        orgId: params.orgId,
        limit: 5,
      });
    }
    const filtered = raw.filter((c) => passesFilters(c, trade, region, mode, params.orgId));
    bySignal[signalId] = filtered;
    for (const c of filtered) citations.push(citationFor(c));
  }

  return { bidId: params.bidId, trade, bySignal, citations };
}
