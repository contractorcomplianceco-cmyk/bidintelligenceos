#!/usr/bin/env node
/**
 * Sync shared CCA Clerk keys into bid-intelligence-os .env (server-only).
 * Never prints secret values.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const biosEnv = path.resolve(__dirname, "../.env");
const ccApiEnv = path.resolve(__dirname, "../../cca-command-center-cloud/artifacts/api-server/.env.local");

function readEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return new Map();
  const map = new Map();
  for (const line of fs.readFileSync(filePath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    map.set(trimmed.slice(0, eq), trimmed.slice(eq + 1));
  }
  return map;
}

function upsertEnv(lines, key, value) {
  if (!value) return lines;
  const prefix = `${key}=`;
  const idx = lines.findIndex((l) => l.startsWith(prefix) || l.match(new RegExp(`^#\\s*${key}=`)));
  const next = `${key}=${value}`;
  if (idx >= 0) lines[idx] = next;
  else lines.push(next);
  return lines;
}

const cc = readEnvFile(ccApiEnv);
const pk = cc.get("CLERK_PUBLISHABLE_KEY") || cc.get("VITE_CLERK_PUBLISHABLE_KEY");
const sk = cc.get("CLERK_SECRET_KEY");

if (!pk || !sk) {
  console.error("FAIL: Clerk keys not found in command-center .env.local");
  process.exit(1);
}

let lines = fs.existsSync(biosEnv) ? fs.readFileSync(biosEnv, "utf8").split("\n") : [];
lines = upsertEnv(lines, "AUTH_ENABLED", "true");
lines = upsertEnv(lines, "CLERK_SECRET_KEY", sk);
lines = upsertEnv(lines, "CLERK_PUBLISHABLE_KEY", pk);
lines = upsertEnv(lines, "VITE_CLERK_PUBLISHABLE_KEY", pk);
lines = upsertEnv(lines, "ADMIN_EMAILS", "contractorcomplianceco@gmail.com,carmenaburoda@gmail.com");
lines = upsertEnv(lines, "CORS_ORIGIN", "https://ccabidintelligence.com");

fs.writeFileSync(biosEnv, lines.filter((l, i, a) => !(i === a.length - 1 && l === "")).join("\n") + "\n");
console.log("OK: Clerk keys synced to bid-intelligence-os/.env (AUTH_ENABLED=true)");
