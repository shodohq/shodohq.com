import { Link } from "react-router";
import { ArticleRow } from "~/components/ArticleRow";
import { CTABand } from "~/components/CTABand";
import { PageHeader, PageTitle } from "~/components/PageHeader";
import { RuleDot } from "~/components/RuleDot";
import { allArticles } from "~/lib/content.server";
import { cx } from "~/lib/cx";
import {
  articlePath,
  breadcrumbJsonLd,
  formatDate,
  pageMeta,
  pageTitle,
  paths,
  siteOriginFrom,
} from "~/lib/site";
import page from "~/styles/page.module.css";
import type { Route } from "./+types/articles";
import styles from "./articles.module.css";

const title = "記事";

export function meta({ matches, location }: Route.MetaArgs) {
  // 絞り込んだページも、canonical は /articles/ にする（§5.2。pageMeta はクエリを使わない）
  return [
    ...pageMeta({
      matches,
      pathname: location.pathname,
      title: pageTitle(title, "ja"),
      description: "業務を止めずに守るための考え方や、制度への備えについて、月に1回お届けします。",
    }),
    breadcrumbJsonLd(siteOriginFrom(matches), "ja", [{ name: title, path: paths.articles }]),
  ];
}

/**
 * カテゴリの絞り込み（docs/spec.md §5.2）。
 * 値はフロントマターの en.category を小文字にしたもの。知らない値はすべてを表示する
 */
const filters = [
  { value: undefined, label: "すべて" },
  { value: "regulation", label: "制度" },
  { value: "approach", label: "考え方" },
  { value: "recovery", label: "復旧" },
] as const;

type CategoryValue = (typeof filters)[number]["value"];

function toCategory(value: string | null): CategoryValue {
  return filters.find((filter) => filter.value !== undefined && filter.value === value)?.value;
}

/** クエリは ?category= だけを見る（パスは使わない。§10） */
export function loader({ request }: Route.LoaderArgs) {
  const category = toCategory(new URL(request.url).searchParams.get("category"));
  const articles = allArticles()
    .filter((article) => !category || article.frontmatter.en.category.toLowerCase() === category)
    .map(({ slug, frontmatter }) => ({
      slug,
      title: frontmatter.title,
      description: frontmatter.description,
      date: frontmatter.date,
      category: frontmatter.category,
    }));
  return { category, articles };
}

/** 記事一覧（参照 ja-articles.html） */
export default function Articles({ loaderData }: Route.ComponentProps) {
  const { category, articles } = loaderData;

  return (
    <>
      <PageHeader
        lang="ja"
        breadcrumb={[{ label: title }]}
      >
        <PageTitle>{title}</PageTitle>
        <RuleDot size="sm" />
        <p className={page.introLead}>
          業務を止めずに守るための考え方や、制度への備えについて、月に1回お届けします。
        </p>
      </PageHeader>

      <section className={styles.list}>
        <div className={styles.toolbar}>
          {/* チップは絞り込んだ一覧へのリンク。JavaScriptが動かなくても絞り込める（§5.2） */}
          <div className={styles.chips}>
            {filters.map((filter) => {
              const selected = filter.value === category;
              return (
                <Link
                  key={filter.label}
                  to={filter.value ? `${paths.articles}?category=${filter.value}` : paths.articles}
                  preventScrollReset
                  aria-current={selected ? "true" : undefined}
                  className={cx(styles.chip, selected && styles.chipSelected)}
                >
                  {filter.label}
                </Link>
              );
            })}
          </div>
          <p
            aria-live="polite"
            className={styles.count}
          >
            {articles.length}件の記事
          </p>
        </div>
        <div className={styles.rows}>
          {articles.map((article) => (
            <ArticleRow
              key={article.slug}
              to={articlePath(article.slug)}
              date={article.date}
              dateLabel={formatDate(article.date, "ja")}
              category={article.category}
              title={article.title}
              description={article.description}
            />
          ))}
        </div>
      </section>

      <CTABand
        label="PoC・デザインパートナー募集"
        heading={["実際の環境で、", "一緒に確かめませんか。"]}
        body="4つの製品はPoCを、Pixie for Operationsはデザインパートナーを募集しています。"
        button="PoCについて相談する"
        to={paths.poc}
      />
    </>
  );
}
