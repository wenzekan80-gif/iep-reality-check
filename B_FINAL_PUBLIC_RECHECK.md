# B final public release recheck

Date: 2026-09-28 (Asia/Shanghai). Anonymous HTTP checks completed at approximately 03:18–03:19.

**PASS — read-only public access, release identity and supplied production-evidence consistency.** No new release blocker found. This is a bounded independent recheck: B did not operate a browser, repeat the 156 local tests, call `/api/extract`, invoke a model, change environment/Git/product state or deploy.

## Anonymous public access

- `https://iep-reality-check.vercel.app`: **HTTP 200**, title `IEP Reality Check`, AI entry present. Seven script paths served by this fresh response exactly match the seven scripts in C's production client scan receipt.
- `https://github.com/wenzekan80-gif/iep-reality-check`: **HTTP 200** anonymously, correct public repository title.
- GitHub's anonymous ref API reports `main` at **c1a7f5fdeac18bd6020028c2f564f4231fc9cd0b**.
- The public tag `iep-deepseek-final-b2bc2d9` is an annotated tag object `abe961c3d7ea7acad76cfbce8e5d168e858ff944`; both its public GitHub tag-object response and local peel resolve to **b2bc2d982730676280bfc844f848ab8f4986d128**, the product commit independently tested by B.
- All five anonymous read-only HTTP requests succeeded. No retries or extraction requests were made.

B receipts: `B-anonymous-public-recheck.json`, `B-public-tag-object.json`.

## Deployment and source identity

C's production browser receipt, clear/vague API receipts, anonymous-home receipt and promotion log consistently identify **dpl_GDRYoZqvvhJcqkUC9gUmnFMxo8An** and product **b2bc2d982730676280bfc844f848ab8f4986d128**. The saved Vercel inspect result is `READY`, target `production`, for `iep-reality-check-kuchquimx-kazz5.vercel.app`. The saved promotion log records success for that same deployment.

The source archive `source-b2bc2d9.zip` contains 62 files and all 52 non-test runtime/configuration/fixture/public files in the compared product scope. One binary file matches its Git blob byte-for-byte; the 61 textual files differ only by Windows CRLF versus Git LF. After line-ending normalization there are **zero content mismatches, zero untracked archive files and zero missing runtime files**. Archive SHA-256: `af32293115b534ccc84b94071a3502404208673ca93894a9cbf0cdfbc281a546`.

The public main commit adds release documentation after the tested product commit. Read-only diff confirms `src`, `fixtures`, `evaluation`, `public`, dependencies and Next configuration are unchanged between the two commits. There is no local branch literally named `main` in this checkout; the live public ref is the authoritative main check here.

The working checkout has C's in-progress `FEATURE_TRUTH_TABLE.md` modification. B preserved it and does not claim the entire working tree is clean. This does not change the verified product/tag or public main identity.

B cross-check receipt: `B-receipt-consistency.json`.

## Production behavior evidenced by C's actual browser records

B reviewed C's saved responses and UI text snapshots; B did not generate new paid calls or independently rerun the browser flow.

| Case | Saved production result | Independent receipt check |
| --- | --- | --- |
| Clear | HTTP 200; Speech-Language Therapy / 2 / 30 / `needsReview: false` | Exactly five contract fields; full sentence is a verbatim substring of the approved source |
| Vague | HTTP 200; Speech-Language Therapy / null / null / `needsReview: true` | Exactly five fields; `speech services as appropriate` is verbatim; no zero/default substitution |
| Review gate | Clear Confirm and forward controls disabled before explicit scope; vague Confirm/Edit/forward disabled | Present in clear/vague production UI snapshots |
| Confirmed engine flow | 10 documented / 300 minutes / 1 explained / 1 needing clarification; two meeting questions | Present in initial/timeline and meeting-before snapshots |
| Late evidence | 11 documented / 330 minutes / 1 explained / 0 needing clarification; one meeting question | Present in after-late and final-meeting snapshots |
| Source provenance | Original excerpt and distinct human confirmation, original quotes, fictional dates/window clearly attributed | Present in source-drawer and AI-provenance snapshots |
| Stable fallback | Original Ethan plan; 300 to 330 documented minutes after the late record | Present in fallback plan/initial/after-late snapshots |

The two saved API receipts target the named production domain and same deployment ID. These receipts support two genuine C production extraction cases, not model accuracy on the 24-row offline dataset or arbitrary IEP intake.

## Client guard and application-error review

C's `production-client-and-guards.json` records seven anonymously fetched production JavaScript files, **0 actual-key matches and 0 secret-pattern matches**, plus public non-allowlisted input rejected with **422 `example_only`** and cross-origin input rejected with **403 `origin`**. Fresh B page access returned the exact same seven script paths. B did not rerun those POSTs or repeat the client scan.

`production-browser-logs.json` contains exactly one warning: a historical Google GSI/FedCM warning at `https://accounts.google.com/gsi/client`, timestamp `2026-09-27T18:55:24.898Z`, attributed by C to the earlier Vercel login page. There are **zero saved application-origin warnings/errors**, consistent with `C_PRODUCTION_BROWSER_ACCEPTANCE.json` reporting `applicationWarningErrorLogs: 0`. No current application failure is evidenced by the supplied production records. This statement is limited to those saved records; B did not open a new console session.

The prior local 403-origin failure remains historical and is superseded for the named production cases by current 200 responses and retained 403 cross-origin protection.

## Boundaries

The 156-test/typecheck/build acceptance remains prior B evidence on product b2bc2d9; no duplicate run was performed. Offline data remains 24 prepared references with 18/6 split; no Adaption or dataset-wide model evaluation occurred. Video assembly is separately owned by E. Devpost submission is still uncompleted per C's current handoff and was not inspected or performed by B. Public application/repository release success must not be presented as completed video upload or contest submission.
