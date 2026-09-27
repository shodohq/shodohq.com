/**
 * セキュリティヘッダー（docs/spec.md §12）
 *
 * HTMLのページのCSP（nonce入り）は app/entry.server.tsx で付け、
 * そのほかの共通のヘッダーは workers/app.ts で、Workerが返すすべての応答に付ける。
 * Workerを通らない静的アセットのヘッダーは public/_headers に書く。
 */

/** Cloudflare Turnstile の読み込み元と、確認の画面の出どころ（§6.5、§12.2） */
const TURNSTILE_ORIGIN = "https://challenges.cloudflare.com";

type ContentSecurityPolicyOptions = {
  /** リクエストごとに作ったnonce。React Routerの画面を動かすインラインの <script> に付く */
  nonce: string;
  /** https で配信しているか。http の手元では upgrade-insecure-requests を付けない（§12.1） */
  https: boolean;
  /** Turnstileを使うか（TURNSTILE_SITE_KEY が空でないとき）。使うときだけ読み込み元を許す */
  turnstile: boolean;
};

/**
 * HTMLのページのCSP（§12.1、§12.2）。
 * 'unsafe-inline' は使わない。Google Analyticsの許可は、Googleの「広告の機能を使わない場合」の推奨どおり
 */
export function contentSecurityPolicy({ nonce, https, turnstile }: ContentSecurityPolicyOptions) {
  const googleTag = "https://www.googletagmanager.com";
  const analytics = "https://*.google-analytics.com";
  const directives = [
    "default-src 'self'",
    ["script-src 'self'", `'nonce-${nonce}'`, googleTag, turnstile && TURNSTILE_ORIGIN],
    "style-src 'self'",
    ["img-src 'self' data:", googleTag, analytics],
    "font-src 'self'",
    ["connect-src 'self'", googleTag, analytics, "https://*.google.com"],
    turnstile ? `frame-src ${TURNSTILE_ORIGIN}` : "frame-src 'none'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "base-uri 'none'",
    "object-src 'none'",
    https && "upgrade-insecure-requests",
  ];
  return directives
    .filter(Boolean)
    .map((directive) =>
      Array.isArray(directive) ? directive.filter(Boolean).join(" ") : directive,
    )
    .join("; ");
}

/** HTMLでない応答（データ要求、転送、/sitemap.xml など）のCSP。何も読み込ませない（§12.1） */
export const NON_HTML_CONTENT_SECURITY_POLICY = "default-src 'none'; frame-ancestors 'none'";

/** Workerが返すすべての応答に付けるヘッダー（§12.1）。HSTS は https のときだけ */
export function commonSecurityHeaders(https: boolean): [string, string][] {
  const headers: [string, string][] = [
    ["X-Content-Type-Options", "nosniff"],
    ["Referrer-Policy", "strict-origin-when-cross-origin"],
    ["Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=(), usb=()"],
    ["Cross-Origin-Opener-Policy", "same-origin"],
    ["X-Frame-Options", "DENY"],
  ];
  if (https) headers.push(["Strict-Transport-Security", "max-age=31536000; includeSubDomains"]);
  return headers;
}

/** リクエストごとのnonce。16バイトの乱数を base64 にする（§12.2） */
export function createNonce(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return btoa(String.fromCharCode(...bytes));
}
