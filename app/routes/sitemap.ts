/**
 * /sitemap.xml（docs/spec.md §10）
 *
 * 画面を持たず loader だけのリソースルート。日英の対応を <xhtml:link rel="alternate" hreflang> で入れる。
 * 送信完了のページ、絞り込んだ記事一覧、404は入れない。絶対URLは SITE_ORIGIN から組み立てる
 */
import { allArticles } from "~/lib/content.server";
import { siteOrigin } from "~/lib/env.server";
import { articlePath, type Lang, localizePath, paths } from "~/lib/site";

/** 日英の両方があるページ（日本語のパス） */
const bilingualPages = [
  paths.home,
  paths.products,
  paths.pixieForOperations,
  paths.poc,
  paths.articles,
  paths.company,
  paths.contact,
  paths.privacy,
  paths.securityPolicy,
];

const langs: readonly Lang[] = ["ja", "en"];

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function urlEntry(loc: string, alternates: [string, string][], lastmod?: string): string {
  const links = alternates.map(
    ([hreflang, href]) =>
      `    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${escapeXml(href)}"/>`,
  );
  return [
    "  <url>",
    `    <loc>${escapeXml(loc)}</loc>`,
    ...(lastmod ? [`    <lastmod>${lastmod}</lastmod>`] : []),
    ...links,
    "  </url>",
  ].join("\n");
}

export function loader() {
  const origin = siteOrigin();
  const absolute = (path: string) => new URL(path, origin).href;

  const pages = bilingualPages.flatMap((path) => {
    // x-default は日本語（§7）
    const alternates: [string, string][] = [
      ["ja", absolute(path)],
      ["en", absolute(localizePath("en", path))],
      ["x-default", absolute(path)],
    ];
    return langs.map((lang) => urlEntry(absolute(localizePath(lang, path)), alternates));
  });

  // 記事は日本語だけなので、ja だけを出す（§7）
  const articles = allArticles().map((article) => {
    const loc = absolute(articlePath(article.slug));
    return urlEntry(loc, [["ja", loc]], article.frontmatter.date);
  });

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...pages,
    ...articles,
    "</urlset>",
    "",
  ].join("\n");

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
