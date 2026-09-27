"use client";

import type { ReconciliationInput, ReconciliationResult } from "../domain/types";
import { resolveSources } from "./demo-data";

export function MeetingStep({ input, result, onSource, onReview, lateAction }: {
  input: ReconciliationInput; result: ReconciliationResult;
  onSource: (ids: string[]) => void; onReview: () => void; lateAction: React.ReactNode;
}) {
  const s = result.summary;
  const questions = result.meetingQuestions.filter(q => q.status === "open");
  const sourceIds = [...new Set([input.prescription.sourceBlockId, input.window.sourceBlockId,
    ...result.findings.flatMap(f => f.sourceBlockIds), ...questions.flatMap(q => q.sourceBlockIds)])];
  const blocks = resolveSources(sourceIds, input.sourceBlocks);
  const documents = [...new Set(blocks.map(b => b.documentName))];
  return <section className="meeting-sheet">
    <div className="page-heading review-heading"><div><p className="eyebrow">03 / PREPARE FOR THE MEETING</p>
      <h1 tabIndex={-1}>Ethan&apos;s IEP meeting</h1>
      <p className="lede">Plan details, service records, and questions to discuss.</p></div></div>
    <p className="print-only">FICTIONAL DEMO CASE — NO REAL STUDENT DATA</p>
    <div className="notebook-spread meeting-spread">
    <div className="notebook-page notebook-left meeting-notes-page">
    <p className="meeting-margin-note no-print" aria-hidden="true">Meeting prep</p>
    <div className="meeting-overview paper">
      <section><p className="eyebrow">THE PLAN</p><h2>What the plan says</h2><p>{input.prescription.sessionsPerPeriod} speech-language sessions each school week, {input.prescription.minutesPerSession} minutes each.</p>
        <p className="small muted">{input.window.label}. Reference: {s.expectedSessions ?? "not yet confirmed"} sessions / {s.expectedMinutes ?? "not yet confirmed"} minutes.</p>
        <button className="text-button no-print" onClick={() => onSource([input.prescription.sourceBlockId, input.window.sourceBlockId])}>View plan source ↗</button></section>
      <section><p className="eyebrow">THE RECORDS</p><h2>What the records show</h2><p><strong>{s.documentedSessions} completed sessions</strong> · {s.documentedMinutes} documented minutes.</p><p>{s.explained} {s.explained === 1 ? "cancellation" : "cancellations"} with an explanation.</p><button className="text-button no-print" onClick={onReview}>Review the six weeks →</button></section>
      <section><p className="eyebrow">THE CONVERSATION</p><h2>What still needs clarification</h2>
        <p>{s.unresolved > 0 ? `${s.unresolved} planned ${s.unresolved === 1 ? "session has" : "sessions have"} no matching record in the files currently provided.` : s.comparisonComplete ? "Every planned session now has a completed record or an explanation." : "Some records need review before the comparison is complete."}</p>
        <p><strong>{s.openMeetingQuestions} {s.openMeetingQuestions === 1 ? "meeting follow-up question remains" : "meeting follow-up questions remain"}.</strong></p></section>
    </div>
    {!s.comparisonComplete && <p className="notice">Counts include only weeks that can be compared. Review the remaining record details.</p>}
    <div className="meeting-late-action no-print">{lateAction}</div>
    </div>
    <div className="notebook-page notebook-right meeting-questions-page">
    <p className="meeting-handwritten-heading no-print" aria-hidden="true">Questions to Ask<svg viewBox="0 0 280 16" fill="none"><path d="M3 11C62 3 135 2 277 5M12 14C79 9 160 8 254 10" /></svg></p>
    <section className="meeting-questions" aria-labelledby="questions-title"><div className="section-heading"><h2 id="questions-title">Questions</h2><span className="count-pill" data-testid="meeting-question-count">{questions.length}</span></div>
      <ol className="question-list">{questions.map((q, index) => <li className="question-card paper" key={q.id}>
        <span className="question-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><div><h3>{q.title}</h3><blockquote>“{q.question}”</blockquote><p className="small muted"><strong>Why this came up:</strong> {q.reason}</p>
          <p className="small source-names">Supporting sources: {[...new Set(resolveSources(q.sourceBlockIds, input.sourceBlocks).map(b => b.documentName))].join(" · ")}</p>
          <button className="text-button no-print" onClick={() => onSource(q.sourceBlockIds)} aria-label={`View source for question ${index + 1}`}>View source ↗</button></div>
      </li>)}</ol>
      {questions.length === 0 && <p className="paper empty-state">No open questions from these records. You can still bring your own.</p>}
    </section>
    <section className="meeting-sources" aria-labelledby="sources-title"><h2 id="sources-title">Sources</h2><p className="small muted">Based on the supplied files. Additional records may add or resolve questions.</p>
      <ul className="source-links">{documents.map(name => <li key={name}><button className="text-button no-print" onClick={() => onSource(blocks.filter(b => b.documentName === name).map(b => b.id))}>{name} ↗</button><span className="print-only">{name}</span></li>)}</ul>
      <div className="print-only print-evidence"><h2>Supporting excerpts</h2>{blocks.map(b => <article key={b.id}><h3>{b.documentName}{b.row != null ? ` · Row ${b.row}` : ""}{b.page != null ? ` · Page ${b.page}` : ""}</h3><pre>{b.text}</pre></article>)}</div>
    </section>
    <div className="meeting-print-action no-print"><span className="meeting-takeaway-note" aria-hidden="true">Meeting sheet</span><button className="secondary" onClick={() => window.print()}>Print meeting sheet <span aria-hidden="true">↗</span></button></div>
    </div>
    </div>
  </section>;
}
