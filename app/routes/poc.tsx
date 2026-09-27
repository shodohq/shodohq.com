import type { ReactNode } from "react";
import { Link } from "react-router";
import { Button } from "~/components/Button";
import { InquiryForm } from "~/components/InquiryForm";
import { Lines } from "~/components/Lines";
import { PageHeader, PageTitle } from "~/components/PageHeader";
import { RuleDot } from "~/components/RuleDot";
import { Tag } from "~/components/Tag";
import { cx } from "~/lib/cx";
import {
  breadcrumbJsonLd,
  type Lang,
  langFromPath,
  localizePath,
  pageMeta,
  pageTitle,
  paths,
  siteOriginFrom,
} from "~/lib/site";
import { useLang } from "~/lib/use-lang";
import page from "~/styles/page.module.css";
import type { Route } from "./+types/poc";
import styles from "./poc.module.css";

type Copy = {
  title: string;
  description: string;
  heading: readonly string[];
  lead: string;
  toForm: string;
  offersHeading: readonly string[];
  offers: readonly {
    tag: string;
    title: readonly string[];
    body: string;
    terms: readonly (readonly [string, string])[];
  }[];
  audiencesHeading: readonly string[];
  audiences: readonly { title: string; body: string }[];
  stepsHeading: string;
  steps: readonly { numeral: string; title: string; body: string }[];
  dataHeading: string;
  data: readonly string[];
  formHeading: readonly string[];
  formLead: (contact: string) => ReactNode;
  formNote: (privacy: string) => ReactNode;
};

/**
 * 文言（参照 ja-poc.html、en-poc.html）。
 * 期間・費用などの条件は、決まったら書き足す（docs/open-items.md #15）
 */
const copy: Record<Lang, Copy> = {
  ja: {
    title: "PoC・デザインパートナー募集",
    description:
      "Pixieの4製品のPoCと、開発中のPixie for Operationsのデザインパートナーを募集しています。",
    heading: ["実際の環境で、", "一緒に確かめる。"],
    lead: "Pixieの4製品は、ベータ版としてPoCにご参加いただける企業を募集しています。開発中のPixie for Operationsは、実際のデータで一緒に製品を磨いてくださるデザインパートナーを募集しています。",
    toForm: "応募フォームへ",
    offersHeading: ["2つの募集"],
    offers: [
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
    ],
    audiencesHeading: ["こんな企業からの", "ご相談をお待ちしています。"],
    audiences: [
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
    ],
    stepsHeading: "進め方",
    steps: [
      {
        numeral: "一",
        title: "ご相談",
        body: "フォームから、関心のある製品と課題をお知らせください。",
      },
      {
        numeral: "二",
        title: "ヒアリング",
        body: "オンラインで、環境と確かめたいことを伺います。",
      },
      { numeral: "三", title: "条件の確認", body: "秘密保持契約と、データの扱いを取り決めます。" },
      { numeral: "四", title: "PoCの実施", body: "実際の環境で製品をお使いいただきます。" },
      { numeral: "五", title: "振り返り", body: "結果を一緒に確認し、次の進め方を相談します。" },
    ],
    dataHeading: "データの扱い",
    data: [
      "扱うデータの範囲、保管場所、終了後の削除方法は、PoCを始める前に取り決めます。",
      "ご希望に応じて、秘密保持契約を結びます。",
      "Pixie for Operationsは、読み取り専用で動く設計です。",
    ],
    formHeading: ["応募・ご相談"],
    formLead: (contact) => (
      <>
        内容を確認のうえ、3営業日以内にご連絡します。PoC以外のお問い合わせは、
        <Link to={contact}>お問い合わせ</Link>からどうぞ。
      </>
    ),
    formNote: (privacy) => (
      <>
        いただいた情報は、<Link to={privacy}>プライバシーポリシー</Link>に沿って取り扱います。
      </>
    ),
  },
  en: {
    title: "PoCs and design partners",
    description:
      "Try the four Pixie products in a proof of concept, or help shape Pixie for Operations as a design partner.",
    heading: ["Try it in", "your own environment."],
    lead: "The four Pixie products are in beta, and we are looking for companies to try them in a proof of concept. For Pixie for Operations, which is in development, we are looking for design partners to refine the product with us using real data.",
    toForm: "Go to the application form",
    offersHeading: ["Two ways to take part"],
    offers: [
      {
        tag: "Beta",
        title: ["A PoC for the four", "Pixie products"],
        body: "Try Pixie CAASM, EASM, IASM, and ASPM in your own environment, and tell us candidly what works and what does not.",
        terms: [
          ["Products", "Pixie CAASM, EASM, IASM, ASPM"],
          ["Terms", "Duration and cost are agreed case by case."],
        ],
      },
      {
        tag: "In development",
        title: ["Pixie for Operations", "design partner"],
        // 英語版では「日本の組織向けに先に設計している」と必ず書く（docs/content-rules.md §2）
        body: "Through a read-only PoC, we will work with you to validate how the outage map is built and how containment plans are proposed. Pixie for Operations is being designed first for organizations operating in Japan.",
        terms: [
          ["Primarily for", "Critical infrastructure operators"],
          ["Format", "Read-only PoC"],
          ["Terms", "Duration and cost are agreed case by case."],
        ],
      },
    ],
    audiencesHeading: ["Who we would like", "to hear from"],
    audiences: [
      {
        title: "Critical infrastructure operators",
        body: "Operators preparing regulatory notifications or taking stock of their contractors.",
      },
      {
        title: "Essential service providers",
        body: "Organizations that want to build outage readiness into BCP reviews and tabletop exercises.",
      },
      {
        title: "Manufacturers and logistics companies",
        body: "Companies at the heart of supply chains that want to know in advance what happens if orders or shipments stop.",
      },
      {
        title: "System integrators and consultancies",
        body: "Firms that want to use Pixie in compliance or security support engagements.",
      },
    ],
    stepsHeading: "How it works",
    steps: [
      {
        numeral: "1",
        title: "Contact us",
        body: "Tell us which products interest you and what challenges you face.",
      },
      {
        numeral: "2",
        title: "Initial call",
        body: "We learn about your environment and what you want to validate, online.",
      },
      {
        numeral: "3",
        title: "Agree on terms",
        body: "We put a non-disclosure agreement and data handling terms in place.",
      },
      {
        numeral: "4",
        title: "Run the PoC",
        body: "You use the products in your real environment.",
      },
      {
        numeral: "5",
        title: "Review",
        body: "We go over the results together and discuss next steps.",
      },
    ],
    dataHeading: "Your data",
    data: [
      "The scope of data, where it is stored, and how it is deleted afterward are agreed before the PoC begins.",
      "We will sign a non-disclosure agreement on request.",
      "Pixie for Operations is designed to run read-only.",
    ],
    formHeading: ["Apply or", "ask a question"],
    formLead: (contact) => (
      <>
        We reply within three business days. For other inquiries, please use the{" "}
        <Link to={contact}>Contact</Link> page.
      </>
    ),
    formNote: (privacy) => (
      <>
        We handle your information in line with our <Link to={privacy}>privacy policy</Link>.
      </>
    ),
  },
};

