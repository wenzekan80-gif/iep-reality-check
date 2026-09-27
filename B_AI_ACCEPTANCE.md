# B independent AI acceptance — final integrated candidate

Date: 2026-09-28 (Asia/Shanghai).
Exact reviewed and executed commit: **a059b6a42a29ee8570120f6aace2b617b9f339b7**.
Checkout: `D:\IEP-Reality-Check-ai-release`.
Base: `7f1d6091bc45213d3815a39b8fe19e8bb3c6f402`.

## Decision

**PASS — B static and automated gate. No unresolved code release blocker found within the delivered synthetic-only scope.**

**BLOCKED — real-provider acceptance**, because the user deferred configuring a server credential. No model call or credential operation was performed. Mocked transport tests do not establish account/model availability, actual model extraction quality or real-provider success.

**C-owned / pending separately — actual browser acceptance.** B did not run a browser concurrently. Production deployment is outside this review; a production build is not deployment evidence.

## Fresh execution on the final commit

All commands ran sequentially in the C checkout, after verifying exact HEAD and a clean tracked tree.

| Check | Result | Evidence |
| --- | --- | --- |
| `npm test` | PASS — 122/122 tests across 10 files; 33.21 seconds | `outputs/ai-release/B-final-tests.log` |
| `npm run typecheck` | PASS — exit 0 | `outputs/ai-release/B-final-typecheck.log` |
| `npm run build` | PASS — Next.js 16.3.5; static `/`, dynamic `/api/iep/extract` | `outputs/ai-release/B-final-build.log` |
| Source/client-bundle/log bounded scan | PASS — no matching files in all four bounded scopes | `outputs/ai-release/B-final-pattern-scan.json` |
| `git diff --check` | PASS | Read-only command, exit 0 |
| Domain/fixtures/dependencies vs base | PASS — unchanged | Read-only diff for `src/domain`, `src/fixtures`, `fixtures`, `package.json`, `package-lock.json`, exit 0 |
| Final identity and tracked status | PASS — same exact HEAD, clean | Read-only Git checks after build and scan |

No product file was changed by B. No commit, push, deployment, remote account action or key operation was performed. B artifacts reside only under the ignored `outputs/ai-release` directory.

## Closure of the previously identified blocker

The final delta from `23bd867bb19b3dfb8e25a5680947a748b01c71c4` adds the user's exact sentence to the Clear example, after the visible fictional-data disclaimer:

> Speech-language pathology services will be provided twice weekly for 30 minutes per session.

The service verifier recognizes speech-language pathology services as the canonical speech service, and the frequency verifier recognizes “twice weekly” as 2/week. The exact quoted supporting text remains verbatim. The clear scenario test now asserts this full example, candidate fields and comparison eligibility; the endpoint and React tests use those quotes. A regression test preserves earlier numeric and spoken-frequency wording support in the verifier.

The public endpoint still accepts only the two complete unchanged example strings, including the disclaimer. It is intentionally not an arbitrary IEP parser. Whitespace changes and unsupported custom strings are rejected in public mode.

## Verified behaviors and limits

**Quotes and unknowns.** Strict candidate shape and exact substring checks reject fabricated/missing quotes, mismatched numeric meaning, unsupported service attribution, unitless numeric evidence and extra fields. The vague example retains null frequency/duration and review status. Ranges, monthly, multiple-service, conditional/negative and instruction-bearing text are refused or held for review; they are not silently converted into a weekly plan. Clear custom local text cannot borrow Ethan's records.

**Human gating and lifecycle.** Extraction never confirms a plan. Confirm requires an eligible candidate, saved valid details and explicit fictional-scope selection. Needs review disables Confirm and every forward Notebook control. Editing preserves original AI quotes and requires renewed scope confirmation. Input/example changes, re-extraction, returning to Plan and restart invalidate earlier state. Generation tokens plus abort prevent late response resurrection. During page flips, Notebook content is inert and navigation controls are disabled; Restart cancels timers. No normal-browser route was found for the earlier speculative invalidate-during-flip problem.

**Source provenance.** Equal 2/30 values still produce a new submitted-excerpt source and distinct human-confirmation record. Edits are labelled human entries rather than original quotes; original AI values and verbatim quotes remain attached. Ethan's dates/window/records are selected fictional context, explicitly not model extraction. The domain contract retains real resolvable IDs and matched source document names. Review/meeting sources carry the confirmation record, which embeds the unchanged excerpt, and the dedicated source action also opens the original submitted block.

**Stable regression.** The complete synthetic flow continues through the pure engine: 10 documented / 300 minutes / 1 explained / 1 unresolved / 2 questions; late September 18 evidence yields 11 / 330 / 1 / 0 / 1. Original domain, fixtures and dependencies remain unchanged. The existing 68 tests remain within the 122 passing tests; the additional tests use mocked extraction/provider transport where applicable.

**Server boundary.** The feature fails closed without the exact switch or server key. Exact public allowlist, explicit synthetic flag, strict body shape, 2,400-character / 12,000-byte request caps, 1,000-token / 32-KiB provider caps, 15-second timeout and no automatic retries remain in place. Provider refusal, incomplete/malformed output, quote failures and upstream failures produce safe errors rather than fixture success. The key stays in server-only modules; the endpoint is fixed. Cross-origin browser requests are rejected. The in-memory two-concurrent / six-per-minute gate is explicitly per process, not a distributed/global budget or authentication.

**Bounded sensitive-pattern inspection.** Checked client source excluding tests/server, production `.next/static` JavaScript and only B's three final command logs for API-key identifiers, public secret-variable patterns, fixed upstream endpoint leakage, Bearer-like credential values, OpenAI key-shaped values and private-key headers. No matches. Separately checked the new AI product path for console output, local/session storage and raw HTML rendering; no matches. Scan output records counts/file names only, never matching values. This is a bounded source/build check, not a universal secret-audit claim.

## Remaining acceptance work

C owns the actual browser stable/keyless flow and final release decision. Real clear/vague extraction must remain **BLOCKED / not tested** until the user chooses to configure a server key and genuine responses are observed. Service-record/email extraction remains deferred. No legal conclusion, arbitrary-upload support, live AI success or public deployment is established by this report.
