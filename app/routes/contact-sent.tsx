import { PageHeader, PageTitle } from "~/components/PageHeader";
import { RuleDot } from "~/components/RuleDot";
import { TextLink } from "~/components/TextLink";
import { langFromPath, localizePath, pageMeta, pageTitle, paths } from "~/lib/site";
import { useLang } from "~/lib/use-lang";
import type { Route } from "./+types/contact-sent";
import styles from "./contact-sent.module.css";

/** 文言（docs/spec.md §6.4「通常」） */
const copy = {
  ja: {
    contact: "お問い合わせ",
    title: "送信しました",
    body: "お問い合わせありがとうございます。内容を確認のうえ、3営業日以内にご返信します。",
    home: "トップに戻る",
  },
  en: {
    contact: "Contact",
    title: "Thank you. Your message has been sent.",
    body: "We will reply within three business days.",
    home: "Back to home",
  },
} as const;

/** 検索に載せない。サイトマップにも入れない（docs/spec.md §6.4） */
export function meta({ matches, location }: Route.MetaArgs) {
  const lang = langFromPath(location.pathname);
  const t = copy[lang];
  return pageMeta({
    matches,
    pathname: location.pathname,
    title: pageTitle(t.title, lang),
    description: t.body,
    noindex: true,
  });
}

/**
 * 送信完了（JavaScriptが動かないときの送信のあとに移るページ。docs/spec.md §6.4）。
 * 参照はないので、下層ページのH1の形で作る
 */
export default function ContactSent() {
  const lang = useLang();
  const t = copy[lang];
  return (
    <PageHeader
      lang={lang}
      breadcrumb={[{ label: t.contact, to: localizePath(lang, paths.contact) }, { label: t.title }]}
    >
      <PageTitle>{t.title}</PageTitle>
      <RuleDot size="sm" />
      <p className={styles.body}>{t.body}</p>
      <div>
        <TextLink to={localizePath(lang, paths.home)}>{t.home}</TextLink>
      </div>
    </PageHeader>
  );
}
