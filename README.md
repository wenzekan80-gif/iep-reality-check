# IEP Reality Check

Understand a confirmed IEP service plan, check supplied records, and prepare questions for a meeting.

**FICTIONAL DEMO CASE — NO REAL STUDENT DATA**

This prototype uses fictional data for demonstration. The demo uses a **Fictional six-week instructional window**, not a real school calendar.

## Current scope

The notebook demo takes a parent through the plan, confirmation, six-week records, source excerpts, meeting questions, and a newly found record. A separate opt-in AI flow uses a server-side DeepSeek model to propose a service, weekly frequency, minutes per session and an exact supporting quote from approved synthetic excerpts. Human review and scope confirmation are required before the unchanged reconciliation engine runs. The original Ethan demo remains available without AI. No PDF parsing/generation, database, authentication, analytics or real student submissions are supported.

AI is **off by default**. A has not made a live DeepSeek call for this delivery. Automated tests use an explicitly mocked provider/transport; they are not evidence of a successful live model call. Server configuration and live acceptance are separate from the code checks.

## Commands

Requires Node.js 24 and npm.

```sh
npm ci
npm test
npm run typecheck
npm run build
npm run dev
```

`npm start` serves the production build after `npm run build`.

## Domain and engine

- `src/domain/schemas.ts`: Zod schemas. `types.ts` derives the six core types directly from the schemas: SourceBlock, PlanVersion, ServicePrescription, ServiceRecord, Finding, MeetingQuestion. Also defines ObservationWindow, input, weekly summaries and result.
- `src/domain/reconcile.ts`: pure `reconcile(input)` function. Pass a human-confirmed prescription, relevant plan version, records, explicitly enumerated fictional weeks, and source blocks. No network, I/O, model calls, clock, or randomness inside the engine.
- `src/test/fixtures/cases.ts` and `src/domain/reconcile.test.ts`: unit scenarios.
- `fixtures/ethan/`: original synthetic TXT and CSV files.
- `src/fixtures/ethan.ts`: Node-only fixture loader with manually transcribed candidates. This is not a general CSV or natural-language parser. The CSV has a one-line fictional disclaimer before its header. Import adapters must deliberately handle that preamble.
- `src/fixtures/ethan.test.ts`: source-file consistency, provenance, and evidence-update integration tests.

The engine first validates input and provenance. An unclear frequency, duration, plan version, or effective period returns `not_comparable` with null expectations. Invalid schema values or broken source references throw rather than producing results from corrupt input. A record with an unclear service/date or outside-window date blocks comparison pending scope review.

It then suppresses only exact record payload reimports sharing a SourceBlock identity (record import IDs may differ). Different sources describing the same service on the same date, reused identities with different payloads, or excess events trigger `conflict`. Candidates remain in the caller's input; the affected week's totals are null and its records contribute to `pendingReviewRecords`. No unresolved event is inferred within that week.

For reliable weeks, each completed record becomes `documented`; cancellation or student absence becomes `explained`. Remaining planned event counts become `unresolved`, never a claim about whether service occurred. Counts, per-session duration, and total minutes are evaluated separately. No exact scheduled day is invented from weekly frequency. A 60-minute session cannot occupy two 30-minute event slots.

`summary.documentedSessions` and `documentedMinutes` count only reliably comparable weeks. Always inspect `comparisonComplete` and `pendingReviewRecords` before presenting these as a complete summary. `perSessionDurationConsistent` is null when there are no comparable completed sessions or uncertainty prevents an overall positive determination; a known mismatch is false. `fullMatch` describes the supplied record structure only, not a legal conclusion. Any explained event prevents fullMatch.

MeetingQuestion is independent of Finding. Questions are regenerated from current evidence. A located record removes its question; a cancellation follow-up retains its stable ID. The current function does not persist user-resolved meeting-question state.

## Provenance contract

`PlanVersion.sourceId` names an existing source document; `sourceBlockId` references its exact extracted block. TXT fixture blocks hold the complete original text, without page or row claims. CSV blocks hold the exact row and actual 1-based physical line. Every finding and question has validated source references; an unresolved finding references the confirmed plan, window and available records for that week, not an invented missing-record quote.

SourceBlock IDs must remain stable across reimports. Import adapters are responsible for retaining the same source identity. Re-uploading identical text under a new identity is conservatively treated as a potential duplicate requiring review.

## Expected Ethan results

