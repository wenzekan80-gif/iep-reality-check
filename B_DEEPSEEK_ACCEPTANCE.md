# B independent DeepSeek acceptance — origin follow-up

Date: 2026-09-28 (Asia/Shanghai).
Final exact integrated commit: **b2bc2d982730676280bfc844f848ab8f4986d128**.
Checkout: `D:\IEP-Reality-Check-ai-release`.
Prior reviewed commit: `cc1c9d3097a7258fcf5e52746c7c310cc172954a`.
Runtime migration base: `ff3c520b2642cc695a29ca28f00d7467703d0610`.

## Decision

**PASS — B final static and fresh automated gates.** No unresolved code blocker found within the approved synthetic Clear/Vague speech scope. The same-origin browser failure reported on the prior commit has an appropriately narrow code fix and actual-NextRequest regression coverage.

**C actual-browser/live-provider recheck: PENDING separately at report time.** B did not start a server, operate the browser, call a provider/model, restart C's server, change credentials or deploy. The prior C result (`403 origin` before provider access) remains historical evidence, not a current-commit result. B's automated pass does not establish genuine model availability or live UI success. C was notified immediately after the final build to restart port 3143 and perform its two bounded cases.

**Adaption / 24-row model evaluation: NOT RUN.** Offline data integrity passes are not extraction accuracy or runtime-support evidence.

## Fresh final-commit checks

| Check | Result | Ignored evidence |
| --- | --- | --- |
| `npm test` | PASS — **156/156**, 10 files, 5.82 seconds | `outputs/deepseek-release/B-final-origin-tests.log` |
| `npm run typecheck` | PASS — exit 0 | `outputs/deepseek-release/B-final-origin-typecheck.log` |
| `npm run build` | PASS — Next.js 16.3.5; static `/`; dynamic `/api/extract` and `/api/iep/extract` | `outputs/deepseek-release/B-final-origin-build.log` |
| Affected source, rebuilt client JS and new-log scan | PASS — zero matching files | `outputs/deepseek-release/B-final-origin-bounded-scan.json` |
| `git diff --check` | PASS | Read-only command, exit 0 |
| Exact final HEAD / tracked state | Same commit / clean | Read-only checks before and after verification |

Test, typecheck and build were sequential. Next telemetry was disabled in B's command processes. B wrote only ignored acceptance artifacts. No product or tracked documentation edits and no Git mutation occurred.

## Origin fix review

The delta from the prior integrated commit is limited to `sameRequestOrigin` and its handler call, ten origin regressions, and explanatory documentation. No provider, extraction, human-gating, UI, domain or data change is included.

B directly read the installed `node_modules/next/dist/server/web/next-url.js` and `spec-extension/request.js`. The installed NextURL normalizes loopback hostnames to `localhost`, and NextRequest exposes that normalized URL by default while preserving request headers. This corroborates the reported URL-only comparison failure.

The replacement guard preserves browser origin isolation:

- Origin must be a canonical HTTP(S) origin string with the same scheme as the request URL. Null-origin strings and origins carrying a path are rejected.
- When Host is supplied, malformed authority characters are rejected and the Origin authority must match the parsed actual Host authority.
- If actual Host and request URL already match, ordinary same-origin behavior is retained.
- The only URL/Host discrepancy admitted is a normalized request hostname of `localhost` with actual Host `127.0.0.1` or `[::1]`, using the same scheme and port.
- `localhost` and `127.0.0.1` are not accepted as interchangeable browser Origin values. Mismatched ports/schemes, unrelated Host values and outside origins stay rejected. Forwarded and X-Forwarded-Host are not authorization inputs.
- No-Origin requests retain the prior behavior; the guard is not authentication.

The ten new tests instantiate the actual installed NextRequest. They demonstrate same-origin IPv4/IPv6 normalization reaching the allowlist rejection without a provider call, plus eight malformed/cross-origin/authority cases staying at 403. All passed in B's fresh run.

A's delivery document additionally reports bounded local production HTTP checks with a fake key and blocked provider access: same-origin changed from 403 to 422 `example_only`, while alias/external/forged-forwarded cases stayed at 403, with provider attempts zero. Those are **A-reported supporting checks**, not B's live model/browser evidence.

## Retained runtime and offline acceptance

The prior detailed B report is preserved as `outputs/deepseek-release/B_DEEPSEEK_ACCEPTANCE-cc1c9d-prior.md`, including the former C browser blocker. Prior logs and scan remain unchanged.

Read-only diff confirms the evaluation directory, domain/reconcile, fixtures, confirmation adapter, all UI/styles, package and lockfile are unchanged from the prior reviewed commit. The unchanged runtime remains DeepSeek-only, with a strict flat five-field result (`serviceName`, `sessionsPerPeriod`, `minutesPerSession`, `sourceQuote`, `needsReview`), mandatory verbatim contiguous quote, null unknowns, safe provider errors, fixed upstream, limits and exact public two-example allowlist. Human Confirm/Edit/Needs review, explicit fictional scope, stale-response protection and distinct human provenance remain intact. The old route is a same-handler flat-contract compatibility alias.

The final suite includes previous evidence and regression cases: clear quote/2/week/30 minutes, vague nulls, partial monthly/range retention with review, no unsupported comparison, malformed/refused/truncated provider failures, DeepSeek key-only routing, source fidelity, edit provenance and Ethan 10/300 to 11/330 late-evidence flow.

The unchanged prior offline audit remains **PASS: 24 examples; 18 development / 6 heldout; 24/24 exact quoted substrings; zero heldout rows in the development export; exports match references**. It was intentionally not repeated because no data or validator changed. Its evidence is `B-offline-validation.log`; model evaluation and Adaption remain NOT RUN.

The inherited narrow-speech verifier may reject null-service numeric references or other-service whole quotes instead of returning partial runtime candidates. This is a documented runtime scope limitation. The wider 24-row reference/challenge set is not claimed to pass the endpoint, and no runtime imports of that offline data or Adaption were introduced.

## Affected sensitive-pattern check

The rebuilt client JavaScript, three final command logs and changed runtime service had zero relevant credential-leak, raw logging/storage/HTML or forbidden runtime dependency pattern matches. Exact comparison against the existing process DeepSeek key covered **17 changed-source/docs, rebuilt-client and new-log files** and found **zero matches**. Only presence/counts were emitted; no secret value or matching line was printed, stored, hashed or used for a request. The earlier broader 97-file exact-key check remains prior evidence. These are bounded inspections, not universal secret-audit claims.

## Remaining action

C owns the current-build browser/provider clear and vague outcomes and final release decision. Until those receipts exist, do not relabel automated success as live AI success or public deployment. Adaption use, optimization, 24-row model evaluation, arbitrary IEP intake, other-service runtime support and legal/clinical conclusions remain outside this acceptance.
