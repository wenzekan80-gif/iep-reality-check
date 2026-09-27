"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { MAX_EXCERPT_LENGTH, SYNTHETIC_EXAMPLES } from "../ai/examples";
import { canCompareWithEthan, EvidenceError, explainCandidate, extractionToCandidate, type Candidate } from "../ai/extraction";
import { confirmExtractedPlan, HumanDetailsSchema, type HumanDetails } from "../ai/confirmation";
import type { ReconciliationInput } from "../domain/types";
import type { DemoData } from "./demo-data";

// React text nodes preserve the submitted text and escape markup. No HTML injection.
export function QuotedSource({ text, quotes }: { text: string; quotes: string[] }) {
  const spans = quotes.filter(Boolean).flatMap(quote => {
    const start = text.indexOf(quote); return start < 0 ? [] : [{ start, end: start + quote.length }];
  }).sort((a, b) => a.start - b.start);
  const merged: typeof spans = [];
  for (const span of spans) {
    const previous = merged.at(-1);
    if (previous && span.start <= previous.end) previous.end = Math.max(previous.end, span.end);
    else merged.push({ ...span });
  }
  let cursor = 0;
  return <>{merged.map(span => {
    const before = text.slice(cursor, span.start); cursor = span.end;
    return <Fragment key={span.start}>{before}<mark className="source-highlight">{text.slice(span.start, span.end)}</mark></Fragment>;
  })}{text.slice(cursor)}</>;
}

