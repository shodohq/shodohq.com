import { Link } from "react-router";
import { InquiryForm } from "~/components/InquiryForm";
import { PageHeader, PageTitle } from "~/components/PageHeader";
import { RuleDot } from "~/components/RuleDot";
import { breadcrumbJsonLd, pageMeta, pageTitle, paths, siteOriginFrom } from "~/lib/site";
import page from "~/styles/page.module.css";
import type { Route } from "./+types/contact";
import styles from "./contact.module.css";

const title = "お問い合わせ";

export function meta({ matches, location }: Route.MetaArgs) {
  return [
    ...pageMeta({
      matches,
      pathname: location.pathname,
      title: pageTitle(title, "ja"),
      description:
        "製品やPoCについてのご相談、脆弱性の報告を受け付けています。3営業日以内にご返信します。",
    }),
    breadcrumbJsonLd(siteOriginFrom(matches), "ja", [{ name: title, path: paths.contact }]),
  ];
}

/** お問い合わせ（参照 ja-contact.html） */
export default function Contact() {
  return (
    <>
      <PageHeader
        lang="ja"
        breadcrumb={[{ label: title }]}
      >
        <PageTitle>{title}</PageTitle>
        <RuleDot size="sm" />
        <p className={page.introLead}>
          製品やPoCについてのご相談、脆弱性の報告などは、こちらのフォームからお送りください。内容を確認のうえ、3営業日以内にご返信します。
        </p>
      </PageHeader>

      <section className={page.formSection}>
        <div className={styles.guide}>
          <div className={styles.guideItem}>
            <h2 className={styles.guideTitle}>PoCへの応募</h2>
            <p className={styles.guideBody}>
              募集の内容は、<Link to={paths.poc}>PoC・デザインパートナー募集</Link>
              のページをご覧ください。
            </p>
          </div>
          <div className={styles.guideItem}>
            <h2 className={styles.guideTitle}>脆弱性の報告</h2>
            <p className={styles.guideBody}>
              <a href="mailto:security@shodohq.com">security@shodohq.com</a>{" "}
              にメールでお送りいただくか、このフォームで「脆弱性の報告」を選んでください。対象のURL、再現の手順、想定される影響をお書きください。
            </p>
          </div>
          <p className={page.formNote}>
            いただいた情報は、<Link to={paths.privacy}>プライバシーポリシー</Link>
            に沿って取り扱います。
          </p>
        </div>
        <InquiryForm form="contact" />
      </section>
    </>
  );
}
