# サイト仕様

株式会社衝動のコーポレートサイトの仕様です。見た目は `design/reference/` の参照HTMLが正で、この文書は構成、動き、裏側の決まりごとを定めます。両者が食い違うときは、見た目は参照HTML、それ以外はこの文書に従ってください。

## 1. 目的と読み手

- **目的：** PoCの参加企業と、Pixie for Operationsのデザインパートナーを集めること
- **主な読み手：** 重要インフラ・産業企業のセキュリティ責任者と、サイバー対処能力強化法への対応を請け負うSIやコンサルティング会社
- **英語版の読み手：** 海外の見込み顧客。日本の法制度に関わる内容は、日本語版だけに載せている
- **トーン：** 落ち着いていて、具体的。「止めずに、守る。」と「計算はAIに、決断は人に。」がサイト全体の軸

## 2. ページとURL

ドメインは `https://shodohq.com` です（`www` なし）。`www.shodohq.com` へのアクセスは、同じパスの `https://shodohq.com` に301で転送します（CloudflareのRedirect Rulesで設定）。

URLは末尾スラッシュありに統一します。React Routerは `/products` と `/products/` の両方に同じルートを当てるので、Workerの入口（`workers/app.ts`）で、末尾スラッシュのないURLを付いたURLに301で転送します（§15.2）。サイトの中のリンクも、すべて末尾スラッシュ付きで書きます。

| ページ | 日本語URL | 英語URL | 参照ファイル |
|---|---|---|---|
| トップ | `/` | `/en/` | `ja-top.html`、`ja-top-mobile.html`、`ja-top-mobile-menu-open.html` / `en-top.html` |
| 製品一覧 | `/products/` | `/en/products/` | `ja-products.html` / `en-products.html` |
| Pixie for Operations | `/products/pixie-for-operations/` | `/en/products/pixie-for-operations/` | `ja-pixie-for-operations.html` / `en-pixie-for-operations.html` |
| PoC・デザインパートナー募集 | `/poc/` | `/en/poc/` | `ja-poc.html` / `en-poc.html` |
| 記事一覧 | `/articles/` | `/en/articles/` | `ja-articles.html` / `en-articles.html` |
| 記事 | `/articles/{slug}/` | なし（日本語のみ） | `ja-article-1.html`〜`ja-article-3.html` |
| 会社情報 | `/company/` | `/en/company/` | `ja-company.html` / `en-company.html` |
| お問い合わせ | `/contact/` | `/en/contact/` | `ja-contact.html` / `en-contact.html` |
| プライバシーポリシー | `/privacy/` | `/en/privacy/` | `ja-privacy.html` / `en-privacy.html` |
| セキュリティポリシー | `/security-policy/` | `/en/security-policy/` | `ja-security-policy.html` / `en-security-policy.html` |
| 送信完了（JavaScriptなしの送信用） | `/contact/sent/` | `/en/contact/sent/` | なし（§6.4） |
| 404と、サーバーのエラー | 見つからないすべてのURL | `/en/` の下の見つからないURL | なし（§14） |
| サイトマップ | `/sitemap.xml` | 同じ | なし（§10） |
| security.txt | `/.well-known/security.txt` | 同じ | `security.txt` |

フォームは、それぞれのページのURL（`/poc/`、`/contact/` と英語版）に `POST` で送り、そのページのルートの `action` で受けます（§6.5）。フォーム専用のAPIのURLは作りません。

公開時点の記事のslugは次の3つです。

| slug | タイトル |
|---|---|
| `cyber-response-act-notification` | サイバー対処能力強化法の届出対象を、どう洗い出すか |
| `beyond-shutting-everything-down` | 「全部止める」以外の選択肢をつくる |
| `can-you-restore-from-backup` | そのバックアップは、本当に戻せるか |

参照HTMLの中のリンク（`ja-poc.html` など）は、上の表の本番URLに置き換えてください。`#caasm` や `#s2` のようなページ内の位置はそのまま残します。

参照は、トップだけがPC（1440px）とスマホ（390px）の両方あり、ほかのページはPCだけです。PCとスマホで文言やリンク先が食い違っていたら、PCを正とします。

## 3. 共通部品

### 3.1 ヘッダー

- **並び：** 左にロゴ（明朝の「衝動」と小さな「SHODO」）、右にナビゲーションと言語切り替えを置く
- **ナビゲーション：**
  - 日本語は「製品」「PoC募集」「記事」「会社情報」「お問い合わせ」
  - 英語は「Products」「Design partners」「Articles」「Company」「Contact」
- **現在地の表示：** 表示中のページの項目に `aria-current="page"` を付け、太字と下線で示す
  - 「製品」は、製品一覧とPixie for Operationsの両方で現在地になる
  - 「記事」は、記事一覧と記事の両方で現在地になる
  - ポリシーのページでは、ナビの現在地を付けない。代わりにフッターの該当リンクを太字にする
- **下罫線：** 1pxの罫線（`--color-line`）。付けないのは、1024px以上のトップページ（日英）だけ。下層ページと、1024px未満の全ページには付ける（スマホの参照 `ja-top-mobile.html` でもトップに付いている）
- **1024px未満：** ナビをメニューボタンにまとめる（§5.1）。スマホの参照は `ja-top-mobile.html`
- **ロゴのリンク先：** その言語のトップ

### 3.2 フッター

- **中身：** 左から、会社情報、「サイト」「製品」「ポリシー」の3列のリンクを並べる。下段に大きな「衝動」と青い点、security.txtへのリンク、コピーライトを置く
- **リンクの並びと行き先：** 全ページで同じ。英語版は `/en/` の下の同じページにつなぐ

| 列 | 項目（日本語／英語） | 行き先 |
|---|---|---|
| サイト／Site | トップ／Home | `/` |
| | PoC募集／Design partners | `/poc/` |
| | 記事／Articles | `/articles/` |
| | 会社情報／Company | `/company/` |
| | お問い合わせ／Contact | `/contact/` |
| 製品／Products | Pixie CAASM、EASM、IASM、ASPM | `/products/#caasm` `#easm` `#iasm` `#aspm` |
| | Pixie for Operations | `/products/pixie-for-operations/` |
| ポリシー／Policies | セキュリティポリシー／Security policy | `/security-policy/` |
| | 脆弱性の報告／Report a vulnerability | `/security-policy/#s2` |
| | プライバシーポリシー／Privacy policy | `/privacy/` |
| | English／日本語 | もう一方の言語の同じページ（§3.4） |

- **会社情報の書き方：**
  - 日本語は、社名、住所、設立日、法人番号（国税庁の法人番号公表サイトへのリンク）を載せる
  - 英語は、住所を「Aizuwakamatsu, Fukushima 965-0003, Japan」とする
- **コピーライト：** 日本語は「© 2026 株式会社衝動」、英語は「© 2026 Shodo Inc.」。年は公開年で固定する（自動で変えない）
- **1024px未満：** リンクは2列、会社情報はその上に置く。スマホの参照は `ja-top-mobile.html`
- **大きな「衝動」：** 装飾なので、スクリーンリーダーには読ませない（`aria-hidden="true"`）

### 3.3 パンくずリスト

- **出す場所：** 下層ページすべて。区切りは、日本語が「／」、英語が「/」
- **読み上げ：** 区切りは `aria-hidden="true"` にし、最後の項目に `aria-current="page"` を付ける
- **記事ページだけの例外：** 参照どおり「トップ／記事／{カテゴリ}」と出す。最後のカテゴリは今いるページではないので、リンクにせず、`aria-current` も付けない（カテゴリごとの一覧ページは作らない）
- **構造化データ：** 同じ内容を `BreadcrumbList` として出す（§10）。記事ページだけは「トップ > 記事 > 記事のタイトル」とする

### 3.4 言語切り替え

- **表示：** 「JA / EN」。表示中の言語を太字のテキストにし、もう一方をリンクにする
- **リンク先：** 同じページの、もう一方の言語版
  - 日本語の記事ページだけは、英語版がないので `/en/articles/` につなぐ
- **自動の切り替えはしない：** ブラウザの言語を見て自動で転送しない。言語をCookieに保存もしない

### 3.5 罫線と一点（RuleDot）

- **形：** 横いっぱいの1px罫線の上に、アクセント色の丸（`--dot-size`）を置く
- **使う場所：**
  - トップの見出しの2行の間
  - 下層ページのH1の下
  - 記事の見出しの下
