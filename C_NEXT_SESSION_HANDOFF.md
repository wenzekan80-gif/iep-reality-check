# Current continuation: Notebook / Flipbook UI

- Published with explicit user authorization on 2026-09-27 at about 22:01 Asia/Shanghai. Product commit `c5f73006acc10a3588a1051ef1d891e51575c186` is on GitHub `main` and `ui/notebook-polish-20260927` and deployed to https://iep-reality-check.vercel.app .
- Production deployment: `dpl_E7SXHAABKudWHarsT4Ur73MtQPLk`; immutable URL https://iep-reality-check-natjiaqw6-kazz5.vercel.app . Official CLI reports READY / production and aliases the existing domain. Manual deploy; GitHub auto-deploy was not connected.
- Public browser smoke passed the updated copy, confirmation, sources/Escape/focus return, two initial meeting questions, added Sep 18 record and one remaining make-up question. Actual before/after: `10/300/1/1/2` to `11/330/1/0/1` (documented/minutes/explained/unresolved/questions). Anonymous HTTP and local font/grain requests returned 200; browser warning/error log empty. Receipts: `outputs/notebook-release/`.
- Latest user request explicitly asks for Notebook / Flipbook polish while keeping domain, reconciliation, data flow and the single-route React architecture intact.
- Active worktree: `D:\IEP-Reality-Check-parchment`; branch `ui/notebook-polish-20260927`, based on `c83c339`. Read actual HEAD/status. Product and publication documentation are separate commits.
- Implemented cover and three paper spreads, responsive binding/tabs/dog-ear navigation, isolated 680 ms CSS flip, source highlights, 960 ms real-result evidence resolution, finite SVG Lumi cues and reduced-motion/print handling.
- Fresh checks: 68 tests, typecheck and build PASS. Local browser flow, source focus return, 320–1440px layouts and print CSS verified. Native print export is unavailable in the in-app browser; pagination is not verified.
- Preview: http://127.0.0.1:3141 . Start from this worktree with `npm run build` then `npm start -- --hostname 127.0.0.1 --port 3141` if needed.
- The subsequent copy-only pass changed UI labels/prose and exact-text tests only; its AST comparison and fresh 68-test/typecheck/build receipts are in `outputs/copy-review/`. The publication reused those exact-source checks; the remote Vercel build also passed.
- See `NOTEBOOK_UI_REVIEW.md`, `outputs/notebook-review/` and `outputs/notebook-release/`. No dependency, domain, fixture or engine changes. Source adapters retain the same logic; two display labels in `demo-data.ts` were shortened.
- Stable tags and the previous deployment remain rollback references. No video upload or Devpost submission occurred. Existing media still shows the older UI; the old submission questions remain parked.

# Previous local parchment checkpoint

- The user explicitly corrected the prior priority: “不对，我们是要把界面改成羊皮纸风格”. The active task is the parchment restyle. Submission work and its unanswered questions are parked.
- Current worktree: `D:\IEP-Reality-Check-parchment`; branch `ui/parchment-style-20260927`. Read actual HEAD/status before continuing.
- Product styling commit: `efb927f35a611e74b52c2b36659871ff3b6ae934`. Only `src/app/layout.tsx` and new `src/app/parchment.css` change product files. Domain code, fixtures, UI behavior and dependencies are unchanged.
- Local production preview: http://127.0.0.1:3141 . The Codex browser preview is open. Restart if needed with `npm run build` then `npm start -- --hostname 127.0.0.1 --port 3141` from this worktree.
- Fresh checks: 55 tests, typecheck and production build PASS. Actual local browser flow and 390px responsive checks PASS. Reduced motion still stops the story; emulated print has white background and no texture or scroll edges. See `PARCHMENT_UI_REVIEW.md` and `outputs/parchment-review/`.
- The original release worktree remains clean at `091d3fd`. Public main, stable tags and production Vercel deployment were not changed. The video still depicts the older deployed interface; do not claim it shows this restyle.
- No upload, terms agreement or Devpost submission was performed. Do not resume submission or ask the old questions unless the user returns to that work.

# Archived release continuation (superseded priority)

