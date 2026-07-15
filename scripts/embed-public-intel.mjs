#!/usr/bin/env node
/**
 * Embed G6 P0 public intel cards into public_intel_embeddings (cosine RAG).
 * Requires DATABASE_URL or SQLite path + BIOS_OPENAI_API_KEY.
 *
 * Usage: node scripts/embed-public-intel.mjs
 */
import { config as loadEnv } from "dotenv";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";
import Database from "better-sqlite3";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
loadEnv({ path: path.join(root, ".env") });

const cardsPath = path.join(root, "apps/api/src/data/public-intel-cards/p0-cards.json");
const pack = JSON.parse(fs.readFileSync(cardsPath, "utf8"));
const apiKey = process.env.BIOS_OPENAI_API_KEY?.trim() || process.env.OPENAI_API_KEY?.trim();
const model = process.env.BIOS_EMBEDDING_MODEL?.trim() || "text-embedding-3-small";

if (!apiKey) {
  console.warn("SKIP embed-public-intel: BIOS_OPENAI_API_KEY not set (tag-filter RAG remains).");
  process.exit(0);
}

function expandCards(cards) {
  const out = [];
  for (const card of cards) {
    const trades = card.trades?.length ? card.trades : ["all"];
    for (const trade of trades) {
      out.push({
        chunkId: trades.length > 1 ? `${card.id}:${trade}` : card.id,
        trade: String(trade).toLowerCase(),
        region: card.region || "nationwide",
        topic: card.topic || "",
        title: card.title || card.id,
        sourceUrl: card.sourceUrl || null,
        asOfDate: card.asOfDate || null,
        text: card.text,
      });
    }
  }
  return out;
}

async function embedBatch(texts) {
  const res = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model, input: texts }),
  });
  if (!res.ok) {
    throw new Error(`OpenAI embeddings failed: ${res.status}`);
  }
  const json = await res.json();
  return (json.data ?? []).sort((a, b) => a.index - b.index).map((d) => d.embedding);
}

const chunks = expandCards(pack.cards ?? []);
const ts = new Date().toISOString();
const dbUrl = process.env.DATABASE_URL?.trim();

async function upsertPg(rows) {
  const pool = new pg.Pool({ connectionString: dbUrl });
  try {
    for (const r of rows) {
      await pool.query(
        `INSERT INTO public_intel_embeddings
          (chunk_id, trade, region, topic, title, source_url, as_of_date, layer, text, embedding_json, model, created_at, updated_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,'public',$8,$9,$10,$11,$11)
         ON CONFLICT (chunk_id) DO UPDATE SET
           trade=EXCLUDED.trade, region=EXCLUDED.region, topic=EXCLUDED.topic,
           title=EXCLUDED.title, source_url=EXCLUDED.source_url, as_of_date=EXCLUDED.as_of_date,
           text=EXCLUDED.text, embedding_json=EXCLUDED.embedding_json, model=EXCLUDED.model, updated_at=EXCLUDED.updated_at`,
        [
          r.chunkId,
          r.trade,
          r.region,
          r.topic,
          r.title,
          r.sourceUrl,
          r.asOfDate,
          r.text,
          JSON.stringify(r.embedding),
          model,
          ts,
        ],
      );
    }
  } finally {
    await pool.end();
  }
}

function upsertSqlite(rows) {
  const dataDir = process.env.DATA_DIR ?? path.join(root, "data");
  const dbPath = process.env.SQLITE_PATH ?? path.join(dataDir, "bios.db");
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  const db = new Database(dbPath);
  db.exec(`CREATE TABLE IF NOT EXISTS public_intel_embeddings (
    chunk_id TEXT PRIMARY KEY,
    trade TEXT NOT NULL DEFAULT 'all',
    region TEXT NOT NULL DEFAULT 'nationwide',
    topic TEXT NOT NULL DEFAULT '',
    title TEXT,
    source_url TEXT,
    as_of_date TEXT,
    layer TEXT NOT NULL DEFAULT 'public',
    text TEXT NOT NULL,
    embedding_json TEXT NOT NULL,
    model TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`);
  const stmt = db.prepare(
    `INSERT INTO public_intel_embeddings
      (chunk_id, trade, region, topic, title, source_url, as_of_date, layer, text, embedding_json, model, created_at, updated_at)
     VALUES (@chunkId,@trade,@region,@topic,@title,@sourceUrl,@asOfDate,'public',@text,@embeddingJson,@model,@ts,@ts)
     ON CONFLICT(chunk_id) DO UPDATE SET
       trade=excluded.trade, region=excluded.region, topic=excluded.topic,
       title=excluded.title, source_url=excluded.source_url, as_of_date=excluded.as_of_date,
       text=excluded.text, embedding_json=excluded.embedding_json, model=excluded.model, updated_at=excluded.updated_at`,
  );
  const tx = db.transaction((list) => {
    for (const r of list) {
      stmt.run({
        chunkId: r.chunkId,
        trade: r.trade,
        region: r.region,
        topic: r.topic,
        title: r.title,
        sourceUrl: r.sourceUrl,
        asOfDate: r.asOfDate,
        text: r.text,
        embeddingJson: JSON.stringify(r.embedding),
        model,
        ts,
      });
    }
  });
  tx(rows);
  db.close();
}

const BATCH = 16;
const embedded = [];
for (let i = 0; i < chunks.length; i += BATCH) {
  const batch = chunks.slice(i, i + BATCH);
  const vectors = await embedBatch(batch.map((c) => `${c.title}\n${c.text}`));
  for (let j = 0; j < batch.length; j++) {
    embedded.push({ ...batch[j], embedding: vectors[j] });
  }
  console.log(`Embedded ${Math.min(i + BATCH, chunks.length)}/${chunks.length}`);
}

if (dbUrl) {
  await upsertPg(embedded);
  console.log(`Upserted ${embedded.length} chunks to Postgres`);
} else {
  upsertSqlite(embedded);
  console.log(`Upserted ${embedded.length} chunks to SQLite`);
}
