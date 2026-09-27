import type { ReactNode } from "react";
import styles from "./PageHeader.module.css";
import { RuleDot } from "./RuleDot";

/**
 * 下層ページの頭（H1と、その下の罫線と一点）。参照 ja-company.html など。
 * children は罫線の下に続けて置く（404のページの本文など）。パンくずは下層ページを作るときに足す
 */
export function PageHeader({ title, children }: { title: ReactNode; children?: ReactNode }) {
  return (
    <div className={styles.header}>
      <h1 className={styles.title}>{title}</h1>
      <RuleDot size="sm" />
      {children}
    </div>
  );
}
