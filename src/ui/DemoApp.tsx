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
import { HomePage } from "./HomePage";

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
  useEffect(() => {
    if (lateAdded) main.current?.querySelector<HTMLElement>(".event[aria-pressed='true']")?.focus();
  }, [lateAdded]);
  return <div className="app-shell">
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header"><button className="wordmark" onClick={() => setScreen("home")} aria-label="IEP Reality Check home"><span className="brand-mark" aria-hidden="true">✓</span>IEP <strong>Reality Check</strong></button>
      <div className="header-actions">{screen !== "home" && <button className="text-button" onClick={reset}>Restart demo</button>}<span className="demo-label"><span aria-hidden="true">◌</span> FICTIONAL DEMO</span></div></header>
    {screen !== "home" && <nav className="progress-nav" aria-label="Demo steps"><ol>{([['plan', 'Understand the plan'], ['review', 'Check the records'], ['meeting', 'Prepare for the meeting']] as const).map(([step, label], index) =>
      <li key={step}><button aria-label={`${String(index + 1).padStart(2, "0")} ${label}`} aria-current={screen === step ? "step" : undefined} disabled={step !== "plan" && !confirmedInput} onClick={() => setScreen(step)}><span>{String(index + 1).padStart(2, "0")}</span>{label}</button></li>)}</ol></nav>}
    <main id="main" ref={main}>
      {screen === "home" ? <HomePage data={data} onStart={() => setScreen("plan")} /> : screen === "plan" ? <PlanStep data={data} values={values} onChange={newValues => { setValues(newValues); setConfirmedInput(null); }} onConfirm={() => {
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
