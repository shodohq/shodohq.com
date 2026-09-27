import { PolicyPage } from "~/components/PolicyPage";
import { getPolicy } from "~/lib/content.server";
import { breadcrumbJsonLd, pageMeta, pageTitle, paths, siteOriginFrom } from "~/lib/site";
import type { Route } from "./+types/privacy";

export function loader() {
  return getPolicy("privacy", "ja");
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
    breadcrumbJsonLd(siteOriginFrom(matches), "ja", [{ name: title, path: paths.privacy }]),
  ];
}

/** 参照 ja-privacy.html */
export default function Privacy({ loaderData }: Route.ComponentProps) {
  return (
    <PolicyPage
      lang="ja"
      policy={loaderData}
    />
  );
}
