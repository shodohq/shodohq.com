import { Button } from "~/components/Button";
import { CTABand } from "~/components/CTABand";
import { DependencyChain } from "~/components/DependencyChain";
import { PageHeader, PageTitle } from "~/components/PageHeader";
import { RuleDot } from "~/components/RuleDot";
import { SectionHead } from "~/components/SectionHead";
import { Tag } from "~/components/Tag";
import { cx } from "~/lib/cx";
import { breadcrumbJsonLd, pageMeta, pageTitle, paths, siteOriginFrom } from "~/lib/site";
import page from "~/styles/page.module.css";
import table from "~/styles/table.module.css";
import type { Route } from "./+types/pixie-for-operations";
import styles from "./pixie-for-operations.module.css";

const title = "Pixie for Operations";

export function meta({ matches, location }: Route.MetaArgs) {
  return [
    ...pageMeta({
      matches,
      pathname: location.pathname,
      title: pageTitle(title, "ja"),
      description:
        "資産台帳・構成図・契約書・手順書から「停止の地図」をつくり、業務を残す遮断案を示す意思決定AIです。現在開発中で、デザインパートナーを募集しています。",
    }),
    breadcrumbJsonLd(siteOriginFrom(matches), "ja", [
      { name: "製品", path: paths.products },
      { name: title, path: paths.pixieForOperations },
    ]),
  ];
}

const comparison = {
  ours: "Pixie for Operations",
  theirs: "一般的なエクスポージャー管理製品",
  rows: [
    {
      head: "答える問い",
      theirs: ["重要資産への攻撃経路と、", "修正の優先順位"],
      ours: ["業務を止めない遮断範囲と、", "復旧できるかどうか"],
    },
    {
      head: "主なデータ源",
      theirs: ["エージェント、API連携"],
      ours: ["既存の文書と、既存ツールの出力"],
    },
    {
      head: "扱う対象",
      theirs: ["技術資産、ID、脆弱性"],
      ours: ["技術資産・ID・脆弱性に加え、業務、委託先、担当者、手順書、バックアップ"],
    },
    {
      head: "有事の支援",
      theirs: ["主に平時の優先順位付け"],
      ours: ["遮断案の提示と、経営層への説明"],
    },
  ],
};

const useCases = {
  columns: ["場面", "使い方", "得られるもの"],
  rows: [
    [
      "強化法の初回届出",
      "台帳・構成図・委託契約を取り込む",
      "届出対象の候補と根拠（重要設備までの接続経路）、委託先の情報",
    ],
    ["四半期ごとの変更管理", "前回からの差分を検知する", "変更の届出が必要な候補"],
    [
      "委託先の管理",
      "契約・申請と、実際のアカウントを突き合わせる",
      "放置アカウントやMFA例外の一覧",
    ],
    [
      "BCPの見直し・机上演習",
      "侵入シナリオごとの遮断計画で演習する",
      "経営層が「止める判断」を練習できる",
    ],
    [
      "ランサムウェアの発生時",
      "アラートから遮断案を出す",
      "「止める範囲」と「残る業務」がすぐにわかる",
    ],
  ],
};

const standards = {
  columns: ["統一基準の項目", "求められること", "対応する機能"],
  rows: [
    {
      number: "3.2.9",
      item: "サプライチェーン・リスクマネジメント",
      requirement: "重要なシステムや機能とサプライチェーンの依存関係、委託先の対策状況の把握",
      feature: "停止の地図",
    },
    {
      number: "3.3.1",
      item: "資産の管理",
      requirement: "資産目録、外部サービス一覧、ネットワーク構成図・データの流れ図の作成と維持",
      feature: "停止の地図",
    },
    {
      number: "3.3.4",
      item: "リスクアセスメント",
      requirement: "任務保証の考え方に基づくリスクアセスメント",
      feature: "停止の地図による業務影響の分析",
    },
    {
      number: "3.4.3.3",
      item: "バックアップ",
      requirement: "元のシステムと異なるセグメントやオフラインでの保管、リカバリー検査",
      feature: "復旧検査",
    },
    {
      number: "3.6.2.4",
      item: "インシデント軽減",
      requirement: "通信の遮断やシステム停止による封じ込め",
      feature: "止め方AI",
    },
    {
      number: "3.6.3",
      item: "危機管理",
      requirement: "初動から復旧までの、経営層の意思決定の支援",
      feature: "止め方AI（経営層への説明）",
    },
  ],
};

