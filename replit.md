# CCA BidIntelligenceOS

A premium, contractor-facing bid intelligence SaaS prototype (tagline: "Research Less, Win More") that helps commercial trade contractors analyze opportunities, structure pricing, build vendor-facing bid packages, and track outcomes.

## Run & Operate

- `pnpm --filter @workspace/bid-intelligence-os run dev` — run the web app (frontend-only)
- `pnpm --filter @workspace/bid-intelligence-os run typecheck` — typecheck the app
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind, shadcn/ui, lucide-react icons, recharts, wouter routing
- No backend — 100% frontend with local seeded data

## Where things live

- App entry/routing: `artifacts/bid-intelligence-os/src/App.tsx`
- Layout (sidebar + topbar, responsive): `artifacts/bid-intelligence-os/src/components/layout.tsx`
- Global mode context (Standalone / ContractorConnect Add-On): `artifacts/bid-intelligence-os/src/lib/context.tsx`
- Seed data (bids, analytics series, defaults): `artifacts/bid-intelligence-os/src/lib/data.ts`
- Client-facing bid package seed data (3 sample proposals: HVAC, Roofing, Multi-location): `artifacts/bid-intelligence-os/src/lib/bid-packages.ts`
- Screens: `artifacts/bid-intelligence-os/src/pages/` (dashboard, company-profile, bid-library, new-bid, scope-analyzer, cost-inputs, bid-fit, strategy-memo, package-builder, monitoring, analytics, addon, settings)
- Theme tokens: `artifacts/bid-intelligence-os/src/index.css`

## Architecture decisions

- Frontend-only prototype: all data is seeded locally in `src/lib/data.ts`; there is no API server dependency for this artifact.
- A global product-mode context drives label/panel adaptation between "Standalone" and "ContractorConnect Add-On" modes while keeping the core workflow identical.
- Bid Package Builder includes a Builder/Preview tabbed flow; internal strategy content is kept separate from the vendor-facing package by design.

## Product

CCA BidIntelligenceOS is a decision-support workspace for commercial trade contractors (HVAC, roofing, electrical, concrete, facilities maintenance). It covers: dashboard overview, company profile, bid library, guided new-bid analysis, scope analysis, cost inputs, bid-fit scoring, internal strategy memo, vendor-facing bid package builder + export preview, bid monitoring, win/loss analytics, and a ContractorConnect add-on view.

## Guardrails (product constraints)

- Never expose or reference any internal pricing formula model.
- Never promise guaranteed bid/pricing/compliance/bonding/licensing/award outcomes.
- Keep internal strategy separate from the vendor-facing bid package.
- All AI/demo output requires user review before export.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
