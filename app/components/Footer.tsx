import type { ReactNode } from "react";
import { Link } from "react-router";
import { company, type Lang, localizePath, paths } from "~/lib/site";
import styles from "./Footer.module.css";

/** フッターのナビの位置。JavaScriptが動かないときに、メニューボタンの代わりのリンクがここを指す（docs/spec.md §5.1） */
export const FOOTER_NAV_ID = "footer-nav";

type FooterProps = {
  lang: Lang;
  /** 表示中のポリシーのページのパス。フッターの該当リンクを太字にする（§3.1） */
  currentPolicy?: string;
  /** もう一方の言語のパス（§3.4） */
  alternate: string;
};

const copy = {
  ja: {
    site: "サイト",
    products: "製品",
    policies: "ポリシー",
    siteLinks: [
      ["トップ", paths.home],
      ["PoC募集", paths.poc],
      ["記事", paths.articles],
      ["会社情報", paths.company],
      ["お問い合わせ", paths.contact],
    ],
    policyLinks: [
      ["セキュリティポリシー", paths.securityPolicy],
      ["脆弱性の報告", `${paths.securityPolicy}#s2`],
      ["プライバシーポリシー", paths.privacy],
    ],
    otherLang: "English",
    copyright: `© 2026 ${company.name.ja}`,
  },
  en: {
    site: "Site",
    products: "Products",
    policies: "Policies",
    siteLinks: [
      ["Home", paths.home],
      ["Design partners", paths.poc],
      ["Articles", paths.articles],
      ["Company", paths.company],
      ["Contact", paths.contact],
    ],
    policyLinks: [
      ["Security policy", paths.securityPolicy],
      ["Report a vulnerability", `${paths.securityPolicy}#s2`],
      ["Privacy policy", paths.privacy],
    ],
    otherLang: "日本語",
    // 年は公開年で固定する（自動で変えない。§3.2）
    copyright: `© 2026 ${company.name.en}`,
  },
} as const;

const productLinks = [
  ["Pixie CAASM", `${paths.products}#caasm`],
  ["Pixie EASM", `${paths.products}#easm`],
  ["Pixie IASM", `${paths.products}#iasm`],
  ["Pixie ASPM", `${paths.products}#aspm`],
  ["Pixie for Operations", paths.pixieForOperations],
] as const;

/** フッター（docs/spec.md §3.2、docs/design-system.md §7 Footer）。リンクの並びは全ページで同じ */
export function Footer({ lang, currentPolicy, alternate }: FooterProps) {
  const t = copy[lang];
  const otherLang = lang === "ja" ? "en" : "ja";

  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <CompanyAddress lang={lang} />
        <div
          id={FOOTER_NAV_ID}
          className={styles.navs}
        >
          <FooterNav label={t.site}>
            {t.siteLinks.map(([label, path]) => (
              <FooterLink
                key={path}
                to={localizePath(lang, path)}
              >
                {label}
              </FooterLink>
            ))}
          </FooterNav>
          <FooterNav label={t.products}>
            {productLinks.map(([label, path]) => (
              <FooterLink
                key={path}
                to={localizePath(lang, path)}
              >
                {label}
              </FooterLink>
            ))}
          </FooterNav>
          <FooterNav label={t.policies}>
            {t.policyLinks.map(([label, path]) => (
              <FooterLink
                key={path}
                to={localizePath(lang, path)}
                current={path === currentPolicy}
              >
                {label}
              </FooterLink>
            ))}
            <Link
              to={alternate}
              lang={otherLang}
              hrefLang={otherLang}
              className={styles.navLink}
            >
              {t.otherLang}
            </Link>
          </FooterNav>
        </div>
      </div>

      <div className={styles.bottom}>
        {/* 大きな「衝動」は装飾なので読み上げない（§3.2） */}
        <span
          aria-hidden="true"
          className={styles.wordmark}
        >
          <span
            lang={lang === "en" ? "ja" : undefined}
            className={styles.wordmarkText}
          >
            衝動
          </span>
          <span className={styles.wordmarkDot} />
        </span>
        <span className={styles.meta}>
          {/* 静的なファイルなので、React Routerの Link にしない */}
          <a
            href={paths.securityTxt}
            className={styles.metaLink}
          >
            {paths.securityTxt}
          </a>
          <span>{t.copyright}</span>
        </span>
      </div>
    </footer>
  );
}

function CompanyAddress({ lang }: { lang: Lang }) {
  const corporateNumber = <a href={company.corporateNumberUrl}>{company.corporateNumber}</a>;

  if (lang === "en") {
    return (
      <address className={styles.address}>
        <span className={styles.line}>{company.name.en}</span>
        <span className={styles.line}>Aizuwakamatsu, Fukushima 965-0003, Japan</span>
        <span className={styles.line}>Founded May 1, 2025</span>
        <span className={styles.line}>Corporate Number {corporateNumber}</span>
      </address>
    );
  }

  return (
    <address className={styles.address}>
      <span className={styles.line}>{company.name.ja}</span>
      <span className={styles.line}>
        〒{company.postalCode}{" "}
        <span className={styles.street}>
          {company.region}
          {company.locality}
          {company.streetAddress}
        </span>
      </span>
      <span className={styles.line}>設立　2025年5月1日</span>
      <span className={styles.line}>法人番号　{corporateNumber}</span>
    </address>
  );
}

function FooterNav({ label, children }: { label: string; children: ReactNode }) {
  return (
    <nav
      aria-label={label}
      className={styles.nav}
    >
      <span className={styles.navHeading}>{label}</span>
      {children}
    </nav>
  );
}

function FooterLink({
  to,
  current = false,
  children,
}: {
  to: string;
  current?: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      to={to}
      aria-current={current ? "page" : undefined}
      className={styles.navLink}
    >
      {children}
    </Link>
  );
}
