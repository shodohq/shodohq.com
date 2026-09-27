import { Link } from "react-router";
import styles from "./ArticleRow.module.css";
import { Icon } from "./Icon";
import { Tag } from "./Tag";

type ArticleRowProps = {
  to: string;
  /** YYYY-MM-DD（<time> の dateTime に入れる） */
  date: string;
  dateLabel: string;
  category: string;
  title: string;
  description: string;
};

/** 記事一覧の行（docs/design-system.md §7 ArticleRow）。日付とタグ、明朝のタイトルと要約、右に矢印 */
export function ArticleRow({ to, date, dateLabel, category, title, description }: ArticleRowProps) {
  return (
    <Link
      to={to}
      className={styles.row}
    >
      <span className={styles.meta}>
        <time
          dateTime={date}
          className={styles.date}
        >
          {dateLabel}
        </time>
        <Tag
          compact
          className={styles.tag}
        >
          {category}
        </Tag>
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
