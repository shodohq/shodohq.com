import { PolicyPage } from "~/components/PolicyPage";
import { getPolicy } from "~/lib/content.server";
import {
  breadcrumbJsonLd,
  localizePath,
  pageMeta,
  pageTitle,
  paths,
  siteOriginFrom,
} from "~/lib/site";
import type { Route } from "./+types/security-policy";

/** 英語版は content/pages/security-policy.en.md（日本語版のルートとはモジュールを分け、loader で言語を決める） */
export function loader() {
  return getPolicy("security-policy", "en");
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
    breadcrumbJsonLd(siteOriginFrom(matches), "en", [
      { name: "Company", path: paths.company },
      { name: title, path: paths.securityPolicy },
    ]),
  ];
}

/** 参照 en-security-policy.html */
export default function EnglishSecurityPolicy({ loaderData }: Route.ComponentProps) {
  return (
    <PolicyPage
      lang="en"
      parents={[{ label: "Company", to: localizePath("en", paths.company) }]}
      policy={loaderData}
    />
  );
}
