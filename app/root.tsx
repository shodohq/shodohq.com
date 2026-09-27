// フォントは自己ホストする。使う太さだけを読み込む（docs/spec.md §13）
import "@fontsource/shippori-mincho-b1/500.css";
import "@fontsource/shippori-mincho-b1/700.css";
import "@fontsource/shippori-mincho-b1/800.css";
import "@fontsource/zen-kaku-gothic-antique/400.css";
import "@fontsource/zen-kaku-gothic-antique/500.css";
import "@fontsource/zen-kaku-gothic-antique/700.css";
import "./styles/tokens.css";
import "./styles/global.css";

import type { ReactNode } from "react";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  useRouteError,
} from "react-router";
import type { Route } from "./+types/root";
import { ErrorPage, errorTitle } from "./components/ErrorPage";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { siteOrigin, turnstileSiteKey } from "./lib/env.server";
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

export function loader() {
  return {
    siteOrigin: siteOrigin(),
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
