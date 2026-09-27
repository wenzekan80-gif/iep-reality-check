# A — minimal DeepSeek extraction delivery

Date: 2026-09-28 (Asia/Shanghai). Worktree: `D:\IEP-Reality-Check-ai`.
Branch: `feature/deepseek-extract-20260928`. Base: `ff3c520b2642cc695a29ca28f00d7467703d0610`.
The delivery commit is the commit containing this file. A made no real provider calls, push, merge, deployment or production configuration change.

## Implemented

- Replaced the runtime OpenAI adapter with server-only native `fetch` to the fixed official `https://api.deepseek.com/chat/completions` endpoint. Only `DEEPSEEK_API_KEY` is read for authentication; no fallback provider/key or configurable endpoint.
- `DEEPSEEK_MODEL` defaults to `deepseek-flash`. Request uses `messages`, `response_format: { type: "json_object" }`, an explicit JSON instruction/example, `thinking: { type: "disabled" }`, `stream: false` and `max_tokens: 1000`. No OpenAI Responses envelope/options and no SDK dependency.
- Added `POST /api/extract`. The UI now calls it. `/api/iep/extract` remains a compatibility URL with the same DeepSeek provider, validation, safeguards and **flat** response; it does not retain the former envelope.
- A successful response has exactly five fields, validated by strict Zod plus independent source/meaning checks. Unknown extraction fields are null. `sourceQuote` is mandatory, nonempty, and an exact contiguous substring of the submitted text, even when all extracted fields are unknown. Every non-null value must be supported by that quote.
- Thin conversion maps the shared quote to the existing per-field candidate evidence and highlights the original quote. Existing Confirm / Edit / Needs review, stale-response invalidation, scope selection, separate human provenance and stable Ethan fallback are preserved.
- Narrow field-level uncertainty handling: monthly frequency is not converted and stays null; a separately explicit duration may stay known. Frequency/duration ranges leave their affected field null. All such candidates need review and cannot enter the engine. The public exact-example allowlist remains unchanged.

## Contract

Request: `{ "text": "<approved synthetic excerpt>", "synthetic": true }`.

Example success for the existing clear synthetic sentence (contract illustration, **not a live receipt**):

```json
{
  "serviceName": "Speech-Language Therapy",
  "sessionsPerPeriod": 2,
  "minutesPerSession": 30,
  "sourceQuote": "Speech-language pathology services will be provided twice weekly for 30 minutes per session.",
  "needsReview": false
}
```

`sessionsPerPeriod` is weekly only. The vague example keeps frequency and duration null with `needsReview: true`. Missing/fabricated/insufficient quotes, wrong numeric meanings, extra keys and malformed schemas are rejected with safe errors and no candidate. Empty output, non-`stop` completion, refusal, tool-call output, malformed JSON, oversized body and provider errors also fail closed. JSON mode alone is not treated as schema/evidence validation.

Environment names: `IEP_AI_ENABLED` (must equal `true`; otherwise off), `DEEPSEEK_API_KEY` (server only), optional `DEEPSEEK_MODEL`, optional `IEP_AI_LOCAL_CUSTOM` (development + loopback only). Tests prove that another provider's key cannot enable extraction. No real credential value was printed, stored or used by A.

Inherited bounds: 2,400 input characters / 12,000 request bytes; 1,000 output tokens / 32 KiB provider response; 15-second timeout; no retries; at most two concurrent calls and six calls per minute **per process**, not a distributed/global spending cap. Responses are no-store. Public input is restricted to the existing two exact synthetic examples and requires the synthetic flag. The application does not log or persist excerpt/key/provider bodies. Synthetic input is sent to DeepSeek; no zero-provider-retention claim is made.

## Validation

- `npm test`: **PASS, 156/156 across 10 files** (previous 122 plus 24 provider/contract/field-evidence regressions and 10 origin regressions).
- `npm run typecheck`: **PASS**.
- `npm run build`: **PASS**, routes `/`, `/_not-found`, `/api/extract`, `/api/iep/extract`.
- `git diff --check`: **PASS**.
- Domain/reconcile, fixtures, `src/ai/confirmation.ts`, notebook styles, `DemoApp.tsx`, package manifest and lockfile: unchanged from the base.
- Tests cover DeepSeek fixed endpoint/auth/model/options, absence of Responses-only options, rejection of another provider key, both route contracts, unknowns and required quotes, malformed/refused/incomplete output, no-key/off/provider errors and bounds, per-field monthly/range uncertainty, quoted UI, human confirmation/edit/review/stale state, and unchanged Ethan 10/300 → 11/330 behavior.

Logs (local, git-ignored): `outputs/deepseek-delivery/tests.log`, `typecheck.log`, `build.log`.

### Same-origin follow-up

Installed Next.js 16.3.5 `NextURL` normalizes `127.0.0.1` and `[::1]` to `localhost`; `NextRequest.url` exposes that normalized value while the incoming Host remains unchanged. The original URL-only guard therefore rejected legitimate browser requests to `127.0.0.1`. The narrow fix validates Origin against the actual Host and permits only this known loopback normalization with matching scheme and port. It does not trust Forwarded/X-Forwarded-Host, and it does not treat localhost/127.0.0.1 as the same browser origin. Other URL/Host mismatches remain rejected.

Actual production-build HTTP verification used a bounded local Next server on port 3145, an explicit fake credential and input outside the allowlist, with external provider attempts blocked and counted. Before the fix, exact same-origin returned 403. After the fix, it reached the allowlist guard and returned 422 `example_only`; a cross-origin localhost alias, external origin and forged forwarded-host each returned 403. A no-Origin control retained the existing 422 behavior. Provider attempts: **0**. This was a local HTTP guard check, not live AI acceptance. Additional tests instantiate the actual installed `NextRequest`, reproduce its normalization, and check mismatched ports/schemes/hosts, invalid origins and forwarding-header spoofing.

Follow-up receipts/logs (local, git-ignored): `origin-before.json`, `origin-after.json`, `origin-http-smoke.cjs`, `tests-origin-fix.log`, `typecheck-origin-fix.log`, `build-origin-fix.log` under `outputs/deepseek-delivery/`. The test server closed after each bounded run.

**A live-provider verification: NOT PERFORMED.** Transport/provider tests are mocked with explicit test-only credentials. They prove code behavior, not live model availability or accuracy. C owns any bounded live clear/vague acceptance after exact-commit checks. Offline evaluation data was not imported, executed, edited or used as runtime output by A.

## Files

Runtime: `src/ai/extraction.ts`, `src/ai/server/provider.ts`, `src/ai/server/service.ts`, `src/app/api/extract/route.ts` (new), `src/app/api/iep/extract/route.ts`, `src/ui/AIPlanStep.tsx`.
Tests: `src/ai/extraction.test.ts`, `src/ai/server/service.test.ts`, `src/ui/AIPlanStep.test.tsx`.
Documentation: `README.md`, `A_DEEPSEEK_DELIVERY.md`.

No release reports, evaluation data, service-record/email extraction, domain types, reconciliation logic, fixtures, layout or styling were changed. This remains a narrow synthetic demonstration, not a general IEP parser or legal interpretation.

Official references read: [DeepSeek chat completions](https://api-docs.deepseek.com/api/create-chat-completion/), [JSON output](https://api-docs.deepseek.com/guides/json_mode/), [thinking mode](https://api-docs.deepseek.com/guides/thinking_mode/). Chat/JSON pages were fetched through read-only HTTP after web-tool timeouts; the thinking guide was opened in the web tool. Installed Next.js Route Handler, environment-variable and server-only documentation was read before editing.
