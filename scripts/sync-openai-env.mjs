#!/usr/bin/env node
/** Sync BIOS_OPENAI_API_KEY from shared CCA command-center env (never prints values). */
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
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq === -1) continue;
    map.set(t.slice(0, eq), t.slice(eq + 1));
  }
  return map;
}

function upsert(lines, key, value) {
  if (!value) return lines;
  const prefix = `${key}=`;
  const idx = lines.findIndex((l) => l.startsWith(prefix));
  const row = `${key}=${value}`;
  if (idx >= 0) lines[idx] = row;
  else lines.push(row);
  return lines;
}

const cc = readEnvFile(ccApiEnv);
const key = cc.get("OPENAI_API_KEY") || cc.get("BIOS_OPENAI_API_KEY");
if (!key) {
  console.error("FAIL: OPENAI_API_KEY not found in command-center env");
  process.exit(1);
}

let lines = fs.existsSync(biosEnv) ? fs.readFileSync(biosEnv, "utf8").split("\n") : [];
lines = upsert(lines, "BIOS_OPENAI_API_KEY", key);
lines = upsert(lines, "BIOS_OPENAI_MODEL", "gpt-4o-mini");

fs.writeFileSync(biosEnv, lines.join("\n").replace(/\n*$/, "\n"));
console.log("OK: BIOS_OPENAI_API_KEY synced (Rose Brain enabled)");
