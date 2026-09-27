/**
 * 線だけのアイコン（docs/design-system.md §7）。
 * 装飾なので読み上げない。色は文字の色（currentColor）に合わせる
 */
const icons = {
  /** 右矢印（16） */
  arrow: { width: 16, height: 16, path: "M3 8h10M9 4l4 4-4 4", stroke: 1.6 },
  /** 下矢印（16） */
  arrowDown: { width: 16, height: 16, path: "M8 3v10M4 9l4 4 4-4", stroke: 1.6 },
  /** 大きな右矢印（24） */
  arrowLarge: { width: 24, height: 24, path: "M4 12h16M14 6l6 6-6 6", stroke: 1.4 },
  /** 製品の関係の流れの矢印（48×12。docs/design-system.md §7 FlowLine） */
  flow: { width: 48, height: 12, path: "M0 6h46M41 1l5 5-5 5", stroke: 1.4 },
  /** メニュー（24） */
  menu: { width: 24, height: 24, path: "M3 8h18M3 16h18", stroke: 1.6 },
  /** 閉じる（24） */
  close: { width: 24, height: 24, path: "M5 5l14 14M19 5L5 19", stroke: 1.6 },
} as const;

type IconProps = {
  name: keyof typeof icons;
  /** 表示の大きさ（px。正方形のアイコンだけ）。省略すると元の大きさ */
  size?: number;
  /** 線の太さ。省略すると元の太さ */
  stroke?: number;
  className?: string;
};

export function Icon({ name, size, stroke, className }: IconProps) {
  const icon = icons[name];
  return (
    <svg
      width={size ?? icon.width}
      height={size ?? icon.height}
      viewBox={`0 0 ${icon.width} ${icon.height}`}
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
