# 株式会社衝動 コーポレートサイト

株式会社衝動（Shodo Inc.）のコーポレートサイトを作るリポジトリです。デザインはClaude Designで作成済みです。全ページを `design/reference/` に静的HTMLとして書き出してあります。本番のドメインは `shodohq.com` です。

## 最初に読むもの

1. `docs/spec.md`：サイトの仕様。ページとURL、各ページの構成、動き、フォーム、多言語、SEO、アクセス解析、セキュリティ、配信の仕組み、公開前チェック
2. `docs/design-system.md`：デザインのルール。色、文字、余白、コンポーネント、レスポンシブ、アクセシビリティ
3. `docs/content-rules.md`：文章のルール（日本語と英語）
4. `docs/open-items.md`：まだ決まっていないこと。**ここにある項目は自分で決めず、必ず確認する**

## 技術構成

- **React Router v8（framework mode）＋ TypeScript。** Cloudflareのテンプレート（`npm create cloudflare@latest -- shodo-site --framework=react-router --no-deploy --no-open --no-git`）を土台にする。Node 22.22以上が必要
  - このリポジトリの中には直接作れないので、別のフォルダに作ってから中身を一番上に移す。テンプレートのTailwind、Google Fontsの読み込み、見本のページ、`AGENTS.md` は消す（`docs/spec.md` §15.1）
  - 変数と秘密の値は、`.server.ts` のモジュールで `import { env } from 'cloudflare:workers'` から読む。`workers/app.ts` からReact Routerにcontextは渡さない（`docs/spec.md` §15.2）
- **Cloudflare Workers で動かす。** ページはリクエストのたびにWorkerの中でSSRする（静的な書き出しはしない。理由は `docs/spec.md` §15.1）。静的アセット（JavaScript、CSS、フォントなど）は、Workersの静的アセットとしてWorkerを通さずに返る
- **Workerの入口（`workers/app.ts`）の仕事：** 末尾スラッシュの転送、共通のセキュリティヘッダー、React Routerへの受け渡し（`docs/spec.md` §15.2）
- **フォーム：** 各ページのルートの `action` で受け、Slackに投稿する（`docs/spec.md` §6.5）。フォーム専用のAPIは作らない
- **スタイル：** CSS Modulesと、グローバルに読み込む `app/styles/tokens.css`（`design/tokens.css` をコピーしたもの。以後はこちらを正とし、`design/` は参照用として残す）。値はトークンの変数で指定する。CSSフレームワーク、CSS-in-JSは入れない
- **フォント：** `@fontsource/shippori-mincho-b1`（500, 700, 800）と `@fontsource/zen-kaku-gothic-antique`（400, 500, 700）で自己ホストする。Google Fontsには接続しない
- **記事とポリシー：** `content/` のMarkdownを、ビルドのときにViteプラグインでHTMLに変える（`docs/spec.md` §8）。リクエストのたびに変換しない
- **lintとフォーマット：** Biome（`biome.jsonc`）。`style` 属性、`<style>` 要素、`.server.ts` 以外での `cloudflare:workers` の読み込みは、lintのエラーになる
- **アクセス解析：** Google Analytics 4（`docs/spec.md` §11）
- **画面で動く部分：** スマホのメニュー、記事一覧の絞り込み、フォームの3つ。どれも、JavaScriptが動かなくても使える形にする（`docs/spec.md` §5、§6）

## 守ること

- **見た目の正は `design/reference/*.html`。** 寸法、色、文字サイズ、行間、罫線、並び順をこれに合わせる。ただしインラインスタイルを写さず、コンポーネントとトークンで組み直す。
- 色、文字サイズ、余白は `app/styles/tokens.css` の変数で指定する。値を直接書かない。足りない値が出たら、トークンを追加して理由をコメントに書く。
- **文章は `design/reference/` と `content/` のものをそのまま使う。** 言い回しを変えない。デザインにない文言（エラー、送信完了、404など）は `docs/spec.md` に書いたものを使う。それでも足りなければ `docs/content-rules.md` に従って書き、PRの説明に明記する。
- 日本語が既定の言語（`/`）で、英語は `/en/` の下に置く。対応表は `docs/spec.md` の「ページとURL」にある。
- アクセシビリティはWCAG 2.1 AAを満たす。`docs/design-system.md` の「アクセシビリティ」を参照。
- **外部のスクリプトは、Google Analytics（gtag.js）とCloudflare Turnstileだけ。** Google Tag Manager、広告のタグ、埋め込み、ほかのトラッカーを入れない。Google Analyticsに個人情報（名前、メールアドレス、フォームの内容）を送らない。
- **CSPを緩めない。** `'unsafe-inline'` を足さない。`style={...}` と `<style>` 要素を使わない。インラインの `<script>` を自分で書かない（構造化データは、各ルートの `meta` の `script:ld+json` で出す）。nonceの扱いは `docs/spec.md` §12.2。
- **秘密の値をリポジトリに入れない。** SlackのWebhook URLとTurnstileの秘密鍵は `wrangler secret` で設定する。手元では `.dev.vars`（`.gitignore` に入れる）を使う。秘密の値に触るコードは `.server.ts` のモジュールにだけ置く。プレビューと手元からは、本番のSlackに送らない（`docs/spec.md` §6.5）。
- ログに、フォームの内容や個人情報を書き出さない。
- セキュリティヘッダーと `/.well-known/security.txt` を必ず用意する（`docs/spec.md` §12）。
- 「Pixie for Operations」は開発中の製品。どこに出すときも「開発中」と分かる表示を外さない。
- 実在の被害企業の名前をサイトの本文に書かない（記事の出典欄にある資料名は除く）。

