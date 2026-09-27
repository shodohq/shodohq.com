import type { ReactNode } from "react";
import { cx } from "~/lib/cx";
import type { Lang } from "~/lib/site";
import { Breadcrumb, type BreadcrumbItem } from "./Breadcrumb";
import styles from "./PageHeader.module.css";

type PageHeaderProps = {
  lang: Lang;
  /** パンくず。404のページは出さない（docs/spec.md §14） */
  breadcrumb?: BreadcrumbItem[];
  /** 記事ページだけ false（最後のカテゴリはいまのページではない。§3.3） */
  breadcrumbLastIsCurrent?: boolean;
  /**
   * 下の余白。lg は128px（製品、PoCなど）、md は112px（記事一覧、会社情報など）、
   * none は0（記事とポリシー。すぐ下に本文の2列が続く）
   */
  bottom?: "lg" | "md" | "none";
  /** 項目の間隔。記事とポリシーは32px、それ以外は40px */
  gap?: "md" | "sm";
  /** パンくずの下に並べる中身（H1、罫線と一点、リードなど）。参照の並び順どおりに渡す */
  children: ReactNode;
};

/** 下層ページの頭。パンくずから罫線と一点のあたりまで（参照 ja-company.html など） */
export function PageHeader({
  lang,
  breadcrumb,
  breadcrumbLastIsCurrent,
  bottom = "md",
  gap = "md",
  children,
}: PageHeaderProps) {
  return (
    <div className={cx(styles.header, styles[`bottom-${bottom}`], gap === "sm" && styles.gapSm)}>
      {breadcrumb && (
        <Breadcrumb
          lang={lang}
          items={breadcrumb}
          lastIsCurrent={breadcrumbLastIsCurrent}
        />
      )}
      {children}
    </div>
  );
}

type PageTitleProps = {
  children: ReactNode;
  /** page：下層ページ（104px）。policy：ポリシー（88px）。article：記事（60px） */
  size?: "page" | "policy" | "article";
  className?: string;
};

/** 下層ページのH1 */
export function PageTitle({ children, size = "page", className }: PageTitleProps) {
  return <h1 className={cx(styles.title, styles[size], className)}>{children}</h1>;
}
