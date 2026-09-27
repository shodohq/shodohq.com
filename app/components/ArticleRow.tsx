import { Link } from "react-router";
import type { Lang } from "~/lib/site";
import styles from "./ArticleRow.module.css";
import { Icon } from "./Icon";
import { Tag } from "./Tag";

type ArticleRowProps = {
  to: string;
  /** YYYY-MM-DD（<time> の dateTime に入れる） */
  date: string;
  dateLabel: string;
  /** カテゴリのタグ。英語の記事一覧は、あとに「Japanese」のタグ（枠なし）が続く */
  tags: readonly { label: string; tone?: "default" | "muted" }[];
  title: string;
  description: string;
  /** 行き先の言語。英語の記事一覧から日本語の記事につなぐときに ja を付ける（docs/spec.md §7） */
  hrefLang?: Lang;
};

/** 記事一覧の行（docs/design-system.md §7 ArticleRow）。日付とタグ、明朝のタイトルと要約、右に矢印 */
export function ArticleRow({
  to,
  date,
  dateLabel,
  tags,
  title,
  description,
  hrefLang,
}: ArticleRowProps) {
  return (
    <Link
      to={to}
      hrefLang={hrefLang}
      className={styles.row}
    >
      <span className={styles.meta}>
        <time
          dateTime={date}
          className={styles.date}
        >
          {dateLabel}
        </time>
        <span className={styles.tags}>
          {tags.map((tag) => (
            <Tag
              key={tag.label}
              tone={tag.tone}
              compact
            >
              {tag.label}
            </Tag>
          ))}
        </span>
      </span>
      <span className={styles.text}>
        <span className={styles.title}>{title}</span>
        <span className={styles.description}>{description}</span>
      </span>
      <Icon
        name="arrowLarge"
        size={28}
        className={styles.arrow}
      />
    </Link>
  );
}
