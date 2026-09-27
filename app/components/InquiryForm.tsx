import { type FormEvent, useEffect, useRef, useState } from "react";
import { Link, useFetcher, useRouteLoaderData } from "react-router";
import { trackInquirySubmit } from "~/lib/analytics";
import { cx } from "~/lib/cx";
import {
  failureMessage,
  firstErrorField,
  type InquiryErrors,
  type InquiryField,
  type InquiryFormName,
  type InquiryResult,
  type InquiryValues,
  readInquiry,
  validateInquiry,
} from "~/lib/inquiry";
import { type Lang, localizePath, paths } from "~/lib/site";
import type { loader as rootLoader } from "~/root";
import { Button } from "./Button";
import { FieldError } from "./FieldError";
import styles from "./InquiryForm.module.css";
import { TextLink } from "./TextLink";
import { Turnstile } from "./Turnstile";

type Choice = { value: string; label: string };

type TextFieldSpec = {
  name: "company" | "dept" | "name" | "email";
  label: string;
  type: "text" | "email";
  autoComplete: string;
};

type FormSpec = {
  kind: { legend: string; choices: Choice[]; columns: 1 | 2 };
  fields: TextFieldSpec[];
  products?: { legend: string; choices: Choice[] };
  message: { label: string; rows: number; placeholder?: string };
  /** 同意のラベル。policy の部分を /privacy/ へのリンクにする（§6.1） */
  agree: { before: string; policy: string; after: string };
  submit: string;
};

const productChoices: Choice[] = [
  { value: "caasm", label: "Pixie CAASM" },
  { value: "easm", label: "Pixie EASM" },
  { value: "iasm", label: "Pixie IASM" },
  { value: "aspm", label: "Pixie ASPM" },
  { value: "ops", label: "Pixie for Operations" },
];

/**
 * 項目と文言（docs/spec.md §6.1、§6.2。選択肢の文言は参照 ja-poc.html、ja-contact.html、en-poc.html、en-contact.html）。
 * メッセージの「（任意）」「(optional)」は、参照にないものを足している（§6.1）
 */
const forms: Record<Lang, Record<InquiryFormName, FormSpec>> = {
  ja: {
    poc: {
      kind: {
        legend: "ご相談の種類",
        columns: 1,
        choices: [
          { value: "poc", label: "Pixie 4製品のPoC" },
          { value: "partner", label: "Pixie for Operations デザインパートナー" },
        ],
      },
      fields: [
        { name: "company", label: "会社名", type: "text", autoComplete: "organization" },
        { name: "dept", label: "部署・役職", type: "text", autoComplete: "organization-title" },
        { name: "name", label: "お名前", type: "text", autoComplete: "name" },
        { name: "email", label: "メールアドレス", type: "email", autoComplete: "email" },
      ],
      products: { legend: "関心のある製品（複数選択可）", choices: productChoices },
      message: {
        label: "ご相談の内容（任意）",
        rows: 6,
        placeholder: "いま抱えている課題や、確かめたいことをお書きください",
      },
      agree: { before: "", policy: "プライバシーポリシー", after: "に同意する" },
      submit: "送信する",
    },
    contact: {
      kind: {
        legend: "お問い合わせの種類",
        columns: 2,
        choices: [
          { value: "product", label: "製品について" },
          { value: "poc", label: "PoC・デザインパートナー" },
          { value: "vuln", label: "脆弱性の報告" },
          { value: "other", label: "その他" },
        ],
      },
      fields: [
        { name: "company", label: "会社名（任意）", type: "text", autoComplete: "organization" },
        { name: "name", label: "お名前", type: "text", autoComplete: "name" },
        { name: "email", label: "メールアドレス", type: "email", autoComplete: "email" },
      ],
      message: { label: "お問い合わせの内容", rows: 8 },
      agree: { before: "", policy: "プライバシーポリシー", after: "に同意する" },
      submit: "送信する",
    },
  },
  en: {
    poc: {
      kind: {
        legend: "What are you interested in?",
        columns: 1,
        choices: [
          { value: "poc", label: "A PoC for the four Pixie products" },
          { value: "partner", label: "Becoming a Pixie for Operations design partner" },
        ],
      },
      fields: [
        { name: "company", label: "Company", type: "text", autoComplete: "organization" },
        {
          name: "dept",
          label: "Department and title",
          type: "text",
          autoComplete: "organization-title",
        },
        { name: "name", label: "Name", type: "text", autoComplete: "name" },
        { name: "email", label: "Email", type: "email", autoComplete: "email" },
      ],
      products: {
        legend: "Products of interest (select all that apply)",
        choices: productChoices,
      },
      message: {
        label: "Message (optional)",
        rows: 6,
        placeholder: "Tell us about your challenges and what you want to validate",
      },
      agree: { before: "I agree to the ", policy: "privacy policy", after: "" },
      submit: "Send",
    },
    contact: {
      kind: {
        legend: "Type of inquiry",
        columns: 2,
        choices: [
          { value: "product", label: "Products" },
          { value: "poc", label: "PoC or design partnership" },
          { value: "vuln", label: "Vulnerability report" },
          { value: "other", label: "Other" },
        ],
      },
      fields: [
        {
          name: "company",
          label: "Company (optional)",
          type: "text",
          autoComplete: "organization",
        },
        { name: "name", label: "Name", type: "text", autoComplete: "name" },
        { name: "email", label: "Email", type: "email", autoComplete: "email" },
      ],
      message: { label: "Message", rows: 8 },
      agree: { before: "I agree to the ", policy: "privacy policy", after: "" },
      submit: "Send",
    },
  },
};