| State | Reference sessions / minutes | Documented sessions / minutes | Explained | Unresolved findings | Open meeting questions |
| --- | --- | --- | --- | --- | --- |
| Initial | 12 / 360 | 10 / 300 | 1 | 1 | 2 |
| With Sep18_Speech_Record | 12 / 360 | 11 / 330 | 1 | 0 | 1 |

The cancellation context describes the same September 23 cancellation; it is supporting evidence, not a second event. The initial file has no placeholder service record for September 18: the unresolved event is derived by the engine. Weeks and all student information are fictional.

## Explicit boundaries

One confirmed service, one version covering the entire observation window, full fictional Monday–Friday weeks, integer minutes, and weekly frequency only. No amendments, real school calendar inference, closure-to-session allocation, cross-week make-up matching, or ambiguous service aliases. Different sessions on the same day require review until a later phase introduces trustworthy session identity or human disambiguation. Multi-version or partial effective coverage returns not_comparable. There is no raw upload/parse-failure flow yet; a future adapter must never replace failed parsing with an apparently valid empty record array.

No PDF, legal determination or real student data support is included. AI output is a candidate, never a determination about service delivery. Unsupported wording is held for review. Only the approved clear Ethan speech excerpt can be confirmed against Ethan's records; custom local excerpts are extraction-only. The existing synthetic comparison scope and dates are explicitly selected by the reviewer, never invented or extracted by the model.

## Phase 3 UI architecture

`src/app/page.tsx` reads the existing fictional files on the server. It passes serializable data into `src/ui/DemoApp.tsx`. The UI calls `POST /api/extract`; the older `/api/iep/extract` path remains a compatibility alias with the same flat response and DeepSeek-only provider. All navigation and demo evidence are held in React memory. Refreshing starts again; returning to the plan revokes confirmation, and leaving the AI plan discards the candidate and aborts pending browser requests.

- `PlanStep`: plain-language plan, original source, editable frequency/duration, and explicit confirmation. “I'm not sure” keeps the parent on the plan without running the comparison.
- `ReviewStep`: engine-derived summary, clickable six-week events, selected finding and its question. It respects incomplete comparisons and does not render a score.
- `SourceDrawer`: native modal dialog, Escape dismissal, return focus, and exact SourceBlock text. Missing references throw. Source metadata is never synthesized by the viewer.
- `MeetingStep`: plan/records/clarifications, independent questions, supporting sources and browser printing. Print CSS hides controls and includes exact source excerpts.
- `LateRecordAction`: adds the existing September 18 fixture once. `DemoApp` calls the unchanged engine again, replaces the displayed result, selects the newly documented event and announces the resolved question.
- `demo-data.ts`: UI adapters only. Edited plan values are recorded as an explicitly labelled human confirmation SourceBlock; original files remain intact. The original source button always opens the original IEP. The adapter does not parse free text or calculate results.
- `DemoApp.test.tsx`: actual React interaction tests using jsdom and Testing Library. The original 37 tests remain unchanged. The new tests cover initial/updated counts, separate question counts, source text, focus return, confirmation, editing, restart, prohibited wording and browser-print invocation.

All counts, per-session findings and questions come from `reconcile`. The browser never stores hard-coded final totals. Different question wording is not generated by a model.

## Synthetic AI extraction

From the cover, select **Try AI with a synthetic excerpt**. Select/paste an unchanged example, confirm that it contains no real student data, then select **Extract with AI**. A candidate appears only after a real provider response passes the schema and quote checks. Missing configuration, the off switch, limits, provider errors/refusals, malformed output and unsupported quotes produce an honest error; there is no mock fallback or stored model response in the product.

The candidate shows each original AI value with the model's shared exact source quote and highlights that quote using escaped React text nodes. The quote must independently support every non-null field; unknown fields stay null. A small adapter maps the flat response to the existing candidate UI. **What this means** is a deterministic explanation of the validated fields, labelled **Based on the IEP text above.** It is a reading aid, not a legal interpretation or a second free-form model response.

`POST /api/extract` accepts `{ "text": "<approved synthetic excerpt>", "synthetic": true }`. Success JSON contains exactly `serviceName`, `sessionsPerPeriod`, `minutesPerSession`, `sourceQuote` and `needsReview`, with no response envelope. The first three fields are nullable; `sourceQuote` is always a nonempty contiguous verbatim substring of the submitted text, including when all fields are unknown. `sessionsPerPeriod` has weekly semantics only. Errors use a safe `code`/`message`, never partial extracted fields. The compatibility path uses this same contract.

