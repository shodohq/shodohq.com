import { useEffect, useRef } from "react";
import type { Lang } from "~/lib/site";

/** Cloudflare Turnstile のスクリプト（CSPで、Turnstileを使うときだけ許している。docs/spec.md §12.2） */
const SCRIPT_URL = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

type TurnstileApi = {
  render: (element: HTMLElement, options: { sitekey: string; language: string }) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let loading: Promise<TurnstileApi> | undefined;

/** スクリプトを1回だけ読み込む */
function loadTurnstile(): Promise<TurnstileApi> {
  loading ??= new Promise((resolve, reject) => {
    if (window.turnstile) return resolve(window.turnstile);
    const script = document.createElement("script");
    script.src = SCRIPT_URL;
    script.async = true;
    script.onload = () => (window.turnstile ? resolve(window.turnstile) : reject());
    script.onerror = () => reject();
    document.head.appendChild(script);
  });
  return loading;
}

type TurnstileProps = {
  siteKey: string;
  lang: Lang;
  /** 送信の結果が変わるたびに、確認をやり直す（トークンは1回しか使えないため） */
  resetKey: unknown;
};

/**
 * Turnstileの確認（使うかは未決。docs/open-items.md #4）。
 * フォームの中に置くと、トークンが cf-turnstile-response という名前の隠し項目で一緒に送られる
 */
export function Turnstile({ siteKey, lang, resetKey }: TurnstileProps) {
  const ref = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    loadTurnstile()
      .then((turnstile) => {
        if (cancelled || !ref.current) return;
        widgetId.current = turnstile.render(ref.current, { sitekey: siteKey, language: lang });
      })
      .catch(() => {
        // 読み込めなかったときは、送信のときにサーバーの確認で止まり、「送信の失敗」の文言が出る
      });
    return () => {
      cancelled = true;
      if (widgetId.current) window.turnstile?.remove(widgetId.current);
      widgetId.current = undefined;
    };
  }, [siteKey, lang]);

  useEffect(() => {
    if (resetKey && widgetId.current) window.turnstile?.reset(widgetId.current);
  }, [resetKey]);

  return <div ref={ref} />;
}
