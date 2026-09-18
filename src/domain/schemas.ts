import { z } from "zod";

const id = z.string().trim().min(1);
const date = z.iso.date();
const count = z.number().int().positive().max(100);
const minutes = z.number().int().positive().max(1440);

export const SourceBlockSchema = z.object({
  id, documentName: id, page: z.number().int().positive().nullable().optional(),
  row: z.number().int().positive().nullable().optional(), text: z.string().min(1),
});
export const PlanVersionSchema = z.object({
  id, effectiveFrom: date.nullable(), effectiveTo: date.nullable(), sourceId: id,
}).refine(p => !p.effectiveFrom || !p.effectiveTo || p.effectiveFrom <= p.effectiveTo,
  "Effective dates must be ordered");
export const ServicePrescriptionSchema = z.object({
  id, serviceName: id, sessionsPerPeriod: count.nullable(), minutesPerSession: minutes.nullable(),
  period: z.enum(["school_week", "month", "other"]).nullable(),
  setting: z.string().nullable().optional(), planVersionId: id, sourceBlockId: id,
});
export const ServiceRecordSchema = z.object({
  id, date: date.nullable(), serviceName: id,
  minutes: z.number().int().min(0).max(1440).nullable(),
  status: z.enum(["completed", "cancelled", "student_absent", "unknown"]),
  reason: z.string().nullable().optional(), sourceBlockId: id,
  contextSourceBlockIds: z.array(id).default([]),
});
export const FindingSchema = z.object({
  id, periodLabel: id, serviceName: id,
  status: z.enum(["documented", "explained", "unresolved", "not_comparable", "conflict"]),
  expectedSessions: z.number().int().nonnegative().nullable().optional(),
  documentedSessions: z.number().int().nonnegative().nullable().optional(),
  expectedMinutes: z.number().nonnegative().nullable().optional(),
  documentedMinutes: z.number().nonnegative().nullable().optional(),
  explanation: id, sourceBlockIds: z.array(id).min(1),
  durationConsistent: z.boolean().nullable().optional(),
});
export const MeetingQuestionSchema = z.object({
  id, title: id, question: id, reason: id, sourceBlockIds: z.array(id).min(1),
  status: z.enum(["open", "resolved"]),
});
export const ObservationWindowSchema = z.object({
  label: z.literal("Fictional six-week instructional window"),
  fictional: z.literal(true), sourceBlockId: id,
  weeks: z.array(z.object({ id, label: id, start: date, end: date })).min(1),
}).superRefine((w, ctx) => {
  const seen = new Set<string>();
  w.weeks.forEach((week, i) => {
    const start = new Date(week.start + "T00:00:00Z");
    const end = new Date(week.end + "T00:00:00Z");
    if (seen.has(week.id) || start.getUTCDay() !== 1 || end.getUTCDay() !== 5 ||
      end.getTime() - start.getTime() !== 4 * 86400000 ||
      (i > 0 && week.start <= w.weeks[i - 1].end)) {
      ctx.addIssue({ code: "custom", path: ["weeks", i], message: "Use unique, ordered, nonoverlapping full fictional Monday–Friday weeks" });
    }
    seen.add(week.id);
  });
});
export const ReconciliationInputSchema = z.object({
  confirmed: z.literal(true), prescription: ServicePrescriptionSchema,
  planVersion: PlanVersionSchema, records: z.array(ServiceRecordSchema),
  window: ObservationWindowSchema, sourceBlocks: z.array(SourceBlockSchema).min(1),
});
