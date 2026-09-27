# Final DeepSeek release notes

Published 2026-09-28. Frozen product **b2bc2d982730676280bfc844f848ab8f4986d128**, tag `iep-deepseek-final-b2bc2d9`. This supersedes earlier local-only candidate notes.

- Live: https://iep-reality-check.vercel.app . Vercel production deployment `dpl_GDRYoZqvvhJcqkUC9gUmnFMxo8An` is READY and promoted.
- `POST /api/extract` uses DeepSeek, existing Zod, five fields and exact supporting quotes. Unknown values are null. Human confirmation precedes unchanged reconciliation; original Ethan fallback remains available.
- B passed 156 tests, typecheck and build. C passed actual local and anonymous production browser chains, including genuine clear/vague responses, sources, meeting prep and late evidence. Local checks also covered human edits/review holds.
- DeepSeek key is in Vercel server secret environment only. Two-example allowlist, length/output/timeout limits, off switch and per-process call gate remain; no distributed budget claim.
- 24 synthetic reference examples and 18/6 split are prepared. Adaption Labs use, optimization and full model evaluation are **NOT RUN**.
- Final recorded video: https://youtu.be/j-oMMVlKwPk — 144.500 seconds, English synthesized narration/captions, edited actual production footage at 1x. Unlisted publication and public metadata verified; browser playback reached the end.
- Devpost: https://devpost.com/software/iep-reality-check — actual **Project submitted!** confirmation at 03:30 Asia/Shanghai. Contributor, tools, runtime/API and media disclosures are saved.
- Rollback tag `pre-ai-stable-7f1d609` and prior deployment `dpl_E7SXHAABKudWHarsT4Ur73MtQPLk` retained. Feature freeze active; no new art/features in this release.

See C_RELEASE_REPORT.md for exact evidence scope, remaining limits and handoff. Earlier agent reports remain historical; do not interpret their pending publication status as current.
