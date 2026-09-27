import { Button } from "~/components/Button";
import { CTABand } from "~/components/CTABand";
import { DependencyChain } from "~/components/DependencyChain";
import { Lines } from "~/components/Lines";
import { PageHeader, PageTitle } from "~/components/PageHeader";
import { RuleDot } from "~/components/RuleDot";
import { SectionHead } from "~/components/SectionHead";
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
import table from "~/styles/table.module.css";
import type { Route } from "./+types/pixie-for-operations";
import styles from "./pixie-for-operations.module.css";

const productName = "Pixie for Operations";

type FeatureListCopy = { heading: string; items: readonly string[] };

type Copy = {
  description: string;
  products: string;
  tag: string;
  statement: readonly string[];
  lead: string;
  note: string;
  apply: string;
  compare: {
    heading: readonly string[];
    lead: string;
    theirs: string;
    rows: readonly { head: string; theirs: readonly string[]; ours: readonly string[] }[];
    note: string;
  };
  features: {
    heading: readonly string[];
    lead: string;
    chain: readonly string[];
    caption: string;
    numerals: readonly [string, string, string];
    map: { label: string; title: string; body: string; lists: readonly FeatureListCopy[] };
    containment: {
      label: string;
      title: string;
      body: string;
      phases: readonly { term: string; detail: string }[];
    };
    recovery: { label: string; title: string; body: string; list: FeatureListCopy };
  };
  useCases: {
    heading: readonly string[];
    lead: string;
    columns: readonly [string, string, string];
    rows: readonly (readonly [string, string, string])[];
  };
  /** 重要インフラ統一基準との対応。日本の制度の話なので日本語版だけ（docs/spec.md §4） */
  standards?: {
    heading: readonly string[];
    lead: string;
    columns: readonly [string, string, string];
    rows: readonly { number: string; item: string; requirement: string; feature: string }[];
    source: string;
  };
  principles: {
    heading: readonly string[];
    lead: string;
    items: readonly { title: string; body: string }[];
  };
  cta: { label: string; heading: readonly string[]; body: string; button: string };
};

