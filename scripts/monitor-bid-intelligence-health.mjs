#!/usr/bin/env node
import { execFile } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { request } from "node:http";
import { request as secureRequest } from "node:https";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const ALERT_ENV_FILE =
  process.env.BIOS_ALERT_ENV_FILE ||
  process.env.CCA_UPTIME_ENV_FILE ||
  "/home/ubuntu/projects/profitpulse/scripts/uptime-alert-settings";
const MAIL_HELPER =
  process.env.BIOS_MAIL_HELPER || "/home/ubuntu/scripts/cca-uptime-sendmail.py";

loadEnvFile(ALERT_ENV_FILE);

const ALERT_TO = process.env.BIOS_ALERT_EMAIL || process.env.CCA_UPTIME_EMAIL || "carmenaburoda@gmail.com";
const ALERT_FROM = process.env.BIOS_ALERT_FROM || "bid-intelligence-monitor@localhost";
const LOCAL_HEALTH = process.env.BIOS_LOCAL_HEALTH_URL || "http://127.0.0.1:5001/api/health";
const PUBLIC_URL = process.env.BIOS_PUBLIC_URL || "https://ccabidintelligence.com/";
const PUBLIC_HEALTH = process.env.BIOS_PUBLIC_HEALTH_URL || "https://ccabidintelligence.com/api/health";
const REQUIRED_PM2_APPS = (process.env.BIOS_PM2_APPS || "bid-intelligence-os,bid-intelligence-health-monitor,bid-intelligence-ppi-refresh")
  .split(",")
  .map((item) => item.trim())
  .filter(Boolean);
const TIMEOUT_MS = Number(process.env.BIOS_MONITOR_TIMEOUT_MS || 8000);
const RETRY_COUNT = Number(process.env.BIOS_MONITOR_RETRY_COUNT || 3);
const RETRY_DELAY_MS = Number(process.env.BIOS_MONITOR_RETRY_DELAY_MS || 15000);
const ALERT_COOLDOWN_MS = Number(process.env.BIOS_ALERT_COOLDOWN_MS || 3600000);
const ALERT_STATE_FILE = process.env.BIOS_ALERT_STATE_FILE || "/tmp/bid-intelligence-health-alert.ts";

function loadEnvFile(path) {
  if (!existsSync(path)) return;
  for (const rawLine of readFileSync(path, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const match = line.match(/^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (process.env[key]) continue;
    process.env[key] = rawValue.replace(/^["']|["']$/g, "");
  }
}

function fetchStatus(url) {
  return new Promise((resolve) => {
    const client = url.startsWith("https:") ? secureRequest : request;
    const req = client(url, { method: "GET", timeout: TIMEOUT_MS }, (res) => {
      res.resume();
      res.on("end", () => resolve({ ok: res.statusCode >= 200 && res.statusCode < 400, status: res.statusCode }));
    });
    req.on("timeout", () => req.destroy(new Error("timeout")));
    req.on("error", (error) => resolve({ ok: false, error: error.message }));
    req.end();
  });
}

async function checkPm2() {
  const { stdout } = await execFileAsync("pm2", ["jlist"], { timeout: TIMEOUT_MS });
  const apps = JSON.parse(stdout);
  return REQUIRED_PM2_APPS.map((name) => {
    const app = apps.find((item) => item.name === name);
    const status = app?.pm2_env?.status;
    return { name, ok: status === "online", status: status || "missing" };
  });
}

async function sendAlert(subject, body) {
  if (existsSync(MAIL_HELPER)) {
    await execFileAsync("python3", [MAIL_HELPER, subject, body], {
      timeout: TIMEOUT_MS,
      env: { ...process.env, CCA_UPTIME_EMAIL: ALERT_TO },
    });
    return { sent: true };
  }
  return { sent: false, reason: `mail helper missing at ${MAIL_HELPER}` };
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function readAlertState() {
  if (!existsSync(ALERT_STATE_FILE)) return { lastAlertAt: 0 };
  try {
    return JSON.parse(readFileSync(ALERT_STATE_FILE, "utf8"));
  } catch {
    return { lastAlertAt: 0 };
  }
}

function writeAlertState(state) {
  writeFileSync(ALERT_STATE_FILE, JSON.stringify(state));
}

async function collectHealthSnapshot() {
  const [pm2Results, localHealth, publicSite, publicHealth] = await Promise.all([
    checkPm2().catch((error) =>
      REQUIRED_PM2_APPS.map((name) => ({ name, ok: false, status: `pm2 error: ${error.message}` })),
    ),
    fetchStatus(LOCAL_HEALTH),
    fetchStatus(PUBLIC_URL),
    fetchStatus(PUBLIC_HEALTH),
  ]);

  const lines = [
    ...pm2Results.map((r) => `PM2 ${r.name}: ${r.ok ? "OK" : "FAIL"} (${r.status})`),
    `Local API health: ${localHealth.ok ? "OK" : "FAIL"} (${localHealth.status || localHealth.error || "n/a"})`,
    `Public site: ${publicSite.ok ? "OK" : "FAIL"} (${publicSite.status || publicSite.error || "n/a"})`,
    `Public API health: ${publicHealth.ok ? "OK" : "FAIL"} (${publicHealth.status || publicHealth.error || "n/a"})`,
  ];
  const healthy = pm2Results.every((r) => r.ok) && localHealth.ok && publicSite.ok && publicHealth.ok;
  return { lines, healthy };
}

async function main() {
  let snapshot = null;
  for (let attempt = 1; attempt <= RETRY_COUNT; attempt += 1) {
    snapshot = await collectHealthSnapshot();
    if (snapshot.healthy) {
      writeAlertState({ lastAlertAt: 0 });
      console.log(["BidIntelligenceOS health OK", ...snapshot.lines].join("\n"));
      return;
    }
    if (attempt < RETRY_COUNT) await sleep(RETRY_DELAY_MS);
  }

  const body = [
    "BidIntelligenceOS health monitor detected an unhealthy state.",
    "",
    ...snapshot.lines,
    "",
    "No secrets or live customer data included.",
  ].join("\n");

  const { lastAlertAt } = readAlertState();
  if (lastAlertAt > 0 && Date.now() - lastAlertAt < ALERT_COOLDOWN_MS) {
    console.error(`${body}\n\nALERT_SUPPRESSED: cooldown active`);
    process.exitCode = 1;
    return;
  }

  const alertResult = await sendAlert("[CCA] BidIntelligenceOS health alert", body);
  writeAlertState({ lastAlertAt: Date.now() });
  console.error(body);
  if (!alertResult.sent) console.error(`ALERT_NOT_SENT: ${alertResult.reason}`);
  process.exitCode = 1;
}

main().catch((error) => {
  console.error(`BidIntelligenceOS monitor failed: ${error.message}`);
  process.exitCode = 1;
});
