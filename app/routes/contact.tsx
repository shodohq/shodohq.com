import type { ReactNode } from "react";
import { Link } from "react-router";
import { InquiryForm } from "~/components/InquiryForm";
import { PageHeader, PageTitle } from "~/components/PageHeader";
import { RuleDot } from "~/components/RuleDot";
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
import type { Route } from "./+types/contact";
import styles from "./contact.module.css";

type Links = { poc: string; privacy: string };

type Copy = {
  title: string;
  description: string;
  lead: string;
  guides: readonly { title: string; body: (links: Links) => ReactNode }[];
  note: (links: Links) => ReactNode;
};

const email = <a href="mailto:security@shodohq.com">security@shodohq.com</a>;

/** 文言（参照 ja-contact.html、en-contact.html） */
const copy: Record<Lang, Copy> = {
  ja: {
    title: "お問い合わせ",
    description:
      "製品やPoCについてのご相談、脆弱性の報告を受け付けています。3営業日以内にご返信します。",
    lead: "製品やPoCについてのご相談、脆弱性の報告などは、こちらのフォームからお送りください。内容を確認のうえ、3営業日以内にご返信します。",
    guides: [
      {
        title: "PoCへの応募",
        body: ({ poc }) => (
          <>
            募集の内容は、<Link to={poc}>PoC・デザインパートナー募集</Link>のページをご覧ください。
          </>
        ),
      },
      {
        title: "脆弱性の報告",
        body: () => (
          <>
            {email}{" "}
            にメールでお送りいただくか、このフォームで「脆弱性の報告」を選んでください。対象のURL、再現の手順、想定される影響をお書きください。
          </>
        ),
      },
    ],
    note: ({ privacy }) => (
      <>
        いただいた情報は、<Link to={privacy}>プライバシーポリシー</Link>に沿って取り扱います。
      </>
    ),
  },
  en: {
    title: "Contact",
    description:
      "Questions about our products or PoCs, and vulnerability reports. We reply within three business days.",
    lead: "Use this form for questions about our products or PoCs, or to report a vulnerability. We reply within three business days.",
    guides: [
      {
        title: "Applying for a PoC",
        body: ({ poc }) => (
          <>
            For details, see the <Link to={poc}>PoCs and design partners</Link> page.
          </>
        ),
      },
      {
        title: "Reporting a vulnerability",
        body: () => (
          <>
            Email {email}, or choose “Vulnerability report” in this form. Please include the
            affected URL, steps to reproduce, and the expected impact.
          </>
        ),
      },
    ],
    note: ({ privacy }) => (
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
    breadcrumbJsonLd(siteOriginFrom(matches), lang, [{ name: t.title, path: paths.contact }]),
  ];
}

/** お問い合わせ（参照 ja-contact.html、en-contact.html） */
export default function Contact() {
  const lang = useLang();
  const t = copy[lang];
  const links: Links = {
    poc: localizePath(lang, paths.poc),
    privacy: localizePath(lang, paths.privacy),
  };

  return (
    <>
      <PageHeader
        lang={lang}
        breadcrumb={[{ label: t.title }]}
      >
        <PageTitle>{t.title}</PageTitle>
        <RuleDot size="sm" />
        <p className={page.introLead}>{t.lead}</p>
      </PageHeader>

      <section className={page.formSection}>
        <div className={styles.guide}>
          {t.guides.map((guide) => (
            <div
              key={guide.title}
              className={styles.guideItem}
            >
              <h2 className={styles.guideTitle}>{guide.title}</h2>
              <p className={styles.guideBody}>{guide.body(links)}</p>
            </div>
          ))}
          <p className={page.formNote}>{t.note(links)}</p>
        </div>
        <InquiryForm
          lang={lang}
          form="contact"
        />
      </section>
    </>
  );
}
