# B Independent QA Report

Date: 2026-09-27 (Asia/Shanghai).

**Local QA and subsequent public production browser acceptance: PASS for the stable synthetic demo at `dfeb36908973fd9c2c5cb0c290a0a685d8f9dfbc`. The production addendum below records the exact deployment and browser scope.**

## Exact target and boundaries

- Tested commit: `dfeb36908973fd9c2c5cb0c290a0a685d8f9dfbc`.
- Worktree: `D:\IEP-Reality-Check-release`.
- Branch: `release/lexhack-stable-20260927`.
- Runtime: Node.js `v24.16.0`, npm `11.13.0`; installed Next.js `16.3.5`.
- B read `AGENTS.md`, `CLAUDE.md`, `README.md`, `package.json`, `next.config.ts`, source fixtures, reconciliation tests, and UI integration code.
- The worktree was initially clean. B rechecked the target commit and absence of product-file changes before building; the final architecture check also found no product diff.
- During the initial local QA phase, B installed dependencies only in this isolated worktree and did not operate a browser. B did not modify product source, switch branches, commit or launch a server. The later independent production browser phase is recorded in the addendum. C's release documents are outside the tested product surface.

## Commands and observed results

| Command/check | Result | Evidence |
| --- | --- | --- |
| `npm ci` | Exit 0; 138 packages added; audit reported 0 known vulnerabilities | `outputs/release-evidence/b-npm-ci.log` |
| `npm test -- --reporter=verbose` | Exit 0; 4 test files, 55 tests passed | `outputs/release-evidence/b-tests.log` |
| `npm run typecheck` | Exit 0 | `outputs/release-evidence/b-typecheck.log` |
| `npm run build` | Exit 0; optimized production build completed; `/` and `/_not-found` reported as static prerendered routes | `outputs/release-evidence/b-build.log` |
| `node outputs/release-evidence/b-secret-scan.mjs` | No checked secret-exposure rule matched in tracked files, reachable history, client artifacts, or reviewed QA logs; generated server-only preview material classified separately | `outputs/release-evidence/b-secret-scan.json` |
| Git/config/source architecture inspection | Expected commit; no product diff; no API/route-handler/middleware files; no product env/network-call signals; no `output: "export"` | `outputs/release-evidence/b-architecture-review.json` |

Build identifiers and manifest hashes are recorded in `outputs/release-evidence/b-build-artifacts.json`; the initial commit, branch, runtime and lockfile hash are in `outputs/release-evidence/b-baseline.json`.

The build emitted a missing-build-cache notice for the fresh isolated checkout. It did not prevent compilation. The npm audit result is the result reported during this install, not an independent security audit.

## Ethan data acceptance

The current-run fixture integration and React interaction tests passed these states:

| State | Reference sessions/minutes | Documented sessions/minutes | Explained | Unresolved | Open meeting questions |
| --- | --- | --- | --- | --- | --- |
| Initial | 12 / 360 | 10 / 300 | 1 | 1 | 2 |
| Add `Sep18_Speech_Record` | 12 / 360 | 11 / 330 | 1 | 0 | 1 |

The tests also verified exact fixture source text and physical CSV rows, valid source references before/after late evidence, stable cancellation follow-up identity, no invented page numbers, reimport handling, explicit human confirmation, source-drawer interaction/focus, restart, and browser-print invocation through jsdom. A print invocation test does not establish a downloaded PDF or native browser print-layout acceptance.

These are fresh tests of the specified commit, not reused historical acceptance claims.

## Deployment and credential review

- `next.config.ts` contains `devIndicators: false`; it does not configure static export. Next's static prerender output does not mean `output: "export"` is enabled.
- Product source has no server API routes, server actions, AI provider calls, `process.env`, `NEXT_PUBLIC_*`, or client network requests. The server page reads the fictional fixture files and passes serializable data to the client; reconciliation is deterministic local code.
- No AI capability is implemented or accepted at this commit. Public AI input allowlists, length/rate/budget controls, and runtime AI environment configuration were therefore not exercised. Any future AI commit requires separate B acceptance and a runtime-capable deployment if it adds server endpoints.
- The scan covered 38 currently tracked files, 52 unique historical blobs and 9 commits reachable from the tested commit, 12 client artifacts, 125 server/metadata artifacts, and 6 QA logs. It skipped no scanned binary inputs.
- Rules covered common provider tokens, GitHub tokens, AWS access IDs, Google API keys, Slack tokens, live Stripe secrets, private-key blocks, credential URLs, JWT literals, named sensitive variable literals, and sensitive `NEXT_PUBLIC_*` names. No tracked `.env` files were present.
- Next generated preview signing/encryption material was found only in the local `.next/prerender-manifest.json` server metadata. Exact-value comparison found no copies in the scanned tracked files, reachable history, client artifacts, or QA logs. Values are withheld from the report and saved evidence. `.next/` is Git-ignored; generated server metadata must not be published as a public static artifact.
- This is a bounded pattern scan and source review, not proof that every possible secret format is absent. Account credentials, external platform environment values, unrelated branches, deployed settings, and remote logs were not inspected by B.

