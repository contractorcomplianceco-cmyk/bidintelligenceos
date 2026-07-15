#!/usr/bin/env node
/**
 * Idempotent smoke-test users for team QA (legacy login and Clerk dual overlay).
 * Usage: node scripts/seed-smoke-users.mjs
 *
 * Password is read from BIOS_SMOKE_PASSWORD (default: teamwork).
 * Do not commit real passwords; this is temporary QA only.
 * When AUTH_ENABLED=true and BIOS_SMOKE_PASSWORD is set, allowlisted emails
 * may still POST /api/v1/auth/login (carmen@ / rose@).
 */
import { config as loadEnv } from "dotenv";
import bcrypt from "bcryptjs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
loadEnv({ path: path.join(root, ".env") });

const SMOKE_USERS = [
  { email: "carmen@ccacontact.com", name: "Carmen", orgName: "CCA Team QA" },
  { email: "rose@ccacontact.com", name: "Rose", orgName: "CCA Team QA" },
];

const password = process.env.BIOS_SMOKE_PASSWORD?.trim() || "teamwork";
const url = process.env.DATABASE_URL?.trim();
if (!url) {
  console.error("DATABASE_URL is not set in .env");
  process.exit(1);
}

function nextId(prefix) {
  const n = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  return `${prefix}-${n}`.toUpperCase();
}

function nowIso() {
  return new Date().toISOString();
}

const pool = new pg.Pool({ connectionString: url });

try {
  const passwordHash = await bcrypt.hash(password, 12);
  const ts = nowIso();

  for (const { email, name, orgName } of SMOKE_USERS) {
    const normalized = email.toLowerCase();
    const existing = await pool.query("SELECT id, email FROM users WHERE email = $1", [normalized]);

    if (existing.rows.length === 0) {
      const userId = nextId("CCA-USR");
      const orgId = nextId("CCA-ORG");
      const memberId = nextId("CCA-MEM");

      await pool.query(
        `INSERT INTO users (id, email, password_hash, name, created_at)
         VALUES ($1, $2, $3, $4, $5)`,
        [userId, normalized, passwordHash, name, ts],
      );
      await pool.query(
        `INSERT INTO organizations (id, name, vertical, profile_json, created_at, updated_at)
         VALUES ($1, $2, 'general-contractor', '{}', $3, $3)`,
        [orgId, orgName, ts],
      );
      await pool.query(
        `INSERT INTO organization_members (id, org_id, user_id, role)
         VALUES ($1, $2, $3, 'owner')`,
        [memberId, orgId, userId],
      );
      console.log(`Created ${normalized} (user=${userId}, org=${orgId})`);
      continue;
    }

    const userId = existing.rows[0].id;
    await pool.query("UPDATE users SET password_hash = $1, name = $2 WHERE id = $3", [
      passwordHash,
      name,
      userId,
    ]);

    const membership = await pool.query(
      "SELECT org_id FROM organization_members WHERE user_id = $1 LIMIT 1",
      [userId],
    );

    if (membership.rows.length === 0) {
      const orgId = nextId("CCA-ORG");
      const memberId = nextId("CCA-MEM");
      await pool.query(
        `INSERT INTO organizations (id, name, vertical, profile_json, created_at, updated_at)
         VALUES ($1, $2, 'general-contractor', '{}', $3, $3)`,
        [orgId, orgName, ts],
      );
      await pool.query(
        `INSERT INTO organization_members (id, org_id, user_id, role)
         VALUES ($1, $2, $3, 'owner')`,
        [memberId, orgId, userId],
      );
      console.log(`Updated password and created org for ${normalized}`);
    } else {
      console.log(`Updated password for existing ${normalized}`);
    }
  }

  console.log("Smoke users ready (legacy email/password auth).");
  console.log("Next: node scripts/seed-smoke-bids.mjs  # FL sample bids/jobs for QA org");
} finally {
  await pool.end();
}
