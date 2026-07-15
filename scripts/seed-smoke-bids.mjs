#!/usr/bin/env node
/**
 * Idempotent smoke-test bids/jobs for rose@ / carmen@ QA orgs.
 * Usage: node scripts/seed-smoke-bids.mjs
 *
 * Seeds FL electrical + roofing pursuits so smoke login can exercise
 * Command Center and Pursuit Confidence. Does not print secrets.
 */
import { config as loadEnv } from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
loadEnv({ path: path.join(root, ".env") });

const SMOKE_EMAILS = ["rose@ccacontact.com", "carmen@ccacontact.com"];

const SAMPLE_BIDS = [
  {
    name: "Tampa Bay Retail TI — Electrical",
    recipient: "Gulf Coast Retail Partners",
    type: "Electrical",
    location: "Tampa, FL",
    amount: 485000,
    status: "In Progress",
    publicPrivate: "Private",
    confidence: 78,
    fit: 84,
    nextAction: "Compute Pursuit Confidence Index",
    nextActionDate: "2026-07-18",
    scopeSummary:
      "Tenant improvement electrical package for a 22,000 sq ft retail shell in Tampa: panel upgrades, LED lighting, fire-alarm interface, and low-voltage rough-in. Florida EC license and local permit required.",
  },
  {
    name: "Orlando Warehouse Re-Roof",
    recipient: "Central Florida Logistics LLC",
    type: "Roofing",
    location: "Orlando, FL",
    amount: 612000,
    status: "In Progress",
    publicPrivate: "Private",
    confidence: 71,
    fit: 80,
    nextAction: "Review weather contingency before score",
    nextActionDate: "2026-07-20",
    scopeSummary:
      "Tear-off and TPO replacement over ~85,000 sq ft low-slope warehouse roof in Orlando. Includes edge metal, overflow drains, and two weather-contingency days in the dry-in window.",
  },
  {
    name: "Jacksonville Municipal Lighting Upgrade",
    recipient: "City of Jacksonville",
    type: "Electrical",
    location: "Jacksonville, FL",
    amount: 328000,
    status: "Review",
    publicPrivate: "Public",
    confidence: 66,
    fit: 76,
    nextAction: "Confirm bonding capacity and submit",
    nextActionDate: "2026-07-22",
    scopeSummary:
      "Public-sector exterior LED conversion across three municipal parking decks. Florida public procurement plus City of Jacksonville contractor registration required.",
  },
];

