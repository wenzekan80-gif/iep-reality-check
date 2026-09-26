# Feature Truth Table

Audit date: 2026-09-27 (Asia/Shanghai). Owner: C, release integration.

Code baseline / B tested commit: `dfeb36908973fd9c2c5cb0c290a0a685d8f9dfbc`.
Stable rollback tag: `pre-ai-stable-dfeb369`.
Release branch: `release/lexhack-stable-20260927`.

Reviewed documentation base (HEAD at B's recheck): `1f64522a45021258ff8be7405466145391bdf9a7`. The product remains the exact frozen baseline. Test/build/browser rows below retain the release-run acceptance; this documentation refresh and B's read-only recheck do not rerun that acceptance.

Status vocabulary is restricted to VERIFIED, IN DEVELOPMENT, BLOCKED, NOT IMPLEMENTED, NOT CLAIMED. VERIFIED is limited to the scope and evidence written in that row; local verification is never a claim of public production verification. D/E may reference only VERIFIED capabilities and must preserve these limitations.

| Capability | Status | Evidence / scope |
| --- | --- | --- |
| Recoverable synthetic baseline | VERIFIED | Clean original master at the full baseline SHA; git fsck succeeded; annotated stable tag resolves to that commit; separate release worktree. |
| Deterministic reconciliation | VERIFIED | Current B run: 55/55 tests at baseline, including domain and fixture checks; logs in outputs/release-evidence/b-tests.log. |
| Ethan initial numbers | VERIFIED | Current tests: 12 reference sessions / 360 reference minutes; 10 documented / 300 minutes; 1 explained; 1 unresolved; 2 meeting questions. |
| Ethan late-record recalculation | VERIFIED | Current tests: 11 documented / 330 minutes; 1 explained; 0 unresolved; 1 meeting question. Evidence identity/reimport checks pass. |
| Human plan confirmation and edited values | VERIFIED | Current React interaction tests cover explicit confirmation, unsure flow, edited details and changed engine input. Browser verification tracked separately below. |
| Timeline, source drawer, meeting preparation | VERIFIED | Current React interaction tests cover distinct findings, actual source blocks/row metadata, focus restoration and independent questions. Browser verification tracked separately below. |
| Homepage story and reduced-motion behavior | VERIFIED | Current 7 homepage tests pass. This row does not claim a new mobile visual acceptance run. |
| Browser print invocation | VERIFIED | Current interaction test invokes browser printing. Native printed pagination/PDF export is not verified. |
| TypeScript checking | VERIFIED | Current npm run typecheck exit 0 at baseline. |
| Local production build and real-browser workflow | VERIFIED | Current build exit 0; C completed home, Ethan, original source, confirmation, timeline, meeting, late record and recalculation at http://127.0.0.1:3137. Browser warning/error log empty. |
| Public stable synthetic demo | VERIFIED | https://iep-reality-check.vercel.app ; B completed the entire production browser chain on deployed source dfeb369, deployment dpl_DJM1HkdMUs8Qd58nUu5FgyFx9nkF. Before 10/300/1/1/2; after 11/330/1/0/1. |
| Public GitHub repository | VERIFIED | https://github.com/wenzekan80-gif/iep-reality-check ; main resolves to dfeb369; full 9-commit history and stable tags pushed; anonymous browser displays source and README with Sign in link. |
| Anonymous production access | VERIFIED | B observed a browser main-document request with no Cookie, Authorization or Vercel bypass header, followed by full interaction acceptance; not merely HTTP 200. |
| Bounded credential exposure checks | VERIFIED | 38 tracked files, 52 historical blobs/9 commits, 12 client artifacts and QA logs passed B's documented pattern scan. Server-generated Next preview material was not in source/client/logs. This is not a universal security certification. |
| Production model/API environment | VERIFIED | C refreshed vercel env ls production at 2026-09-27T03:10:12.6402648+08:00: exit 0, no vars for project iep-reality-check / scope kazz5. Receipt: outputs/release-evidence/c-vercel-env-recheck.json; B inspected it. No external model API used. Local OIDC .env.local was excluded from the upload manifest. |
| Natural-language AI extraction | NOT IMPLEMENTED | No model SDK, extraction implementation or API endpoint in baseline; no A delivery commit received. |
| AI quote verification and AI excerpt to confirmation to engine | NOT IMPLEMENTED | Existing fixture provenance tests are not AI extraction/source-quote verification. |
| Online live AI | NOT IMPLEMENTED | No deployment or real API call. No recorded/fixture output may be described as live AI. |
| Public AI request protections | NOT IMPLEMENTED | No AI endpoint exists. Whitelisted synthetic inputs, length limit and rate/budget protection or kill switch are required before adding one. |
| Static-export configuration | NOT IMPLEMENTED | next.config.ts has devIndicators: false only; no output: export. Prerendered route output does not mean static-export mode. |
| Server API routes | NOT IMPLEMENTED | Baseline has page/layout but no route.ts API handlers. Any later AI route requires a runtime-capable host. |
| PDF/OCR, arbitrary document upload, database, authentication | NOT IMPLEMENTED | Explicit README boundaries, source inspection. Browser print is not PDF generation. |
| Real-family validation, measured accuracy/time savings | NOT CLAIMED | No study or measured evidence supplied. |
| FERPA compliance, legal violation or owed-minutes determination | NOT CLAIMED | No compliance certification or legal determination supported. |
| Saved Devpost title, pitch, story, tags and project links | VERIFIED | C saved the title/pitch/story, 11 Built With tags, and actual live/repo URLs. Saved rendered preview and progress evidence: c-devpost-copy-preview.png/.txt and c-devpost-progress-3of4.png/.txt. Seven story sections appear once; synthetic/no-runtime-AI wording and incomplete-disclosure caveat remain. This is saved-draft verification only. |
| Submitted competition entry | BLOCKED | https://devpost.com/software/iep-reality-check is IEP Reality Check / Draft / 3/4 steps; preview explicitly says INCOMPLETE SUBMISSION. Terms checkbox and Submit untouched. No Submitted confirmation. |
| Complete real team and contributor tool/API disclosure | BLOCKED | Creator wenzekan80-gif 阚 observed; complete real-team and earlier tool/API roster pending user reply. Codex development/release assistance is disclosed, with the limitation stated. Saved tags or a checked platform team step do not prove completeness. |
| Media-tool disclosure saved | VERIFIED | E handoff and scripts identify Python/Pillow/imageio-ffmpeg/FFmpeg for media preparation, plus OpenCV/NumPy for verification. C saved the disclosure to Devpost and observed it in the rendered preview; c-devpost-media-disclosure.txt. These are distinct from application runtime technologies. |
| Student eligibility and original hack-period work | BLOCKED | User confirmation pending. In-window Git timestamps do not independently establish eligibility or authorship. |
| Local recorded walkthrough artifact | VERIFIED | E's outputs/submission-video/E_VIDEO_HANDOFF.md and video-verification.json report local PASS: 148.000 seconds, 1920 × 1080 H.264, silent English captions, full decode exit 0. C accepted after script/receipt/decoded-contact-sheet review; B independently accepted local material in B_RELEASE_RECHECK.md. Screenshot montage labeled recorded/synthetic/no live AI; no continuous capture or hosted playback is implied. |
| Public video, at most 3 minutes | BLOCKED | VIDEO URL: NOT CREATED; no upload or anonymous hosted-playback proof. C observed official rules requiring <= 3 minutes on YouTube, Vimeo or Loom. Logged-in YouTube channel access is not a video deliverable. |

## URL register

`NOT CREATED` means no project-specific artifact/link has been established in this audit; it is not proof that an inaccessible account contains no old project. Platform home/login pages and local loopback URLs are not deliverable URLs.

| Deliverable | Actual URL | Evidence |
| --- | --- | --- |
| GitHub project | https://github.com/wenzekan80-gif/iep-reality-check | Public; anonymous source/README read; main and stable tags verified by git ls-remote. |
| Vercel / production | https://iep-reality-check.vercel.app | READY, production, alias assigned; B anonymous browser smoke passed. |
| Vercel immutable deployment | https://iep-reality-check-ex6t5vtwf-kazz5.vercel.app | Deployment dpl_DJM1HkdMUs8Qd58nUu5FgyFx9nkF; source dfeb369 via git archive. |
| Devpost project preview | https://devpost.com/software/iep-reality-check | Saved title/pitch/story/11 tags/live and repo links verified in rendered preview; INCOMPLETE SUBMISSION. Anonymous preview visibility is not claimed. |
| Devpost finalization | https://devpost.com/submit-to/31018-lexhack-2026/manage/submissions/1182313-iep-reality-check/finalization | IEP Reality Check / Draft / 3/4 steps done; terms and Submit untouched. |
| Video | NOT CREATED | E local MP4 is 148.000 seconds; public hosting and anonymous playback remain open. |

Archived intake only: https://devpost.com/software/1428491 was inspected as Untitled / DRAFT / 1/4 with empty fields. That earlier state in c-devpost-draft/empty-details evidence is superseded by the saved-draft state above.

Official requirement/schedule context reported by C: [rules](https://lexhack-2026.devpost.com/rules) require <= 3 minutes on YouTube, Vimeo or Loom; [schedule](https://lexhack-2026.devpost.com/details/dates) shows September 11, 2026 12:00 through September 28, 2026 05:00 GMT+8 (saved c-devpost-schedule.txt). Product commit timestamps are September 19, within the observed window, but do not independently prove authorship or full eligibility.

## Collaboration contract

C is the only integrator and does not implement AI. A must work from the stable commit on an independent feature worktree and deliver an exact commit. C will review that commit only after delivery. B tests exact commits and does not repair product logic. D/E use this file's VERIFIED scope only. No AI commit has been merged. Current product files are unchanged from the stable baseline.

Feature freeze triggered at 2026-09-27 02:57 Asia/Shanghai for the stable synthetic product, tag `lexhack-stable-dfeb369`. AI is not included. After freeze, only crash, wrong-number, provenance, secret, access, video or submission blockers may be fixed. The user requested parchment/scroll styling only after the current work is finished; that visual change is deferred and not part of this release.