- **点の位置：** コンテナ幅の約63%（1200pxで左から760px）。スマホは約56%
- **読み上げ：** 装飾なので `aria-hidden="true"`

### 3.6 募集の帯（CTA）

- **形：** アクセント色の帯に、ラベル、明朝の見出し、本文、白いボタンを置く
- **文言：** ページごとに違う。各参照ファイルの文言をそのまま使う
- **ボタンの行き先：** `/poc/` か `/contact/`

## 4. ページごとの構成

上から順に並べます。文言と細部は参照ファイルを見てください。

- **トップ：**
  1. ヒーロー（見出し「止めずに、守る。」、リード、主ボタン「PoCに参加する」、リンク「製品を見る」＝ページ内の製品セクションへ）
  2. 黒い帯（「計算はAIに、決断は人に。」と社名の由来）
  3. 課題（一〜三）
  4. Pixie for Operations（3機能、設計方針、詳しく見るリンク）
  5. Pixieシリーズ（4製品の行。各行は `/products/` の該当箇所 `#caasm` などにつなぐ）
  6. 募集の帯（右に条件の一覧）
  7. 記事（新しい順に3件）
  8. フッター
- **製品一覧：**
  1. H1「製品」
  2. 黒い帯（Pixie for Operationsの紹介）
  3. 4製品の一覧（各行に `id="caasm"` `id="easm"` `id="iasm"` `id="aspm"`）
  4. 製品の関係の流れ（4製品 → 停止の地図 → Pixie for Operations）
  5. 募集の帯
- **Pixie for Operations：**
  1. ヒーロー（H1「Pixie for Operations」は1行。開発中の注記あり）
  2. 既存製品との比較表
  3. 3つの機能（依存関係の図と、一〜三の詳細。「計算はAIに、決断は人に。」の考え方は、二の止め方AIの説明文に入っている）
  4. 使う場面の表
  5. 重要インフラ統一基準との対応表（日本語のみ）
  6. 設計方針（4つ）
  7. 募集の帯
  - 2〜6のセクションは、上に1pxの罫線（`--color-line`）で区切る。このページに黒い帯はない
- **PoC：**
  1. ヒーロー（「応募フォームへ」は `#form` へ移動）
  2. 2つの募集
  3. 対象の企業
  4. 進め方とデータの扱い
  5. 応募フォーム（`id="form"`）
- **記事一覧：**
  1. H1
  2. リード
  3. カテゴリの絞り込み（§5.2）
  4. 記事の一覧
  5. 募集の帯
- **記事：**
  1. パンくず、日付、カテゴリ、読了時間
  2. H1、リード
  3. 罫線と一点
  4. 左に目次（本文のH2から自動で作る）、右に本文（幅720px）
  5. 本文の先頭に「この記事の要点」、末尾に出典
  6. 次に読む
  7. 募集の帯（文言は記事ごとに違う。フロントマターの `cta`）
- **会社情報：**
  1. H1
  2. 黒い帯（社名の由来）
  3. 会社概要
  4. セキュリティへの取り組み（脆弱性の報告窓口、security.txt、セキュリティポリシー）
  5. 募集の帯
- **お問い合わせ：**
  1. H1とリード
  2. 左に案内（PoCへの応募、脆弱性の報告）、右にフォーム
- **ポリシー2つ：**
  1. H1、制定日、罫線と一点
  2. 左に目次、右に本文

英語版は日本語版と同じ構成です。ただし次の点が違います。

- **英語のトップ：**
  - 記事のセクションがない（記事が日本語だけのため）。募集の帯のすぐ下がフッター
  - ヒーローの「See products」は、ページ内ではなく `/en/products/` につなぐ
  - 2番目の黒い帯は、社名の由来を含む1列の形（参照 `en-top.html`）
- **英語のPixie for Operations：** 「重要インフラ統一基準との対応」がない
- **英語の記事一覧：** 日本語の記事への案内だけを並べる（§7）

## 5. 動き

### 5.1 スマホのメニュー（1024px未満）

- **開閉：**
  - ボタンを押すと、ヘッダーの下にメニューを重ねて開く（参照 `ja-top-mobile-menu-open.html`）
  - ボタンのアイコンは、開くと×に変わる
- **ボタンの属性：**
  - 閉じているとき：`aria-expanded="false"`、`aria-label="メニューを開く"`（英語は "Open menu"）
  - 開いているとき：`aria-expanded="true"`、`aria-label="メニューを閉じる"`（英語は "Close menu"）
- **閉じる操作：** Escキー、メニュー内のリンクを押したとき、ボタンをもう一度押したとき
- **開いている間の決まり：**
  - 背景のスクロールを止める
  - フォーカスをメニューの中に閉じ込める
  - 閉じたら、フォーカスをボタンに戻す
- **メニューの中身：**
  - ナビの5項目
  - 主ボタン「PoCに参加する」
  - もう一方の言語へのリンク
  - プライバシーポリシー
- **JavaScriptが動かないとき：** メニューの中身を、フッターへのページ内リンクで代わりに見られるようにする
  - サーバーで描くHTMLでは、メニューボタンの位置に、フッターのナビへのページ内リンク（見た目はメニューボタンと同じ）を置く
  - 画面が読み込まれて動くようになったら（`useEffect` の中で状態を切り替えて）、本物のボタンに差し替える。最初の描画で差し替えると、サーバーのHTMLと食い違う

### 5.2 記事一覧の絞り込み

- **チップ：** 「すべて」「制度」「考え方」「復旧」を置く。英語版には置かない（記事が日本語だけのため）
- **作り：** チップは、絞り込んだ一覧のURLへのリンクにする。サーバーが `?category=` を見て絞り込んだ一覧を描くので、JavaScriptが動かなくても絞り込める
  - URLは `/articles/`（すべて）、`/articles/?category=regulation`（制度）、`?category=approach`（考え方）、`?category=recovery`（復旧）。値は、フロントマターの `en.category` を小文字にしたもの
  - 知らない値が来たら、すべてを表示する（エラーにしない）
  - JavaScriptが動くときは、React Routerの `<Link>` の移動になる。`preventScrollReset` を付け、画面の位置を動かさない
- **選ばれているチップ：** 見た目は参照のとおり（地が `--color-ink`）。`aria-current="true"` を付ける
- **件数：** 「N件の記事」を表示し、`aria-live="polite"` にする（移動のあとに読み上げられる）
- **canonical：** 絞り込んだページも、canonicalは `/articles/` にする。サイトマップにも `/articles/` だけを入れる

### 5.3 ページ内リンク

- **スクロール：** `scroll-behavior: smooth` を使う。ただし `prefers-reduced-motion: reduce` のときは使わない
- **見出しの位置：** 移動先の見出しがヘッダーに隠れないように `scroll-margin-top` を設定する

### 5.4 ホバーとフォーカス

- **ホバー：**
  - テキストリンクは、色をアクセントに変える
  - 主ボタンは、地の色を `--color-accent-hover` に変える
  - 白いボタンは、地の色を `--color-on-accent-muted` に変える
- **フォーカス：** すべての操作できる要素に `:focus-visible` のリングを付ける（§design-system 9）
- **アニメーション：** デザインにないので、装飾のアニメーションは加えない

## 6. フォーム

### 6.1 PoC応募フォーム（`/poc/#form`、`/en/poc/#form`）

| name | 日本語ラベル | 英語ラベル | 種類 | 必須 | 補足 |
|---|---|---|---|---|---|
| `kind` | ご相談の種類 | What are you interested in? | ラジオ：`poc` / `partner` | 必須 | 初期値は `poc` |
| `company` | 会社名 | Company | テキスト（100文字まで） | 必須 | `autocomplete="organization"` |
| `dept` | 部署・役職 | Department and title | テキスト（100文字まで） | 必須 | `autocomplete="organization-title"` |
| `name` | お名前 | Name | テキスト（100文字まで） | 必須 | `autocomplete="name"` |
| `email` | メールアドレス | Email | メール（254文字まで） | 必須 | `autocomplete="email"` |
| `product` | 関心のある製品（複数選択可） | Products of interest (select all that apply) | チェックボックス：`caasm` `easm` `iasm` `aspm` `ops`（同じ `name` を5つ並べ、サーバーでは `formData.getAll('product')` で受ける） | 任意 | |
| `message` | ご相談の内容（任意） | Message (optional) | テキストエリア（5000文字まで） | 任意 | 参照にない「（任意）」を足す |
| `agree` | プライバシーポリシーに同意する | I agree to the privacy policy | チェックボックス | 必須 | 「プライバシーポリシー」を `/privacy/` へのリンクにする |