const SAMPLE_JOB = {
  name: "Sarasota Clinic Electrical Fit-Out",
  client: "Suncoast Health Group",
  location: "Sarasota, FL",
  vertical: "electrical",
  contractValue: 275000,
  currentPhase: "Closeout",
  phaseIndex: 4,
  totalPhases: 5,
  status: "Completed",
  projectManager: "Rose",
  crewLead: "Lead Sparky",
};

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
  const ts = nowIso();
  const today = ts.slice(0, 10);

  const members = await pool.query(
    `SELECT u.email, om.org_id, om.user_id, o.name AS org_name
     FROM users u
     JOIN organization_members om ON om.user_id = u.id
     JOIN organizations o ON o.id = om.org_id
     WHERE u.email = ANY($1::text[])
     ORDER BY u.email`,
    [SMOKE_EMAILS],
  );

  if (members.rows.length === 0) {
    console.error("No smoke users found. Run node scripts/seed-smoke-users.mjs first.");
    process.exit(1);
  }

  /** Prefer a single shared org: first org seen wins; migrate other smoke users into it. */
  const primaryOrgId = members.rows[0].org_id;
  const primaryOrgName = members.rows[0].org_name;
  console.log(`Smoke primary org: ${primaryOrgName}`);

  for (const row of members.rows) {
    if (row.org_id === primaryOrgId) continue;
    const existing = await pool.query(
      `SELECT id FROM organization_members WHERE org_id = $1 AND user_id = $2 LIMIT 1`,
      [primaryOrgId, row.user_id],
    );
    if (existing.rows.length === 0) {
      await pool.query(
        `INSERT INTO organization_members (id, org_id, user_id, role) VALUES ($1, $2, $3, 'owner')`,
        [nextId("CCA-MEM"), primaryOrgId, row.user_id],
      );
      console.log(`Linked ${row.email} to shared smoke org`);
    }
  }

  // Drop duplicate memberships so login LIMIT 1 cannot land on an empty org.
  const pruned = await pool.query(
    `DELETE FROM organization_members
     WHERE user_id = ANY(
       SELECT DISTINCT user_id FROM organization_members WHERE org_id = $1
     )
       AND user_id IN (SELECT id FROM users WHERE email = ANY($2::text[]))
       AND org_id <> $1
     RETURNING id, user_id, org_id`,
    [primaryOrgId, SMOKE_EMAILS],
  );
  if (pruned.rows.length > 0) {
    console.log(`Removed ${pruned.rows.length} duplicate smoke membership(s)`);
  }

  let bidsCreated = 0;
  for (const sample of SAMPLE_BIDS) {
    const existing = await pool.query(
      `SELECT id FROM bids
       WHERE org_id = $1 AND name = $2 AND deleted_at IS NULL
       LIMIT 1`,
      [primaryOrgId, sample.name],
    );
    if (existing.rows.length > 0) {
      console.log(`Bid exists: ${sample.name}`);
      continue;
    }

    const id = nextId("CCA-BID");
    await pool.query(
      `INSERT INTO bids (
         id, org_id, name, recipient, type, location, amount, date, status,
         next_action, next_action_date, confidence, fit, public_private,
         scope_summary, analysis_status, ai_generated, human_reviewed,
         created_at, updated_at
       ) VALUES (
         $1,$2,$3,$4,$5,$6,$7,$8,$9,
         $10,$11,$12,$13,$14,
         $15,'none',false,false,
         $16,$16
       )`,
      [
        id,
        primaryOrgId,
        sample.name,
        sample.recipient,
        sample.type,
        sample.location,
        sample.amount,
        today,
        sample.status,
        sample.nextAction,
        sample.nextActionDate,
        sample.confidence,
        sample.fit,
        sample.publicPrivate,
        sample.scopeSummary,
        ts,
      ],
    );
    bidsCreated += 1;
    console.log(`Created bid: ${sample.name}`);
  }

  const jobExisting = await pool.query(
    `SELECT id FROM jobs
     WHERE org_id = $1 AND name = $2 AND deleted_at IS NULL
     LIMIT 1`,
    [primaryOrgId, SAMPLE_JOB.name],
  );

  if (jobExisting.rows.length === 0) {
    const jobId = nextId("CCA-JOB");
    const start = "2025-11-01";
    const complete = "2026-03-15";
    const payload = {
      projectedRoi: 12.5,
      finalRoi: 10.8,
      completion: 100,
      closeoutStage: "Complete",
      closeoutHeadline:
        "Sarasota clinic electrical closed — labor hours ran 8% over estimate on trim-out.",
      estimateVsActual: [
        { label: "Total cost", estimated: 255000, actual: 268500, variancePct: -5.3 },
        { label: "Crew hours", estimated: 1840, actual: 1995, variancePct: -8.4 },
        { label: "Duration (days)", estimated: 90, actual: 98, variancePct: -8.9 },
      ],
      closeoutLearnings: [
        "Add 8% trim-out contingency on multi-room clinical fit-outs in FL coastal markets.",
        "Verify fire-alarm vendor lead times before bid lock.",
      ],
      retainageAmount: 13750,
      retainageStatus: "Released",
    };

    await pool.query(
      `INSERT INTO jobs (
         id, org_id, bid_id, name, client, location, vertical, contract_value,
         start_date, target_completion, project_manager, crew_lead,
         current_phase, phase_index, total_phases, status, payload_json,
         created_at, updated_at
       ) VALUES (
         $1,$2,NULL,$3,$4,$5,$6,$7,
         $8,$9,$10,$11,
         $12,$13,$14,$15,$16,
         $17,$17
       )`,
      [
        jobId,
        primaryOrgId,
        SAMPLE_JOB.name,
        SAMPLE_JOB.client,
        SAMPLE_JOB.location,
        SAMPLE_JOB.vertical,
        SAMPLE_JOB.contractValue,
        start,
        complete,
        SAMPLE_JOB.projectManager,
        SAMPLE_JOB.crewLead,
        SAMPLE_JOB.currentPhase,
        SAMPLE_JOB.phaseIndex,
        SAMPLE_JOB.totalPhases,
        SAMPLE_JOB.status,
        JSON.stringify(payload),
        ts,
      ],
    );
    console.log(`Created job: ${SAMPLE_JOB.name}`);
  } else {
    console.log(`Job exists: ${SAMPLE_JOB.name}`);
  }

  const counts = await pool.query(
    `SELECT
       (SELECT COUNT(*)::int FROM bids WHERE org_id = $1 AND deleted_at IS NULL) AS bids,
       (SELECT COUNT(*)::int FROM jobs WHERE org_id = $1 AND deleted_at IS NULL) AS jobs`,
    [primaryOrgId],
  );
  console.log(
    `Smoke org ready: ${counts.rows[0].bids} bids, ${counts.rows[0].jobs} jobs (created ${bidsCreated} new bids).`,
  );
} finally {
  await pool.end();
}
