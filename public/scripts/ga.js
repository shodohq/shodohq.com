/*
 * Google Analytics 4 の読み込み（docs/spec.md §11）
 *
 * app/root.tsx の Layout が、本番で測定IDがあるときだけ、この script を data-ga-id 付きで置く。
 * インラインの <script> を使わないため、CSPのnonceはいらない（自分のドメインのファイル）。
 * Google Tag Manager やGAのためのライブラリは使わない。
 */
(() => {
  const id = document.currentScript?.dataset.gaId;
  // 念のため、本番のホスト以外では何もしない
  if (!id || window.location.hostname !== "shodohq.com") return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // gtag.js は、配列ではなく arguments そのものを受け取る決まり
    // biome-ignore lint/complexity/noArguments: gtag.js の仕様（dataLayer に arguments を積む）
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  // Googleシグナルと広告のパーソナライズは使わない
  window.gtag("config", id, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(script);
})();
