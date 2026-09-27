"use client";

export function LateRecordAction({ added, message, onAdd, onSource }: {
  added: boolean; message: string; onAdd: () => void; onSource: () => void;
}) {
  return <section className={`late-record ${added ? "record-added" : ""}`} aria-label="New evidence">
    <div className="late-icon" aria-hidden="true">{added ? "✓" : "+"}</div>
    <div className="late-copy"><h2>{added ? "Sep 18 record added" : "New service record"}</h2>
      {added ? <p role="status">{message}</p> : <p>Add the fictional Sep 18 record.</p>}</div>
    {added ? <button className="text-button" onClick={onSource}>View added record ↗</button> :
      <button className="primary" onClick={onAdd}>Add Sep 18 record <span aria-hidden="true">+</span></button>}
  </section>;
}
