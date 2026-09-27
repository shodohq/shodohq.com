import { Link } from "react-router";
import { ArrowLink } from "~/components/ArrowLink";
import { ArticleCard } from "~/components/ArticleCard";
import { Button } from "~/components/Button";
import { Icon } from "~/components/Icon";
import { RuleDot } from "~/components/RuleDot";
import { SectionHead } from "~/components/SectionHead";
import { Tag } from "~/components/Tag";
import { TextLink } from "~/components/TextLink";
import { latestArticles } from "~/lib/content.server";
import { cx } from "~/lib/cx";
import {
  articlePath,
  formatDate,
  organizationJsonLd,
  pageMeta,
  paths,
  siteOriginFrom,
} from "~/lib/site";
import type { Route } from "./+types/home";
import styles from "./home.module.css";

export function meta({ matches, location }: Route.MetaArgs) {
  return [
    ...pageMeta({
      matches,
      pathname: location.pathname,
      title: "株式会社衝動 | 止めずに、守る。",
      description:
        "サイバー攻撃を受けたとき、どこを止めれば、何が止まり、何が残るのか。株式会社衝動は、業務を止めずに守るためのセキュリティ製品「Pixie」をつくっています。",
    }),
    organizationJsonLd(siteOriginFrom(matches)),
  ];
}

/** 記事は新しい順に3件（docs/spec.md §8）。画面に要るものだけを返す */
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

const problems = [
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
];

const features = [
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
];

const principles = [
  "読み取り専用で動く",
  "センサーやエージェントの設置は不要",
  "国内・閉域で動かせる構成を選べる",
];

/** 各行は製品一覧の該当箇所につなぐ（docs/spec.md §4） */
const products = [
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
];

