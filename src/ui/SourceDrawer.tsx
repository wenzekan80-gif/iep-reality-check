"use client";

import { useEffect, useRef } from "react";
import type { SourceBlock } from "../domain/types";
import { resolveSources } from "./demo-data";
import { hasSourceHighlight, SourceText } from "./SourceText";

export function SourceDrawer({ ids, sources, onClose }: {
  ids: string[]; sources: SourceBlock[]; onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const returnFocus = useRef<HTMLElement | null>(typeof document === "undefined" ? null : document.activeElement as HTMLElement);
  const blocks = resolveSources(ids, sources);
  useEffect(() => {
    const element = dialog.current!;
    element.showModal();
    return () => { element.close(); returnFocus.current?.focus(); };
  }, []);
  return <dialog ref={dialog} className="source-drawer notebook-source-drawer" aria-labelledby="source-title"
    onCancel={event => { event.preventDefault(); onClose(); }}
    onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="drawer-content">
      <div className="drawer-heading"><div><p className="eyebrow">ORIGINAL WORDING</p><h2 id="source-title">Source text</h2></div>
        <button className="icon-button" onClick={onClose} aria-label="Close sources" autoFocus>×</button></div>
      <p className="muted">Exact source text. No details have been added.</p>
      {blocks.map(block => <article className="source-block" key={block.id}>
        <h3>{block.documentName}</h3>
        {(block.page != null || block.row != null) && <p className="source-location">
          {block.page != null && `Page ${block.page}`}{block.page != null && block.row != null && " · "}{block.row != null && `Row ${block.row}`}
        </p>}
        <pre><SourceText text={block.text} /></pre>
        {hasSourceHighlight(block.text) && <p className="source-found-note" aria-hidden="true">
          <svg viewBox="0 0 50 36" fill="none"><path d="M45 30C23 33 10 18 11 5M3 14l8-10 10 7" /></svg>
          Found here
        </p>}
      </article>)}
      <p className="small muted">Fictional demo case — no real student data.</p>
    </div>
  </dialog>;
}
