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
MAX_ATTEMPTS=30
SLEEP_SEC=2
healthy=0
for attempt in $(seq 1 "$MAX_ATTEMPTS"); do
  if curl -sf "http://127.0.0.1:5001/api/health" | head -c 200; then
    echo ""
    healthy=1
    break
  fi
  echo "Health check attempt ${attempt}/${MAX_ATTEMPTS} failed; retrying in ${SLEEP_SEC}s..."
  sleep "$SLEEP_SEC"
done
if [ "$healthy" -ne 1 ]; then
  echo "Health check failed after ${MAX_ATTEMPTS} attempts (~$((MAX_ATTEMPTS * SLEEP_SEC))s)"
  exit 1
fi

echo "==> Post-deploy smoke..."
# Clerk mode: smoke uses public health/config/login checks (no secrets).
# Legacy mode: set BIOS_SMOKE_PASSWORD in shell or .env for login + authed API checks.
NODE_PATH="$ROOT/apps/api/node_modules" node scripts/smoke-team-url.mjs

echo "Done. bid-intelligence-os is live on :5001"
