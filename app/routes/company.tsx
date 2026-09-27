import type { ReactNode } from "react";
import { Link } from "react-router";
import { CTABand } from "~/components/CTABand";
import { Lines } from "~/components/Lines";
import { PageHeader, PageTitle } from "~/components/PageHeader";
import { RuleDot } from "~/components/RuleDot";
import { SectionHead } from "~/components/SectionHead";
import { TextLink } from "~/components/TextLink";
import { cx } from "~/lib/cx";
import {
  breadcrumbJsonLd,
  company,
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
import type { Route } from "./+types/company";
import styles from "./company.module.css";

type Copy = {
  title: string;
  description: string;
  nameLabel: string;
  nameStatement: readonly string[];
  nameBody: ReactNode;
  overviewHeading: readonly string[];
  /** 会社概要の行。value はリンクや改行を含むので、言語ごとに組み立てる */
  facts: (lang: Lang) => readonly { term: string; value: ReactNode }[];
  securityHeading: readonly string[];
  securityLead: string;
  reportTitle: string;
  reportBody: string;
  reportForm: string;
  securityTxtBody: string;
  policyTitle: string;
  policyBody: string;
  policyLink: string;
  cta: { label: string; heading: readonly string[]; button: string };
};

const corporateNumber = (label: string) => (
  <span className={styles.stacked}>
    <span>{company.corporateNumber}</span>
    <a
      href={company.corporateNumberUrl}
      className={styles.factLink}
    >
      {label}
    </a>
  </span>
);

const fullAddressJa = `〒${company.postalCode} ${company.region}${company.locality}${company.streetAddress}`;

/** 文言（参照 ja-company.html、en-company.html） */
const copy: Record<Lang, Copy> = {
  ja: {
    title: "会社情報",
    description: "株式会社衝動（Shodo Inc.）の会社概要、社名の由来、セキュリティへの取り組みです。",
    nameLabel: "「衝動」という名前について",
    nameStatement: ["AIの時代に、人間に必要なのは", "衝動だと考えています。"],
    nameBody:
      "計算や分析は、AIに任せられるようになりました。それでも、何を守り、どこで踏みとどまるかを決めるのは人です。Pixieも、AIが考え、人が決めるという分担で設計しています。",
    overviewHeading: ["会社概要"],
    facts: (lang) => [
      { term: "会社名", value: company.name.ja },
      { term: "英文社名", value: company.name.en },
      {
        term: "所在地",
        value: (
          <>
            〒{company.postalCode}
            <br />
            {company.region}
            {company.locality}
            {company.streetAddress}
          </>
        ),
      },
      { term: "設立", value: "2025年5月1日" },
      { term: "法人番号", value: corporateNumber("国税庁の法人番号公表サイトで確認する") },
      { term: "事業内容", value: "サイバーセキュリティ関連ツールの開発・運用" },
      {
        term: "製品",
        value: (
          <>
            <Link to={`${localizePath(lang, paths.products)}#caasm`}>Pixie CAASM</Link>
            、Pixie EASM、Pixie IASM、Pixie ASPM（ベータ版）
            <br />
            <Link to={localizePath(lang, paths.pixieForOperations)}>Pixie for Operations</Link>
            （開発中）
          </>
        ),
      },
    ],
    securityHeading: ["セキュリティへの", "取り組み"],
    securityLead:
      "セキュリティ製品をつくる会社として、私たち自身のサービスやウェブサイトの脆弱性の報告も受け付けています。",
    reportTitle: "脆弱性の報告窓口",
    reportBody:
      "当社のサービスやウェブサイトに脆弱性を見つけた方は、次のアドレスにご報告ください。お問い合わせフォームからも受け付けています。",
    reportForm: "報告フォームへ",
    securityTxtBody: "連絡先と報告の方針を、標準の場所で公開しています。",
    policyTitle: "セキュリティポリシー",
    policyBody: "お預かりする情報の取り扱いと、情報セキュリティの基本方針です。",
    policyLink: "セキュリティポリシーを読む",
    cta: {
      label: "お問い合わせ",
      heading: ["製品やPoCについて、", "お気軽にご相談ください。"],
      button: "お問い合わせフォームへ",
    },
  },
  en: {
    title: "Company",
    description:
      "About Shodo Inc.: company overview, the story behind our name, and how we approach our own security.",
    nameLabel: "About our name",
    nameStatement: ["In the age of AI, we believe", "people need impulse."],
    nameBody: (
      <>
        Shodō (<span lang="ja">衝動</span>) means “impulse” in Japanese. AI can now take on
        calculation and analysis. But deciding what to protect, and where to hold the line, is still
        up to people. Pixie is designed around that division of roles.
      </>
    ),
    overviewHeading: ["Company", "overview"],
    facts: (lang) => [
      {
        term: "Company name",
        value: (
          <>
            {company.name.en} (<span lang="ja">{company.name.ja}</span>)
          </>
        ),
      },
      {
        term: "Address",
        // 英文住所は市まで。正式な住所は日本語で併記する（docs/open-items.md #17）
        value: (
          <span className={styles.stacked}>
            <span>Aizuwakamatsu, Fukushima 965-0003, Japan</span>
            <span
              lang="ja"
              className={styles.factNote}
            >
              {fullAddressJa}
            </span>
          </span>
        ),
      },
      { term: "Founded", value: "May 1, 2025" },
      {
        term: "Corporate Number",
        value: corporateNumber("Verify on the National Tax Agency’s corporate number site"),
      },
      { term: "Business", value: "Development and operation of cybersecurity tools" },
      {
        term: "Products",
        value: (
          <>
            <Link to={localizePath(lang, paths.products)}>Pixie CAASM, EASM, IASM, and ASPM</Link>{" "}
            (beta)
            <br />
            <Link to={localizePath(lang, paths.pixieForOperations)}>Pixie for Operations</Link> (in
            development)
          </>
        ),
      },
    ],
    securityHeading: ["Our own security"],
    securityLead:
      "As a company that builds security products, we also accept reports of vulnerabilities in our own services and website.",
    reportTitle: "Vulnerability reports",
    reportBody:
      "If you find a vulnerability in our services or website, please report it to the address below. You can also use our contact form.",
    reportForm: "Go to the contact form",
    securityTxtBody:
      "Our contact details and reporting policy are published in the standard location.",
    policyTitle: "Security policy",
    policyBody:
      "Our basic approach to information security and to protecting the information entrusted to us.",
    policyLink: "Read the security policy",
    cta: {
      label: "Contact",
      heading: ["Questions about our products", "or PoCs are welcome."],
      button: "Go to the contact form",
    },
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
    breadcrumbJsonLd(siteOriginFrom(matches), lang, [{ name: t.title, path: paths.company }]),
  ];
}

/** 会社情報（参照 ja-company.html、en-company.html） */
export default function Company() {
  const lang = useLang();
  const t = copy[lang];
  const contact = localizePath(lang, paths.contact);

  return (
    <>
      <PageHeader
        lang={lang}
        breadcrumb={[{ label: t.title }]}
      >
        <PageTitle>{t.title}</PageTitle>
        <RuleDot size="sm" />
      </PageHeader>

      <section className={styles.band}>
        <span className={styles.wordmark}>
          <span
            lang={lang === "en" ? "ja" : undefined}
            className={styles.wordmarkText}
          >
            衝動
          </span>
          <span
            aria-hidden="true"
            className={styles.wordmarkDot}
          />
        </span>
        <div className={styles.bandText}>
          <p className={styles.bandLabel}>{t.nameLabel}</p>
          <p className={styles.bandStatement}>
            <Lines lines={t.nameStatement} />
          </p>
          <p className={styles.bandBody}>{t.nameBody}</p>
        </div>
      </section>

      <section className={styles.overview}>
        <h2 className={page.heading}>
          <Lines lines={t.overviewHeading} />
        </h2>
        <dl className={styles.facts}>
          {t.facts(lang).map((fact) => (
            <div
              key={fact.term}
              className={styles.fact}
            >
              <dt>{fact.term}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className={cx(page.section, page.ruled)}>
        <SectionHead>
          <h2 className={page.heading}>
            <Lines lines={t.securityHeading} />
          </h2>
          <p className={page.lead}>{t.securityLead}</p>
        </SectionHead>
        <div className={styles.security}>
          <div className={styles.securityItem}>
            <h3 className={styles.securityTitle}>{t.reportTitle}</h3>
            <p className={styles.securityBody}>{t.reportBody}</p>
            <a
              href="mailto:security@shodohq.com"
              className={styles.email}
            >
              security@shodohq.com
            </a>
            <TextLink
              to={contact}
              size="sm"
            >
              {t.reportForm}
            </TextLink>
          </div>
          <div className={styles.securityItem}>
            <h3 className={styles.securityTitle}>security.txt</h3>
            <p className={styles.securityBody}>{t.securityTxtBody}</p>
            {/* 静的なファイルなので、React Routerの Link にしない */}
            <a
              href={paths.securityTxt}
              className={styles.fileLink}
            >
              {paths.securityTxt}
            </a>
          </div>
          <div className={styles.securityItem}>
            <h3 className={styles.securityTitle}>{t.policyTitle}</h3>
            <p className={styles.securityBody}>{t.policyBody}</p>
            <TextLink
              to={localizePath(lang, paths.securityPolicy)}
              size="sm"
            >
              {t.policyLink}
            </TextLink>
          </div>
        </div>
      </section>

      <CTABand
        {...t.cta}
        to={contact}
      />
    </>
  );
}
