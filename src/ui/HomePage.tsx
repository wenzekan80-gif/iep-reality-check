import type { DemoData } from "./demo-data";
import { HeroStory } from "./HeroStory";
import { FamilyDrawing, GuardianSprite } from "./GuardianSprite";
import "./home.css";

export function HomePage({ data, onStart }: { data: DemoData; onStart: () => void }) {
  return <div className="home-page">
    <section className="landing-hero" aria-labelledby="home-title">
      <div className="landing-copy"><p className="eyebrow">A LITTLE CLARITY. A LOT OF CARE.</p>
        <h1 id="home-title" tabIndex={-1}>You know your child.<br /><em>We help you understand the paperwork.</em></h1>
        <p className="landing-description">Understand what the plan says,<br className="desktop-break" /> what your current records show,<br className="desktop-break" /> and what you may want to ask next.</p>
        <button className="primary landing-cta" onClick={onStart}>Try Ethan’s fictional story <span aria-hidden="true">→</span></button>
        <p className="fictional-note">Fictional demo — no real student data.</p>
        <p className="gentle-promise"><span aria-hidden="true">◌</span> Built to clarify, not accuse.</p>
      </div>
      <HeroStory data={data} />
    </section>
    <section className="family-story" aria-labelledby="family-title">
      <div className="family-portrait"><div className="portrait-disc"/><FamilyDrawing withChild /><span className="family-names">Mike &amp; Ethan</span></div>
      <div className="family-copy"><p className="eyebrow">MEET THE FAMILY BEHIND THE DEMO</p><h2 id="family-title">Tomorrow is Ethan’s IEP meeting.</h2>
        <p>Ethan is eight years old and receives speech support through an IEP. His dad, Mike, has the IEP, a few service records, and a school email.</p>
        <p>He does not need a legal lecture.<br /><strong>He needs to know what to ask tomorrow.</strong></p>
        <p className="family-disclaimer">Ethan and Mike are fictional characters created for this demo.</p></div>
      <div className="family-guardian" aria-hidden="true"><GuardianSprite /></div>
    </section>
    <ol className="landing-steps"><li><span>01</span><div><h2>Understand the plan</h2><p>Start with what’s written.</p></div></li><li><span>02</span><div><h2>Check the records</h2><p>Bring the pieces together.</p></div></li><li><span>03</span><div><h2>Know what to ask</h2><p>Go into the meeting prepared.</p></div></li></ol>
  </div>;
}
