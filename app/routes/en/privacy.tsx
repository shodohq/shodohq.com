import { PolicyPage } from "~/components/PolicyPage";
import { getPolicy } from "~/lib/content.server";
import { breadcrumbJsonLd, pageMeta, pageTitle, paths, siteOriginFrom } from "~/lib/site";
import type { Route } from "./+types/privacy";

/** 英語版は content/pages/privacy.en.md（日本語版のルートとはモジュールを分け、loader で言語を決める） */
export function loader() {
  return getPolicy("privacy", "en");
}

export function meta({ loaderData, matches, location }: Route.MetaArgs) {
  if (!loaderData) return [];
  const { title, description } = loaderData.frontmatter;
  return [
    ...pageMeta({
      matches,
      pathname: location.pathname,
      title: pageTitle(title, "en"),
      description,
    }),
    breadcrumbJsonLd(siteOriginFrom(matches), "en", [{ name: title, path: paths.privacy }]),
  ];
}

/** 参照 en-privacy.html */
export default function EnglishPrivacy({ loaderData }: Route.ComponentProps) {
  return (
    <PolicyPage
      lang="en"
      policy={loaderData}
    />
  );
}
