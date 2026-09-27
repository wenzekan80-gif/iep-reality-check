# Current continuation: accepted local DeepSeek candidate

Updated 2026-09-28. User requested only the minimal DeepSeek extraction layer and 20–30 offline synthetic examples; do not refactor the existing architecture/UI/domain/reconcile.

- Work in `D:\IEP-Reality-Check-ai-release`, branch `release/iep-ai-candidate-20260927`. Starting candidate ff3c520; accepted product **b2bc2d982730676280bfc844f848ab8f4986d128**. Later C commit is documentation only; re-read actual HEAD.
- A delivered 2cffc2b + d4788c5 from `D:\IEP-Reality-Check-ai`. C did not modify product code. B exact-product gate: 156 tests/typecheck/build PASS.
- C observed two actual DeepSeek requests via local production UI: clear Speech/2/30/exact quote/false; vague Speech/null/null/exact quote/true. Confirmation/edit/review/provenance/engine/timeline/meeting/late-record/fallback all passed. No full dataset accuracy claim.
- Current local preview: http://127.0.0.1:3143/ . Accepted production build; process uses IEP_AI_ENABLED=true, DEEPSEEK_MODEL=deepseek-flash and an existing inherited DEEPSEEK_API_KEY. No credential value was disclosed or written to a key file. Verify port owner before restarting; do not kill unrelated processes.
- Runtime POST /api/extract; /api/iep/extract compatibility alias. Both flat five-field contract. No OpenAI or Adaption runtime. Key name DEEPSEEK_API_KEY; default model deepseek-flash.
- Public scope remains two exact fictional examples. Local custom synthetic mode only in development/loopback. Narrow speech verifier; wider dataset rows are challenges, not demonstrated runtime support.
- Offline data `evaluation/iep-extraction/`: 24 rows, fixed 18 development / 6 heldout, exact quote/type/export checks PASS. Adaption upload/use/optimization and full model evaluation NOT RUN. No runtime import.
- Stable public main remains 7f1d609, product c5f7300, recovery tag pre-ai-stable-7f1d609. https://iep-reality-check.vercel.app retains Notebook fallback. No Vercel env/deployment changes in this round; AI production URL NOT CREATED.
- Freeze local accepted scope. Publishing AI requires deployment server env and actual anonymous runtime/browser smoke. Local browser evidence does not prove public AI.
- Read C_RELEASE_REPORT.md, FEATURE_TRUTH_TABLE.md, FINAL_RELEASE_CHECKLIST.md, B_DEEPSEEK_ACCEPTANCE.md and A_DEEPSEEK_DELIVERY.md. Older A_AI_DELIVERY/B_AI_ACCEPTANCE describe the historical pre-DeepSeek candidate.
- Local evidence: outputs/deepseek-release/ (ignored): two API receipts, DOM/screenshots, edit/source/late/fallback evidence and B logs/scans. Initial origin 403 was fixed narrowly for Next loopback normalization; final two genuine requests 200, browser warn/error logs empty.
- Submission unchanged: https://devpost.com/software/iep-reality-check last observed incomplete draft; public video NOT CREATED. Old 148-second local video shows older UI/no AI. Team/disclosure/eligibility and Submitted confirmation remain unverified. Do not resume old unanswered submission approvals unless submission work is requested.

Historical Notebook and synthetic release handoffs remain available in Git history. Do not treat historical OpenAI/keyless instructions as current runtime configuration.
