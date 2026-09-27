import { Link } from "react-router";
import { CTABand } from "~/components/CTABand";
import { PageHeader, PageTitle } from "~/components/PageHeader";
import { RuleDot } from "~/components/RuleDot";
import { SectionHead } from "~/components/SectionHead";
import { TextLink } from "~/components/TextLink";
import { cx } from "~/lib/cx";
import { breadcrumbJsonLd, company, pageMeta, pageTitle, paths, siteOriginFrom } from "~/lib/site";
import page from "~/styles/page.module.css";
import type { Route } from "./+types/company";
import styles from "./company.module.css";

const title = "会社情報";

export function meta({ matches, location }: Route.MetaArgs) {
  return [
    ...pageMeta({
      matches,
      pathname: location.pathname,
      title: pageTitle(title, "ja"),
      description:
        "株式会社衝動（Shodo Inc.）の会社概要、社名の由来、セキュリティへの取り組みです。",
    }),
    breadcrumbJsonLd(siteOriginFrom(matches), "ja", [{ name: title, path: paths.company }]),
  ];
}

/** 会社情報（参照 ja-company.html） */
export default function Company() {
  return (
    <>
      <PageHeader
        lang="ja"
        breadcrumb={[{ label: title }]}
      >
        <PageTitle>{title}</PageTitle>
        <RuleDot size="sm" />
      </PageHeader>

      <section className={styles.band}>
        <span className={styles.wordmark}>
          <span className={styles.wordmarkText}>衝動</span>
          <span
            aria-hidden="true"
            className={styles.wordmarkDot}
          />
        </span>
        <div className={styles.bandText}>
          <p className={styles.bandLabel}>「衝動」という名前について</p>
          <p className={styles.bandStatement}>
            AIの時代に、人間に必要なのは
            <br />
            衝動だと考えています。
          </p>
          <p className={styles.bandBody}>
            計算や分析は、AIに任せられるようになりました。それでも、何を守り、どこで踏みとどまるかを決めるのは人です。Pixieも、AIが考え、人が決めるという分担で設計しています。
          </p>
        </div>
      </section>

      <section className={styles.overview}>
        <h2 className={page.heading}>会社概要</h2>
        <dl className={styles.facts}>
          <div className={styles.fact}>
            <dt>会社名</dt>
            <dd>{company.name.ja}</dd>
          </div>
          <div className={styles.fact}>
            <dt>英文社名</dt>
            <dd>{company.name.en}</dd>
          </div>
          <div className={styles.fact}>
            <dt>所在地</dt>
            <dd>
              〒{company.postalCode}
              <br />
              {company.region}
              {company.locality}
              {company.streetAddress}
            </dd>
          </div>
          <div className={styles.fact}>
            <dt>設立</dt>
            <dd>2025年5月1日</dd>
          </div>
          <div className={styles.fact}>
            <dt>法人番号</dt>
            <dd className={styles.corporateNumber}>
              <span>{company.corporateNumber}</span>
              <a
                href={company.corporateNumberUrl}
                className={styles.factLink}
              >
                国税庁の法人番号公表サイトで確認する
              </a>
            </dd>
          </div>
          <div className={styles.fact}>
            <dt>事業内容</dt>
            <dd>サイバーセキュリティ関連ツールの開発・運用</dd>
          </div>
          <div className={styles.fact}>
            <dt>製品</dt>
            <dd>
              <Link to={`${paths.products}#caasm`}>Pixie CAASM</Link>、Pixie EASM、Pixie IASM、Pixie
              ASPM（ベータ版）
              <br />
              <Link to={paths.pixieForOperations}>Pixie for Operations</Link>（開発中）
            </dd>
          </div>
        </dl>
      </section>

      <section className={cx(page.section, page.ruled)}>
        <SectionHead>
          <h2 className={page.heading}>
            セキュリティへの
            <br />
            取り組み
          </h2>
          <p className={page.lead}>
            セキュリティ製品をつくる会社として、私たち自身のサービスやウェブサイトの脆弱性の報告も受け付けています。
          </p>
        </SectionHead>
        <div className={styles.security}>
          <div className={styles.securityItem}>
            <h3 className={styles.securityTitle}>脆弱性の報告窓口</h3>
            <p className={styles.securityBody}>
              当社のサービスやウェブサイトに脆弱性を見つけた方は、次のアドレスにご報告ください。お問い合わせフォームからも受け付けています。
            </p>
            <a
              href="mailto:security@shodohq.com"
              className={styles.email}
            >
              security@shodohq.com
            </a>
            <TextLink
              to={paths.contact}
              size="sm"
            >
              報告フォームへ
            </TextLink>
          </div>
          <div className={styles.securityItem}>
            <h3 className={styles.securityTitle}>security.txt</h3>
            <p className={styles.securityBody}>
              連絡先と報告の方針を、標準の場所で公開しています。
            </p>
            {/* 静的なファイルなので、React Routerの Link にしない */}
            <a
              href={paths.securityTxt}
              className={styles.fileLink}
            >
              {paths.securityTxt}
            </a>
          </div>
          <div className={styles.securityItem}>
            <h3 className={styles.securityTitle}>セキュリティポリシー</h3>
            <p className={styles.securityBody}>
              お預かりする情報の取り扱いと、情報セキュリティの基本方針です。
            </p>
            <TextLink
              to={paths.securityPolicy}
              size="sm"
            >
              セキュリティポリシーを読む
            </TextLink>
          </div>
        </div>
      </section>

      <CTABand
        label="お問い合わせ"
        heading={["製品やPoCについて、", "お気軽にご相談ください。"]}
        button="お問い合わせフォームへ"
        to={paths.contact}
      />
    </>
  );
}
