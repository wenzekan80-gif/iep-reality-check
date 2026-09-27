# Final published release handoff

Updated 2026-09-28. **Submission is complete.** Devpost showed “Project submitted!” at 03:30 Asia/Shanghai and “Submitted to LexHack 2026”. Do not repeat submission or restart old approval flows.

```text
TASK: Record and publish the final accepted DeepSeek demo
STATUS: Production VERIFIED; video published; Devpost SUBMITTED; frozen
BASE COMMIT: ff3c520b2642cc695a29ca28f00d7467703d0610
FINAL RELEASE COMMIT: b2bc2d982730676280bfc844f848ab8f4986d128 (product; later commits contain release docs)
LIVE URL: https://iep-reality-check.vercel.app
REPO URL: https://github.com/wenzekan80-gif/iep-reality-check
VIDEO URL: https://youtu.be/j-oMMVlKwPk
ACTUALLY VERIFIED: 156 tests/typecheck/build; production clear/vague provider calls; confirm/engine/timeline/source/meeting/late-record/fallback; public access; actual video playback and Devpost confirmation
NOT VERIFIED: Adaption/model benchmark; separate signed-out-browser playback; final copyright processing outcome; independent eligibility audit
KNOWN ISSUES: Two exact synthetic examples; narrow verifier; per-process rate limits
SUBMISSION STATUS: SUBMITTED to LexHack 2026 — https://devpost.com/software/iep-reality-check
NEXT ACTION: Keep freeze; only fix material release/submission blockers if they appear
```

Worktree `D:\IEP-Reality-Check-ai-release`, branch `release/iep-ai-candidate-20260927`. Read actual HEAD before new work. Product tag `iep-deepseek-final-b2bc2d9`; rollback tag `pre-ai-stable-7f1d609`. Current deployment `dpl_GDRYoZqvvhJcqkUC9gUmnFMxo8An`; rollback `dpl_E7SXHAABKudWHarsT4Ur73MtQPLk`.

Vercel production uses server DEEPSEEK_API_KEY, IEP_AI_ENABLED=true and deepseek-flash; never expose the credential. Existing local server at 127.0.0.1:3143 may still run; inspect port ownership before touching it. Publication did not change product code.

Read C_RELEASE_REPORT.md, FEATURE_TRUTH_TABLE.md and FINAL_RELEASE_CHECKLIST.md. B_FINAL_PUBLIC_RECHECK.md is the dated pre-submission audit. Actual submission evidence is outputs/final-release/submission-confirmation.json and devpost-submitted.png/.txt. Final 144.500-second video, source recordings and QA are under outputs/final-video/. Adaption and full dataset evaluation remain NOT RUN.

User confirmed the sole real member wenzekan80-gif, student/hack-period eligibility, and Codex/ChatGPT/DeepSeek use; thanks to 星星点灯公益服务 is saved in the public story. The user separately authorized terms, YouTube Unlisted upload and final Devpost submit. Broader art changes are deferred; the latest instruction was to submit directly.
