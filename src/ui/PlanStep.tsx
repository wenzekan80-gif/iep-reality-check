"use client";

import { useState } from "react";
import type { DemoData } from "./demo-data";

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
  return <section className="plan-section">
    <div className="page-heading"><p className="eyebrow">01 / UNDERSTAND THE PLAN</p>
      <h1 tabIndex={-1}>What does Ethan&apos;s plan say?</h1>
      <p className="lede">Start with the promise on paper. Take a moment to check these details.</p></div>
    <div className="plan-grid">
      <article className="plan-card paper">
        <div className="card-top"><span className="document-icon" aria-hidden="true">≡</span><span className="eyebrow">ETHAN&apos;S SERVICE PLAN</span></div>
        <h2>Speech &amp; language support</h2>
        <div className="plan-details">
          <div><span className="label">HOW OFTEN</span><p>{values.sessions === 2 ? "Twice" : `${values.sessions} ${values.sessions === 1 ? "time" : "times"}`} each school week</p></div>
          <div><span className="label">HOW LONG</span><p>{values.minutes} minutes each session</p></div>
          <div><span className="label">WE&apos;RE LOOKING AT</span><p>Six fictional instructional weeks</p></div>
        </div>
        <button className="text-button" onClick={() => onSource([data.initial.prescription.sourceBlockId, data.initial.window.sourceBlockId])}>View original source <span aria-hidden="true">↗</span></button>
        {changed && <p className="notice">You edited these demo details. Your confirmation will be kept separately from the original IEP text.</p>}
      </article>
      <aside className="confirmation-panel">
        <span className="step-dot" aria-hidden="true">✓</span><h2>A quick check, then a clearer picture.</h2>
        <p>Does this match what you understand from the plan? You can look at the original wording first.</p>
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
          <button className="primary wide" onClick={onConfirm}>Looks right <span aria-hidden="true">→</span></button>
          <div className="button-row"><button className="secondary" onClick={() => { setSessions(String(values.sessions)); setMinutes(String(values.minutes)); setEditing(true); }}>Edit</button>
            <button className="text-button" onClick={() => setUnsure(true)}>I&apos;m not sure</button></div>
        </>}
        {unsure && <div className="notice" role="status"><strong>It&apos;s okay to pause here.</strong><p>Please confirm the frequency and session length in the original plan. We won&apos;t compare records until you choose “Looks right.”</p>
          <button className="text-button" onClick={() => onSource([data.initial.prescription.sourceBlockId])}>Check the plan wording ↗</button></div>}
        <p className="small muted">This is a fictional teaching example, not a real school calendar.</p>
      </aside>
    </div>
  </section>;
}
