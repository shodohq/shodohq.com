import type { ReactNode } from "react";
import { cx } from "~/lib/cx";
import styles from "./SectionHead.module.css";

/**
 * セクションの頭の「見出しとリード」（docs/design-system.md §4）。
 * 2列で下揃えにし、1024px未満では縦に積む。中身は、左の見出しと右のリードの2つを渡す
 */
export function SectionHead({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx(styles.head, className)}>{children}</div>;
}
