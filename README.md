# CCA BidIntelligenceOS

> Research Less, Win More — a bid intelligence workspace for commercial trade contractors.

A premium frontend prototype covering the full bid-to-job lifecycle: opportunity analysis, bid-fit scoring, vendor-ready bid packages, job deployment, cost tracking, market signals, compliance posture, and the ROSEOS executive intelligence layer.

## Quick start

Requires **Node.js 20+** (tested on Node 24).

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

`VITE_DEMO_MODE` (default: on) shows a demo entry modal on first visit:

- If `VITE_PROMO_FILM_URL` is set, the promo video plays first inside the modal — muted autoplay (YouTube/Vimeo/direct video files are handled automatically); visitors click to enable sound.
- Two clear choices: **Watch Walkthrough** (opens `VITE_WALKTHROUGH_VIDEO_URL` in a new tab; hidden when unset) and **Enter Platform** (routes into the live Command Center).
- A secondary "5-step tour" link offers a quick text walkthrough: what the platform is → what it analyzes → how results are generated → the value → Enter Platform.
- Clicking **Enter Platform** permanently disables the modal for that browser (localStorage flag `bios-walkthrough-complete`).
- Set `VITE_DEMO_MODE=false` in `.env` to turn the modal off entirely.
- To see it again during development, clear the localStorage flag in your browser devtools.

## Environment

Copy `.env.example` to `.env` at the repo root. All values are optional:

| Variable                     | Default | Purpose                                                        |
| ---------------------------- | ------- | -------------------------------------------------------------- |
| `VITE_DEMO_MODE`             | `true`  | First-visit guided walkthrough modal                            |
| `VITE_WALKTHROUGH_VIDEO_URL` | (blank) | External walkthrough video link on the marketing page (new tab) |
| `VITE_PROMO_FILM_URL`        | (blank) | External promo film link on the marketing page (new tab)        |
| `API_PORT`                   | `5001`  | Port for the placeholder API server                             |

The video links render only when their URL is set — blank or missing hides that specific link. The videos themselves are hosted externally; no video app code ships in this repo.

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
