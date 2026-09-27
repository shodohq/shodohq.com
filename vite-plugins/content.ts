/**
 * content/ のMarkdownを、ビルドのときにHTMLに変えるViteプラグイン（docs/spec.md §8、§9）
 *
 * content/**\/*.md を読み込むと、次の形のモジュールになる。
 *   export default { frontmatter, html, headings }
 * リクエストのたびにWorkerの中で変換しない（CPU時間を使うため）。
 * gray-matter と unified はここでだけ使い、Workerにも画面側のJavaScriptにも入れない。
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import type { Element, ElementContent, Root } from "hast";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import type { Plugin } from "vite";
import { z } from "zod";
import {
  articleSchema,
  type ContentModule,
  type Heading,
  policySchema,
} from "../app/lib/content-schema.ts";

export function content(): Plugin {
  let contentDir = "";

  return {
    name: "shodo:content",
    enforce: "pre",
    configResolved(config) {
      contentDir = path.join(config.root, "content");
    },
    async load(id) {
      const file = id.split("?")[0];
      if (!file.endsWith(".md")) return null;
      const relative = path.relative(contentDir, file);
      if (relative.startsWith("..") || path.isAbsolute(relative)) return null;

      const source = await readFile(file, "utf8");
      const { data, content: body } = matter(source);

      const schema = relative.startsWith(`articles${path.sep}`) ? articleSchema : policySchema;
      const parsed = schema.safeParse(data);
      if (!parsed.success) {
        this.error(
          `content/${relative} のフロントマターが正しくありません\n${z.prettifyError(parsed.error)}`,
        );
      }

      const headings: Heading[] = [];
      const html = String(
        await unified()
          .use(remarkParse)
          .use(remarkGfm)
          // 本文には <p class="note"> や <dl> などのHTMLが入っている。原稿はこのリポジトリの中だけで管理するので、そのまま通す
          .use(remarkRehype, { allowDangerousHtml: true })
          .use(rehypeRaw)
          .use(rehypeSectionIds, headings)
          .use(rehypeStringify)
          .process(body),
      );

      const output: ContentModule<typeof parsed.data> = {
        frontmatter: parsed.data,
        html,
        headings,
      };
      return `export default ${JSON.stringify(output)};`;
    },
  };
}

/**
 * 本文のH2に s1、s2… の連番のidを付け、目次用に集める（§8）。
 * idを見出しの文字から作らないのは、参照とフッターのリンク（/security-policy/#s2）に合わせるため
 */
function rehypeSectionIds(headings: Heading[]) {
  return (tree: Root) => {
    const visit = (nodes: ElementContent[] | Root["children"]) => {
      for (const node of nodes) {
        if (node.type !== "element") continue;
        if (node.tagName === "h2") {
          const id = `s${headings.length + 1}`;
          node.properties = { ...node.properties, id };
          headings.push({ id, text: textOf(node) });
        } else {
          visit(node.children);
        }
      }
    };
    visit(tree.children);
  };
}

function textOf(node: Element | ElementContent): string {
  if (node.type === "text") return node.value;
  if (node.type === "element") return node.children.map(textOf).join("");
  return "";
}
