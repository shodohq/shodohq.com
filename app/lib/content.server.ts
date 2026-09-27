/**
 * 変換済みの記事とポリシーの読み込み（docs/spec.md §8、§9）
 *
 * content/ のMarkdownは、ビルドのときに vite-plugins/content.ts がHTMLに変えてある。
 * ここでは並べ替えて返すだけにする（loader に重い処理を入れない。§13）
 */
import type { ArticleFrontmatter, ContentModule, PolicyFrontmatter } from "./content-schema";
import type { Lang } from "./site";

export type Article = ContentModule<ArticleFrontmatter> & { slug: string };
export type Policy = ContentModule<PolicyFrontmatter>;
export type PolicyName = "privacy" | "security-policy";

const articleModules = import.meta.glob<ContentModule<ArticleFrontmatter>>(
  "/content/articles/*.md",
  { eager: true, import: "default" },
);

const policyModules = import.meta.glob<Policy>("/content/pages/*.md", {
  eager: true,
  import: "default",
});

/** 記事の一覧。date の新しい順、同じ日付なら order の小さい順（§8） */
const articles: Article[] = Object.entries(articleModules)
  .map(([file, module]) => ({ ...module, slug: fileName(file) }))
  .sort(
    (a, b) =>
      b.frontmatter.date.localeCompare(a.frontmatter.date) ||
      a.frontmatter.order - b.frontmatter.order,
  );

function fileName(file: string): string {
  return file.slice(file.lastIndexOf("/") + 1, -".md".length);
}

/** すべての記事（新しい順） */
export function allArticles(): Article[] {
  return articles;
}

/** 新しい順に最大 count 件 */
export function latestArticles(count: number): Article[] {
  return articles.slice(0, count);
}

export function findArticle(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug);
}

/** content/pages/{name}.{lang}.md */
export function getPolicy(name: PolicyName, lang: Lang): Policy {
  const policy = policyModules[`/content/pages/${name}.${lang}.md`];
  if (!policy) throw new Error(`content/pages/${name}.${lang}.md がありません`);
  return policy;
}