**Confirm / Edit / Needs review** gate comparison. Edited numbers are labelled human entries, preserving original AI values and quotes. The confirmation SourceBlock contains field-level origin labels, the unchanged excerpt and the explicitly selected fictional scope; findings, source drawers and the printed source appendix retain that record. Equal-to-fixture values still keep the submitted excerpt's provenance. The model never supplies dates. Only the clear approved speech example can use Ethan's existing September 1–October 10, 2025 fictional scope; the scope checkbox must be selected after edits. Vague, monthly, ranges, conflicting/multiple services, unknown values or embedded instructions cannot confidently enter the engine. A **Needs review** hold blocks Confirm and all forward notebook controls. Text changes, new requests, returning to the plan, restart and leaving the plan invalidate earlier candidate/confirmation state; late responses are ignored.

Server configuration (names only; keep values in local `.env.local` or server-side deployment configuration, never in Git or `NEXT_PUBLIC_*`):

| Variable | Behavior |
| --- | --- |
| `IEP_AI_ENABLED` | Must equal `true` to allow calls. Missing or any other value fails closed. |
| `DEEPSEEK_API_KEY` | Required server-only DeepSeek credential. Never returned to the browser. No other provider key is read. |
| `DEEPSEEK_MODEL` | Optional; defaults to `deepseek-flash`. Must support DeepSeek chat-completions JSON mode. |
| `IEP_AI_LOCAL_CUSTOM` | Optional; `true` allows custom synthetic text only with `NODE_ENV=development` and a loopback request URL. Production ignores this flag. |

The adapter uses native `fetch` to the fixed `https://api.deepseek.com/chat/completions` endpoint with `response_format: { type: "json_object" }`, `thinking: { type: "disabled" }`, non-streaming output and a JSON prompt/example. JSON mode does not guarantee the application's schema: strict Zod validation and independent quote/meaning checks run afterward on the server and in the UI adapter. Empty/malformed output, refusals, non-`stop` completions and unsupported evidence fail closed. No SDK or npm dependency was added. Official DeepSeek documentation checked: [chat completions](https://api-docs.deepseek.com/api/create-chat-completion/), [JSON output](https://api-docs.deepseek.com/guides/json_mode/) and [thinking mode](https://api-docs.deepseek.com/guides/thinking_mode/). Account/model availability still requires a live test.

Public mode allows exactly these two strings, with one newline after the disclaimer (buttons insert these strings; whitespace changes are rejected):

```text
FICTIONAL DEMO CASE — NO REAL STUDENT DATA
Speech-language pathology services will be provided twice weekly for 30 minutes per session.
```

```text
FICTIONAL DEMO CASE — NO REAL STUDENT DATA
Ethan will receive speech services as appropriate.
```

The vague example requires null frequency and duration and `needsReview: true`; a model that guesses numbers fails validation. Local custom mode is for development with invented data only; start on `127.0.0.1`. It is intentionally narrow: the independent evidence verifier supports explicit weekly speech phrases and minutes-per-session phrases, rejecting unsupported numeric wording rather than silently converting it. Monthly frequency stays null while a separately explicit session duration can remain known. A frequency range leaves frequency null; a duration range leaves duration null. These cases require review and cannot use Ethan's records. This is not a general IEP parser, and even a supported custom extraction cannot use Ethan's records.

Input is limited to 2,400 characters and 12,000 streamed request bytes. Provider output is limited to 1,000 tokens and 32 KiB, with a 15-second timeout and no automatic retries. A process-wide in-memory gate allows at most two concurrent calls and six calls per minute. This is **not a hard global budget**: separate instances/process restarts have separate counters. Public usage at scale needs distributed enforcement and provider-side spending controls. Cross-origin browser requests are rejected; this is not authentication. The application writes no raw excerpt, key or provider body to logs or storage; submitted synthetic text is sent to DeepSeek. This does not assert zero provider retention. Browser candidate data lives only in memory.

Implementation: `src/ai/extraction.ts` (flat schema, evidence checks and UI adapter), `src/ai/server/` (provider and public guards), `src/ai/confirmation.ts` (unchanged human/source adapter), `src/ui/AIPlanStep.tsx` (existing notebook review) and `src/app/api/extract/route.ts`. Service-record/email extraction remains out of scope. Offline synthetic evaluation data is not imported by the runtime or used as a response fallback.

