# C Release Report — final published DeepSeek demo

Updated 2026-09-28 (Asia/Shanghai). **Production VERIFIED; video published; Devpost SUBMITTED.** The final browser confirmation at 03:30 was “Project submitted!”, and the project sidebar changed to “Submitted to LexHack 2026”. This supersedes the earlier local-only release report.

## Version facts and freeze

- Base candidate: `ff3c520b2642cc695a29ca28f00d7467703d0610`.
- Frozen product: **`b2bc2d982730676280bfc844f848ab8f4986d128`**. Pushed annotated tag: `iep-deepseek-final-b2bc2d9`.
- A delivered `2cffc2b9e9bcf725c340833ee0fa8329e7c7899d` and `d4788c5ea0240fe097a74e55402ee819886bc272`; C integrated explicit deliveries, and B tested the resulting product. Offline data commits: `9a8f498`, `4869e20`.
- Release checkout: `D:\IEP-Reality-Check-ai-release`; branch: `release/iep-ai-candidate-20260927`. GitHub main was advanced to `c1a7f5fdeac18bd6020028c2f564f4231fc9cd0b`, containing the accepted product and local-acceptance docs. This final closeout adds documentation only; the current Git commit identifies those documents.
- Recovery tag `pre-ai-stable-7f1d609` retains stable record `7f1d6091bc45213d3815a39b8fe19e8bb3c6f402` / Notebook product `c5f73006acc10a3588a1051ef1d891e51575c186`.
- A developed separately; C made no product changes during this publication round. No architecture, domain, fixture, UI, dependency or `reconcile()` refactor was introduced. D/E claims were constrained by the truth table.

**Feature freeze is active.** Only crashes, incorrect numbers, provenance, credentials, accessibility of the release, or video/submission blockers justify a release fix. Visual redesign and new features are deferred.

## Actual URLs

| Deliverable | URL |
| --- | --- |
| Public production | https://iep-reality-check.vercel.app |
| Public repository | https://github.com/wenzekan80-gif/iep-reality-check |
| Final video | https://youtu.be/j-oMMVlKwPk |
| Submitted project | https://devpost.com/software/iep-reality-check |
| Current immutable deployment | https://iep-reality-check-kuchquimx-kazz5.vercel.app |

The immutable/account aliases are platform-protected or network-limited in this environment; the main production URL is the verified anonymous entry. No deployment protection was disabled.

## Build, deployment and security

B's exact-product acceptance: **npm test 156/156 across 10 files; npm run typecheck PASS; npm run build PASS**. These gates were not redundantly rerun for media/documentation changes. The remote Vercel build also passed. Next configuration has no static export; both extraction routes are dynamic Node endpoints. See `B_DEEPSEEK_ACCEPTANCE.md`.

C configured Vercel production `DEEPSEEK_API_KEY` as a secret, `IEP_AI_ENABLED=true`, and `DEEPSEEK_MODEL=deepseek-flash`. The existing key went through CLI stdin; it was not printed, saved in a source/env file, committed, or shown in a screenshot. Official Vercel CLI also generated its own deployment-protection bypass credential for CLI inspection; its value was neither read nor published.

Deployment **`dpl_GDRYoZqvvhJcqkUC9gUmnFMxo8An`** reached READY and was promoted to the main domain after a real clear extraction succeeded. Source archive: 62 product/configuration files; SHA256 `af32293115b534ccc84b94071a3502404208673ca93894a9cbf0cdfbc281a546`. B compared it against the frozen tag: no content mismatch after CRLF normalization and no missing runtime files. Previous stable deployment **`dpl_E7SXHAABKudWHarsT4Ur73MtQPLk`** remains the rollback target.

The API uses DeepSeek server-side, existing Zod, exactly five success fields and a mandatory nonempty verbatim source quote. Unknown fields stay null; evidence must support every non-null value. A candidate requires human review and explicit fictional scope before unchanged reconciliation. `What this means` is a deterministic reading aid, not legal interpretation or another model call. `/api/iep/extract` remains a compatibility alias.

Public protection: two exact synthetic examples; synthetic flag; 2,400 characters / 12,000 request bytes / 1,000 output tokens / 32 KiB provider output / 15-second timeout / no retries; two concurrent and six-per-minute calls per process; explicit off switch. This is **not a distributed or hard global spending limit**. C anonymously scanned all seven deployed client scripts: zero actual-key and secret-pattern matches. Unsupported input returned 422; cross-origin input returned 403. These are bounded checks, not a security certification.

## Actual production browser acceptance

C used the public production URL in Chrome, including genuine provider responses. B independently checked anonymous application/repository access, public refs, deployment/source identity and C's receipts; B did not repeat paid calls or claim a second browser run. See `B_FINAL_PUBLIC_RECHECK.md`.

| Step | Observed result |
| --- | --- |
| Home / approved clear extraction | Real HTTP 200: Speech-Language Therapy / 2 / 30 / exact full sentence quote / needsReview=false |
| Human gate | Exact source highlight and candidate card; Confirm and forward controls locked until fictional scope was selected |
| Confirm → timeline | 10 documented / 300 minutes / 1 explained / 1 unresolved |
| Source drawer | Original source and separate AI/human-confirmation provenance present |
| Meeting prep | Two evidence-based questions |
| Add September 18 record → recompute | 11 documented / 330 minutes / 1 explained / 0 unresolved; one make-up question remains |
| Vague extraction | Real HTTP 200: Speech-Language Therapy / null / null / exact “speech services as appropriate” quote / needsReview=true; Confirm/Edit/forward blocked |
| Original Ethan fallback | Original plan → confirmation → 300-to-330 late-record flow without another API call |

