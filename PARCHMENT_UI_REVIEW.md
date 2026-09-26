# Parchment interface review

Date: 2026-09-27 (Asia/Shanghai).

The user's correction made the parchment interface the current task. This work is isolated in `D:\IEP-Reality-Check-parchment` on `ui/parchment-style-20260927`, based on `091d3fd1988aef6dfd503685abd87061b578011b`. Product styling commit: `efb927f35a611e74b52c2b36659871ff3b6ae934`.

## Changes

- Added `src/app/parchment.css`, activated by an import and body class in `src/app/layout.tsx`.
- Warm textured paper, rolled page edges, brown ink and buttons, serif titles, double-rule borders, layered story plate and toned original illustrations.
- Applied consistently to home, plan confirmation, records, source dialog and meeting sheet.
- Evidence states retain distinct colors, labels and symbols. Decorations do not intercept input. Mobile rules account for the narrower paper margins.
- All theme rules are screen-only. Existing print styles and motion-preference behavior remain in place. No external assets, new dependencies or runtime API calls.
- Verified no diff in `src/domain`, `src/fixtures`, `src/ui`, `fixtures`, or dependency manifests against the branch base.

## Fresh verification

- `npm test`: 4 files / 55 tests PASS. Log: `outputs/parchment-review/tests.log`.
- `npm run typecheck`: PASS.
- `npm run build`: PASS, including Next.js production compilation and static generation.
- Local production server: http://127.0.0.1:3141 . Startup log: `outputs/parchment-review/server.log`.
- Actual browser: home story moment selection pauses animation; plan source opens; Escape dismisses the source dialog and returns focus to its original button; plan confirmation opens records.
- Initial browser results: 10 completed sessions, 300 minutes, 1 explained, 1 unresolved; two meeting questions. Adding the late fixture produces 11 completed sessions, 330 minutes, 1 explained, 0 unresolved, and one remaining make-up question.
- Desktop screenshots reviewed for home, plan, sources and records. At 390px, home, records and meeting have no horizontal document overflow; records have no out-of-viewport main content. Home also checked at 320px without horizontal overflow.
- Emulated reduced motion: story `data-reduced-motion=true`, `data-playing=false`, guardian animation `none`, static final scene and manual scene controls present.
- Emulated print: white body, no background image, no decorative roll pseudo-element and hidden header. Native printer pagination/PDF output was not tested.
- Browser warning/error log: empty. Temporary viewport/media overrides cleared; QA tab closed. User-facing preview retained.

## Evidence and delivery

Viewport screenshots in `outputs/parchment-review/`: `home-desktop-viewport.png`, `plan-desktop.png`, `sources-desktop.png`, `review-desktop.png`, `review-mobile.png`, `meeting-mobile.png`, `home-mobile.png`. A separate full-page capture showed a capture-scaling artifact and is not used as acceptance evidence.

The original release worktree remains clean at `091d3fd`; public main, stable tags, production deployment and Devpost are unchanged. This is a local preview, not a public deployment. Existing submission media depicts the previous public interface. The release/submission confirmations remain unanswered and parked; this task did not upload or submit anything.
