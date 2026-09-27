# Feature Truth Table

Updated 2026-09-28. Starting candidate ff3c520; accepted product **b2bc2d982730676280bfc844f848ab8f4986d128**; production product b2bc2d9; main contains the product and subsequent release documentation; rollback 7f1d609. See C_RELEASE_REPORT.md and B_DEEPSEEK_ACCEPTANCE.md. VERIFIED applies only to each row's evidence scope. D/E may cite only VERIFIED capabilities with these limits.

| Capability | Status | Evidence / permitted claim |
| --- | --- | --- |
| Recoverable Notebook baseline | VERIFIED | Preserved baseline 7f1d609; pushed pre-ai-stable-7f1d609 tag. |
| Isolated A delivery and C integration | VERIFIED | Named A commits 2cffc2b/d4788c5; C product b2bc2d9; independent B gate. |
| DeepSeek POST /api/extract, five-field contract | VERIFIED | Strict existing-Zod validation and real local clear/vague calls; /api/iep/extract same-handler compatibility alias. |
| Clear weekly speech extraction | VERIFIED | Actual local and production DeepSeek response Speech-Language Therapy / 2 / 30 / exact original full sentence / needsReview=false. |
| Uncertainty recognition | VERIFIED | Actual local and production vague response Speech / null / null / exact quote / needsReview=true; numerical guesses rejected in tests. |
| Exact source highlighting and human gate | VERIFIED | C real-browser source mark, Needs review pause, Edit provenance, scope/Confirm required before unchanged reconcile. |
| Parent-facing explanation | VERIFIED | Deterministic reading aid from validated fields, Based on the IEP text above; no legal interpretation. |
| AI excerpt → confirm → engine → late record | VERIFIED | Local and public production browser: 10/300/1/1/2 → 11/330/1/0/1; source and final meeting question checked. |
| Original Ethan fallback | VERIFIED | C actual original plan/confirm and 300→330 late-record flow after AI review; no extra API calls. |
| Pure reconciliation/domain/fixtures preserved | VERIFIED | B diff against ff3c520; no engine, model, fixture, confirmation-adapter or dependency changes. |
| Automated candidate gate | VERIFIED | B fresh 156/156 tests, typecheck/build at b2bc2d9. |
| Runtime-capable build | VERIFIED | No static export; dynamic Node /api/extract and alias. Vercel runtime routes built and genuine production requests passed. |
| Public safeguards in code | VERIFIED | Two exact examples; synthetic flag; length/body/output/time caps; off switch; 2 concurrent/6 per minute per process. Not a global budget or authentication. |
| Server-only key and bounded leak checks | VERIFIED | DEEPSEEK_API_KEY only; Vercel server secret configured; B local checks and C scan of all seven live client scripts found zero actual-key/secret matches. Values absent from committed configuration. |
| Real model availability | VERIFIED | Local and public genuine clear/vague DeepSeek responses, configured model deepseek-flash; no broader accuracy or uptime claim. |
| 24 synthetic reference examples and fixed split | VERIFIED | 18 development/6 heldout, exact-quote/type/export integrity passed; offline data only. |
| Adaption-ready offline export | VERIFIED | Prepared instruction/response JSONL and documented workflow; no upload/platform run claimed. |
| Adaption Labs actually used or optimized results | NOT CLAIMED | NOT RUN; no runtime dependency, account operation or platform evidence. |
| Full 24-row model accuracy or educator adjudication | NOT CLAIMED | Reference/challenge targets only; not evaluated on a model or adjudicated by educators. |
| AI public deployment and anonymous remote smoke | VERIFIED | Production dpl_GDRYoZqvvhJcqkUC9gUmnFMxo8An; actual anonymous home/AI clear+vague/confirmation/timeline/source/meeting/late-record/fallback browser acceptance PASS. |
| Stable Notebook rollback | VERIFIED | Preserved product c5f7300 / record7f1d609 and deployment dpl_E7SXHAABKudWHarsT4Ur73MtQPLk; final production now includes DeepSeek and still contains Ethan fallback. |
| Existing public GitHub repo | VERIFIED | Anonymous HTTP200; main contains accepted product and release docs; final product tag independently verified. |
| Arbitrary real-student intake, PDF/OCR/authentication | NOT IMPLEMENTED | Public mode intentionally two exact synthetic excerpts. |
| General other-service/multi-service IEP parser | NOT IMPLEMENTED | Narrow weekly speech verifier; may reject broader references instead of partial candidates. |
| Service-record or school-email extraction | NOT IMPLEMENTED | Outside this minimal extraction change. |
| Legal violation, owed minutes, FERPA certification, measured time savings | NOT CLAIMED | No supporting evidence or such product determination. |
| Updated public video under 3 minutes | VERIFIED | https://youtu.be/j-oMMVlKwPk ; actual final144.500s recording, decode/audio/visual QA PASS; Unlisted setting/public anonymous oEmbed and actual browser playback. Separate signed-out-browser playback not completed. |
| Real team and contributor declarations | VERIFIED | User confirms sole member wenzekan80-gif, eligible student and work during hack period; Devpost current teammates lists that creator. User confirms Codex/ChatGPT/DeepSeek; repository dependencies and media tools disclosed separately. |
| Final Devpost submission | VERIFIED | Actual Project submitted! and Submitted to LexHack 2026 at 2026-09-28 03:30 Asia/Shanghai; terms explicitly authorized by user. |

## URL register

| Deliverable | Actual URL / state |
| --- | --- |
| Repository | https://github.com/wenzekan80-gif/iep-reality-check |
| Final AI production | https://iep-reality-check.vercel.app |
| Stable immutable deployment | https://iep-reality-check-natjiaqw6-kazz5.vercel.app |
| Local AI preview | http://127.0.0.1:3143/ (not public) |
| AI immutable deployment | https://iep-reality-check-kuchquimx-kazz5.vercel.app (platform protected; use public main URL) |
| Devpost | https://devpost.com/software/iep-reality-check (SUBMITTED to LexHack 2026) |
| Public video | https://youtu.be/j-oMMVlKwPk (Unlisted, anyone with link) |
