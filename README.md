# CCA BidIntelligenceOS

> Research Less, Win More — a bid intelligence workspace for commercial trade contractors.

A premium frontend prototype covering the full bid-to-job lifecycle: opportunity analysis, bid-fit scoring, vendor-ready bid packages, job deployment, cost tracking, market signals, compliance posture, and the ROSEOS executive intelligence layer.

## Quick start

Requires **Node.js 20+** (tested on Node 24).

```bash
cp .env.example .env   # optional — defaults work for local dev
npm install
npm run dev
```

- Web app: http://localhost:5173
- API health check: http://localhost:5173/api/health (proxied in dev) or http://localhost:5001/api/health

No secrets or external services are required for local development.

## Rose Demo (one-click)

The polished demo experience is controlled by environment variables and launches from the marketing page or a direct link.

**Launch from the UI:** click **Launch Rose Demo** on the marketing page.

**Launch from a URL:** open `/?rose-demo=1` (or `/?demo=rose`) to skip the marketing page and open the Rose Demo modal immediately.

When `VITE_DEMO_MODE=true` (default):

- If `VITE_PROMO_FILM_URL` is set, the promo plays first inside the modal — muted autoplay (YouTube, Vimeo, and direct video files are supported); visitors tap to enable sound.
- **Watch Walkthrough** opens `VITE_WALKTHROUGH_VIDEO_URL` in a new tab (hidden when unset).
- **Enter Demo** routes into the Command Center (`/` and `/dashboard`).
- A secondary 5-step text tour is also available.

Set `VITE_DEMO_MODE=false` in `.env` to disable the modal entirely.

## Project structure

```
├── apps/
│   ├── web/        # React + Vite + Tailwind frontend (the product)
│   └── api/        # Express server — health endpoint + production static hosting
├── core/           # Business logic & seeded domain data
├── shared/         # Shared utilities
├── config/         # Per-app environment templates
├── .env.example    # Root environment template (copy to .env to customize)
└── package.json    # npm workspaces + dev orchestration
```

The frontend imports business data via the `@core/*` alias and shared utilities via `@shared/*` — both wired in `apps/web/vite.config.ts` and `apps/web/tsconfig.json`.

## Environment

Copy `.env.example` to `.env` at the repo root. All values are optional:

| Variable                     | Default | Purpose                                                         |
| ---------------------------- | ------- | --------------------------------------------------------------- |
| `VITE_DEMO_MODE`             | `true`  | Rose Demo walkthrough modal on first visit                      |
| `VITE_WALKTHROUGH_VIDEO_URL` | (blank) | External walkthrough video (new tab)                            |
| `VITE_PROMO_FILM_URL`        | (blank) | External promo film (muted autoplay in Rose Demo modal)         |
| `VITE_API_BASE_URL`          | (blank) | API base URL for fetch calls; blank = same-origin / Vite proxy  |
| `API_PORT`                   | `5001`  | API server port                                                 |
| `HOST`                       | `0.0.0.0` | Bind address (use `0.0.0.0` on AWS)                           |
| `NODE_ENV`                   | `development` | Set to `production` for `npm run start`                   |
| `CORS_ORIGIN`                | (blank) | Allow cross-origin API access when web/API are on different hosts |

Video links render only when their URL is set. No video app code ships in this repo.

## Scripts

| Command             | What it does                                      |
| ------------------- | ------------------------------------------------- |
| `npm run dev`       | Run web + API together (hot reload)               |
| `npm run dev:web`   | Frontend only                                     |
| `npm run dev:api`   | API only                                          |
| `npm run build`     | Production build of the frontend                  |
| `npm run start`     | Serve built frontend + API (single process)         |
| `npm run typecheck` | TypeScript checks across both apps                |

## AWS / Zoho deployment

### 1. Prepare the server

```bash
git clone https://github.com/contractorcomplianceco-cmyk/bidintelligenceos.git
cd bidintelligenceos
cp .env.example .env
```

Edit `.env` for production:

```env
NODE_ENV=production
HOST=0.0.0.0
API_PORT=80          # or 443 behind a reverse proxy, or 5001 + nginx
VITE_DEMO_MODE=true
VITE_PROMO_FILM_URL=https://your-cdn.example/promo.mp4
VITE_WALKTHROUGH_VIDEO_URL=https://your-cdn.example/walkthrough.mp4
VITE_API_BASE_URL=   # leave blank when API serves the SPA on the same domain
```

### 2. Build and run

```bash
npm install
npm run build
npm run start
```

`npm run start` runs the API in production mode and serves the built SPA from `apps/web/dist` on the same port. Health check: `GET /api/health`.

### 3. Reverse proxy (recommended)

Point your Zoho domain (or nginx/ALB) at the Node process:

```nginx
server {
    listen 80;
    server_name bidintelligence.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:5001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 4. Process manager (PM2 example)

```bash
npm install -g pm2
npm run build
pm2 start npm --name bidintelligence -- run start
pm2 save
```

### 5. Rose Demo direct link for stakeholders

Share: `https://bidintelligence.yourdomain.com/?rose-demo=1`

## Architecture notes

- **Frontend-first**: all data is seeded locally in `/core` — there is no runtime backend dependency today. The `apps/api` server provides a health endpoint and hosts the production build.
- **No Replit**: no Replit DB, auth, or runtime assumptions. API calls use `VITE_API_BASE_URL` (see `apps/web/src/lib/api-config.ts`).
- **Vertical-aware**: a global business-vertical system (`core/src/verticals.ts`, 14 trades incl. government contracting) adapts labels, phases, and cost categories across every module.
- **Product guardrails**: no internal pricing formulas are exposed, no guaranteed bid/compliance/award outcomes are promised, internal strategy stays separate from vendor-facing packages, and AI-framed output is always "flagged for review."