- Role: C release coordinator; user permits short-context subagents. Latest explicit priority: finish the current version's submission first. Do not implement AI or restyle before submission completion. Parchment/scroll visual preference is deferred.
- Worktree: `D:\IEP-Reality-Check-release`, branch `release/lexhack-stable-20260927`. Always read actual HEAD/status first.
- Frozen product: `dfeb36908973fd9c2c5cb0c290a0a685d8f9dfbc`; tags `pre-ai-stable-dfeb369` and `lexhack-stable-dfeb369`. Product files are unchanged. Documentation has separate commits.
- Live: https://iep-reality-check.vercel.app ; public repo: https://github.com/wenzekan80-gif/iep-reality-check . Main remains the frozen product commit.
- Vercel deployment: `dpl_DJM1HkdMUs8Qd58nUu5FgyFx9nkF`, immutable https://iep-reality-check-ex6t5vtwf-kazz5.vercel.app . Official CLI login already authorized; team kazz5. Manual CLI deployment works; GitHub auto-deploy is not connected. No production env variables; redacted receipt `outputs/release-evidence/c-vercel-env-recheck.json`.
- Acceptance: 55 tests, typecheck, build, actual anonymous production main chain PASS. Before: 10/300/1/1/2; after late record: 11/330/1/0/1. Order: documented sessions/minutes, explained/unresolved, meeting questions. No runtime AI, upload/OCR or legal determination.
- Devpost: https://devpost.com/software/iep-reality-check . Management: https://devpost.com/submit-to/31018-lexhack-2026/manage/submissions/1182313-iep-reality-check/finalization . Actual Draft, 3/4 steps; preview says INCOMPLETE SUBMISSION. Title/pitch/story, 11 tags and live/repo links saved and visually checked. Rules checkbox and Submit untouched.
- Current creator account: wenzekan80-gif (display name 阚). Human roster completeness and earlier tool/API usage await user facts; do not infer real teammates from Git authors or agents.
- Video: `outputs/submission-video/iep-reality-check-recorded-walkthrough.mp4`, 148.000 seconds, 1920x1080, silent English captions. Actual production screenshots, persistently labeled recorded/synthetic/no-live-AI. Local full decode and scene inspection PASS. It is a screenshot montage, not a continuous screen recording. Public video URL NOT CREATED.
- Video script, SRT, E handoff, manifest/verification and prepared YouTube title/description are under `outputs/submission-video/`. MP4 SHA256 `f3849aa9056bdd31c606bcab5e13b225fcec13a14d5be01bab31780d6f247448`.
- Observed logged-in YouTube channel: skykkk, `UCR9s0kE3Jb6GOEIxhNAfZIQ`; Studio content page is open. No upload performed. User authorization was requested for uploading this video as Unlisted and using video/screenshots on Devpost; no answer recorded yet. Do not treat this file as authorization.
- Other pending user questions: real team and prior AI/API tool roster; student eligibility and original work during the hackathon. Schedule observed Sep 11 12:00 through Sep 28 05:00 GMT+8; Git timestamps Sep 19 fall inside, without independently proving authorship. Official rules: https://lexhack-2026.devpost.com/rules .
- Next: incorporate user replies; upload only when authorized; verify hosted duration and anonymous playback; update Devpost with actual video URL and complete disclosures. Only after all materials are ready request any required final rules/terms agreement, execute authorized final submission, and inspect actual Submitted confirmation.
- Reports: `FEATURE_TRUTH_TABLE.md`, `C_RELEASE_REPORT.md`, `FINAL_RELEASE_CHECKLIST.md`, `B_RELEASE_RECHECK.md`, `D_SUBMISSION_COPY.md`. Saved browser proof: `outputs/release-evidence/c-devpost-copy-preview.*`, `c-devpost-progress-3of4.*`, `c-devpost-schedule.txt`, `c-youtube-upload-target.png`. C subsequently saved and verified the video-tool disclosure; see `c-devpost-media-disclosure.txt`.
- Do not repeat full product tests for documentation/media-only changes. Keep product and audit commits distinct. Do not publish credentials, raw auth files or the Devpost team invite URL.
