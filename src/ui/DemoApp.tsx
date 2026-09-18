"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { reconcile } from "../domain/reconcile";
import type { ReconciliationInput } from "../domain/types";
import type { DemoData, Screen } from "./demo-data";
import { addLateEvidence, confirmDemoPlan } from "./demo-data";
import { PlanStep } from "./PlanStep";
import { SourceDrawer } from "./SourceDrawer";
import { ReviewStep } from "./ReviewStep";
import { MeetingStep } from "./MeetingStep";
import { LateRecordAction } from "./LateRecordAction";

export function DemoApp({ data }: { data: DemoData }) {
  const [screen, setScreen] = useState<Screen>("home");
  const [sourceIds, setSourceIds] = useState<string[] | null>(null);
  const [values, setValues] = useState({ sessions: data.initial.prescription.sessionsPerPeriod!, minutes: data.initial.prescription.minutesPerSession! });
  const [confirmedInput, setConfirmedInput] = useState<ReconciliationInput | null>(null);
  const [lateAdded, setLateAdded] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const result = useMemo(() => confirmedInput ? reconcile(confirmedInput) : null, [confirmedInput]);
  const reset = () => {
    setScreen("home"); setConfirmedInput(null); setLateAdded(false); setMessage(""); setSelectedId(null); setSourceIds(null);
    setValues({ sessions: data.initial.prescription.sessionsPerPeriod!, minutes: data.initial.prescription.minutesPerSession! });
  };
  const addRecord = () => {
    if (!confirmedInput || !result || lateAdded) return;
    const next = addLateEvidence(confirmedInput, data);
    const nextResult = reconcile(next);
    const questionResolved = result.meetingQuestions.some(q => !nextResult.meetingQuestions.some(n => n.id === q.id));
    setMessage(questionResolved ? "Record found — this question has been resolved." : "New record added. Your records and meeting questions have been updated.");
    setConfirmedInput(next); setLateAdded(true);
    setSelectedId(nextResult.findings.find(f => f.sourceBlockIds.includes(data.lateSource.id) && f.status === "documented")?.id ?? null);
    setScreen("review");
  };
  const lateAction = <LateRecordAction added={lateAdded} message={message} onAdd={addRecord} onSource={() => setSourceIds([data.lateSource.id])} />;
  const main = useRef<HTMLElement>(null);
  const previousScreen = useRef(screen);
  useEffect(() => {
    if (previousScreen.current !== screen) main.current?.querySelector<HTMLElement>("h1")?.focus();
    previousScreen.current = screen;
  }, [screen]);
  return <div className="app-shell">
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header"><button className="wordmark" onClick={() => setScreen("home")} aria-label="IEP Reality Check home"><span className="brand-mark" aria-hidden="true">✓</span>IEP <strong>Reality Check</strong></button>
      <div className="header-actions">{screen !== "home" && <button className="text-button" onClick={reset}>Restart demo</button>}<span className="demo-label"><span aria-hidden="true">◌</span> FICTIONAL DEMO</span></div></header>
    {screen !== "home" && <nav className="progress-nav" aria-label="Demo steps"><ol>{([['plan', 'Understand the plan'], ['review', 'Check the records'], ['meeting', 'Prepare for the meeting']] as const).map(([step, label], index) =>
      <li key={step}><button aria-label={`${String(index + 1).padStart(2, "0")} ${label}`} aria-current={screen === step ? "step" : undefined} disabled={step !== "plan" && !confirmedInput} onClick={() => setScreen(step)}><span>{String(index + 1).padStart(2, "0")}</span>{label}</button></li>)}</ol></nav>}
    <main id="main" ref={main}>
      {screen === "home" ? <section className="home-hero">
        <div className="hero-copy"><p className="eyebrow">A LITTLE CLARITY. A MORE CONFIDENT CONVERSATION.</p>
          <h1 tabIndex={-1}>Understand the plan.<br />Check the records.<br /><em>Know what to ask.</em></h1>
          <p className="hero-description">Turn a confusing stack of IEP and service records into a clear picture of what the plan says, what your current records show, and what you may want to clarify at the next meeting.</p>
          <button className="primary hero-cta" onClick={() => setScreen("plan")}>Try the fictional demo <span aria-hidden="true">→</span></button>
          <p className="small muted">Fictional demo case — no real student data.</p>
        </div>
        <div className="hero-illustration" aria-hidden="true"><div className="paper-shadow" /><div className="illustrated-paper"><span className="eyebrow">A CLEARER PICTURE</span><div className="sketch-line long" /><div className="sketch-line" /><div className="illustrated-check">✓ <span>The plan, in plain language</span></div><div className="illustrated-check">✓ <span>The records, together</span></div><div className="illustrated-question">? <span>A place for your questions</span></div><div className="paper-foot">One conversation at a time.</div></div><div className="small-note">Less uncertainty.<br />More understanding.</div></div>
        <ol className="home-steps"><li><span>01</span><div><h2>Understand the plan</h2><p>Start with what&apos;s written.</p></div></li><li><span>02</span><div><h2>Check the records</h2><p>See what your files show.</p></div></li><li><span>03</span><div><h2>Prepare for the meeting</h2><p>Bring useful questions.</p></div></li></ol>
      </section> : screen === "plan" ? <PlanStep data={data} values={values} onChange={newValues => { setValues(newValues); setConfirmedInput(null); }} onConfirm={() => {
        const input = confirmDemoPlan(data, values.sessions, values.minutes);
        setConfirmedInput(lateAdded ? addLateEvidence(input, data) : input); setSelectedId(null); setScreen("review");
      }} onSource={setSourceIds} /> : confirmedInput && result && (screen === "review" ?
        <ReviewStep input={confirmedInput} result={result} selectedId={selectedId} onSelect={setSelectedId} onSource={setSourceIds} onMeeting={() => setScreen("meeting")} onPlan={() => setScreen("plan")} lateAction={lateAction} /> :
        <MeetingStep input={confirmedInput} result={result} onSource={setSourceIds} onReview={() => setScreen("review")} lateAction={lateAction} />)}
    </main>
    <footer className="site-footer"><span>This prototype uses fictional data for demonstration.</span><span>Understand. Check. Ask.</span></footer>
    {sourceIds && <SourceDrawer ids={sourceIds} sources={confirmedInput?.sourceBlocks ?? data.initial.sourceBlocks} onClose={() => setSourceIds(null)} />}
  </div>;
}