### 6.2 お問い合わせフォーム（`/contact/`、`/en/contact/`）

| name | 日本語ラベル | 英語ラベル | 種類 | 必須 |
|---|---|---|---|---|
| `kind` | お問い合わせの種類 | Type of inquiry | ラジオ：`product` / `poc` / `vuln` / `other` | 必須（初期値 `product`） |
| `company` | 会社名（任意） | Company (optional) | テキスト（100文字まで） | 任意 |
| `name` | お名前 | Name | テキスト（100文字まで） | 必須 |
| `email` | メールアドレス | Email | メール（254文字まで） | 必須 |
| `message` | お問い合わせの内容 | Message | テキストエリア（5000文字まで） | 必須 |
| `agree` | プライバシーポリシーに同意する | I agree to the privacy policy | チェックボックス | 必須 |

### 6.3 入力の確認とメッセージ

入力の確認は、ブラウザとサーバーの両方で同じ規則で行います。エラーは該当の項目のすぐ下に文字で出し、色だけで伝えないようにします。

- 項目に `aria-invalid="true"` を付け、メッセージを `aria-describedby` で結び付ける
- 送信時にエラーがあれば、最初のエラーの項目にフォーカスを移す

| 場面 | 日本語 | 英語 |
|---|---|---|
| 未入力 | 「{項目名}を入力してください。」 | "Please enter your {field}." |
| 未選択 | 「{項目名}を選んでください。」 | "Please choose an option." |
| メールの形式 | 「メールアドレスの形式を確認してください。」 | "Please enter a valid email address." |
| 文字数の超過 | 「{上限}文字以内で入力してください。」 | "Please keep this under {max} characters." |
| 同意がない | 「送信するには、プライバシーポリシーへの同意が必要です。」 | "Please agree to the privacy policy to send the form." |
| 送信の失敗 | 「送信できませんでした。時間をおいて、もう一度お試しください。」 | "We couldn't send your message. Please try again in a few minutes." |

### 6.4 送信のあと

**JavaScriptが動くとき（ふつうの場合）：** 送信に成功したら、フォームの場所に次の文言を出し、そこにフォーカスを移します（ページは移動しません）。あわせて、Google Analyticsにイベントを送ります（§11）。

| 場面 | 日本語 | 英語 |
|---|---|---|
| 通常 | 見出し「送信しました」／本文「お問い合わせありがとうございます。内容を確認のうえ、3営業日以内にご返信します。」／リンク「トップに戻る」 | "Thank you. Your message has been sent." / "We will reply within three business days." / "Back to home" |
| 脆弱性の報告 | 見出し「送信しました」／本文「報告ありがとうございます。受け取ったことを、3営業日以内にご連絡します。」 | "Thank you for your report." / "We will confirm receipt within three business days." |

**JavaScriptが動かないとき：** フォームはふつうのPOSTで、そのページのURLに送られます。

- **成功：** `/contact/sent/`（英語は `/en/contact/sent/`）に303で移す。再読み込みで二重に送られないようにするため。PoC応募フォームから送った場合も、同じページに移す
- **入力の誤り、送信の失敗：** 同じページをサーバーで描き直し、フォームの場所にエラーを出す。入力した値は残す

| ページ | 日本語 | 英語 |
|---|---|---|
| `/contact/sent/`、`/en/contact/sent/` | H1「送信しました」／本文は上の「通常」と同じ／リンク「トップに戻る」 | 上の「通常」と同じ |

送信完了のページは下層ページのH1の形で作り、`noindex` にし、サイトマップに入れません。

### 6.5 送信の仕組み（React Routerのactionから、Slackへ）

フォームは、そのページのルートの `action` で受け、確認を通ったものを会社のSlackのチャンネルに投稿します。データベースには保存しません。

**画面の側**

- `useFetcher()` の `<fetcher.Form method="post">` で作る。JavaScriptが動くときはページを移動せずに送り、結果（`fetcher.data`）でフォームの場所を切り替える。JavaScriptが動かないときは、ふつうの `<form>` として同じURLに送られる
- 入力の確認の規則は `app/lib/inquiry.ts` に1つだけ書き、画面とサーバーの両方から使う。画面では送る前に確かめ、サーバーでも必ず確かめる

**フォームに足す隠し項目（見た目は変わらない）**

| name | 値 | 用途 |
|---|---|---|
| `form` | `poc` か `contact` | どちらのフォームか |
| `lang` | `ja` か `en` | 返す文言と、移す先のページの言語 |
| `enhanced` | `1` | JavaScriptで送ったかどうか。画面が動くようになったあと（`useEffect` の中）で足す。サーバーで描くHTMLには入れない |
| `website` | 空 | ハニーポット。画面の外に置き、`tabindex="-1"`、`autocomplete="off"`、`aria-hidden="true"` にする |
| `cf-turnstile-response` | Turnstileが入れる | Turnstileを使う場合だけ |

**actionが確かめる順番**（処理は `app/lib/inquiry.server.ts` にまとめる。`.server` を付けると、画面側のJavaScriptに入らない）

1. `Origin` の確認：React Router v8は、actionを呼ぶ前に、`Origin` がリクエストのURLのオリジンと違う `POST` を400で止める（CSRF対策。自分で書かなくてよい）。actionでは、`Origin` ヘッダーがないときだけ403にする（ブラウザからのフォームの送信には必ず付くため）
2. 連続送信の制限：Workersの Rate Limiting バインディング（`INQUIRY_LIMITER`）で、IPアドレス（`CF-Connecting-IP`）ごとに60秒に5回まで。超えたら429。この仕組みは拠点ごとに数える大まかなもので、正確な回数の保証はない。Cloudflareの文書はIPアドレスを鍵にしないよう勧めているが、ログインのないフォームにはほかに使える鍵がないので、IPアドレスを使う（Wrangler 4.36以上が必要）
3. `Content-Length` が32KBを超えていたら413（本文を読む前に止める）
4. ハニーポット（`website`）に値があれば、Slackには送らず、成功と同じ応答を返す
5. Turnstileを使う場合は、`https://challenges.cloudflare.com/turnstile/v0/siteverify` で確かめる。`success` と、`hostname` がリクエストのホスト名と一致することを見る（手元ではTurnstileのテスト用の鍵を使い、返る `hostname` に合わせて確認を調整する）
6. 入力の確認（§6.1〜6.3の規則。`app/lib/inquiry.ts`）
7. Slackに投稿する

**actionの返し方**

| 結果 | `enhanced=1`（JavaScriptあり） | `enhanced` なし（JavaScriptなし） |
|---|---|---|
| 成功 | `{ ok: true, kind }` を返す | `redirect('/contact/sent/', 303)`（英語は `/en/contact/sent/`） |
| 入力の誤り | `data({ ok: false, errors, values }, { status: 400 })`。画面が§6.3の文言に置き換える | 同じものを返し、ページを描き直す（`useActionData()` で受け、`values` を入力欄の初期値にする）。最初の誤りの項目に `autoFocus` を付け、描き直したページでそこに移るようにする |
| 制限、Slackへの投稿の失敗 | `data({ ok: false, error: 'rate_limited' \| 'delivery_failed' }, { status: 429 \| 502 })`。「送信の失敗」の文言を出す | 同じ |
| `Origin` がない、大きすぎる本文 | 403、413（`data()` で返す。`throw` しない）。`Origin` の不一致は、actionの前にReact Routerが400で返す | 同じ |

- 失敗は `throw` せずに `data()` で返す。`throw` するとルートのErrorBoundary（エラーのページ）が出てしまう
- `values` には、入力された値だけを入れる（ハニーポットやTurnstileの値は返さない）

**Slackへの投稿**

- **方法：** SlackアプリのIncoming Webhookを使う。Webhook URLは秘密の値として扱う（リポジトリやログに出さない）
- **投稿先：**
  - 本番（リクエストのオリジンが `SITE_ORIGIN` と同じ）：`SLACK_WEBHOOK_URL` のチャンネル。`kind=vuln`（脆弱性の報告）は、`SLACK_WEBHOOK_URL_SECURITY` が設定されていればそちらに送る（分けるかどうかは未決。`open-items.md`）
  - 本番以外（プレビューと手元）：`SLACK_WEBHOOK_URL_PREVIEW` のテスト用チャンネル。設定されていなければSlackに送らず、502を返す。Workersのプレビューは本番と同じ秘密の値を使うので、ホスト名で分ける必要がある
