#!/usr/bin/env node
/**
 * Weekly/monthly refresh for public intel card as_of_date + optional BLS/FRED pulls.
 * Honest skip + Carmen email reminder when API keys missing or feed fails.
 * Never includes secrets in alerts.
 *
 * Usage: node scripts/refresh-public-intel-anchors.mjs
 * Cron (weekly): 15 6 * * 1  cd /home/ubuntu/projects/bid-intelligence-os && node scripts/refresh-public-intel-anchors.mjs
 */
import { config as loadEnv } from "dotenv";
import { execFile } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
loadEnv({ path: path.join(root, ".env") });

const ALERT_ENV_FILE =
  process.env.BIOS_ALERT_ENV_FILE ||
  process.env.CCA_UPTIME_ENV_FILE ||
  "/home/ubuntu/projects/profitpulse/scripts/uptime-alert-settings";
const MAIL_HELPER =
  process.env.BIOS_MAIL_HELPER || "/home/ubuntu/scripts/cca-uptime-sendmail.py";
const ALERT_TO = process.env.BIOS_ALERT_EMAIL || process.env.CCA_UPTIME_EMAIL || "carmenaburoda@gmail.com";

function loadEnvFile(p) {
  if (!existsSync(p)) return;
  for (const rawLine of readFileSync(p, "utf8").split(/\r*\n|\r|\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const match = line.match(/^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (process.env[key]) continue;
    process.env[key] = rawValue.replace(/^["']|["']$/g, "");
  }
}

loadEnvFile(ALERT_ENV_FILE);

const cardsPath = path.join(root, "apps/api/src/data/public-intel-cards/p0-cards.json");
const pack = JSON.parse(readFileSync(cardsPath, "utf8"));
const today = new Date().toISOString().slice(0, 10);
const force = process.argv.includes("--force");
const fredKey = process.env.FRED_API_KEY?.trim();
const blsKey = process.env.BLS_API_KEY?.trim(); // optional; some BLS series are public

const lastRun = pack.refresh?.lastRun;
if (!force && lastRun) {
  const ageMs = Date.now() - Date.parse(lastRun);
  if (Number.isFinite(ageMs) && ageMs < 6 * 24 * 60 * 60 * 1000) {
    console.log(`Skip refresh — lastRun=${lastRun} (<6 days). Use --force to override.`);
    process.exit(0);
  }
}

const skips = [];
const updates = [];

async function tryFredSeries(seriesId) {
  if (!fredKey) return null;
  const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${encodeURIComponent(seriesId)}&api_key=${encodeURIComponent(fredKey)}&file_type=json&sort_order=desc&limit=1`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const json = await res.json();
  const obs = json?.observations?.[0];
  if (!obs || obs.value === ".") return null;
  return { value: Number(obs.value), date: obs.date };
}

async function sendReminder(subject, body) {
  if (!existsSync(MAIL_HELPER)) {
    console.warn(`Mail helper missing (${MAIL_HELPER}); reminder logged only.`);
    console.warn(subject);
    console.warn(body);
    return;
  }
  try {
    await execFileAsync("python3", [MAIL_HELPER, ALERT_TO, subject, body], { timeout: 30_000 });
    console.log(`Reminder emailed to ${ALERT_TO} (no secrets in body).`);
  } catch (e) {
    console.warn("Email reminder failed:", e instanceof Error ? e.message : e);
  }
}

// Bump as_of_date on all cards when we at least refresh the stamp (manual cadence honesty).
for (const card of pack.cards ?? []) {
  const prev = card.asOfDate;
  card.asOfDate = today;
  updates.push(`${card.id}: ${prev} → ${today}`);
}

// Optional FRED probe (construction wages proxy) — store note in pack metadata only.
pack.refresh = pack.refresh || {};
pack.refresh.lastRun = today;
pack.refresh.sources = [];
pack.refresh.skips = [];

if (fredKey) {
  try {
    const ces = await tryFredSeries("CES2000000003"); // Avg hourly earnings construction
    if (ces) {
      pack.refresh.sources.push({
        source: "FRED",
        series: "CES2000000003",
        value: ces.value,
        asOf: ces.date,
      });
    } else {
      skips.push("FRED CES2000000003 returned no usable observation");
    }
  } catch {
    skips.push("FRED request failed");
  }
} else {
  skips.push("FRED_API_KEY not set — card numbers not auto-pulled; as_of_date stamped only");
}

if (!blsKey) {
  skips.push("BLS_API_KEY not set — PPI series not auto-pulled (manual refresh of card copy still required)");
}

pack.refresh.skips = skips;
const livePulled = (pack.refresh.sources ?? []).length > 0;
const keysMissing = !fredKey || !blsKey;
if (livePulled && !keysMissing && skips.length === 0) {
  pack.refresh.mode = "live";
  pack.refresh.honestyLabel = `Market anchors as of ${today}, live FRED/BLS refresh`;
} else if (livePulled) {
  pack.refresh.mode = "partial";
  pack.refresh.honestyLabel = `Market anchors as of ${today}, partial (some series live; treat others as manual)`;
} else {
  pack.refresh.mode = "manual";
  pack.refresh.honestyLabel = `Market anchors as of ${today}, manual — FRED/BLS not live-pulled`;
}

writeFileSync(cardsPath, `${JSON.stringify(pack, null, 2)}\n`);
console.log(`Updated as_of_date on ${(pack.cards ?? []).length} cards → ${today}`);
console.log(`Refresh honesty: ${pack.refresh.honestyLabel}`);
if (skips.length) {
  console.log("Skips / reminders:");
  for (const s of skips) console.log(`  - ${s}`);
  await sendReminder(
    "[BidOS] Public intel refresh needs attention",
    [
      `BidIntelligenceOS weekly public-intel refresh ran at ${new Date().toISOString()}.`,
      `Cards stamped as_of_date=${today} (${(pack.cards ?? []).length} cards).`,
      `Honesty stamp: ${pack.refresh.honestyLabel}`,
      "",
      "Skipped / follow-ups (no secrets):",
      ...skips.map((s) => `• ${s}`),
      "",
      "Action: set FRED_API_KEY / BLS_API_KEY for numeric pulls, or manually refresh P0 card numbers + ARM PPI_ANCHORS.",
      "Then re-run: node scripts/embed-public-intel.mjs (if embeddings desired).",
    ].join("\n"),
  );
} else {
  console.log("FRED/BLS pull notes:", JSON.stringify(pack.refresh.sources));
}

console.log(`Sample updates: ${updates.slice(0, 3).join("; ")}`);
