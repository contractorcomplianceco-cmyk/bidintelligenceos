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

`VITE_DEMO_MODE` (default: on) controls the demo entry modal:

- Clicking **Launch Demo** on the landing page opens the modal first — **Enter Demo** inside it is the only path into the dashboard, and the **X** returns to the landing page.
- The promo film plays at the top of the modal — muted autoplay (YouTube/Vimeo/direct video files are handled automatically); visitors click to enable sound.
- Promo video source: `VITE_PROMO_FILM_URL` when set; otherwise the default local file `apps/web/public/promo/promo-video.mp4`. **The real promo video is not in the repo yet — upload it to that path.** Until it exists, the modal shows a temporary audio preview (`apps/web/public/promo/composite_audio.mp3`) instead.
- Three choices: **Watch Walkthrough** (opens `VITE_WALKTHROUGH_VIDEO_URL` in a new tab; hidden when unset), **Watch Promo** (opens the promo in a new tab; hidden while the video file is missing), and **Enter Demo** (routes into the live Command Center).
- A secondary "5-step tour" link offers a quick text walkthrough: what the platform is → what it analyzes → how results are generated → the value → Enter Demo.
- Clicking **Enter Demo** permanently disables the modal for that browser (localStorage flag `bios-walkthrough-complete`) — later "Launch Demo" clicks go straight to the dashboard.
- Set `VITE_DEMO_MODE=false` in `.env` to skip the modal entirely.
- To see it again during development, clear the localStorage flag in your browser devtools.

## Environment

Copy `.env.example` to `.env` at the repo root. All values are optional:

| Variable                     | Default | Purpose                                                        |
| ---------------------------- | ------- | -------------------------------------------------------------- |
| `VITE_DEMO_MODE`             | `true`  | Demo entry modal (opens from "Launch Demo")                     |
| `VITE_WALKTHROUGH_VIDEO_URL` | (blank) | External walkthrough video link (new tab)                       |
| `VITE_PROMO_FILM_URL`        | (blank) | Promo film override URL; blank = local `/promo/promo-video.mp4` |
| `API_PORT`                   | `5001`  | Port for the placeholder API server                             |

The walkthrough link renders only when its URL is set. The promo film defaults to the local file `apps/web/public/promo/promo-video.mp4` — upload the real video there (only `composite_audio.mp3`, a temporary audio fallback, ships in the repo today). No video app code ships in this repo.

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
