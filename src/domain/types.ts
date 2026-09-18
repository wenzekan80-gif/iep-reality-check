import type { z } from "zod";
import type * as schemas from "./schemas";

export type SourceBlock = z.infer<typeof schemas.SourceBlockSchema>;
export type PlanVersion = z.infer<typeof schemas.PlanVersionSchema>;
export type ServicePrescription = z.infer<typeof schemas.ServicePrescriptionSchema>;
export type ServiceRecord = z.infer<typeof schemas.ServiceRecordSchema>;
export type Finding = z.infer<typeof schemas.FindingSchema>;
export type MeetingQuestion = z.infer<typeof schemas.MeetingQuestionSchema>;
export type ObservationWindow = z.infer<typeof schemas.ObservationWindowSchema>;
export type ReconciliationInput = z.infer<typeof schemas.ReconciliationInputSchema>;

export type WeekSummary = {
  id: string;
  expectedSessions: number;
  expectedMinutes: number;
  documentedSessions: number | null;
  documentedMinutes: number | null;
  explained: number | null;
  unresolved: number | null;
  completedFrequencyMatches: boolean | null;
  perSessionDurationConsistent: boolean | null;
  totalMinutesEqual: boolean | null;
  issues: string[];
};

export type ReconciliationResult = {
  findings: Finding[];
  meetingQuestions: MeetingQuestion[];
  weeks: WeekSummary[];
  summary: {
    expectedSessions: number | null;
    expectedMinutes: number | null;
    documentedSessions: number;
    documentedMinutes: number;
    explained: number;
    unresolved: number;
    notComparable: number;
    conflicts: number;
    openMeetingQuestions: number;
    perSessionDurationConsistent: boolean | null;
    fullMatch: boolean;
    comparisonComplete: boolean;
    pendingReviewRecords: number;
    exactReimportsIgnored: number;
  };
};
