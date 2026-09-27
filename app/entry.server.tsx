import { isbot } from "isbot";
import { renderToReadableStream } from "react-dom/server";
import type { EntryContext, HandleErrorFunction, RouterContextProvider } from "react-router";
import { isRouteErrorResponse, ServerRouter } from "react-router";
import { turnstileEnabled } from "./lib/env.server";
import { contentSecurityPolicy, createNonce } from "./lib/security-headers";

export const streamTimeout = 5_000;

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
  _loadContext: RouterContextProvider,
) {
  // リクエストごとにnonceを作り、React Router、React、CSPのヘッダーの3か所に渡す（docs/spec.md §12.2）。
  // nonceは loader の返り値や、画面に渡すデータには入れない
  const nonce = createNonce();

  // HTMLは nonce が毎回変わるので、共有のキャッシュに載せない（§13）
  responseHeaders.set("Content-Type", "text/html; charset=utf-8");
  responseHeaders.set("Cache-Control", "private, no-cache");
  // 手元の開発サーバーでは付けない。Viteがインラインのスタイルとスクリプトを差し込むため（§12.2）
  if (import.meta.env.PROD) {
    responseHeaders.set(
      "Content-Security-Policy",
      contentSecurityPolicy({
        nonce,
        https: new URL(request.url).protocol === "https:",
        turnstile: turnstileEnabled(),
      }),
    );
  }

  // https://httpwg.org/specs/rfc9110.html#HEAD
  if (request.method.toUpperCase() === "HEAD") {
    return new Response(null, {
      status: responseStatusCode,
      headers: responseHeaders,
    });
  }

  let shellRendered = false;
  const userAgent = request.headers.get("user-agent");

  const body = await renderToReadableStream(
    <ServerRouter
      context={routerContext}
      url={request.url}
      nonce={nonce}
    />,
    {
      nonce,
      signal: AbortSignal.timeout(streamTimeout + 1000),
      onError(error: unknown) {
        responseStatusCode = 500;
        // Log streaming rendering errors from inside the shell. Don't log
        // errors encountered during initial shell rendering since they'll
        // reject and get logged in handleDocumentRequest.
        if (shellRendered) {
          console.error(error);
        }
      },
    },
  );
  shellRendered = true;

  // Ensure requests from bots and SPA Mode renders wait for all content to load before responding
  // https://react.dev/reference/react-dom/server/renderToPipeableStream#waiting-for-all-content-to-load-for-crawlers-and-static-generation
  if ((userAgent && isbot(userAgent)) || routerContext.isSpaMode) {
    await body.allReady;
  }

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}

/**
 * サーバーで起きたエラーのログ（docs/spec.md §14）。画面にはエラーの中身を出さない。
 * 記録するのは、サーバー側のエラー（500など）と、予期しない例外だけ。
 * フォームの内容や個人情報を出さないよう、リクエストはメソッドとパスだけを書く（クエリも書かない）
 */
export const handleError: HandleErrorFunction = (error, { request }) => {
  // 利用者が移動を取りやめたときなど、中断されたリクエストは記録しない
  if (request.signal.aborted) return;
  // 見つからないURL（404）などの、利用者側の誤りは記録しない。存在しないURLを探る機械的なアクセスでログが埋まるため
  if (isRouteErrorResponse(error) && error.status < 500) return;
  const { pathname } = new URL(request.url);
  console.error(`${request.method} ${pathname}`, error);
};