/** 送信したあとの文言（docs/spec.md §6.4） */
const sentCopy = {
  ja: {
    normal: {
      heading: "送信しました",
      body: "お問い合わせありがとうございます。内容を確認のうえ、3営業日以内にご返信します。",
    },
    vuln: {
      heading: "送信しました",
      body: "報告ありがとうございます。受け取ったことを、3営業日以内にご連絡します。",
    },
    home: "トップに戻る",
  },
  en: {
    normal: {
      heading: "Thank you. Your message has been sent.",
      body: "We will reply within three business days.",
    },
    vuln: {
      heading: "Thank you for your report.",
      body: "We will confirm receipt within three business days.",
    },
    home: "Back to home",
  },
} as const;

/** Turnstileを使うときの、JavaScriptが動かない環境への案内（§6.5） */
const noscriptCopy = {
  ja: "このフォームを送信するには、JavaScriptを有効にしてください。脆弱性の報告は、security@shodohq.com でも受け付けています。",
  en: "Please enable JavaScript to send this form. You can also report vulnerabilities to security@shodohq.com.",
} as const;

type InquiryFormProps = {
  lang: Lang;
  form: InquiryFormName;
  /**
   * JavaScriptなしで送ったときの action の結果（useActionData）。
   * 入力の誤りがあれば、エラーを出し、入力した値を残して描き直す（§6.4）
   */
  result?: InquiryResult;
};

/**
 * PoC応募とお問い合わせのフォーム（docs/spec.md §6）。
 *
 * JavaScriptが動くときは、useFetcher でページを移動せずに送り、結果でフォームの場所を切り替える。
 * JavaScriptが動かないときは、ふつうの <form> としてページのURLに送られる（action は各ルート）
 */
