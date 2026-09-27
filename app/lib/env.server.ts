/**
 * 変数と秘密の値の読み出し（docs/spec.md §15.4）
 *
 * cloudflare:workers の env は、名前が .server.ts で終わるモジュールでだけ読む。
 * 画面側のJavaScriptに入らないようにするため（CLAUDE.md）
 */
import { env } from "cloudflare:workers";

/** 本番のオリジン（https://shodohq.com）。canonicalなどの絶対URLに使う */
export function siteOrigin(): string {
  return env.SITE_ORIGIN;
}

/**
 * Turnstileを使うか。サイトキーが入っているときだけ使う（未決。docs/open-items.md #4、docs/spec.md §6.5）。
 * 使うときだけ、CSPに読み込み元を足す（§12.2）
 */
export function turnstileEnabled(): boolean {
  return Boolean(env.TURNSTILE_SITE_KEY);
}