export function AIPlanStep({ data, onInvalidate, onConfirm, onStable }: {
  data: DemoData; onInvalidate: () => void; onConfirm: (input: ReconciliationInput) => void; onStable: () => void;
}) {
  const [text, setText] = useState<string>(SYNTHETIC_EXAMPLES[0].text);
  const [synthetic, setSynthetic] = useState(false);
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [sourceQuote, setSourceQuote] = useState<string | null>(null);
  const [details, setDetails] = useState<HumanDetails | null>(null);
  const [editing, setEditing] = useState(false);
  const [sessions, setSessions] = useState(""); const [minutes, setMinutes] = useState("");
  const [scope, setScope] = useState(false); const [review, setReview] = useState(false);
  const [pending, setPending] = useState(false); const [message, setMessage] = useState("");
  const generation = useRef(0); const request = useRef<AbortController | null>(null);
  useEffect(() => () => { generation.current++; request.current?.abort(); }, []);
  const invalidate = () => {
    generation.current++; request.current?.abort(); setPending(false);
    setCandidate(null); setSourceQuote(null); setDetails(null); setEditing(false); setScope(false); setReview(false); setMessage(""); onInvalidate();
  };
  const changeText = (next: string) => { invalidate(); setText(next); };
  const extract = async () => {
    invalidate();
    const id = generation.current; const controller = new AbortController(); request.current = controller;
    setPending(true);
    let failureMessage = "AI extraction is unavailable. Try again later or use Ethan’s original demo.";
    try {
      const response = await fetch("/api/extract", { method: "POST", signal: controller.signal,
        headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text, synthetic }) });
      const body = await response.json();
      if (id !== generation.current) return;
      if (!response.ok) {
        // Display only our endpoint's known errors, never arbitrary upstream bodies.
        const messages: Record<string, string> = {
          disabled: "AI extraction is switched off. Use Ethan’s original demo.",
          unavailable: "AI extraction is unavailable. Try again later or use Ethan’s original demo.",
          example_only: "This public demo accepts only the unchanged Clear example or Vague example. Do not submit real student data.",
          evidence: "The AI response did not pass the quote checks. No candidate was accepted. Review the wording and try again.",
          limit: "The demo’s AI call limit has been reached. Wait a minute or use Ethan’s original demo.",
        };
        failureMessage = messages[body.code] ?? "The excerpt could not be accepted. Use a short synthetic example.";
        throw new Error("Request rejected");
      }
      const next = extractionToCandidate(body, text);
      setCandidate(next); setSourceQuote(body.sourceQuote);
      if (canCompareWithEthan(next, text)) setDetails({ service: "Speech-Language Therapy", sessions: next.weeklyFrequency.value!, minutes: next.minutesPerSession.value! });
    } catch (error) {
      if (id === generation.current && !controller.signal.aborted) setMessage(error instanceof EvidenceError ? error.message : failureMessage);
    } finally { if (id === generation.current) setPending(false); }
  };
  const eligible = candidate && canCompareWithEthan(candidate, text);
  const changed = details && candidate && (details.sessions !== candidate.weeklyFrequency.value || details.minutes !== candidate.minutesPerSession.value);
  return <section className="plan-section ai-plan-section">
    <div className="page-heading"><p className="eyebrow">01 / UNDERSTAND THE PLAN</p><h1 tabIndex={-1}>Read a synthetic IEP excerpt</h1>
      <p className="lede">AI proposes service details. You check the wording before comparing records.</p>
      <button className="text-button" onClick={onStable}>Use Ethan’s original demo</button></div>
    <div className="plan-grid notebook-spread">
      <article className="notebook-page notebook-left plan-source-page">
        <p className="notebook-running-head">SUBMITTED SOURCE <span aria-hidden="true">01</span></p>
        <h2 className="handwritten">Start with the wording</h2>
        <p className="small muted">Public demo: paste one of these unchanged synthetic examples. Do not enter real student information.</p>
        <div className="button-row">{SYNTHETIC_EXAMPLES.map(example => <button className="secondary" key={example.id} onClick={() => changeText(example.text)}>{example.label}</button>)}</div>
        <label htmlFor="iep-excerpt">Synthetic IEP excerpt</label>
        <textarea id="iep-excerpt" rows={6} maxLength={MAX_EXCERPT_LENGTH} value={text} onChange={event => changeText(event.target.value)} aria-describedby="excerpt-limit" />
        <p id="excerpt-limit" className="small muted">{text.length}/{MAX_EXCERPT_LENGTH} characters · Changing the text clears the candidate and confirmation.</p>
        <label className="ai-check"><input type="checkbox" checked={synthetic} onChange={event => { invalidate(); setSynthetic(event.target.checked); }} />This is synthetic text with no real student data.</label>
        <button className="primary wide" disabled={!synthetic || !text.trim() || pending} onClick={extract}>{pending ? "Reading excerpt…" : "Extract with AI"}</button>
        {pending && <p className="notice" role="status">Waiting for the model. No plan is confirmed.</p>}
        {message && <p className="notice" role="alert">{message}</p>}
        {candidate && <div className="plan-source-paper"><p className="plan-source-name">Original submitted text · exact quotes highlighted</p>
          <pre className="source-excerpt-text" data-testid="ai-original"><QuotedSource text={text} quotes={[sourceQuote, candidate.service.quote, candidate.weeklyFrequency.quote, candidate.minutesPerSession.quote].filter((q): q is string => q !== null)} /></pre></div>}
      </article>
      <div className="notebook-page notebook-right plan-confirm-page">
        <p className="notebook-running-head">CANDIDATE DETAILS <span aria-hidden="true">02</span></p>
        {!candidate ? <div className="ai-empty"><h2 className="handwritten">Read, then review</h2><p>Choose an example and select “Extract with AI.” The candidate will appear here only after a model response passes the source checks.</p><p className="small muted">The original demo is always available if AI is switched off or unavailable.</p></div> : <>
          <article className="plan-card paper"><p className="eyebrow">AI CANDIDATE · NOT YET CONFIRMED</p><h2>Check each field</h2>
            <dl className="ai-fields">{([
              ["Service", candidate.service, details?.service],
              ["Sessions each school week", candidate.weeklyFrequency, details?.sessions],
              ["Minutes each session", candidate.minutesPerSession, details?.minutes],
            ] as const).map(([label, field, value]) => <div key={label}><dt>{label}</dt><dd><strong>{value ?? field.value ?? "Unknown — needs review"}</strong>
              {value !== undefined && value !== field.value && <p className="small ai-human-label">Human edit · original AI value: {field.value}</p>}
              {field.quote && <blockquote>“{field.quote}”<cite>Exact quote for the original AI value</cite></blockquote>}</dd></div>)}</dl>
          </article>
          <aside className="ai-explanation"><h2>What this means</h2><p className="small muted">Based on the IEP text above.</p><p>{explainCandidate(candidate)}</p><p className="small muted">A reading aid, not a legal interpretation.{changed && " Human edits below are separate from this explanation of the original text."}</p></aside>
          <aside className="confirmation-panel"><h2>Does this match the IEP?</h2>
            {!eligible && <p className="notice">Needs review. No record comparison is available for vague wording or excerpts outside the approved Ethan speech example. Obtain clear wording before proceeding.</p>}
            {editing ? <form onSubmit={event => {
              event.preventDefault();
              const parsed = HumanDetailsSchema.safeParse({ service: "Speech-Language Therapy", sessions: Number(sessions), minutes: Number(minutes) });
              if (!parsed.success) { setMessage("Enter whole numbers: 1–100 sessions and 1–1440 minutes."); return; }
              setDetails(parsed.data); setEditing(false); setReview(false); setScope(false); setMessage(""); onInvalidate();
            }}>
              <label htmlFor="ai-sessions">Sessions each school week</label><input id="ai-sessions" type="number" min={1} max={100} step={1} required value={sessions} onChange={event => setSessions(event.target.value)} />
              <label htmlFor="ai-minutes">Minutes each session</label><input id="ai-minutes" type="number" min={1} max={1440} step={1} required value={minutes} onChange={event => setMinutes(event.target.value)} />
              <p className="small muted">Changes are your synthetic demo entries. Original AI values and their quotes stay visible and separate.</p>
              <div className="button-row"><button type="submit" className="primary">Save details</button><button type="button" className="secondary" onClick={() => setEditing(false)}>Cancel</button></div>
            </form> : <>
              {eligible && <label className="ai-check"><input type="checkbox" checked={scope} onChange={event => { setScope(event.target.checked); onInvalidate(); }} />Use these reviewed speech details with Ethan’s fictional records, September 1–October 10, 2025. Dates and the six-week window come from the original demo; AI did not extract them.</label>}
              <button className="primary wide" disabled={!eligible || !details || !scope || review} onClick={() => {
                if (!candidate || !details || !scope || review) return;
                onConfirm(confirmExtractedPlan(data.initial, { text, candidate, details, scopeConfirmed: scope }));
              }}>Confirm <span aria-hidden="true">→</span></button>
              <div className="button-row"><button className="secondary" disabled={!eligible} onClick={() => { onInvalidate(); setScope(false); setSessions(String(details!.sessions)); setMinutes(String(details!.minutes)); setEditing(true); }}>Edit</button>
                <button className="text-button" onClick={() => { onInvalidate(); setReview(true); setScope(false); }}>Needs review</button></div>
              {review && <div className="notice" role="status"><p>Comparison is paused. Check the original quotes and clarify any missing details.</p>{eligible && <button className="text-button" onClick={() => setReview(false)}>Resume reviewing these details</button>}</div>}
            </>}
          </aside>
        </>}
      </div>
    </div>
  </section>;
}
