import { Link } from "react-router";
import { localizePath, paths } from "~/lib/site";
import { Button } from "./Button";
import styles from "./InquiryForm.module.css";

type FormName = "poc" | "contact";

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
};

/** 項目と文言（docs/spec.md §6.1、§6.2。選択肢の文言は参照 ja-poc.html、ja-contact.html） */
const forms: Record<FormName, FormSpec> = {
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
    products: {
      legend: "関心のある製品（複数選択可）",
      choices: [
        { value: "caasm", label: "Pixie CAASM" },
        { value: "easm", label: "Pixie EASM" },
        { value: "iasm", label: "Pixie IASM" },
        { value: "aspm", label: "Pixie ASPM" },
        { value: "ops", label: "Pixie for Operations" },
      ],
    },
    // 参照にない「（任意）」を足す（§6.1）
    message: {
      label: "ご相談の内容（任意）",
      rows: 6,
      placeholder: "いま抱えている課題や、確かめたいことをお書きください",
    },
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
  },
};

/**
 * PoC応募とお問い合わせのフォーム（docs/spec.md §6）。
 * いまは見た目と項目だけ。送信の処理（action、入力の確認、Slackへの投稿）はフォームの段階で足す
 */
export function InquiryForm({ form }: { form: FormName }) {
  const spec = forms[form];
  const lang = "ja";
  const id = (name: string) => `${form}-${name}`;

  return (
    <form
      method="post"
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

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>{spec.kind.legend}</legend>
        <div className={spec.kind.columns === 2 ? styles.choices2 : styles.choices1}>
          {spec.kind.choices.map((choice, index) => (
            <label
              key={choice.value}
              className={styles.choice}
            >
              <input
                type="radio"
                name="kind"
                value={choice.value}
                defaultChecked={index === 0}
                className={styles.control}
              />
              {choice.label}
            </label>
          ))}
        </div>
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
              className={styles.input}
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
          className={styles.textarea}
        />
      </div>

      <label className={`${styles.choice} ${styles.agree}`}>
        <input
          type="checkbox"
          name="agree"
          className={styles.control}
        />
        {/* 「プライバシーポリシー」を /privacy/ へのリンクにする（§6.1） */}
        <span>
          <Link to={localizePath(lang, paths.privacy)}>プライバシーポリシー</Link>に同意する
        </span>
      </label>

      <div>
        <Button className={styles.submit}>送信する</Button>
      </div>
    </form>
  );
}
