---
name: BidIntelligenceOS navigation IA
description: Why some page files exist but aren't in the sidebar nav, and what the front page is.
---

The front page (`/`) is the "Cockpit" dashboard in `pages/dashboard.tsx`, recreated from a user-approved mockup (`attached_assets/BidIntelligenceOS_*.png`). It is the canonical design reference for the whole app's look.

**Off-nav routes are intentional, not dead code.** `new-bid`, `scope-analyzer`, `cost-inputs`, `bid-fit`, `strategy-memo`, `package-builder` are a multi-step "analysis workspace" reached by links/routes, deliberately kept OUT of the 9-item sidebar. Do not delete them as orphans.
**Why:** the sidebar IA (Cockpit, Bids, Projects, Leads, Competitors, Insights, Documents, Reports, Settings) mirrors the mockup, which is flatter than the underlying workflow.
**How to apply:** before removing any `pages/*.tsx` that isn't in `layout.tsx` navItems, grep `App.tsx` routes and in-page `<Link>`s — it's likely reachable. `bid-library/monitoring/analytics/company-profile/addon.tsx` ARE truly unrouted legacy (folded into Bids/Insights/Settings).

The `package-builder.tsx` split-binder layout is user-approved — preserve it; do not regress on restyles.
