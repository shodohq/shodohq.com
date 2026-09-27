import { PageHeader, PageTitle } from "~/components/PageHeader";
import { RuleDot } from "~/components/RuleDot";
import { TextLink } from "~/components/TextLink";
import { pageMeta, pageTitle, paths } from "~/lib/site";
import type { Route } from "./+types/contact-sent";
import styles from "./contact-sent.module.css";

const title = "送信しました";

/** 検索に載せない。サイトマップにも入れない（docs/spec.md §6.4） */
export function meta({ matches, location }: Route.MetaArgs) {
  return pageMeta({
    matches,
    pathname: location.pathname,
    title: pageTitle(title, "ja"),
    description: "お問い合わせありがとうございます。内容を確認のうえ、3営業日以内にご返信します。",
    noindex: true,
  });
}

/**
 * 送信完了（JavaScriptが動かないときの送信のあとに移るページ。docs/spec.md §6.4）。
 * 参照はないので、下層ページのH1の形で作る
 */
export default function ContactSent() {
  return (
    <PageHeader
      lang="ja"
      breadcrumb={[{ label: "お問い合わせ", to: paths.contact }, { label: title }]}
    >
      <PageTitle>{title}</PageTitle>
      <RuleDot size="sm" />
      <p className={styles.body}>
        お問い合わせありがとうございます。内容を確認のうえ、3営業日以内にご返信します。
      </p>
      <div>
        <TextLink to={paths.home}>トップに戻る</TextLink>
      </div>
    </PageHeader>
  );
}
