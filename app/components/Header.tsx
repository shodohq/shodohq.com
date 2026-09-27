import { Link } from "react-router";
import { cx } from "~/lib/cx";
import { mainNavItems } from "~/lib/navigation";
import { type Lang, localizePath, type NavSection, paths } from "~/lib/site";
import styles from "./Header.module.css";
import { MobileMenu } from "./MobileMenu";

type HeaderProps = {
  lang: Lang;
  /** ナビで現在地にする項目。ポリシーと404のページではなし */
  current?: NavSection;
  /** トップページか。1024px以上のトップだけ、下罫線を付けない（docs/spec.md §3.1） */
  home: boolean;
  /** もう一方の言語のパス（§3.4） */
  alternate: string;
};

const navLabel: Record<Lang, string> = { ja: "メイン", en: "Main" };

/** ヘッダー（docs/spec.md §3.1、docs/design-system.md §7 Header）。1024px未満はメニューボタンにまとめる */
export function Header({ lang, current, home, alternate }: HeaderProps) {
  const items = mainNavItems(lang);

  return (
    <header className={cx(styles.header, home && styles.home)}>
      <Link
        to={localizePath(lang, paths.home)}
        className={styles.logo}
      >
        <span
          lang={lang === "en" ? "ja" : undefined}
          className={styles.logoMark}
        >
          衝動
        </span>
        <span className={styles.logoSub}>SHODO</span>
      </Link>

      <nav
        aria-label={navLabel[lang]}
        className={styles.nav}
      >
        {items.map((item) => (
          <Link
            key={item.section}
            to={item.to}
            aria-current={item.section === current ? "page" : undefined}
            className={styles.navLink}
          >
            {item.label}
          </Link>
        ))}
        <LangSwitch
          lang={lang}
          alternate={alternate}
        />
      </nav>

      <MobileMenu
        lang={lang}
        items={items}
        current={current}
        alternate={alternate}
      />
    </header>
  );
}

/** 「JA / EN」。表示中の言語を太字のテキストにし、もう一方をリンクにする（§3.4） */
function LangSwitch({ lang, alternate }: { lang: Lang; alternate: string }) {
  const option = (code: Lang, label: string) =>
    code === lang ? (
      <span className={styles.langCurrent}>{label}</span>
    ) : (
      <Link
        to={alternate}
        lang={code}
        hrefLang={code}
        className={styles.langLink}
      >
        {label}
      </Link>
    );

  return (
    <span className={styles.langSwitch}>
      {option("ja", "JA")}
      <span aria-hidden="true">/</span>
      {option("en", "EN")}
    </span>
  );
}
