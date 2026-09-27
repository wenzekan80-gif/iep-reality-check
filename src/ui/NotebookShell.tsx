"use client";

import type { ReactNode } from "react";
import type { Screen } from "./demo-data";
import { PAGE_FLIP_DURATION, type PageFlip } from "./usePageFlip";

const chapters = [
  { screen: "plan", label: "Plan", title: "Understand the plan" },
  { screen: "review", label: "Evidence", title: "Check the records" },
  { screen: "meeting", label: "Meeting Prep", title: "Prepare for the meeting" },
] as const;

function NotebookBinding() {
  return <div className="notebook-binding" aria-hidden="true">
    {Array.from({ length: 8 }, (_, index) => <i key={index} />)}
  </div>;
}

function FlipSheet({ flip }: { flip: PageFlip }) {
  return <div className={`flip-overlay flip-${flip.direction}`} aria-hidden="true" style={{ animationDuration: `${PAGE_FLIP_DURATION}ms` }}>
    <div className="flip-sheet" style={{ animationDuration: `${PAGE_FLIP_DURATION}ms` }}>
      <div className="flip-sheet-front"><span>Notes for the meeting</span></div>
      <div className="flip-sheet-back" />
    </div>
  </div>;
}

export function NotebookShell({ screen, confirmed, flip, busy, onNavigate, children }: {
  screen: Screen;
  confirmed: boolean;
  flip: PageFlip | null;
  busy: boolean;
  onNavigate: (next: Screen) => void;
  children: ReactNode;
}) {
  const index = chapters.findIndex(chapter => chapter.screen === screen);
  const previous: Screen = index <= 0 ? "home" : chapters[index - 1].screen;
  const next: Screen = index < chapters.length - 1 ? chapters[index + 1].screen : "home";
  const nextLabel = next === "home" ? "Close notebook" : `Next: ${chapters[index + 1].label}`;
  const nextDisabled = busy || (next !== "home" && !confirmed);

  return <div className={`notebook-shell ${screen === "home" ? "notebook-cover" : "notebook-open"}`} data-screen={screen}>
    {screen !== "home" && <>
      <NotebookBinding />
      <nav className="page-tabs" aria-label="Demo steps"><ol>
        {chapters.map((chapter, chapterIndex) => <li key={chapter.screen}>
          <button type="button" className={`page-tab page-tab-${chapter.screen}${screen === chapter.screen ? " is-current" : ""}`}
            aria-label={`${String(chapterIndex + 1).padStart(2, "0")} ${chapter.title}`}
            aria-current={screen === chapter.screen ? "step" : undefined}
            disabled={busy || (chapter.screen !== "plan" && !confirmed)}
            onClick={() => onNavigate(chapter.screen)}>
            <span aria-hidden="true">{String(chapterIndex + 1).padStart(2, "0")}</span>{chapter.label}
          </button>
        </li>)}
      </ol></nav>
    </>}
    <div className="notebook-content" inert={busy}>{children}</div>
    {screen !== "home" && <>
      <nav className="notebook-pagination" aria-label="Notebook pages">
        <button type="button" className="notebook-page-control" disabled={busy} onClick={() => onNavigate(previous)}
          aria-label={previous === "home" ? "Previous: cover" : `Previous: ${chapters[index - 1].label}`}>
          <span aria-hidden="true">←</span><span>Previous</span>
        </button>
        <p className="notebook-page-number"><span>Spread {index + 1} of {chapters.length}</span>
          <span className="notebook-page-dots" aria-hidden="true">{chapters.map(chapter => <i key={chapter.screen} className={screen === chapter.screen ? "is-current" : ""} />)}</span>
        </p>
        <button type="button" className="notebook-page-control" disabled={nextDisabled} onClick={() => onNavigate(next)} aria-label={nextLabel}>
          <span>{next === "home" ? "Close" : "Next"}</span><span aria-hidden="true">→</span>
        </button>
      </nav>
      <button type="button" className="page-dog-ear" disabled={nextDisabled} onClick={() => onNavigate(next)}
        aria-label={next === "home" ? "Fold corner to close notebook" : `Turn page to ${chapters[index + 1].label}`}>
        <span aria-hidden="true">↗</span>
      </button>
    </>}
    {flip && <FlipSheet key={flip.key} flip={flip} />}
  </div>;
}