- **形：** Block Kitで組む
  - 通知に出る `text` には、個人情報を入れない。例：「【PoC応募】新しい応募があります」「【お問い合わせ】新しいお問い合わせがあります」「【脆弱性の報告】新しい報告があります」
  - 見出し：フォームと種類（例：PoC応募／デザインパートナー、お問い合わせ／脆弱性の報告）、言語
  - 項目：会社名、部署・役職、お名前、メールアドレス、関心のある製品。空の項目は「（未入力）」と書く（Slackは空の文字を受け付けず、投稿全体が失敗するため）
  - 本文：複数のブロックに分ける（Slackの1ブロックの上限が3000文字のため）。`Array.from()` で1文字ずつ足していき、JavaScriptの文字列の長さ（`.length`）が2900を超える手前で区切る。絵文字などを途中で切らない。本文が空か、空白だけなら「（未入力）」（ほかの項目も、空白だけなら空とみなす）
  - 最後に、受け付けた日時（日本時間）と、送信元のページ。送信元のページのURLは、`form` と `lang` から `SITE_ORIGIN` をもとに組み立てる（`request.url` は、JavaScriptありの送信では `/poc/_.data` のような内部のURLになるため）
- **利用者が入力した値は、すべて `plain_text` で入れる。** `mrkdwn` にしない。`<!channel>` のようなメンションやリンクの書式が効かないようにするため
- **失敗したとき：** Slackがエラーを返したとき、または10秒以内に応答しなかったときは、502を返す。自動で送り直さない（二重に届くのを防ぐ）
- **ログ：** 出してよいのは、フォームの種類、結果、Slackの応答コードだけ。入力の内容、メールアドレス、IPアドレスは出さない。Workers Logsの自動の呼び出しログ（`invocation_logs`）は切る（§15.3）

**Turnstile（使うかは未決。`open-items.md` #4）**

- 変数 `TURNSTILE_SITE_KEY` と秘密の値 `TURNSTILE_SECRET_KEY` が入っているときだけ有効になる作りにする。空なら、ウィジェットも `<noscript>` の案内も出さず、actionも確認を飛ばし、CSPにも足さない（§12.2）
- 有効なときは、JavaScriptが動かない環境では送信できない。その環境では、フォームの上に次の案内を `<noscript>` で出す（`--color-bg-sub` の箱）
  - 日本語：「このフォームを送信するには、JavaScriptを有効にしてください。脆弱性の報告は、security@shodohq.com でも受け付けています。」
  - 英語："Please enable JavaScript to send this form. You can also report vulnerabilities to security@shodohq.com."
- ウィジェットは、フォームの部品の中で、画面が動くようになったあとに読み込む。サイトキーは、ルートの `loader` から渡す（§15.4）
- Turnstileを使わない場合は、ハニーポットと連続送信の制限だけで受ける

## 7. 多言語

- **ルートの定義：** `app/routes.ts` に日本語のルートを並べ、英語は `prefix('en', [...])` の下に並べる。日英で同じルートモジュールを使い回すときは、`route()` の第3引数で `id` を分ける（例：`{ id: 'en-products' }`）。言語はURL（`/en/` で始まるか）から決める
- **`<html lang>`：** `app/root.tsx` の `Layout` で、`useLocation()` のパスから `ja` か `en` を決めて出す。エラーのページ（§14）でも同じ
- **英語ページの中の日本語：** 「衝動」「日本語」リンク、日本語の住所には `lang="ja"` を付ける（参照HTMLでも付けている）
- **hreflang：** 各ルートの `meta` で、`{ tagName: 'link', rel: 'alternate', hrefLang, href }` の形で `ja` `en` `x-default`（＝日本語）を出す。日本語の記事ページには `ja` だけを出す。組み立ては `app/lib/site.ts` にまとめる
  - React Routerの `meta` は、子のルートが親の分を置き換える（足し合わせない）。共通のもの（`og:locale` など）も、各ルートで出し直す
- **日付の書き方：** 日本語は `2026.10.01`、英語は `Oct 1, 2026`
- **英語の記事一覧：**
  - 日本語の記事を、英語のタイトルと要約で並べる
  - 各記事に「Japanese」のタグを付ける
  - リンクに `hreflang="ja"` を付ける
  - 英語のタイトルと要約は、記事のフロントマターの `en` から取る

## 8. 記事

- **置き場所：** `content/articles/{slug}.md`（このリポジトリの原稿をそのまま使う）
- **変換はビルドのときに行う：** Markdownを、リクエストのたびにWorkerの中で変換しない（CPU時間を使うため）。小さなViteプラグイン（`vite-plugins/content.ts`）で、`content/` の `.md` を、ビルドのときに次の形のモジュールに変える
  - `export default { frontmatter, html, headings }`（`headings` は目次用の `{ id, text }` の配列）
  - フロントマターは `gray-matter` で読み、下のzodのスキーマで確かめる。合わなければビルドを失敗させる。スキーマは `app/lib/content-schema.ts` に置き、プラグインとアプリの両方から使う
  - 日付は `YYYY-MM-DD` の文字列にして出す。表示のときに、タイムゾーンのせいで日付が1日ずれないようにする
  - 本文は unified でHTMLにする：`remark-parse` → `remark-gfm` → `remark-rehype`（`allowDangerousHtml: true`）→ `rehype-raw` → 見出しのidを付けるプラグイン → `rehype-stringify`
  - 本文には `<p class="note">` や `<dl>` などのHTMLが入っている。原稿はこのリポジトリの中だけで管理するので、そのまま通してよい。画面には `dangerouslySetInnerHTML` で入れる
  - `gray-matter` と unified は、ビルドのときだけ使う。Workerにも画面側のJavaScriptにも入れない
- **アプリからの読み込み：** `app/lib/content.server.ts` で `import.meta.glob('/content/articles/*.md', { eager: true, import: 'default' })` のように読み込み、`loader` から使う
  - 記事ページの `loader` は、知らないslugなら `throw data(null, { status: 404 })` で404にする（§14）
- **並び：** `date` の新しい順。同じ日付なら `order` の小さい順
- **トップページ：** 新しい順に3件を出す
- **次に読む：** その記事以外を新しい順に最大3件出す
- **目次：** 本文のH2から自動で作る。見出しのidは、Markdownの見出しの文字から作らず、`s1`、`s2`… の連番にする（参照もこの形）
- **本文の番号付きリスト：** 参照では「一、二、三」の漢数字を左に置く2列の形。Markdownの番号付きリストを、この形で描く（`list-style: none` と CSSカウンター、`cjk-ideographic`）
- **本文の表：** 参照の記事1の表と同じ見た目にする
- **注記：** 本文中の `<p class="note">` は、14pxの `--color-muted` で表示する（参照の記事1の「※」の行）

フロントマターのスキーマ：

```ts
import { z } from 'zod';

export const articleSchema = z.object({
  title: z.string(),
  description: z.string(),          // 一覧の要約と meta description
  lead: z.string(),                 // 記事ページのH1の下のリード文
  date: z.coerce.date(),            // gray-matter はYAMLの日付を Date で返す。確かめたあと YYYY-MM-DD の文字列にして出す
  order: z.number().int().default(0),
  category: z.enum(['制度', '考え方', '復旧']),
  readingMinutes: z.number().int(),
  keyPoints: z.array(z.string()).min(1).max(5),   // この記事の要点
  sources: z.array(z.object({
    title: z.string(), publisher: z.string(), date: z.string().optional(), url: z.string().url().optional(),
  })),
  cta: z.object({ label: z.string(), heading: z.array(z.string()), body: z.string(), button: z.string() }), // heading は1要素1行
  en: z.object({                    // 英語の記事一覧に出す情報
    title: z.string(), description: z.string(), category: z.enum(['Regulation', 'Approach', 'Recovery']),
  }),
});
```

毎月記事を追加するときは、`content/articles/` にMarkdownを1つ置いてデプロイするだけで、一覧、トップ、次に読む、サイトマップ、英語の記事一覧に反映される作りにします。
## 9. ポリシーのページ

- **置き場所：** `content/pages/` のMarkdown。`privacy.ja.md` のように「名前.言語.md」
- **読み込み：** 記事と同じ仕組み（§8）で読む
- **フロントマター：** `title`、`description`、`lang`、`effectiveDate`、`translationNotice`（任意）。制定日は「制定：2026年10月1日」「Effective October 1, 2026」の形で表示する

