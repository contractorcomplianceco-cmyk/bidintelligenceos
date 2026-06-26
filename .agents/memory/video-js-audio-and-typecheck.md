---
name: video-js post-build (narration fit + scaffold typecheck)
description: Gotchas when adding narration to a video-js artifact and why its tsc typecheck "fails"
---

# video-js post-build gotchas

## Narration almost always overruns the design subagent's scene durations
The DESIGN subagent sets `SCENE_DURATIONS` for a silent visual cut. Generated TTS lines
(ElevenLabs via `textToSpeech`) routinely run 1-2s longer than those scenes, especially
when a line contains a long product name (e.g. "BidIntelligenceOS" ate ~1.3s alone).

**How to apply (main-agent post-build pass):**
1. Generate VO, then `ffprobe -show_entries format=duration` every line.
2. Fit each scene to its line: either tighten the script (better for a "lively"/punchy ad —
   long static holds read as dead air) or raise that scene's duration to `VO + ~600-700ms tail`.
3. Recompute total runtime and regenerate the music bed to match the new total.
4. Composite with `adelay = cumulativeSceneStartMs + ~250ms` lead per line; duck music to ~0.22
   under VO; clamp with `-t <total>`. Bake levels into `composite_audio.mp3` and set
   `audio.volume = 1` in `VideoTemplate` (don't re-duck in the component).

**Why:** keeps VO in sync across normal loop, scene jumps, and scene-lock `_r1/_r2` replays,
and avoids narration bleeding across scene cuts.

## The video-js scaffold does NOT pass `tsc` typecheck — this is expected
`pnpm --filter @workspace/<slug> run typecheck` reports DOM-global errors (`window`,
`document`, `HTMLAudioElement.volume/currentTime/play`, `Node`, `pointerType`) because the
scaffold tsconfig omits the DOM lib. These errors hit untouched scaffold files too
(`src/lib/video/hooks.ts`, `src/main.tsx`), so they are not a regression from your edits.

**How to apply:** Do NOT chase these and do NOT edit the scaffold tsconfig/`hooks.ts`. The
real validation gate for a video-js build is `bash scripts/validate-recording.sh` + clean
workflow (Vite) logs. Vite builds/runs fine regardless. The skill also waives code review for
the first build — the flow ends at `presentArtifact`. Never `suggestDeploy` a video artifact.
