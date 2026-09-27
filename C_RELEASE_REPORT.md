# C Release Report

Date: 2026-09-28 (Asia/Shanghai). Scope: the new IEP extraction candidate on the published Notebook baseline. C coordinated A, merged explicit deliveries and performed browser acceptance; C did not implement product code.

## Release decision

**Candidate code accepted locally; real AI and AI production promotion remain BLOCKED.** The user explicitly chose to finish code first and configure a key later. Stable production remains the existing Notebook release. No AI deployment or main-branch update was performed in this round.

## Exact versions

- Base and retained remote main: `7f1d6091bc45213d3815a39b8fe19e8bb3c6f402`.
- Existing Notebook product: `c5f73006acc10a3588a1051ef1d891e51575c186`.
- Recovery tag, created and pushed this round: `pre-ai-stable-7f1d609`.
- A initial delivery: `2434f5b5e659b4d8bd8f29c2ade4ffa9c5cfee86`.
- A exact-user-wording correction: `998d0d9808096c9e148715953f1773c096b5e79f`.
- Final integrated product candidate, independently tested by B and browsed by C: `a059b6a42a29ee8570120f6aace2b617b9f339b7`.
- Candidate branch: `release/iep-ai-candidate-20260927`, checkout `D:\IEP-Reality-Check-ai-release`. Later report-only commits do not change the accepted product.

## Delivered behavior and evidence

A implemented a server-only OpenAI Responses adapter, strict structured output validation and exact quote/meaning checks. The clear synthetic example uses the user's sentence: Speech-language pathology services will be provided twice weekly for 30 minutes per session. It supports Speech-Language Therapy / 2 sessions per week / 30 minutes per session. Vague wording retains null values and Needs review. Safe highlighted source text, Confirm / Edit / Needs review and a plain-language reading aid are implemented. The explanation is deterministically composed from validated fields and labelled Based on the IEP text above; it is not free-form legal interpretation.

Only explicit human confirmation and fictional-scope selection can pass the candidate into the existing reconcile function. Human edits remain distinct from the original AI values and quotes. Changed input, old async responses and returning to review invalidate prior confirmation. Ethan's dates, six-week window and records are disclosed as existing fictional context, not AI extraction.

B independently passed 122/122 tests, typecheck, production build and bounded source/client-bundle/log scans at the exact integrated commit. Domain logic, fixtures and dependencies are unchanged. See B_AI_ACCEPTANCE.md and A_AI_DELIVERY.md. Mocked model/transport tests verify code behavior, not actual provider success.

C exercised the production build in a real Chrome browser:

- Home → AI input, showing the exact requested sentence; unconfirmed Evidence/Meeting controls disabled.
- Switch off: clear switched-off message, no candidate; one-click return to original Ethan demo.
- Ethan plan/source → explicit confirmation → timeline → source drawer → meeting preparation.
- Initial 10 documented / 300 minutes / 1 explained / 1 unresolved / 2 questions.
- Add Sep18 record → 11 / 330 / 1 / 0 / 1, with actual added-record source and remaining make-up question.
- Switch on but no key: clear unavailable message, zero candidate cards and locked forward controls.
- Browser warning/error logs: empty for both observed sessions. Notebook input layout visually inspected. No fake provider or injected result used in browser acceptance.

Local receipts and screenshots: `outputs/ai-release/`. The retained preview is http://127.0.0.1:3143/ (production build, enabled switch, no key). The temporary disabled-mode server on 3142 was stopped. Actual successful-model highlighting/confirmation in a real browser remains untested because the key is deferred; automated UI tests cover that path. Native print and mobile visual acceptance were not rerun.

## Runtime and privacy boundary

No static export is configured. Build output includes dynamic `/api/iep/extract` on the Node.js runtime. Provider credentials are server-only; no NEXT_PUBLIC credential usage or matching sensitive patterns were found in B's bounded client/log scan. A scoped Vercel environment query found no production variables; no key value was read or captured.

Public requests require one of two unchanged synthetic strings plus a synthetic-data confirmation. There are request/output size limits, timeout, no retries, an off switch, two concurrent requests and six calls per minute per process. The process-local limiter is not a global budget or authentication. OpenAI receives synthetic input with store:false; no zero-retention claim is made. Arbitrary real IEP intake, uploads/OCR, record/email extraction and legal assessment are outside this release.

## URLs and submission status

- Stable live: https://iep-reality-check.vercel.app . Existing Notebook deployment receipt: `dpl_E7SXHAABKudWHarsT4Ur73MtQPLk`, immutable https://iep-reality-check-natjiaqw6-kazz5.vercel.app . No fresh public smoke or redeployment is claimed in this AI round.
- Repository: https://github.com/wenzekan80-gif/iep-reality-check . Candidate is kept on its separate release branch; stable main is retained.
- AI production URL: NOT CREATED.
- Devpost: https://devpost.com/software/iep-reality-check . Last observed saved state remains Draft / 3 of 4 / INCOMPLETE SUBMISSION; not revisited in this AI round.
- Public video: NOT CREATED. The earlier 148-second local video shows the older synthetic UI, so it does not demonstrate Notebook or this AI candidate.
- Complete real-team roster, full contributor disclosure, eligibility confirmation and final Submitted confirmation remain outstanding. Do not infer them from Git authors or account login.

## Handoff

TASK: IEP clause extraction, uncertainty and reading-aid candidate
STATUS: Local code gate PASS; genuine provider and AI production BLOCKED by deferred key
BASE COMMIT: 7f1d6091bc45213d3815a39b8fe19e8bb3c6f402
FINAL RELEASE COMMIT: Stable 7f1d609; accepted candidate a059b6a42a29ee8570120f6aace2b617b9f339b7, not promoted
LIVE URL: https://iep-reality-check.vercel.app (stable Notebook, no live AI)
REPO URL: https://github.com/wenzekan80-gif/iep-reality-check
VIDEO URL: NOT CREATED
ACTUALLY VERIFIED: B 122 tests/typecheck/build/bounded scans; C actual local stable flow and off/keyless AI behavior
NOT VERIFIED: Actual model responses; successful live AI browser chain; AI production; updated public video; final submission
KNOWN ISSUES: No configured key; public extraction intentionally limited to two exact synthetic examples; limiter per process
SUBMISSION STATUS: Last observed Draft / INCOMPLETE SUBMISSION
NEXT ACTION: Configure server key when ready, verify genuine clear/vague responses and browser chain, then consider production promotion and updated submission media

Historical stable/submission reports remain in Git history, including baseline report at 7f1d609. This report replaces their current-status summary without claiming their past checks were rerun.
