import type { ReactNode } from "react";
import { Link } from "react-router";
import { cx } from "~/lib/cx";
import styles from "./ArrowLink.module.css";
import { Icon } from "./Icon";

/** 「詳しく見る」系の、右に矢印の付いたリンク（docs/design-system.md §7 ArrowLink） */
export function ArrowLink({
  to,
  children,
  className,
}: {
  to: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      to={to}
      className={cx(styles.link, className)}
    >
      {children}
      <Icon
        name="arrow"
        className={styles.icon}
      />
    </Link>
  );
}
