"use client";

import type { Finding, ReconciliationInput, ReconciliationResult } from "../domain/types";
import { statusDisplay } from "./demo-data";
import { EvidenceResolution, type EvidenceChange } from "./EvidenceResolution";

export function ReviewStep({ input, result, selectedId, onSelect, onSource, onMeeting, onPlan, lateAction, evidenceChange }: {
  input: ReconciliationInput; result: ReconciliationResult; selectedId: string | null;
  onSelect: (id: string) => void; onSource: (ids: string[]) => void; onMeeting: () => void;
  onPlan: () => void; lateAction: React.ReactNode; evidenceChange?: EvidenceChange | null;
}) {
  const selected = result.findings.find(f => f.id === selectedId) ?? result.findings.find(f => f.status === "unresolved") ?? result.findings.find(f => f.status === "explained") ?? result.findings[0];
  const s = result.summary;
  return <section className={`review-section ${evidenceChange ? "has-new-evidence" : ""}`}>
    <div className="page-heading review-heading"><div><p className="eyebrow">02 / CHECK THE RECORDS</p>
      <h1 tabIndex={-1}>Service records</h1><p className="lede">Ethan&apos;s speech &amp; language support <span className="separator">/</span> Based on the supplied files.</p></div>
      <button className="secondary" onClick={onMeeting}>Meeting prep <span aria-hidden="true">→</span></button></div>
    <div className="notebook-spread review-spread">
    <div className="notebook-page notebook-left records-page">
    <p className="handwritten spread-title" aria-hidden="true">Six-week records <span className="doodle-spark">✧</span></p>
    <div className="reference-strip"><span><strong>Plan reference</strong> <span data-testid="reference-counts">{s.expectedSessions ?? "—"} sessions · {s.expectedMinutes ?? "—"} minutes</span></span>
      <span className="small">Fictional six-week instructional window</span><button className="text-button" onClick={onPlan}>Review plan</button></div>
    {!s.comparisonComplete && <p role="status" className="notice">Comparison incomplete. Counts include only weeks that can be compared. Review the flagged records before drawing conclusions.</p>}
    <dl className="summary-cards" aria-label="Current records">
      <div className="summary-card documented"><dt><span className="status-symbol" aria-hidden="true">✓</span> Documented</dt><dd><strong data-testid="documented-count">{s.documentedSessions}</strong><span>completed sessions</span></dd><p><span data-testid="documented-minutes">{s.documentedMinutes}</span> documented minutes</p></div>
      <div className="summary-card explained"><dt><span className="status-symbol" aria-hidden="true">i</span> Explained</dt><dd><strong data-testid="explained-count">{s.explained}</strong><span>{s.explained === 1 ? "cancellation" : "cancellations"} with an explanation</span></dd><p>Reason in the record</p></div>
      <div className="summary-card unresolved"><dt><span className="status-symbol" aria-hidden="true">?</span> Needs clarification</dt><dd><strong data-testid="unresolved-count">{s.unresolved}</strong><span>{s.unresolved === 1 ? "planned session" : "planned sessions"} with no matching record</span></dd><p>In the files currently provided</p></div>
    </dl>
      <section className="timeline-panel paper" aria-labelledby="timeline-title"><div className="section-heading"><h2 id="timeline-title">Six-week timeline</h2><span className="small muted">Select a session to view details</span></div>
        <ol className="week-list">
          {input.window.weeks.map((week, index) => {
            const findings = result.findings.filter(f => f.periodLabel === week.label);
            return <li key={week.id} className={`week-row ${findings.some(f => f.id === selected?.id) ? "week-active" : ""}`}><div className="week-name"><strong>Week {index + 1}</strong><span>{week.label.replace("Week of ", "").replace(", 2025", "")}</span></div>
              <div className="week-events">{findings.map((finding, eventIndex) => {
                const display = statusDisplay[finding.status];
                return <button key={finding.id} className={`event ${finding.status} ${selected?.id === finding.id ? "selected" : ""} ${evidenceChange?.findingId === finding.id && evidenceChange.resolved ? "record-resolved" : ""}`}
                  aria-label={`Week ${index + 1}, item ${eventIndex + 1}: ${display.label}`}
                  aria-pressed={selected?.id === finding.id} onClick={() => onSelect(finding.id)}>
                  <span className="event-dot" aria-hidden="true">{evidenceChange?.findingId === finding.id && evidenceChange.resolved ? <><span className="resolve-open">○</span><span className="resolve-filled">●</span></> : display.symbol}</span><span className="event-label">{display.label}</span>
                </button>;
              })}</div>
            </li>;
          })}
        </ol>
        <div className="legend" aria-label="Timeline key">{(["documented", "unresolved", "explained"] as const).map(status => <span key={status} className={status}><span className="legend-dot" aria-hidden="true">{statusDisplay[status].symbol}</span>{statusDisplay[status].label}</span>)}</div>
        <p className="small muted timeline-note">Each item represents a record or a planned session to check, not a scheduled day.</p>
      </section>
      <p className="margin-note" aria-hidden="true">check dates<br />and minutes <span>↗</span></p>
    </div>
    <div className="notebook-page notebook-right finding-page">
      <p className="handwritten spread-title" aria-hidden="true">Session details</p>
      {selected && <FindingDetail finding={selected} input={input} result={result} onSource={onSource} />}
      {lateAction}
      {evidenceChange && <EvidenceResolution change={evidenceChange} />}
    </div>
    </div>
  </section>;
}

function FindingDetail({ finding, input, result, onSource }: {
  finding: Finding; input: ReconciliationInput; result: ReconciliationResult;
  onSource: (ids: string[]) => void;
}) {
  const week = input.window.weeks.find(w => w.label === finding.periodLabel);
  const weekSummary = result.weeks.find(w => w.id === week?.id);
  const record = input.records.find(r => finding.sourceBlockIds.includes(r.sourceBlockId));
  const question = result.meetingQuestions.find(q => finding.status === "unresolved" ? q.id === `${week?.id}:locate-record` :
    finding.status === "explained" ? q.id === `${week?.id}:follow-up:${record?.sourceBlockId}` : q.id === `${week?.id}:duration` || q.id === `${week?.id}:review`);
  const display = statusDisplay[finding.status];
  return <aside className={`finding-detail paper ${finding.status}`} aria-label="Selected session details" aria-live="polite">
    <span className={`status-badge ${finding.status}`}><span aria-hidden="true">{display.symbol}</span>{finding.status === "explained" ? "Explanation found" : display.label}</span>
    <h2>{finding.periodLabel}</h2>
    {finding.status === "unresolved" ? <>
      <p>The confirmed plan lists {input.prescription.sessionsPerPeriod} {input.prescription.minutesPerSession}-minute speech-language sessions for this fictional instructional week.</p>
      <p>The current records contain {weekSummary?.documentedSessions} matching completed {weekSummary?.documentedSessions === 1 ? "session" : "sessions"}.</p>
      <p className="detail-emphasis">No matching record was found in the files provided.</p>
      <p className="clarifying-note">This does not mean the service did not occur.</p>
    </> : finding.status === "explained" ? <>
      <p>A service record says the provider was unavailable.</p><p>The records do not establish whether a make-up session was offered.</p>
    </> : <p>{finding.explanation}</p>}
    <button className="text-button" onClick={() => onSource(finding.sourceBlockIds)}>View source <span aria-hidden="true">↗</span></button>
    {question && <div className="question-excerpt"><p className="eyebrow">MEETING QUESTION</p><blockquote>“{question.question}”</blockquote></div>}
  </aside>;
}
