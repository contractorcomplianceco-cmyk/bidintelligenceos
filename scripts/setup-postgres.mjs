#!/usr/bin/env node
/**
 * Apply Postgres schema + RLS for BidIntelligenceOS.
 * Usage: node scripts/setup-postgres.mjs
 */
import { config as loadEnv } from "dotenv";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
loadEnv({ path: path.join(root, ".env") });

const url = process.env.DATABASE_URL?.trim();
if (!url) {
  console.error("DATABASE_URL is not set in .env");
  process.exit(1);
}

const migrations = ["001_init.sql", "002_org_invites.sql", "003_confidence_ops.sql"];
const pool = new pg.Pool({ connectionString: url });

try {
  for (const file of migrations) {
    const sqlPath = path.join(root, "deploy/postgres", file);
    const sql = fs.readFileSync(sqlPath, "utf8");
    await pool.query(sql);
    console.log(`Applied ${file}`);
  }
  console.log("Postgres schema + RLS applied.");
} finally {
  await pool.end();
}