export function meta({ matches, location }: Route.MetaArgs) {
  const lang = langFromPath(location.pathname);
  const t = copy[lang];
  return [
    ...pageMeta({
      matches,
      pathname: location.pathname,
      title: pageTitle(t.title, lang),
      description: t.description,
    }),
    breadcrumbJsonLd(siteOriginFrom(matches), lang, [{ name: t.title, path: paths.poc }]),
  ];
}

/** PoC・デザインパートナー募集（参照 ja-poc.html、en-poc.html） */
export default function Poc() {
  const lang = useLang();
  const t = copy[lang];

  return (
    <>
      <PageHeader
        lang={lang}
        breadcrumb={[{ label: t.title }]}
        bottom="lg"
      >
        <p className={styles.heroLabel}>{t.title}</p>
        <PageTitle className={styles.heroTitle}>
          <Lines lines={t.heading} />
        </PageTitle>
        <RuleDot size="sm" />
        <div className={styles.heroFoot}>
          <p className={page.lead}>{t.lead}</p>
          <div className={styles.heroAction}>
            <Button
              to="#form"
              icon="arrowDown"
            >
              {t.toForm}
            </Button>
          </div>
        </div>
      </PageHeader>

      <section className={cx(page.section, page.ruled)}>
        <h2 className={page.heading}>
          <Lines lines={t.offersHeading} />
        </h2>
        <div className={styles.offers}>
          {t.offers.map((offer) => (
            <article
              key={offer.tag}
              className={styles.offer}
            >
              <Tag className={styles.offerTag}>{offer.tag}</Tag>
              <h3 className={styles.offerTitle}>
                <Lines lines={offer.title} />
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
          <Lines lines={t.audiencesHeading} />
        </h2>
        <div className={styles.audiences}>
          {t.audiences.map((audience) => (
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
          <h2 className={page.headingSm}>{t.stepsHeading}</h2>
          <ol className={styles.steps}>
            {t.steps.map((step) => (
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
          <h2 className={page.headingSm}>{t.dataHeading}</h2>
          <ul className={styles.handling}>
            {t.data.map((item) => (
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
          <h2 className={cx(page.heading, styles.formHeading)}>
            <Lines lines={t.formHeading} />
          </h2>
          <p className={styles.formLead}>{t.formLead(localizePath(lang, paths.contact))}</p>
          <p className={page.formNote}>{t.formNote(localizePath(lang, paths.privacy))}</p>
        </div>
        <InquiryForm
          lang={lang}
          form="poc"
        />
      </section>
    </>
  );
}
