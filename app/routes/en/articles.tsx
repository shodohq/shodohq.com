import { ArticleRow } from "~/components/ArticleRow";
import { CTABand } from "~/components/CTABand";
import { PageHeader, PageTitle } from "~/components/PageHeader";
import { RuleDot } from "~/components/RuleDot";
import { allArticles } from "~/lib/content.server";
import {
  articlePath,
  breadcrumbJsonLd,
  formatDate,
  localizePath,
  pageMeta,
  pageTitle,
  paths,
  siteOriginFrom,
} from "~/lib/site";
import page from "~/styles/page.module.css";
import listStyles from "../articles.module.css";
import type { Route } from "./+types/articles";
import styles from "./articles.module.css";

const title = "Articles";

export function meta({ matches, location }: Route.MetaArgs) {
  return [
    ...pageMeta({
      matches,
      pathname: location.pathname,
      title: pageTitle(title, "en"),
      description:
        "Monthly articles on keeping operations running under cyberattack. Currently published in Japanese.",
    }),
    breadcrumbJsonLd(siteOriginFrom(matches), "en", [{ name: title, path: paths.articles }]),
  ];
}

/**
 * 英語の記事一覧（docs/spec.md §7）。記事は日本語だけなので、
 * 日本語の記事を、フロントマターの en の英語のタイトルと要約で並べ、日本語の記事につなぐ
 */
export function loader() {
  return {
    articles: allArticles().map(({ slug, frontmatter }) => ({
      slug,
      date: frontmatter.date,
      title: frontmatter.en.title,
      description: frontmatter.en.description,
      category: frontmatter.en.category,
    })),
  };
}

/** 英語の記事一覧（参照 en-articles.html）。絞り込みのチップは置かない（§5.2） */
export default function EnglishArticles({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <PageHeader
        lang="en"
        breadcrumb={[{ label: title }]}
      >
        <PageTitle>{title}</PageTitle>
        <RuleDot size="sm" />
        <div className={page.intro}>
          <p className={page.lead}>
            Once a month, we write about keeping operations running under cyberattack and preparing
            for new regulations.
          </p>
          <p className={styles.notice}>
            Our articles are currently published in Japanese only. The links below open the Japanese
            version.
          </p>
        </div>
      </PageHeader>

      <section className={listStyles.list}>
        <div className={listStyles.rows}>
          {loaderData.articles.map((article) => (
            <ArticleRow
              key={article.slug}
              to={articlePath(article.slug)}
              hrefLang="ja"
              date={article.date}
              dateLabel={formatDate(article.date, "en")}
              tags={[{ label: article.category }, { label: "Japanese", tone: "muted" }]}
              title={article.title}
              description={article.description}
            />
          ))}
        </div>
      </section>

      <CTABand
        label="PoCs and design partners"
        heading={["Try it in", "your own environment."]}
        body="The four products are open for PoCs, and Pixie for Operations is looking for design partners."
        button="Talk to us about a PoC"
        to={localizePath("en", paths.poc)}
      />
    </>
  );
}