/** 文言（参照 ja-pixie-for-operations.html、en-pixie-for-operations.html） */
const copy: Record<Lang, Copy> = {
  ja: {
    description:
      "資産台帳・構成図・契約書・手順書から「停止の地図」をつくり、業務を残す遮断案を示す意思決定AIです。現在開発中で、デザインパートナーを募集しています。",
    products: "製品",
    tag: "開発中・デザインパートナー募集",
    statement: ["業務を止めずに守るための、", "意思決定AI。"],
    lead: "重要インフラ・産業企業がサイバー攻撃を受けたときに、業務を止めずに守るための意思決定AIです。手元の資産台帳・構成図・契約書・手順書から、重要業務がどのシステム・ID・委託先・バックアップに依存しているかを示す「停止の地図」をつくります。その地図を使い、拡散を止めつつ重要業務を最大限残す遮断計画を、経営判断の言葉で示します。",
    note: "Pixie for Operationsは開発中です。このページの内容は開発中の構想で、今後変わる場合があります。",
    apply: "デザインパートナーに応募する",
    compare: {
      heading: ["既存の製品とは、", "答える問いが違う。"],
      lead: "既存のEDR、SIEM、脆弱性管理、OT監視は、それぞれの領域の「点」を見ています。一方で経営層が知りたいのは、「何が止まり、いつ戻るか」です。Pixie for Operationsは、その間をつなぎます。",
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
      note: "Pixie for Operationsは、既存の製品を置き換えません。その出力を取り込み、「業務を止めない判断」を支える層として動きます。",
    },
    features: {
      heading: ["平時の備えから、", "有事の判断まで。"],
      lead: "「停止の地図」「止め方AI」「復旧検査」の3つの機能で、平時の備えから有事の判断までを、ひとつの依存グラフでつなぎます。土台になるのは停止の地図です。",
      chain: ["重要業務", "システム", "ID", "委託先", "担当者", "バックアップ"],
      caption: "停止の地図：重要業務を起点に依存関係をたどり、どこで切れば何が残るかを計算します。",
      numerals: ["一", "二", "三"],
      map: {
        label: "平時に描く",
        title: "停止の地図",
        body: "手元の文書と既存ツールの出力をAIが読み込み、重要業務からシステム、ID、委託先、担当者、バックアップまでの依存関係を組み立てます。",
        lists: [
          {
            heading: "読み込むもの",
            items: [
              "資産台帳（Excel）",
              "ネットワーク構成図（画像・PDF）",
              "保守・委託契約書、委託先一覧",
              "VPN・リモートアクセスの申請",
              "BCP、復旧手順書",
              "既存ツールの出力（EDR、脆弱性管理、IAM、OT監視）",
            ],
          },
          {
            heading: "わかること",
            items: [
              "業務を起点にした依存グラフ",
              "書類同士の矛盾（例：構成図にない保守回線がVPN申請書にある）",
              "放置された委託先アカウントや、MFAの例外",
              "サイバー対処能力強化法の届出対象の候補と、その根拠",
            ],
          },
        ],
      },
      containment: {
        label: "有事に選ぶ",
        title: "止め方AI",
        body: "攻撃を受けたときに「どこを切れば、何が止まり、何が残るか」を示します。拡散を止めることと、重要業務を残すことを両立させる遮断の組み合わせを探します。AIが示すのは遮断案とその影響まで。実行するかどうかは、人が判断します。",
        phases: [
          {
            term: "平時",
            detail:
              "侵入の起点ごとに、拡散を止めつつ重要業務を最大限残す遮断の組み合わせを計算しておきます。止まる業務には、代替の運用（電話やFAXでの受注など）と必要な人員を紐づけます。",
          },
          {
            term: "有事",
            detail:
              "EDRやSIEMのアラートを読み、事前の計画から状況に合う遮断案を提示します。経営層には「この案なら受注は止まるが、出荷は続く」と、判断に必要な言葉で説明します。",
          },
          {
            term: "検証",
            detail:
              "デジタルツイン上で攻撃役のAIに侵入経路を探させ、遮断案の穴を洗い出します。攻撃役のAIは、本番環境には一切触れません。",
          },
        ],
      },
      recovery: {
        label: "戻せるかを確かめる（拡張機能）",
        title: "復旧検査",
        body: "「このシステムが暗号化されたら戻せるか」をAIが机上で検証します。会社ごとの机上演習のシナリオもつくります。",
        list: {
          heading: "見つける「復旧の詰まり」",
          items: [
            "手順書が、止まるシステムの中にある",
            "復旧用のIDが、止まる認証基盤に依存している",
            "バックアップが、元のシステムと同じ環境にある",
            "担当者が1人しかいない",
            "目標復旧時間（RTO）に間に合わない",
          ],
        },
      },
    },
    useCases: {
      heading: ["届出から有事まで、", "一年を通して使う。"],
      lead: "セキュリティ統括は地図の整備と遮断計画の作成に、CSIRTやFSIRTは有事の判断に、事業責任者と経営層は影響と復旧見込みの理解に使います。",
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
    },
    standards: {
      heading: ["重要インフラ", "統一基準との対応。"],
      lead: "2026年10月1日に施行される重要インフラ統一基準には、Pixie for Operationsの機能と直接つながる項目が並んでいます。統一基準の根底にある「任務保証」は、重要業務を起点に依存関係を描くPixieの設計と同じ考え方です。",
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
      source:
        "出典：重要インフラのサイバーセキュリティ対策のための統一基準（サイバーセキュリティ戦略本部、2026年7月31日）",
    },
    principles: {
      heading: ["停止の地図は、", "攻撃者の地図にもなる。"],
      lead: "依存グラフは、攻撃者にとっても価値のある情報です。だからPixie for Operationsは、構成情報を外に出さない設計にしています。",
      items: [
        {
          title: "読み取り専用",
          body: "既存の環境には書き込みません。センサーやエージェントの設置も不要です。",
        },
        {
          title: "国内・閉域・オンプレミス",
          body: "国内・閉域で動くLLMの構成を選べます。オンプレミスでの運用にも対応します。",
        },
        {
          title: "最小権限と監査ログ",
          body: "必要最小限の権限で動き、操作を監査ログに記録します。",
        },
        {
          title: "本番に触れない検証",
          body: "遮断案の検証は、デジタルツインの上だけで行います。",
        },
      ],
    },
    cta: {
      label: "デザインパートナー募集",
      heading: ["実際のデータで、", "一緒に製品を磨いてください。"],
      body: "読み取り専用のPoCを通じて、停止の地図のつくり方と遮断案の出し方を一緒に検証してくださる事業者を募集しています。",
      button: "デザインパートナーに応募する",
    },
  },
  en: {
    description:
      "Decision AI that builds an outage map from your documents and proposes containment plans that keep critical operations running. In development and seeking design partners.",
    products: "Products",
    tag: "In development · Seeking design partners",
    statement: ["Decision AI that keeps", "operations running."],
    lead: "Pixie for Operations helps critical infrastructure and industrial organizations stay operational under cyberattack. From your asset inventories, network diagrams, contracts, and runbooks, it builds an outage map showing which systems, identities, contractors, and backups your critical operations depend on. It then uses that map to propose containment plans that stop the spread while keeping as much critical business running as possible, explained in terms executives can act on.",
    // 英語版では「日本の組織向けに先に設計している」と必ず書く（docs/content-rules.md §2）
    note: "Pixie for Operations is in development and is being designed first for organizations operating in Japan. This page describes our current plans, which may change.",
    apply: "Apply to be a design partner",
    compare: {
      heading: ["A different question", "from existing tools."],
      lead: "EDR, SIEM, vulnerability management, and OT monitoring each watch their own domain. Executives want to know something else: what will stop, and when it will come back. Pixie for Operations connects the two.",
      theirs: "Typical exposure management",
      rows: [
        {
          head: "The question it answers",
          theirs: ["Attack paths to critical assets, and what to fix first"],
          ours: ["How to contain without stopping the business, and whether you can recover"],
        },
        {
          head: "Main data sources",
          theirs: ["Agents and API integrations"],
          ours: ["Your existing documents and tool exports"],
        },
        {
          head: "Scope",
          theirs: ["Technical assets, identities, vulnerabilities"],
          ours: [
            "All of that, plus business processes, contractors, people, runbooks, and backups",
          ],
        },
        {
          head: "During an incident",
          theirs: ["Mostly prioritization before an incident"],
          ours: ["Containment options, explained for executives"],
        },
      ],
      note: "Pixie for Operations does not replace your existing tools. It takes in their output and adds a decision layer focused on keeping the business running.",
    },
    features: {
      heading: ["Prepare in advance.", "Decide with clarity."],
      lead: "Three functions, the outage map, containment AI, and the recovery check, connect everyday preparation and incident decisions through a single dependency graph. The outage map is the foundation.",
      chain: ["Critical operations", "Systems", "Identities", "Contractors", "People", "Backups"],
      caption:
        "Outage map: starting from critical operations, trace dependencies to see what each cut would stop and what would keep running.",
      numerals: ["1", "2", "3"],
      map: {
        label: "Map it in advance",
        title: "Outage map",
        body: "AI reads your existing documents and tool exports to build the dependency chain from critical operations to systems, identities, contractors, people, and backups.",
        lists: [
          {
            heading: "What it reads",
            items: [
              "Asset inventories (Excel)",
              "Network diagrams (images, PDF)",
              "Maintenance and outsourcing contracts, contractor lists",
              "VPN and remote-access requests",
              "BCPs and recovery runbooks",
              "Exports from EDR, vulnerability management, IAM, and OT monitoring",
            ],
          },
          {
            heading: "What you learn",
            items: [
              "A dependency graph built around your operations",
              "Contradictions between documents, such as a maintenance line in a VPN request that is missing from the network diagram",
              "Dormant contractor accounts and MFA exceptions",
              "Candidate systems for regulatory notification, with the evidence for each",
            ],
          },
        ],
      },
      containment: {
        label: "Choose in an incident",
        title: "Containment AI",
        body: "When an attack hits, it shows what to cut, what will stop, and what will keep running, looking for isolation steps that stop the spread while preserving critical operations. AI proposes the plan and shows its impact; people decide whether to act.",
        phases: [
          {
            term: "Before",
            detail:
              "For each possible point of entry, it precomputes isolation plans that stop the spread while preserving as much critical business as possible. Operations that will stop are linked to fallback procedures, such as taking orders by phone or fax, and to the people needed.",
          },
          {
            term: "During",
            detail:
              "It reads EDR and SIEM alerts and proposes the prepared plan that fits the situation, explaining it to executives in plain terms: “With this plan, order intake stops, but shipping continues.”",
          },
          {
            term: "Testing",
            detail:
              "An attacker AI probes a digital twin for paths around each plan. It never touches production systems.",
          },
        ],
      },
      recovery: {
        label: "Confirm you can recover (extension)",
        title: "Recovery check",
        body: "AI checks on paper whether a system could be restored if it were encrypted, and generates tabletop scenarios tailored to your organization.",
        list: {
          heading: "Recovery blockers it looks for",
          items: [
            "Runbooks stored on the systems that would go down",
            "Recovery accounts that depend on an identity platform that would go down",
            "Backups kept in the same environment as the original systems",
            "Only one person who knows the procedure",
            "Restores that cannot meet the recovery time objective (RTO)",
          ],
        },
      },
    },
    useCases: {
      heading: ["Useful all year,", "not just in a crisis."],
      lead: "Security leads use it to maintain the map and plan containment. CSIRT and FSIRT teams use it to make decisions during incidents. Business owners and executives use it to understand impact and recovery time.",
      columns: ["When", "How it is used", "What you get"],
      rows: [
        [
          "Regulatory notifications",
          "Import inventories, diagrams, and contracts",
          "Candidate systems to report, with evidence and contractor details",
        ],
        [
          "Quarterly change management",
          "Detect what has changed since the last review",
          "Changes that may need to be reported",
        ],
        [
          "Contractor oversight",
          "Compare contracts and access requests with actual accounts",
          "Lists of dormant accounts and MFA exceptions",
        ],
        [
          "BCP reviews and tabletop exercises",
          "Rehearse with containment plans for each intrusion scenario",
          "Executives practice making the call to stop",
        ],
        [
          "During a ransomware incident",
          "Generate containment options from alerts",
          "A clear view of what to stop and what keeps running",
        ],
      ],
    },
    principles: {
      heading: ["An outage map is also", "an attacker’s map."],
      lead: "A dependency graph is valuable to attackers, too. That is why Pixie for Operations is designed to keep your configuration data inside your environment.",
      items: [
        {
          title: "Read-only",
          body: "It never writes to your environment and needs no sensors or agents.",
        },
        {
          title: "Closed networks and on-premises",
          body: "Choose an LLM setup that runs on a closed network, or run it on-premises.",
        },
        {
          title: "Least privilege and audit logs",
          body: "It runs with only the permissions it needs and records actions in audit logs.",
        },
        {
          title: "Testing off production",
          body: "Containment plans are tested only on a digital twin.",
        },
      ],
    },
    cta: {
      label: "Seeking design partners",
      heading: ["Help shape the product", "with your real data."],
      body: "Through a read-only PoC, we want to validate with you how the outage map is built and how containment plans are proposed.",
      button: "Apply to be a design partner",
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
      title: pageTitle(productName, lang),
      description: t.description,
    }),
    breadcrumbJsonLd(siteOriginFrom(matches), lang, [
      { name: t.products, path: paths.products },
      { name: productName, path: paths.pixieForOperations },
    ]),
  ];
}

