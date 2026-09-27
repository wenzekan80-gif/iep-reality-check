"use client";

import { useState } from "react";
import type { DemoData } from "./demo-data";
import { resolveSources } from "./demo-data";
import { SourceText } from "./SourceText";

export function PlanStep({ data, values, onChange, onConfirm, onSource }: {
  data: DemoData; values: { sessions: number; minutes: number };
  onChange: (values: { sessions: number; minutes: number }) => void;
  onConfirm: () => void; onSource: (ids: string[]) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [unsure, setUnsure] = useState(false);
  const [sessions, setSessions] = useState(String(values.sessions));
  const [minutes, setMinutes] = useState(String(values.minutes));
  const changed = values.sessions !== data.initial.prescription.sessionsPerPeriod || values.minutes !== data.initial.prescription.minutesPerSession;
  const [source] = resolveSources([data.initial.prescription.sourceBlockId], data.initial.sourceBlocks);
  return <section className="plan-section">
    <div className="page-heading"><p className="eyebrow">01 / UNDERSTAND THE PLAN</p>
      <h1 tabIndex={-1}>Ethan&apos;s IEP</h1>
      <p className="lede">First, confirm what&apos;s in the IEP.</p></div>
    <div className="plan-grid notebook-spread">
      <article className="notebook-page notebook-left plan-source-page" aria-labelledby="plan-source-heading">
        <p className="notebook-running-head">ORIGINAL SOURCE <span aria-hidden="true">01</span></p>
        <h2 id="plan-source-heading" className="handwritten">Original IEP text</h2>
        <p className="plan-source-intro">Frequency and session length are highlighted.</p>
        <div className="plan-source-paper">
          <span className="source-paper-clip" aria-hidden="true" />
          <p className="plan-source-name">{source.documentName}</p>
          {(source.page != null || source.row != null) && <p className="source-location">
            {source.page != null && `Page ${source.page}`}{source.page != null && source.row != null && " · "}{source.row != null && `Row ${source.row}`}
          </p>}
          <pre className="source-excerpt-text"><SourceText text={source.text} /></pre>
        </div>
        <div className="plan-source-connector" aria-hidden="true">
          <span>from the IEP</span>
          <svg viewBox="0 0 125 40" fill="none"><path d="M3 9C38 32 74 28 118 13M104 7l15 6-9 14" /></svg>
        </div>
        <p className="small muted plan-source-footnote">Exact wording from the original IEP.</p>
      </article>
      <div className="notebook-page notebook-right plan-confirm-page">
        <p className="notebook-running-head">SERVICE DETAILS <span aria-hidden="true">02</span></p>
        <article className="plan-card paper">
        <div className="card-top"><span className="document-icon" aria-hidden="true">≡</span><span className="eyebrow">ETHAN&apos;S SERVICE PLAN</span></div>
        <p className="plan-handwritten-title handwritten" aria-hidden="true">Speech Support</p>
        <h2>Speech &amp; language support</h2>
        <p className="plan-at-a-glance" aria-hidden="true"><span><strong>{values.sessions}</strong> sessions/week</span><span className="plan-at-a-glance-divider">·</span><span><strong>{values.minutes}</strong> min/session</span></p>
        <div className="plan-details">
          <div><span className="label">HOW OFTEN</span><p>{values.sessions === 2 ? "Twice" : `${values.sessions} ${values.sessions === 1 ? "time" : "times"}`} each school week</p></div>
          <div><span className="label">HOW LONG</span><p>{values.minutes} minutes each session</p></div>
          <div><span className="label">REVIEW PERIOD</span><p>Six fictional instructional weeks</p></div>
        </div>
        <button className="text-button" onClick={() => onSource([data.initial.prescription.sourceBlockId, data.initial.window.sourceBlockId])}>View original source <span aria-hidden="true">↗</span></button>
        {changed && <p className="notice">Edited demo details remain separate from the original IEP text.</p>}
        </article>
        <aside className="confirmation-panel">
        <h2>Does this match the IEP?</h2>
        <p>Check the frequency and session length against the original text.</p>
        {editing ? <form onSubmit={event => {
          event.preventDefault(); onChange({ sessions: Number(sessions), minutes: Number(minutes) }); setEditing(false); setUnsure(false);
        }}>
          <label htmlFor="sessions">Sessions each school week</label>
          <input id="sessions" type="number" min="1" max="100" step="1" required value={sessions} onChange={e => setSessions(e.target.value)} />
          <label htmlFor="minutes">Minutes each session</label>
          <input id="minutes" type="number" min="1" max="1440" step="1" required value={minutes} onChange={e => setMinutes(e.target.value)} />
          <p className="small muted">Edits apply only to this fictional demo. Confirm the saved details before checking records.</p>
          <div className="button-row"><button className="primary" type="submit">Save details</button><button type="button" className="secondary" onClick={() => setEditing(false)}>Cancel</button></div>
        </form> : <>
          <button className="primary wide" onClick={onConfirm}>Confirm <span aria-hidden="true">→</span></button>
          <div className="button-row"><button className="secondary" onClick={() => { setSessions(String(values.sessions)); setMinutes(String(values.minutes)); setEditing(true); }}>Edit</button>
            <button className="text-button" onClick={() => setUnsure(true)}>Needs review</button></div>
        </>}
        {unsure && <div className="notice" role="status"><strong>Review the IEP details.</strong><p>Check the frequency and session length in the original IEP. Records are compared only after you select “Confirm.”</p>
          <button className="text-button" onClick={() => onSource([data.initial.prescription.sourceBlockId])}>Check the plan wording ↗</button></div>}
        <p className="small muted">Fictional demo; not a real school calendar.</p>
        </aside>
      </div>
    </div>
  </section>;
}
