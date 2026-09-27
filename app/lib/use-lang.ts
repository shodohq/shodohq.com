import { useLocation } from "react-router";
import { type Lang, langFromPath } from "./site";

/**
 * 表示中のページの言語。URL（/en/ で始まるか）で決める（docs/spec.md §7）。
 * 日英で同じルートモジュールを使うページは、これで文言を切り替える
 */
export function useLang(): Lang {
  return langFromPath(useLocation().pathname);
}
