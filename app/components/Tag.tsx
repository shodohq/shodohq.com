import type { ReactNode } from "react";
import styles from "./Tag.module.css";

/** 枠線の付いた小さなラベル（docs/design-system.md §7 Tag） */
export function Tag({ children }: { children: ReactNode }) {
  return <span className={styles.tag}>{children}</span>;
}
