import { Fragment } from "react";

// This only marks existing source wording; it never extracts or calculates plan values.
const sourcePhrase = /((?:Frequency|Duration|Sessions per school week|Minutes per session|Date|Status):[ \t]*)([^\r\n]+)/g;

export function hasSourceHighlight(text: string) {
  return new RegExp(sourcePhrase.source).test(text);
}

export function SourceText({ text }: { text: string }) {
  const phrases = [...text.matchAll(sourcePhrase)];
  let cursor = 0;
  return <>{phrases.map(match => {
    const start = match.index!;
    const preceding = text.slice(cursor, start);
    cursor = start + match[0].length;
    return <Fragment key={start}>{preceding}{match[1]}<mark className="source-highlight">{match[2]}</mark></Fragment>;
  })}{text.slice(cursor)}</>;
}