/** 機能の詳細の一覧（見出しと、上に罫線の付いた項目） */
function FeatureList({ heading, items }: FeatureListCopy) {
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

/** Pixie for Operations（参照 ja-pixie-for-operations.html、en-pixie-for-operations.html） */
export default function PixieForOperations() {
  const lang = useLang();
  const t = copy[lang];
  const { compare, features, useCases, standards, principles } = t;
  const poc = localizePath(lang, paths.poc);

  return (
    <>
      <PageHeader
        lang={lang}
        breadcrumb={[
          { label: t.products, to: localizePath(lang, paths.products) },
          { label: productName },
        ]}
        bottom="lg"
      >
        {/* 開発中の製品であることの表示。外さない（CLAUDE.md） */}
        <Tag className={styles.heroTag}>{t.tag}</Tag>
        <PageTitle className={styles.heroTitle}>{productName}</PageTitle>
        <RuleDot size="sm" />
        <div className={page.intro}>
          <p className={page.introStatement}>
            <Lines lines={t.statement} />
          </p>
          <div className={styles.heroSide}>
            <p className={page.lead}>{t.lead}</p>
            <p className={page.note}>{t.note}</p>
            <div>
              <Button to={poc}>{t.apply}</Button>
            </div>
          </div>
        </div>
      </PageHeader>

      <section className={cx(page.section, page.ruled)}>
        <SectionHead>
          <h2 className={page.heading}>
            <Lines lines={compare.heading} />
          </h2>
          <p className={page.lead}>{compare.lead}</p>
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
                {compare.theirs}
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
                  {productName}
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {compare.rows.map((row) => (
              <tr key={row.head}>
                <th
                  scope="row"
                  className={styles.comparisonRowHead}
                >
                  {row.head}
                </th>
                <td
                  data-label={compare.theirs}
                  className={styles.theirs}
                >
                  <Lines lines={row.theirs} />
                </td>
                <td data-label={productName}>
                  <Lines lines={row.ours} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className={styles.tableNote}>{compare.note}</p>
      </section>

      <section className={cx(page.section, page.gapLg, page.ruled)}>
        <SectionHead>
          <h2 className={page.heading}>
            <Lines lines={features.heading} />
          </h2>
          <p className={page.lead}>{features.lead}</p>
        </SectionHead>
        <DependencyChain
          nodes={features.chain}
          caption={features.caption}
        />
        <div className={styles.features}>
          <article className={styles.feature}>
            <span className={styles.numeral}>{features.numerals[0]}</span>
            <div className={styles.featureMain}>
              <p className={cx(page.label, styles.featureLabel)}>{features.map.label}</p>
              <h3 className={styles.featureTitle}>{features.map.title}</h3>
              <p className={styles.featureBody}>{features.map.body}</p>
            </div>
            <div className={styles.featureLists}>
              {features.map.lists.map((list) => (
                <FeatureList
                  key={list.heading}
                  {...list}
                />
              ))}
            </div>
          </article>
          <article className={styles.feature}>
            <span className={styles.numeral}>{features.numerals[1]}</span>
            <div className={styles.featureMain}>
              <p className={cx(page.label, styles.featureLabel)}>{features.containment.label}</p>
              <h3 className={styles.featureTitle}>{features.containment.title}</h3>
              <p className={styles.featureBody}>{features.containment.body}</p>
            </div>
            <dl className={styles.phases}>
              {features.containment.phases.map((phase) => (
                <div
                  key={phase.term}
                  className={styles.phase}
                >
                  <dt>{phase.term}</dt>
                  <dd>{phase.detail}</dd>
                </div>
              ))}
            </dl>
          </article>
          <article className={styles.feature}>
            <span className={styles.numeral}>{features.numerals[2]}</span>
            <div className={styles.featureMain}>
              <p className={cx(page.label, styles.featureLabel)}>{features.recovery.label}</p>
              <h3 className={styles.featureTitle}>{features.recovery.title}</h3>
              <p className={styles.featureBody}>{features.recovery.body}</p>
            </div>
            <FeatureList {...features.recovery.list} />
          </article>
        </div>
      </section>

      <section className={cx(page.section, page.ruled)}>
        <SectionHead>
          <h2 className={page.heading}>
            <Lines lines={useCases.heading} />
          </h2>
          <p className={page.lead}>{useCases.lead}</p>
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
      {standards && (
        <section className={cx(page.section, page.ruled)}>
          <SectionHead>
            <h2 className={page.heading}>
              <Lines lines={standards.heading} />
            </h2>
            <p className={page.lead}>{standards.lead}</p>
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
          <p className={page.note}>{standards.source}</p>
        </section>
      )}

      <section className={cx(page.section, page.ruled)}>
        <SectionHead>
          <h2 className={page.heading}>
            <Lines lines={principles.heading} />
          </h2>
          <p className={page.lead}>{principles.lead}</p>
        </SectionHead>
        <div className={styles.principles}>
          {principles.items.map((principle) => (
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
        {...t.cta}
        to={poc}
      />
    </>
  );
}
