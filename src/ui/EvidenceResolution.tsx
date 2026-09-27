import type { ReconciliationResult } from "../domain/types";

export type EvidenceChange = {
  before: ReconciliationResult["summary"];
  after: ReconciliationResult["summary"];
  findingId: string | null;
  resolved: boolean;
};

/** An annotation of two actual engine results; it never calculates the result. */
export function EvidenceResolution({ change }: { change: EvidenceChange }) {
  const metrics = [
    { label: "Documented", before: change.before.documentedSessions, after: change.after.documentedSessions },
    { label: "To clarify", before: change.before.unresolved, after: change.after.unresolved },
    { label: "Meeting questions", before: change.before.openMeetingQuestions, after: change.after.openMeetingQuestions },
  ];
  return <section className="evidence-resolution no-print" aria-label="Record changes">
    <div className="resolution-heading">
      <span className="resolution-symbol" aria-hidden="true">{change.resolved ? <><span className="resolve-open">○</span><span className="resolve-filled">●</span></> : "↗"}</span>
      <div><span className="handwritten">{change.resolved ? "Record found." : "Record added."}</span><p>Before and after</p></div>
      <svg className="drawn-check" viewBox="0 0 42 32" aria-hidden="true"><path pathLength="1" d="M5 16L16 26L36 5" /></svg>
    </div>
    <dl className="resolution-metrics">{metrics.map(metric => <div key={metric.label}>
      <dt>{metric.label}</dt><dd><span className="resolution-before">{metric.before}</span><span aria-hidden="true"> → </span><span className="resolution-after">{metric.after}</span></dd>
    </div>)}</dl>
  </section>;
}
