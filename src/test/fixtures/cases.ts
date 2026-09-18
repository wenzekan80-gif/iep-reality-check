import type { ReconciliationInput, ServiceRecord } from "../../domain/types";

/** Source text originates here for unit fixtures; no page/row is asserted. */
export function testCase(): ReconciliationInput {
  return {
    confirmed: true,
    prescription: { id: "speech", serviceName: "Speech-Language Therapy", sessionsPerPeriod: 2,
      minutesPerSession: 30, period: "school_week", planVersionId: "v1", sourceBlockId: "plan" },
    planVersion: { id: "v1", effectiveFrom: "2025-09-01", effectiveTo: "2025-10-10", sourceId: "Test_IEP.txt" },
    window: { label: "Fictional six-week instructional window", fictional: true, sourceBlockId: "calendar",
      weeks: [
        ["2025-09-01", "2025-09-05"], ["2025-09-08", "2025-09-12"],
        ["2025-09-15", "2025-09-19"], ["2025-09-22", "2025-09-26"],
        ["2025-09-29", "2025-10-03"], ["2025-10-06", "2025-10-10"],
      ].map(([start, end], i) => ({ id: `w${i + 1}`, label: `Week of ${start}`, start, end })) },
    records: [], sourceBlocks: [
      { id: "plan", documentName: "Test_IEP.txt", text: "FICTIONAL TEST: Speech-Language Therapy; 2 sessions per school week; 30 minutes per session; effective 2025-09-01 through 2025-10-10." },
      { id: "calendar", documentName: "Test_Window.txt", text: "FICTIONAL TEST: Six Monday–Friday instructional weeks: September 1–October 10, 2025. Not a real school calendar." },
    ],
  };
}

export function addRecord(input: ReconciliationInput, values: Partial<ServiceRecord> = {}): ServiceRecord {
  const index = input.records.length + 1;
  const record: ServiceRecord = {
    id: `r${index}`, date: "2025-09-02", serviceName: "Speech-Language Therapy", minutes: 30,
    status: "completed", sourceBlockId: `source${index}`, contextSourceBlockIds: [], ...values,
  };
  input.records.push(record);
  if (!input.sourceBlocks.some(s => s.id === record.sourceBlockId)) input.sourceBlocks.push({
    id: record.sourceBlockId, documentName: `Test_Record_${index}.txt`,
    text: `FICTIONAL TEST RECORD: ${record.date ?? "date unclear"}; ${record.serviceName}; ${record.minutes ?? "minutes unclear"}; ${record.status}; ${record.reason ?? ""}`,
  });
  return record;
}

export function filledCase(): ReconciliationInput {
  const input = testCase();
  for (const w of input.window.weeks) {
    addRecord(input, { date: w.start });
    addRecord(input, { date: w.end });
  }
  return input;
}
