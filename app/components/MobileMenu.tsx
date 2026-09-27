import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { cx } from "~/lib/cx";
import type { NavItem } from "~/lib/navigation";
import { type Lang, localizePath, type NavSection, paths } from "~/lib/site";
import { Button } from "./Button";
import { FOOTER_NAV_ID } from "./Footer";
import { Icon } from "./Icon";
import styles from "./MobileMenu.module.css";

type MobileMenuProps = {
  lang: Lang;
  items: NavItem[];
  current?: NavSection;
  alternate: string;
};

const copy = {
  ja: {
    open: "メニューを開く",
    close: "メニューを閉じる",
    menu: "メニュー",
    cta: "PoCに参加する",
    otherLang: "English",
    privacy: "プライバシーポリシー",
  },
  en: {
    open: "Open menu",
    close: "Close menu",
    menu: "Menu",
    cta: "Join the PoC",
    otherLang: "日本語",
    privacy: "Privacy policy",
  },
} as const;

/**
 * 1024px未満のメニュー（docs/spec.md §5.1、参照 ja-top-mobile-menu-open.html）
 *
 * - ボタンを押すと、ヘッダーの下にメニューを重ねて開く
 * - Esc、メニュー内のリンク、ボタンをもう一度押すと閉じ、フォーカスをボタンに戻す
 * - 開いている間は、背景のスクロールを止め、フォーカスをボタンとメニューの中に閉じ込める
 * - JavaScriptが動かないときは、ボタンの代わりに、フッターのナビへのページ内リンクを置く
 */
export function MobileMenu({ lang, items, current, alternate }: MobileMenuProps) {
  const t = copy[lang];
  const menuId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [enhanced, setEnhanced] = useState(false);
  const [open, setOpen] = useState(false);

  // サーバーで描いたHTMLと食い違わないよう、画面が動くようになってから本物のボタンに差し替える
  useEffect(() => {
    setEnhanced(true);
  }, []);

  // ブラウザの「戻る」などで、メニューの外からページが変わったときも閉じる
  const { pathname } = useLocation();
  const [openedAt, setOpenedAt] = useState(pathname);
  if (openedAt !== pathname) {
    setOpenedAt(pathname);
    setOpen(false);
  }

  const close = useCallback(() => {
    setOpen(false);
    buttonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    const root = document.documentElement;
    root.setAttribute("data-menu-open", "");

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      } else if (event.key === "Tab" && containerRef.current) {
        trapFocus(event, containerRef.current);
      }
    };
    // 1024px以上に広がったら、メニューは使わないので閉じる
    const desktop = window.matchMedia("(width >= 1024px)");
    const onResize = () => {
      if (desktop.matches) setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onResize);
    return () => {
      root.removeAttribute("data-menu-open");
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onResize);
    };
  }, [open, close]);

  return (
    <div
      ref={containerRef}
      className={styles.mobile}
    >
      {enhanced ? (
        <button
          ref={buttonRef}
          type="button"
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? t.close : t.open}
          onClick={() => (open ? close() : setOpen(true))}
          className={styles.toggle}
        >
          <Icon name={open ? "close" : "menu"} />
        </button>
      ) : (
        <a
          href={`#${FOOTER_NAV_ID}`}
          aria-label={t.menu}
          className={styles.toggle}
        >
          <Icon name="menu" />
        </a>
      )}

      <nav
        id={menuId}
        aria-label={t.menu}
        hidden={!open}
        className={styles.menu}
      >
        <div className={styles.items}>
          {items.map((item) => (
            <Link
              key={item.section}
              to={item.to}
              aria-current={item.section === current ? "page" : undefined}
              onClick={close}
              className={styles.item}
            >
              {item.label}
              <Icon
                name="arrow"
                size={20}
                stroke={1.4}
              />
            </Link>
          ))}
        </div>
        <Button
          to={localizePath(lang, paths.poc)}
          arrow={false}
          onClick={close}
          className={styles.cta}
        >
          {t.cta}
        </Button>
        <div className={styles.sub}>
          <Link
            to={alternate}
            lang={lang === "ja" ? "en" : "ja"}
            hrefLang={lang === "ja" ? "en" : "ja"}
            onClick={close}
            className={styles.subLink}
          >
            {t.otherLang}
          </Link>
          <Link
            to={localizePath(lang, paths.privacy)}
            onClick={close}
            className={cx(styles.subLink, styles.subMuted)}
          >
            {t.privacy}
          </Link>
        </div>
      </nav>
    </div>
  );
}

/** Tabでの移動を、container の中で一周させる */
function trapFocus(event: KeyboardEvent, container: HTMLElement) {
  const focusable = Array.from(
    container.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"),
  ).filter((element) => !element.closest("[hidden]"));
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (!first || !last) return;

  const active = document.activeElement;
  const outside = !container.contains(active);
  if (event.shiftKey && (active === first || outside)) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && (active === last || outside)) {
    event.preventDefault();
    first.focus();
  }
}
