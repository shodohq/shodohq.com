import { index, type RouteConfig } from "@react-router/dev/routes";

// 日本語のルートを並べ、英語は prefix("en", [...]) の下に並べる（docs/spec.md §7）
export default [index("routes/home.tsx")] satisfies RouteConfig;