export function InquiryForm({ lang, form, result }: InquiryFormProps) {
  const spec = forms[lang][form];
  const fetcher = useFetcher<InquiryResult>();
  const turnstileSiteKey = useRouteLoaderData<typeof rootLoader>("root")?.turnstileSiteKey ?? null;
  const id = (name: string) => `${form}-${name}`;

  // 画面が動くようになってから、JavaScriptで送ったことを示す隠し項目を足す（§6.5）
  const [enhanced, setEnhanced] = useState(false);
  useEffect(() => {
    setEnhanced(true);
  }, []);

  // 送る前の確認で見つけたエラー。送ったあとは、サーバーの結果を出す
  const [clientErrors, setClientErrors] = useState<InquiryErrors | null>(null);
  const response = fetcher.data ?? result;
  const serverErrors = response && !response.ok && "errors" in response ? response.errors : {};
  const errors = clientErrors ?? serverErrors;
  const values: Partial<InquiryValues> =
    response && !response.ok && "values" in response ? response.values : {};
  const failed = Boolean(response && !response.ok && "error" in response);
  const busy = fetcher.state !== "idle";

  // エラーがあれば、最初のエラーの項目にフォーカスを移す（§6.3）
  const [focusField, setFocusField] = useState<InquiryField | null>(null);
  useEffect(() => {
    if (!focusField) return;
    document.getElementById(fieldId(form, focusField))?.focus();
    setFocusField(null);
  }, [focusField, form]);

  // サーバーから入力の誤りが返ってきたとき（画面の確認をすり抜けた場合）も、同じように移す
  useEffect(() => {
    const data = fetcher.data;
    if (data && !data.ok && "errors" in data) setFocusField(firstErrorField(data.errors) ?? null);
  }, [fetcher.data]);

  const sent = fetcher.data?.ok ? fetcher.data : null;
  const sentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!sent) return;
    // 送信の結果の文言にフォーカスを移し、Google Analyticsにイベントを送る（§6.4、§11）
    sentRef.current?.focus();
    trackInquirySubmit(form, sent.kind);
  }, [sent, form]);

  if (sent) {
    const copy = sentCopy[lang];
    const message = sent.kind === "vuln" ? copy.vuln : copy.normal;
    return (
      <div
        ref={sentRef}
        tabIndex={-1}
        className={styles.sent}
      >
        <h2 className={styles.sentHeading}>{message.heading}</h2>
        <p className={styles.sentBody}>{message.body}</p>
        <div>
          <TextLink to={localizePath(lang, paths.home)}>{copy.home}</TextLink>
        </div>
      </div>
    );
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    const found = validateInquiry(form, lang, readInquiry(new FormData(event.currentTarget)));
    const first = firstErrorField(found);
    if (first) {
      event.preventDefault();
      setClientErrors(found);
      setFocusField(first);
      return;
    }
    setClientErrors(null);
  };

  // JavaScriptなしで描き直したページでは、最初の誤りの項目に autoFocus を付ける（§6.5）
  const firstError = enhanced ? undefined : firstErrorField(errors);
  const errorProps = (field: InquiryField) => ({
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": errors[field] ? id(`${field}-error`) : undefined,
  });

  return (
    <fetcher.Form
      method="post"
      // multipart で送る。urlencoded だと日本語は1文字9バイトになり、5000文字の本文が本文の上限（32KB）を超えるため
      encType="multipart/form-data"
      action={localizePath(lang, paths[form])}
      noValidate
      onSubmit={onSubmit}
      className={styles.form}
    >
      <input
        type="hidden"
        name="form"
        value={form}
      />
      <input
        type="hidden"
        name="lang"
        value={lang}
      />
      {enhanced && (
        <input
          type="hidden"
          name="enhanced"
          value="1"
        />
      )}
      {/* ハニーポット。画面の外に置き、人は入力しない（§6.5） */}
      <div
        aria-hidden="true"
        className={styles.trap}
      >
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {turnstileSiteKey && (
        <noscript>
          <p className={styles.noscript}>{noscriptCopy[lang]}</p>
        </noscript>
      )}

      <fieldset
        className={styles.fieldset}
        aria-describedby={errors.kind ? id("kind-error") : undefined}
      >
        <legend className={styles.legend}>{spec.kind.legend}</legend>
        <div className={spec.kind.columns === 2 ? styles.choices2 : styles.choices1}>
          {spec.kind.choices.map((choice, index) => (
            <label
              key={choice.value}
              className={styles.choice}
            >
              <input
                id={index === 0 ? fieldId(form, "kind") : undefined}
                type="radio"
                name="kind"
                value={choice.value}
                defaultChecked={values.kind ? values.kind === choice.value : index === 0}
                aria-invalid={errors.kind ? true : undefined}
                // biome-ignore lint/a11y/noAutofocus: JavaScriptなしで描き直したとき、最初の誤りの項目に移す（§6.5）
                autoFocus={index === 0 && firstError === "kind"}
                className={styles.control}
              />
              {choice.label}
            </label>
          ))}
        </div>
        <FieldError
          id={id("kind-error")}
          message={errors.kind}
        />
      </fieldset>

      <div className={styles.fields}>
        {spec.fields.map((field) => (
          <div
            key={field.name}
            className={styles.field}
          >
            <label
              htmlFor={id(field.name)}
              className={styles.label}
            >
              {field.label}
            </label>
            <input
              id={id(field.name)}
              name={field.name}
              type={field.type}
              autoComplete={field.autoComplete}
              defaultValue={values[field.name]}
              required={isRequired(form, field.name)}
              {...errorProps(field.name)}
              // biome-ignore lint/a11y/noAutofocus: JavaScriptなしで描き直したとき、最初の誤りの項目に移す（§6.5）
              autoFocus={firstError === field.name}
              className={styles.input}
            />
            <FieldError
              id={id(`${field.name}-error`)}
              message={errors[field.name]}
            />
          </div>
        ))}
      </div>

      {spec.products && (
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>{spec.products.legend}</legend>
          <div className={styles.choices3}>
            {spec.products.choices.map((choice) => (
              <label
                key={choice.value}
                className={styles.choice}
              >
                <input
                  type="checkbox"
                  name="product"
                  value={choice.value}
                  defaultChecked={values.product?.includes(choice.value)}
                  className={styles.control}
                />
                {choice.label}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div className={styles.field}>
        <label
          htmlFor={id("message")}
          className={styles.label}
        >
          {spec.message.label}
        </label>
        <textarea
          id={id("message")}
          name="message"
          rows={spec.message.rows}
          placeholder={spec.message.placeholder}
          defaultValue={values.message}
          required={isRequired(form, "message")}
          {...errorProps("message")}
          // biome-ignore lint/a11y/noAutofocus: JavaScriptなしで描き直したとき、最初の誤りの項目に移す（§6.5）
          autoFocus={firstError === "message"}
          className={styles.textarea}
        />
        <FieldError
          id={id("message-error")}
          message={errors.message}
        />
      </div>

      <div className={styles.agreeField}>
        <label className={cx(styles.choice, styles.agree)}>
          <input
            id={id("agree")}
            type="checkbox"
            name="agree"
            defaultChecked={values.agree}
            required
            {...errorProps("agree")}
            // biome-ignore lint/a11y/noAutofocus: JavaScriptなしで描き直したとき、最初の誤りの項目に移す（§6.5）
            autoFocus={firstError === "agree"}
            className={styles.control}
          />
          {/* 「プライバシーポリシー」を /privacy/ へのリンクにする（§6.1） */}
          <span>
            {spec.agree.before}
            <Link to={localizePath(lang, paths.privacy)}>{spec.agree.policy}</Link>
            {spec.agree.after}
          </span>
        </label>
        <FieldError
          id={id("agree-error")}
          message={errors.agree}
        />
      </div>

      {/* Turnstileは、画面が動くようになってから読み込む（サイトキーがあるときだけ。§6.5） */}
      {turnstileSiteKey && enhanced && (
        <Turnstile
          siteKey={turnstileSiteKey}
          lang={lang}
          resetKey={fetcher.data}
        />
      )}

      {failed && (
        <FieldError
          role="alert"
          message={failureMessage(lang)}
        />
      )}

      <div>
        <Button
          disabled={busy}
          className={styles.submit}
        >
          {spec.submit}
        </Button>
      </div>
    </fetcher.Form>
  );
}

/** 項目のid。種類は最初のラジオボタン（エラーのときのフォーカスの移し先） */
function fieldId(form: InquiryFormName, field: InquiryField): string {
  return `${form}-${field}`;
}

/** 必ず入れる項目か（読み上げで「必須」と伝えるため。確認そのものは validateInquiry で行う） */
function isRequired(form: InquiryFormName, field: InquiryField): boolean {
  if (field === "company" || field === "dept") return form === "poc";
  if (field === "message") return form === "contact";
  return field === "name" || field === "email" || field === "agree";
}
