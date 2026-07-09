#!/usr/bin/env node
/**
 * Automated smoke test for the team BidOS URL (legacy auth).
 * Never prints passwords, tokens, or cookie values.
 *
 * Usage:
 *   BIOS_SMOKE_PASSWORD=... node scripts/smoke-team-url.mjs
 *   BIOS_SMOKE_PASSWORD=... BIOS_SMOKE_EMAIL=rose@ccacontact.com node scripts/smoke-team-url.mjs
 */
import { config as loadEnv } from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
loadEnv({ path: path.join(root, ".env") });

const BASE_URL = (process.env.BIOS_SMOKE_URL || "https://bidintelligence.cagteam.net").replace(/\/+$/, "");
const SMOKE_EMAIL = (process.env.BIOS_SMOKE_EMAIL || "carmen@ccacontact.com").trim().toLowerCase();
const SMOKE_PASSWORD = process.env.BIOS_SMOKE_PASSWORD?.trim();
const TIMEOUT_MS = Number(process.env.BIOS_SMOKE_TIMEOUT_MS || 15000);

const DOCUMENTED_SMOKE_USERS = ["carmen@ccacontact.com", "rose@ccacontact.com"];

const results = [];
let failed = false;

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

async function fetchJson(method, urlPath, { body, cookie } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const headers = { Accept: "application/json" };
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
    if (text) {
      try {
        json = JSON.parse(text);
      } catch {
        json = null;
      }
    }

    const setCookies =
      typeof res.headers.getSetCookie === "function" ? res.headers.getSetCookie() : [];

    return { status: res.status, json, setCookies, raw: text.slice(0, 200) };
  } finally {
    clearTimeout(timer);
  }
}

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

async function checkHealth() {
  const { status, json } = await fetchJson("GET", "/api/health");
  if (status !== 200) {
    fail(`GET /api/health (${status}) expected 200`);
    return;
  }
  if (json?.status !== "ok") {
    fail(`GET /api/health status=${json?.status ?? "missing"} expected ok`);
    return;
  }
  if (json?.database?.driver !== "postgres") {
    fail(`GET /api/health database.driver=${json?.database?.driver ?? "missing"} expected postgres`);
    return;
  }
  if (json?.auditEngine !== true) {
    fail(`GET /api/health auditEngine=${String(json?.auditEngine)} expected true`);
    return;
  }
  pass(`GET /api/health (${status}) status=ok postgres auditEngine=true`);
}

async function login() {
  if (!SMOKE_PASSWORD) {
    fail("BIOS_SMOKE_PASSWORD is not set (required; never logged)");
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

async function main() {
  console.log(`BidIntelligenceOS team URL smoke — ${BASE_URL}`);

  await checkHealth();

  const cookie = await login();
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

  for (const line of results) console.log(line);
  console.log(failed ? "SMOKE FAIL" : "SMOKE PASS");
  process.exit(failed ? 1 : 0);
}

main().catch((error) => {
  console.error(`Smoke script error: ${error.message}`);
  process.exit(1);
});
