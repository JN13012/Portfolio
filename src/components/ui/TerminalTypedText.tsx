/** Preserve full accessible text and layout while revealing characters visually. */
export function TerminalTypedText({ text, from, chars }: { text: string; from: number; chars: number }) {
  const count = Math.max(0, Math.min(text.length, chars - from))
  return <>
    <span className="sr-only">{text}</span>
    <span aria-hidden="true">{text.slice(0, count)}<span className="invisible">{text.slice(count)}</span></span>
  </>
}