const principles = [
  {
    title: "読み取り専用",
    body: "既存の環境には書き込みません。センサーやエージェントの設置も不要です。",
  },
  {
    title: "国内・閉域・オンプレミス",
    body: "国内・閉域で動くLLMの構成を選べます。オンプレミスでの運用にも対応します。",
  },
  { title: "最小権限と監査ログ", body: "必要最小限の権限で動き、操作を監査ログに記録します。" },
  { title: "本番に触れない検証", body: "遮断案の検証は、デジタルツインの上だけで行います。" },
];

/** 行の中の改行（参照の <br>）を保つ */
function Lines({ lines }: { lines: readonly string[] }) {
  return lines.map((line, index) => (
    <span key={line}>
      {index > 0 && <br />}
      {line}
    </span>
  ));
}

/** 機能の詳細の一覧（見出しと、上に罫線の付いた項目） */
function FeatureList({ heading, items }: { heading: string; items: readonly string[] }) {
  return (
    <div className={styles.featureList}>
      <p className={styles.featureListHeading}>{heading}</p>
      <ul className={styles.featureItems}>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

/** Pixie for Operations（参照 ja-pixie-for-operations.html） */
export default function PixieForOperations() {
  return (
    <>
      <PageHeader
        lang="ja"
        breadcrumb={[{ label: "製品", to: paths.products }, { label: title }]}
        bottom="lg"
      >
        {/* 開発中の製品であることの表示。外さない（CLAUDE.md） */}
        <Tag className={styles.heroTag}>開発中・デザインパートナー募集</Tag>
        <PageTitle className={styles.heroTitle}>{title}</PageTitle>
        <RuleDot size="sm" />
        <div className={page.intro}>
          <p className={page.introStatement}>
            業務を止めずに守るための、
            <br />
            意思決定AI。
          </p>
          <div className={styles.heroSide}>
            <p className={page.lead}>
              重要インフラ・産業企業がサイバー攻撃を受けたときに、業務を止めずに守るための意思決定AIです。手元の資産台帳・構成図・契約書・手順書から、重要業務がどのシステム・ID・委託先・バックアップに依存しているかを示す「停止の地図」をつくります。その地図を使い、拡散を止めつつ重要業務を最大限残す遮断計画を、経営判断の言葉で示します。
            </p>
            <p className={page.note}>
              Pixie for
              Operationsは開発中です。このページの内容は開発中の構想で、今後変わる場合があります。
            </p>
            <div>
              <Button to={paths.poc}>デザインパートナーに応募する</Button>
            </div>
          </div>
        </div>
      </PageHeader>

      <section className={cx(page.section, page.ruled)}>
        <SectionHead>
          <h2 className={page.heading}>
            既存の製品とは、
            <br />
            答える問いが違う。
          </h2>
          <p className={page.lead}>
            既存のEDR、SIEM、脆弱性管理、OT監視は、それぞれの領域の「点」を見ています。一方で経営層が知りたいのは、「何が止まり、いつ戻るか」です。Pixie
            for Operationsは、その間をつなぎます。
          </p>
        </SectionHead>
        <table className={cx(table.table, styles.comparison)}>
          <thead>
            <tr>
              {/* 左上の角は、参照どおり空にする（見出しの文字がないので th にしない） */}
              <td className={styles.comparisonCorner} />
              <th
                scope="col"
                className={styles.theirsHead}
              >
                {comparison.theirs}
              </th>
              <th
                scope="col"
                className={styles.oursHead}
              >
                <span className={styles.oursHeadInner}>
                  {/* 比較表の自社の列の見出しの前の点（design-system.md §6） */}
                  <span
                    aria-hidden="true"
                    className={styles.oursDot}
                  />
                  {comparison.ours}
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {comparison.rows.map((row) => (
              <tr key={row.head}>
                <th
                  scope="row"
                  className={styles.comparisonRowHead}
                >
                  {row.head}
                </th>
                <td
                  data-label={comparison.theirs}
                  className={styles.theirs}
                >
                  <Lines lines={row.theirs} />
                </td>
                <td data-label={comparison.ours}>
                  <Lines lines={row.ours} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className={styles.tableNote}>
          Pixie for
          Operationsは、既存の製品を置き換えません。その出力を取り込み、「業務を止めない判断」を支える層として動きます。
        </p>
      </section>

      <section className={cx(page.section, page.gapLg, page.ruled)}>
        <SectionHead>
          <h2 className={page.heading}>
            平時の備えから、
            <br />
            有事の判断まで。
          </h2>
          <p className={page.lead}>
            「停止の地図」「止め方AI」「復旧検査」の3つの機能で、平時の備えから有事の判断までを、ひとつの依存グラフでつなぎます。土台になるのは停止の地図です。
          </p>
        </SectionHead>
        <DependencyChain
          nodes={["重要業務", "システム", "ID", "委託先", "担当者", "バックアップ"]}
          caption="停止の地図：重要業務を起点に依存関係をたどり、どこで切れば何が残るかを計算します。"
        />
        <div className={styles.features}>
          <article className={styles.feature}>
            <span className={styles.numeral}>一</span>
            <div className={styles.featureMain}>
              <p className={page.label}>平時に描く</p>
              <h3 className={styles.featureTitle}>停止の地図</h3>
              <p className={styles.featureBody}>
                手元の文書と既存ツールの出力をAIが読み込み、重要業務からシステム、ID、委託先、担当者、バックアップまでの依存関係を組み立てます。
              </p>
            </div>
            <div className={styles.featureLists}>
              <FeatureList
                heading="読み込むもの"
                items={[
                  "資産台帳（Excel）",
                  "ネットワーク構成図（画像・PDF）",
                  "保守・委託契約書、委託先一覧",
                  "VPN・リモートアクセスの申請",
                  "BCP、復旧手順書",
                  "既存ツールの出力（EDR、脆弱性管理、IAM、OT監視）",
                ]}
              />
              <FeatureList
                heading="わかること"
                items={[
                  "業務を起点にした依存グラフ",
                  "書類同士の矛盾（例：構成図にない保守回線がVPN申請書にある）",
                  "放置された委託先アカウントや、MFAの例外",
                  "サイバー対処能力強化法の届出対象の候補と、その根拠",
                ]}
              />
            </div>
          </article>
          <article className={styles.feature}>
            <span className={styles.numeral}>二</span>
            <div className={styles.featureMain}>
              <p className={page.label}>有事に選ぶ</p>
              <h3 className={styles.featureTitle}>止め方AI</h3>
              <p className={styles.featureBody}>
                攻撃を受けたときに「どこを切れば、何が止まり、何が残るか」を示します。拡散を止めることと、重要業務を残すことを両立させる遮断の組み合わせを探します。AIが示すのは遮断案とその影響まで。実行するかどうかは、人が判断します。
              </p>
            </div>
            <dl className={styles.phases}>
              <div className={styles.phase}>
                <dt>平時</dt>
                <dd>
                  侵入の起点ごとに、拡散を止めつつ重要業務を最大限残す遮断の組み合わせを計算しておきます。止まる業務には、代替の運用（電話やFAXでの受注など）と必要な人員を紐づけます。
                </dd>
              </div>
              <div className={styles.phase}>
                <dt>有事</dt>
                <dd>
                  EDRやSIEMのアラートを読み、事前の計画から状況に合う遮断案を提示します。経営層には「この案なら受注は止まるが、出荷は続く」と、判断に必要な言葉で説明します。
                </dd>
              </div>
              <div className={styles.phase}>
                <dt>検証</dt>
                <dd>
                  デジタルツイン上で攻撃役のAIに侵入経路を探させ、遮断案の穴を洗い出します。攻撃役のAIは、本番環境には一切触れません。
                </dd>
              </div>
            </dl>
          </article>
          <article className={styles.feature}>
            <span className={styles.numeral}>三</span>
            <div className={styles.featureMain}>
              <p className={page.label}>戻せるかを確かめる（拡張機能）</p>
              <h3 className={styles.featureTitle}>復旧検査</h3>
              <p className={styles.featureBody}>
                「このシステムが暗号化されたら戻せるか」をAIが机上で検証します。会社ごとの机上演習のシナリオもつくります。
              </p>
            </div>
            <FeatureList
              heading="見つける「復旧の詰まり」"
              items={[
                "手順書が、止まるシステムの中にある",
                "復旧用のIDが、止まる認証基盤に依存している",
                "バックアップが、元のシステムと同じ環境にある",
                "担当者が1人しかいない",
                "目標復旧時間（RTO）に間に合わない",
              ]}
            />
          </article>
        </div>
      </section>

      <section className={cx(page.section, page.ruled)}>
        <SectionHead>
          <h2 className={page.heading}>
            届出から有事まで、
            <br />
            一年を通して使う。
          </h2>
          <p className={page.lead}>
            セキュリティ統括は地図の整備と遮断計画の作成に、CSIRTやFSIRTは有事の判断に、事業責任者と経営層は影響と復旧見込みの理解に使います。
          </p>
        </SectionHead>
        <table className={cx(table.table, styles.useCases)}>
          <thead>
            <tr>
              {useCases.columns.map((column) => (
                <th
                  key={column}
                  scope="col"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {useCases.rows.map(([scene, usage, result]) => (
              <tr key={scene}>
                <th
                  scope="row"
                  className={styles.sceneHead}
                >
                  {scene}
                </th>
                <td data-label={useCases.columns[1]}>{usage}</td>
                <td data-label={useCases.columns[2]}>{result}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* 日本の制度に関わる内容なので、日本語版だけに載せる（docs/spec.md §4） */}
      <section className={cx(page.section, page.ruled)}>
        <SectionHead>
          <h2 className={page.heading}>
            重要インフラ
            <br />
            統一基準との対応。
          </h2>
          <p className={page.lead}>
            2026年10月1日に施行される重要インフラ統一基準には、Pixie for
            Operationsの機能と直接つながる項目が並んでいます。統一基準の根底にある「任務保証」は、重要業務を起点に依存関係を描くPixieの設計と同じ考え方です。
          </p>
        </SectionHead>
        <table className={cx(table.table, styles.standards)}>
          <thead>
            <tr>
              {standards.columns.map((column) => (
                <th
                  key={column}
                  scope="col"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {standards.rows.map((row) => (
              <tr key={row.number}>
                <th
                  scope="row"
                  className={styles.standardHead}
                >
                  <span className={styles.standardNumber}>{row.number}</span>
                  {row.item}
                </th>
                <td data-label={standards.columns[1]}>{row.requirement}</td>
                <td
                  data-label={standards.columns[2]}
                  className={styles.standardFeature}
                >
                  {row.feature}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className={page.note}>
          出典：重要インフラのサイバーセキュリティ対策のための統一基準（サイバーセキュリティ戦略本部、2026年7月31日）
        </p>
      </section>

      <section className={cx(page.section, page.ruled)}>
        <SectionHead>
          <h2 className={page.heading}>
            停止の地図は、
            <br />
            攻撃者の地図にもなる。
          </h2>
          <p className={page.lead}>
            依存グラフは、攻撃者にとっても価値のある情報です。だからPixie for
            Operationsは、構成情報を外に出さない設計にしています。
          </p>
        </SectionHead>
        <div className={styles.principles}>
          {principles.map((principle) => (
            <div
              key={principle.title}
              className={styles.principle}
            >
              <h3 className={styles.principleTitle}>{principle.title}</h3>
              <p className={styles.principleBody}>{principle.body}</p>
            </div>
          ))}
        </div>
      </section>

      <CTABand
        label="デザインパートナー募集"
        heading={["実際のデータで、", "一緒に製品を磨いてください。"]}
        body="読み取り専用のPoCを通じて、停止の地図のつくり方と遮断案の出し方を一緒に検証してくださる事業者を募集しています。"
        button="デザインパートナーに応募する"
        to={paths.poc}
      />
    </>
  );
}
