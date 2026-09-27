import { PolicyPage } from "~/components/PolicyPage";
import { getPolicy } from "~/lib/content.server";
import { breadcrumbJsonLd, pageMeta, pageTitle, paths, siteOriginFrom } from "~/lib/site";
import type { Route } from "./+types/security-policy";

export function loader() {
  return getPolicy("security-policy", "ja");
}

export function meta({ loaderData, matches, location }: Route.MetaArgs) {
  if (!loaderData) return [];
  const { title, description } = loaderData.frontmatter;
  return [
    ...pageMeta({
      matches,
      pathname: location.pathname,
      title: pageTitle(title, "ja"),
      description,
    }),
    breadcrumbJsonLd(siteOriginFrom(matches), "ja", [
      { name: "会社情報", path: paths.company },
      { name: title, path: paths.securityPolicy },
    ]),
  ];
}

/** 参照 ja-security-policy.html */
export default function SecurityPolicy({ loaderData }: Route.ComponentProps) {
  return (
    <PolicyPage
      lang="ja"
      parents={[{ label: "会社情報", to: paths.company }]}
      policy={loaderData}
    />
  );
}
