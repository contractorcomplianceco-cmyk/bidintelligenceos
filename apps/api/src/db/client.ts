import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { AsyncLocalStorage } from "node:async_hooks";
import Database from "better-sqlite3";
import { drizzle as drizzleSqlite } from "drizzle-orm/better-sqlite3";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as sqliteSchema from "./schema-sqlite.js";
import * as pgSchema from "./schema-pg.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = process.env.DATA_DIR ?? path.resolve(__dirname, "../../../../data");
const dbPath = process.env.SQLITE_PATH ?? path.join(dataDir, "bios.db");

export const isPostgresDriver = () => Boolean(process.env.DATABASE_URL?.trim());

type PgStore = { client: pg.PoolClient };
export const pgStore = new AsyncLocalStorage<PgStore>();

export function runPgOrgClient(client: pg.PoolClient, fn: () => void) {
  pgStore.run({ client }, fn);
}

let sqlite: Database.Database | null = null;
let sqliteDb: ReturnType<typeof drizzleSqlite<typeof sqliteSchema>> | null = null;
let pgPool: pg.Pool | null = null;
let pgDb: ReturnType<typeof drizzlePg<typeof pgSchema>> | null = null;

export type AppDb = ReturnType<typeof drizzleSqlite<typeof sqliteSchema>>;

export function getDb(): AppDb {
  if (isPostgresDriver()) {
    if (!pgDb) {
      pgPool = new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 12 });
      pgDb = drizzlePg(pgPool, { schema: pgSchema });
    }
    const scoped = pgStore.getStore();
    if (scoped?.client) {
      return drizzlePg(scoped.client, { schema: pgSchema }) as unknown as AppDb;
    }
    return pgDb as unknown as AppDb;
  }

  if (!sqliteDb) {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    sqlite = new Database(dbPath);
    sqlite.pragma("journal_mode = WAL");
    sqlite.pragma("foreign_keys = ON");
    sqliteDb = drizzleSqlite(sqlite, { schema: sqliteSchema });
    runSqliteMigrations(sqlite);
  }
  return sqliteDb;
}

export async function withPgOrgScope<T>(orgId: string, fn: () => Promise<T>): Promise<T> {
  if (!isPostgresDriver()) return fn();
  if (!pgPool) getDb();
  const client = await pgPool!.connect();
  try {
    await client.query(`SELECT set_config('app.org_id', $1, false)`, [orgId]);
    return await pgStore.run({ client }, fn);
  } finally {
    client.release();
  }
}

export async function withPgUserScope<T>(userId: string, fn: () => Promise<T>): Promise<T> {
  if (!isPostgresDriver()) return fn();
  if (!pgPool) getDb();
  const client = await pgPool!.connect();
  try {
    await client.query(`SELECT set_config('app.user_id', $1, false)`, [userId]);
    return await pgStore.run({ client }, fn);
  } finally {
    client.release();
  }
}

export function dbHealth(): {
  ok: boolean;
  driver: string;
  path?: string;
  rls?: boolean;
  error?: string;
} {
  try {
    if (isPostgresDriver()) {
      if (!pgPool) getDb();
      return { ok: true, driver: "postgres", rls: true };
    }
    getDb();
    sqlite!.prepare("SELECT 1").get();
    return { ok: true, driver: "sqlite", path: dbPath, rls: false };
  } catch (e) {
    return {
      ok: false,
      driver: isPostgresDriver() ? "postgres" : "sqlite",
      error: e instanceof Error ? e.message : "unknown",
    };
  }
}

