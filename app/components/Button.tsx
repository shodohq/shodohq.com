import type { ReactNode } from "react";
import { Link } from "react-router";
import { cx } from "~/lib/cx";
import styles from "./Button.module.css";
import { Icon } from "./Icon";

type ButtonProps = {
  /** リンクの行き先。ないときは送信のボタン（<button type="submit">）にする */
  to?: string;
  children: ReactNode;
  /** primary：青い地（主ボタン）。onAccent：青い帯の上の白いボタン */
  variant?: "primary" | "onAccent";
  /** 右の矢印。ページ内の下へ移るボタンは下矢印。スマホのメニューの中のボタンだけ付けない */
  icon?: "arrow" | "arrowDown" | false;
  onClick?: () => void;
  /** 送信のボタンだけ。送っている間は押せないようにする（二重に送らないため） */
  disabled?: boolean;
  className?: string;
};

/**
 * ボタン（docs/design-system.md §7 Button）。
 * スマホ（768px未満）では幅いっぱいにする（§8）
 */
export function Button({
  to,
  children,
  variant = "primary",
  icon = "arrow",
  onClick,
  disabled,
  className,
}: ButtonProps) {
  const classes = cx(styles.button, styles[variant], className);
  const content = (
    <>
      {children}
      {icon && (
        <Icon
          name={icon}
          className={styles.icon}
        />
      )}
    </>
  );

  if (to === undefined) {
    return (
      <button
        type="submit"
        onClick={onClick}
        disabled={disabled}
        className={classes}
      >
        {content}
      </button>
    );
  }
  return (
    <Link
      to={to}
      onClick={onClick}
      className={classes}
    >
      {content}
    </Link>
  );
}
