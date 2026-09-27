import { z } from "zod";
import { approvedExample } from "./examples";

const quote = z.string().min(1).max(2400).nullable();
const field = (max: number) => z.object({ value: z.number().int().positive().max(max).nullable(), quote }).strict();
export const CandidateSchema = z.object({
  service: z.object({ value: z.string().min(1).max(100).nullable(), quote }).strict(),
  weeklyFrequency: field(100),
  minutesPerSession: field(1440),
  needsReview: z.boolean(),
}).strict();
export type Candidate = z.infer<typeof CandidateSchema>;
export const ExtractionSchema = z.object({
  serviceName: z.string().min(1).max(100).nullable(),
  sessionsPerPeriod: z.number().int().positive().max(100).nullable(),
  minutesPerSession: z.number().int().positive().max(1440).nullable(),
  sourceQuote: z.string().min(1).max(2400).refine(value => value.trim().length > 0),
  needsReview: z.boolean(),
}).strict();
export type Extraction = z.infer<typeof ExtractionSchema>;

export class EvidenceError extends Error {
  constructor() { super("The extracted fields could not be verified against the excerpt. Review the wording and try again."); }
}

const speech = /\b(?:speech[- ]language (?:therapy|pathology services)|speech(?: and language)? services|speech therapy)\b/i;
const otherService = /\b(?:occupational therapy|physical therapy|counseling)\b/i;
const numbers: Record<string, number> = { once: 1, twice: 2, one: 1, two: 2, three: 3, four: 4, five: 5 };
const numberValue = (s: string) => numbers[s.toLowerCase()] ?? Number(s);
const frequency = /\b(\d+|one|two|three|four|five) (?:sessions?|times?) (?:each|per|a) (?:school )?week\b|\b(once|twice) (?:weekly|(?:each|per|a) (?:school )?week)\b/gi;
const duration = /\b(\d+) minutes? (?:per|each|a) session\b/gi;

// A deliberately narrow evidence verifier, not a fallback extractor. Only the model
// proposes fields. Unsupported wording is left for review instead of being guessed.
function hasUnsafeContext(text: string) {
  return /\b(?:appropriate|needed|optional|approximately|about|up to|at least|at most|alternate|alternating|unless|except|not|no longer|may|might|could|if|or)\b/i.test(text) ||
    /\b(?:ignore|instructions?|system|assistant|prompt|output|return|json|pretend)\b/i.test(text) ||
    otherService.test(text) || /[<>]/.test(text);
}

export function validateCandidate(raw: unknown, text: string): Candidate {
  const parsed = CandidateSchema.safeParse(raw);
  if (!parsed.success) throw new EvidenceError();
  const candidate = parsed.data;
  for (const f of [candidate.service, candidate.weeklyFrequency, candidate.minutesPerSession]) {
    if (f.value === null ? f.quote !== null : !f.quote || !text.includes(f.quote)) throw new EvidenceError();
  }
  if (candidate.service.value !== null) {
    const q = candidate.service.quote!;
    const supported = candidate.service.value === "Speech-Language Therapy" ? speech.test(q) :
      candidate.service.value === q && otherService.test(q);
    if (!supported) throw new EvidenceError();
  }
  const weeklyMatches = [...text.matchAll(frequency)];
  const durationMatches = [...text.matchAll(duration)];
  const rangeUnits = [...text.matchAll(/\b\d+\s*(?:[-–—/]|to)\s*\d+\b/g)]
    .map(match => text.slice(match.index! + match[0].length));
  const unknownRange = rangeUnits.some(tail => !/^\s+(?:sessions?|times?|minutes?)\b/i.test(tail));
  const unsafeContext = hasUnsafeContext(text) || unknownRange;
  const unsafeFrequency = unsafeContext || /\b(?:month|monthly)\b/i.test(text) || weeklyMatches.length > 1 ||
    rangeUnits.some(tail => /^\s+(?:sessions?|times?)\b/i.test(tail));
  const unsafeDuration = unsafeContext || durationMatches.length > 1 ||
    rangeUnits.some(tail => /^\s+minutes?\b/i.test(tail));
  for (const [f, pattern, matches, unsafe] of [
    [candidate.weeklyFrequency, frequency, weeklyMatches, unsafeFrequency],
    [candidate.minutesPerSession, duration, durationMatches, unsafeDuration],
  ] as const) {
    if (f.value === null) continue;
    const evidence = [...f.quote!.matchAll(pattern)];
    if (unsafe || candidate.service.value !== "Speech-Language Therapy" || matches.length !== 1 || evidence.length !== 1 ||
      numberValue(evidence[0][1] ?? evidence[0][2]) !== f.value ||
      evidence[0][0] !== matches[0][0]) throw new EvidenceError();
  }
  return { ...candidate, needsReview: candidate.needsReview || unsafeFrequency || unsafeDuration ||
    candidate.service.value !== "Speech-Language Therapy" ||
    candidate.weeklyFrequency.value === null || candidate.minutesPerSession.value === null };
}

// The public API has one quote. Reuse that exact quote as evidence for each known
// field; the existing verifier still checks each field's meaning independently.
function candidateFromExtraction(value: Extraction): Candidate {
  return {
    service: { value: value.serviceName, quote: value.serviceName === null ? null : value.sourceQuote },
    weeklyFrequency: { value: value.sessionsPerPeriod, quote: value.sessionsPerPeriod === null ? null : value.sourceQuote },
    minutesPerSession: { value: value.minutesPerSession, quote: value.minutesPerSession === null ? null : value.sourceQuote },
    needsReview: value.needsReview,
  };
}

export function validateExtraction(raw: unknown, text: string): Extraction {
  const parsed = ExtractionSchema.safeParse(raw);
  if (!parsed.success || !text.includes(parsed.data.sourceQuote)) throw new EvidenceError();
  const candidate = validateCandidate(candidateFromExtraction(parsed.data), text);
  return { ...parsed.data, needsReview: candidate.needsReview };
}

export function extractionToCandidate(raw: unknown, text: string): Candidate {
  return candidateFromExtraction(validateExtraction(raw, text));
}

export function canCompareWithEthan(candidate: Candidate, text: string) {
  return approvedExample(text)?.id === "ethan-clear" && !candidate.needsReview &&
    candidate.service.value === "Speech-Language Therapy" &&
    candidate.weeklyFrequency.value !== null && candidate.minutesPerSession.value !== null;
}

export function explainCandidate(candidate: Candidate) {
  if (candidate.needsReview) return "The excerpt does not establish a single, clear weekly speech plan that this demo can compare. Unknown details stay blank. Ask for clear frequency and minutes per session before checking records.";
  return `The excerpt describes ${candidate.service.value}: ${candidate.weeklyFrequency.value} sessions each week, lasting ${candidate.minutesPerSession.value} minutes each. It does not establish which days sessions occur or whether they were delivered.`;
}
