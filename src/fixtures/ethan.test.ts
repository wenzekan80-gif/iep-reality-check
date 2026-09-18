import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { reconcile } from "../domain/reconcile";
import { loadEthanDemo } from "./ethan";

describe("Ethan fictional source-file integration", () => {
  it("initial: 12 expected / 360 reference; 10 documented / 300; 1 explained; 1 unresolved; 2 questions", () => {
    const { initial } = loadEthanDemo(); const result = reconcile(initial);
    expect(result.summary).toEqual({ expectedSessions: 12, expectedMinutes: 360,
      documentedSessions: 10, documentedMinutes: 300, explained: 1, unresolved: 1,
      notComparable: 0, conflicts: 0, openMeetingQuestions: 2,
      perSessionDurationConsistent: true, fullMatch: false, comparisonComplete: true,
      pendingReviewRecords: 0, exactReimportsIgnored: 0 });
    expect(result.findings).toHaveLength(12);
    expect(result.findings.find(f => f.status === "unresolved")?.periodLabel).toBe("Week of September 15, 2025");
    expect(result.meetingQuestions.some(q => q.question.includes("week of September 15"))).toBe(true);
  });
  it("late evidence: 11 / 330 documented; cancellation remains; 0 unresolved; 1 follow-up", () => {
    const { initial, lateRecord, lateSource } = loadEthanDemo();
    const before = reconcile(initial);
    const after = reconcile({ ...initial, records: [...initial.records, lateRecord], sourceBlocks: [...initial.sourceBlocks, lateSource] });
    expect(after.summary).toMatchObject({ expectedSessions: 12, expectedMinutes: 360,
      documentedSessions: 11, documentedMinutes: 330, explained: 1, unresolved: 0, openMeetingQuestions: 1 });
    expect(after.findings.some(f => f.status === "unresolved")).toBe(false);
    expect(after.findings.find(f => f.sourceBlockIds.includes(lateSource.id))?.status).toBe("documented");
    expect(after.meetingQuestions[0].question).toContain("make-up");
    expect(after.meetingQuestions[0].id).toBe(before.meetingQuestions.find(q => q.question.includes("make-up"))!.id);
    expect(after.meetingQuestions[0].sourceBlockIds).toContain("ethan:cancel-context");
  });
  it("every source text and row is from an actual file; no page numbers are invented", () => {
    const { initial, lateSource } = loadEthanDemo();
    for (const block of [...initial.sourceBlocks, lateSource]) {
      const actual = readFileSync(resolve("fixtures/ethan", block.documentName), "utf8").replaceAll("\r\n", "\n");
      expect(actual).toContain("FICTIONAL DEMO CASE — NO REAL STUDENT DATA");
      expect(block.text).toBe(block.row ? actual.split("\n")[block.row - 1] : actual);
      expect(block.page).toBeUndefined();
    }
  });
  it("all output references resolve before and after late evidence", () => {
    const { initial, lateRecord, lateSource } = loadEthanDemo();
    for (const input of [initial, { ...initial, records: [...initial.records, lateRecord], sourceBlocks: [...initial.sourceBlocks, lateSource] }]) {
      const result = reconcile(input); const ids = new Set(input.sourceBlocks.map(b => b.id));
      for (const item of [...result.findings, ...result.meetingQuestions]) {
        expect(item.sourceBlockIds.length).toBeGreaterThan(0);
        item.sourceBlockIds.forEach(id => expect(ids.has(id)).toBe(true));
      }
      expect(JSON.stringify(result)).not.toMatch(/violation|noncompliant|school failed to provide|owed minutes|compensatory service amount/i);
    }
  });
  it("IEP, calendar, context and late candidates agree with their source text", () => {
    const { initial, lateRecord, lateSource, student } = loadEthanDemo();
    const plan = initial.sourceBlocks.find(b => b.id === initial.prescription.sourceBlockId)!.text;
    for (const text of [`Name: ${student.name}`, `Age: ${student.age}`, `Plan version: ${initial.planVersion.id}`,
      `Effective from: ${initial.planVersion.effectiveFrom}`, `Effective through: ${initial.planVersion.effectiveTo}`,
      `Service: ${initial.prescription.serviceName}`, `Frequency: ${initial.prescription.sessionsPerPeriod} sessions / school week`,
      `Duration: ${initial.prescription.minutesPerSession} minutes / session`]) expect(plan).toContain(text);
    const calendar = initial.sourceBlocks.find(b => b.id === initial.window.sourceBlockId)!.text;
    expect(calendar).toContain(initial.window.label);
    initial.window.weeks.forEach((w, i) => expect(calendar).toContain(`Week ${i + 1}: ${w.start} through ${w.end}`));
    const context = initial.sourceBlocks.find(b => b.id === "ethan:cancel-context")!.text;
    const cancelled = initial.records.find(r => r.status === "cancelled")!;
    for (const text of [`Date: ${cancelled.date}`, `Service: ${cancelled.serviceName}`, `Reason: ${cancelled.reason}`]) expect(context).toContain(text);
    for (const text of [`Date: ${lateRecord.date}`, `Service: ${lateRecord.serviceName}`,
      `Duration: ${lateRecord.minutes} minutes`, `Status: ${lateRecord.status}`]) expect(lateSource.text).toContain(text);
  });
  it("re-uploading the late source does not silently inflate the documented count", () => {
    const { initial, lateRecord, lateSource } = loadEthanDemo();
    const result = reconcile({ ...initial, records: [...initial.records, lateRecord, { ...lateRecord, id: "late-reimport" }],
      sourceBlocks: [...initial.sourceBlocks, lateSource] });
    expect(result.summary).toMatchObject({ documentedSessions: 11, documentedMinutes: 330, unresolved: 0, exactReimportsIgnored: 1 });
  });
});
