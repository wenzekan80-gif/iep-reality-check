# IEP extraction synthetic evaluation fixtures

**Dataset: PREPARED. Adaption Adaptive Data: NOT RUN. Model/endpoint evaluation: NOT RUN.**

This folder contains 24 fictional English IEP snippets and manually specified reference labels: 18 development examples and 6 heldout examples. The examples and labels were authored during this task, not collected from students and not captured from an extraction model or endpoint. They have no independent educator adjudication. They are conservative extraction references, not measured model accuracy, clinical recommendations, or legal determinations.

There is no Adaption runtime dependency, API client, account action, upload, dataset ID, provider call, or optimization result in this preparation. The product must remain usable without this folder or Adaption. These snippets are independent of the Ethan demo fixture: no student identity, comparison status, or compliance result should be inherited from that fixture.

## Files and fixed split

| File | Purpose |
| --- | --- |
| `examples.jsonl` | Canonical 24-row dataset with ID, input, five-field expected object, category, split, scope, and label rationale. |
| `split-manifest.json` | Fixed 18 development / 6 heldout assignment, set before any optimization or model evaluation. |
| `extraction-instruction.txt` | Shared extraction rules used in the optional development export. |
| `development.adaption.jsonl` | 18 development rows, with complete `instruction` and JSON-string `response` columns for future mapping. |
| `heldout.jsonl` | 6 reserved reference examples; excluded from the adaptation export. |
| `validate.mjs` | Dependency-free local data-integrity audit and deterministic export generation. |
| `validation-summary.json` | Actual local audit evidence; explicitly not a model score or Adaption evaluation. |

The split is a manually selected scenario split, not a random or representative population sample. IDs and normalized inputs are disjoint across splits. Broad task categories intentionally recur across splits; this is not a claim of semantic independence. Do not upload, adapt, train on, choose prompts from, or tune repeatedly against the heldout examples. If heldout cases influence optimization, retire this split and prepare a new heldout set. Do not treat this small, visible set as a secret production benchmark.

## Flat extraction contract and annotation policy

The `expected` object has exactly the following five fields; row metadata is not part of the API response.

| Field | Type and reference rule |
| --- | --- |
| `serviceName` | Nonempty string or `null`. Canonical speech label: `Speech-Language Therapy`. A missing name or multiple services without a selected target is `null`. |
| `sessionsPerPeriod` | Positive integer or `null`, meaning **sessions per week only**. No monthly/alternate-week conversion, range midpoint, default, or zero. |
| `minutesPerSession` | Positive integer or `null`. Only a fixed per-session duration. No averaging, range endpoint selection, or division of a weekly total to invent uniform sessions. |
| `sourceQuote` | Nonempty, verbatim, contiguous substring of that row's `input`, including evidence of uncertainty where needed. |
| `needsReview` | Boolean; true for any unknown field, unclear service scope, conflicting evidence, negated/historical-only commitment, or nonrepresentable frequency. |

Fields are decided independently. Known 30-minute duration with missing frequency is `null / 30`; known two weekly sessions with missing duration is `2 / null`. A frequency range with fixed duration retains the duration. Monthly or alternate-week frequency remains `null`, while explicit per-session minutes are retained. Historical values are not current commitments. If two services are present with no selected target, all three extracted value fields are `null`; the quote retains the ambiguity.

Coverage: 8 clear weekly speech candidates, 14 review challenges, and 2 clear non-speech service challenges (occupational therapy and physical therapy). `weekly_speech_candidate` denotes a reasonable candidate for the existing weekly speech scope, **not proof that the current parser or guarded endpoint passes that wording**. `review_challenge` checks conservative partial extraction or abstention. `other_service_challenge` is deliberately outside the current speech parser scope; its `needsReview: false` label reflects unambiguous source evidence, not runtime support. Report these scopes separately rather than claim full dataset support.

Review categories include missing fields, frequency/duration ranges, monthly and alternate-week frequency, negation with historical numbers, conflicting entries, multiple services, and nonuniform session duration. Every row has a brief rationale. The current application may withhold a candidate even when this reference contract retains a known field; keep reference extraction scoring separate from UI admission and confirmation behavior.

## Future Adaption import and mapping (not performed)