The earlier local acceptance additionally covered Needs review holds and numeric edits with separate human provenance. Production logs contained zero application warnings/errors and one historical Google GSI/FedCM warning from an earlier Vercel login page. HTTP 200 alone was not treated as workflow acceptance. Real calls on two example types do not establish general model accuracy or availability.

## Video and submission

E assembled C's ten actual timestamped production-browser recordings at 1x speed, with scene cuts, English captions and local Microsoft Zira synthesized narration. It is an edited browser recording, not an uncut take. No invented UI or stored fake provider response was used.

- Final MP4: `outputs/final-video/iep-reality-check-real-ai-walkthrough.mp4`.
- Exact local duration: **144.500 seconds (2:24.5)**; 1920×1080, 24 fps, H.264/yuv420p + AAC; 11,903,908 bytes.
- SHA256: `2e0ee90953bc34e498710c3df3ecbc6ac805d64b3104341a850fb33b76ea6521`.
- Complete decode: zero errors. All ten encoded voice segments were non-silent, matched original narration, and had zero clipped samples. E and C reviewed the decoded contact sheet.
- Uploaded to channel `skykkk` as **Unlisted**; YouTube explicitly states anyone with the link can watch. The public oEmbed endpoint returned the correct title/channel without credentials. Actual Chrome watch playback advanced through 52.93 seconds and reached 2:24, with media duration 144.521 seconds. Devpost renders the correct YouTube player. This combines public-access metadata with actual playback; a separate signed-out-browser playback session was not completed. Initial platform copyright processing was still pending when publication succeeded; no copyright claim was observed.

The user confirmed sole human contributor `wenzekan80-gif`, eligible student status, hack-period work, and no other AI development tools/APIs beyond Codex/ChatGPT and DeepSeek. Eligibility and creation-period statements are contributor declarations, not independently audited credentials. The current Devpost roster contains the one real contributor. The project story discloses frameworks, testing/deployment tools, font license, Codex subagents as software tools, DeepSeek runtime, and all media tools. Inspiration is attributed to the user's practice with thanks to **星星点灯公益服务**, without invented endorsement or real-child data.

At action time, the user explicitly accepted the YouTube/Devpost/LexHack terms and authorized upload and final submission. C saved the actual video URL, cover and disclosure, then checked the official-rules/terms box and submitted. **Devpost confirmed “Project submitted!” at 2026-09-28 03:30 Asia/Shanghai**, before the stated 05:00 deadline; the sidebar changed from incomplete draft to Submitted to LexHack 2026.

## Limits and retained evidence

24 manually authored synthetic references, fixed 18-development/6-heldout split and import-ready exports passed quote/schema/split integrity checks. **Adaption Labs was not used; optimization and full 24-row model evaluation were NOT RUN.** Wider examples are challenge references, not demonstrated runtime support. Real student intake, PDF/OCR, other-service/multi-service parsing, email/record extraction, legal conclusions and measured family outcomes remain unimplemented or unclaimed. Mobile/native printing were not repeated this round.

Local ignored evidence: `outputs/final-release/` contains production receipts, DOM/screenshots, source/client checks, B recheck, deployment/promotion logs, anonymous oEmbed, saved story, `submission-confirmation.json`, and `devpost-submitted.png/.txt`. `outputs/final-video/` retains originals, manifests, final MP4, captions, voice, hash/decode/audio checks, cover and E handoff. Prior local provider evidence is in `outputs/deepseek-release/`. Historical reports remain dated evidence rather than current release instructions.

## Handoff

```text
TASK: Record the accepted DeepSeek demo and publish the final LexHack entry
STATUS: Production VERIFIED; video published; Devpost SUBMITTED; feature freeze active
BASE COMMIT: ff3c520b2642cc695a29ca28f00d7467703d0610
FINAL RELEASE COMMIT: b2bc2d982730676280bfc844f848ab8f4986d128 (frozen product; subsequent commits are release documentation)
LIVE URL: https://iep-reality-check.vercel.app
REPO URL: https://github.com/wenzekan80-gif/iep-reality-check
VIDEO URL: https://youtu.be/j-oMMVlKwPk
ACTUALLY VERIFIED: B 156 tests/typecheck/build; C real production clear/vague and full engine/source/meeting/late-record/fallback browser flow; anonymous app/repo; public video metadata and browser playback; actual Devpost confirmation
NOT VERIFIED: Dataset-wide model accuracy; Adaption optimization; independent eligibility audit; separate signed-out-browser video playback; final platform copyright processing outcome
KNOWN ISSUES: Two-example public allowlist; narrow speech verifier; limiter is per process; no general IEP intake
SUBMISSION STATUS: SUBMITTED — Project submitted! / Submitted to LexHack 2026
NEXT ACTION: Retain freeze and evidence; no additional features or visual changes in this release
```
