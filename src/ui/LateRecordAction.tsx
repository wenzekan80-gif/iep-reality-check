"use client";

export function LateRecordAction({ added, message, onAdd, onSource }: {
  added: boolean; message: string; onAdd: () => void; onSource: () => void;
}) {
  return <section className={`late-record ${added ? "record-added" : ""}`} aria-label="New evidence">
    <div className="late-icon" aria-hidden="true">{added ? "✓" : "+"}</div>
    <div className="late-copy"><h2>{added ? "A clearer picture, with one more record." : "Found something new? The picture can change."}</h2>
      {added ? <p role="status">{message}</p> : <p>Try adding the newly found September 18 record from this fictional case.</p>}</div>
    {added ? <button className="text-button" onClick={onSource}>View added record ↗</button> :
      <button className="primary" onClick={onAdd}>I found another service record <span aria-hidden="true">+</span></button>}
  </section>;
}
