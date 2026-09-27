// Local fixture audit only. No dependencies, network, model calls, or product imports.
import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const dir = fileURLToPath(new URL(".", import.meta.url));
const fail = (message) => { throw new Error(message); };
const assert = (condition, message) => { if (!condition) fail(message); };
const read = (name) => readFileSync(join(dir, name), "utf8");
const hash = (text) => createHash("sha256").update(text).digest("hex");
const parseLines = (name) => read(name).trim().split(/\r?\n/u).map((line, index) => {
  try { return JSON.parse(line); } catch { fail(`${name}:${index + 1}: invalid JSON`); }
});
const rows = parseLines("examples.jsonl");
const manifest = JSON.parse(read("split-manifest.json"));
const instruction = read("extraction-instruction.txt").trim();
const expectedKeys = ["serviceName", "sessionsPerPeriod", "minutesPerSession", "sourceQuote", "needsReview"].sort();
const scopes = new Set(["weekly_speech_candidate", "review_challenge", "other_service_challenge"]);
const ids = new Set();
const inputs = new Set();
const normalizedInputs = new Set();
const seenSplits = { development: [], heldout: [] };
const countBy = (key) => Object.fromEntries([...new Set(rows.map(row => row[key]))].sort().map(value => [value, rows.filter(row => row[key] === value).length]));
assert(rows.length === 24, "Expected exactly 24 source examples");
assert(manifest.development.length === 18 && manifest.heldout.length === 6, "Expected fixed 18/6 split");
const manifestIds = [...manifest.development, ...manifest.heldout];
assert(new Set(manifestIds).size === 24, "Manifest IDs must be unique and disjoint");
for (const row of rows) {
  assert(/^iep-syn-\d{3}$/u.test(row.id), "Invalid fixture ID");
  assert(!ids.has(row.id), `Duplicate ID: ${row.id}`);
  ids.add(row.id);
  assert(typeof row.input === "string" && row.input.trim().length > 0, `${row.id}: empty input`);
  assert(!inputs.has(row.input), `${row.id}: duplicate input`);
  inputs.add(row.input);
  const normalized = row.input.normalize("NFKC").toLowerCase().replace(/\s+/gu, " ").trim();
  assert(!normalizedInputs.has(normalized), `${row.id}: duplicate normalized input`);
  normalizedInputs.add(normalized);
  assert(Object.hasOwn(seenSplits, row.split), `${row.id}: invalid split`);
  assert(manifest[row.split].includes(row.id), `${row.id}: split differs from frozen manifest`);
  seenSplits[row.split].push(row.id);
  assert(typeof row.category === "string" && row.category.length > 0, `${row.id}: missing category`);
  assert(scopes.has(row.scope), `${row.id}: invalid scope`);
  assert(typeof row.labelNotes === "string" && row.labelNotes.length > 0, `${row.id}: missing label rationale`);
  const expected = row.expected;
  assert(expected && typeof expected === "object" && !Array.isArray(expected), `${row.id}: expected must be an object`);
  assert(JSON.stringify(Object.keys(expected).sort()) === JSON.stringify(expectedKeys), `${row.id}: expected must have exactly the five flat contract fields`);
  assert(expected.serviceName === null || (typeof expected.serviceName === "string" && expected.serviceName.trim().length > 0), `${row.id}: invalid serviceName`);
  for (const key of ["sessionsPerPeriod", "minutesPerSession"]) {
    assert(expected[key] === null || (Number.isSafeInteger(expected[key]) && expected[key] > 0), `${row.id}: invalid ${key}`);
  }
  assert(typeof expected.sourceQuote === "string" && expected.sourceQuote.trim().length > 0, `${row.id}: empty quote`);
  assert(row.input.includes(expected.sourceQuote), `${row.id}: quote is not a verbatim contiguous input substring`);
  assert(typeof expected.needsReview === "boolean", `${row.id}: invalid needsReview`);
  const hasUnknown = ["serviceName", "sessionsPerPeriod", "minutesPerSession"].some(key => expected[key] === null);
  assert(!hasUnknown || expected.needsReview === true, `${row.id}: unknown fields must require review`);
  assert(row.scope !== "review_challenge" || expected.needsReview === true, `${row.id}: review challenge lacks review flag`);
  if (row.scope === "weekly_speech_candidate") {
    assert(expected.serviceName === "Speech-Language Therapy" && !hasUnknown && !expected.needsReview, `${row.id}: invalid clear speech scope`);
  }
}
for (const split of Object.keys(seenSplits)) {
  assert(JSON.stringify(seenSplits[split].sort()) === JSON.stringify([...manifest[split]].sort()), `${split}: manifest coverage mismatch`);
}
const development = rows.filter(row => row.split === "development").map(row => ({
  id: row.id,
  instruction: `${instruction}\n\nSupplied IEP text:\n${row.input}`,
  response: JSON.stringify(row.expected)
}));
const heldout = rows.filter(row => row.split === "heldout");
const jsonl = (items) => items.map(item => JSON.stringify(item)).join("\n") + "\n";
const exports = { "development.adaption.jsonl": jsonl(development), "heldout.jsonl": jsonl(heldout) };
if (process.argv.includes("--write-exports")) {
  for (const [name, contents] of Object.entries(exports)) writeFileSync(join(dir, name), contents, "utf8");
}
for (const [name, contents] of Object.entries(exports)) assert(read(name) === contents, `${name}: absent or stale; use --write-exports`);
assert(development.every(row => !manifest.heldout.includes(row.id)), "Heldout ID in adaptation export");
assert(development.every((row, index) => JSON.stringify(JSON.parse(row.response)) === JSON.stringify(rows.filter(source => source.split === "development")[index].expected)), "Export completion does not match reference object");
const summary = {
  datasetStatus: "PREPARED",
  localDataAudit: "PASS",
  modelEvaluationStatus: "NOT RUN",
  adaptionStatus: "NOT RUN",
  datasetVersion: manifest.datasetVersion,
  auditedAt: new Date().toISOString(),
  sourceExamples: rows.length,
  splitCounts: countBy("split"),
  scopeCounts: countBy("scope"),
  categoryCounts: countBy("category"),
  needsReviewCount: rows.filter(row => row.expected.needsReview).length,
  uniqueIds: ids.size,
  uniqueInputs: inputs.size,
  uniqueNormalizedInputs: normalizedInputs.size,
  sourceQuoteExactSubstringPasses: rows.length,
  contractTypePasses: rows.length,
  splitManifestCoveragePasses: rows.length,
  developmentExportRows: development.length,
  heldoutExportRows: heldout.length,
  heldoutRowsInDevelopmentExport: 0,
  sha256: Object.fromEntries(["examples.jsonl", "split-manifest.json", "extraction-instruction.txt", ...Object.keys(exports)].map(name => [name, hash(read(name))])),
  limitations: [
    "Local audit validates fixture integrity, not extraction accuracy or semantic correctness.",
    "No model, endpoint, Adaption account, upload, adaptation, optimization, or platform evaluation was invoked.",
    "Reference labels were manually specified during synthetic fixture authoring; no independent educator adjudication.",
    "Normalized duplicate detection is exact after case and whitespace normalization, not a semantic near-duplicate detector.",
    "The heldout set is small, task-authored, and not a statistically representative external benchmark."
  ]
};
if (process.argv.includes("--write-summary")) writeFileSync(join(dir, "validation-summary.json"), JSON.stringify(summary, null, 2) + "\n", "utf8");
console.log(JSON.stringify(summary, null, 2));
