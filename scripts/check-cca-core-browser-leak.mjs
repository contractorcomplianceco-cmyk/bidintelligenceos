#!/usr/bin/env node
/**
 * Pre-build security: fail if server-only @workspace/cca-core is referenced from the web bundle.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(__dirname, "../apps/web/src");
const forbidden = ["@workspace/cca-core", "lib/cca-core", "bid-scoring.ts", "audit-engine-fetch"];

function walk(dir, files = []) {
  for (const name of fs.readdirSync(dir)) {
    const abs = path.join(dir, name);
    const stat = fs.statSync(abs);
    if (stat.isDirectory()) walk(abs, files);
    else if (/\.(tsx?|jsx?)$/.test(name)) files.push(abs);
  }
  return files;
}

const hits = [];
for (const file of walk(webRoot)) {
  const text = fs.readFileSync(file, "utf8");
  for (const needle of forbidden) {
    if (text.includes(needle)) hits.push({ file, needle });
  }
}

if (hits.length) {
  console.error("FAIL: server-only engine import in browser code:");
  for (const h of hits) console.error(`  ${path.relative(process.cwd(), h.file)} → ${h.needle}`);
  process.exit(1);
}

console.log("OK: no @workspace/cca-core leaks in apps/web/src");
