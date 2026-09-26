# 未決事項

ここにある項目は、実装する側で決めないでください。仮の値で進める場合は、仮だと分かる形で残し、PRの説明に書いてください。決まったら、この表を更新します。

## 決まったこと（2026年9月27日）

| 項目 | 決定 | 仕様 |
|---|---|---|
| 技術構成 | React（React Router v8 の framework mode）＋ Cloudflare Workers。ページはWorkerの中でSSRする | `spec.md` §15 |
| 本番のドメイン | `shodohq.com`（`www` は転送） | `spec.md` §2 |
| フォームの送り先 | 会社のSlackに投稿する（メールでは送らない） | `spec.md` §6.5 |
| アクセス解析 | Google Analytics 4 | `spec.md` §11 |

## 公開までに必要

| # | 項目 | 今の仮の状態 | 決まったら直す場所 |
|---|---|---|---|
| 1 | `shodohq.com` のDNSをCloudflareで管理しているか | 管理している前提。WorkersのカスタムドメインとRedirect Rulesに必要。ほかで管理している場合は、ネームサーバーをCloudflareに移す（メールのMXレコードなどを引き継ぐこと）。いまの旧サイトは、切り替えた時点で置き換わる。切り替えのときは、旧サイトを指すDNSレコードを消してからWorkersのカスタムドメインを付ける（`spec.md` §15.5） | `wrangler.jsonc` の `routes`、Cloudflareの設定 |
| 2 | Slackの投稿先 | 未定。本番用とテスト用のチャンネルと、それぞれのIncoming Webhookを作る人を決める | `SLACK_WEBHOOK_URL`（秘密の値） |
| 3 | 脆弱性の報告を別のチャンネルに分けるか | 分けない（同じチャンネルに「【脆弱性の報告】」を付けて投稿）。security@shodohq.com へは自動では送らない | `SLACK_WEBHOOK_URL_SECURITY` |
| 4 | Cloudflare Turnstileを使うか。使う場合、JavaScriptが動かない人向けに一般の問い合わせ用メールアドレスを載せるか | 未決。`TURNSTILE_SITE_KEY` と `TURNSTILE_SECRET_KEY` を入れたときだけ有効になる作りにしてある（空なら使わない）。使うと、JavaScriptが動かない環境では送信できないので、`<noscript>` の案内を出す（文言は `spec.md` §6.5）。今は脆弱性の報告用アドレスだけを載せている | `wrangler.jsonc` の `TURNSTILE_SITE_KEY`、秘密の値 `TURNSTILE_SECRET_KEY`、`<noscript>` の案内 |
| 5 | GA4のプロパティと測定ID、データの保持期間 | 未作成。保持期間はGAの初期値（2か月）のまま | `wrangler.jsonc` の `GA_MEASUREMENT_ID`、GAの管理画面 |
| 6 | Cookieの同意バナーを出すか | 出さない。海外（特にEU）からの閲覧が多い場合は、出すことを検討する。出す場合はデザインを追加する。地域で分ける（例：EUからの閲覧にだけバナーを出す、またはGAを出さない）こともできる | `app/root.tsx` の `loader`、`public/scripts/ga.js`、デザイン |
| 7 | 問い合わせの記録の残し方 | Slackだけに残る。Slackが無料プランの場合、90日より前のメッセージは見えなくなり、1年を過ぎると消える | 運用（必要なら、スプレッドシートなどへの転記を別に考える） |
| 8 | 記事3本の事実確認と公開日 | 公開日は3本とも仮に 2026.10.01 | `content/articles/*.md` |
| 9 | プライバシーポリシーの法務確認 | 下書き。第7項にGoogle Analyticsの利用を書いた。確認してほしい点：問い合わせの内容がSlack（米国の事業者）に保存されること、電気通信事業法の外部送信規律に当たるか、GDPR（今は対応していない）。代表者名は「求めに応じて回答」としている | `content/pages/privacy.*.md` と、キャンバスのプライバシーポリシー |
| 10 | セキュリティポリシーの約束 | 「受け取りを3営業日以内に連絡」と書いている | `content/pages/security-policy.*.md` |
| 11 | 旧サイトからの転送 | 旧サイトのURLの一覧がまだない。旧サイトのURLは静的アセットに当たらずWorkerに届くので、CloudflareのBulk Redirectsか、`workers/app.ts` の転送表で行う | Cloudflareの設定か `workers/app.ts` |
| 12 | ロゴとファビコン | ロゴは明朝の文字組み（仮）。ファビコンはアクセント色の丸 | Header、Footer、`public/favicon.svg` |
| 13 | OGP画像 | なし（`og:image` を出さない） | 各ルートの `meta`（`app/lib/site.ts`） |
| 14 | Workersのプラン | 有料プラン（Workers Paid、月5ドルから）を勧める。無料プランは1リクエストのCPU時間が10ミリ秒までで、ページをWorkerの中で描くこのサイトでは超えることがある | Cloudflareの契約 |

## 公開後でよい

| # | 項目 | 補足 |
|---|---|---|
| 15 | PoCの期間・費用などの条件 | 決まったら、PoCページの「2つの募集」と募集の帯に書き足す |
| 16 | 製品の画面 | 今は画面イメージを載せていない。載せる場合はデザインを追加する |
| 17 | 英文住所の番地のローマ字表記 | 今は市までを英語で書き、正式な住所は日本語で併記している |
| 18 | 英語の記事 | 今は日本語だけ。英訳する場合は、記事の読み込みに言語を足す |
| 19 | HSTS preload | 今は `includeSubDomains` まで。preloadは、サブドメインの使い方を確認してから決める |
