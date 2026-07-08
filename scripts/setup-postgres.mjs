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

const sqlPath = path.join(root, "deploy/postgres/001_init.sql");
const sql = fs.readFileSync(sqlPath, "utf8");
const pool = new pg.Pool({ connectionString: url });

try {
  await pool.query(sql);
  console.log("Postgres schema + RLS applied.");
} finally {
  await pool.end();
}
