import { cx } from "~/lib/cx";
import styles from "./RuleDot.module.css";

/**
 * 罫線と一点（docs/spec.md §3.5、docs/design-system.md §6）。
 * 横いっぱいの1pxの罫線の上に、アクセント色の点を置く。装飾なので読み上げない。
 * size は、lg がトップの見出しの2行の間、sm が下層ページのH1の下
 */
export function RuleDot({ size, className }: { size: "lg" | "sm"; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cx(styles.rule, styles[size], className)}
    >
      <span className={styles.dot} />
    </span>
  );
}
