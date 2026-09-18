import { describe, expect, it } from "vitest";
import { reconcile } from "./reconcile";
import { ReconciliationInputSchema, FindingSchema } from "./schemas";
import { addRecord, filledCase, testCase } from "../test/fixtures/cases";

describe("required semantics", () => {
  it("TEST 1: 1×60 is not 2×30; frequency and duration differences surface", () => {
    const input = testCase(); addRecord(input, { minutes: 60 });
    const result = reconcile(input);
    expect(result.summary.fullMatch).toBe(false);
    expect(result.weeks[0].issues).toEqual(["completed_frequency_differs", "session_duration_differs"]);
    expect(result.findings.find(f => f.status === "documented")?.durationConsistent).toBe(false);
  });
  it("TEST 2: absent log is unresolved, not evidence of non-delivery", () => {
    const input = filledCase(); input.records.splice(5, 1);
    const result = reconcile(input);
    expect(result.summary.unresolved).toBe(1);
    expect(result.findings.find(f => f.status === "unresolved")?.explanation)
      .toBe("No matching record was found in the files provided.");
    expect(JSON.stringify(result)).not.toMatch(/service (was )?not provided|school failed to provide/i);
  });
  it("TEST 3: provider cancellation is explained and generates a separate follow-up", () => {
    const input = testCase(); addRecord(input, { status: "cancelled", minutes: 0, reason: "provider unavailable" });
    const result = reconcile(input);
    expect(result.summary.explained).toBe(1);
    expect(result.summary.documentedMinutes).toBe(0);
    expect(result.findings.some(f => f.status === "explained")).toBe(true);
    expect(result.meetingQuestions.some(q => q.question.includes("make-up"))).toBe(true);
    expect(JSON.stringify(result)).not.toMatch(/violation|noncompliant|compliant|owed minutes|compensatory service amount/i);
  });
  it("TEST 4: identical payload and source identity is counted once", () => {
    const input = testCase(); const r = addRecord(input);
    input.records.push({ ...r, id: "reimport" });
    const result = reconcile(input);
    expect(result.summary.documentedSessions).toBe(1);
    expect(result.summary.exactReimportsIgnored).toBe(1);
    expect(result.summary.conflicts).toBe(0);
  });
  it("TEST 5: similar records from distinct sources are retained for conflict review", () => {
    const input = testCase(); addRecord(input); addRecord(input);
    const before = structuredClone(input);
    const result = reconcile(input);
    expect(result.summary.conflicts).toBe(1);
    expect(result.summary.pendingReviewRecords).toBe(2);
    expect(result.summary.exactReimportsIgnored).toBe(0);
    expect(result.weeks[0].documentedSessions).toBeNull();
    expect(result.weeks[0].unresolved).toBeNull();
    expect(result.summary.comparisonComplete).toBe(false);
    expect(result.findings.find(f => f.status === "conflict")?.sourceBlockIds).toEqual(expect.arrayContaining(["source1", "source2"]));
    expect(input).toEqual(before);
  });
  it.each(["frequency", "effectiveFrom", "effectiveTo"])("TEST 6: unclear %s yields no fabricated expectation", field => {
    const input = testCase();
    if (field === "frequency") input.prescription.sessionsPerPeriod = null;
    else if (field === "effectiveFrom") input.planVersion.effectiveFrom = null;
    else input.planVersion.effectiveTo = null;
    const result = reconcile(input);
    expect(result.summary.expectedSessions).toBeNull();
    expect(result.summary.expectedMinutes).toBeNull();
    expect(result.summary.notComparable).toBe(1);
    expect(result.summary.unresolved).toBe(0);
    expect(result.summary.fullMatch).toBe(false);
  });
  it("TEST 7: adding evidence removes the corresponding unresolved finding", () => {
    const input = filledCase(); const late = input.records.splice(5, 1)[0];
    const before = reconcile(input); input.records.push(late); const after = reconcile(input);
    expect(before.summary.unresolved).toBe(1);
    expect(after.summary.unresolved).toBe(0);
    expect(after.summary.documentedSessions).toBe(12);
    expect(after.summary.documentedMinutes).toBe(360);
    expect(after.findings.some(f => f.id === before.findings.find(f => f.status === "unresolved")!.id)).toBe(false);
    expect(after.meetingQuestions).toHaveLength(0);
  });
  it("TEST 8: equal total minutes never overrides wrong session structure", () => {
    const input = testCase();
    for (const w of input.window.weeks) addRecord(input, { date: w.start, minutes: 60 });
    const result = reconcile(input);
    expect(result.summary.expectedMinutes).toBe(result.summary.documentedMinutes);
    expect(result.summary.documentedSessions).toBe(6);
    expect(result.summary.fullMatch).toBe(false);
    expect(result.weeks.every(w => w.totalMinutesEqual && !w.completedFrequencyMatches)).toBe(true);
    expect(result.meetingQuestions.some(q => q.reason === "Total documented minutes are equal, but the documented session frequency differs from the confirmed plan.")).toBe(true);
  });
  it("TEST 9: 11 completed + 1 cancelled has no unresolved finding but one meeting question", () => {
    const input = filledCase(); input.records[6].status = "cancelled"; input.records[6].minutes = 0;
    input.records[6].reason = "provider unavailable";
    const result = reconcile(input);
    expect(result.summary).toMatchObject({ expectedSessions: 12, expectedMinutes: 360,
      documentedSessions: 11, documentedMinutes: 330, explained: 1, unresolved: 0, openMeetingQuestions: 1 });
    expect(result.summary.fullMatch).toBe(false);
  });
});

