# Minimal DeepSeek candidate release notes

Updated 2026-09-28. This replaces the previous OpenAI/key-deferred candidate summary. Current facts and handoff are in C_RELEASE_REPORT.md.

- Accepted product: b2bc2d982730676280bfc844f848ab8f4986d128; base ff3c520. C integrates A deliveries 2cffc2b and d4788c5, with separate offline-data commits 9a8f498/4869e20.
- POST /api/extract is server-side DeepSeek, with a strict flat five-field Zod contract and exact supporting quotation. /api/iep/extract remains an alias. Existing candidate review and unchanged reconciliation are preserved.
- B passed 156 tests, typecheck/build and bounded credential scans on the exact product. C observed two genuine local model responses and the complete clear/uncertain/edit/review/confirm/late-evidence/fallback browser chain.
- Existing server process credentials enabled the bounded tests. DEEPSEEK_API_KEY stays server-only. Optional DEEPSEEK_MODEL defaults to deepseek-flash; IEP_AI_ENABLED must equal true. No new credential file, Git credential or Vercel environment modification was made.
- Public two-example allowlist, 2,400-character/12,000-byte input caps, 1,000-token/32KiB output caps, 15-second timeout/no retries, two-concurrent/six-per-minute per-process gate remain. Distributed/global budget enforcement is not claimed.
- 24 manually authored examples and a fixed 18/6 split are ready for offline work. Adaption Labs use, optimization and full model evaluation are NOT RUN; examples are not stored response fallbacks.
- Weekly speech-only evidence scope remains narrow. Other-service/multiple-service/arbitrary student-document intake is not supported. Unknown or unsupported wording cannot enter Ethan's comparison.
- Stable main 7f1d609 and https://iep-reality-check.vercel.app remain unchanged. AI production NOT CREATED; candidate is accepted locally, not promoted.
- Prior agent reports A_AI_DELIVERY.md and B_AI_ACCEPTANCE.md are historical. Current A_DEEPSEEK_DELIVERY.md and B_DEEPSEEK_ACCEPTANCE.md govern this runtime. C closes B's separately pending real-provider/browser check in the current release report.
