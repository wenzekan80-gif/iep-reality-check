# Devpost submission copy

Prepared 2026-09-27 (Asia/Shanghai). Product scope: frozen commit `dfeb36908973fd9c2c5cb0c290a0a685d8f9dfbc`. Claims checked against `FEATURE_TRUTH_TABLE.md`, `C_RELEASE_REPORT.md`, `README.md`, and `package.json`. Reviewed documentation base (HEAD at B's recheck): `1f64522a45021258ff8be7405466145391bdf9a7`; current submission-document edits build on that base.

This file contains the copy now saved by C to the Devpost draft. C verified the rendered preview after saving the title, pitch, story, 11 Built With tags, and live/repository links. The project remains Draft / 3/4 and explicitly INCOMPLETE SUBMISSION; no final submission is claimed. Pasteable copy begins below; contributor questions and submission checks follow in a separate section.

## Project name

IEP Reality Check

## Elevator pitch

A fictional-data demo that helps parents confirm an IEP service plan, trace supplied records, and prepare meeting questions that update when new evidence appears.

<!-- Pitch length: 162 characters, including spaces and punctuation. -->

## Inspiration

An Individualized Education Program (IEP) describes a service plan. A set of service records tells only part of the story of what is documented. The idea behind IEP Reality Check is to help a parent move between those two views without turning a missing record into a conclusion about what happened.

The project explores a careful sequence: confirm the plan, inspect the available evidence, and prepare specific questions for a meeting. Ethan's story is entirely fictional. It provides a concrete way to demonstrate that sequence without using real student data.

## What it does

IEP Reality Check is an interactive prototype built around fixed synthetic fixtures: one fictional student's service plan and records within an explicitly fictional six-week instructional window.

A parent can review the plan's original source, edit the proposed weekly frequency or session duration, and explicitly confirm the details before comparing records. The review presents a six-week timeline with separate categories for documented sessions, explained events, and items needing clarification. Source drawers show the stored text and available source metadata behind the review. Meeting preparation collects questions and supporting excerpts, with a control that invokes browser printing.

With the original confirmed plan, the reference is 12 sessions and 360 minutes. Initially, the demo shows **10 documented sessions / 300 documented minutes / 1 explained event / 1 unresolved finding / 2 meeting questions**. Adding the preloaded September 18 service record recalculates the result to **11 documented sessions / 330 documented minutes / 1 explained event / 0 unresolved findings / 1 meeting question**. The missing-record question disappears; the cancellation make-up follow-up remains.

An unresolved finding means that the supplied records leave something to clarify. It does not establish that a service failed to occur. This release uses deterministic reconciliation and fixed fictional data. It has no runtime AI, natural-language extraction, OCR, arbitrary document upload, database, or authentication, and it does not make legal or owed-minutes determinations.

## How we built it

The application uses Next.js, React, TypeScript, and Tailwind CSS. Zod validates the domain inputs. A pure TypeScript reconciliation function compares a human-confirmed plan with service records and source blocks; it makes no model calls and uses no network access, clock, or randomness. Fixture candidates are manually transcribed from the synthetic source files rather than extracted by an AI or general document parser.

The engine validates source references and handles uncertainty conservatively. It distinguishes session counts, session duration, and total minutes instead of treating extra minutes as interchangeable with planned sessions. Potential duplicate or conflicting records require review. The interface calls the same engine again when the preloaded late record is added, so the displayed totals and questions follow the updated evidence.

Vitest and Testing Library cover domain behavior, fixture consistency, and interface interactions. The frozen release passed 55 tests, TypeScript checking, and a production build. Release checks also completed the deployed browser workflow, including source review, plan confirmation, meeting preparation, and late-record recalculation. The public demo is hosted on Vercel, and the source is available on GitHub.

## Challenges we ran into

The central design challenge was preserving the difference between missing documentation and a conclusion about service delivery. That distinction had to remain visible in the reconciliation rules, timeline language, sources, and meeting questions.

Another challenge was keeping findings and questions independent. The fictional cancellation is explained by the records but still leaves a make-up question. A newly located record resolves a different question. Linking both views directly to current evidence makes those changes understandable.

Source provenance also required care. A finding about an unmatched planned event cannot cite an invented missing-record excerpt. The prototype instead connects it to the confirmed plan, observation window, and available records. Edited plan values are explicitly identified as human confirmation while the original source remains available.

## Accomplishments that we're proud of

The release delivers a complete, publicly accessible fictional demonstration from plan confirmation to meeting preparation. The before-and-after evidence flow is reproducible: **10/300/1/1/2 → 11/330/1/0/1**, in the order documented sessions, documented minutes, explained events, unresolved findings, and meeting questions.

The prototype makes uncertainty visible, provides inspectable source text, and keeps the remaining follow-up question after new evidence arrives. Its tested reconciliation function and verified public browser workflow provide a concrete foundation for further work. These are prototype and release results; no real-family study, measured accuracy claim, or measured time saving is claimed.

## What we learned

This implementation reinforced the value of separating evidence, reconciliation, and presentation. A human confirmation step makes the comparison's assumptions explicit. Source links let a reader examine why an item appears. Keeping questions separate from findings allows the meeting agenda to reflect what still needs discussion, even after a documentation gap is resolved.

The late-record scenario also illustrates why a summary should be recalculated from current evidence. A useful review must be able to change when the evidence changes while preserving the context of questions that remain open.

## What's next for IEP Reality Check

The next proposed step is a bounded natural-language candidate extraction layer with human confirmation before reconciliation. It is not implemented in this release. Any such extension would need source-quote verification and tests for ambiguous or failed extraction before its outputs could enter the engine.

Broader document support and real-world validation remain future work. The current prototype stays within its fixed fictional case; it does not establish readiness for real student records or claim privacy-law compliance.

## Built with

Next.js, React, TypeScript, Tailwind CSS, Zod, Vitest, Testing Library, npm, Vercel, GitHub.

AI development tool: OpenAI Codex. This is development-tool use, not an application runtime capability.

## AI development-tool disclosure

OpenAI Codex assisted development and release preparation for this project. Codex subagent assistance was also used for release checks and documentation. The deployed prototype does not call an AI model or an external model API: its reconciliation, displayed findings, and meeting questions are deterministic and operate on fixed synthetic fixtures.

This statement identifies the verified Codex use. The complete tool and API roster across all contributors has not yet been confirmed; it should not be read as a complete contributor-level disclosure.

## Project links

- Live demo: https://iep-reality-check.vercel.app
- Source repository: https://github.com/wenzekan80-gif/iep-reality-check

## Demo video preparation

The 148-second demonstration video is a silent, English-captioned, screenshot-based recorded walkthrough of the accepted synthetic demo. Python and Pillow were used to compose the frames; FFmpeg, supplied through imageio-ffmpeg, encoded the MP4. OpenCV and NumPy supported media verification. These tools were used to prepare and check the submission video; they are not part of the application runtime stack. The video is labeled “Recorded walkthrough • synthetic data • no live AI.”

---

# Internal handoff — do not paste as project story

## Supplemental media disclosure — saved and verified

The 148-second demonstration video is a silent, English-captioned, screenshot-based recorded walkthrough of the accepted synthetic demo. Python and Pillow were used to compose the frames; FFmpeg, supplied through imageio-ffmpeg, encoded the MP4. OpenCV and NumPy supported media verification. These tools were used to prepare and check the submission video; they are not part of the application's runtime stack. The video is labeled “Recorded walkthrough • synthetic data • no live AI.”

Evidence for this supplemental paragraph: outputs/submission-video/E_VIDEO_HANDOFF.md, build_walkthrough.py, verify_walkthrough.py, and video-verification.json. Local video path: `D:\IEP-Reality-Check-release\outputs\submission-video\iep-reality-check-recorded-walkthrough.mp4`. Public video URL remains NOT CREATED. C saved the paragraph under Demo video preparation and verified the rendered preview; c-devpost-media-disclosure.txt records this later saved state.

## Contributor questions

1. Who are the actual human contributors, and what did each contribute? The observed Devpost creator is `wenzekan80-gif` (displayed name: 阚); the inspected additional-teammate list was empty. A Git author named Codex is not evidence of a human teammate.
2. For each contributor, which AI tools, models, coding assistants, APIs, and other external services were used, and for which tasks? Codex development/release assistance is verified; the complete roster is unconfirmed. Confirm any earlier usage before treating the disclosure as complete.
3. Does the confirmed contributor roster require Devpost team entries or a fuller attribution statement? Keep any unconfirmed names or claims out of the public copy.

Other pending user confirmations, kept outside the submission story: permission to upload the 148-second video as unlisted to the logged-in skykkk YouTube channel and use the screenshots in Devpost; student eligibility; and original work during the hack period. Do not infer these confirmations from elapsed time, Git timestamps, channel access, or the 3/4 draft indicator.

## Submission checks and limits

- Current project preview: https://devpost.com/software/iep-reality-check . C saved the title, pitch, story, 11 Built With tags, and actual live/repository links. Rendered preview and finalization show IEP Reality Check / Draft / 3/4 and INCOMPLETE SUBMISSION. Evidence: c-devpost-progress-3of4.png/.txt and c-devpost-copy-preview.png/.txt; the seven story sections appear once.
- Current finalization: https://devpost.com/submit-to/31018-lexhack-2026/manage/submissions/1182313-iep-reality-check/finalization . Terms and Submit remain untouched. D's work is documentation only; C performed the saved-field UI actions.
- Archived intake only: the former preview URL https://devpost.com/software/1428491 was Untitled / DRAFT / 1/4 with empty fields. Those earlier observations are superseded by the saved-draft state above.
- Saved native tags: github, next.js, npm, openai-codex, react, tailwindcss, testing-library, typescript, vercel, vitest, zod. The known Codex disclosure is in the saved story, but the complete real-team/prior-tool roster remains pending the user's reply.
- E's local video now has a PASS receipt at 148.000 seconds (2:28): a silent, English-captioned, screenshot-based walkthrough labeled recorded / synthetic / no live AI. See outputs/submission-video/E_VIDEO_HANDOFF.md and video-verification.json. C accepted it after reviewing the script, receipt and decoded contact sheet; B independently accepted local material within its documented scope. User upload confirmation, public hosting/playback and Devpost embed remain open. Public video URL: NOT CREATED; no upload was performed at this checkpoint.
- C observed the [official video requirement](https://lexhack-2026.devpost.com/rules): no more than three minutes on YouTube, Vimeo or Loom. Add only the actual uploaded video URL after checking anonymous playback; channel access or a platform homepage is not a deliverable link.
- The [official schedule](https://lexhack-2026.devpost.com/details/dates), saved in c-devpost-schedule.txt, shows submissions from September 11, 2026 12:00 to September 28, 2026 05:00 GMT+8. September 19 product Git timestamps fall within it but do not independently prove authorship or full eligibility.
- The AI disclosure is transparent about its current limitation. Resolve the contributor questions and update that paragraph before representing it as a complete final disclosure.
- The exact numeric transition is `10/300/1/1/2 -> 11/330/1/0/1`. Order: documented sessions / documented minutes / explained events / unresolved findings / open meeting questions. Both states use the same 12-session / 360-minute reference plan.
- Browser printing is verified as an invocation. Native pagination and generated PDF output are not verified and are not claimed in this copy.
- Release evidence supports the frozen synthetic product only. Do not add runtime AI, upload/OCR, measured family outcomes, legal determinations, or compliance claims to the submission.
- No product/source files or Git references were changed by this documentation task.
