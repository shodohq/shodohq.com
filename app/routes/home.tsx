import { ArrowLink } from "~/components/ArrowLink";
import { ArticleCard } from "~/components/ArticleCard";
import { Button } from "~/components/Button";
import { Lines } from "~/components/Lines";
import { ProductList } from "~/components/ProductList";
import { RuleDot } from "~/components/RuleDot";
import { SectionHead } from "~/components/SectionHead";
import { Tag } from "~/components/Tag";
import { TextLink } from "~/components/TextLink";
import { latestArticles } from "~/lib/content.server";
import { cx } from "~/lib/cx";
import {
  articlePath,
  formatDate,
  langFromPath,
  localizePath,
  organizationJsonLd,
  pageMeta,
  paths,
  siteOriginFrom,
} from "~/lib/site";
import { useLang } from "~/lib/use-lang";
import page from "~/styles/page.module.css";
import type { Route } from "./+types/home";
import styles from "./home.module.css";

/** 文言（参照 ja-top.html、en-top.html） */
const copy = {
  ja: {
    title: "株式会社衝動 | 止めずに、守る。",
    description:
      "サイバー攻撃を受けたとき、どこを止めれば、何が止まり、何が残るのか。株式会社衝動は、業務を止めずに守るためのセキュリティ製品「Pixie」をつくっています。",
    heroLabel: "業務を止めないためのサイバーセキュリティ",
    heroTitle: ["止めずに、", "守る。"],
    heroLead:
      "サイバー攻撃を受けたとき、どこを止めれば、何が止まり、何が残るのか。株式会社衝動は、業務を止めずに守るためのセキュリティ製品「Pixie」をつくっています。",
    // 日本語はページ内の製品のセクションへ、英語は製品一覧へ（docs/spec.md §4）
    productsLink: { label: "製品を見る", to: "#products" },
    join: "PoCに参加する",
    statement: ["計算はAIに、", "決断は人に。"],
    nameLabel: "「衝動」という名前について",
    nameBody:
      "AIの時代に、人間に必要なのは衝動だと考えています。計算や分析は、AIに任せられるようになりました。それでも、何を守り、どこで踏みとどまるかを決めるのは人です。Pixieも、AIが考え、人が決めるという分担で設計しています。",
    problemsHeading: ["攻撃は、", "業務停止として", "やってくる。"],
    problemsLead:
      "2025年、国内でもランサムウェアによって受注や出荷が止まり、影響が数か月続く事案が相次ぎました。被害を小さくするための判断材料は、いまも現場と経営のあいだに散らばったままです。",
    problems: [
      {
        numeral: "一",
        title: "止め方にジレンマがある",
        body: "被害を封じ込めるためにネットワークを遮断すると、事業まで止まってしまう。どこを切れば何が残るかがわからないと、「全部止める」しか選べません。",
      },
      {
        numeral: "二",
        title: "停止の地図がない",
        body: "業務とシステム、ID、委託先、担当者の依存関係は、台帳・構成図・契約書、そして担当者の頭の中に散らばっています。",
      },
      {
        numeral: "三",
        title: "戻せるかがわからない",
        body: "手順書の置き場所、復旧用IDの依存、バックアップの保管場所。復旧を止める要因は、平時にはほとんど点検されていません。",
      },
    ],
    opsTag: "開発中・デザインパートナー募集",
    opsHeading: ["どこを止めれば、", "何が残るか。"],
    opsLead:
      "資産台帳、構成図、契約書、手順書から、重要業務がどのシステム・ID・委託先・バックアップに依存しているかを示す「停止の地図」をつくります。攻撃を受けたときは、拡散を止めながら重要業務をできるだけ残す遮断案を示し、経営判断の言葉で説明します。",
    features: [
      {
        label: "平時に描く",
        title: "停止の地図",
        body: "手元の文書と既存ツールの出力をAIが読み込み、業務からシステム、ID、委託先、担当者、バックアップまでの依存関係を組み立てます。書類同士の矛盾や、放置された委託先アカウントも洗い出します。",
      },
      {
        label: "有事に選ぶ",
        title: "止め方AI",
        body: "侵入の起点ごとに、拡散を止めつつ重要業務を最大限残す遮断の組み合わせを、平時のうちに計算しておきます。有事には状況に合う案を選び、何が止まり何が残るかを示します。",
      },
      {
        label: "戻せるかを確かめる",
        title: "復旧検査",
        body: "「このシステムが暗号化されたら戻せるか」を机上で検証します。手順書の置き場所、復旧用IDの依存、担当者の偏りなど、復旧の詰まりを平時に見つけます。",
      },
    ],
    principlesLabel: "設計方針",
    principles: [
      "読み取り専用で動く",
      "センサーやエージェントの設置は不要",
      "国内・閉域で動かせる構成を選べる",
    ],
    separator: "／",
    opsMore: "Pixie for Operationsを詳しく見る",
    productsEyebrow: "Pixie シリーズ",
    productsHeading: ["地図の材料を、", "4つの製品で集める。"],
    productsLead:
      "Pixieの4製品は、それぞれ単独で導入できます。集めた資産と攻撃面のデータは、Pixie for Operationsがつくる「停止の地図」の材料になります。現在ベータ版として、PoCにご参加いただける企業を募集しています。",
    ctaLabel: "PoC・デザインパートナー募集",
    ctaHeading: ["PoCと", "デザインパートナーを", "募集しています。"],
    ctaBody:
      "Pixieの4製品のPoCと、開発中のPixie for Operationsを一緒に磨いてくださるデザインパートナーを募集しています。基幹インフラ・重要インフラの事業者、供給網を担う製造・物流企業、サイバー対処能力強化法への対応を支援するSI・コンサルティング会社からのご相談をお待ちしています。",
    ctaButton: "PoCについて相談する",
    terms: [
      {
        term: "対象",
        detail: ["Pixie CAASM・EASM・IASM・ASPM（ベータ版）", "Pixie for Operations（開発中）"],
      },
      { term: "条件", detail: ["期間・費用・データの扱いは、ご相談のうえ個別に決めます。"] },
      { term: "ご連絡", detail: ["お問い合わせから3営業日以内にご返信します。"] },
    ],
    articlesHeading: "記事",
    allArticles: "すべての記事",
  },
  en: {
    title: "Shodo Inc. | Defend without shutting down.",
    description:
      "When a cyberattack hits, what should you isolate, and what will keep running? Shodo builds Pixie, security products designed to protect your business without bringing it to a halt.",
    heroLabel: "Cybersecurity that keeps operations running",
    heroTitle: ["Defend without", "shutting down."],
    heroLead:
      "When a cyberattack hits, what should you isolate, and what will keep running? Shodo builds Pixie, a family of security products designed to protect your business without bringing it to a halt.",
    productsLink: { label: "See products", to: localizePath("en", paths.products) },
    join: "Join the PoC",
    statement: ["Let AI do the math.", "Leave the decision to people."],
    nameLabel: "About our name",
    // 英語ページの中の日本語には lang="ja" を付ける（docs/spec.md §7）
    nameBody: (
      <>
        Shodō (<span lang="ja">衝動</span>) means “impulse” in Japanese. In the age of AI, we
        believe that impulse, the human drive to decide, matters more than ever. AI can now take on
        calculation and analysis. But deciding what to protect, and where to hold the line, is still
        up to people. Pixie is designed around that division of roles.
      </>
    ),
    problemsHeading: ["Attacks now arrive", "as business outages."],
    problemsLead:
      "In 2025, ransomware attacks in Japan stopped order processing and shipping for months at a time. The information needed to limit that damage is still scattered between the front line and the boardroom.",
    problems: [
      {
        numeral: "1",
        title: "No good way to contain",
        body: "Cutting off the network to contain an attack can shut down the business itself. Without knowing what each cut will stop and what it will leave running, “shut everything down” becomes the only option.",
      },
      {
        numeral: "2",
        title: "No map of what would stop",
        body: "The dependencies between business processes, systems, identities, contractors, and people are scattered across inventories, diagrams, contracts, and people’s heads.",
      },
      {
        numeral: "3",
        title: "No way to know you can recover",
        body: "Where runbooks live, which identities recovery depends on, where backups are kept: the things that block recovery are rarely checked before an incident.",
      },
    ],
    opsTag: "In development · Seeking design partners",
    opsHeading: ["What to stop,", "and what survives."],
    opsLead:
      "Pixie for Operations builds an “outage map” from your asset inventories, network diagrams, contracts, and runbooks, showing which systems, identities, contractors, and backups your critical operations depend on. When an attack hits, it proposes containment plans that stop the spread while keeping as much of the business running as possible, and explains them in terms executives can act on.",
    features: [
      {
        label: "Map it in advance",
        title: "Outage map",
        body: "AI reads your existing documents and tool exports to trace dependencies from critical operations to systems, identities, contractors, people, and backups.",
      },
      {
        label: "Choose in an incident",
        title: "Containment AI",
        body: "For each possible point of entry, it precomputes isolation plans that stop the spread while preserving critical operations, then shows what each plan stops and what it keeps running.",
      },
      {
        label: "Confirm you can recover",
        title: "Recovery check",
        body: "It tests on paper whether a system could be restored if encrypted, surfacing blockers such as runbooks stored on the systems that would go down.",
      },
    ],
    principlesLabel: "Design principles",
    principles: ["Read-only", "No sensors or agents", "Runs on closed networks and on-premises"],
    separator: "/",
    opsMore: "Learn about Pixie for Operations",
    productsEyebrow: "The Pixie series",
    productsHeading: ["Four products,", "one map."],
    productsLead:
      "Each of the four Pixie products can be deployed on its own. The asset and attack-surface data they collect becomes raw material for the outage map in Pixie for Operations. All four are in beta, and we are looking for companies to try them in a proof of concept.",
    ctaLabel: "PoCs and design partners",
    ctaHeading: ["Join a PoC, or", "become a design partner."],
    ctaBody:
      "Try the four Pixie products in a proof of concept, or help shape Pixie for Operations as a design partner. We would especially like to hear from critical infrastructure operators, manufacturers and logistics companies at the heart of supply chains, and the system integrators and consultancies that support them.",
    ctaButton: "Talk to us about a PoC",
    terms: [
      {
        term: "Products",
        detail: [
          "Pixie CAASM, EASM, IASM, and ASPM (beta)",
          "Pixie for Operations (in development)",
        ],
      },
      { term: "Terms", detail: ["Duration, cost, and data handling are agreed case by case."] },
      { term: "Response", detail: ["We reply within three business days."] },
    ],
    articlesHeading: "",
    allArticles: "",
  },
} as const;

