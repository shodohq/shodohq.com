import type { ReactNode } from "react";
import { Link } from "react-router";
import { cx } from "~/lib/cx";
import styles from "./Button.module.css";
import { Icon } from "./Icon";

type ButtonProps = {
  to: string;
  children: ReactNode;
  /** primary：青い地（主ボタン）。onAccent：青い帯の上の白いボタン */
  variant?: "primary" | "onAccent";
  /** 右の矢印。スマホのメニューの中のボタンだけ付けない */
  arrow?: boolean;
  onClick?: () => void;
  className?: string;
};

/**
 * ボタンの形のリンク（docs/design-system.md §7 Button）。
 * スマホ（768px未満）では幅いっぱいにする（§8）
 */
export function Button({
  to,
  children,
  variant = "primary",
  arrow = true,
  onClick,
  className,
}: ButtonProps) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={cx(styles.button, styles[variant], className)}
    >
      {children}
      {arrow && (
        <Icon
          name="arrow"
          className={styles.icon}
        />
      )}
    </Link>
  );
}
