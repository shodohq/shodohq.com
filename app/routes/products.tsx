import { Link } from "react-router";
import { ArrowLink } from "~/components/ArrowLink";
import { CTABand } from "~/components/CTABand";
import { Icon } from "~/components/Icon";
import { Lines } from "~/components/Lines";
import { PageHeader, PageTitle } from "~/components/PageHeader";
import { ProductList } from "~/components/ProductList";
import { RuleDot } from "~/components/RuleDot";
import { SectionHead } from "~/components/SectionHead";
import { Tag } from "~/components/Tag";
import {
  breadcrumbJsonLd,
  langFromPath,
  localizePath,
  pageMeta,
  pageTitle,
  paths,
  siteOriginFrom,
} from "~/lib/site";
import { useLang } from "~/lib/use-lang";
import page from "~/styles/page.module.css";
import type { Route } from "./+types/products";
import styles from "./products.module.css";

/** 文言（参照 ja-products.html、en-products.html） */
const copy = {
  ja: {
    title: "製品",
    description:
      "攻撃されうる範囲を把握するPixieの4製品と、業務を止めずに守るための意思決定AI「Pixie for Operations」をご紹介します。",
    statement: ["攻撃されうる範囲を知り、", "止め方を決める。"],
    lead: "Pixieは、業務を止めずに守るためのセキュリティ製品のシリーズです。攻撃されうる範囲を把握する4つの製品と、それを材料に「どこを止めれば、何が残るか」を示すPixie for Operationsで構成されています。",
    bandTag: "開発中・デザインパートナー募集",
    bandTagline: "業務を止めずに守るための、意思決定AI。",
    bandBody:
      "手元の資産台帳・構成図・契約書・手順書から「停止の地図」をつくり、攻撃を受けたときに、拡散を止めつつ重要業務を最大限残す遮断案を、経営判断の言葉で示します。",
    features: [
      { label: "平時に描く", name: "停止の地図" },
      { label: "有事に選ぶ", name: "止め方AI" },
      { label: "戻せるかを確かめる", name: "復旧検査" },
    ],
    bandMore: "Pixie for Operationsを詳しく見る",
    seriesEyebrow: "Pixie シリーズ（ベータ版）",
    seriesHeading: ["攻撃されうる範囲を", "把握する、4つの製品。"],
    seriesLead:
      "4つの製品は、それぞれ単独で導入できます。集めた資産と攻撃面のデータは、Pixie for Operationsの「停止の地図」の材料になります。現在ベータ版として、PoCにご参加いただける企業を募集しています。",
    flowMap: "停止の地図",
    flowNote: "（開発中）",
    cta: {
      label: "PoC・デザインパートナー募集",
      heading: ["実際の環境で、", "一緒に確かめませんか。"],
      body: "4つの製品はPoCを、Pixie for Operationsはデザインパートナーを募集しています。",
      button: "PoCについて相談する",
    },
  },
  en: {
    title: "Products",
    description:
      "Four Pixie products that map your attack surface, and Pixie for Operations, decision AI that keeps operations running during an attack.",
    statement: ["Know your attack surface.", "Decide how to contain."],
    lead: "Pixie is a family of security products built to protect your business without bringing it to a halt. Four products map your attack surface, and Pixie for Operations uses that material to show what to isolate and what will keep running.",
    bandTag: "In development · Seeking design partners",
    bandTagline: "Decision AI for keeping operations running during an attack.",
    bandBody:
      "It builds an outage map from your inventories, network diagrams, contracts, and runbooks. When an attack hits, it proposes containment plans that stop the spread while keeping as much critical business running as possible, explained in terms executives can act on.",
    features: [
      { label: "Map it in advance", name: "Outage map" },
      { label: "Choose in an incident", name: "Containment AI" },
      { label: "Confirm you can recover", name: "Recovery check" },
    ],
    bandMore: "Learn about Pixie for Operations",
    seriesEyebrow: "The Pixie series (beta)",
    seriesHeading: ["Four products that map", "your attack surface."],
    seriesLead:
      "Each product can be deployed on its own. The asset and attack-surface data they collect becomes raw material for the outage map in Pixie for Operations. All four are in beta, and we are looking for companies to try them in a proof of concept.",
    flowMap: "Outage map",
    flowNote: "(in development)",
    cta: {
      label: "PoCs and design partners",
      heading: ["Try it in", "your own environment."],
      body: "The four products are open for PoCs, and Pixie for Operations is looking for design partners.",
      button: "Talk to us about a PoC",
    },
  },
} as const;

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
    breadcrumbJsonLd(siteOriginFrom(matches), lang, [{ name: t.title, path: paths.products }]),
  ];
}

/** 製品一覧（参照 ja-products.html、en-products.html） */
export default function Products() {
  const lang = useLang();
  const t = copy[lang];
  const pixieForOperations = localizePath(lang, paths.pixieForOperations);

  return (
    <>
      <PageHeader
        lang={lang}
        breadcrumb={[{ label: t.title }]}
        bottom="lg"
      >
        <PageTitle>{t.title}</PageTitle>
        <RuleDot size="sm" />
        <div className={page.intro}>
          <p className={page.introStatement}>
            <Lines lines={t.statement} />
          </p>
          <p className={page.lead}>{t.lead}</p>
        </div>
      </PageHeader>

      <section className={styles.band}>
        <div className={styles.bandMain}>
          {/* 開発中の製品であることの表示。外さない（CLAUDE.md） */}
          <Tag
            tone="onDark"
            className={styles.bandTag}
          >
            {t.bandTag}
          </Tag>
          <h2 className={styles.bandTitle}>
            <Lines lines={["Pixie", "for Operations"]} />
          </h2>
          <p className={styles.bandTagline}>{t.bandTagline}</p>
        </div>
        <div className={styles.bandSide}>
          <p className={styles.bandBody}>{t.bandBody}</p>
          <ul className={styles.bandList}>
            {t.features.map((feature) => (
              <li
                key={feature.name}
                className={styles.bandItem}
              >
                <span className={styles.bandLabel}>{feature.label}</span>
                <span className={styles.bandName}>{feature.name}</span>
              </li>
            ))}
          </ul>
          <ArrowLink
            to={pixieForOperations}
            className={styles.bandLink}
          >
            {t.bandMore}
          </ArrowLink>
        </div>
      </section>

      <section className={page.section}>
        <SectionHead>
          <div className={page.headMain}>
            <p className={page.eyebrow}>{t.seriesEyebrow}</p>
            <h2 className={page.heading}>
              <Lines lines={t.seriesHeading} />
            </h2>
          </div>
          <p className={page.lead}>{t.seriesLead}</p>
        </SectionHead>
        <ProductList
          lang={lang}
          variant="anchor"
        />
        {/* 製品の関係の流れ（design-system.md §7 FlowLine） */}
        <p className={styles.flow}>
          <span className={styles.flowCodes}>CAASM · EASM · IASM · ASPM</span>
          <Icon
            name="flow"
            className={styles.flowArrow}
          />
          <span className={styles.flowStep}>{t.flowMap}</span>
          <Icon
            name="flow"
            className={styles.flowArrow}
          />
          <span className={styles.flowEnd}>
            <Link
              to={pixieForOperations}
              className={styles.flowStep}
            >
              Pixie for Operations
            </Link>
            <span className={styles.flowNote}>{t.flowNote}</span>
          </span>
        </p>
      </section>

      <CTABand
        {...t.cta}
        to={localizePath(lang, paths.poc)}
      />
    </>
  );
}
