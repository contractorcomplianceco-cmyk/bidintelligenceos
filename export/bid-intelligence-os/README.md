# CCA BidIntelligenceOS

> Research Less, Win More — a bid intelligence workspace for commercial trade contractors.

A premium frontend prototype covering the full bid-to-job lifecycle: opportunity analysis, bid-fit scoring, vendor-ready bid packages, job deployment, cost tracking, market signals, compliance posture, and the ROSEOS executive intelligence layer.

## Quick start

```bash
npm install
npm run dev
```

- Web app: http://localhost:5173
- API scaffold health check: http://localhost:5001/api/health

That's it — no secrets or external services are required.

## Project structure

```
├── apps/
│   ├── web/        # React + Vite + Tailwind frontend (the product)
│   └── api/        # Express scaffold for future backend work (health endpoint only)
├── core/           # Business logic & seeded domain data (bids, operations, verticals,
│                   # ROSEOS insights, market signals, compliance, government, add-ons…)
├── shared/         # Shared utilities (class-name helper, a11y helpers)
├── config/         # Per-app environment templates
├── .env.example    # Root environment template (copy to .env to customize)
└── package.json    # npm workspaces + dev orchestration
```

The frontend imports business data via the `@core/*` alias and shared utilities via `@shared/*` — both wired in `apps/web/vite.config.ts` and `apps/web/tsconfig.json`.

## Demo mode

`VITE_DEMO_MODE` (default: on) shows a 5-step guided walkthrough on first visit:
what the platform is → what it analyzes → how results are generated → the value → **Enter Platform**.

- Clicking **Enter Platform** routes into the live Command Center and permanently disables the modal for that browser (localStorage flag `bios-walkthrough-complete`).
- Set `VITE_DEMO_MODE=false` in `.env` to turn the walkthrough off entirely.
- To see it again during development, clear the localStorage flag in your browser devtools.

## Environment

Copy `.env.example` to `.env` at the repo root. All values are optional:

| Variable         | Default | Purpose                                   |
| ---------------- | ------- | ----------------------------------------- |
| `VITE_DEMO_MODE` | `true`  | First-visit guided walkthrough modal      |
| `API_PORT`       | `5001`  | Port for the placeholder API server       |

## Scripts

| Command             | What it does                          |
| ------------------- | ------------------------------------- |
| `npm run dev`       | Run web + api together                |
| `npm run dev:web`   | Frontend only                         |
| `npm run dev:api`   | API scaffold only                     |
| `npm run build`     | Production build of the frontend      |
| `npm run typecheck` | TypeScript checks across both apps    |

## Architecture notes

- **Frontend-first**: all data is seeded locally in `/core` — there is no runtime backend dependency. The `apps/api` scaffold exists so future backend work (auth, persistence, integrations) has a home without restructuring.
- **Vertical-aware**: a global business-vertical system (`core/src/verticals.ts`, 14 trades incl. government contracting) adapts labels, phases, and cost categories across every module.
- **Product guardrails**: no internal pricing formulas are exposed, no guaranteed bid/compliance/award outcomes are promised, internal strategy stays separate from vendor-facing packages, and AI-framed output is always "flagged for review."
