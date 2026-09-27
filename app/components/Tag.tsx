import type { ReactNode } from "react";
import { cx } from "~/lib/cx";
import styles from "./Tag.module.css";

type TagProps = {
  children: ReactNode;
  /** onDark：黒い帯の上（枠を明るい色にする）。muted：枠なしで地を付ける（「Japanese」タグ） */
  tone?: "default" | "onDark" | "muted";
  /** 記事一覧の行のタグ。上下の余白が1px小さい */
  compact?: boolean;
  className?: string;
};

/** 枠線の付いた小さなラベル（docs/design-system.md §7 Tag） */
export function Tag({ children, tone = "default", compact = false, className }: TagProps) {
  return (
    <span
      className={cx(
        styles.tag,
        tone !== "default" && styles[tone],
        compact && styles.compact,
        className,
      )}
    >
      {children}
    </span>
  );
}