## Initial local QA exclusions (before the production addendum)

- Actual browser flow against either local production or a public production deployment.
- Anonymous live-site/repository accessibility, deployment provenance, platform environment settings, CDN/runtime behavior, mobile browser behavior, or screenshot review.
- AI excerpt → confirmation → engine, arbitrary natural-language extraction, uploads, OCR, or any model invocation.
- Video duration/access, real team membership, tool/API disclosures, and Devpost submission confirmation.

C must complete homepage → Ethan stable demo → plan confirmation → timeline → source drawer → meeting prep → late record → recalculation using an actual browser and record production evidence before declaring the production main path verified. HTTP 200 alone is insufficient. No AI claim should be attached to this stable commit.

## Initial local handoff to C

The stable synthetic product at the exact tested commit is ready for C's production smoke test and deployment checks. There is no local QA blocker from this run. Keep the tested commit explicit; changes to product code require new acceptance against the delivered commit. Preserve the evidence directory locally (it is ignored by Git); if evidence is committed, select only reviewed redacted files. B has not authorized a final feature freeze or claimed a completed submission.

## Production browser acceptance addendum

Completed at `2026-09-26T18:57:40.261Z` (2026-09-27 Asia/Shanghai). This addendum supersedes the earlier exclusions for the public production browser flow, live-site anonymous loading, and screenshot review.

**Result: PASS for the stable synthetic main path. Final submission is not accepted by this report.**

- Product commit: `dfeb36908973fd9c2c5cb0c290a0a685d8f9dfbc`.
- Deployment ID supplied by C: `dpl_DJM1HkdMUs8Qd58nUu5FgyFx9nkF`.
- Browser-tested production URL: <https://iep-reality-check.vercel.app/>.
- Unique deployment URL supplied by C: <https://iep-reality-check-ex6t5vtwf-kazz5.vercel.app> (the full B browser flow ran on the production alias).
- Source archive SHA256 supplied by C: `61DD07AE7F91D9CE2AC3BA1366A78CE697189400B11442393AE466DDD7EE1231`.
- B reviewed `c-source-proof.json`: C's receipt records 37 uploaded files equal to the commit after LF normalization and equal to the upload manifest. Windows archive CRLF versus Git blob LF is explicitly documented. B did not redeploy or independently rerun C's upload comparison.

B used an independent Chrome tab through `cua`, without operating C's existing Vercel or Devpost tabs. The browser main-document request for the alias was observed with status 200 and **no Cookie, Authorization, or Vercel bypass/protection header**. No login was performed, no security protection was changed, and no authorized CLI request was substituted for browser access. The saved receipt retains these booleans without raw request header values.

The browser sequence was homepage → Ethan fictional story → original source drawer → explicit Looks right confirmation → timeline → cancellation source → meeting prep → add late record → recalculated timeline → added source → meeting prep. Observed initial totals were **10 documented / 300 minutes / 1 explained / 1 unresolved / 2 meeting questions**. After the September 18 record, observed totals were **11 / 330 / 1 / 0 / 1**. Week 3 changed to two documented events; only the cancellation make-up question remained. Source drawers showed the exact IEP/window text, cancellation CSV row 8 and context, and `Sep18_Speech_Record.txt`. Escape dismissal returned focus to the source button. No warning/error entries were captured by the browser console reader during this run.

Evidence is in `outputs/release-evidence/`: `b-production-result.json`, `b-production-anonymous-request.json`, `b-production-console.json`, the numbered `b-production-01` through `b-production-09` AX/DOM snapshots and screenshots, and `b-production-report.md`. One full-page screenshot command timed out; ordinary screenshot capture recovered and the application flow passed. Captures include browser-extension affordances already present in Chrome; these are not application capabilities.

The acceptance covers desktop production interaction on the named alias at this time. It does not cover mobile layouts, native print/PDF output, the unique deployment URL's full independent flow, an AI function, future commits/deployments, video, team membership, disclosures, or Devpost submission. C reported a draft submission; this B result does not change that to Submitted. C may freeze the verified stable synthetic capability set while completing the separate submission gates.