describe("validation, provenance and boundary gates", () => {
  it("every finding and question references existing source blocks", () => {
    const input = testCase(); addRecord(input, { status: "cancelled", reason: "provider unavailable" });
    const result = reconcile(input); const ids = new Set(input.sourceBlocks.map(s => s.id));
    for (const output of [...result.findings, ...result.meetingQuestions]) {
      expect(output.sourceBlockIds.length).toBeGreaterThan(0);
      for (const id of output.sourceBlockIds) expect(ids.has(id)).toBe(true);
    }
    for (const finding of result.findings) expect(FindingSchema.safeParse(finding).success).toBe(true);
  });
  it("missing source fails loudly rather than inventing provenance", () => {
    const input = testCase(); addRecord(input); input.sourceBlocks.pop();
    expect(() => reconcile(input)).toThrow("Unknown sourceBlockId");
  });
  it("duplicate source IDs fail loudly", () => {
    const input = testCase(); input.sourceBlocks.push(input.sourceBlocks[0]);
    expect(() => reconcile(input)).toThrow("Duplicate SourceBlock");
  });
  it("fully matching evidence has a full match without questions", () => {
    expect(reconcile(filledCase()).summary).toMatchObject({ fullMatch: true, documentedSessions: 12,
      documentedMinutes: 360, unresolved: 0, openMeetingQuestions: 0, perSessionDurationConsistent: true });
  });
  it.each(["unknown date", "unknown mapping", "outside window"])("%s blocks missing-record inference", kind => {
    const input = testCase(); addRecord(input, kind === "unknown date" ? { date: null } :
      kind === "unknown mapping" ? { serviceName: "Speech?" } : { date: "2025-11-01" });
    expect(reconcile(input).summary).toMatchObject({ notComparable: 1, unresolved: 0, comparisonComplete: false });
  });
  it.each(["unknown status", "unknown minutes", "zero minutes"])("%s makes the week not comparable", kind => {
    const input = testCase(); addRecord(input, kind === "unknown status" ? { status: "unknown" } :
      { minutes: kind === "unknown minutes" ? null : 0 });
    const result = reconcile(input);
    expect(result.summary.notComparable).toBe(1);
    expect(result.weeks[0].unresolved).toBeNull();
  });
  it("student absence is explained, not completed", () => {
    const input = testCase(); addRecord(input, { status: "student_absent", minutes: null });
    expect(reconcile(input).summary).toMatchObject({ explained: 1, documentedSessions: 0 });
  });
  it("conflicting payloads for one source identity are not deduplicated", () => {
    const input = testCase(); const r = addRecord(input); input.records.push({ ...r, minutes: 60 });
    expect(reconcile(input).summary).toMatchObject({ conflicts: 1, exactReimportsIgnored: 0, pendingReviewRecords: 2 });
  });
  it("different durations on the same day require review", () => {
    const input = testCase(); addRecord(input); addRecord(input, { minutes: 60 });
    expect(reconcile(input).summary.conflicts).toBe(1);
  });
  it("extra records are retained and require review", () => {
    const input = testCase();
    for (const date of ["2025-09-01", "2025-09-02", "2025-09-03"]) addRecord(input, { date });
    expect(reconcile(input).summary).toMatchObject({ conflicts: 1, pendingReviewRecords: 3 });
  });
  it.each(["version", "partial period", "month"])("%s is not guessed", kind => {
    const input = testCase();
    if (kind === "version") input.planVersion.id = "v2";
    else if (kind === "partial period") input.planVersion.effectiveFrom = "2025-09-02";
    else input.prescription.period = "month";
    expect(reconcile(input).summary).toMatchObject({ notComparable: 1, expectedSessions: null });
  });
  it("requires human confirmation", () => {
    expect(ReconciliationInputSchema.safeParse({ ...testCase(), confirmed: false }).success).toBe(false);
  });
  it("rejects invalid dates and overlapping instructional weeks", () => {
    const input = testCase(); addRecord(input, { date: "2025-02-30" });
    expect(() => reconcile(input)).toThrow();
    const overlap = testCase(); overlap.window.weeks[1] = { ...overlap.window.weeks[0], id: "overlap" };
    expect(() => reconcile(overlap)).toThrow();
  });
  it("is deterministic and does not mutate input", () => {
    const input = filledCase(); const original = structuredClone(input);
    expect(reconcile(input)).toEqual(reconcile(input)); expect(input).toEqual(original);
  });
});
