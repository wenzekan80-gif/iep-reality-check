# Feature Truth Table

Current audit: 2026-09-28. Base/stable main: `7f1d609`. Accepted candidate product: `a059b6a42a29ee8570120f6aace2b617b9f339b7`. See C_RELEASE_REPORT.md and B_AI_ACCEPTANCE.md.

Only VERIFIED, IN DEVELOPMENT, BLOCKED, NOT IMPLEMENTED and NOT CLAIMED are permitted. VERIFIED applies only to the evidence scope in that row. D/E may cite VERIFIED rows only with their limits; mocked transport, local acceptance and existing public production are distinct.

| Capability | Status | Evidence / permitted claim |
| --- | --- | --- |
| Recoverable latest Notebook baseline | VERIFIED | Actual base/main 7f1d609; git object check; pushed annotated tag pre-ai-stable-7f1d609. |
| Isolated A delivery and C integration | VERIFIED | Explicit A commits 2434f5b + 998d0d9 integrated as a059b6a; no concurrent C product edits. |
| Server extraction implementation | VERIFIED | Source review and mocked provider tests; strict schema, quotes and meaning validation. Actual model success is a separate BLOCKED row. |
| User's exact pathology / twice-weekly / 30-minute example | VERIFIED | Supported synthetic allowlist string and B-tested validation yielding canonical speech / 2 / 30; not a real model quality measurement. |
| Unknowns and Needs review code path | VERIFIED | Tests retain null frequency/duration for vague wording and block comparison; fabricated values/quotes rejected. |
| Source highlights and Confirm / Edit / Needs review | VERIFIED | Automated UI integration tests: safe text highlighting, human gate, edits with separate provenance, stale invalidation, unchanged reconcile. Successful-provider real-browser path not yet tested. |
| Plain-language reading aid | VERIFIED | Deterministic explanation from validated fields; Based on the IEP text above label and uncertainty wording. No legal interpretation. |
| Unchanged reconciliation and fixture logic | VERIFIED | B compared domain, fixtures and dependency files with base; no changes. |
| Local stable Ethan full browser workflow | VERIFIED | C actual Chrome production-build home/plan/confirm/timeline/source/meeting/late-record/recompute; 10/300/1/1/2 → 11/330/1/0/1. |
| AI disabled / missing-key behavior | VERIFIED | C actual browser: clear off/unavailable messages, no candidate, locked forward controls, original demo accessible. |
| Automated candidate checks | VERIFIED | B fresh 122/122 tests across 10 files, typecheck and production build at a059b6a. |
| Runtime API configuration in local build | VERIFIED | No static export; Node runtime dynamic /api/iep/extract. Remote runtime execution not tested for this candidate. |
| Public endpoint safeguards in code | VERIFIED | Exact synthetic allowlist, body/output caps, timeout, off switch, process-local 2-concurrent/6-per-minute gate tested. Not authentication or global budget. |
| Server-only credentials / bounded scan | VERIFIED | B found no sensitive-pattern matches in inspected client source, production JS or B logs; no new AI console/storage/raw-HTML use. Bounded check only. |
| Genuine provider extraction success | BLOCKED | User chose code first/key later. No genuine model call observed. |
| Genuine AI excerpt → confirm → engine in browser | BLOCKED | Automated mocked-transport path passes; real-provider browser acceptance waits for key. |
| AI production deployment and anonymous smoke | BLOCKED | AI URL NOT CREATED. Stable production not replaced. |
| Existing public Notebook release | VERIFIED | Inherited publication acceptance at product c5f7300 / record7f1d609 and dpl_E7SXHAABKudWHarsT4Ur73MtQPLk. Not freshly production-tested in this AI round. |
| Public GitHub project | VERIFIED | Existing real repo and remote main verified; candidate kept separate from stable main. |
| Arbitrary real-student intake / PDF / OCR / authentication | NOT IMPLEMENTED | Public scope is two exact synthetic examples. No upload or student-data intake feature. |
| Service-record or school-email extraction | NOT IMPLEMENTED | Deferred optional follow-up, not this candidate. |
| Real-family study, measured accuracy/time savings, FERPA certification | NOT CLAIMED | No supporting evidence. |
| Legal violation / owed-minutes determination | NOT CLAIMED | Product prepares evidence-grounded questions, not legal conclusions. |
| Updated public video under 3 minutes | BLOCKED | VIDEO URL NOT CREATED. Earlier 148-second local recording is historical and does not show current Notebook/AI. |
| Complete team / disclosure / eligibility | BLOCKED | Real roster and complete contributor information pending; saved historical draft is not proof. |
| Final competition submission | BLOCKED | Last observed Devpost Draft / 3 of 4 / INCOMPLETE SUBMISSION; not rechecked in this round. |

## URL register

| Deliverable | Actual URL / state |
| --- | --- |
| GitHub | https://github.com/wenzekan80-gif/iep-reality-check |
| Stable live | https://iep-reality-check.vercel.app |
| Stable Notebook immutable deployment | https://iep-reality-check-natjiaqw6-kazz5.vercel.app |
| Local candidate preview | http://127.0.0.1:3143/ (not a public deliverable) |
| AI production | NOT CREATED |
| Devpost project | https://devpost.com/software/iep-reality-check (last observed incomplete draft) |
| Public video | NOT CREATED |
