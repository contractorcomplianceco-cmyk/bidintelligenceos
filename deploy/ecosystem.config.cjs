/**
 * PM2 ecosystem — BidIntelligenceOS (API + built SPA on :5001).
 *
 * Start:   pm2 start deploy/ecosystem.config.cjs
 * Restart: pm2 restart bid-intelligence-os
 * Deploy:  ./deploy/deploy.sh
 */
const fs = require("fs");

function loadEnvFile(file) {
  const out = {};
  if (!fs.existsSync(file)) return out;
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq === -1) continue;
    const key = t.slice(0, eq);
    let val = t.slice(eq + 1);
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

const fileEnv = loadEnvFile("/home/ubuntu/projects/bid-intelligence-os/.env");

module.exports = {
  apps: [
    {
      name: "bid-intelligence-os",
      cwd: "/home/ubuntu/projects/bid-intelligence-os",
      // Fork + exec tsx directly — npm in cluster_mode caused restart loops (exit 1).
      script: "/usr/bin/bash",
      args:
        "-c 'exec node_modules/.bin/tsx --tsconfig apps/api/tsconfig.json apps/api/src/index.ts'",
      interpreter: "none",
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        HOST: "0.0.0.0",
        API_PORT: "5001",
        ...fileEnv,
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      min_uptime: "10s",
      max_restarts: 10,
      restart_delay: 3000,
    },
    {
      name: "bid-intelligence-health-monitor",
      cwd: "/home/ubuntu/projects/bid-intelligence-os",
      script: "/usr/bin/bash",
      args:
        "-c 'while true; do node scripts/monitor-bid-intelligence-health.mjs || true; sleep 900; done'",
      interpreter: "none",
      exec_mode: "fork",
      env: {
        BIOS_PM2_APPS:
          "bid-intelligence-os,bid-intelligence-health-monitor,bid-intelligence-ppi-refresh",
        ...fileEnv,
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "64M",
    },
    {
      // Weekly public-intel as_of refresh + honest skip email to Carmen (no secrets).
      // sleep ~7d between runs; deploy does not wait on this loop.
      name: "bid-intelligence-ppi-refresh",
      cwd: "/home/ubuntu/projects/bid-intelligence-os",
      script: "/usr/bin/bash",
      args:
        "-c 'while true; do node scripts/refresh-public-intel-anchors.mjs || true; sleep 604800; done'",
      interpreter: "none",
      exec_mode: "fork",
      env: {
        ...fileEnv,
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "64M",
    },
  ],
};
