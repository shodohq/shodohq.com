import { Link } from "react-router";
import { ArrowLink } from "~/components/ArrowLink";
import { CTABand } from "~/components/CTABand";
import { Icon } from "~/components/Icon";
import { PageHeader, PageTitle } from "~/components/PageHeader";
import { ProductList } from "~/components/ProductList";
import { RuleDot } from "~/components/RuleDot";
import { SectionHead } from "~/components/SectionHead";
import { Tag } from "~/components/Tag";
import { breadcrumbJsonLd, pageMeta, pageTitle, paths, siteOriginFrom } from "~/lib/site";
import page from "~/styles/page.module.css";
import type { Route } from "./+types/products";
import styles from "./products.module.css";

const title = "製品";

export function meta({ matches, location }: Route.MetaArgs) {
  return [
    ...pageMeta({
      matches,
      pathname: location.pathname,
      title: pageTitle(title, "ja"),
      description:
        "攻撃されうる範囲を把握するPixieの4製品と、業務を止めずに守るための意思決定AI「Pixie for Operations」をご紹介します。",
    }),
    breadcrumbJsonLd(siteOriginFrom(matches), "ja", [{ name: title, path: paths.products }]),
  ];
}

const operationsFeatures = [
  { label: "平時に描く", name: "停止の地図" },
  { label: "有事に選ぶ", name: "止め方AI" },
  { label: "戻せるかを確かめる", name: "復旧検査" },
];

/** 製品一覧（参照 ja-products.html） */
export default function Products() {
  return (
    <>
      <PageHeader
        lang="ja"
        breadcrumb={[{ label: title }]}
        bottom="lg"
      >
        <PageTitle>{title}</PageTitle>
        <RuleDot size="sm" />
        <div className={page.intro}>
          <p className={page.introStatement}>
            攻撃されうる範囲を知り、
            <br />
            止め方を決める。
          </p>
          <p className={page.lead}>
            Pixieは、業務を止めずに守るためのセキュリティ製品のシリーズです。攻撃されうる範囲を把握する4つの製品と、それを材料に「どこを止めれば、何が残るか」を示すPixie
            for Operationsで構成されています。
          </p>
        </div>
      </PageHeader>

      <section className={styles.band}>
        <div className={styles.bandMain}>
          {/* 開発中の製品であることの表示。外さない（CLAUDE.md） */}
          <Tag
            tone="onDark"
            className={styles.bandTag}
          >
            開発中・デザインパートナー募集
          </Tag>
          <h2 className={styles.bandTitle}>
            Pixie
            <br />
            for Operations
          </h2>
          <p className={styles.bandTagline}>業務を止めずに守るための、意思決定AI。</p>
        </div>
        <div className={styles.bandSide}>
          <p className={styles.bandBody}>
            手元の資産台帳・構成図・契約書・手順書から「停止の地図」をつくり、攻撃を受けたときに、拡散を止めつつ重要業務を最大限残す遮断案を、経営判断の言葉で示します。
          </p>
          <ul className={styles.bandList}>
            {operationsFeatures.map((feature) => (
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
            to={paths.pixieForOperations}
            className={styles.bandLink}
          >
            Pixie for Operationsを詳しく見る
          </ArrowLink>
        </div>
      </section>

      <section className={page.section}>
        <SectionHead>
          <div className={page.headMain}>
            <p className={page.eyebrow}>Pixie シリーズ（ベータ版）</p>
            <h2 className={page.heading}>
              攻撃されうる範囲を
              <br />
              把握する、4つの製品。
            </h2>
          </div>
          <p className={page.lead}>
            4つの製品は、それぞれ単独で導入できます。集めた資産と攻撃面のデータは、Pixie for
            Operationsの「停止の地図」の材料になります。現在ベータ版として、PoCにご参加いただける企業を募集しています。
          </p>
        </SectionHead>
        <ProductList
          lang="ja"
          variant="anchor"
        />
        {/* 製品の関係の流れ（design-system.md §7 FlowLine） */}
        <p className={styles.flow}>
          <span className={styles.flowCodes}>CAASM · EASM · IASM · ASPM</span>
          <Icon
            name="flow"
            className={styles.flowArrow}
          />
          <span className={styles.flowStep}>停止の地図</span>
          <Icon
            name="flow"
            className={styles.flowArrow}
          />
          <span className={styles.flowEnd}>
            <Link
              to={paths.pixieForOperations}
              className={styles.flowStep}
            >
              Pixie for Operations
            </Link>
            <span className={styles.flowNote}>（開発中）</span>
          </span>
        </p>
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
