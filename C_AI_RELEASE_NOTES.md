# IEP AI candidate release

Updated: 2026-09-28 (Asia/Shanghai). C coordinates integration, validation and deployment; A is the sole feature developer. C_RELEASE_REPORT.md, FEATURE_TRUTH_TABLE.md and FINAL_RELEASE_CHECKLIST.md contain the current acceptance and remaining gates.

## Verified starting facts

- Actual remote main and clean Notebook checkout HEAD: `7f1d6091bc45213d3815a39b8fe19e8bb3c6f402`.
- Notebook product commit: `c5f73006acc10a3588a1051ef1d891e51575c186`; publication documentation: `7f1d609`.
- Existing production URL: https://iep-reality-check.vercel.app . Prior Notebook publication receipt names `dpl_E7SXHAABKudWHarsT4Ur73MtQPLk` and https://iep-reality-check-natjiaqw6-kazz5.vercel.app . These receipts are inherited; this AI turn has not redeployed or rerun production acceptance.
- Git object check succeeded. Annotated recovery tag: `pre-ai-stable-7f1d609`; earlier `pre-ai-stable-dfeb369` and `lexhack-stable-dfeb369` remain.
- A checkout: `D:\IEP-Reality-Check-ai`, branch `feature/iep-ai-extraction-20260927`.
- C checkout: `D:\IEP-Reality-Check-ai-release`, branch `release/iep-ai-candidate-20260927`.
- Managed worktree creation was attempted after an empty artifact inventory and returned Not a git repository for the chat rooted at D:\. Git worktrees were created against the verified repository as fallback.
- The configuration does not enable static export. The existing public stable version has no runtime AI routes; the new accepted candidate builds a dynamic Node.js /api/iep/extract route.
- No OPENAI_API_KEY is present in the current process or user environment, and no env file exists at the new C checkout. Values were not read or logged. A fresh scoped Vercel query also found no production environment variables. The user chose to finish code first and configure a key later. The implementation uses OpenAI; genuine model verification remains deferred until credentials are configured.

## Authorized candidate scope

1. Synthetic IEP clause extraction: service, weekly frequency, minutes per session and exact source quotation.
2. Source text highlights and a candidate card with Confirm, Edit and Needs review before the existing pure reconcile function.
3. Ambiguous text retains unknown fields and requires review. It must not infer numbers from missing details.
4. A parent-facing explanation based on the provided text, with no legal interpretation or conclusion.

The Notebook/Flipbook presentation and complete Ethan synthetic flow are preserved. Optional service-record/email extraction is not included in this candidate. The user's new explicit feature request authorizes this separate candidate after the earlier freeze; it does not replace the stable deployed product until the new acceptance gates pass.

## Integration and release gates

- A delivers a named commit. C does not modify product code concurrently with A.
- B reviews/tests only an explicit commit, including quote verification, unknowns, failure handling, edited/stale input, human gating and unchanged stable behavior.
- Public default accepts allowlisted synthetic examples only, with length/output/timeout bounds, a server off switch and documented call protection. No keys in NEXT_PUBLIC values, client bundles, logs or screenshots.
- Real provider success must be separately evidenced. Mocked unit/integration results and recorded examples are not live AI evidence.
- C merges the delivered commit only after review, builds the candidate, and checks actual browser flows. Production promotion requires acceptance and runtime/API checks; retain the stable fallback.
- Submission copy/video from the earlier no-AI build becomes historical if this candidate is published; update claims/media only after capabilities become VERIFIED.

## Current state

Implementation and B static/automated acceptance: VERIFIED at integrated product a059b6a42a29ee8570120f6aace2b617b9f339b7, from A deliveries 2434f5b and 998d0d9. B passed 122 tests, typecheck, build and bounded scans. C completed actual local-browser stable flow and disabled/missing-key states. Successful real-provider validation and its browser chain remain BLOCKED pending deferred server credentials. AI production release: NOT CREATED. Stable production remains the existing Notebook version.

## Accepted server configuration contract

- `IEP_AI_ENABLED=true`: explicit server enable switch; absent/false fails closed.
- `OPENAI_API_KEY`: server-only provider credential. Never prefix with NEXT_PUBLIC, commit it, or include its value in reports.
- `OPENAI_MODEL`: optional; default `gpt-4.1-mini-2025-04-14`. Actual account/model availability has not been tested.
- `IEP_AI_LOCAL_CUSTOM=true`: optional development-only loopback mode for custom synthetic text. Public mode accepts exact allowlisted synthetic examples only.
- The code enforces a 2,400-character input cap, 12,000-byte request body cap, 15-second provider timeout, 1,000 output token cap, and 32 KiB provider response cap. Concurrency/rate protection is process-local (2 concurrent / 6 calls per minute); it is not a global budget.

This contract passed B source/tests review. With the user's deferred-key choice, local implementation acceptance is complete and stable production is retained. No mock response was used as live browser evidence. Real provider and AI production gates stay BLOCKED until credentials are configured and genuine clear/vague responses are checked.
