/** クラス名をつなぐ。偽の値は飛ばす */
export function cx(...names: (string | false | null | undefined)[]): string {
  return names.filter(Boolean).join(" ");
}
