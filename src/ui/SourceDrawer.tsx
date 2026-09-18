"use client";

import { useEffect, useRef } from "react";
import type { SourceBlock } from "../domain/types";
import { resolveSources } from "./demo-data";

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
  return <dialog ref={dialog} className="source-drawer" aria-labelledby="source-title"
    onCancel={event => { event.preventDefault(); onClose(); }}
    onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="drawer-content">
      <div className="drawer-heading"><div><p className="eyebrow">BACK TO THE RECORD</p><h2 id="source-title">Your sources</h2></div>
        <button className="icon-button" onClick={onClose} aria-label="Close sources" autoFocus>×</button></div>
      <p className="muted">The exact text behind what you see. No extra details have been added to these excerpts.</p>
      {blocks.map(block => <article className="source-block" key={block.id}>
        <h3>{block.documentName}</h3>
        {(block.page != null || block.row != null) && <p className="source-location">
          {block.page != null && `Page ${block.page}`}{block.page != null && block.row != null && " · "}{block.row != null && `Row ${block.row}`}
        </p>}
        <pre>{block.text}</pre>
      </article>)}
      <p className="small muted">Fictional demo case — no real student data.</p>
    </div>
  </dialog>;
}
