import type { Heading, PolicyFrontmatter } from "~/lib/content-schema";
import type { Lang } from "~/lib/site";
import type { BreadcrumbItem } from "./Breadcrumb";
import { ContentBody, ContentHtml } from "./ContentBody";
import { PageHeader, PageTitle } from "./PageHeader";
import styles from "./PolicyPage.module.css";
import { RuleDot } from "./RuleDot";

type PolicyPageProps = {
  lang: Lang;
  /** パンくず（先頭のトップと、最後のページ名を除く） */
  parents?: BreadcrumbItem[];
  policy: { frontmatter: PolicyFrontmatter; html: string; headings: Heading[] };
};

const monthsEn = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/** 制定日。「制定：2026年10月1日」「Effective October 1, 2026」（docs/spec.md §9） */
function effectiveLabel(ymd: string, lang: Lang): string {
  const [year, month, day] = ymd.split("-").map(Number);
  return lang === "ja"
    ? `制定：${year}年${month}月${day}日`
    : `Effective ${monthsEn[month - 1]} ${day}, ${year}`;
}

/** ポリシーのページ（参照 ja-privacy.html、ja-security-policy.html）。H1、制定日、罫線と一点、目次と本文 */
export function PolicyPage({ lang, parents = [], policy }: PolicyPageProps) {
  const { frontmatter, html, headings } = policy;
  return (
    <>
      <PageHeader
        lang={lang}
        breadcrumb={[...parents, { label: frontmatter.title }]}
        bottom="none"
        gap="sm"
      >
        <PageTitle size="policy">{frontmatter.title}</PageTitle>
        <p className={styles.date}>
          <time dateTime={frontmatter.effectiveDate}>
            {effectiveLabel(frontmatter.effectiveDate, lang)}
          </time>
        </p>
        <RuleDot
          size="sm"
          className={styles.rule}
        />
      </PageHeader>
      <ContentBody
        lang={lang}
        headings={headings}
        variant="policy"
      >
        {/* 英語版の注記（翻訳であることの断り）。あるときだけ出す */}
        {frontmatter.translationNotice && (
          <p className={styles.notice}>{frontmatter.translationNotice}</p>
        )}
        <ContentHtml html={html} />
      </ContentBody>
    </>
  );
}