```ts
export const policySchema = z.object({
  title: z.string(),
  description: z.string(),
  lang: z.enum(['ja', 'en']),
  effectiveDate: z.coerce.date(),
  translationNotice: z.string().optional(),   // 今は privacy.en.md だけにある
});
```

- **見た目：** 記事と同じ本文幅の2列（目次と本文）
- **目次：** 記事と同じく、本文のH2から作る。idも同じく `s1`、`s2`… の連番（フッターの「脆弱性の報告」は `/security-policy/#s2` を指すので、セキュリティポリシーの見出しの順番を変えるときはフッターも直す）
- **英語版の注記：** `translationNotice` があるときだけ、本文の冒頭に `--color-bg-sub` の箱で表示する（参照 `en-privacy.html`）。英語のセキュリティポリシーには注記がない
- **報告先の箱：** セキュリティポリシーの `<div class="report-box">` は、参照どおりに `--color-bg-sub` の箱の中で、メールアドレスを22pxの太字で表示する
- **2列の項目：** プライバシーポリシーの「事業者の情報」と「安全管理のための措置」は、Markdownの表ではなく `<dl class="def-list">` で書いてある。参照どおり、見出しの行のない定義リスト（design-system.md の DefinitionList）で表示する。英語版の住所の `<dd>` の中の2つの `<span>` は、縦に2行で並べる
- **番号付きリスト：** 日本語のセキュリティポリシーの基本方針は漢数字、英語版は算用数字で、記事と同じ2列の形にする
- **外部へのリンク：** プライバシーポリシー第7項のGoogleへのリンクは、ふつうのリンクとして出す（新しいタブで開かない）

## 10. SEO

- **出し方：** 各ルートの `meta` で、title、description、canonical、hreflang、OGPを出す。絶対URLは、変数 `SITE_ORIGIN`（`https://shodohq.com`）をもとに組み立てる。リクエストのホストから作らない（プレビューのURLがcanonicalに入らないように）
  - パスは、`meta` では `location.pathname` を使う。`loader` と `action` の中で `request.url` のパスを使わない（画面の中の移動やJavaScriptありの送信では、`/poc/_.data` のような内部のURLになるため）
- **titleの形：**
  - 基本は「{ページ名} | 株式会社衝動」「{Page} | Shodo Inc.」
  - トップだけは「株式会社衝動 | 止めずに、守る。」「Shodo Inc. | Defend without shutting down.」
- **meta description：**

| ページ | 日本語 | 英語 |
|---|---|---|
| トップ | サイバー攻撃を受けたとき、どこを止めれば、何が止まり、何が残るのか。株式会社衝動は、業務を止めずに守るためのセキュリティ製品「Pixie」をつくっています。 | When a cyberattack hits, what should you isolate, and what will keep running? Shodo builds Pixie, security products designed to protect your business without bringing it to a halt. |
| 製品一覧 | 攻撃されうる範囲を把握するPixieの4製品と、業務を止めずに守るための意思決定AI「Pixie for Operations」をご紹介します。 | Four Pixie products that map your attack surface, and Pixie for Operations, decision AI that keeps operations running during an attack. |
| Pixie for Operations | 資産台帳・構成図・契約書・手順書から「停止の地図」をつくり、業務を残す遮断案を示す意思決定AIです。現在開発中で、デザインパートナーを募集しています。 | Decision AI that builds an outage map from your documents and proposes containment plans that keep critical operations running. In development and seeking design partners. |
| PoC | Pixieの4製品のPoCと、開発中のPixie for Operationsのデザインパートナーを募集しています。 | Try the four Pixie products in a proof of concept, or help shape Pixie for Operations as a design partner. |
| 記事一覧 | 業務を止めずに守るための考え方や、制度への備えについて、月に1回お届けします。 | Monthly articles on keeping operations running under cyberattack. Currently published in Japanese. |
| 記事 | フロントマターの `description` | なし |
| 会社情報 | 株式会社衝動（Shodo Inc.）の会社概要、社名の由来、セキュリティへの取り組みです。 | About Shodo Inc.: company overview, the story behind our name, and how we approach our own security. |
| お問い合わせ | 製品やPoCについてのご相談、脆弱性の報告を受け付けています。3営業日以内にご返信します。 | Questions about our products or PoCs, and vulnerability reports. We reply within three business days. |
| プライバシーポリシー | 株式会社衝動のプライバシーポリシーです。 | Privacy policy of Shodo Inc. |
| セキュリティポリシー | 株式会社衝動の情報セキュリティ基本方針と、脆弱性の報告についての方針です。 | Shodo Inc.'s information security policy and vulnerability reporting guidelines. |

- **canonical：** 各ページの `https://shodohq.com` からの絶対URL（末尾スラッシュあり）
- **OGP：**
  - `og:title`、`og:description`、`og:url`、`og:type` を出す（トップは `website`、記事は `article`）
  - `og:locale` は、日本語が `ja_JP`、英語が `en_US`
  - OGP画像はデザインがないので未決。決まるまで `og:image` は出さない
- **サイトマップ：** リソースルート（画面を持たず `loader` だけのルート。`route('sitemap.xml', 'routes/sitemap.ts')`）で `/sitemap.xml` を返す。各URLに `<xhtml:link rel="alternate" hreflang>` で日英の対応を入れる。記事は `content.server.ts` から並べる。送信完了のページ、絞り込んだ記事一覧、404は入れない。`Content-Type: application/xml; charset=utf-8`、`Cache-Control: public, max-age=3600`
- **robots.txt：** `public/robots.txt` に置く（中身は「すべて許可」と `Sitemap: https://shodohq.com/sitemap.xml`）
- **プレビュー環境：** リクエストのオリジンが `SITE_ORIGIN` と違うとき（`*.workers.dev`、手元など）は、Workerの入口が `X-Robots-Tag: noindex` を付ける。ただし変数 `ALLOW_INDEXING=true` のときは付けない（手元でLighthouseのSEOを測るため。`.dev.vars` にだけ書く）
- **エラーの応答：** ステータスが400以上の応答（404など）にも、Workerの入口が `X-Robots-Tag: noindex` を付ける
- **構造化データ（JSON-LD）：**
  - トップに `Organization` を出す。社名、英文社名（`alternateName`）、URL、住所、設立日（`foundingDate: 2025-05-01`）を入れる
  - 記事に `Article` を出す。見出し、日付、著者（`Organization`）を入れる
  - 下層ページに `BreadcrumbList` を出す
  - 各ルートの `meta` で `{ 'script:ld+json': { '@context': 'https://schema.org', ... } }` の形で出す。React Routerの `<Meta />` が `<script type="application/ld+json">` として出し、中身のエスケープもする。自分で `dangerouslySetInnerHTML` の `<script>` を書かない
  - `application/ld+json` は実行されないので、CSPの対象外でnonceもいらない

## 11. アクセス解析（Google Analytics 4）

- **測定ID：** 変数 `GA_MEASUREMENT_ID`（`wrangler.jsonc` の `vars`）。ビルドの環境変数にはしない
- **出すかどうかは、サーバーで決める：** ルートの `loader`（`app/root.tsx`）が、次の両方を満たすときだけ測定IDを返す。それ以外（手元、プレビュー、IDが空）ではGAのタグを一切出さない
  - `GA_MEASUREMENT_ID` が空でない
  - リクエストのオリジンが `SITE_ORIGIN` と同じ
- **ルートの `loader` の呼び直し：** 移動のたびに呼び直す必要がないので、`app/root.tsx` の `shouldRevalidate` で `false` を返す
- **読み込み方：** `Layout` の `<head>` に、`<script src="/scripts/ga.js" data-ga-id={測定ID} defer />` を1つだけ置く。自分のドメインのファイルなので、nonceはいらない。`public/scripts/ga.js` の中身は次のとおり
  - `data-ga-id` がなければ何もしない。念のため、ホストが `shodohq.com` でなくても何もしない
  - `dataLayer` と `gtag` を用意し、`gtag('js', new Date())` と `gtag('config', 測定ID, { allow_google_signals: false, allow_ad_personalization_signals: false })` を呼ぶ
  - `https://www.googletagmanager.com/gtag/js?id={測定ID}` を `async` の `<script>` で読み込む（CSPの `script-src` で許可している。§12.2）
