#!/usr/bin/env node
/**
 * Automated smoke test for the team BidOS URL.
 * Supports legacy email/password auth and Clerk mode (no secrets required).
 * Never prints passwords, tokens, or cookie values.
 *
 * Usage:
 *   node scripts/smoke-team-url.mjs
 *   BIOS_SMOKE_PASSWORD=... node scripts/smoke-team-url.mjs   # legacy auth only
 *   node scripts/smoke-team-url.mjs --dry-run                  # CI: validate config, no network
 *
 * Env:
 *   BIOS_SMOKE_URL          Target base URL (default team URL)
 *   BIOS_SMOKE_AUTH_MODE    auto | clerk | legacy (default auto — detected from /api/health)
 *   BIOS_SMOKE_PASSWORD     Required for legacy login smoke only
 *   BIOS_SMOKE_EMAIL        Legacy login email (default carmen@ccacontact.com)
 */
import { config as loadEnv } from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
loadEnv({ path: path.join(root, ".env") });

const DRY_RUN = process.argv.includes("--dry-run");
const BASE_URL = (process.env.BIOS_SMOKE_URL || "https://bidintelligence.cagteam.net").replace(/\/+$/, "");
const SMOKE_EMAIL = (process.env.BIOS_SMOKE_EMAIL || "carmen@ccacontact.com").trim().toLowerCase();
const SMOKE_PASSWORD = process.env.BIOS_SMOKE_PASSWORD?.trim();
const AUTH_MODE_HINT = (process.env.BIOS_SMOKE_AUTH_MODE || "auto").trim().toLowerCase();
const TIMEOUT_MS = Number(process.env.BIOS_SMOKE_TIMEOUT_MS || 15000);

const LEGACY_CHECKS = [
  "GET /api/health",
  "POST /api/v1/auth/login",
  "GET /api/v1/bids",
  "GET /api/v1/jobs",
  "GET /api/v1/ops/alerts",
  "GET /api/v1/command-center/projection",
];

const CLERK_CHECKS = [
  "GET /api/health (auth=clerk)",
  "GET /api/v1/auth/config",
  "GET /login",
  "POST /api/v1/auth/login (expect 400 clerk gate)",
  "SKIP authed API routes (manual browser test with Clerk)",
];

const DOCUMENTED_SMOKE_USERS = ["carmen@ccacontact.com", "rose@ccacontact.com"];

const results = [];
let failed = false;
let resolvedAuthMode = AUTH_MODE_HINT === "clerk" || AUTH_MODE_HINT === "legacy" ? AUTH_MODE_HINT : null;

function redactEmail(email) {
  const [local, domain] = email.split("@");
  if (!domain) return "***";
  const head = local.length <= 2 ? local[0] || "*" : `${local.slice(0, 2)}***`;
  return `${head}@${domain}`;
}

function fail(message) {
  failed = true;
  results.push(`FAIL ${message}`);
}

function pass(message) {
  results.push(`PASS ${message}`);
}

function skip(message) {
  results.push(`SKIP ${message}`);
}

