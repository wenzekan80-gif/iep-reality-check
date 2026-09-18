# IEP Reality Check

Understand a confirmed IEP service plan, check supplied records, and prepare questions for a meeting.

**FICTIONAL DEMO CASE — NO REAL STUDENT DATA**

This prototype uses fictional data for demonstration. The demo uses a **Fictional six-week instructional window**, not a real school calendar.

## Current scope

Phase 1–2 only: TypeScript domain model, Zod schemas, deterministic reconciliation, tests, and synthetic source fixtures. The Next.js route is intentionally blank: product UI has not started. No PDF, LLM, database, authentication, or analytics. A minimal natural-language candidate extractor remains planned for a later phase, after the engine is stable.

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

No product UI, PDF, LLM, legal determination, or real student data support is included in this phase. The final MVP still requires a minimal natural-language candidate extraction layer and a human review flow before reconciliation.