- **使わないもの：** Google Tag Manager、GAのためのReactのライブラリ。インラインの `<script>` でGAを書かない
- **ページビュー：**
  - 最初の読み込みは、`gtag('config', ...)` が自動で送るページビューで数える
  - 画面の中の移動（React Routerの `<Link>`）は、自分で送る。GAの管理画面の拡張計測で「ブラウザの履歴イベントに基づくページの変更」をオフにし、`app/root.tsx` で、`useLocation()` の変化を見る `useEffect` から `gtag('event', 'page_view', { page_location: location.href, page_title: document.title })` を送る（最初の描画では送らない。`window.gtag` がなければ何もしない）
  - 自動の計測に任せない理由：React Routerは、新しいページのtitleを画面に反映する前にURLを変えるので、前のページのtitleで数えられることがある
  - GAのDebugViewで、1回の移動が1回だけ数えられ、`page_title` が移動先のものになっていることを確かめる
  - 記事一覧の絞り込みで `?category=` が変わると、これもページビューとして数えられる。絞り込みの使われ方として読めるので、そのままにする
- **イベント：** フォームの送信に成功したときだけ、`gtag('event', 'inquiry_submit', { form: 'poc' | 'contact', kind: 選んだ種類 })` を送る。`window.gtag` がないとき（GAなし）は何もしない
- **GAに送らないもの：** 名前、メールアドレス、会社名、フォームの本文。URLのクエリにも個人情報を入れない（`?category=` だけ）
- **GAの管理画面の設定：** Googleシグナルと広告のパーソナライズはオフにする。データの保持期間は未決（`open-items.md`）
- **同意のバナー：** 出すかどうかは未決（`open-items.md`）。決まるまではバナーなしで作る。あとから同意の仕組みを足せるように、GAを出すかどうかの判断はルートの `loader` の1か所、読み込みは `ga.js` の1か所にまとめておく（地域で分ける場合は、`loader` で `request.cf?.country` を使える）
- **プライバシーポリシー：** 第7項にGoogle Analyticsの利用と、オプトアウトの方法を書いてある（`content/pages/privacy.*.md`）

## 12. セキュリティ

### 12.1 ヘッダーの付け方

Workerを通る応答と、通らずに返る静的アセットで、ヘッダーを付ける場所が違います（§15の配信の仕組みを参照）。

| 対象 | 付ける場所 |
|---|---|
| HTMLのページ（エラーのページも含む） | CSP（nonce入り）と `Cache-Control` は `app/entry.server.tsx`。そのほかの共通のヘッダーは `workers/app.ts` |
| Workerが返すそのほかの応答（React Routerのデータ要求、`/__manifest`、`/sitemap.xml`、転送、JavaScriptありのフォームの応答） | `workers/app.ts`。HTMLでない応答にだけ、CSP `default-src 'none'; frame-ancestors 'none'` を付ける（本番のビルドのときだけ） |
| 静的アセット（`/assets/*`、フォント、`/scripts/ga.js`、`/robots.txt`、`/favicon.svg`、`/.well-known/security.txt`） | `public/_headers`（Workerを通らずに返り、Workerの付けるヘッダーが効かないため） |

HTMLのページに付けるヘッダー：

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-{nonce}' https://www.googletagmanager.com; style-src 'self'; img-src 'self' data: https://www.googletagmanager.com https://*.google-analytics.com; font-src 'self'; connect-src 'self' https://www.googletagmanager.com https://*.google-analytics.com https://*.google.com; frame-src 'none'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'; object-src 'none'; upgrade-insecure-requests
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
Cross-Origin-Opener-Policy: same-origin
X-Frame-Options: DENY
Cache-Control: private, no-cache
```

- GAの許可（`googletagmanager.com`、`google-analytics.com`、`google.com`）は、Googleの「広告の機能を使わない場合」の推奨どおり。GAを出さない環境でも、CSPは同じでよい
- `upgrade-insecure-requests` と `Strict-Transport-Security` は、`https` で配信するときだけ付ける（手元の `http://localhost` で、ブラウザが部品を `https` で取りに行って表示が壊れるのを防ぐ）
- `workers/app.ts` でヘッダーを足すときは、`entry.server.tsx` が付けたCSPを上書きしない。応答の `status` も保つ（404が200にならないように）

### 12.2 CSPとnonce

React RouterがSSRで出すHTMLには、画面を動かすためのインラインの `<script>` が入ります。これを `'unsafe-inline'` で許さずに動かすため、リクエストごとにnonceを付けます。React Routerの文書（How-to: Security）の方法です。

- `app/entry.server.tsx` の `handleRequest` で、リクエストごとに `crypto.getRandomValues` で16バイト以上を作り、base64にする
- 同じnonceを、次の3か所に渡す
  - `<ServerRouter context={routerContext} url={request.url} nonce={nonce} />`（`<Scripts>` と `<ScrollRestoration>` に自動で渡る）
  - `renderToReadableStream(..., { nonce })`
  - 応答の `Content-Security-Policy` ヘッダー
- nonceを `loader` の返り値や、画面に渡すデータに入れない
- 自分で書くコードは、インラインの `<script>` を出さない（GAは外部ファイル。§11）。構造化データは `meta` の `script:ld+json` で出す（実行されないのでCSPの対象外。§10）
- **手元の開発サーバーでは、このCSPを付けない。** Viteの開発サーバーは、インラインのスタイルとスクリプトを差し込むため。CSPは本番のビルド（`import.meta.env.PROD`）でだけ付け、確認は `npm run preview` で行う
- **スタイル：** `style-src 'self'` なので、コンポーネントで `style={...}` を使わない。`<style>` 要素も書かない。CSSはファイルに書いて読み込み、React Routerの `<Links />` で `<link rel="stylesheet">` として出す
- **小さなファイルの埋め込みを止める：** `vite.config.ts` で `build.assetsInlineLimit: 0` にする。Viteは既定で4KB未満のファイルを `data:` のURLにして埋め込むが、`font-src 'self'` では `data:` のフォントが止まるため
- **Turnstile：** `TURNSTILE_SITE_KEY` が空でないときだけ、`script-src` と `frame-src` に `https://challenges.cloudflare.com` を足す（`frame-src 'none'` を置き換える）。空のときは上のCSPのまま（§6.5）
- **確かめ方：** ブラウザの開発者ツールは、表示のあとでnonceの属性を隠す。ヘッダーとHTMLのnonceが同じかは、`curl -sD - https://.../ ` でヘッダーとHTMLを見て確かめる

`app/entry.server.tsx` と `app/entry.client.tsx` は、テンプレートには入っていません。`npx react-router reveal` で作ってから（Workers向けに `renderToReadableStream` を使う形で出る）、nonceとヘッダーの部分だけを足します。作りの目安（足す部分だけ。`signal`、`HEAD` の扱い、botを待つ部分などは、出てきたファイルのまま残す）：

```tsx
import { env } from 'cloudflare:workers';

export default async function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
  const nonce = makeNonce();
  const body = await renderToReadableStream(
    <ServerRouter context={routerContext} url={request.url} nonce={nonce} />,
    { nonce, /* signal、onError などは reveal で出てきたまま */ },
  );
  // bot と SPA モードで allReady を待つ部分も、出てきたまま
  responseHeaders.set('Content-Type', 'text/html; charset=utf-8');
  responseHeaders.set('Cache-Control', 'private, no-cache');
  if (import.meta.env.PROD) responseHeaders.set('Content-Security-Policy', buildCsp({ nonce, https: new URL(request.url).protocol === 'https:', turnstile: Boolean(env.TURNSTILE_SITE_KEY) }));
  return new Response(body, { headers: responseHeaders, status: responseStatusCode });
}
```

### 12.3 そのほか

- **security.txt：** `public/.well-known/security.txt` を置く（名前が `.` で始まるフォルダも、静的アセットとして上がる）。デプロイしたあと、本番で `text/plain` で表示されることを確かめる。`Expires` は1年より先にしない（RFC 9116）。切れる前に、毎年更新する
- **秘密の値：** `SLACK_WEBHOOK_URL`、`SLACK_WEBHOOK_URL_SECURITY`、`SLACK_WEBHOOK_URL_PREVIEW`、`TURNSTILE_SECRET_KEY` は `wrangler secret put` で設定する。手元は `.dev.vars`（`.gitignore` に入れる）。秘密の値を読むコード（`import { env } from 'cloudflare:workers'`）は、名前が `.server.ts` で終わるモジュールにだけ置く（画面側のJavaScriptに入らないように）
- **依存パッケージ：** バージョンを固定し、Dependabotなどで更新を追う。`npm audit` の高リスクが0の状態で公開する
- **外部への接続：** Google Analytics（`www.googletagmanager.com`、`*.google-analytics.com`）と、Turnstileを使う場合の `challenges.cloudflare.com` だけ。フォントも自己ホストする。WorkerからはSlackのWebhookと、Turnstileの確認にだけ接続する

