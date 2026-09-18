"use client";

import { useEffect, useState } from "react";
import type { DemoData } from "./demo-data";
import { addLateEvidence } from "./demo-data";
import { reconcile } from "../domain/reconcile";
import { FamilyDrawing, GuardianSprite } from "./GuardianSprite";

export const STORY_BEAT_MS = 2500;
export const STORY_BEATS = ["A stack of questions", "Understand the plan", "Check the records", "Needs clarification", "New evidence", "Ready for the meeting"] as const;

// Uses the same fictional evidence as the interactive demo. Animation never changes demo state.
export function HeroStory({ data }: { data: DemoData }) {
  const [beat, setBeat] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(true);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const preference = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const syncPreference = () => {
      const reduce = preference?.matches ?? false;
      setReduced(reduce);
      if (reduce) setBeat(5);
    };
    const syncVisibility = () => setVisible(!document.hidden);
    syncPreference(); syncVisibility();
    preference?.addEventListener("change", syncPreference);
    document.addEventListener("visibilitychange", syncVisibility);
    return () => { preference?.removeEventListener("change", syncPreference); document.removeEventListener("visibilitychange", syncVisibility); };
  }, []);
  const playing = !paused && !reduced && visible;
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setBeat(current => (current + 1) % STORY_BEATS.length), STORY_BEAT_MS);
    return () => window.clearInterval(timer);
  }, [playing]);
  const [{ initial, updated }] = useState(() => ({ initial: reconcile(data.initial), updated: reconcile(addLateEvidence(data.initial, data)) }));
  const plan = data.initial.prescription;
  const result = beat >= 4 ? updated : initial;
  const descriptions = [
    "An IEP, service records, an email, a note. Mike needs a clearer place to start.",
    "A few important details, brought into focus.",
    "Six fictional weeks. A place for every record, and every question.",
    "No matching record for one planned session was located in the files provided.",
    "Record found. A little more evidence, a little less uncertainty.",
    "The records are clearer. The make-up session question remains.",
  ];
  return <section className="guardian-story" aria-label="Ethan’s story in six moments" data-playing={playing} data-reduced-motion={reduced} data-story-beat={beat}>
    <div className="story-topline"><span>FROM PAPERWORK TO A PLAN</span><span className="story-fiction">A fictional story</span></div>
    <div className={`story-stage beat-${beat}`}>
      <svg className="glass-motif" viewBox="0 0 500 400" aria-hidden="true"><g stroke="#becbc2" strokeWidth="1" opacity=".45"><path d="M245 20L433 92L458 252L337 357L137 326L47 164L136 51Z" fill="#e7eee5"/><path d="M245 20L245 182L433 92M245 182L458 252M245 182L337 357M245 182L137 326M245 182L47 164M245 182L136 51"/><path d="M245 20L433 92L245 182Z" fill="#dbe7e9"/><path d="M245 182L458 252L337 357Z" fill="#eee2c4"/></g></svg>
      <div className="scene-content" key={beat}>
        {beat === 0 && <div className="paperwork-scene">
          <div className="loose-page page-iep"><span>IEP</span><i/><i/><i/></div>
          <div className="loose-page page-log"><span>Service log</span><i/><i/><i/></div>
          <div className="loose-page page-email"><span>School email</span><i/><i/></div>
          <div className="loose-page page-note"><span>A note</span><i/><i/></div>
          <FamilyDrawing />
        </div>}
        {beat === 1 && <div className="plan-scene">
          <div className="highlighted-page"><span className="tiny-heading">IN THE IEP</span><p>Speech-Language Therapy</p><mark>{plan.minutesPerSession} minutes · {plan.sessionsPerPeriod} times weekly</mark><i/><i/></div>
          <svg className="evidence-thread" viewBox="0 0 330 230" aria-hidden="true"><path d="M100 60C220 50 280 110 193 170" /></svg>
          <div className="story-clean-card plan-reveal"><span className="tiny-heading">WHAT THE PLAN SAYS</span><h3>Speech &amp; language support</h3><p><strong>{plan.sessionsPerPeriod}</strong> sessions / week</p><p><strong>{plan.minutesPerSession}</strong> minutes / session</p></div>
        </div>}
        {beat >= 2 && beat <= 4 && <div className="records-scene">
          <div className="story-clean-card mini-timeline"><span className="tiny-heading">SIX FICTIONAL WEEKS</span>
            {data.initial.window.weeks.map((week, index) => <div className={`mini-week ${index === 2 && beat >= 3 ? "week-in-focus" : ""}`} key={week.id}><span>Week {index + 1}</span><div>
              {result.findings.filter(f => f.periodLabel === week.label).map((finding, item) => <span key={`${week.id}:${item}`} className={`mini-event ${finding.status} ${index === 2 && item === 1 && beat === 4 ? "new-match" : ""}`} aria-label={finding.status === "unresolved" ? "Needs clarification" : finding.status === "explained" ? "Explained cancellation" : "Documented"}>
                {index === 2 && item === 1 && beat === 4 ? <><span className="new-match-outline" aria-hidden="true">○</span><span className="new-match-dot" aria-hidden="true">●</span></> : finding.status === "unresolved" ? "○" : finding.status === "explained" ? "◉" : "●"}
              </span>)}
            </div></div>)}
            <div className="mini-legend">● Documented <span>○ To clarify</span> ◉ Explained</div>
          </div>
          {beat === 3 && <div className="clarification-tag"><span aria-hidden="true">?</span> Needs clarification</div>}
          {beat === 4 && <div className="new-evidence-card"><span className="record-check" aria-hidden="true">✓</span><div>Sep 18 Speech Record<small>{data.lateRecord.minutes} minutes <span>· Record found</span></small></div></div>}
        </div>}
        {beat === 5 && <div className="meeting-scene"><div className="story-clean-card meeting-ready"><span className="tiny-heading">A CALMER CONVERSATION</span><h3>Ready for the meeting</h3><p><span aria-hidden="true">✓</span> What the plan says</p><p><span aria-hidden="true">✓</span> What the records show</p><div className="remaining-question"><strong>{updated.summary.openMeetingQuestions}</strong> question to clarify</div><small>Was a make-up session offered?</small></div></div>}
      </div>
      <div className="guardian-position"><GuardianSprite happy={beat >= 4} /></div>
    </div>
    <div className="story-caption" aria-live={playing ? "off" : "polite"} aria-atomic="true"><span className="story-step">0{beat + 1} / 06</span><h2>{STORY_BEATS[beat]}</h2><p>{descriptions[beat]}</p>{beat === 3 && <p className="story-caution">This does not mean the service did not occur.</p>}</div>
    <div className="story-controls"><div className="beat-buttons" role="group" aria-label="Choose a story moment">{STORY_BEATS.map((title, index) => <button key={title} type="button" aria-label={`Show moment ${index + 1}: ${title}`} aria-pressed={beat === index} onClick={() => { setBeat(index); setPaused(true); }}><span /></button>)}</div>
      {reduced ? <span className="motion-off">Motion off · explore at your pace</span> : <button type="button" className="play-control" onClick={() => setPaused(value => !value)}><span aria-hidden="true">{paused ? "▷" : "Ⅱ"}</span>{paused ? "Play story" : "Pause story"}</button>}
    </div>
  </section>;
}
