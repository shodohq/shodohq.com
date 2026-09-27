import { Button } from "./Button";
import styles from "./CTABand.module.css";

type CTABandProps = {
  label: string;
  /** 見出しの行。1要素1行 */
  heading: readonly string[];
  body?: string;
  button: string;
  to: string;
};

/**
 * 下層ページの募集の帯（docs/spec.md §3.6）。
 * 左にラベル、明朝の見出し、本文、右に白いボタン。文言はページごとに参照のものを渡す
 */
export function CTABand({ label, heading, body, button, to }: CTABandProps) {
  return (
    <section className={styles.band}>
      <div className={styles.main}>
        <p className={styles.label}>{label}</p>
        <p className={styles.heading}>
          {heading.map((line, index) => (
            <span key={line}>
              {index > 0 && <br />}
              {line}
            </span>
          ))}
        </p>
        {body && <p className={styles.body}>{body}</p>}
      </div>
      <Button
        to={to}
        variant="onAccent"
      >
        {button}
      </Button>
    </section>
  );
}
