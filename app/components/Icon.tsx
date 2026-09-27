/**
 * 線だけのアイコン（docs/design-system.md §7）。
 * 装飾なので読み上げない。色は文字の色（currentColor）に合わせる
 */
const icons = {
  /** 右矢印（16） */
  arrow: { box: 16, path: "M3 8h10M9 4l4 4-4 4", stroke: 1.6 },
  /** 大きな右矢印（24） */
  arrowLarge: { box: 24, path: "M4 12h16M14 6l6 6-6 6", stroke: 1.4 },
  /** メニュー（24） */
  menu: { box: 24, path: "M3 8h18M3 16h18", stroke: 1.6 },
  /** 閉じる（24） */
  close: { box: 24, path: "M5 5l14 14M19 5L5 19", stroke: 1.6 },
} as const;

type IconProps = {
  name: keyof typeof icons;
  /** 表示の大きさ（px）。省略すると元の大きさ */
  size?: number;
  /** 線の太さ。省略すると元の太さ */
  stroke?: number;
  className?: string;
};

export function Icon({ name, size, stroke, className }: IconProps) {
  const icon = icons[name];
  return (
    <svg
      width={size ?? icon.box}
      height={size ?? icon.box}
      viewBox={`0 0 ${icon.box} ${icon.box}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke ?? icon.stroke}
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d={icon.path} />
    </svg>
  );
}
