import { Link } from "react-router";
import { Button } from "~/components/Button";
import { InquiryForm } from "~/components/InquiryForm";
import { PageHeader, PageTitle } from "~/components/PageHeader";
import { RuleDot } from "~/components/RuleDot";
import { Tag } from "~/components/Tag";
import { cx } from "~/lib/cx";
import { breadcrumbJsonLd, pageMeta, pageTitle, paths, siteOriginFrom } from "~/lib/site";
import page from "~/styles/page.module.css";
import type { Route } from "./+types/poc";
import styles from "./poc.module.css";

const title = "PoC・デザインパートナー募集";

export function meta({ matches, location }: Route.MetaArgs) {
  return [
    ...pageMeta({
      matches,
      pathname: location.pathname,
      title: pageTitle(title, "ja"),
      description:
        "Pixieの4製品のPoCと、開発中のPixie for Operationsのデザインパートナーを募集しています。",
    }),
    breadcrumbJsonLd(siteOriginFrom(matches), "ja", [{ name: title, path: paths.poc }]),
  ];
}

// 期間・費用などの条件は、決まったら書き足す（docs/open-items.md #15）
const offers = [
  {
    tag: "ベータ版",
    title: ["Pixie 4製品のPoC"],
    body: "Pixie CAASM・EASM・IASM・ASPMを、実際の環境でお試しいただけます。使い勝手や検出の結果について、率直なご意見をお聞かせください。",
    terms: [
      ["対象製品", "Pixie CAASM・EASM・IASM・ASPM"],
      ["条件", "期間・費用は、ご相談のうえ個別に決めます。"],
    ],
  },
  {
    tag: "開発中",
    title: ["Pixie for Operations", "デザインパートナー"],
    body: "読み取り専用のPoCを通じて、停止の地図のつくり方や、遮断案の出し方を一緒に検証します。",
    terms: [
      ["主な対象", "基幹インフラ事業者"],
      ["進め方", "読み取り専用のPoC"],
      ["条件", "期間・費用は、ご相談のうえ個別に決めます。"],
    ],
  },
];

const audiences = [
  {
    title: "基幹インフラ事業者",
    body: "サイバー対処能力強化法の届出対象の特定や、委託先の棚卸しを進めている事業者。",
  },
  {
    title: "重要インフラ事業者",
    body: "業務を止めない備えを、BCPの見直しや机上演習に組み込みたい事業者。",
  },
  {
    title: "供給網を担う製造・物流企業",
    body: "受注や出荷が止まったときの影響を、事前に把握しておきたい企業。",
  },
  {
    title: "SI・コンサルティング会社",
    body: "強化法への対応やセキュリティ支援の案件で、Pixieを使いたい会社。",
  },
];

const steps = [
  {
    numeral: "一",
    title: "ご相談",
    body: "フォームから、関心のある製品と課題をお知らせください。",
  },
  { numeral: "二", title: "ヒアリング", body: "オンラインで、環境と確かめたいことを伺います。" },
  { numeral: "三", title: "条件の確認", body: "秘密保持契約と、データの扱いを取り決めます。" },
  { numeral: "四", title: "PoCの実施", body: "実際の環境で製品をお使いいただきます。" },
  { numeral: "五", title: "振り返り", body: "結果を一緒に確認し、次の進め方を相談します。" },
];

const dataHandling = [
  "扱うデータの範囲、保管場所、終了後の削除方法は、PoCを始める前に取り決めます。",
  "ご希望に応じて、秘密保持契約を結びます。",
  "Pixie for Operationsは、読み取り専用で動く設計です。",
];

/** PoC・デザインパートナー募集（参照 ja-poc.html） */
export default function Poc() {
  return (
    <>
      <PageHeader
        lang="ja"
        breadcrumb={[{ label: title }]}
        bottom="lg"
      >
        <p className={styles.heroLabel}>{title}</p>
        <PageTitle className={styles.heroTitle}>
          実際の環境で、
          <br />
          一緒に確かめる。
        </PageTitle>
        <RuleDot size="sm" />
        <div className={styles.heroFoot}>
          <p className={page.lead}>
            Pixieの4製品は、ベータ版としてPoCにご参加いただける企業を募集しています。開発中のPixie
            for
            Operationsは、実際のデータで一緒に製品を磨いてくださるデザインパートナーを募集しています。
          </p>
          <div className={styles.heroAction}>
            <Button
              to="#form"
              icon="arrowDown"
            >
              応募フォームへ
            </Button>
          </div>
        </div>
      </PageHeader>

      <section className={cx(page.section, page.ruled)}>
        <h2 className={page.heading}>2つの募集</h2>
        <div className={styles.offers}>
          {offers.map((offer) => (
            <article
              key={offer.tag}
              className={styles.offer}
            >
              <Tag className={styles.offerTag}>{offer.tag}</Tag>
              <h3 className={styles.offerTitle}>
                {offer.title.map((line, index) => (
                  <span key={line}>
                    {index > 0 && <br />}
                    {line}
                  </span>
                ))}
              </h3>
              <p className={styles.offerBody}>{offer.body}</p>
              <dl className={styles.terms}>
                {offer.terms.map(([term, detail]) => (
                  <div
                    key={term}
                    className={styles.term}
                  >
                    <dt>{term}</dt>
                    <dd>{detail}</dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section className={cx(page.section, page.ruled)}>
        <h2 className={page.heading}>
          こんな企業からの
          <br />
          ご相談をお待ちしています。
        </h2>
        <div className={styles.audiences}>
          {audiences.map((audience) => (
            <div
              key={audience.title}
              className={styles.audience}
            >
              <h3 className={styles.audienceTitle}>{audience.title}</h3>
              <p className={styles.audienceBody}>{audience.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={cx(page.ruled, styles.process)}>
        <div className={styles.processColumn}>
          <h2 className={page.headingSm}>進め方</h2>
          <ol className={styles.steps}>
            {steps.map((step) => (
              <li
                key={step.numeral}
                className={styles.step}
              >
                <span className={styles.stepNumeral}>{step.numeral}</span>
                <span className={styles.stepText}>
                  <span className={styles.stepTitle}>{step.title}</span>
                  <span className={styles.stepBody}>{step.body}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
        <div className={styles.processColumn}>
          <h2 className={page.headingSm}>データの扱い</h2>
          <ul className={styles.handling}>
            {dataHandling.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section
        id="form"
        className={page.formSection}
      >
        <div className={styles.formIntro}>
          <h2 className={page.heading}>応募・ご相談</h2>
          <p className={styles.formLead}>
            内容を確認のうえ、3営業日以内にご連絡します。PoC以外のお問い合わせは、
            <Link to={paths.contact}>お問い合わせ</Link>からどうぞ。
          </p>
          <p className={page.formNote}>
            いただいた情報は、<Link to={paths.privacy}>プライバシーポリシー</Link>
            に沿って取り扱います。
          </p>
        </div>
        <InquiryForm form="poc" />
      </section>
    </>
  );
}