export function meta({ matches, location }: Route.MetaArgs) {
  const t = copy[langFromPath(location.pathname)];
  return [
    ...pageMeta({
      matches,
      pathname: location.pathname,
      title: t.title,
      description: t.description,
    }),
    organizationJsonLd(siteOriginFrom(matches)),
  ];
}

/**
 * 記事は新しい順に3件（docs/spec.md §8）。画面に要るものだけを返す。
 * 英語のトップには記事のセクションがない（記事が日本語だけのため。§4）
 */
export function loader() {
  return {
    articles: latestArticles(3).map(({ slug, frontmatter }) => ({
      slug,
      title: frontmatter.title,
      date: frontmatter.date,
      category: frontmatter.category,
    })),
  };
}

/** トップ（参照 ja-top.html、ja-top-mobile.html、en-top.html） */
export default function Home({ loaderData }: Route.ComponentProps) {
  const lang = useLang();
  const t = copy[lang];

  return (
    <>
      <section className={styles.hero}>
        <p className={styles.heroLabel}>{t.heroLabel}</p>
        <h1 className={styles.heroTitle}>
          <span>{t.heroTitle[0]}</span>
          <RuleDot size="lg" />
          <span className={styles.heroTitleEnd}>{t.heroTitle[1]}</span>
        </h1>
        <div className={styles.heroFoot}>
          <p className={styles.heroLead}>{t.heroLead}</p>
          <div className={styles.heroActions}>
            <TextLink
              to={t.productsLink.to}
              className={styles.heroLink}
            >
              {t.productsLink.label}
            </TextLink>
            <Button to={localizePath(lang, paths.poc)}>{t.join}</Button>
          </div>
        </div>
      </section>

      <section
        id="company"
        className={styles.statement}
      >
        <p className={styles.statementText}>
          <Lines lines={t.statement} />
        </p>
        <div className={styles.statementNote}>
          <p className={styles.statementLabel}>{t.nameLabel}</p>
          <p className={styles.statementBody}>{t.nameBody}</p>
        </div>
      </section>

      <section className={cx(page.section, page.gapLg, styles.problems)}>
        <SectionHead className={styles.problemsHead}>
          <h2 className={page.heading}>
            <Lines lines={t.problemsHeading} />
          </h2>
          <p className={page.lead}>{t.problemsLead}</p>
        </SectionHead>
        <div className={styles.rows}>
          {t.problems.map((problem) => (
            <div
              key={problem.numeral}
              className={styles.row}
            >
              <span className={styles.numeral}>{problem.numeral}</span>
              <h3 className={styles.rowTitle}>{problem.title}</h3>
              <p className={styles.rowBody}>{problem.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="operations"
        className={cx(page.section, page.gapLg, page.ruled)}
      >
        <SectionHead>
          <div className={page.headMain}>
            <div className={styles.eyebrowRow}>
              <p className={page.eyebrow}>Pixie for Operations</p>
              {/* 開発中の製品であることの表示。外さない（CLAUDE.md） */}
              <Tag>{t.opsTag}</Tag>
            </div>
            <h2 className={page.headingLg}>
              <Lines lines={t.opsHeading} />
            </h2>
          </div>
          <p className={page.lead}>{t.opsLead}</p>
        </SectionHead>
        <ol className={styles.features}>
          {t.features.map((feature) => (
            <li
              key={feature.title}
              className={styles.feature}
            >
              <p className={page.label}>{feature.label}</p>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureBody}>{feature.body}</p>
            </li>
          ))}
        </ol>
        <div className={styles.principles}>
          <span className={page.label}>{t.principlesLabel}</span>
          {t.principles.map((principle, index) => (
            <span
              key={principle}
              className={styles.principle}
            >
              {index > 0 && (
                <span
                  aria-hidden="true"
                  className={styles.separator}
                >
                  {t.separator}
                </span>
              )}
              {principle}
            </span>
          ))}
        </div>
        <ArrowLink
          to={localizePath(lang, paths.pixieForOperations)}
          className={styles.more}
        >
          {t.opsMore}
        </ArrowLink>
      </section>

      <section
        id="products"
        className={cx(page.section, page.ruled, styles.products)}
      >
        <SectionHead>
          <div className={page.headMain}>
            <p className={page.eyebrow}>{t.productsEyebrow}</p>
            <h2 className={cx(page.headingLg, styles.productsHeading)}>
              <Lines lines={t.productsHeading} />
            </h2>
          </div>
          <p className={page.lead}>{t.productsLead}</p>
        </SectionHead>
        {/* 各行は製品一覧の該当箇所につなぐ（docs/spec.md §4） */}
        <ProductList
          lang={lang}
          variant="link"
        />
      </section>

      <section
        id="poc"
        className={styles.cta}
      >
        <div className={styles.ctaMain}>
          <p className={styles.ctaLabel}>{t.ctaLabel}</p>
          <h2 className={cx(page.heading, styles.ctaHeading)}>
            <Lines lines={t.ctaHeading} />
          </h2>
          <p className={styles.ctaBody}>{t.ctaBody}</p>
          <div className={styles.ctaAction}>
            <Button
              to={localizePath(lang, paths.poc)}
              variant="onAccent"
            >
              {t.ctaButton}
            </Button>
          </div>
        </div>
        <dl className={styles.terms}>
          {t.terms.map((item) => (
            <div
              key={item.term}
              className={styles.term}
            >
              <dt>{item.term}</dt>
              <dd>
                <Lines lines={item.detail} />
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* 記事は日本語だけなので、英語のトップには出さない（§4） */}
      {lang === "ja" && (
        <section
          id="articles"
          className={styles.articles}
        >
          <div className={styles.articlesHead}>
            <h2 className={styles.articlesHeading}>{t.articlesHeading}</h2>
            <TextLink
              to={paths.articles}
              size="sm"
            >
              {t.allArticles}
            </TextLink>
          </div>
          <div className={styles.cards}>
            {loaderData.articles.map((article) => (
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
      )}
    </>
  );
}
