#!/usr/bin/env bash
# Build and (re)start BidIntelligenceOS under PM2.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "==> Building web app..."
npm run build

echo "==> Starting / restarting PM2 process..."
if pm2 describe bid-intelligence-os >/dev/null 2>&1; then
  pm2 startOrReload deploy/ecosystem.config.cjs --update-env
else
  pm2 start deploy/ecosystem.config.cjs
fi

pm2 save

echo "==> Health check..."
sleep 2
curl -sf "http://127.0.0.1:5001/api/health" | head -c 200
echo ""

echo "==> Post-deploy smoke..."
# Clerk mode: smoke uses public health/config/login checks (no secrets).
# Legacy mode: set BIOS_SMOKE_PASSWORD in shell or .env for login + authed API checks.
NODE_PATH="$ROOT/apps/api/node_modules" node scripts/smoke-team-url.mjs

echo "Done. bid-intelligence-os is live on :5001"
