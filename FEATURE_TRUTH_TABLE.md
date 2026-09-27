# Feature Truth Table

Updated 2026-09-28. Starting candidate ff3c520; accepted product **b2bc2d982730676280bfc844f848ab8f4986d128**; stable public main 7f1d609. See C_RELEASE_REPORT.md and B_DEEPSEEK_ACCEPTANCE.md. VERIFIED applies only to each row's evidence scope. D/E may cite only VERIFIED capabilities with these limits.

| Capability | Status | Evidence / permitted claim |
| --- | --- | --- |
| Recoverable Notebook baseline | VERIFIED | Stable main 7f1d609; pushed pre-ai-stable-7f1d609 tag. |
| Isolated A delivery and C integration | VERIFIED | Named A commits 2cffc2b/d4788c5; C product b2bc2d9; independent B gate. |
| DeepSeek POST /api/extract, five-field contract | VERIFIED | Strict existing-Zod validation and real local clear/vague calls; /api/iep/extract same-handler compatibility alias. |
| Clear weekly speech extraction | VERIFIED | Actual local DeepSeek response Speech-Language Therapy / 2 / 30 / exact original full sentence / needsReview=false. |
| Uncertainty recognition | VERIFIED | Actual local vague response Speech / null / null / exact quote / needsReview=true; numerical guesses rejected in tests. |
| Exact source highlighting and human gate | VERIFIED | C real-browser source mark, Needs review pause, Edit provenance, scope/Confirm required before unchanged reconcile. |
| Parent-facing explanation | VERIFIED | Deterministic reading aid from validated fields, Based on the IEP text above; no legal interpretation. |
| AI excerpt → confirm → engine → late record | VERIFIED | Local production build only: 10/300/1/1/2 → 11/330/1/0/1; source and final meeting question checked. |
| Original Ethan fallback | VERIFIED | C actual original plan/confirm and 300→330 late-record flow after AI review; no extra API calls. |
| Pure reconciliation/domain/fixtures preserved | VERIFIED | B diff against ff3c520; no engine, model, fixture, confirmation-adapter or dependency changes. |
| Automated candidate gate | VERIFIED | B fresh 156/156 tests, typecheck/build at b2bc2d9. |
| Runtime-capable build | VERIFIED | No static export; dynamic Node /api/extract and alias. Remote candidate runtime remains untested. |
| Public safeguards in code | VERIFIED | Two exact examples; synthetic flag; length/body/output/time caps; off switch; 2 concurrent/6 per minute per process. Not a global budget or authentication. |
| Server-only key and bounded leak checks | VERIFIED | DEEPSEEK_API_KEY only; B source/client/log pattern and exact-key checks had zero matches. Values absent from committed configuration. |
| Real model availability | VERIFIED | Two local genuine DeepSeek requests, configured model deepseek-flash; no broader accuracy or uptime claim. |
| 24 synthetic reference examples and fixed split | VERIFIED | 18 development/6 heldout, exact-quote/type/export integrity passed; offline data only. |
| Adaption-ready offline export | VERIFIED | Prepared instruction/response JSONL and documented workflow; no upload/platform run claimed. |
| Adaption Labs actually used or optimized results | NOT CLAIMED | NOT RUN; no runtime dependency, account operation or platform evidence. |
| Full 24-row model accuracy or educator adjudication | NOT CLAIMED | Reference/challenge targets only; not evaluated on a model or adjudicated by educators. |
| AI public deployment and anonymous remote smoke | BLOCKED | AI production URL NOT CREATED; stable production retained; server-env/deploy/smoke remain. |
| Existing public Notebook release | VERIFIED | Inherited product c5f7300 / record7f1d609 publication at dpl_E7SXHAABKudWHarsT4Ur73MtQPLk; not rerun this round. |
| Existing public GitHub repo | VERIFIED | Real repository/remote; candidate separate from stable main. |
| Arbitrary real-student intake, PDF/OCR/authentication | NOT IMPLEMENTED | Public mode intentionally two exact synthetic excerpts. |
| General other-service/multi-service IEP parser | NOT IMPLEMENTED | Narrow weekly speech verifier; may reject broader references instead of partial candidates. |
| Service-record or school-email extraction | NOT IMPLEMENTED | Outside this minimal extraction change. |
| Legal violation, owed minutes, FERPA certification, measured time savings | NOT CLAIMED | No supporting evidence or such product determination. |
| Updated public video under 3 minutes | BLOCKED | URL NOT CREATED; historical 148-second local video shows older product. |
| Complete real team and disclosures | BLOCKED | Contributor/eligibility facts pending; agents are not asserted as human team members. |
| Final Devpost submission | BLOCKED | Last observed Draft / INCOMPLETE SUBMISSION; no current Submitted confirmation. |

## URL register

| Deliverable | Actual URL / state |
| --- | --- |
| Repository | https://github.com/wenzekan80-gif/iep-reality-check |
| Stable production | https://iep-reality-check.vercel.app |
| Stable immutable deployment | https://iep-reality-check-natjiaqw6-kazz5.vercel.app |
| Local AI preview | http://127.0.0.1:3143/ (not public) |
| AI production | NOT CREATED |
| Devpost | https://devpost.com/software/iep-reality-check (last observed incomplete draft) |
| Public video | NOT CREATED |
