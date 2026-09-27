# A — synthetic IEP AI implementation delivery

Date: 2026-09-28 (Asia/Shanghai). Worktree: `D:\IEP-Reality-Check-ai`.
Branch: `feature/iep-ai-extraction-20260927`.
Base: `7f1d6091bc45213d3815a39b8fe19e8bb3c6f402` (notebook product inherited from `c5f7300`).
The delivery commit is the commit containing this file; obtain its exact ID with `git rev-parse HEAD` in the delivery checkout. No push, merge, deployment or production configuration was performed by A.

## Delivered scope

1. Paste an approved synthetic IEP excerpt and request genuine server-side structured extraction of service, weekly frequency, minutes per session and verbatim quote evidence for each non-null field. Native OpenAI Responses adapter; strict JSON schema; independent Zod and quote/meaning checks. No mock/fallback response exists in the product.
2. Notebook candidate card, exact source highlights using escaped text nodes, and **Confirm / Edit / Needs review** before the existing pure `reconcile()`. Human changes retain original AI values/quotes and add a distinct confirmation SourceBlock. Changed text, new requests, leaving/remounting, restart and return from records revoke the earlier candidate/confirmation. Needs review and unconfirmed states block tabs, Next and dog-ear controls.
3. **What this means**, labelled **Based on the IEP text above.** This deterministic reading aid uses validated extracted fields and describes uncertainty. It is not free-form legal interpretation.

Ethan's original demo remains one-click available. Only the clear approved speech example can use his existing fictional records. An explicit scope checkbox identifies the original September 1–October 10, 2025 dates and six-week window as demo context, not model extraction. Vague output stays null and requires review; it cannot be numerically edited into a comparison. Clear-example edits are explicitly human-authored demo values. Custom local excerpts can be extracted but cannot borrow Ethan's scope or records. Source dialogs and the print appendix retain the human confirmation and unchanged excerpt.

## Validation performed on this candidate

- `npm test`: **PASS — 122/122 tests across 10 files**. All 68 existing tests retained and passing; 44 new server/evidence/adapter tests and 10 new UI tests.
- `npm run typecheck`: **PASS**.
- `npm run build`: **PASS**, Next.js 16.3.5; static `/` and `/_not-found`, dynamic `/api/iep/extract`.
- `git diff --check`: **PASS**.
- `src/domain/`, `src/fixtures/`, `fixtures/`, `package.json` and `package-lock.json`: unchanged from the base. No new dependency.
- No `console.*`, local/session storage, raw HTML rendering or `NEXT_PUBLIC` secret usage in the new AI path (bounded source scan).

Logs are preserved locally (git-ignored): initial `outputs/ai-delivery/tests.log`, `typecheck.log`, `build.log`; exact-wording follow-up `tests-followup.log`, `typecheck-followup.log`, `build-followup.log` in the same directory.

Exact-wording follow-up: the clear public example now uses the user's exact sentence, “Speech-language pathology services will be provided twice weekly for 30 minutes per session.” The service quote maps to `Speech-Language Therapy`, “twice weekly” supports 2 sessions per week, and the duration remains 30 minutes. The model still proposes the values; independent evidence checks verify them. Existing numeric/spoken weekly phrase support is retained in a dedicated regression. Vague wording, scope confirmation, human provenance and all other guards are unchanged.

Tests cover exact clear output; vague nulls; unknown values; absent/fabricated quotes; mismatched numeric and service meanings; conditional, negative, range, monthly, multi-service and prompt-instruction text; schema errors; no key/off switch; allowlist/mode/length/origin gates; per-process call bounds; timeout/abort; malformed/refused/incomplete/oversized/upstream errors; explicit confirmation; edit provenance into engine findings; source text safety; Needs review and all forward navigation; confirm → return → Needs review/paste; stale success after text change/restart; honest unavailable UI; preserved 10/300 initial and 11/330 late-evidence results.

**Live provider: NOT TESTED / awaiting server credential configuration**, intentionally deferred by the user. Tests mock the provider or HTTP transport and are labelled accordingly; they do not establish model quality, account/model availability or live extraction success. A did not run a browser visual acceptance or native print test on this AI candidate; B/C acceptance remains separate. Production remains outside this delivery.

## Runtime contract

Endpoint: `POST /api/iep/extract` with JSON `{ "text": "<approved synthetic example>", "synthetic": true }`.
Successful response: validated candidate, `origin: "live-model"`, and approved example ID (or null for permitted local custom input). Errors contain a safe code/message and no candidate or provider body. Responses use `Cache-Control: no-store`.

Environment names only:

- `IEP_AI_ENABLED`: exact `true` required; otherwise disabled by default.
- `OPENAI_API_KEY`: server only; missing/empty means unavailable.
- `OPENAI_MODEL`: optional; default `gpt-4.1-mini-2025-04-14`.
- `IEP_AI_LOCAL_CUSTOM`: optional exact `true`; custom invented text is accepted only with `NODE_ENV=development` and a loopback request URL. It is ignored in production.

Public allowlist: exact strings below, with one newline after the disclaimer; no trimming/rewriting is performed. The UI buttons insert these strings.

```text
FICTIONAL DEMO CASE — NO REAL STUDENT DATA
Speech-language pathology services will be provided twice weekly for 30 minutes per session.
```

```text
FICTIONAL DEMO CASE — NO REAL STUDENT DATA
Ethan will receive speech services as appropriate.
```

The first model response must support its proposed service, frequency and duration with quotes present in that text. The second must not guess frequency/duration: both values and their quotes remain null, with `needsReview: true`. Wrong guesses are rejected, never replaced with preset “AI” output.

Calls are bounded to 2,400 characters / 12,000 streamed request bytes, 1,000 output tokens / 32 KiB provider response, a 15-second timeout, no retries, two concurrent requests and six requests per minute per process. The in-memory gate is **not a distributed/global budget** and resets on process restart. Cross-origin browser requests are rejected but this is not authentication. No raw excerpt, credential or provider response body is logged or persisted by the application. Synthetic text is sent to OpenAI with `store: false`; this is not a claim of zero provider retention. UI state is memory-only.

Official documentation checked: [Responses structured outputs](https://developers.openai.com/api/docs/guides/structured-outputs), [GPT-4.1 mini supported endpoints/features](https://developers.openai.com/api/docs/models/gpt-4.1-mini), and installed Next.js 16.3.5 guides for Route Handlers, environment variables and the server/client boundary before code changes.

## Touched files

- New: `src/ai/examples.ts`, `src/ai/extraction.ts`, `src/ai/confirmation.ts`, `src/ai/server/provider.ts`, `src/ai/server/service.ts`, `src/app/api/iep/extract/route.ts`.
- New UI: `src/ui/AIPlanStep.tsx`, `src/ui/ai-plan.css`.
- New tests: `src/ai/extraction.test.ts`, `src/ai/server/service.test.ts`, `src/ui/AIPlanStep.test.tsx`.
- Existing UI integration: `src/ui/DemoApp.tsx`, `src/ui/HomePage.tsx`, `src/ui/SourceDrawer.tsx`, `src/app/layout.tsx`.
- Documentation: `README.md`, `A_AI_DELIVERY.md`.

## Remaining limits

This is a narrow synthetic-only extraction/review feature. The evidence verifier intentionally rejects unsupported numeric phrasing. It is not a general IEP parser, PDF/OCR feature, service-record/email extractor, real-student intake flow, authentication system, distributed spending control or legal assessment. Live model acceptance still requires configuring a key and checking clear/vague outputs. Service-record/email extraction was not implemented this round. No release truth/checklist/report file owned by C was edited.
