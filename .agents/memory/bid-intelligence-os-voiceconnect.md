---
name: VoiceConnect add-on
description: How the VoiceConnect premium add-on is structured within BidIntelligenceOS
---

VoiceConnect is a premium add-on sub-brand inside CCA BidIntelligenceOS: a voice-first
field-capture mobile companion that hands captures off as draft bids.

- Distinct sub-brand: TEAL accent #0BA3A8 (BidIntelligence core accent is cyan #38BDF8). Tagline "Capture it. Connect it. Build it." Four pillars: Built for the Field, Intelligent Capture, Connected Workflow, Secure & Trusted.
- Shared components live in `components/voice-connect/`: `logo.tsx` (VoiceConnectMark — className only, no style prop; VoiceConnectWordmark), `phones.tsx` (PhoneShowcase — recreated 3-screen mobile flow, NOT the raw attached brand PNG), `pillars.tsx` (FeaturePillars). PhoneShowcase and FeaturePillars both accept an optional `className`.
- Surfaced in two places that reuse the same shared components: the in-app page `pages/voice-connect.tsx` (uses `<Layout>`, route `/voice-connect`, nav item with AudioLines icon) and `components/voice-connect/marketing-section.tsx` embedded in `pages/marketing.tsx`.
- **Why recreate phones as components instead of using the attached PNG:** the attached brand-sheet image contains palette/spec chrome, so it was rebuilt faithfully in code.
- Guardrails kept: review-required messaging on every handoff CTA; no internal pricing-formula exposure; no guaranteed-outcome language.
