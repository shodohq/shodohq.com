/**
 * URL、言語、canonical、hreflang の組み立て（docs/spec.md §2、§3.4、§7、§10）
 *
 * パスはすべて末尾スラッシュ付きで書く。英語は /en/ の下に同じ形で置く。
 */
import type { MetaDescriptor } from "react-router";

export type Lang = "ja" | "en";

/** 日本語のパス。英語は localizePath("en", ...) で /en/ を付ける */
export const paths = {
  home: "/",
  products: "/products/",
  pixieForOperations: "/products/pixie-for-operations/",
  poc: "/poc/",
  articles: "/articles/",
  company: "/company/",
  contact: "/contact/",
  privacy: "/privacy/",
  securityPolicy: "/security-policy/",
  securityTxt: "/.well-known/security.txt",
} as const;

export function articlePath(slug: string): string {
  return `${paths.articles}${slug}/`;
}

/** 言語はURLで決める。/en/ で始まれば英語（§7） */
export function langFromPath(pathname: string): Lang {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "ja";
}

/** 言語の接頭辞を外したパス。"/en/products/" → "/products/" */
export function pathWithoutLang(pathname: string): string {
  if (pathname === "/en") return "/";
  return pathname.startsWith("/en/") ? pathname.slice("/en".length) : pathname;
}

/** 日本語のパスを、その言語のパスにする。localizePath("en", "/products/") → "/en/products/" */
export function localizePath(lang: Lang, path: string): string {
  return lang === "en" ? `/en${path}` : path;
}

export function otherLang(lang: Lang): Lang {
  return lang === "ja" ? "en" : "ja";
}

/** 日本語の記事ページか。記事には英語版がない（§2） */
function isJapaneseArticle(pathname: string): boolean {
  return langFromPath(pathname) === "ja" && /^\/articles\/[^/]+\/?$/.test(pathname);
}

/**
 * 同じページの、もう一方の言語版のパス（§3.4）。
 * 日本語の記事ページだけは、英語版がないので英語の記事一覧につなぐ。
 * 404とエラーのページでは使わない（もう一方の言語のトップにつなぐ。§14）
 */
export function alternatePath(pathname: string): string {
  if (isJapaneseArticle(pathname)) return localizePath("en", paths.articles);
  return localizePath(otherLang(langFromPath(pathname)), pathWithoutLang(pathname));
}

/** ヘッダーのナビの項目。表示中のページの項目に aria-current を付ける（§3.1） */
export type NavSection = "products" | "poc" | "articles" | "company" | "contact";

export const navSections: readonly NavSection[] = [
  "products",
  "poc",
  "articles",
  "company",
  "contact",
];

/**
 * 表示中のページが、ナビのどの項目に当たるか。
 * 製品一覧とPixie for Operationsは「製品」、記事一覧と記事は「記事」。ポリシーのページは当たらない
 */
export function navSectionOf(pathname: string): NavSection | undefined {
  const first = pathWithoutLang(pathname).split("/")[1];
  return navSections.find((section) => section === first);
}

/** ポリシーのページなら、そのパス（フッターの該当リンクを太字にする。§3.1） */
export function policyPathOf(pathname: string): string | undefined {
  const path = pathWithoutLang(pathname);
  return [paths.privacy, paths.securityPolicy].find((policy) => policy === path);
}

/** トップページか。トップは1024px以上でヘッダーの下罫線を付けない（§3.1） */
export function isHomePath(pathname: string): boolean {
  return pathWithoutLang(pathname) === paths.home;
}

const monthsEn = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/**
 * 日付の表示（§7）。日本語は 2026.10.01、英語は Oct 1, 2026。
 * YYYY-MM-DD の文字列を分けて組むので、タイムゾーンで日付がずれない
 */
export function formatDate(ymd: string, lang: Lang): string {
  const [year, month, day] = ymd.split("-");
  if (lang === "ja") return `${year}.${month}.${day}`;
  return `${monthsEn[Number(month) - 1]} ${Number(day)}, ${year}`;
}

