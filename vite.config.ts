import { cloudflare } from "@cloudflare/vite-plugin";
import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import { content } from "./vite-plugins/content.ts";

export default defineConfig({
  // content/ のMarkdownは、ビルドのときにHTMLにする（docs/spec.md §8）
  plugins: [content(), cloudflare({ viteEnvironment: { name: "ssr" } }), reactRouter()],
  resolve: {
    tsconfigPaths: true,
  },
  build: {
    // 小さなファイルを data: のURLにして埋め込まない。font-src 'self' で止まるため（docs/spec.md §12.2）
    assetsInlineLimit: 0,
  },
});
