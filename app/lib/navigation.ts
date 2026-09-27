/** ヘッダーとスマホのメニューに並べるナビの項目（docs/spec.md §3.1） */
import { type Lang, localizePath, type NavSection, navSections, paths } from "./site";

export type NavItem = { section: NavSection; label: string; to: string };

const labels: Record<Lang, Record<NavSection, string>> = {
  ja: {
    products: "製品",
    poc: "PoC募集",
    articles: "記事",
    company: "会社情報",
    contact: "お問い合わせ",
  },
  en: {
    products: "Products",
    poc: "Design partners",
    articles: "Articles",
    company: "Company",
    contact: "Contact",
  },
};

export function mainNavItems(lang: Lang): NavItem[] {
  return navSections.map((section) => ({
    section,
    label: labels[lang][section],
    to: localizePath(lang, paths[section]),
  }));
}
