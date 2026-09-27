/**
 * 記事とポリシーのフロントマターのスキーマ（docs/spec.md §8、§9）
 *
 * ビルドのときに vite-plugins/content.ts がこれで確かめ、合わなければビルドを失敗させる。
 * アプリからは型だけを使う（zod を画面側にもWorkerにも入れない）。
 */
import { z } from "zod";

/**
 * 日付を YYYY-MM-DD の文字列にする。
 * gray-matter はYAMLの日付（2026-10-01）を、UTCの0時の Date で返す。
 * 表示のときにタイムゾーンで1日ずれないよう、文字列にして渡す
 */
const ymd = z.coerce.date().transform((date) => date.toISOString().slice(0, 10));

export const articleSchema = z.object({
  title: z.string(),
  /** 一覧の要約と meta description */
  description: z.string(),
  /** 記事ページのH1の下のリード文 */
  lead: z.string(),
  date: ymd,
  order: z.number().int().default(0),
  category: z.enum(["制度", "考え方", "復旧"]),
  readingMinutes: z.number().int(),
  /** この記事の要点 */
  keyPoints: z.array(z.string()).min(1).max(5),
  sources: z.array(
    z.object({
      title: z.string(),
      publisher: z.string(),
      date: z.string().optional(),
      url: z.url().optional(),
    }),
  ),
  /** 募集の帯。heading は1要素1行 */
  cta: z.object({
    label: z.string(),
    heading: z.array(z.string()),
    body: z.string(),
    button: z.string(),
  }),
  /** 英語の記事一覧に出す情報 */
  en: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(["Regulation", "Approach", "Recovery"]),
  }),
});

export const policySchema = z.object({
  title: z.string(),
  description: z.string(),
  lang: z.enum(["ja", "en"]),
  effectiveDate: ymd,
  /** 今は privacy.en.md だけにある */
  translationNotice: z.string().optional(),
});

/** 目次に使う見出し。id は本文のH2の順に s1、s2… */
export type Heading = { id: string; text: string };

/** content/ の .md をビルドのときに変換したモジュールの形 */
export type ContentModule<Frontmatter> = {
  frontmatter: Frontmatter;
  html: string;
  headings: Heading[];
};

export type ArticleFrontmatter = z.output<typeof articleSchema>;
export type PolicyFrontmatter = z.output<typeof policySchema>;
