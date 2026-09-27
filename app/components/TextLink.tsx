import type { ReactNode } from "react";
import { Link } from "react-router";
import { cx } from "~/lib/cx";
import styles from "./TextLink.module.css";

/**
 * 下線付きのテキストリンク（docs/design-system.md §7 TextLink）。
 * size は、md が16px（スマホ15px）、sm が15px（スマホ14px）
 */
export function TextLink({
  to,
  children,
  size = "md",
  className,
}: {
  to: string;
  children: ReactNode;
  size?: "md" | "sm";
  className?: string;
}) {
  return (
    <Link
      to={to}
      className={cx(styles.link, styles[size], className)}
    >
      {children}
    </Link>
  );
}
