import { Link } from "react-router";
import type { Lang } from "~/lib/site";
import styles from "./Breadcrumb.module.css";

export type BreadcrumbItem = { label: string; to?: string };

type BreadcrumbProps = {
  lang: Lang;
  /** 先頭の「トップ」は含めない。最後の項目がいまのページ */
  items: BreadcrumbItem[];
  /**
   * 最後の項目を、いまのページとして扱うか。
   * 記事ページの最後（カテゴリ）はいまのページではないので false にする（docs/spec.md §3.3）
   */
  lastIsCurrent?: boolean;
};

const copy = {
  ja: { label: "パンくずリスト", home: "トップ", separator: "／" },
  en: { label: "Breadcrumb", home: "Home", separator: "/" },
} as const;

/** パンくずリスト（docs/spec.md §3.3）。区切りは読み上げない */
export function Breadcrumb({ lang, items, lastIsCurrent = true }: BreadcrumbProps) {
  const t = copy[lang];
  const all: BreadcrumbItem[] = [{ label: t.home, to: lang === "en" ? "/en/" : "/" }, ...items];

  return (
    <nav
      aria-label={t.label}
      className={styles.breadcrumb}
    >
      <ol className={styles.list}>
        {all.map((item, index) => {
          const last = index === all.length - 1;
          return (
            <li
              key={item.label}
              className={styles.item}
            >
              {index > 0 && <span aria-hidden="true">{t.separator}</span>}
              {last ? (
                <span
                  aria-current={lastIsCurrent ? "page" : undefined}
                  className={styles.last}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.to ?? "/"}
                  className={styles.link}
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
