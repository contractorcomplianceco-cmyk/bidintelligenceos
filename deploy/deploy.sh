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

smoke_password_configured() {
  if [[ -n "${BIOS_SMOKE_PASSWORD:-}" ]]; then
    return 0
  fi
  if [[ ! -f "$ROOT/.env" ]]; then
    return 1
  fi
  local val
  val="$(
    grep -E '^BIOS_SMOKE_PASSWORD=' "$ROOT/.env" 2>/dev/null \
      | head -1 \
      | cut -d= -f2- \
      | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//' -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'$//"
  )"
  [[ -n "$val" ]]
}

echo "==> Post-deploy smoke (optional)..."
if smoke_password_configured; then
  node scripts/smoke-team-url.mjs
else
  echo "Skipping post-deploy smoke (BIOS_SMOKE_PASSWORD not set)."
fi

echo "Done. bid-intelligence-os is live on :5001"
