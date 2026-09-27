/**
 * Google Analytics へのイベントの送信（docs/spec.md §11）。
 * GAを読み込んでいないとき（手元、プレビュー、測定IDが空）は、window.gtag がないので何もしない。
 * 名前、メールアドレス、会社名、フォームの本文は送らない
 */
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** フォームの送信に成功したとき。送るのはフォームの種類と、選んだ種類だけ */
export function trackInquirySubmit(form: "poc" | "contact", kind: string) {
  window.gtag?.("event", "inquiry_submit", { form, kind });
}
