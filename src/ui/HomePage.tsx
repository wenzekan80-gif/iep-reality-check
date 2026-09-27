import type { DemoData } from "./demo-data";
import { HeroStory } from "./HeroStory";
import { FamilyDrawing, GuardianSprite } from "./GuardianSprite";
import "./home.css";

export function HomePage({ data, onStart }: { data: DemoData; onStart: () => void }) {
  return <div className="home-page">
    <section className="landing-hero" aria-labelledby="home-title">
      <div className="landing-copy"><p className="eyebrow">AN IEP REVIEW NOTEBOOK</p>
        <h1 id="home-title" tabIndex={-1}>Check the records.<br /><em>Prepare for the IEP meeting.</em></h1>
        <p className="landing-description">Review the service plan,<br className="desktop-break" /> compare it with the records,<br className="desktop-break" /> and prepare questions for the meeting.</p>
        <button className="primary landing-cta" onClick={onStart}>Try Ethan’s fictional story <span aria-hidden="true">→</span></button>
        <p className="fictional-note">Fictional demo — no real student data.</p>
        <p className="gentle-promise"><span aria-hidden="true">◌</span> Questions grounded in the records.</p>
      </div>
      <HeroStory data={data} />
    </section>
    <section className="family-story" aria-labelledby="family-title">
      <div className="family-portrait"><div className="portrait-disc"/><FamilyDrawing withChild /><span className="family-names">Mike &amp; Ethan</span></div>
      <div className="family-copy"><p className="eyebrow">THE FICTIONAL CASE</p><h2 id="family-title">Ethan’s IEP meeting is tomorrow.</h2>
        <p>Ethan is eight and receives speech support through an IEP. His dad, Mike, has the plan, a few service records, and a school email.</p>
        <p>Mike is checking the records.<br /><strong>He wants a short list of questions to bring.</strong></p>
        <p className="family-disclaimer">Ethan and Mike are fictional characters created for this demo.</p></div>
      <div className="family-guardian" aria-hidden="true"><GuardianSprite /></div>
    </section>
    <ol className="landing-steps"><li><span>01</span><div><h2>Understand the plan</h2><p>Check frequency and session length.</p></div></li><li><span>02</span><div><h2>Check the records</h2><p>Compare six weeks of records.</p></div></li><li><span>03</span><div><h2>Prepare for the meeting</h2><p>Print your questions and sources.</p></div></li></ol>
  </div>;
}