function runSqliteMigrations(database: Database.Database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS organizations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      vertical TEXT NOT NULL DEFAULT 'general-contractor',
      profile_json TEXT NOT NULL DEFAULT '{}',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS organization_members (
      id TEXT PRIMARY KEY,
      org_id TEXT NOT NULL REFERENCES organizations(id),
      user_id TEXT NOT NULL REFERENCES users(id),
      role TEXT NOT NULL DEFAULT 'owner'
    );
    CREATE TABLE IF NOT EXISTS bids (
      id TEXT PRIMARY KEY,
      org_id TEXT NOT NULL REFERENCES organizations(id),
      name TEXT NOT NULL,
      recipient TEXT NOT NULL DEFAULT '',
      type TEXT NOT NULL DEFAULT '',
      location TEXT NOT NULL DEFAULT '',
      amount REAL NOT NULL DEFAULT 0,
      date TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Draft',
      outcome TEXT,
      reason TEXT,
      margin REAL,
      notes TEXT,
      expected_decision_date TEXT,
      contact_person TEXT,
      clarification_requested INTEGER DEFAULT 0,
      last_touch TEXT,
      next_action TEXT,
      next_action_date TEXT,
      confidence REAL,
      fit REAL,
      risk_score REAL,
      public_private TEXT,
      days_remaining INTEGER,
      scope_summary TEXT,
      analysis_status TEXT DEFAULT 'none',
      ai_generated INTEGER DEFAULT 0,
      human_reviewed INTEGER DEFAULT 0,
      deleted_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS jobs (
      id TEXT PRIMARY KEY,
      org_id TEXT NOT NULL REFERENCES organizations(id),
      bid_id TEXT,
      name TEXT NOT NULL,
      client TEXT NOT NULL DEFAULT '',
      location TEXT NOT NULL DEFAULT '',
      vertical TEXT NOT NULL DEFAULT 'general-contractor',
      contract_value REAL NOT NULL DEFAULT 0,
      start_date TEXT NOT NULL,
      target_completion TEXT NOT NULL,
      project_manager TEXT NOT NULL DEFAULT '',
      crew_lead TEXT NOT NULL DEFAULT '',
      current_phase TEXT NOT NULL DEFAULT '',
      phase_index INTEGER NOT NULL DEFAULT 0,
      total_phases INTEGER NOT NULL DEFAULT 1,
      status TEXT NOT NULL DEFAULT 'Mobilizing',
      payload_json TEXT NOT NULL DEFAULT '{}',
      deleted_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS bid_analyses (
      id TEXT PRIMARY KEY,
      bid_id TEXT NOT NULL REFERENCES bids(id),
      org_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'queued',
      summary TEXT,
      payload_json TEXT NOT NULL DEFAULT '{}',
      ai_generated INTEGER DEFAULT 1,
      human_reviewed INTEGER DEFAULT 0,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS voice_connect_drafts (
      id TEXT PRIMARY KEY,
      org_id TEXT NOT NULL,
      bid_id TEXT,
      transcript TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS bid_scores (
      id TEXT PRIMARY KEY,
      bid_id TEXT NOT NULL REFERENCES bids(id),
      org_id TEXT NOT NULL,
      total_score REAL NOT NULL,
      verdict TEXT NOT NULL,
      categories_json TEXT NOT NULL DEFAULT '[]',
      gates_json TEXT NOT NULL DEFAULT '[]',
      compliance_json TEXT NOT NULL DEFAULT '{}',
      ai_generated INTEGER NOT NULL DEFAULT 1,
      human_reviewed INTEGER NOT NULL DEFAULT 0,
      reviewed_by TEXT,
      reviewed_at TEXT,
      locked_at TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS bid_documents (
      id TEXT PRIMARY KEY,
      org_id TEXT NOT NULL REFERENCES organizations(id),
      bid_id TEXT NOT NULL REFERENCES bids(id),
      file_name TEXT NOT NULL,
      mime_type TEXT NOT NULL,
      size_bytes INTEGER NOT NULL DEFAULT 0,
      storage_path TEXT NOT NULL,
      extracted_text TEXT,
      extraction_status TEXT NOT NULL DEFAULT 'pending',
      ai_generated INTEGER DEFAULT 1,
      human_reviewed INTEGER DEFAULT 0,
      deleted_at TEXT,
      created_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS bids_org_idx ON bids(org_id);
    CREATE INDEX IF NOT EXISTS jobs_org_idx ON jobs(org_id);
    CREATE INDEX IF NOT EXISTS bid_scores_bid_idx ON bid_scores(bid_id);
    CREATE INDEX IF NOT EXISTS bid_documents_bid_idx ON bid_documents(bid_id);
  `);
  ensureColumn(database, "bid_analyses", "payload_json", "TEXT NOT NULL DEFAULT '{}'");
}

function ensureColumn(database: Database.Database, table: string, column: string, definition: string) {
  const cols = database.prepare(`PRAGMA table_info(${table})`).all() as { name: string }[];
  if (!cols.some((c) => c.name === column)) {
    database.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
  }
}
