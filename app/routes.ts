import { index, prefix, type RouteConfig, route } from "@react-router/dev/routes";

// 日本語のルートを並べ、英語は prefix("en", [...]) の下に並べる（docs/spec.md §7）。
// 日英で同じモジュールを使うページは、id を分け、文言はURLの言語で切り替える。
// loader が言語で中身を変えるページ（記事一覧、ポリシー）は、英語のモジュールを routes/en/ に分ける。
// 見つからないURLを受けるルート（"*"）は作らない。ルートの ErrorBoundary が404を描く（§14）
export default [
  index("routes/home.tsx"),
  route("products", "routes/products.tsx"),
  route("products/pixie-for-operations", "routes/pixie-for-operations.tsx"),
  route("poc", "routes/poc.tsx"),
  route("articles", "routes/articles.tsx"),
  route("articles/:slug", "routes/article.tsx"),
  route("company", "routes/company.tsx"),
  route("contact", "routes/contact.tsx"),
  route("contact/sent", "routes/contact-sent.tsx"),
  route("privacy", "routes/privacy.tsx"),
  route("security-policy", "routes/security-policy.tsx"),

  // 英語。記事は日本語だけなので、記事ページはない（§2）
  ...prefix("en", [
    index("routes/home.tsx", { id: "en-home" }),
    route("products", "routes/products.tsx", { id: "en-products" }),
    route("products/pixie-for-operations", "routes/pixie-for-operations.tsx", {
      id: "en-pixie-for-operations",
    }),
    route("poc", "routes/poc.tsx", { id: "en-poc" }),
    route("articles", "routes/en/articles.tsx"),
    route("company", "routes/company.tsx", { id: "en-company" }),
    route("contact", "routes/contact.tsx", { id: "en-contact" }),
    route("contact/sent", "routes/contact-sent.tsx", { id: "en-contact-sent" }),
    route("privacy", "routes/en/privacy.tsx"),
    route("security-policy", "routes/en/security-policy.tsx"),
  ]),
] satisfies RouteConfig;