/** トップ（参照 ja-top.html、ja-top-mobile.html） */
export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <section className={styles.hero}>
        <p className={styles.heroLabel}>業務を止めないためのサイバーセキュリティ</p>
        <h1 className={styles.heroTitle}>
          <span>止めずに、</span>
          <RuleDot size="lg" />
          <span className={styles.heroTitleEnd}>守る。</span>
        </h1>
        <div className={styles.heroFoot}>
          <p className={styles.heroLead}>
            サイバー攻撃を受けたとき、どこを止めれば、何が止まり、何が残るのか。株式会社衝動は、業務を止めずに守るためのセキュリティ製品「Pixie」をつくっています。
          </p>
          <div className={styles.heroActions}>
            <TextLink
              to="#products"
              className={styles.heroLink}
            >
              製品を見る
            </TextLink>
            <Button to={paths.poc}>PoCに参加する</Button>
          </div>
        </div>
      </section>

      <section
        id="company"
        className={styles.statement}
      >
        <p className={styles.statementText}>
          計算はAIに、
          <br />
          決断は人に。
        </p>
        <div className={styles.statementNote}>
          <p className={styles.statementLabel}>「衝動」という名前について</p>
          <p className={styles.statementBody}>
            AIの時代に、人間に必要なのは衝動だと考えています。計算や分析は、AIに任せられるようになりました。それでも、何を守り、どこで踏みとどまるかを決めるのは人です。Pixieも、AIが考え、人が決めるという分担で設計しています。
          </p>
        </div>
      </section>

      <section className={cx(styles.section, styles.problems)}>
        <SectionHead className={styles.problemsHead}>
          <h2 className={styles.heading}>
            攻撃は、
            <br />
            業務停止として
            <br />
            やってくる。
          </h2>
          <p className={styles.lead}>
            2025年、国内でもランサムウェアによって受注や出荷が止まり、影響が数か月続く事案が相次ぎました。被害を小さくするための判断材料は、いまも現場と経営のあいだに散らばったままです。
          </p>
        </SectionHead>
        <div className={styles.rows}>
          {problems.map((problem) => (
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
        className={cx(styles.section, styles.ruled)}
      >
        <SectionHead>
          <div className={styles.headMain}>
            <div className={styles.eyebrowRow}>
              <p className={styles.eyebrow}>Pixie for Operations</p>
              {/* 開発中の製品であることの表示。外さない（CLAUDE.md） */}
              <Tag>開発中・デザインパートナー募集</Tag>
            </div>
            <h2 className={styles.headingLg}>
              どこを止めれば、
              <br />
              何が残るか。
            </h2>
          </div>
          <p className={styles.lead}>
            資産台帳、構成図、契約書、手順書から、重要業務がどのシステム・ID・委託先・バックアップに依存しているかを示す「停止の地図」をつくります。攻撃を受けたときは、拡散を止めながら重要業務をできるだけ残す遮断案を示し、経営判断の言葉で説明します。
          </p>
        </SectionHead>
        <ol className={styles.features}>
          {features.map((feature) => (
            <li
              key={feature.title}
              className={styles.feature}
            >
              <p className={styles.featureLabel}>{feature.label}</p>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureBody}>{feature.body}</p>
            </li>
          ))}
        </ol>
        <div className={styles.principles}>
          <span className={styles.principlesLabel}>設計方針</span>
          {principles.map((principle, index) => (
            <span
              key={principle}
              className={styles.principle}
            >
              {index > 0 && (
                <span
                  aria-hidden="true"
                  className={styles.separator}
                >
                  ／
                </span>
              )}
              {principle}
            </span>
          ))}
        </div>
        <ArrowLink
          to={paths.pixieForOperations}
          className={styles.more}
        >
          Pixie for Operationsを詳しく見る
        </ArrowLink>
      </section>

      <section
        id="products"
        className={cx(styles.section, styles.ruled, styles.products)}
      >
        <SectionHead>
          <div className={styles.headMain}>
            <p className={styles.eyebrow}>Pixie シリーズ</p>
            <h2 className={cx(styles.headingLg, styles.productsHeading)}>
              地図の材料を、
              <br />
              4つの製品で集める。
            </h2>
          </div>
          <p className={styles.lead}>
            Pixieの4製品は、それぞれ単独で導入できます。集めた資産と攻撃面のデータは、Pixie for
            Operationsがつくる「停止の地図」の材料になります。現在ベータ版として、PoCにご参加いただける企業を募集しています。
          </p>
        </SectionHead>
        <div className={styles.productList}>
          {products.map((product) => (
            <Link
              key={product.id}
              to={`${paths.products}#${product.id}`}
              className={styles.product}
            >
              <span className={styles.productCode}>{product.code}</span>
              <span className={styles.productText}>
                <span className={styles.productName}>{product.name}</span>
                <span className={styles.productBody}>{product.body}</span>
              </span>
              <span className={styles.productAside}>
                <Tag>ベータ</Tag>
                <Icon
                  name="arrowLarge"
                  className={styles.productArrow}
                />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section
        id="poc"
        className={styles.cta}
      >
        <div className={styles.ctaMain}>
          <p className={styles.ctaLabel}>PoC・デザインパートナー募集</p>
          <h2 className={styles.ctaHeading}>
            PoCと
            <br />
            デザインパートナーを
            <br />
            募集しています。
          </h2>
          <p className={styles.ctaBody}>
            Pixieの4製品のPoCと、開発中のPixie for
            Operationsを一緒に磨いてくださるデザインパートナーを募集しています。基幹インフラ・重要インフラの事業者、供給網を担う製造・物流企業、サイバー対処能力強化法への対応を支援するSI・コンサルティング会社からのご相談をお待ちしています。
          </p>
          <div className={styles.ctaAction}>
            <Button
              to={paths.poc}
              variant="onAccent"
            >
              PoCについて相談する
            </Button>
          </div>
        </div>
        <dl className={styles.terms}>
          <div className={styles.term}>
            <dt>対象</dt>
            <dd>
              Pixie CAASM・EASM・IASM・ASPM（ベータ版）
              <br />
              Pixie for Operations（開発中）
            </dd>
          </div>
          <div className={styles.term}>
            <dt>条件</dt>
            <dd>期間・費用・データの扱いは、ご相談のうえ個別に決めます。</dd>
          </div>
          <div className={styles.term}>
            <dt>ご連絡</dt>
            <dd>お問い合わせから3営業日以内にご返信します。</dd>
          </div>
        </dl>
      </section>

      <section
        id="articles"
        className={styles.articles}
      >
        <div className={styles.articlesHead}>
          <h2 className={styles.articlesHeading}>記事</h2>
          <TextLink
            to={paths.articles}
            size="sm"
          >
            すべての記事
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
    </>
  );
}
