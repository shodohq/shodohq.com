/**
 * Workerの入口（docs/spec.md §15.2）
 *
 * 1. 末尾スラッシュのないURLを、付いたURLに301で転送する
 * 2. React Routerに渡す（contextは渡さない。変数と秘密の値は .server.ts のモジュールで読む）
 * 3. 共通のセキュリティヘッダーと X-Robots-Tag を付ける（§10、§12.1）
 *
 * 静的アセット（/assets/*、/favicon.svg など）は、Workerを通らずに返る。ヘッダーは public/_headers
 */
import { createRequestHandler } from "react-router";
import {
  commonSecurityHeaders,
  NON_HTML_CONTENT_SECURITY_POLICY,
} from "../app/lib/security-headers";

const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE,
);

/** React Routerが画面の中の移動で使うURL。転送しない */
const MANIFEST_PATH = "/__manifest";

/**
 * 末尾スラッシュを足すURLか（§2、§15.2）。
 * 最後の区切りに「.」を含むもの（/sitemap.xml、データ要求の .data、ファイル）は足さない
 */
function needsTrailingSlash(pathname: string): boolean {
  if (pathname.endsWith("/") || pathname === MANIFEST_PATH) return false;
  const lastSegment = pathname.slice(pathname.lastIndexOf("/") + 1);
  return !lastSegment.includes(".");
}

/**
 * 共通のヘッダーを付けた応答にする（§12.1）。
 * 新しい Response に写してから足す（転送などの応答はヘッダーを変えられないため）。status は保つ
 */
function withCommonHeaders(response: Response, request: Request, env: Env): Response {
  const url = new URL(request.url);
  const result = new Response(response.body, response);
  const headers = result.headers;

  for (const [name, value] of commonSecurityHeaders(url.protocol === "https:")) {
    headers.set(name, value);
  }

  // HTMLのページには app/entry.server.tsx がnonce入りのCSPを付けている。上書きしない。
  // HTMLでなく、CSPもまだない応答にだけ、何も読み込ませないCSPを付ける（開発サーバーのページには付けない）
  const isHtml = headers.get("Content-Type")?.startsWith("text/html") ?? false;
  if (import.meta.env.PROD && !isHtml && !headers.has("Content-Security-Policy")) {
    headers.set("Content-Security-Policy", NON_HTML_CONTENT_SECURITY_POLICY);
  }

  // 本番以外のオリジン（プレビュー、手元）と、エラーの応答は検索に載せない（§10）。
  // 手元でLighthouseのSEOを測るときだけ、ALLOW_INDEXING=true で外せる
  const isProduction = url.origin === env.SITE_ORIGIN;
  const allowIndexing = env.ALLOW_INDEXING === "true";
  if ((!isProduction && !allowIndexing) || result.status >= 400) {
    headers.set("X-Robots-Tag", "noindex");
  }

  return result;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (
      (request.method === "GET" || request.method === "HEAD") &&
      needsTrailingSlash(url.pathname)
    ) {
      url.pathname += "/";
      // クエリは残す。Response.redirect() の応答はヘッダーを変えられないので、自分で組む
      const redirect = new Response(null, { status: 301, headers: { Location: url.toString() } });
      return withCommonHeaders(redirect, request, env);
    }
    const response = await requestHandler(request);
    return withCommonHeaders(response, request, env);
  },
} satisfies ExportedHandler<Env>;
