# IEP Reality Check

Understand a confirmed IEP service plan, check supplied records, and prepare questions for a meeting.

**FICTIONAL DEMO CASE — NO REAL STUDENT DATA**

This prototype uses fictional data for demonstration. The demo uses a **Fictional six-week instructional window**, not a real school calendar.

## Current scope

Phase 1–3: tested domain model and synthetic fixtures plus a parent-facing interactive demo. One route takes a parent through the plan, confirmation, six-week records, source excerpts, meeting questions, and a newly found record. No PDF parsing/generation, LLM, database, authentication, or analytics. A minimal natural-language candidate extractor remains planned for a later phase.

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

No PDF, LLM, legal determination, or real student data support is included in this phase. The final MVP still requires a minimal natural-language candidate extraction layer; the current human review flow operates on the fictional fixtures only.

## Phase 3 UI architecture

`src/app/page.tsx` reads the existing fictional files on the server. It passes serializable data into `src/ui/DemoApp.tsx`. There are no API endpoints or extra routes. All navigation and demo evidence are held in React memory. Refreshing starts again; use the on-screen step navigation to move between views.

- `PlanStep`: plain-language plan, original source, editable frequency/duration, and explicit confirmation. “I'm not sure” keeps the parent on the plan without running the comparison.
- `ReviewStep`: engine-derived summary, clickable six-week events, selected finding and its question. It respects incomplete comparisons and does not render a score.
- `SourceDrawer`: native modal dialog, Escape dismissal, return focus, and exact SourceBlock text. Missing references throw. Source metadata is never synthesized by the viewer.
- `MeetingStep`: plan/records/clarifications, independent questions, supporting sources and browser printing. Print CSS hides controls and includes exact source excerpts.
- `LateRecordAction`: adds the existing September 18 fixture once. `DemoApp` calls the unchanged engine again, replaces the displayed result, selects the newly documented event and announces the resolved question.
- `demo-data.ts`: UI adapters only. Edited plan values are recorded as an explicitly labelled human confirmation SourceBlock; original files remain intact. The original source button always opens the original IEP. The adapter does not parse free text or calculate results.
- `DemoApp.test.tsx`: actual React interaction tests using jsdom and Testing Library. The original 37 tests remain unchanged. The new tests cover initial/updated counts, separate question counts, source text, focus return, confirmation, editing, restart, prohibited wording and browser-print invocation.

All counts, per-session findings and questions come from `reconcile`. The browser never stores hard-coded final totals. Different question wording is not generated by a model.

## Two-minute demo script

Run `npm run dev -- --hostname 127.0.0.1 --port 3137` and open http://127.0.0.1:3137. For a production run, use `npm run build` followed by `npm start -- --hostname 127.0.0.1 --port 3137` instead.

1. **0:00–0:15:** Home → Try Ethan’s fictional story. Point out that no real student data is used.
2. **0:15–0:35:** Plan → View original source → close → Looks right. Confirm 2 sessions and 30 minutes.
3. **0:35–1:00:** Select Week 3's “Needs clarification” event → View source → close. Explain that the available files do not establish whether the service occurred.
4. **1:00–1:15:** Select Week 4's “Explained” cancellation → View source → close. Ask about a make-up.
5. **1:15–1:30:** Prepare for the meeting. There are two questions, even though only one planned event has no matching record.
6. **1:30–1:45:** I found another service record. The review recalculates to 11 documented / 330 minutes, 1 explained, 0 needing clarification; Week 3 has two documented events.
7. **1:45–2:00:** Return to meeting prep. One make-up follow-up remains. Use Print meeting sheet if desired. Restart demo restores the initial case for another take.

The timings are a presentation guide, not a measured human usability study. At smaller laptop heights, a short vertical scroll is needed to reach the new-record action. Mobile uses stacked sections. Browser print styles have a source appendix and can span multiple pages; native printer/page-break behavior still varies by browser.

## Guardian homepage

`HomePage.tsx` owns the homepage, including the parent-first copy and the explicitly fictional Mike/Ethan introduction. `GuardianSprite.tsx` contains original inline SVG drawings: a rounded, leaf-topped guardian and the family at a table. This branch adds a parchment presentation in `src/app/parchment.css`, activated by the body class in the root layout: warm paper grain, rolled page edges, brown ink, serif headings and softly toned illustrations. The same theme covers plan confirmation, records, sources and meeting preparation. Green, blue-grey and amber still distinguish evidence states. The texture is an inline SVG in CSS; there are no external assets, external fonts, animation packages or additional dependencies. The theme is screen-only, so the existing plain printable meeting sheet is preserved.

`HeroStory.tsx` shows six 2.5-second moments, for a 15-second loop: scattered paperwork → plan details → six-week records → uncertainty → new evidence → meeting ready. Story counts and timeline states come from the existing Ethan data and engine. This preview never adds evidence to the interactive demo. Mike and the school email are narrative context only; no new evidentiary source is fabricated.

`home.css` contains homepage-only drawing layout, floating, staggered record placement, source-to-summary light lines, evidence movement and circle-to-dot transition. Shared review/meeting styles are unchanged apart from removing obsolete homepage rules.

The story has a Pause/Play button and six labelled, keyboard-operable moment buttons. Choosing a moment pauses playback. Automatic changes do not trigger live-region announcements. `prefers-reduced-motion` disables CSS motion and automatic advancement; a static meeting-ready scene is shown, and the six moments remain manually selectable. Motion preference changes are handled live; hidden browser tabs stop advancing. Component unmount cleans up timers and listeners.

For screenshot-ready views, select any moment to pause it, then scroll to the top. Moment 1 shows the parent and guardian; moment 4 shows careful uncertainty language; moment 5 shows new evidence; moment 6 shows the remaining make-up question. The 7 added animation tests join the existing 48 tests. Existing flow tests only change the homepage CTA selector.
