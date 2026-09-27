import styles from "./DependencyChain.module.css";

type DependencyChainProps = {
  /** 左から順に、重要業務を起点にした依存先。3つ目と4つ目の間に「どこで切るか」の点を置く */
  nodes: readonly string[];
  caption: string;
};

/**
 * 依存関係の図（docs/design-system.md §7 DependencyChain）。
 * 丸を罫線で結び、最初の丸だけ塗る。点は「決断の一点」なので、ここ以外に増やさない（§6）
 */
export function DependencyChain({ nodes, caption }: DependencyChainProps) {
  return (
    <figure className={styles.figure}>
      <div className={styles.chain}>
        <ol className={styles.nodes}>
          {nodes.map((node) => (
            <li
              key={node}
              className={styles.node}
            >
              <span
                aria-hidden="true"
                className={styles.circle}
              />
              <span className={styles.label}>{node}</span>
            </li>
          ))}
        </ol>
        <span
          aria-hidden="true"
          className={styles.cut}
        />
      </div>
      <figcaption className={styles.caption}>{caption}</figcaption>
    </figure>
  );
}
