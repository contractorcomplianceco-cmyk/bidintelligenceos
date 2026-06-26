---
name: BidIntelligenceOS entry flow & walkthrough
description: Why the marketing -> sign-in -> app gate and the in-page narrated player exist, and how they are wired
---

# Entry flow (3-stage gate)

The app boots through a 3-stage gate in `App.tsx`, driven by `sessionStorage`:
1. **Marketing** (default) — `pages/marketing.tsx`.
2. **DemoLanding sign-in** — shown after `cca-demo-launched` is set (via "Launch the Live Demo").
3. **App router** — shown after `cca-demo-entered` is set (via the sign-in submit).

DemoLanding takes an optional `onBack` that clears `cca-demo-launched` so users can return to marketing.

**Why:** the product wanted a public marketing surface with a click-through CTA into the existing demo, without disturbing the already-approved sign-in gate or app IA.

# Narrated walkthrough player

`components/walkthrough/` holds an in-page narrated player (`walkthrough-player.tsx`) that
sequentially plays per-scene TTS mp3s (`public/walkthrough/sceneN.mp3`, referenced via
`import.meta.env.BASE_URL`) alongside framer-motion product mockups (`scenes.tsx`).
It advances on the audio `ended` event with a fallback timer, and guards against stale
`ended`/fallback double-advance using a `currentRef`.

**Why we did NOT use the `video-js` skill:** that skill produces standalone, looping,
non-interactive videos with no audio track and no in-flow CTA — wrong fit for a narrated
tour that must coexist with a "Launch the Live Demo" button. An in-page player gives
reliable narration + captions + a click-through CTA on the same surface.
