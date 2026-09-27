# C Release Report — minimal DeepSeek extraction

Updated 2026-09-28 (Asia/Shanghai). **Local candidate accepted; public production remains the stable Notebook demo.** C integrated named A commits and performed real-browser acceptance. B independently tested the exact product commit. No architecture, domain model, reconciliation, fixture or style refactor was made.

## Version facts and coordination

- Starting candidate: `ff3c520b2642cc695a29ca28f00d7467703d0610`.
- Accepted product: **`b2bc2d982730676280bfc844f848ab8f4986d128`**. Subsequent C changes are release documentation only.
- A deliveries: `2cffc2b9e9bcf725c340833ee0fa8329e7c7899d` (DeepSeek/flat API), `d4788c5ea0240fe097a74e55402ee819886bc272` (Next loopback-origin compatibility).
- Offline data commits: `9a8f498`, `4869e20`. Candidate branch: `release/iep-ai-candidate-20260927`, checkout `D:\IEP-Reality-Check-ai-release`.
- Stable main: `7f1d6091bc45213d3815a39b8fe19e8bb3c6f402`; Notebook product `c5f73006acc10a3588a1051ef1d891e51575c186`. Pushed recovery tag `pre-ai-stable-7f1d609` retained.
- A alone modified runtime code in its separate checkout. C merged only explicit deliveries; B tested named integrated commits. D prepared offline data separately. D/E claims must remain within VERIFIED truth-table rows.

## Implemented and independently checked

`POST /api/extract` calls DeepSeek server-side and returns exactly five fields: serviceName, sessionsPerPeriod, minutesPerSession, sourceQuote, needsReview. Existing Zod validates the flat contract and evidence; unknown values are null, and a nonempty verbatim contiguous source quote is mandatory. The old `/api/iep/extract` is a compatibility alias. Runtime has no OpenAI or Adaption dependency.

The original candidate/review flow remains: escaped source highlighting, Confirm/Edit/Needs review, explicit fictional scope, separate human-edit provenance, then the unchanged `reconcile()`. Plain-language explanation is a deterministic reading aid based on validated fields, not another model/legal interpretation. Ethan's original synthetic flow remains independent of the API.

B acceptance at the exact product commit: **npm test 156/156 across 10 files; npm run typecheck PASS; npm run build PASS**. Next builds dynamic Node API routes; no static-export setting. B confirmed domain/reconcile, fixtures, confirmation adapter, DemoApp, styles and dependency files unchanged from the starting candidate. See [B_DEEPSEEK_ACCEPTANCE.md](B_DEEPSEEK_ACCEPTANCE.md) and [A_DEEPSEEK_DELIVERY.md](A_DEEPSEEK_DELIVERY.md).

## C genuine DeepSeek and browser acceptance

C ran the accepted production build at http://127.0.0.1:3143/ with the existing server-process DEEPSEEK_API_KEY, IEP_AI_ENABLED=true and DEEPSEEK_MODEL=deepseek-flash. No credential value was printed, copied into a source/env file, committed or put in a screenshot. Two approved fictional inputs were sent through the actual UI, server and DeepSeek. These are two observed successes, not an accuracy benchmark.

| Input | Actual /api/extract response |
| --- | --- |
| Clear pathology sentence | HTTP 200; Speech-Language Therapy; 2; 30; exact full sentence quote; needsReview=false |
| speech services as appropriate | HTTP 200; Speech-Language Therapy; null; null; exact quote "speech services as appropriate"; needsReview=true |

Actual Chrome checks on that build:

- Home → AI excerpt → real response → highlighted original/candidate. Unconfirmed forward controls stayed locked.
- Needs review paused comparison. Edit 30 → 45 retained original AI value/quote as 30 with a distinct human-edit label; editing back and explicit scope confirmation enabled the existing engine.
- Confirmed AI provenance appeared in the source drawer separately from original fictional dates/window.
- Timeline and meeting prep initially showed 10 documented / 300 minutes / 1 explained / 1 unresolved / 2 questions.
- Add Sep 18 record → 11 / 330 / 1 / 0 / 1; original added-record source and remaining make-up question verified.
- Vague real response showed two Unknown — needs review values, disabled Confirm/Edit and blocked forward navigation.
- Use Ethan's original demo → original plan → Confirm → unchanged 10/300 to 11/330 late-record flow, without another API call.
- Captured browser warning/error logs were empty.

Local ignored receipts: `outputs/deepseek-release/c-live-clear.json`, `c-live-vague.json`, corresponding DOM/screenshots, `c-human-edit.txt`, `c-ai-source.txt`, `c-ai-after-late.txt`, `c-ai-final-meeting.txt`, fallback snapshots and `c-browser-logs.json`. B logs/scans are alongside them.

