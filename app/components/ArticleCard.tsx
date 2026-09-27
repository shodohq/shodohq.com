import { Link } from "react-router";
import styles from "./ArticleCard.module.css";

type ArticleCardProps = {
  to: string;
  /** YYYY-MM-DD（<time> の dateTime に入れる） */
  date: string;
  /** 表示用の日付（2026.10.01） */
  dateLabel: string;
  category: string;
  title: string;
};

/** 記事カード（docs/design-system.md §7 ArticleCard）。上に太い罫線、日付とカテゴリ、明朝のタイトル */
export function ArticleCard({ to, date, dateLabel, category, title }: ArticleCardProps) {
  return (
    <Link
      to={to}
      className={styles.card}
    >
      <span className={styles.meta}>
        <time dateTime={date}>{dateLabel}</time>
        <span>{category}</span>
      </span>
      <span className={styles.title}>{title}</span>
    </Link>
  );
}