async function fetchRequest(method, urlPath, { body, cookie, accept = "application/json" } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const headers = { Accept: accept };
    if (body !== undefined) headers["Content-Type"] = "application/json";
    if (cookie) headers.Cookie = cookie;

    const res = await fetch(`${BASE_URL}${urlPath}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    const text = await res.text();
    let json = null;
    if (text && accept.includes("json")) {
      try {
        json = JSON.parse(text);
      } catch {
        json = null;
      }
    }

    const setCookies =
      typeof res.headers.getSetCookie === "function" ? res.headers.getSetCookie() : [];

    return { status: res.status, json, setCookies, raw: text.slice(0, 200), contentType: res.headers.get("content-type") };
  } finally {
    clearTimeout(timer);
  }
}

const fetchJson = (method, urlPath, opts) => fetchRequest(method, urlPath, opts);

function extractBiosToken(setCookies) {
  for (const entry of setCookies) {
    const match = entry.match(/(?:^|;\s*)bios_token=([^;]+)/);
    if (match) return match[1];
  }
  return null;
}

function summarizeList(json) {
  if (Array.isArray(json)) return `items=${json.length}`;
  if (json && Array.isArray(json.items)) return `items=${json.items.length}`;
  if (json && Array.isArray(json.bids)) return `bids=${json.bids.length}`;
  if (json && Array.isArray(json.jobs)) return `jobs=${json.jobs.length}`;
  if (json && typeof json === "object") return "json=object";
  return "json=unknown";
}

function resolveAuthModeFromHealth(json) {
  if (json?.auth === "clerk") return "clerk";
  if (json?.auth === "legacy") return "legacy";
  return null;
}

async function checkHealth() {
  const { status, json } = await fetchJson("GET", "/api/health");
  if (status !== 200) {
    fail(`GET /api/health (${status}) expected 200`);
    return null;
  }
  if (json?.status !== "ok") {
    fail(`GET /api/health status=${json?.status ?? "missing"} expected ok`);
    return null;
  }
  if (json?.database?.driver !== "postgres") {
    fail(`GET /api/health database.driver=${json?.database?.driver ?? "missing"} expected postgres`);
    return null;
  }
  if (json?.auditEngine !== true) {
    fail(`GET /api/health auditEngine=${String(json?.auditEngine)} expected true`);
    return null;
  }

  const mode = resolveAuthModeFromHealth(json);
  if (AUTH_MODE_HINT === "auto" && mode) {
    resolvedAuthMode = mode;
  }
  const authLabel = json?.auth ?? "unknown";
  pass(`GET /api/health (${status}) status=ok postgres auditEngine=true auth=${authLabel}`);
  return json;
}

async function checkAuthConfig() {
  const { status, json } = await fetchJson("GET", "/api/v1/auth/config");
  if (status !== 200) {
    fail(`GET /api/v1/auth/config (${status}) expected 200`);
    return;
  }
  if (json?.clerk !== true) {
    fail(`GET /api/v1/auth/config clerk=${String(json?.clerk)} expected true`);
    return;
  }
  if (json?.legacyLogin !== false) {
    fail(`GET /api/v1/auth/config legacyLogin=${String(json?.legacyLogin)} expected false`);
    return;
  }
  pass(`GET /api/v1/auth/config (${status}) clerk=true legacyLogin=false`);
}

async function checkLoginPage() {
  const { status, contentType } = await fetchRequest("GET", "/login", { accept: "text/html" });
  if (status !== 200) {
    fail(`GET /login (${status}) expected 200`);
    return;
  }
  const ct = contentType ?? "unknown";
  pass(`GET /login (${status}) content-type=${ct.split(";")[0]}`);
}

async function checkClerkLoginGate() {
  const { status, json } = await fetchJson("POST", "/api/v1/auth/login", {
    body: { email: SMOKE_EMAIL, password: "invalid-smoke-probe" },
  });
  if (status !== 400) {
    fail(`POST /api/v1/auth/login (${status}) expected 400 clerk gate`);
    return;
  }
  const err = String(json?.error ?? "");
  if (!/clerk/i.test(err)) {
    fail(`POST /api/v1/auth/login error does not mention Clerk`);
    return;
  }
  pass(`POST /api/v1/auth/login (${status}) clerk gate active`);
}

async function loginLegacy() {
  if (!SMOKE_PASSWORD) {
    fail("BIOS_SMOKE_PASSWORD is not set (required for legacy auth smoke; never logged)");
    return null;
  }

  if (!DOCUMENTED_SMOKE_USERS.includes(SMOKE_EMAIL) && !process.env.BIOS_SMOKE_EMAIL) {
    fail(`BIOS_SMOKE_EMAIL=${redactEmail(SMOKE_EMAIL)} is not a documented smoke user`);
    return null;
  }

  const { status, json, setCookies } = await fetchJson("POST", "/api/v1/auth/login", {
    body: { email: SMOKE_EMAIL, password: SMOKE_PASSWORD },
  });

  if (status !== 200) {
    const err = json?.error ? String(json.error).slice(0, 80) : "login failed";
    fail(`POST /api/v1/auth/login (${status}) ${err}`);
    return null;
  }

  const token = extractBiosToken(setCookies);
  if (!token) {
    fail("POST /api/v1/auth/login missing bios_token cookie");
    return null;
  }

  pass(`POST /api/v1/auth/login (${status}) user=${redactEmail(json?.user?.email || SMOKE_EMAIL)}`);
  return `bios_token=${token}`;
}

async function checkAuthedGet(label, path, cookie, validator) {
  const { status, json } = await fetchJson("GET", path, { cookie });
  if (status !== 200) {
    fail(`GET ${path} (${status}) expected 200`);
    return;
  }
  if (validator && !validator(json)) {
    fail(`GET ${path} response failed validation`);
    return;
  }
  pass(`GET ${path} (${status}) ${summarizeList(json)}`);
}

async function runClerkSmoke() {
  await checkAuthConfig();
  await checkLoginPage();
  await checkClerkLoginGate();
  skip("authed API routes — verify bids/jobs/ops in browser after Clerk sign-in");
}

async function runLegacySmoke() {
  const cookie = await loginLegacy();
  if (cookie) {
    await checkAuthedGet("bids", "/api/v1/bids", cookie, (json) => Array.isArray(json?.bids));
    await checkAuthedGet("jobs", "/api/v1/jobs", cookie, (json) => Array.isArray(json?.jobs));
    await checkAuthedGet("ops alerts", "/api/v1/ops/alerts", cookie, (json) => json && typeof json === "object");
    await checkAuthedGet(
      "command center",
      "/api/v1/command-center/projection",
      cookie,
      (json) => json && typeof json === "object",
    );
  }
}

function runDryRun() {
  const mode = AUTH_MODE_HINT === "auto" ? "auto (detect from health)" : AUTH_MODE_HINT;
  const checks = AUTH_MODE_HINT === "legacy" ? LEGACY_CHECKS : AUTH_MODE_HINT === "clerk" ? CLERK_CHECKS : [...CLERK_CHECKS];
  console.log("BidIntelligenceOS team URL smoke — dry-run (no network)");
  console.log(`Target: ${BASE_URL}`);
  console.log(`Auth mode: ${mode}`);
  if (AUTH_MODE_HINT === "legacy" || AUTH_MODE_HINT === "auto") {
    console.log(`Email: ${redactEmail(SMOKE_EMAIL)}`);
  }
  console.log(`Timeout: ${TIMEOUT_MS}ms`);
  if (AUTH_MODE_HINT === "legacy" && !SMOKE_PASSWORD) {
    console.error("FAIL BIOS_SMOKE_PASSWORD required for legacy dry-run validation");
    process.exit(1);
  }
  if (AUTH_MODE_HINT === "legacy" && !DOCUMENTED_SMOKE_USERS.includes(SMOKE_EMAIL) && process.env.BIOS_SMOKE_EMAIL) {
    console.error(`FAIL unknown smoke user ${redactEmail(SMOKE_EMAIL)}`);
    process.exit(1);
  }
  for (const step of checks) console.log(`  would run ${step}`);
  console.log("SMOKE DRY-RUN PASS");
}

async function main() {
  if (DRY_RUN) {
    runDryRun();
    return;
  }

  console.log(`BidIntelligenceOS team URL smoke — ${BASE_URL}`);

  await checkHealth();

  const mode = resolvedAuthMode ?? AUTH_MODE_HINT;
  if (mode === "clerk") {
    console.log("Auth mode: clerk (public checks only; authed routes need browser sign-in)");
    await runClerkSmoke();
  } else if (mode === "legacy") {
    console.log("Auth mode: legacy (email/password login smoke)");
    await runLegacySmoke();
  } else {
    fail(`Could not determine auth mode (health auth field missing; set BIOS_SMOKE_AUTH_MODE=clerk|legacy)`);
  }

  for (const line of results) console.log(line);
  console.log(failed ? "SMOKE FAIL" : "SMOKE PASS");
  process.exit(failed ? 1 : 0);
}

main().catch((error) => {
  console.error(`Smoke script error: ${error.message}`);
  process.exit(1);
});
