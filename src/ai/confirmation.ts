import { z } from "zod";
import { ReconciliationInputSchema } from "../domain/schemas";
import type { ReconciliationInput, SourceBlock } from "../domain/types";
import { canCompareWithEthan, validateCandidate, type Candidate } from "./extraction";

export const HumanDetailsSchema = z.object({
  service: z.literal("Speech-Language Therapy"),
  sessions: z.number().int().min(1).max(100), minutes: z.number().int().min(1).max(1440),
}).strict();
export type HumanDetails = z.infer<typeof HumanDetailsSchema>;

/** Called only by the explicit Confirm event. Never aliases the original fixture input. */
export function confirmExtractedPlan(base: ReconciliationInput, snapshot: {
  text: string; candidate: Candidate; details: HumanDetails; scopeConfirmed: boolean;
}): ReconciliationInput {
  const candidate = validateCandidate(snapshot.candidate, snapshot.text);
  const details = HumanDetailsSchema.parse(snapshot.details);
  if (!snapshot.scopeConfirmed || !canCompareWithEthan(candidate, snapshot.text) ||
    base.prescription.serviceName !== "Speech-Language Therapy" || base.planVersion.id !== "ethan-v1") {
    throw new Error("Only the reviewed clear speech example can use Ethan's fictional records.");
  }
  const original: SourceBlock = { id: "ai:excerpt", documentName: "Submitted synthetic IEP excerpt", text: snapshot.text };
  const fields = [
    ["Service", candidate.service, details.service],
    ["Weekly frequency", candidate.weeklyFrequency, details.sessions],
    ["Minutes per session", candidate.minutesPerSession, details.minutes],
  ] as const;
  const review: SourceBlock = {
    id: "ai:human-confirmation", documentName: "Human-confirmed synthetic plan and AI evidence",
    text: ["FICTIONAL DEMO CASE — NO REAL STUDENT DATA",
      "This is a human confirmation record, not an original IEP quote.",
      ...fields.map(([name, field, value]) => `${name}: ${value}\nValue source: ${value === field.value ? "AI candidate, explicitly confirmed by a human" : "Human edit; not supported by the original AI quote"}.\nOriginal AI value: ${field.value}\nVerbatim supporting quote for the original AI value: ${field.quote}`),
      "Scope explicitly selected by the reviewer: Ethan's existing fictional speech records and six-week instructional window.",
      `Effective from: ${base.planVersion.effectiveFrom}\nEffective through: ${base.planVersion.effectiveTo}`,
      `These dates are existing demo context from ${base.planVersion.sourceId}; they were not extracted from this excerpt.`,
      "Original submitted excerpt (unchanged):", snapshot.text,
    ].join("\n\n"),
  };
  return ReconciliationInputSchema.parse({ ...base,
    prescription: { ...base.prescription, sessionsPerPeriod: details.sessions, minutesPerSession: details.minutes,
      serviceName: details.service, sourceBlockId: review.id },
    planVersion: { ...base.planVersion, sourceId: review.documentName },
    sourceBlocks: [...base.sourceBlocks, original, review],
  });
}
