/**
 * フォームの入力の確認（docs/spec.md §6.1〜6.3）
 *
 * 規則はここに1つだけ書き、画面（送る前）とサーバー（action）の両方から使う。
 * 画面側のJavaScriptにも入るので、秘密の値や重いライブラリを読み込まない。
 */
import type { Lang } from "./site";

export type InquiryFormName = "poc" | "contact";

export type InquiryField =
  | "kind"
  | "company"
  | "dept"
  | "name"
  | "email"
  | "product"
  | "message"
  | "agree";

/** 送信された値。確認を通ったものも、描き直しのために返すものも、この形にする */
export type InquiryValues = {
  kind: string;
  company: string;
  dept: string;
  name: string;
  email: string;
  product: string[];
  message: string;
  agree: boolean;
};

export type InquiryErrors = Partial<Record<InquiryField, string>>;

/** 選べる値（§6.1、§6.2） */
export const inquiryKinds: Record<InquiryFormName, readonly string[]> = {
  poc: ["poc", "partner"],
  contact: ["product", "poc", "vuln", "other"],
};

export const productValues = ["caasm", "easm", "iasm", "aspm", "ops"] as const;

/** 文字数の上限 */
const maxLength = { company: 100, dept: 100, name: 100, email: 254, message: 5000 } as const;

type TextField = keyof typeof maxLength;

/** フォームにある文字の項目 */
const textFields: Record<InquiryFormName, readonly TextField[]> = {
  poc: ["company", "dept", "name", "email", "message"],
  contact: ["company", "name", "email", "message"],
};

/** 必ず入れる文字の項目。種類と同意は、別に確かめる */
const requiredText: Record<InquiryFormName, readonly TextField[]> = {
  poc: ["company", "dept", "name", "email"],
  contact: ["name", "email", "message"],
};

/** 項目の並び。送信時にエラーがあれば、この順で最初の項目にフォーカスを移す（§6.3） */
export const fieldOrder: readonly InquiryField[] = [
  "kind",
  "company",
  "dept",
  "name",
  "email",
  "product",
  "message",
  "agree",
];

/** エラーの文言に入れる項目の名前（§6.3） */
const fieldNames: Record<Lang, Record<TextField, string>> = {
  ja: {
    company: "会社名",
    dept: "部署・役職",
    name: "お名前",
    email: "メールアドレス",
    message: "お問い合わせの内容",
  },
  en: {
    company: "company",
    dept: "department and title",
    name: "name",
    email: "email",
    message: "message",
  },
};

const kindNames: Record<InquiryFormName, string> = {
  poc: "ご相談の種類",
  contact: "お問い合わせの種類",
};

/** エラーの文言（§6.3） */
const messages = {
  ja: {
    required: (field: string) => `${field}を入力してください。`,
    choose: (field: string) => `${field}を選んでください。`,
    email: "メールアドレスの形式を確認してください。",
    tooLong: (max: number) => `${max}文字以内で入力してください。`,
    agree: "送信するには、プライバシーポリシーへの同意が必要です。",
    failed: "送信できませんでした。時間をおいて、もう一度お試しください。",
  },
  en: {
    required: (field: string) => `Please enter your ${field}.`,
    choose: () => "Please choose an option.",
    email: "Please enter a valid email address.",
    tooLong: (max: number) => `Please keep this under ${max} characters.`,
    agree: "Please agree to the privacy policy to send the form.",
    failed: "We couldn't send your message. Please try again in a few minutes.",
  },
} as const;

/** 送信の失敗（連続送信の制限、Slackへの投稿の失敗など）の文言 */
export function failureMessage(lang: Lang): string {
  return messages[lang].failed;
}

/** 空白だけの値は空とみなす（§6.5） */
function text(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

/** 文字数は、絵文字などを1文字として数える */
function length(value: string): number {
  return Array.from(value).length;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** FormData から、フォームの項目だけを取り出す（ハニーポットやTurnstileの値は含めない。§6.5） */
export function readInquiry(formData: FormData): InquiryValues {
  const products = formData
    .getAll("product")
    .filter((value): value is string => typeof value === "string");
  return {
    kind: text(formData.get("kind")),
    company: text(formData.get("company")),
    dept: text(formData.get("dept")),
    name: text(formData.get("name")),
    email: text(formData.get("email")),
    product: productValues.filter((product) => products.includes(product)),
    message: text(formData.get("message")),
    agree: formData.get("agree") !== null,
  };
}

/** 入力を確かめ、項目ごとのエラーの文言を返す。エラーがなければ空のオブジェクト */
export function validateInquiry(
  form: InquiryFormName,
  lang: Lang,
  values: InquiryValues,
): InquiryErrors {
  const t = messages[lang];
  const errors: InquiryErrors = {};

  if (!inquiryKinds[form].includes(values.kind)) {
    errors.kind = t.choose(kindNames[form]);
  }

  for (const field of textFields[form]) {
    const value = values[field];
    if (value === "") {
      if (requiredText[form].includes(field)) errors[field] = t.required(fieldNames[lang][field]);
    } else if (length(value) > maxLength[field]) {
      errors[field] = t.tooLong(maxLength[field]);
    } else if (field === "email" && !emailPattern.test(value)) {
      errors.email = t.email;
    }
  }

  if (!values.agree) errors.agree = t.agree;

  return errors;
}

/** 最初のエラーの項目（§6.3） */
export function firstErrorField(errors: InquiryErrors): InquiryField | undefined {
  return fieldOrder.find((field) => errors[field]);
}

/** フォームの action が返すもの（§6.5「actionの返し方」） */
export type InquiryResult =
  | { ok: true; kind: string }
  | { ok: false; errors: InquiryErrors; values: InquiryValues }
  | { ok: false; error: "rate_limited" | "delivery_failed" | "forbidden" | "too_large" };
