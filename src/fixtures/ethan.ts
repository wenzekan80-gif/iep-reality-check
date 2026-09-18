import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { ReconciliationInputSchema, ServiceRecordSchema } from "../domain/schemas";
import type { ReconciliationInput, ServiceRecord, SourceBlock } from "../domain/types";

const serviceName = "Speech-Language Therapy";
const root = resolve(process.cwd(), "fixtures/ethan");
const read = (name: string) => readFileSync(resolve(root, name), "utf8").replaceAll("\r\n", "\n");
const whole = (id: string, name: string): SourceBlock => ({ id, documentName: name, text: read(name) });

/** Manually transcribed, confirmed synthetic candidates. NOT a natural-language parser.
 * Source text is read from the real fixture files; row numbers are actual 1-based lines.
 */
export function loadEthanDemo(): {
  student: { name: string; age: number; sourceBlockId: string };
  initial: ReconciliationInput; lateRecord: ServiceRecord; lateSource: SourceBlock;
} {
  const sources: SourceBlock[] = [
    whole("ethan:plan", "Ethan_IEP.txt"), whole("ethan:window", "Instructional_Window.txt"),
    whole("ethan:cancel-context", "School_Cancellation_Context.txt"),
  ];
  const dates = ["2025-09-02", "2025-09-04", "2025-09-09", "2025-09-11", "2025-09-16",
    "2025-09-23", "2025-09-25", "2025-09-30", "2025-10-02", "2025-10-07", "2025-10-09"];
  const lines = read("Ethan_Service_Log.csv").trimEnd().split("\n");
  if (lines.length !== dates.length + 2 || lines[1] !== "date,serviceName,minutes,status,reason") {
    throw new Error("Synthetic service log structure changed; review the confirmed candidates");
  }
  const records = dates.map((date, i) => {
    const cancelled = date === "2025-09-23";
    const record = ServiceRecordSchema.parse({ id: `ethan:record:${date}`, date, serviceName,
      minutes: cancelled ? 0 : 30, status: cancelled ? "cancelled" : "completed",
      reason: cancelled ? "provider unavailable" : null,
      sourceBlockId: `ethan:log:row:${i + 3}`,
      contextSourceBlockIds: cancelled ? ["ethan:cancel-context"] : [],
    });
    const expectedLine = [date, serviceName, record.minutes, record.status, record.reason ?? ""].join(",");
    if (lines[i + 2] !== expectedLine) throw new Error(`Candidate differs from source at CSV row ${i + 3}`);
    sources.push({ id: record.sourceBlockId, documentName: "Ethan_Service_Log.csv", row: i + 3, text: lines[i + 2] });
    return record;
  });
  const initial = ReconciliationInputSchema.parse({
    confirmed: true,
    prescription: { id: "ethan:speech", serviceName, sessionsPerPeriod: 2, minutesPerSession: 30,
      period: "school_week", planVersionId: "ethan-v1", sourceBlockId: "ethan:plan" },
    planVersion: { id: "ethan-v1", effectiveFrom: "2025-09-01", effectiveTo: "2025-10-10", sourceId: "Ethan_IEP.txt" },
    window: { label: "Fictional six-week instructional window", fictional: true, sourceBlockId: "ethan:window",
      weeks: [
        ["2025-09-01", "2025-09-05", "September 1"], ["2025-09-08", "2025-09-12", "September 8"],
        ["2025-09-15", "2025-09-19", "September 15"], ["2025-09-22", "2025-09-26", "September 22"],
        ["2025-09-29", "2025-10-03", "September 29"], ["2025-10-06", "2025-10-10", "October 6"],
      ].map(([start, end, label], i) => ({ id: `ethan:week:${i + 1}`, label: `Week of ${label}, 2025`, start, end })) },
    records, sourceBlocks: sources,
  });
  return {
    student: { name: "Ethan Miller", age: 8, sourceBlockId: "ethan:plan" }, initial,
    lateSource: whole("ethan:late", "Sep18_Speech_Record.txt"),
    lateRecord: ServiceRecordSchema.parse({ id: "ethan:record:2025-09-18", date: "2025-09-18", serviceName,
      minutes: 30, status: "completed", sourceBlockId: "ethan:late", contextSourceBlockIds: [] }),
  };
}
