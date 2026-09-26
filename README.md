# 株式会社衝動 サイト制作資料（Claude Code用）

Claude Designで作ったデザインを、Claude Codeで実装するための資料一式です。

## 中身

| 場所 | 内容 |
|---|---|
| `CLAUDE.md` | Claude Codeが最初に読む指示書。技術構成と守ること |
| `docs/spec.md` | サイトの仕様。ページとURL、構成、動き、フォーム（Slackへの送信）、多言語、SEO、Google Analytics、セキュリティ、Cloudflare Workersでの配信、公開前チェック |
| `docs/design-system.md` | デザインのルール。色、文字、余白、コンポーネント、レスポンシブ、アクセシビリティ |
| `docs/content-rules.md` | 文章のルールと、日英の用語対訳 |
| `docs/open-items.md` | 決まったことと、公開までに決める必要があるもの |
| `design/tokens.css` | デザイントークン（CSS変数） |
| `design/reference/` | 全ページの静的HTML。`index.html` から全ページを開ける |
| `content/articles/` | 記事3本（フロントマター付きMarkdown） |
| `content/pages/` | プライバシーポリシーとセキュリティポリシー（日英） |
| `public/` | `_headers`（静的ファイル用のヘッダー）と `.well-known/security.txt` |

## 使い方

1. 新しいリポジトリを作り、このフォルダの中身を丸ごとリポジトリの一番上に置く
2. そのリポジトリでClaude Codeを起動し、次のように頼む

```
CLAUDE.md と docs/ を読んでから、このサイトを実装してください。
まず Cloudflare のテンプレートで React Router のプロジェクトを別のフォルダに作り、
中身をこのリポジトリの一番上に移してください（手順は docs/spec.md §15.1）。
そのうえで、共通部品（ヘッダー、フッター、ボタン、罫線と一点）とトップページを作って、
design/reference/ja-top.html と見比べられる状態にしてください。
docs/open-items.md の未決の項目は決めずに、仮のまま進めて一覧で報告してください。
```

3. トップページの見た目が合ったら、残りのページ、英語版、セキュリティ（nonceとヘッダー、末尾スラッシュの転送）、フォームとSlack、Google Analytics、公開前チェックの順に進める
4. 公開の前に、Cloudflareの設定（DNS、Workersのカスタムドメイン、`www` の転送、Workersのプラン）と、SlackのIncoming Webhookを用意する。手順の要点は `docs/spec.md` §15 と `docs/open-items.md` にある

参照HTMLは、ブラウザで `design/reference/index.html` を開けば確認できます。フォントはGoogle Fontsから読み込むので、インターネットにつながった環境で開いてください。

参照HTMLは、Claude Designのキャンバス（2026年9月27日の版）から書き出したものです。実装を始めたあとにデザインを変えるときは、キャンバスを直してから参照HTMLを書き出し直し、差分をClaude Codeに伝えてください。
