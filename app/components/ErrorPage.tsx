import { type Lang, localizePath, paths } from "~/lib/site";
import styles from "./ErrorPage.module.css";
import { PageHeader, PageTitle } from "./PageHeader";
import { RuleDot } from "./RuleDot";
import { TextLink } from "./TextLink";

export type ErrorKind = "notFound" | "error";

/** 404とエラーのページの文言（docs/spec.md §14） */
const copy: Record<
  Lang,
  Record<ErrorKind, { title: string; body: string; links: [string, string][] }>
> = {
  ja: {
    notFound: {
      title: "ページが見つかりません",
      body: "お探しのページは、移動または削除された可能性があります。",
      links: [
        ["トップに戻る", paths.home],
        ["記事一覧", paths.articles],
      ],
    },
    error: {
      title: "エラーが発生しました",
      body: "時間をおいて、もう一度お試しください。",
      links: [["トップに戻る", paths.home]],
    },
  },
  en: {
    notFound: {
      title: "Page not found",
      body: "The page you are looking for may have been moved or deleted.",
      links: [
        ["Back to home", paths.home],
        ["Articles", paths.articles],
      ],
    },
    error: {
      title: "Something went wrong",
      body: "Please try again in a few minutes.",
      links: [["Back to home", paths.home]],
    },
  },
};

export function errorTitle(lang: Lang, kind: ErrorKind): string {
  return copy[lang][kind].title;
}

/** 404とエラーのページ。下層ページのH1の形で作り、パンくずは出さない（§14） */
export function ErrorPage({ lang, kind }: { lang: Lang; kind: ErrorKind }) {
  const { title, body, links } = copy[lang][kind];
  return (
    <PageHeader lang={lang}>
      <PageTitle>{title}</PageTitle>
      <RuleDot size="sm" />
      <p className={styles.body}>{body}</p>
      <div className={styles.links}>
        {links.map(([label, path]) => (
          <TextLink
            key={path}
            to={localizePath(lang, path)}
          >
            {label}
          </TextLink>
        ))}
      </div>
    </PageHeader>
  );
}
