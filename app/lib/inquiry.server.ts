/**
 * フォームの送信の処理（docs/spec.md §6.5）。PoC応募とお問い合わせの action から呼ぶ。
 *
 * 確かめる順番：Origin → 連続送信の制限 → 本文の大きさ → ハニーポット → Turnstile → 入力 → Slackに投稿。
 * ログに出してよいのは、フォームの種類、結果、Slackの応答コードだけ。入力の内容やIPアドレスは出さない。
 */
import { data, redirect } from "react-router";
import {
  inquiryLimiter,
  siteOrigin,
  slackWebhookUrl,
  turnstileEnabled,
  turnstileSecretKey,
} from "./env.server";
import {
  type InquiryFormName,
  type InquiryResult,
  type InquiryValues,
  readInquiry,
  validateInquiry,
} from "./inquiry";
import { type Lang, localizePath, paths } from "./site";

/** 本文の上限。これを超えると、読む前に413で止める */
const MAX_BODY_BYTES = 32 * 1024;
/** Slackが応答しないときに、あきらめるまでの時間 */
const SLACK_TIMEOUT_MS = 10_000;
/** 1つのブロックに入れる本文の長さ（Slackの上限は3000文字） */
const SLACK_CHUNK_LENGTH = 2900;
const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

type Outcome =
  | "sent"
  | "honeypot"
  | "invalid"
  | "forbidden"
  | "too_large"
  | "rate_limited"
  | "turnstile_failed"
  | "delivery_failed";

function log(form: InquiryFormName, result: Outcome, slackStatus?: number) {
  console.log(JSON.stringify({ event: "inquiry", form, result, slackStatus }));
}

function failure(
  form: InquiryFormName,
  outcome: Outcome,
  error: "rate_limited" | "delivery_failed" | "forbidden" | "too_large",
  status: number,
) {
  log(form, outcome);
  // throw しない。throw するとルートの ErrorBoundary（エラーのページ）が出てしまう
  return data<InquiryResult>({ ok: false, error }, { status });
}

/** PoC応募とお問い合わせの action の中身 */
export async function handleInquiry(request: Request, form: InquiryFormName) {
  // 1. Origin がないPOSTは受け付けない（Origin の食い違いは、actionの前にReact Routerが400で止める）
  if (!request.headers.get("Origin")) return failure(form, "forbidden", "forbidden", 403);

  // 2. 連続送信の制限（拠点ごとに数える大まかなもの）
  const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
  const { success } = await inquiryLimiter().limit({ key: ip });
  if (!success) return failure(form, "rate_limited", "rate_limited", 429);

  // 3. 大きすぎる本文は、読む前に止める
  if (Number(request.headers.get("Content-Length") ?? 0) > MAX_BODY_BYTES) {
    return failure(form, "too_large", "too_large", 413);
  }

  const formData = await request.formData();
  const lang: Lang = formData.get("lang") === "en" ? "en" : "ja";
  const enhanced = formData.get("enhanced") === "1";
  // フォームの項目だけを取り出す（ハニーポットやTurnstileの値は返さない）
  const values = readInquiry(formData);
  const succeed = () =>
    enhanced
      ? ({ ok: true, kind: values.kind } satisfies InquiryResult)
      : // JavaScriptなしの送信は、再読み込みで二重に送られないよう、送信完了のページに移す（§6.4）
        redirect(localizePath(lang, `${paths.contact}sent/`), 303);

  // 4. ハニーポットに値があれば、Slackには送らず、成功と同じ応答を返す
  const website = formData.get("website");
  if (typeof website === "string" && website.trim() !== "") {
    log(form, "honeypot");
    return succeed();
  }

  const url = new URL(request.url);
  const production = url.origin === siteOrigin();

  // 5. Turnstile（サイトキーと秘密鍵を入れたときだけ）
  const secret = turnstileSecretKey();
  if (turnstileEnabled() && secret) {
    const token = formData.get("cf-turnstile-response");
    const verified =
      typeof token === "string" && (await verifyTurnstile({ token, secret, ip, url, production }));
    if (!verified) return failure(form, "turnstile_failed", "forbidden", 403);
  }

  // 6. 入力の確認（画面と同じ規則）
  const errors = validateInquiry(form, lang, values);
  if (Object.keys(errors).length > 0) {
    log(form, "invalid");
    return data<InquiryResult>({ ok: false, errors, values }, { status: 400 });
  }

  // 7. Slackに投稿する。自動で送り直さない（二重に届くのを防ぐ）
  const webhook = slackWebhookUrl({ production, vulnerability: values.kind === "vuln" });
  if (!webhook) return failure(form, "delivery_failed", "delivery_failed", 502);

  const payload = slackMessage({ form, lang, values });
  const response = await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(SLACK_TIMEOUT_MS),
  }).catch(() => null);

  if (!response?.ok) {
    log(form, "delivery_failed", response?.status);
    return data<InquiryResult>({ ok: false, error: "delivery_failed" }, { status: 502 });
  }
  log(form, "sent", response.status);
  return succeed();
}