/** 会社の情報。フッターと構造化データで使う */
export const company = {
  name: { ja: "株式会社衝動", en: "Shodo Inc." },
  postalCode: "965-0003",
  region: "福島県",
  locality: "会津若松市",
  streetAddress: "一箕町大字八幡 墓料107番地1",
  foundingDate: "2025-05-01",
  corporateNumber: "3011001169688",
  /** 国税庁の法人番号公表サイト */
  corporateNumberUrl:
    "https://www.houjin-bangou.nta.go.jp/henkorireki-johoto.html?selHouzinNo=3011001169688",
} as const;

type RootMatch = { id: string; loaderData?: unknown };

/**
 * ルートの loader が返した SITE_ORIGIN を、meta の matches から取り出す。
 * 絶対URLはリクエストのホストから作らない（プレビューのURLがcanonicalに入らないように。§10）
 */
export function siteOriginFrom(matches: readonly (RootMatch | undefined)[]): string {
  const data = matches.find((match) => match?.id === "root")?.loaderData;
  if (
    data &&
    typeof data === "object" &&
    "siteOrigin" in data &&
    typeof data.siteOrigin === "string"
  ) {
    return data.siteOrigin;
  }
  throw new Error("ルートの loader の siteOrigin がありません");
}

type PageMetaOptions = {
  /** meta の matches。ルートの loader の SITE_ORIGIN を取り出す */
  matches: readonly (RootMatch | undefined)[];
  /** meta の location.pathname。loader の request.url は使わない（§10） */
  pathname: string;
  title: string;
  description: string;
  /** og:type。トップは website、記事は article */
  type?: "website" | "article";
};

/**
 * 各ルートの meta で出す共通のタグ（§7、§10）。
 * React Router の meta は子のルートが親の分を置き換えるので、各ルートでこれを出し直す
 */
export function pageMeta({
  matches,
  pathname,
  title,
  description,
  type = "website",
}: PageMetaOptions): MetaDescriptor[] {
  const origin = siteOriginFrom(matches);
  const absolute = (path: string) => new URL(path, origin).href;
  const lang = langFromPath(pathname);
  // 末尾スラッシュのないURLは workers/app.ts が転送するが、念のためここでもそろえる
  const bare = pathWithoutLang(pathname);
  const path = bare.endsWith("/") ? bare : `${bare}/`;
  const canonical = absolute(localizePath(lang, path));

  // 日本語の記事には英語版がないので、ja だけを出す
  const alternates: MetaDescriptor[] = isJapaneseArticle(pathname)
    ? [{ tagName: "link", rel: "alternate", hrefLang: "ja", href: canonical }]
    : [
        { tagName: "link", rel: "alternate", hrefLang: "ja", href: absolute(path) },
        {
          tagName: "link",
          rel: "alternate",
          hrefLang: "en",
          href: absolute(localizePath("en", path)),
        },
        { tagName: "link", rel: "alternate", hrefLang: "x-default", href: absolute(path) },
      ];

  return [
    { title },
    { name: "description", content: description },
    { tagName: "link", rel: "canonical", href: canonical },
    ...alternates,
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: canonical },
    { property: "og:type", content: type },
    { property: "og:locale", content: lang === "ja" ? "ja_JP" : "en_US" },
  ];
}

/** トップに出す Organization の構造化データ（§10） */
export function organizationJsonLd(origin: string): MetaDescriptor {
  return {
    "script:ld+json": {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: company.name.ja,
      alternateName: company.name.en,
      url: new URL(paths.home, origin).href,
      foundingDate: company.foundingDate,
      address: {
        "@type": "PostalAddress",
        postalCode: company.postalCode,
        addressRegion: company.region,
        addressLocality: company.locality,
        streetAddress: company.streetAddress,
        addressCountry: "JP",
      },
    },
  };
}
