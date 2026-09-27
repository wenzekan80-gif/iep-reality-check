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
import { NotebookShell } from "./NotebookShell";
import { usePageFlip } from "./usePageFlip";
import { GuardianSprite } from "./GuardianSprite";
import type { EvidenceChange } from "./EvidenceResolution";

export function DemoApp({ data }: { data: DemoData }) {
  const [screen, setScreen] = useState<Screen>("home");
  const { navigate, flip, busy, cancel } = usePageFlip(screen, setScreen);
  const [sourceIds, setSourceIds] = useState<string[] | null>(null);
  const [values, setValues] = useState({ sessions: data.initial.prescription.sessionsPerPeriod!, minutes: data.initial.prescription.minutesPerSession! });
  const [confirmedInput, setConfirmedInput] = useState<ReconciliationInput | null>(null);
  const [lateAdded, setLateAdded] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [evidenceChange, setEvidenceChange] = useState<EvidenceChange | null>(null);
  const [lumiCue, setLumiCue] = useState({ kind: "idle", sequence: 0 });
  const resetFocus = useRef(false);
  const openSource = (ids: string[]) => {
    setLumiCue(cue => ({ kind: "guide", sequence: cue.sequence + 1 }));
    setSourceIds(ids);
  };
  const result = useMemo(() => confirmedInput ? reconcile(confirmedInput) : null, [confirmedInput]);
  const reset = () => {
    resetFocus.current = true;
    cancel(); setEvidenceChange(null); setLumiCue({ kind: "idle", sequence: 0 });
    setScreen("home"); setConfirmedInput(null); setLateAdded(false); setMessage(""); setSelectedId(null); setSourceIds(null);
    setValues({ sessions: data.initial.prescription.sessionsPerPeriod!, minutes: data.initial.prescription.minutesPerSession! });
  };
  const addRecord = () => {
    if (!confirmedInput || !result || lateAdded) return;
    const next = addLateEvidence(confirmedInput, data);
    const nextResult = reconcile(next);
    const questionResolved = result.meetingQuestions.some(q => !nextResult.meetingQuestions.some(n => n.id === q.id));
    const addedFinding = nextResult.findings.find(f => f.sourceBlockIds.includes(data.lateSource.id) && f.status === "documented");
    setEvidenceChange({ before: result.summary, after: nextResult.summary, findingId: addedFinding?.id ?? null,
      resolved: !!addedFinding && result.findings.some(f => f.periodLabel === addedFinding.periodLabel && f.status === "unresolved") });
    setLumiCue(cue => ({ kind: "resolve", sequence: cue.sequence + 1 }));
    setMessage(questionResolved ? "This record resolves the missing-record question." : "Record added. Counts and questions updated.");
    setConfirmedInput(next); setLateAdded(true);
    setSelectedId(nextResult.findings.find(f => f.sourceBlockIds.includes(data.lateSource.id) && f.status === "documented")?.id ?? null);
    cancel(); setScreen("review");
  };
  const lateAction = <LateRecordAction added={lateAdded} message={message} onAdd={addRecord} onSource={() => openSource([data.lateSource.id])} />;
  const main = useRef<HTMLElement>(null);
  const previousScreen = useRef(screen);
  useEffect(() => {
    if (busy) return;
    if (resetFocus.current || previousScreen.current !== screen) main.current?.querySelector<HTMLElement>("h1")?.focus();
    resetFocus.current = false;
    previousScreen.current = screen;
  }, [screen, busy]);
  useEffect(() => {
    if (lateAdded) main.current?.querySelector<HTMLElement>(".event[aria-pressed='true']")?.focus();
  }, [lateAdded]);
  return <div className="app-shell">
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header"><button className="wordmark" disabled={busy} onClick={() => navigate("home")} aria-label="IEP Reality Check home"><span className="brand-mark" aria-hidden="true">✓</span>IEP <strong>Reality Check</strong></button>
      <p className="desk-motto" aria-hidden="true">IEP + records<br />meeting notes<span>✧</span></p>
      <div className={`notebook-lumi lumi-${lumiCue.kind}`} key={lumiCue.sequence} aria-hidden="true"><GuardianSprite happy={lumiCue.kind === "resolve"} /><span>Lumi</span></div>
      <div className="header-actions">{screen !== "home" && <button className="text-button" onClick={reset}>Restart demo</button>}<span className="demo-label"><span aria-hidden="true">◌</span> FICTIONAL DEMO</span></div></header>
    <main id="main" ref={main}>
      <NotebookShell screen={screen} confirmed={!!confirmedInput} flip={flip} busy={busy} onNavigate={navigate}>
      {screen === "home" ? <HomePage data={data} onStart={() => navigate("plan")} /> : screen === "plan" ? <PlanStep data={data} values={values} onChange={newValues => { setValues(newValues); setConfirmedInput(null); setEvidenceChange(null); }} onConfirm={() => {
        const input = confirmDemoPlan(data, values.sessions, values.minutes);
        setConfirmedInput(lateAdded ? addLateEvidence(input, data) : input); setSelectedId(null); navigate("review");
      }} onSource={openSource} /> : confirmedInput && result && (screen === "review" ?
        <ReviewStep input={confirmedInput} result={result} selectedId={selectedId} onSelect={setSelectedId} onSource={openSource} onMeeting={() => navigate("meeting")} onPlan={() => navigate("plan")} lateAction={lateAction} evidenceChange={evidenceChange} /> :
        <MeetingStep input={confirmedInput} result={result} onSource={openSource} onReview={() => navigate("review")} lateAction={lateAction} />)}
      </NotebookShell>
    </main>
    <footer className="site-footer"><span>This prototype uses fictional data for demonstration.</span><span>IEP · Records · Meeting prep</span></footer>
    {sourceIds && <SourceDrawer ids={sourceIds} sources={confirmedInput?.sourceBlocks ?? data.initial.sourceBlocks} onClose={() => setSourceIds(null)} />}
  </div>;
}
