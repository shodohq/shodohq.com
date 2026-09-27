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

/**
 * Google Analytics の測定ID（docs/spec.md §11）。
 * 測定IDが空でなく、リクエストのオリジンが本番（SITE_ORIGIN）のときだけ返す。
 * それ以外（手元、プレビュー、IDが空）では null を返し、GAのタグを一切出さない。
 * Cookieの同意の仕組みを足すときも、判断はここにまとめる（地域で分けるなら request.cf?.country を使える）
 */
export function gaMeasurementId(origin: string): string | null {
  const id: string = env.GA_MEASUREMENT_ID;
  const productionOrigin: string = env.SITE_ORIGIN;
  return id !== "" && origin === productionOrigin ? id : null;
}

/** Turnstileのサイトキー。使わないときは null（ルートの loader から画面に渡す。§15.4） */
export function turnstileSiteKey(): string | null {
  return env.TURNSTILE_SITE_KEY || null;
}

/**
 * 秘密の値（wrangler secret put で設定する。§15.4）。
 * どれも、置かれていない環境がある（手元、プレビュー、Turnstileを使わない場合）ので、なくてもよい形で読む。
 * 型は .dev.vars からの推測に頼らず、ここで決める（.dev.vars のないCIでも型チェックが通るように。§15.3）
 */
type Secrets = {
  SLACK_WEBHOOK_URL?: string;
  SLACK_WEBHOOK_URL_SECURITY?: string;
  SLACK_WEBHOOK_URL_PREVIEW?: string;
  TURNSTILE_SECRET_KEY?: string;
};

const secrets = env as Secrets;

/**
 * フォームの投稿先のWebhook URL（§6.5）。
 * 本番は SLACK_WEBHOOK_URL（脆弱性の報告は、SLACK_WEBHOOK_URL_SECURITY があればそちら）。
 * 本番以外（プレビューと手元）は、テスト用の SLACK_WEBHOOK_URL_PREVIEW だけ。本番のチャンネルには送らない
 */
export function slackWebhookUrl({
  production,
  vulnerability,
}: {
  production: boolean;
  vulnerability: boolean;
}): string | undefined {
  if (!production) return secrets.SLACK_WEBHOOK_URL_PREVIEW || undefined;
  if (vulnerability && secrets.SLACK_WEBHOOK_URL_SECURITY)
    return secrets.SLACK_WEBHOOK_URL_SECURITY;
  return secrets.SLACK_WEBHOOK_URL || undefined;
}

/** Turnstileの秘密鍵。使わないときは undefined */
export function turnstileSecretKey(): string | undefined {
  return secrets.TURNSTILE_SECRET_KEY || undefined;
}

/** 連続送信の制限（IPアドレスごとに60秒に5回まで。wrangler.jsonc の ratelimits） */
export function inquiryLimiter(): RateLimit {
  return env.INQUIRY_LIMITER;
}