## ディレクトリ（作る構成の目安）

```
app/
  root.tsx                 Layout（<html lang>、<head>、ヘッダーとフッター、GAの読み込み）、ErrorBoundary（404とエラー）
  routes.ts                ルートの一覧。英語は prefix('en', [...]) の下
  entry.server.tsx         npx react-router reveal で作り、nonceとCSPを足す（§12.2）
  entry.client.tsx         npx react-router reveal で作る（中身はそのまま）
  routes/                  各ページ、sitemap.ts（/sitemap.xml）。見つからないURLは root.tsx の ErrorBoundary で描く
  components/              Header, Footer, Button, RuleDot, MobileMenu, InquiryForm など
  lib/
    site.ts                URL、言語、canonical、hreflangの組み立て
    content-schema.ts      記事とポリシーのフロントマターのzodスキーマ（Viteプラグインと共用）
    content.server.ts      変換済みの記事とポリシーの読み込み
    inquiry.ts             フォームの入力確認（画面とサーバーで共用）
    env.server.ts          変数と秘密の値の読み出し（cloudflare:workers の env）
    inquiry.server.ts      連続送信、Turnstile、Slackへの投稿
  styles/                  tokens.css（design/tokens.css をコピー）, global.css
content/                   記事とポリシーのMarkdown（このまま使う）
public/                    _headers, robots.txt, favicon.svg, .well-known/security.txt, scripts/ga.js
vite-plugins/content.ts    MarkdownをビルドのときにHTMLにするViteプラグイン
workers/app.ts             Workerの入口（転送、共通のヘッダー、React Routerへの受け渡し）
react-router.config.ts     ssr: true
vite.config.ts             build.assetsInlineLimit: 0（§12.2）
wrangler.jsonc
```

## コマンド（miseのタスク）

開発環境はmiseでそろえる。Nodeのバージョンは `.node-version` に書く（miseとWorkers Buildsの両方が読む）。はじめは `mise trust && mise run setup`。タスクの一覧は `mise tasks`、定義は `mise.toml`。

- `mise run dev`：開発サーバー（Workersと同じ実行環境で動く）。CSPはここでは付けない
- `mise run build`：本番用のビルド（`react-router build`）
- `mise run preview`：ビルドしたものを手元で動かす。nonce、ヘッダー、フォームの確認はこちらで行う
- `mise run typegen`：`wrangler.jsonc` と `.dev.vars` から `Env` の型を、`app/routes.ts` からルートの型を作る
- `mise run lint`：Biomeで、フォーマット、lint、importの並びを確かめる（warningも失敗にする）
- `mise run fix`：Biomeで、フォーマットとimportの並びを直し、安全に直せるlintの指摘を直す
- `mise run typecheck`：型を作り直してから型チェック
- `mise run check`：PRの前の確認（lint、型チェック、ビルド、`npm audit`、security.txtの期限）
- `mise run secret <名前>`：秘密の値を `wrangler secret put` で設定する
- `mise run deploy`：手元からのデプロイ（確認が出る。ふだんは `main` へのマージでWorkers Buildsが出す）

どのタスクも、依存パッケージが変わっていれば先に `npm ci` を行う。`package.json` のスクリプト（`npm run build` など）は、Workers Buildsのために残してある。

## 完了の条件

- 全ページが、参照ファイルと並べて見比べて一致している。幅1440pxと390pxの両方で確認する。1024pxと768pxで崩れていない
- リンク切れがない。JA/ENの切り替えが、対応するページ同士をつないでいる
- `npm run preview` で、ブラウザのコンソールにCSPの違反もエラーも出ない
- JavaScriptを切っても、全ページが読め、フォームを送れる（Turnstileを使わない場合）
- フォームを送ると、Slackのテスト用チャンネルに届く
- Lighthouse（モバイル）で、Accessibility 100、Best Practices 100、SEO 100、Performance 95以上
- `npm run build` と型チェックが、警告なしで通る
- `docs/spec.md` の「公開前チェック」をすべて満たしている
