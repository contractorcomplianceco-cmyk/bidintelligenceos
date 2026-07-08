#!/usr/bin/env node
/**
 * Copy SQLite rows into Postgres (run setup-postgres.mjs first).
 */
import { config as loadEnv } from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Database from "better-sqlite3";
import pg from "pg";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
loadEnv({ path: path.join(root, ".env") });

const url = process.env.DATABASE_URL?.trim();
const sqlitePath = process.env.SQLITE_PATH ?? path.join(root, "data/bios.db");
if (!url) {
  console.error("DATABASE_URL required");
  process.exit(1);
}

const sqlite = new Database(sqlitePath, { readonly: true });
const pool = new pg.Pool({ connectionString: url });

const tables = [
  "users",
  "organizations",
  "organization_members",
  "bids",
  "jobs",
  "bid_analyses",
  "voice_connect_drafts",
  "bid_scores",
];

function cols(table) {
  return sqlite.prepare(`PRAGMA table_info(${table})`).all().map((c) => c.name);
}

try {
  for (const table of tables) {
    const columns = cols(table);
    if (columns.length === 0) continue;
    const rows = sqlite.prepare(`SELECT * FROM ${table}`).all();
    if (rows.length === 0) {
      console.log(`skip ${table} (empty)`);
      continue;
    }
    const placeholders = columns.map((_, i) => `$${i + 1}`).join(", ");
    const colList = columns.map((c) => `"${c}"`).join(", ");
    const insert = `INSERT INTO ${table} (${colList}) VALUES (${placeholders}) ON CONFLICT DO NOTHING`;
    for (const row of rows) {
      const values = columns.map((c) => {
        const v = row[c];
        if (typeof v === "number" && (c.includes("ai_generated") || c.includes("human_reviewed") || c === "clarification_requested")) {
          return Boolean(v);
        }
        return v;
      });
      await pool.query(insert, values);
    }
    console.log(`migrated ${table}: ${rows.length} rows`);
  }
  console.log("SQLite → Postgres migration complete.");
} finally {
  sqlite.close();
  await pool.end();
}