/**
 * Turnstileの確認。success と、hostname がリクエストのホスト名と一致することを見る。
 * 手元とプレビューのテスト用の鍵は、hostname に別の値を返すので、本番のときだけ hostname を確かめる
 */
async function verifyTurnstile({
  token,
  secret,
  ip,
  url,
  production,
}: {
  token: string;
  secret: string;
  ip: string;
  url: URL;
  production: boolean;
}): Promise<boolean> {
  const body = new FormData();
  body.set("secret", secret);
  body.set("response", token);
  if (ip !== "unknown") body.set("remoteip", ip);
  const response = await fetch(TURNSTILE_VERIFY_URL, {
    method: "POST",
    body,
    signal: AbortSignal.timeout(SLACK_TIMEOUT_MS),
  }).catch(() => null);
  if (!response?.ok) return false;
  const result = (await response.json()) as { success?: boolean; hostname?: string };
  if (!result.success) return false;
  return !production || result.hostname === url.hostname;
}

// ---------------------------------------------------------------- Slackの投稿の形（§6.5）

const EMPTY = "（未入力）";

const formLabels: Record<InquiryFormName, string> = { poc: "PoC応募", contact: "お問い合わせ" };

const kindLabels: Record<string, string> = {
  "poc:poc": "Pixie 4製品のPoC",
  "poc:partner": "デザインパートナー",
  "contact:product": "製品について",
  "contact:poc": "PoC・デザインパートナー",
  "contact:vuln": "脆弱性の報告",
  "contact:other": "その他",
};

const productLabels: Record<string, string> = {
  caasm: "Pixie CAASM",
  easm: "Pixie EASM",
  iasm: "Pixie IASM",
  aspm: "Pixie ASPM",
  ops: "Pixie for Operations",
};

/** 通知に出る text。個人情報を入れない */
function notificationText(form: InquiryFormName, kind: string): string {
  if (form === "poc") return "【PoC応募】新しい応募があります";
  if (kind === "vuln") return "【脆弱性の報告】新しい報告があります";
  return "【お問い合わせ】新しいお問い合わせがあります";
}

/**
 * 利用者の入力は、すべて plain_text で入れる（<!channel> のようなメンションやリンクの書式が効かないように）。
 * 空の項目は「（未入力）」にする（Slackは空の文字を受け付けず、投稿全体が失敗するため）
 */
function plain(text: string) {
  return { type: "plain_text", text: text === "" ? EMPTY : text, emoji: false } as const;
}

/**
 * 本文を、Slackの1ブロックの上限に収まるように分ける。
 * 1文字ずつ足していき、.length が上限を超える手前で区切る（絵文字などを途中で切らない）
 */
export function splitForSlack(text: string, limit = SLACK_CHUNK_LENGTH): string[] {
  const chunks: string[] = [];
  let current = "";
  for (const char of Array.from(text)) {
    if (current.length + char.length > limit) {
      chunks.push(current);
      current = "";
    }
    current += char;
  }
  if (current !== "") chunks.push(current);
  return chunks.length > 0 ? chunks : [""];
}

function slackMessage({
  form,
  lang,
  values,
}: {
  form: InquiryFormName;
  lang: Lang;
  values: InquiryValues;
}) {
  const fields: [string, string][] = [
    ["会社名", values.company],
    ...(form === "poc" ? ([["部署・役職", values.dept]] as [string, string][]) : []),
    ["お名前", values.name],
    ["メールアドレス", values.email],
    ...(form === "poc"
      ? ([
          ["関心のある製品", values.product.map((product) => productLabels[product]).join("、")],
        ] as [string, string][])
      : []),
  ];
  const receivedAt = new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(new Date());
  // 送信元のページは、SITE_ORIGIN をもとに組み立てる（request.url は内部のURLになることがあるため）
  const source = new URL(localizePath(lang, paths[form]), siteOrigin()).href;
  const messageLabel = form === "poc" ? "ご相談の内容" : "お問い合わせの内容";

  return {
    text: notificationText(form, values.kind),
    blocks: [
      {
        type: "header",
        text: plain(
          `${formLabels[form]}／${kindLabels[`${form}:${values.kind}`] ?? values.kind}（${lang === "ja" ? "日本語" : "英語"}）`,
        ),
      },
      {
        type: "section",
        fields: fields.map(([label, value]) => plain(`${label}\n${value === "" ? EMPTY : value}`)),
      },
      { type: "context", elements: [plain(messageLabel)] },
      ...splitForSlack(values.message).map((chunk) => ({ type: "section", text: plain(chunk) })),
      { type: "divider" },
      {
        type: "context",
        elements: [plain(`受付：${receivedAt}（日本時間）　送信元：${source}`)],
      },
    ],
  };
}