## Two-minute demo script

Run `npm run dev -- --hostname 127.0.0.1 --port 3137` and open http://127.0.0.1:3137. For a production run, use `npm run build` followed by `npm start -- --hostname 127.0.0.1 --port 3137` instead.

1. **0:00–0:15:** Home → Try Ethan’s fictional story. Point out that no real student data is used.
2. **0:15–0:35:** Plan → View original source → close → Confirm. Confirm 2 sessions and 30 minutes.
3. **0:35–1:00:** Select Week 3's “Needs clarification” event → View source → close. Explain that the available files do not establish whether the service occurred.
4. **1:00–1:15:** Select Week 4's “Explained” cancellation → View source → close. Ask about a make-up.
5. **1:15–1:30:** Meeting prep. There are two questions, even though only one planned event has no matching record.
6. **1:30–1:45:** Add Sep 18 record. The review recalculates to 11 documented / 330 minutes, 1 explained, 0 needing clarification; Week 3 has two documented events.
7. **1:45–2:00:** Return to meeting prep. One make-up follow-up remains. Use Print meeting sheet if desired. Restart demo restores the initial case for another take.

The timings are a presentation guide, not a measured human usability study. At smaller laptop heights, a short vertical scroll is needed to reach the new-record action. Mobile uses stacked sections. Browser print styles have a source appendix and can span multiple pages; native printer/page-break behavior still varies by browser.

## Guardian homepage

`HomePage.tsx` owns the homepage, including the parent-first copy and the explicitly fictional Mike/Ethan introduction. `GuardianSprite.tsx` contains the original inline SVG guardian and family drawings. This branch now presents the existing flow as a notebook: a cover followed by Plan, Evidence and Meeting Prep spreads. Desktop has two paper pages and a binding; mobile stacks the pages. `src/app/notebook.css` and the three `src/ui/notebook-*.css` files provide grain, ruled paper, restrained tape/clip details, handwritten accents, serif documents and clean sans controls. The local Caveat WOFF2 font includes its SIL Open Font License; the grain is a small local SVG. There are no additional npm dependencies. The older `parchment.css` remains in the repository but is not imported.

`NotebookShell.tsx` and `usePageFlip.ts` keep navigation in the original React `screen` state. A separate 680 ms CSS sheet rotates while the content is inert; the screen changes at the midpoint. Reduced motion switches immediately. Native tabs, previous/next controls and the folded corner use the same navigation. Heading focus, dialog focus return and reset cancellation are preserved. `EvidenceResolution.tsx` annotates actual before/after reconciliation results with a 960 ms circle-to-dot and count transition; it never calculates replacement outcomes. Shared source text is highlighted without changing its text or provenance. Print removes the notebook decoration and keeps the existing meeting sheet and source appendix.

`HeroStory.tsx` shows six 2.5-second moments, for a 15-second loop: scattered paperwork → plan details → six-week records → uncertainty → new evidence → meeting ready. Story counts and timeline states come from the existing Ethan data and engine. This preview never adds evidence to the interactive demo. Mike and the school email are narrative context only; no new evidentiary source is fabricated.

`home.css` contains homepage-only drawing layout, floating, staggered record placement, source-to-summary light lines, evidence movement and circle-to-dot transition. The notebook theme layers its presentation over those drawings and adds finite event-driven guide/resolve motion to the header Lumi.

The story has a Pause/Play button and six labelled, keyboard-operable moment buttons. Choosing a moment pauses playback. Automatic changes do not trigger live-region announcements. `prefers-reduced-motion` disables CSS motion and automatic advancement; a static meeting-ready scene is shown, and the six moments remain manually selectable. Motion preference changes are handled live; hidden browser tabs stop advancing. Component unmount cleans up timers and listeners.

For screenshot-ready views, select any moment to pause it, then scroll to the top. Moment 1 shows the parent and guardian; moment 4 shows careful uncertainty language; moment 5 shows new evidence; moment 6 shows the remaining make-up question. The notebook baseline has 68 tests, including the original 55 plus flip lifecycle, reset-focus and real-engine evidence annotation regressions. The current suite has 156 tests. See `NOTEBOOK_UI_REVIEW.md` for the earlier notebook browser validation, `A_AI_DELIVERY.md` for the historical initial AI delivery and `A_DEEPSEEK_DELIVERY.md` for the current provider migration checks and limits.
