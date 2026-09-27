# Final saved Devpost story

Saved and submitted 2026-09-28. Project: https://devpost.com/software/iep-reality-check . Video: https://youtu.be/j-oMMVlKwPk . This supersedes the historical synthetic-only copy.

## Inspiration

The idea grew out of my own practical experience. I am grateful to 星星点灯公益服务 for helping me understand the real circumstances of children in special education. That experience motivated a question: how can a parent turn an Individualized Education Program (IEP) and scattered service records into a clearer meeting conversation?

I wanted the tool to preserve uncertainty instead of converting missing documentation into an accusation. Ethan, his plan, and every demonstration record are fictional; no real child's case is presented.

## What it does

IEP Reality Check combines a notebook-style review with an optional DeepSeek extraction step. Its public AI mode accepts exactly two approved synthetic speech-service excerpts. DeepSeek proposes a service name, weekly frequency, session duration, a verbatim supporting quote, and a review flag.

The server validates the response and checks that the quote is an exact contiguous substring supporting each non-null value. Missing values stay null; unsupported evidence is rejected rather than turned into guesses. A vague “as appropriate” example therefore requires review. The interface highlights the source and preserves original AI values separately from human edits.

Explicit human confirmation and fictional-scope selection are required before comparison. Only the approved clear excerpt can enter Ethan's six-week record review. A deterministic engine then produces the timeline, source-linked findings, and meeting questions.

Against a reference of 12 sessions and 360 minutes, Ethan initially shows 10 documented sessions, 300 documented minutes, 1 explained event, 1 unresolved finding, and 2 questions. Adding the existing September 18 fixture changes those figures to 11 / 330 / 1 / 0 / 1. The missing-record question resolves; the cancellation make-up question remains.

This prototype does not accept real student data, arbitrary uploads, or PDF/OCR input, and makes no legal or owed-minutes determination. An unresolved finding is a question about the supplied evidence, not proof that a service did not occur.

## How I built it

The application uses Next.js, React/React DOM, TypeScript, Tailwind CSS/PostCSS, Zod, and Node.js/npm. A server-side route calls DeepSeek through native fetch, with the key kept on the server. Schema and evidence checks run after the model response. The comparison engine remains unchanged: the model proposes fields; confirmed inputs enter deterministic reconciliation. The original Ethan flow also works without AI.

Vitest, Testing Library, and jsdom support verification; Git/GitHub support version control, and Vercel is the deployment platform. The notebook uses the Caveat font under its SIL Open Font License.

I am the sole human contributor, wenzekan80-gif, and completed this work during this hackathon. My AI development tools were OpenAI Codex and ChatGPT; DeepSeek supplies runtime extraction. Codex subagents assisted development and review as software tools, not human teammates. Media preparation uses Python, Pillow, OpenCV, NumPy, FFmpeg through imageio-ffmpeg, and local Windows SAPI/Microsoft Zira Desktop English speech synthesis; the demo video is an edited recording of actual production-browser frames, with English synthesized narration and captions.

## Challenges I ran into

The difficult boundary was preventing plausible model output from becoming an unsupported comparison. Exact quotes alone were insufficient: quoted text also had to support the proposed numbers. Unknown values, unsupported wording, stale responses, and an explicit Needs review hold must stop progression.

Human corrections needed their own provenance without overwriting the model's original proposal. I also kept findings separate from questions: an explained cancellation can still deserve a follow-up.

## Accomplishments I'm proud of

The accepted candidate passed 156 automated tests, TypeScript checking, and a production build. Separate local and anonymous production browser checks verified genuine DeepSeek responses: a clear 2-times-weekly, 30-minute prescription and a vague response with null frequency and duration.

Those checks also covered source highlighting, review holds, human edits, confirmation, reconciliation, late evidence, and the original non-AI fallback. These are bounded implementation checks, not a general extraction-accuracy benchmark or a family-outcomes study.

## What I learned

Trustworthy assistance depends on boundaries as much as extraction. A model can help locate a candidate answer, while explicit source evidence and human confirmation determine whether that answer can be used. Keeping reconciliation independent makes changes in the evidence easier to explain.

I prepared 24 synthetic reference examples with a fixed 18-development/6-heldout split. Their integrity checks passed, but the full set has not been evaluated on a model. Adaption-compatible exports are preparation only: Adaption Labs was not used or integrated, and no optimization results are claimed.

## What's next for IEP Reality Check

Next comes independent evaluation on the heldout examples and review of the error cases before expanding beyond the two approved excerpts. Broader service support, real-world validation, and distributed usage controls remain future work. The immediate goal is a small, inspectable workflow whose questions change honestly when its evidence changes.