The initial integrated build had a real same-origin 403 because Next normalizes loopback request URLs. A supplied a narrow actual-Host/Origin fix with ten NextRequest regressions; B re-ran all gates and C passed the above real requests afterward. The earlier failure remains historical evidence. B's report predates C's successful live check; this section closes its separate pending gate.

## Offline synthetic evaluation preparation

[evaluation/iep-extraction/README.md](evaluation/iep-extraction/README.md) documents **24** manually authored fictional reference rows, fixed **18 development / 6 heldout** split, import-ready instruction/response JSONL, rubric and local validator. Integrity audit passed 24 unique examples, 24 exact source quotes, type checks and zero heldout leakage into the development export. Dataset SHA256: `e2136b3f589d8951989a77a0b46a435cebab4aa1a95b98b0a1d276126244cc79`.

**Adaption Labs use/optimization/platform evaluation: NOT RUN. Full 24-row model evaluation: NOT RUN.** The 8 clear weekly speech / 14 review / 2 other-service challenge rows are reference targets, not proof the endpoint supports every row. No runtime imports or response fallback use this data.

## Security and scope limits

Server-only DEEPSEEK_API_KEY; optional DEEPSEEK_MODEL defaults to deepseek-flash. IEP_AI_ENABLED is an explicit off switch. Public mode accepts only two exact synthetic examples and requires synthetic=true. Caps: 2,400 characters / 12,000 request bytes / 1,000 output tokens / 32 KiB provider output / 15 seconds, no retries. Two concurrent and six-per-minute protection is per process, not a distributed or hard global spending limit. Optional custom synthetic mode is development-loopback only.

B's bounded source, generated-client and log inspections found zero sensitive-pattern or actual-key matches; no raw provider logging/storage was added. These are bounded checks, not a universal security certification.

The verifier remains intentionally narrow: weekly speech wording and minutes per session. Unsupported other services or null-service numeric wording may be rejected rather than returned partially; monthly/range ambiguities cannot enter Ethan's comparison. Arbitrary real-student intake, multi-service extraction, record/email extraction, PDF/OCR and legal conclusions are not implemented/claimed. Mobile and native-print acceptance were not repeated this round.

## Deployment, freeze and submission

This round made no Vercel environment or production change. Stable deployment remains `dpl_E7SXHAABKudWHarsT4Ur73MtQPLk`, https://iep-reality-check.vercel.app and immutable https://iep-reality-check-natjiaqw6-kazz5.vercel.app . Its earlier browser acceptance is inherited, not freshly rerun here. AI production URL: **NOT CREATED**. The local production-build smoke is not remote production smoke. Freeze this accepted candidate scope; public AI release still requires runtime/env configuration and anonymous production browser acceptance.

Public repo: https://github.com/wenzekan80-gif/iep-reality-check . Devpost project: https://devpost.com/software/iep-reality-check ; last observed Draft / 3 of 4 / INCOMPLETE SUBMISSION, not revisited in this AI round. Public video: **NOT CREATED**. The historical local 148-second video does not demonstrate Notebook/AI. Real team, complete tool/API disclosures, updated video and actual Submitted confirmation remain pending.

## Handoff

```text
TASK: Add minimal DeepSeek extraction and offline synthetic evaluation data
STATUS: Local candidate VERIFIED; AI public release not created
BASE COMMIT: ff3c520b2642cc695a29ca28f00d7467703d0610
FINAL RELEASE COMMIT: Accepted candidate product b2bc2d982730676280bfc844f848ab8f4986d128; stable public 7f1d609; later C changes documentation only
LIVE URL: https://iep-reality-check.vercel.app (stable); http://127.0.0.1:3143/ (local candidate)
REPO URL: https://github.com/wenzekan80-gif/iep-reality-check
VIDEO URL: NOT CREATED
ACTUALLY VERIFIED: B 156 tests/typecheck/build/scans; C two genuine DeepSeek responses and confirm/edit/review/engine/late-record/fallback browser flow; offline 24-row integrity
NOT VERIFIED: AI remote production; 24-row model accuracy; Adaption use/optimization; new public video; final submission
KNOWN ISSUES: Two-example public allowlist; narrow speech verifier; limiter per process; broader data rows are challenge references
SUBMISSION STATUS: Last observed Draft / INCOMPLETE SUBMISSION; not rechecked this round
NEXT ACTION: When publishing this candidate, configure server env and run anonymous production smoke; independently run heldout/model/Adaption evaluation before making related claims
```
