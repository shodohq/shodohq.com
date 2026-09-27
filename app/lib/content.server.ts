/**
 * 変換済みの記事とポリシーの読み込み（docs/spec.md §8、§9）
 *
 * content/ のMarkdownは、ビルドのときに vite-plugins/content.ts がHTMLに変えてある。
 * ここでは並べ替えて返すだけにする（loader に重い処理を入れない。§13）
 */
import type { ArticleFrontmatter, ContentModule } from "./content-schema";

export type Article = ContentModule<ArticleFrontmatter> & { slug: string };

const articleModules = import.meta.glob<ContentModule<ArticleFrontmatter>>(
  "/content/articles/*.md",
  { eager: true, import: "default" },
);

/** 記事の一覧。date の新しい順、同じ日付なら order の小さい順（§8） */
const articles: Article[] = Object.entries(articleModules)
  .map(([file, module]) => ({ ...module, slug: slugOf(file) }))
  .sort(
    (a, b) =>
      b.frontmatter.date.localeCompare(a.frontmatter.date) ||
      a.frontmatter.order - b.frontmatter.order,
  );

function slugOf(file: string): string {
  return file.slice(file.lastIndexOf("/") + 1, -".md".length);
}

/** 新しい順に最大 count 件 */
export function latestArticles(count: number): Article[] {
  return articles.slice(0, count);
}
