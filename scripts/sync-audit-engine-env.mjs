#!/usr/bin/env node
/** Point BidOS at local CCA Audit API (server-only). */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const biosEnv = path.resolve(__dirname, "../.env");
const url = process.env.AUDIT_ENGINE_API_URL?.trim() || "http://127.0.0.1:3002";

let lines = fs.existsSync(biosEnv) ? fs.readFileSync(biosEnv, "utf8").split("\n") : [];
const prefix = "AUDIT_ENGINE_API_URL=";
const idx = lines.findIndex((l) => l.startsWith(prefix));
const row = `${prefix}${url}`;
if (idx >= 0) lines[idx] = row;
else lines.push(row);
fs.writeFileSync(biosEnv, lines.join("\n").replace(/\n*$/, "\n") + "\n");
console.log("OK: AUDIT_ENGINE_API_URL set for BidOS compliance pull");
