import type { ReactNode } from "react";
import type { Heading } from "~/lib/content-schema";
import { cx } from "~/lib/cx";
import type { Lang } from "~/lib/site";
import styles from "./ContentBody.module.css";

type ContentBodyProps = {
  lang: Lang;
  /** 目次。本文のH2から作ったもの（id は s1、s2…） */
  headings: Heading[];
  /** article：記事（17px、行間2.1）。policy：ポリシー（16px、行間2） */
  variant: "article" | "policy";
  children: ReactNode;
};

const tocLabel = { ja: "目次", en: "Contents" } as const;

/**
 * 記事とポリシーの本文。左に目次、右に本文（docs/spec.md §4、§8、§9）。
 * 1024px未満では、目次を本文の上に置いて <details> で開閉する（design-system.md §8）
 */
export function ContentBody({ lang, headings, variant, children }: ContentBodyProps) {
  const links = headings.map((heading) => (
    <a
      key={heading.id}
      href={`#${heading.id}`}
      className={styles.tocLink}
    >
      {heading.text}
    </a>
  ));

  return (
    <div className={cx(styles.layout, styles[variant])}>
      <nav
        aria-label={tocLabel[lang]}
        className={cx(styles.toc, styles.tocWide)}
      >
        <span className={styles.tocHeading}>{tocLabel[lang]}</span>
        {links}
      </nav>
      <details className={styles.tocNarrow}>
        <summary className={styles.tocSummary}>{tocLabel[lang]}</summary>
        <nav
          aria-label={tocLabel[lang]}
          className={styles.toc}
        >
          {links}
        </nav>
      </details>
      <article className={styles.body}>{children}</article>
    </div>
  );
}

/**
 * ビルドのときにHTMLにした本文（content/ のMarkdown）。
 * 原稿はこのリポジトリの中だけで管理するので、そのまま入れる（docs/spec.md §8）
 */
export function ContentHtml({ html }: { html: string }) {
  return (
    <div
      className={styles.html}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: ビルドのときにリポジトリの原稿から作ったHTML
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
