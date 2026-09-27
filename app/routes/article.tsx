import { data } from "react-router";
import { ArticleCard } from "~/components/ArticleCard";
import { ContentBody, ContentHtml } from "~/components/ContentBody";
import { CTABand } from "~/components/CTABand";
import { PageHeader, PageTitle } from "~/components/PageHeader";
import { RuleDot } from "~/components/RuleDot";
import { TextLink } from "~/components/TextLink";
import { allArticles, findArticle } from "~/lib/content.server";
import { cx } from "~/lib/cx";
import {
  articleJsonLd,
  articlePath,
  breadcrumbJsonLd,
  formatDate,
  pageMeta,
  pageTitle,
  paths,
  siteOriginFrom,
} from "~/lib/site";
import page from "~/styles/page.module.css";
import type { Route } from "./+types/article";
import styles from "./article.module.css";

/** 知らない slug は404（docs/spec.md §8、§14） */
export function loader({ params }: Route.LoaderArgs) {
  const article = findArticle(params.slug);
  if (!article) throw data(null, { status: 404 });

  // 次に読む：その記事以外を新しい順に最大3件（§8）
  const next = allArticles()
    .filter((other) => other.slug !== article.slug)
    .slice(0, 3)
    .map(({ slug, frontmatter }) => ({
      slug,
      title: frontmatter.title,
      date: frontmatter.date,
      category: frontmatter.category,
    }));

  return { ...article, next };
}

export function meta({ loaderData, matches, location }: Route.MetaArgs) {
  if (!loaderData) return [];
  const { frontmatter, slug } = loaderData;
  const origin = siteOriginFrom(matches);
  return [
    ...pageMeta({
      matches,
      pathname: location.pathname,
      title: pageTitle(frontmatter.title, "ja"),
      description: frontmatter.description,
      type: "article",
    }),
    articleJsonLd(origin, {
      title: frontmatter.title,
      description: frontmatter.description,
      date: frontmatter.date,
      slug,
    }),
    // 構造化データは「トップ > 記事 > 記事のタイトル」（§3.3）
    breadcrumbJsonLd(origin, "ja", [
      { name: "記事", path: paths.articles },
      { name: frontmatter.title, path: articlePath(slug) },
    ]),
  ];
}

/** 記事（参照 ja-article-1.html〜ja-article-3.html） */
export default function Article({ loaderData }: Route.ComponentProps) {
  const { frontmatter, html, headings, next } = loaderData;

  return (
    <>
      {/* パンくずの最後はカテゴリ。いまのページではないので、リンクにも aria-current にもしない（§3.3） */}
      <PageHeader
        lang="ja"
        breadcrumb={[{ label: "記事", to: paths.articles }, { label: frontmatter.category }]}
        breadcrumbLastIsCurrent={false}
        bottom="none"
        gap="sm"
      >
        <p className={styles.meta}>
          <time dateTime={frontmatter.date}>{formatDate(frontmatter.date, "ja")}</time>
          <span>{frontmatter.category}</span>
          <span>{frontmatter.readingMinutes}分で読めます</span>
        </p>
        <PageTitle size="article">{frontmatter.title}</PageTitle>
        <p className={styles.lead}>{frontmatter.lead}</p>
        <RuleDot
          size="sm"
          className={styles.rule}
        />
      </PageHeader>

      <ContentBody
        lang="ja"
        headings={headings}
        variant="article"
      >
        <div className={styles.keyPoints}>
          <p className={styles.keyPointsTitle}>この記事の要点</p>
          <ul className={styles.keyPointsList}>
            {frontmatter.keyPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>
        <ContentHtml html={html} />
        <div className={styles.sources}>
          <p className={styles.sourcesTitle}>出典</p>
          {frontmatter.sources.map((source) => {
            const detail = [source.publisher, source.date].filter(Boolean).join("、");
            return (
              <p key={source.title}>
                {source.url ? <a href={source.url}>{source.title}</a> : source.title}（{detail}）
              </p>
            );
          })}
        </div>
      </ContentBody>

      <section className={cx(page.ruled, styles.next)}>
        <div className={styles.nextHead}>
          <h2 className={styles.nextHeading}>次に読む</h2>
          <TextLink
            to={paths.articles}
            size="sm"
          >
            すべての記事
          </TextLink>
        </div>
        <div className={styles.cards}>
          {next.map((article) => (
            <ArticleCard
              key={article.slug}
              to={articlePath(article.slug)}
              date={article.date}
              dateLabel={formatDate(article.date, "ja")}
              category={article.category}
              title={article.title}
            />
          ))}
        </div>
      </section>

      {/* 募集の帯の文言は記事ごとに違う（フロントマターの cta） */}
      <CTABand
        label={frontmatter.cta.label}
        heading={frontmatter.cta.heading}
        body={frontmatter.cta.body}
        button={frontmatter.cta.button}
        to={paths.poc}
      />
    </>
  );
}
