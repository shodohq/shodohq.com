// フォントは自己ホストする。使う太さだけを読み込む（docs/spec.md §13）
import "@fontsource/shippori-mincho-b1/500.css";
import "@fontsource/shippori-mincho-b1/700.css";
import "@fontsource/shippori-mincho-b1/800.css";
import "@fontsource/zen-kaku-gothic-antique/400.css";
import "@fontsource/zen-kaku-gothic-antique/500.css";
import "@fontsource/zen-kaku-gothic-antique/700.css";
import "./styles/tokens.css";
import "./styles/global.css";

import { type ReactNode, useEffect, useRef } from "react";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  useRouteError,
  useRouteLoaderData,
} from "react-router";
import type { Route } from "./+types/root";
import { ErrorPage, errorTitle } from "./components/ErrorPage";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { trackPageView } from "./lib/analytics";
import { gaMeasurementId, siteOrigin, turnstileSiteKey } from "./lib/env.server";
import {
  alternatePath,
  company,
  isHomePath,
  langFromPath,
  localizePath,
  navSectionOf,
  otherLang,
  paths,
  policyPathOf,
} from "./lib/site";

export const links: Route.LinksFunction = () => [
  // ロゴが決まるまでの仮のファビコン（アクセント色の丸。docs/open-items.md #12）
  { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
];

export function loader({ request }: Route.LoaderArgs) {
  return {
    siteOrigin: siteOrigin(),
    // GAは本番のオリジンで、測定IDがあるときだけ出す（オリジンだけを見る。パスは使わない。§10、§11）
    gaMeasurementId: gaMeasurementId(new URL(request.url).origin),
    // Turnstileを使うときだけ、フォームにサイトキーを渡す（docs/spec.md §6.5、§15.4）
    turnstileSiteKey: turnstileSiteKey(),
  };
}

// 移動のたびに呼び直す必要がない（docs/spec.md §11）
export function shouldRevalidate() {
  return false;
}

/** 404とエラーのページのtitle。ルートの ErrorBoundary が描くときは、この meta だけが使われる（§14） */
export function meta({ error, location }: Route.MetaArgs) {
  if (!error) return [];
  const lang = langFromPath(location.pathname);
  return [{ title: `${errorTitle(lang, errorKind(error))} | ${company.name[lang]}` }];
}

/**
 * ページの外枠。ヘッダーとフッターはここに置き、404とエラーのページにも出す（§14）。
 * ルートの loader がエラーになったときも描けるように、loader のデータは使わない
 */
export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const error = useRouteError();
  const isError = error != null;
  // ルートの loader がエラーになったときは、データがない（§14）
  const gaId = useRouteLoaderData<typeof loader>("root")?.gaMeasurementId;
  usePageViews();
  const lang = langFromPath(pathname);
  // 404とエラーのページの言語切り替えは、もう一方の言語のトップにつなぐ（§14）
  const alternate = isError ? localizePath(otherLang(lang), paths.home) : alternatePath(pathname);

  return (
    <html lang={lang}>
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <Meta />
        <Links />
        {/* 自分のドメインのファイルなので、nonceはいらない。インラインの <script> でGAを書かない（§11） */}
        {gaId && (
          <script
            src="/scripts/ga.js"
            data-ga-id={gaId}
            defer
          />
        )}
      </head>
      <body>
        <Header
          lang={lang}
          current={isError ? undefined : navSectionOf(pathname)}
          home={!isError && isHomePath(pathname)}
          alternate={alternate}
        />
        <main>{children}</main>
        <Footer
          lang={lang}
          currentPolicy={isError ? undefined : policyPathOf(pathname)}
          alternate={alternate}
        />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

/**
 * 画面の中の移動のページビューを、自分で送る（§11）。最初の読み込みは gtag('config') が送るので送らない。
 * React Routerは新しいページのtitleを反映する前にURLを変えるので、GAの自動の計測に任せない。
 * パスかクエリが変わったときだけ送る（ページ内リンクの # だけの移動は数えない）
 */
function usePageViews() {
  const location = useLocation();
  const key = `${location.pathname}${location.search}`;
  const previous = useRef<string | null>(null);
  useEffect(() => {
    if (previous.current !== null && previous.current !== key) trackPageView();
    previous.current = key;
  }, [key]);
}

export default function App() {
  return <Outlet />;
}

/** 見つからないURLと、サーバーのエラー。エラーの中身は画面に出さない（§14） */
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const { pathname } = useLocation();
  return (
    <ErrorPage
      lang={langFromPath(pathname)}
      kind={errorKind(error)}
    />
  );
}

function errorKind(error: unknown) {
  return isRouteErrorResponse(error) && error.status === 404 ? "notFound" : "error";
}
