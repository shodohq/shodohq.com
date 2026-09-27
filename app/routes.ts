import { index, type RouteConfig, route } from "@react-router/dev/routes";

// 日本語のルートを並べ、英語は prefix("en", [...]) の下に並べる（docs/spec.md §7）。
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
] satisfies RouteConfig;
