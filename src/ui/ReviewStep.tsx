"use client";

import type { Finding, ReconciliationInput, ReconciliationResult } from "../domain/types";
import { statusDisplay } from "./demo-data";

export function ReviewStep({ input, result, selectedId, onSelect, onSource, onMeeting, onPlan, lateAction }: {
  input: ReconciliationInput; result: ReconciliationResult; selectedId: string | null;
  onSelect: (id: string) => void; onSource: (ids: string[]) => void; onMeeting: () => void;
  onPlan: () => void; lateAction: React.ReactNode;
}) {
  const selected = result.findings.find(f => f.id === selectedId) ?? result.findings.find(f => f.status === "unresolved") ?? result.findings.find(f => f.status === "explained") ?? result.findings[0];
  const s = result.summary;
  return <section>
    <div className="page-heading review-heading"><div><p className="eyebrow">02 / CHECK THE RECORDS</p>
      <h1 tabIndex={-1}>What do the records you have show?</h1><p className="lede">Ethan&apos;s speech &amp; language support <span className="separator">/</span> Based on the files currently provided.</p></div>
      <button className="secondary" onClick={onMeeting}>Prepare for the meeting <span aria-hidden="true">→</span></button></div>
    <div className="reference-strip"><span><strong>Plan reference</strong> <span data-testid="reference-counts">{s.expectedSessions ?? "—"} sessions · {s.expectedMinutes ?? "—"} minutes</span></span>
      <span className="small">Fictional six-week instructional window</span><button className="text-button" onClick={onPlan}>Review plan</button></div>
    {!s.comparisonComplete && <p role="status" className="notice">Some records need a closer look. The counts below include only weeks that can be compared. Please review the highlighted items before drawing conclusions.</p>}
    <dl className="summary-cards" aria-label="Current records">
      <div className="summary-card documented"><dt><span className="status-symbol" aria-hidden="true">✓</span> Documented</dt><dd><strong data-testid="documented-count">{s.documentedSessions}</strong><span>completed sessions</span></dd><p><span data-testid="documented-minutes">{s.documentedMinutes}</span> documented completed minutes</p></div>
      <div className="summary-card explained"><dt><span className="status-symbol" aria-hidden="true">i</span> Explained</dt><dd><strong data-testid="explained-count">{s.explained}</strong><span>{s.explained === 1 ? "cancellation" : "cancellations"} with an explanation</span></dd><p>A note about what happened</p></div>
      <div className="summary-card unresolved"><dt><span className="status-symbol" aria-hidden="true">?</span> Needs clarification</dt><dd><strong data-testid="unresolved-count">{s.unresolved}</strong><span>{s.unresolved === 1 ? "planned session" : "planned sessions"} with no matching record</span></dd><p>In the files currently provided</p></div>
    </dl>
    <div className="evidence-grid">
      <section className="timeline-panel paper" aria-labelledby="timeline-title"><div className="section-heading"><h2 id="timeline-title">Six weeks, at a glance</h2><span className="small muted">Choose a session to look closer</span></div>
        <ol className="week-list">
          {input.window.weeks.map((week, index) => {
            const findings = result.findings.filter(f => f.periodLabel === week.label);
            return <li key={week.id} className="week-row"><div className="week-name"><strong>Week {index + 1}</strong><span>{week.label.replace("Week of ", "").replace(", 2025", "")}</span></div>
              <div className="week-events">{findings.map((finding, eventIndex) => {
                const display = statusDisplay[finding.status];
                return <button key={finding.id} className={`event ${finding.status} ${selected?.id === finding.id ? "selected" : ""}`}
                  aria-label={`Week ${index + 1}, item ${eventIndex + 1}: ${display.label}`}
                  aria-pressed={selected?.id === finding.id} onClick={() => onSelect(finding.id)}>
                  <span className="event-dot" aria-hidden="true">{display.symbol}</span><span className="event-label">{display.label}</span>
                </button>;
              })}</div>
            </li>;
          })}
        </ol>
        <div className="legend" aria-label="Timeline key">{(["documented", "unresolved", "explained"] as const).map(status => <span key={status} className={status}><span className="legend-dot" aria-hidden="true">{statusDisplay[status].symbol}</span>{statusDisplay[status].label}</span>)}</div>
        <p className="small muted timeline-note">Each item represents a record or a planned session to check, not a scheduled day.</p>
      </section>
      {selected && <FindingDetail finding={selected} input={input} result={result} onSource={onSource} />}
    </div>
    {lateAction}
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
      <p>A service record says the provider was unavailable.</p><p>The cancellation has an explanation. Whether a make-up was offered still needs clarification.</p>
    </> : <p>{finding.explanation}</p>}
    <button className="text-button" onClick={() => onSource(finding.sourceBlockIds)}>View source <span aria-hidden="true">↗</span></button>
    {question && <div className="question-excerpt"><p className="eyebrow">A QUESTION TO BRING</p><blockquote>“{question.question}”</blockquote></div>}
  </aside>;
}