Official Adaption documentation lists JSONL as a supported input. Its local-file creation guide describes import and waiting for ingestion before adaptation. This preparation supplies files only; follow the current official guide if a future run is authorized. [Overview](https://docs.adaptionlabs.ai/adaptive-data/overview/) · [Create a dataset](https://docs.adaptionlabs.ai/adaptive-data/create-a-dataset/) (checked 2026-09-28).

Use **only `development.adaption.jsonl`** for a development import. Map `instruction` to the prompt role and `response` to the completion role. Each instruction already contains the complete rules and its source snippet, so no additional context mapping is needed. `response` is a JSON string, not a nested object requiring an assumed parser behavior. This mapping follows the documented prompt/completion column roles; it is not an executed SDK example. [Select columns to adapt](https://docs.adaptionlabs.ai/adaptive-data/select-columns/).

Before any future run, preserve the canonical labels and split. After adaptation, manually recheck any rewritten snippets and completions: changing a snippet can invalidate its source quote or alter its frequency. Reject unsupported numbers and incorrect review flags; do not promote adapted outputs to ground truth automatically. Keep heldout rows local and unchanged.

Adaption documents platform evaluation of source versus adapted data after an adaptation run, with evaluation status separate from adaptation completion. Its quality signals are dataset-quality measurements; this package provides no evidence that they measure this app's five-field extraction accuracy. Record a real dataset/run reference and successful result before claiming Adaption was used. [Evaluate dataset quality](https://docs.adaptionlabs.ai/adaptive-data/evaluate-dataset-quality/).

## Local audit and future extraction evaluation

Run the local integrity check with Node.js; no package install is needed:

```powershell
node 'D:\IEP-Reality-Check-ai-release\evaluation\iep-extraction\validate.mjs'
```

To deliberately regenerate exports and store a fresh audit summary after a reviewed fixture change:

```powershell
node 'D:\IEP-Reality-Check-ai-release\evaluation\iep-extraction\validate.mjs' --write-exports --write-summary
```

The audit checks JSON parsing, 24 IDs, 18/6 split membership, exact and normalized duplicate inputs, all five field keys and types, positive integer/null numerics, unknown-field review flags, exact contiguous quotes, export fidelity, and exclusion of heldout IDs from the development export. It records SHA-256 hashes. This check cannot establish that labels are semantically correct or that a model extracts them.

This folder's `.gitattributes` pins all text files to LF, including datasets, instructions, exports, and the audit summary, even when `core.autocrlf=true`. Export comparisons and SHA-256 checksums use the exact UTF-8 file content with LF line endings; no newline normalization is applied by the validator.

For a future extraction evaluation, freeze the endpoint/model version, prompt, decoding settings, dataset hashes, and scoring rules before testing. Store predictions separately; never overwrite these expected labels with predictions. Tune using development cases only, then evaluate the heldout set once for that frozen candidate. The current status for every model metric below is **NOT RUN**.

| Metric | Definition and manual review requirement |
| --- | --- |
| Strict schema rate | Outputs with exactly five contract fields and valid types / all attempted rows. Count malformed responses as failures. |
| Value-field exact match | Compare the three extracted value fields and `needsReview` to the reference after parsing JSON; key order is irrelevant. Report each field and all-four match counts. Do not coerce strings or zero into allowed values. |
| Quote grounding | Nonempty exact contiguous input substring. Also manually verify it supports the retained fields and exposes material ambiguity; an exact but irrelevant quote fails grounding. |
| Full reference match | All value fields, review flag, and the designated `sourceQuote` match. Report separately because a different adequate verbatim span may be acceptable after review. |
| Unsupported-number count | Numeric predictions where the reference is null, uses a different number, or refers to a different/negated/historical service. Review each instance; target zero. |
| Review detection | True/false positives and negatives for `needsReview`; report precision and recall with numerators/denominators. Zero-denominator metrics are N/A. Manually inspect every false negative. |
| Partial-information retention | Cases with both known and unknown value fields: count correctly preserved known fields and correctly retained nulls. All-null output is not success when a field is explicit. |
| Scope-specific results | Separate clear weekly speech, review challenges, and other-service challenges, each split shown separately. Unsupported scope must not be silently dropped or relabelled as a pass. |

Manual review must flag merged services, inferred schedule averages, ranges collapsed to one number, stale-plan values, fabricated service names, quotes that omit decisive negation/conflict, and unsafe `needsReview: false`. Review all 24 rows for a pilot because the set is small. Keep proposed label corrections documented and versioned; never change labels solely to improve a measured score. A six-row heldout result would be exploratory evidence only, not a general accuracy or compliance claim.
