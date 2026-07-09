#!/usr/bin/env node
/**
 * Clerk cutover preflight — read-only checks before enabling AUTH_ENABLED.
 * Never prints secret values (names and formats only).
 *
 * Usage:
 *   node scripts/clerk-cutover-preflight.mjs
 *   node scripts/clerk-cutover-preflight.mjs --check-only
 */
import { config as loadEnv } from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const envPath = path.join(root, ".env");

loadEnv({ path: envPath });

const APP_ORIGIN = "https://bidintelligence.cagteam.net";
const EXPECTED_CLERK_REDIRECTS = [
  APP_ORIGIN,
  `${APP_ORIGIN}/login`,
  `${APP_ORIGIN}/register`,
  "https://accounts.docs.cagteam.net/sign-in",
  "https://accounts.docs.cagteam.net/sign-up",
];

const REQUIRED_VARS = [
  "CLERK_SECRET_KEY",
  "CLERK_PUBLISHABLE_KEY",
  "VITE_CLERK_PUBLISHABLE_KEY",
  "VITE_CLERK_SIGN_IN_URL",
  "VITE_CLERK_SIGN_UP_URL",
  "ADMIN_EMAILS",
  "CORS_ORIGIN",
  "BIOS_PUBLIC_URL",
  "VITE_APP_URL",
];

const SMOKE_TEST_OPTIONAL_VARS = ["VITE_CLERK_PUBLISHABLE_KEY"];
const APP_URL_VARS = ["CORS_ORIGIN", "BIOS_PUBLIC_URL", "VITE_APP_URL"];

const PK_RE = /^pk_(live|test)_[A-Za-z0-9+/=_-]+$/;
const SK_RE = /^sk_(live|test)_[A-Za-z0-9+/=_-]+$/;

function normalizeUrl(value) {
  return value?.trim().replace(/\/+$/, "") ?? "";
}

function readEnvKeysFromFile(filePath) {
  const keys = new Set();
  if (!fs.existsSync(filePath)) return keys;
  for (const line of fs.readFileSync(filePath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    keys.add(trimmed.slice(0, eq));
  }
  return keys;
}

function present(name) {
  const value = process.env[name]?.trim();
  return Boolean(value);
}

function fail(messages, message) {
  messages.push(`FAIL: ${message}`);
}

function ok(messages, message) {
  messages.push(`OK: ${message}`);
}

function warn(messages, message) {
  messages.push(`WARN: ${message}`);
}

const checkOnly = process.argv.includes("--check-only") || process.argv.length <= 2;
const results = [];
let exitCode = 0;

console.log("Clerk cutover preflight (check-only — no changes made)");
console.log(`Env file: ${envPath} (${fs.existsSync(envPath) ? "found" : "missing"})`);
console.log(`Mode: ${checkOnly ? "check-only" : "check-only"}`);
console.log("");

const authEnabled = process.env.AUTH_ENABLED?.trim().toLowerCase();
const smokeTestMode = authEnabled !== "true";

if (authEnabled === "true") {
  fail(results, "AUTH_ENABLED is true — production Clerk is already enabled; rollback before re-running cutover prep");
  exitCode = 1;
} else if (authEnabled === "false" || !authEnabled) {
  ok(results, `AUTH_ENABLED is not true (current=${authEnabled || "(unset)"}) — smoke-test / prep mode`);
} else {
  fail(results, "AUTH_ENABLED has unexpected value (not true/false)");
  exitCode = 1;
}

const declaredKeys = readEnvKeysFromFile(envPath);
const presentVars = [];
const missingVars = [];

for (const name of REQUIRED_VARS) {
  if (present(name)) {
    presentVars.push(name);
    continue;
  }
  if (smokeTestMode && SMOKE_TEST_OPTIONAL_VARS.includes(name)) {
    warn(results, `${name} missing or empty — expected during smoke-test; required before cutover deploy`);
    continue;
  }
  missingVars.push(name);
}

ok(results, `env vars present (${presentVars.length}/${REQUIRED_VARS.length}): ${presentVars.join(", ") || "(none)"}`);
if (missingVars.length) {
  fail(results, `env vars missing or empty: ${missingVars.join(", ")}`);
  exitCode = 1;
}

for (const name of ["CLERK_PUBLISHABLE_KEY", "VITE_CLERK_PUBLISHABLE_KEY"]) {
  const value = process.env[name]?.trim();
  if (!value) continue;
  if (PK_RE.test(value)) ok(results, `${name} format valid (pk_*)`);
  else {
    fail(results, `${name} format invalid — expected pk_live_* or pk_test_*`);
    exitCode = 1;
  }
}

const sk = process.env.CLERK_SECRET_KEY?.trim();
if (sk) {
  if (SK_RE.test(sk)) ok(results, "CLERK_SECRET_KEY format valid (sk_*)");
  else {
    fail(results, "CLERK_SECRET_KEY format invalid — expected sk_live_* or sk_test_*");
    exitCode = 1;
  }
}

if (
  present("CLERK_PUBLISHABLE_KEY") &&
  present("VITE_CLERK_PUBLISHABLE_KEY") &&
  process.env.CLERK_PUBLISHABLE_KEY?.trim() !== process.env.VITE_CLERK_PUBLISHABLE_KEY?.trim()
) {
  warn(results, "CLERK_PUBLISHABLE_KEY and VITE_CLERK_PUBLISHABLE_KEY differ — they should match at deploy time");
}

for (const name of APP_URL_VARS) {
  const value = normalizeUrl(process.env[name]);
  if (!value) continue;
  if (value === APP_ORIGIN) {
    ok(results, `${name} matches ${APP_ORIGIN}`);
  } else {
    fail(results, `${name} is "${value}" — expected ${APP_ORIGIN}`);
    exitCode = 1;
  }
  if (value.includes("bidintelligence.docs.cagteam.net")) {
    fail(results, `${name} must not use bidintelligence.docs.cagteam.net`);
    exitCode = 1;
  }
}

console.log("Expected Clerk Dashboard redirect URLs / allowed origins:");
for (const url of EXPECTED_CLERK_REDIRECTS) console.log(`  - ${url}`);
console.log("");

const wrongDomainHits = APP_URL_VARS.filter((name) =>
  (process.env[name] ?? "").includes("bidintelligence.docs.cagteam.net"),
);
if (!wrongDomainHits.length) {
  ok(results, "no app URL env uses bidintelligence.docs.cagteam.net");
}

const scriptChecks = [
  ["scripts/sync-clerk-env.mjs", "sync Clerk keys from Command Center"],
  ["scripts/seed-smoke-users.mjs", "seed legacy smoke-test users"],
];
for (const [rel, desc] of scriptChecks) {
  const abs = path.join(root, rel);
  if (fs.existsSync(abs)) ok(results, `${rel} exists (${desc})`);
  else {
    fail(results, `${rel} missing (${desc})`);
    exitCode = 1;
  }
}

if (declaredKeys.has("VITE_CLERK_PUBLISHABLE_KEY") && !present("VITE_CLERK_PUBLISHABLE_KEY")) {
  warn(results, "VITE_CLERK_PUBLISHABLE_KEY is declared but empty/commented — expected during smoke-test; uncomment before cutover deploy");
}

for (const line of results) console.log(line);
console.log("");
console.log(exitCode === 0 ? "PREFLIGHT PASS — ready for manual Clerk dashboard + deploy steps" : "PREFLIGHT FAIL — fix issues before cutover");
process.exit(exitCode);
