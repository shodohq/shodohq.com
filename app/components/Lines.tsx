/** 見出しなどの改行位置を参照どおりに固定する（1要素1行。docs/design-system.md §3「改行」） */
export function Lines({ lines }: { lines: readonly string[] }) {
  return lines.map((line, index) => (
    <span key={line}>
      {index > 0 && <br />}
      {line}
    </span>
  ));
}
