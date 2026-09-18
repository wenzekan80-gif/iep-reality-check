import type { loadEthanDemo } from "../fixtures/ethan";
import type { ReconciliationInput, SourceBlock } from "../domain/types";

export type DemoData = ReturnType<typeof loadEthanDemo>;
export type Screen = "home" | "plan" | "review" | "meeting";

export function resolveSources(ids: string[], sources: SourceBlock[]): SourceBlock[] {
  return [...new Set(ids)].map(id => {
    const block = sources.find(s => s.id === id);
    if (!block) throw new Error(`Source viewer: missing SourceBlock ${id}`);
    return block;
  });
}

export function confirmDemoPlan(data: DemoData, sessions: number, minutes: number): ReconciliationInput {
  const original = data.initial;
  if (sessions === original.prescription.sessionsPerPeriod && minutes === original.prescription.minutesPerSession) return original;
  // This is an actual form submission, not a quote or metadata attributed to an uploaded file.
  const confirmation: SourceBlock = {
    id: "demo:parent-confirmation", documentName: "Your confirmed demo details",
    text: `FICTIONAL DEMO CASE — NO REAL STUDENT DATA\nEntered and confirmed in this demo, not quoted from the original IEP.\nService: ${original.prescription.serviceName}\nSessions per school week: ${sessions}\nMinutes per session: ${minutes}\nEffective from: ${original.planVersion.effectiveFrom}\nEffective through: ${original.planVersion.effectiveTo}\nOriginal document: ${original.planVersion.sourceId}`,
  };
  return { ...original,
    prescription: { ...original.prescription, sessionsPerPeriod: sessions, minutesPerSession: minutes, sourceBlockId: confirmation.id },
    planVersion: { ...original.planVersion, sourceId: confirmation.documentName },
    sourceBlocks: [...original.sourceBlocks, confirmation],
  };
}

export function addLateEvidence(input: ReconciliationInput, data: DemoData): ReconciliationInput {
  if (input.records.some(r => r.sourceBlockId === data.lateRecord.sourceBlockId)) return input;
  return { ...input, records: [...input.records, data.lateRecord], sourceBlocks: [...input.sourceBlocks, data.lateSource] };
}

export const statusDisplay = {
  documented: { label: "Documented", symbol: "✓" },
  explained: { label: "Explained", symbol: "i" },
  unresolved: { label: "Needs clarification", symbol: "?" },
  not_comparable: { label: "Please confirm", symbol: "?" },
  conflict: { label: "Records need a closer look", symbol: "↔" },
} as const;
