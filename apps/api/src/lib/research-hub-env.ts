import fs from "fs";
import path from "path";

const DEFAULT_RESEARCH_ENV = "/home/ubuntu/projects/cca-research-hub/web/.env.local";

function parseEnvFile(filePath: string): Record<string, string> {
  if (!fs.existsSync(filePath)) return {};
  const out: Record<string, string> = {};
  const text = fs.readFileSync(filePath, "utf8");
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    const value = line.slice(eq + 1).trim().replace(/^['"]|['"]$/g, "");
    if (key) out[key] = value;
  }
  return out;
}

export function readResearchHubConfig() {
  const envFile = process.env.RESEARCH_HUB_ENV_FILE || DEFAULT_RESEARCH_ENV;
  const fileEnv = parseEnvFile(path.resolve(envFile));

  const supabaseUrl =
    process.env.RESEARCH_HUB_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    fileEnv.SUPABASE_URL ||
    fileEnv.NEXT_PUBLIC_SUPABASE_URL;

  const serviceKey =
    process.env.RESEARCH_HUB_SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    fileEnv.SUPABASE_SERVICE_ROLE_KEY;

  return {
    configured: Boolean(supabaseUrl && serviceKey),
    supabaseUrl,
    serviceKey,
    envSource: process.env.RESEARCH_HUB_ENV_FILE ? "configured_env_file" : "research_hub_env_file",
  };
}
