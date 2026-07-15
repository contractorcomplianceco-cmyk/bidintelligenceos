/**
 * Postgres/SQLite-backed chunk index with cosine over stored embedding vectors.
 * Falls back to empty when no rows — callers keep tag-filter public pack.
 */

import { getDb } from "../db/client.js";
import { publicIntelEmbeddings } from "../db/schema.js";
import { cosineSimilarity, embedTexts, parseEmbeddingJson } from "./embeddings.js";
import type { EvidenceChunk, VectorStore } from "./retrieveEvidence.js";

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

export async function countStoredEmbeddings(): Promise<number> {
  try {
    const db = getDb();
    const all = await db.select().from(publicIntelEmbeddings);
    return all.length;
  } catch {
    return 0;
  }
}

/** Vector store from DB embeddings; empty search if none loaded. */
export function createDbEmbeddingStore(): VectorStore {
  return {
    async search(query) {
      const db = getDb();
      let rows: (typeof publicIntelEmbeddings.$inferSelect)[] = [];
      try {
        rows = await db.select().from(publicIntelEmbeddings);
      } catch {
        return [];
      }
      if (!rows.length) return [];

      const limit = query.limit ?? 5;
      const candidates = rows.filter((r) => {
        const tradeOk = r.trade === query.trade || r.trade === "all";
        const regionOk = !query.region || regionMatches(r.region, query.region);
        const topicOk =
          !query.topics?.length ||
          query.topics.some((t) => r.topic === t || r.topic === "all");
        const layerOk =
          !query.layer || query.layer === "any" || r.layer === query.layer;
        return tradeOk && regionOk && topicOk && layerOk;
      });

      const emb = await embedTexts([query.text]);
      if (!emb?.vectors[0]) {
        // No live query embedding — return tag-filtered candidates (still better than nothing)
        return candidates.slice(0, limit).map(rowToChunk);
      }
      const qVec = emb.vectors[0];
      const scored = candidates
        .map((r) => ({
          row: r,
          score: cosineSimilarity(qVec, parseEmbeddingJson(r.embeddingJson)),
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
      return scored.filter((s) => s.score > 0.05).map((s) => rowToChunk(s.row));
    },
  };
}

function rowToChunk(r: typeof publicIntelEmbeddings.$inferSelect): EvidenceChunk {
  return {
    id: r.chunkId,
    text: r.text,
    trade: r.trade,
    region: r.region,
    topic: r.topic,
    asOfDate: r.asOfDate ?? undefined,
    layer: (r.layer as "public" | "private") || "public",
    sourceUrl: r.sourceUrl ?? undefined,
    title: r.title ?? undefined,
  };
}
