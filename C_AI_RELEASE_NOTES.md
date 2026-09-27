# IEP AI candidate release

Date: 2026-09-27 (Asia/Shanghai). C coordinates integration, validation and deployment; A is the sole feature developer.

## Verified starting facts

- Actual remote main and clean Notebook checkout HEAD: `7f1d6091bc45213d3815a39b8fe19e8bb3c6f402`.
- Notebook product commit: `c5f73006acc10a3588a1051ef1d891e51575c186`; publication documentation: `7f1d609`.
- Existing production URL: https://iep-reality-check.vercel.app . Prior Notebook publication receipt names `dpl_E7SXHAABKudWHarsT4Ur73MtQPLk` and https://iep-reality-check-natjiaqw6-kazz5.vercel.app . These receipts are inherited; this AI turn has not redeployed or rerun production acceptance.
- Git object check succeeded. Annotated recovery tag: `pre-ai-stable-7f1d609`; earlier `pre-ai-stable-dfeb369` and `lexhack-stable-dfeb369` remain.
- A checkout: `D:\IEP-Reality-Check-ai`, branch `feature/iep-ai-extraction-20260927`.
- C checkout: `D:\IEP-Reality-Check-ai-release`, branch `release/iep-ai-candidate-20260927`.
- Managed worktree creation was attempted after an empty artifact inventory and returned Not a git repository for the chat rooted at D:\. Git worktrees were created against the verified repository as fallback.
- The current configuration does not enable static export. The existing stable version has no runtime AI routes. A new route must use the Next server runtime.
- No OPENAI_API_KEY is present in the current process or user environment, and no env file exists at the new C checkout. Values were not read or logged. Provider choice is pending the user; missing credentials do not block implementation but do block genuine model verification.

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

Implementation: IN DEVELOPMENT. B exact-commit acceptance: BLOCKED pending A delivery. Live provider validation: BLOCKED pending server credentials. AI production release: NOT CREATED. Stable production remains the existing Notebook version.