## 13. パフォーマンス

- **フォント：** Fontsourceの `unicode-range` による分割を使い、`font-display: swap` にする。ページで使う太さだけを読み込む（`app/root.tsx` で `@fontsource/.../500.css` のように太さごとに読み込む）
- **JavaScript：** ReactとReact Routerの本体は全ページで読み込まれる。そのほかに画面側に入るのは、メニュー、絞り込み、フォームのコードだけにする。大きなライブラリを画面側に入れない（入力の確認に使うものは、画面側に入る量を確かめる。zodを使うなら `zod/mini` を検討する）
- **SSRの負荷：** ページはリクエストのたびにWorkerの中で描く。`loader` は、ビルドのときに変換済みの原稿を返すだけにし、重い処理を入れない。Workersの無料プランは1リクエストのCPU時間が10ミリ秒までなので、有料プランにするかは `open-items.md` で決める。公開前に、Workersの管理画面でCPU時間を確かめる
- **キャッシュ：** `/assets/*`（ファイル名にハッシュが付く）は `Cache-Control: public, max-age=31536000, immutable`（`public/_headers`）。HTMLは `private, no-cache`（nonceが毎回変わるため、共有のキャッシュに載せない）
- **画像：** 今は写真やイラストを使っていない。追加するときは、あらかじめ最適化したファイルを置き、`width` と `height` を書く

## 14. デザインがない画面

参照ファイルにないものは、既存のルール（`design-system.md`）の範囲で作ります。新しい見た目を発明しません。

- **404とサーバーのエラーの出し方：**
  - 見つからないURLを受けるルート（`route('*', ...)`）は作らない。どのルートにも当たらないURLは、React Routerが404として、ルートの `ErrorBoundary` で描く（`loader` だけで画面のないルートを作ると、HTMLではなくJSONのエラーが返ってしまう）
  - 知らない記事のslug（§8）は、記事ページの `loader` が `throw data(null, { status: 404 })` する
  - `app/root.tsx` の `ErrorBoundary` で、404なら「見つからない」ページを、それ以外なら「エラー」のページを描く。言語はURL（`/en/` で始まるか）で決める
  - ヘッダーとフッターは `root.tsx` の `Layout` に置き、エラーのページにも出す。`Layout` でルートの `loader` のデータを使うときは `useRouteLoaderData('root')` で受け、ないときも描けるようにする（ルートの `loader` がエラーになったときのため）
- **404の画面：** 下層ページのH1の形で作る。パンくずは出さない
  - 日本語：H1「ページが見つかりません」、本文「お探しのページは、移動または削除された可能性があります。」、リンク「トップに戻る」「記事一覧」
  - 英語：H1「Page not found」、本文「The page you are looking for may have been moved or deleted.」、リンク「Back to home」「Articles」
- **エラーの画面（500など）：** 404と同じ形
  - 日本語：H1「エラーが発生しました」、本文「時間をおいて、もう一度お試しください。」、リンク「トップに戻る」
  - 英語：H1「Something went wrong」、本文「Please try again in a few minutes.」、リンク「Back to home」
  - エラーの中身（スタックトレースなど）は画面に出さない。ログには `entry.server.tsx` の `handleError` で出す（フォームの内容や個人情報は出さない）
- **404とエラーのページのtitle：** ルートの `ErrorBoundary` が描くときは、ルート（`app/root.tsx`）の `meta` だけが使われる。ルートの `meta` で、`error` があるときに次のtitleを出す
  - 404：「ページが見つかりません | 株式会社衝動」「Page not found | Shodo Inc.」
  - エラー：「エラーが発生しました | 株式会社衝動」「Something went wrong | Shodo Inc.」
- **404とエラーのページの決まり：** canonicalとhreflangを出さない。`noindex`（Workerの入口が `X-Robots-Tag` を付ける。§10）。サイトマップに入れない。言語切り替えは、もう一方の言語のトップにつなぐ
- **送信完了のページ：** §6.4
- **フォームのエラー：** §6.3の文言を使う。エラーの文字色は `--color-error`
- **1440px未満と、下層ページのスマホ表示：** 参照は1440pxのPCと390pxのスマホ（トップだけ）。そのあいだの幅（1024〜1439px、768〜1023px）と、トップ以外のスマホ表示は、`design-system.md` の「レスポンシブ」の規則で作る
- **ファビコン：** ロゴがまだ仮なので、決まるまで、アクセント色の丸（RuleDotの点）を `public/favicon.svg` に置いて使う

## 15. 配信の仕組み（Cloudflare Workers）

### 15.1 全体

React Router v8（framework mode）のアプリを、そのままCloudflare Workersで動かします。ページはリクエストのたびにWorkerの中でSSRします。

```
ブラウザ
  │
  ├─ /assets/*、/scripts/ga.js、/robots.txt、/favicon.svg、/.well-known/security.txt
  │     → 静的アセットをそのまま返す（Workerは動かない。ヘッダーは public/_headers）
  │
  └─ それ以外（ページ、React Routerのデータ要求、フォームの送信、/sitemap.xml、見つからないURL）
        → workers/app.ts（Workerの入口）
            ├─ 末尾スラッシュの転送（301）
            ├─ React Router（SSR、loader、action。フォームはactionからSlackへ）
            └─ 共通のヘッダーを付けて返す
```

- **土台：** Cloudflareのテンプレート（`npm create cloudflare@latest -- shodo-site --framework=react-router --no-deploy --no-open --no-git`）。React Router、Vite、CloudflareのViteプラグインの組み合わせで、手元の開発サーバーでもWorkersと同じ実行環境で動く
  - この資料を置いたリポジトリの中には直接作れない（作る先のフォルダに既存のファイルがあると断られる）。いったん別のフォルダに作り、中身をリポジトリの一番上に移す。`public/` は、この資料の `public/`（`_headers`、`.well-known/`）と合わせる
  - テンプレートに入っているもので、このサイトに合わないものは消す：Tailwind（`@tailwindcss/vite`、`app.css` の読み込み）、`root.tsx` の `links` にあるGoogle Fontsの読み込み、見本のページ。`AGENTS.md` ができた場合も消す（`CLAUDE.md` を正とする）
  - `entry.server.tsx` と `entry.client.tsx` は `npx react-router reveal` で作る（§12.2）
- **静的な書き出し（prerender）はしない。** nonceのために、ページをリクエストごとに描く必要があるため
- **必要な環境：** React Router v8は、Node 22.22以上、React 19.2.7以上、Vite 7以上が必要（2026年6月の v8 の告知による）
- **Workersのプラン：** 無料プランは1リクエストのCPU時間が10ミリ秒まで。ReactのSSRでは超えることがあるので、有料プラン（Workers Paid）を勧める（`open-items.md`）

### 15.2 Workerの入口（`workers/app.ts`）

テンプレートの `workers/app.ts` に、次の3つを足します。

1. **末尾スラッシュの転送：** `GET` と `HEAD` で、パスが `/` で終わらず、最後の区切りに `.` を含まず、React Routerが内部で使うURL（`/__manifest`）でないときは、`/` を足したURLに301で転送する（クエリは残す）。`.data` で終わるデータ要求や、ファイルのURLは転送しない
2. **React Routerに渡す：** テンプレートのまま `requestHandler(request)` を呼ぶ（contextは渡さない）。`loader` と `action` の中で変数、秘密の値、`INQUIRY_LIMITER` を使うときは、`.server.ts` のモジュールで `import { env } from 'cloudflare:workers'` から読む（テンプレートの見本もこの形）
   - Cloudflareの文書には `requestHandler(request, { cloudflare: { env, ctx } })` の形が残っているが、v8ではミドルウェアが既定で有効なので、ふつうのオブジェクトを渡すと全リクエストが500になる。contextを渡す必要が出たら、`new RouterContextProvider()` を使う
3. **共通のヘッダー：** §12.1のヘッダーを、Workerが返すすべての応答に付ける。本番のビルド（`import.meta.env.PROD`）のときだけ、HTMLでなくCSPもまだない応答に `default-src 'none'; frame-ancestors 'none'` を付ける（開発サーバーのページに付けると、画面が動かなくなる）。本番以外のオリジンと、ステータス400以上の応答には `X-Robots-Tag: noindex` を付ける（§10）

