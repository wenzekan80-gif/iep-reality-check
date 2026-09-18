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
