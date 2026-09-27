import styles from "./FieldError.module.css";

type FieldErrorProps = {
  /** 入力欄の aria-describedby から指すid */
  id?: string;
  message?: string;
  /** 送信の失敗のように、すぐ読み上げたいときは alert */
  role?: "alert";
};

/**
 * 項目のエラー（docs/design-system.md §7 FieldError）。
 * 色だけで伝えないよう、文字で出し、先頭に「！」の円のアイコンを置く（§6.3）
 */
export function FieldError({ id, message, role }: FieldErrorProps) {
  if (!message) return null;
  return (
    <p
      id={id}
      role={role}
      className={styles.error}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        aria-hidden="true"
        focusable="false"
        className={styles.icon}
      >
        <circle
          cx="8"
          cy="8"
          r="6.5"
        />
        <path d="M8 4.5v4.5M8 11v.5" />
      </svg>
      {message}
    </p>
  );
}