作りの目安：

```ts
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if ((request.method === 'GET' || request.method === 'HEAD') && needsTrailingSlash(url.pathname)) {
      url.pathname += '/';
      // Response.redirect() の応答はヘッダーを変えられないので、自分で組む
      return withCommonHeaders(new Response(null, { status: 301, headers: { Location: url.toString() } }), request, env);
    }
    const res = await requestHandler(request);   // テンプレートのまま
    return withCommonHeaders(res, request, env);   // 新しい Response に写してからヘッダーを足す。status は保つ
  },
} satisfies ExportedHandler<Env>;
```

`www.shodohq.com` から `shodohq.com` への転送と、`http://` から `https://` への転送は、Workerではなく、Cloudflareの設定で行います（§15.5）。

### 15.3 wrangler.jsonc の目安

```jsonc
{
  "$schema": "./node_modules/wrangler/config-schema.json",
  "name": "shodo-site",
  "main": "./workers/app.ts",
  "compatibility_date": "2026-09-01",
  "vars": {
    "SITE_ORIGIN": "https://shodohq.com",
    "GA_MEASUREMENT_ID": "",                  // 決まったら入れる（open-items.md）
    "TURNSTILE_SITE_KEY": ""                  // Turnstileを使う場合
  },
  "ratelimits": [
    { "name": "INQUIRY_LIMITER", "namespace_id": "1001", "simple": { "limit": 5, "period": 60 } }
  ],
  "observability": { "logs": { "enabled": true, "invocation_logs": false } },
  "upload_source_maps": true,
  "preview_urls": true,
  "routes": [{ "pattern": "shodohq.com", "custom_domain": true }]
}
```

- 静的アセットの設定（`assets`）は、CloudflareのViteプラグインがビルドのときに作る。自分で書かない
- `invocation_logs` は、呼び出しごとの自動のログ。IPアドレスなどが残るので切っておく。自分で出すログは §6.5 の決まりに従う
- 型は `npm run cf-typegen`（`wrangler types`）で作り、`Env` の型を使う。`wrangler types` は秘密の値の名前を `.dev.vars` から読むので、`.dev.vars` のないCIでは秘密の値の型が消える。秘密の値の名前を `wrangler.jsonc` の `secrets`（`"secrets": { "required": [...] }`）に書くか、作った型のファイルをリポジトリに入れて、CIの型チェックが通るようにする

### 15.4 環境変数と秘密の値

| 名前 | 種類 | 値 |
|---|---|---|
| `SITE_ORIGIN` | 変数（`vars`） | `https://shodohq.com`。本番かどうかの判定と、canonicalなどの絶対URLに使う |
| `GA_MEASUREMENT_ID` | 変数（`vars`） | GA4の測定ID（未決）。空ならGAを出さない |
| `TURNSTILE_SITE_KEY` | 変数（`vars`、任意） | Turnstileを使う場合。ルートの `loader` から画面に渡す |
| `ALLOW_INDEXING` | 変数（手元の `.dev.vars` だけ） | `true` で、本番以外でも `noindex` を付けない |
| `SLACK_WEBHOOK_URL` | 秘密の値 | 本番の投稿先チャンネルのWebhook URL |
| `SLACK_WEBHOOK_URL_SECURITY` | 秘密の値（任意） | 脆弱性の報告を分ける場合 |
| `SLACK_WEBHOOK_URL_PREVIEW` | 秘密の値 | プレビューと手元で使うテスト用チャンネル |
| `TURNSTILE_SECRET_KEY` | 秘密の値（任意） | Turnstileを使う場合 |

どれも実行時の値です。ビルドの環境変数に入れるものはありません（測定IDやサイトキーを変えるのに、ビルドし直す必要がない）。

### 15.5 デプロイ

- GitHubのリポジトリとCloudflareのWorkers Builds（Gitの連携）をつなぎ、`main` へのマージで本番に出す。ほかのブランチはプレビューのURL（`*.workers.dev`）に出る。プレビューでは、`noindex` が付き、GAは動かず、フォームはテスト用のチャンネルに届く
- ビルドのNodeのバージョンを22.22以上にする（`.node-version` などで指定）
- Cloudflare側の設定（`open-items.md` #1）
  - `shodohq.com` のDNSをCloudflareで管理する（Workersのカスタムドメインに必要）
  - `www` のDNSレコードを、プロキシを有効にして作り、Redirect Rulesで `https://shodohq.com` に301で転送する（パスとクエリは残す）
  - 「Always Use HTTPS」を有効にする（`http://` を `https://` に転送）
  - HTMLを書き換えるCloudflareの機能を切る：「Email Address Obfuscation」（ページの中の security@shodohq.com を書き換え、Reactの描画の食い違いのエラーを起こす。JavaScriptなしでも読めなくなる）、「Rocket Loader」、Web Analyticsの自動の埋め込み。Bot Fight Modeのように、ページにスクリプトを差し込む機能も、CSPの違反が出ないか確かめる
  - 旧サイトから切り替えるときは、`shodohq.com` の既存のDNSレコード（旧サイトを指すA、AAAA、CNAME）を消してから、Workersのカスタムドメインを付ける（レコードが残っていると付けられない）。メールのMX、SPF、DKIMのレコードは消さない

## 16. 公開前チェック

- [ ] 全ページを、参照ファイルと並べて1440pxと390pxで見比べた
- [ ] 1024pxと768pxでも崩れていない
- [ ] リンク切れがない。日英の切り替えがすべて対応するページにつながっている
- [ ] 末尾スラッシュのないURL（例：`/products`）が、付いたURLに301で転送される。画面の中の移動（React Routerの移動）は壊れていない
- [ ] キーボードだけで、全ページとメニュー、フォームを操作できる
- [ ] スクリーンリーダー（VoiceOver）で、見出しの階層と、フォームのエラーが読める
- [ ] JavaScriptを切っても、全ページが読め、メニューの代わりのリンク、記事の絞り込み、フォームの送信（Turnstileを使わない場合）が働く
- [ ] Lighthouse（モバイル）で、Accessibility 100、Best Practices 100、SEO 100、Performance 95以上（手元の `npm run preview` で `ALLOW_INDEXING=true` にして測る。公開後に本番でも測る）
- [ ] セキュリティヘッダーが、ページ、静的ファイル、データ要求、フォームの応答のそれぞれに出ている（securityheaders.com などで確認）
- [ ] ページのインラインの `script` に、毎回違うnonceが付き、ヘッダーのnonceと一致している（`curl` で確認）。ブラウザのコンソールにCSPの違反が出ない（GAが動いている状態で）
- [ ] サーバーが返すHTMLに、`style` 属性と `<style>` 要素がない
- [ ] `/存在しないURL/` で日本語の404、`/en/存在しないURL/` で英語の404が、ステータス404で出る。知らない記事のslugも404になる
- [ ] `www.shodohq.com` と `http://` が `https://shodohq.com` に転送される
- [ ] `/.well-known/security.txt` が `text/plain` で表示され、`Expires` が1年以内
- [ ] フォームを日本語と英語で実際に送り、Slackに届く。任意の項目を空にしても届く。`vuln` は決めたチャンネルに届く
- [ ] JavaScriptなしで送ったとき、Turnstileを使わないなら `/contact/sent/` に移ってSlackに届く。入力に誤りがあれば、同じページにエラーが出て、入力した値が残る。Turnstileを使うなら `<noscript>` の案内が出る
- [ ] プレビュー環境から送ると、本番ではなくテスト用のチャンネルに届く
- [ ] フォームに `<!channel>` や `@channel` を入れて送っても、Slackでメンションとして働かない
- [ ] 続けて何度も送ると、「送信の失敗」の文言が出る（429）
- [ ] GAのDebugViewで、ページビュー（最初の読み込みと画面の中の移動が1回ずつ、titleが正しい）と `inquiry_submit` が届き、個人情報が入っていない。プレビュー環境ではGAのタグが出ていない
- [ ] プレビュー環境の応答に `X-Robots-Tag: noindex` が付いている
- [ ] Workersの管理画面で、ページのCPU時間がプランの上限に十分収まっている
- [ ] Cloudflareの「Email Address Obfuscation」などが切れていて、ページの中の security@shodohq.com がそのまま出ている
- [ ] `open-items.md` の「公開までに必要」の項目がすべて決まっている
- [ ] 記事の事実関係と、ポリシーの文面を、担当者が確認した
