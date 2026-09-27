import { Link } from "react-router";
import { cx } from "~/lib/cx";
import { localizePath, paths } from "~/lib/site";
import { Icon } from "./Icon";
import styles from "./ProductList.module.css";
import { Tag } from "./Tag";

/** Pixieの4製品（docs/design-system.md §7 ProductRow） */
const products = {
  ja: [
    {
      id: "caasm",
      code: "CAASM",
      name: "Cyber Asset Attack Surface Management",
      body: "社内に散らばった資産の情報を集め、ひとつの台帳にまとめます。",
    },
    {
      id: "easm",
      code: "EASM",
      name: "External Attack Surface Management",
      body: "外部から見えるドメインや公開サービスを洗い出し、攻撃の入口を把握します。",
    },
    {
      id: "iasm",
      code: "IASM",
      name: "Internal Attack Surface Management",
      body: "社内ネットワークの内側にある、攻撃されうる範囲を洗い出します。",
    },
    {
      id: "aspm",
      code: "ASPM",
      name: "Application Security Posture Management",
      body: "アプリケーションの脆弱性とリスクを、開発から運用まで一元的に管理します。",
    },
  ],
} as const;

const betaLabel = { ja: "ベータ" } as const;

type ProductListProps = {
  lang: "ja";
  /**
   * link：各行を製品一覧の該当箇所へのリンクにする（トップ）。
   * anchor：各行に id を付け、リンクにしない（製品一覧。トップとフッターのリンクの行き先）
   */
  variant: "link" | "anchor";
};

/** 4製品の行。上に太い罫線、行の間に細い罫線 */
export function ProductList({ lang, variant }: ProductListProps) {
  return (
    <div className={cx(styles.list, styles[variant])}>
      {products[lang].map((product) => {
        const content = (
          <>
            <span className={styles.code}>{product.code}</span>
            <span className={styles.text}>
              <span className={styles.name}>{product.name}</span>
              <span className={styles.body}>{product.body}</span>
            </span>
            <span className={styles.aside}>
              <Tag>{betaLabel[lang]}</Tag>
              {variant === "link" && (
                <Icon
                  name="arrowLarge"
                  className={styles.arrow}
                />
              )}
            </span>
          </>
        );

        return variant === "link" ? (
          <Link
            key={product.id}
            to={`${localizePath(lang, paths.products)}#${product.id}`}
            className={styles.row}
          >
            {content}
          </Link>
        ) : (
          <div
            key={product.id}
            id={product.id}
            className={styles.row}
          >
            {content}
          </div>
        );
      })}
    </div>
  );
}
