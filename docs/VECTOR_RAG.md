# Vector RAG (BidOS)

`retrieveEvidence` prefers **cosine similarity over stored embedding vectors**, with **tag-filter fallback** to the G6 P0 pack.

## Storage

- Table: `public_intel_embeddings` (Postgres migration `003_confidence_ops.sql` / SQLite auto-migrate)
- Vectors stored as JSON float arrays (works without `pgvector`)
- Optional `vector(1536)` column only if the Postgres `vector` extension is installed

## Embed P0 cards

```bash
# Requires BIOS_OPENAI_API_KEY (or OPENAI_API_KEY). Honest skip exit 0 if missing.
node scripts/embed-public-intel.mjs
```

## Retrieval order

1. If embedding rows exist → DB cosine store (`vectorStorePg`)
2. Per-signal empty hits → tag-filter `createPublicIntelStore()`
3. If no embedding rows → tag-filter only (v1 behavior)

## Refresh

Weekly: `scripts/refresh-public-intel-anchors.mjs` stamps `as_of_date` and optionally probes FRED; emails Carmen when keys/feeds skip (no secrets in alerts). Re-embed after substantive card text changes.
