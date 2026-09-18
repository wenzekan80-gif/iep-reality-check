import { FindingSchema, MeetingQuestionSchema, ReconciliationInputSchema } from "./schemas";
import type { Finding, ReconciliationInput, ReconciliationResult, ServiceRecord } from "./types";

const normalized = (value: string) => value.trim().toLowerCase();
const unique = (values: string[]) => [...new Set(values)];
const payload = (r: ServiceRecord) => JSON.stringify([
  r.date, r.serviceName, r.minutes, r.status, r.reason ?? null,
  r.sourceBlockId, r.contextSourceBlockIds,
]);

/** Pure, deterministic. Inputs must already have been reviewed by a human.
 * A SourceBlock ID is a stable source identity; import adapters must preserve it.
 * Never allocates make-ups, averages duration, or infers scheduled weekdays.
 */
export function reconcile(raw: ReconciliationInput): ReconciliationResult {
  const input = ReconciliationInputSchema.parse(raw);
  const { prescription: plan, planVersion: version, window, records, sourceBlocks } = input;
  const sources = new Map(sourceBlocks.map(s => [s.id, s]));
  if (sources.size !== sourceBlocks.length) throw new Error("Duplicate SourceBlock identity");
  const requireSources = (ids: string[]) => ids.forEach(id => {
    if (!sources.has(id)) throw new Error(`Unknown sourceBlockId: ${id}`);
  });
  const refs = (r: ServiceRecord) => unique([r.sourceBlockId, ...r.contextSourceBlockIds]);
  requireSources([plan.sourceBlockId, window.sourceBlockId, ...records.flatMap(refs)]);
  if (!sourceBlocks.some(s => s.documentName === version.sourceId)) {
    throw new Error("PlanVersion sourceId must name an existing source document");
  }
  const baseRefs = [plan.sourceBlockId, window.sourceBlockId];
  const result: ReconciliationResult = {
    findings: [], meetingQuestions: [], weeks: [],
    summary: {
      expectedSessions: null, expectedMinutes: null, documentedSessions: 0,
      documentedMinutes: 0, explained: 0, unresolved: 0, notComparable: 0,
      conflicts: 0, openMeetingQuestions: 0, perSessionDurationConsistent: null,
      fullMatch: false, comparisonComplete: false, pendingReviewRecords: 0,
      exactReimportsIgnored: 0,
    },
  };
  const add = (f: Finding) => {
    requireSources(f.sourceBlockIds);
    result.findings.push(FindingSchema.parse(f));
  };
  const question = (id: string, title: string, text: string, reason: string, ids: string[]) => {
    requireSources(ids);
    result.meetingQuestions.push(MeetingQuestionSchema.parse({
      id, title, question: text, reason, sourceBlockIds: unique(ids), status: "open",
    }));
  };
  const finish = () => {
    const s = result.summary;
    s.notComparable = result.findings.filter(f => f.status === "not_comparable").length;
    s.conflicts = result.findings.filter(f => f.status === "conflict").length;
    s.openMeetingQuestions = result.meetingQuestions.filter(q => q.status === "open").length;
    s.comparisonComplete = s.expectedSessions !== null && s.notComparable === 0 && s.conflicts === 0;
    const durations = result.findings.filter(f => f.status === "documented").map(f => f.durationConsistent);
    s.perSessionDurationConsistent = durations.includes(false) ? false :
      s.comparisonComplete && durations.length ? true : null;
    s.fullMatch = s.comparisonComplete && s.unresolved === 0 && s.explained === 0 &&
      s.documentedSessions === s.expectedSessions && s.documentedMinutes === s.expectedMinutes &&
      s.perSessionDurationConsistent === true && result.weeks.every(w => w.completedFrequencyMatches);
    return result;
  };
  const block = (reason: string, ids: string[]) => {
    add({ id: "window:not-comparable", periodLabel: window.label, serviceName: plan.serviceName,
      status: "not_comparable", explanation: reason, sourceBlockIds: unique(ids),
      expectedSessions: result.summary.expectedSessions, expectedMinutes: result.summary.expectedMinutes });
    question("window:review", "Confirm the comparison inputs", "Could we clarify the plan and record details before comparing?", reason, ids);
    result.summary.pendingReviewRecords = records.length;
    return finish();
  };
  if (version.id !== plan.planVersionId || sources.get(plan.sourceBlockId)!.documentName !== version.sourceId ||
      plan.period !== "school_week" || plan.sessionsPerPeriod === null || plan.minutesPerSession === null ||
      version.effectiveFrom === null || version.effectiveTo === null ||
      version.effectiveFrom > window.weeks[0].start ||
      version.effectiveTo < window.weeks.at(-1)!.end) {
    return block("The confirmed frequency, duration, plan version, or effective period is insufficient for this window. No expectation was calculated.",
      unique([...baseRefs, ...sourceBlocks.filter(s => s.documentName === version.sourceId).map(s => s.id)]));
  }
  const frequency = plan.sessionsPerPeriod;
  const duration = plan.minutesPerSession;
  result.summary.expectedSessions = window.weeks.length * frequency;
  result.summary.expectedMinutes = window.weeks.length * frequency * duration;
  const weekOf = (r: ServiceRecord) => window.weeks.find(w => r.date !== null && r.date >= w.start && r.date <= w.end);
  const uncertain = records.filter(r => !r.date || normalized(r.serviceName) !== normalized(plan.serviceName) || !weekOf(r));
  if (uncertain.length) return block(
    "A record has an unclear date or service mapping, or lies outside the confirmed instructional weeks. Review its scope before comparing.",
    unique([...baseRefs, ...uncertain.flatMap(refs)]),
  );

  const seen = new Set<string>();
  const deduped = records.filter(r => {
    const key = payload(r);
    if (seen.has(key)) { result.summary.exactReimportsIgnored++; return false; }
    seen.add(key); return true;
  });
  const conflictRecords = new Set<ServiceRecord>();
  const linkedSources = new Map<ServiceRecord, string[]>();
  for (let i = 0; i < deduped.length; i++) for (let j = i + 1; j < deduped.length; j++) {
    const a = deduped[i], b = deduped[j];
    if (a.sourceBlockId === b.sourceBlockId || a.id === b.id ||
        (a.date === b.date && normalized(a.serviceName) === normalized(b.serviceName))) {
      conflictRecords.add(a); conflictRecords.add(b);
      linkedSources.set(a, unique([...(linkedSources.get(a) ?? []), ...refs(b)]));
      linkedSources.set(b, unique([...(linkedSources.get(b) ?? []), ...refs(a)]));
    }
  }
  for (const week of window.weeks) {
    const group = deduped.filter(r => weekOf(r)!.id === week.id);
    const ids = unique([...baseRefs, ...group.flatMap(refs), ...group.flatMap(r => linkedSources.get(r) ?? [])]);
    const ws = {
      id: week.id, expectedSessions: frequency, expectedMinutes: frequency * duration,
      documentedSessions: null as number | null, documentedMinutes: null as number | null,
      explained: null as number | null, unresolved: null as number | null,
      completedFrequencyMatches: null as boolean | null,
      perSessionDurationConsistent: null as boolean | null, totalMinutesEqual: null as boolean | null,
      issues: [] as string[],
    };
    result.weeks.push(ws);
    const hasConflict = group.some(r => conflictRecords.has(r)) || group.length > frequency;
    const insufficient = group.some(r => r.status === "unknown" ||
      (r.status === "completed" && (r.minutes === null || r.minutes === 0)));
    if (hasConflict || insufficient) {
      const explanation = hasConflict ?
        "Potential duplicate, inconsistent source identity, or excess records require review. All candidate records are retained; this week's totals are withheld." :
        "Record status or completed-session duration is unclear. This week cannot be reliably compared.";
      add({ id: `${week.id}:review`, periodLabel: week.label, serviceName: plan.serviceName,
        status: hasConflict ? "conflict" : "not_comparable", expectedSessions: frequency,
        expectedMinutes: frequency * duration, explanation, sourceBlockIds: ids });
      question(`${week.id}:review`, "Review the service records", "Could you clarify which distinct sessions these records describe?", explanation, ids);
      ws.issues.push(hasConflict ? "record_conflict" : "unclear_record");
      result.summary.pendingReviewRecords += group.length;
      continue;
    }
    const completed = group.filter(r => r.status === "completed");
    const explained = group.filter(r => r.status === "cancelled" || r.status === "student_absent");
    ws.documentedSessions = completed.length;
    ws.documentedMinutes = completed.reduce((n, r) => n + r.minutes!, 0);
    ws.explained = explained.length;
    ws.unresolved = frequency - group.length;
    ws.completedFrequencyMatches = completed.length === frequency;
    ws.perSessionDurationConsistent = completed.length ? completed.every(r => r.minutes === duration) : null;
    ws.totalMinutesEqual = ws.documentedMinutes === ws.expectedMinutes;
    if (!ws.completedFrequencyMatches) ws.issues.push("completed_frequency_differs");
    if (ws.perSessionDurationConsistent === false) ws.issues.push("session_duration_differs");
    result.summary.documentedSessions += ws.documentedSessions;
    result.summary.documentedMinutes += ws.documentedMinutes;
    result.summary.explained += ws.explained;
    result.summary.unresolved += ws.unresolved;
    for (const r of group) {
      const recordRefs = unique([...baseRefs, ...refs(r)]);
      const isCompleted = r.status === "completed";
      add({ id: `${week.id}:source:${r.sourceBlockId}`, periodLabel: week.label, serviceName: plan.serviceName,
        status: isCompleted ? "documented" : "explained", expectedSessions: 1,
        documentedSessions: isCompleted ? 1 : 0, expectedMinutes: duration,
        documentedMinutes: isCompleted ? r.minutes : 0,
        durationConsistent: isCompleted ? r.minutes === duration : null,
        explanation: isCompleted ?
          `A completed session of ${r.minutes} minutes is documented.${r.minutes !== duration ? ` The confirmed plan specifies ${duration} minutes per session; duration differs.` : ""}` :
          `A ${r.status === "cancelled" ? "cancellation" : "student absence"} is documented${r.reason ? `: ${r.reason}` : "."} This explains the record status only.`,
        sourceBlockIds: recordRefs });
      if (!isCompleted) question(`${week.id}:follow-up:${r.sourceBlockId}`, "Ask about a make-up session",
        r.status === "cancelled" ? "Was a make-up session offered for the documented cancellation?" : "Was any follow-up arranged for the documented student absence?",
        "The supplied record explains the event but does not establish whether follow-up was offered.", recordRefs);
    }
    for (let n = 0; n < ws.unresolved; n++) add({
      id: `${week.id}:unresolved:${n + 1}`, periodLabel: week.label, serviceName: plan.serviceName,
      status: "unresolved", expectedSessions: 1, documentedSessions: 0, expectedMinutes: duration,
      documentedMinutes: 0, explanation: "No matching record was found in the files provided.", sourceBlockIds: ids,
    });
    if (ws.unresolved) question(`${week.id}:locate-record`, "Locate the remaining service record",
      `Were the remaining planned ${plan.serviceName} sessions provided during ${week.label.toLowerCase()}? If so, could you help me locate the service record?`,
      `${frequency} sessions are planned; ${completed.length} completed and ${explained.length} explained events appear in the supplied records.`, ids);
    if (ws.perSessionDurationConsistent === false) question(`${week.id}:duration`, "Clarify session duration and frequency",
      "Could you clarify how the documented session durations and frequency relate to the confirmed plan?",
      ws.totalMinutesEqual && !ws.completedFrequencyMatches ?
        "Total documented minutes are equal, but the documented session frequency differs from the confirmed plan." :
        "At least one documented session duration differs from the confirmed plan.", ids);
  }
  return finish();
}
