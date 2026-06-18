// components/mj/MahjongTile.tsx
// Renders a single Mahjong tile FACE from the unicode character your app
// already stores in `hand_data` (🀇, 🀄, 🀐 …). Drop-in: no data changes.

import React from "react";

const WAN = ["🀇", "🀈", "🀉", "🀊", "🀋", "🀌", "🀍", "🀎", "🀏"];
const BAM = ["🀐", "🀑", "🀒", "🀓", "🀔", "🀕", "🀖", "🀗", "🀘"];
const DOT = ["🀙", "🀚", "🀛", "🀜", "🀝", "🀞", "🀟", "🀠", "🀡"];
const HAN = ["一", "二", "三", "四", "五", "六", "七", "八", "九"];
const WIND: Record<string, string> = { "🀀": "東", "🀁": "南", "🀂": "西", "🀃": "北" };
const FLOWERS = ["🀢", "🀣", "🀤", "🀥", "🀦", "🀧", "🀨", "🀩", "🀪", "🀫"];

type Size = "sm" | "md" | "lg";

// Accent positions (0-based) by tile count, matching the printed set
const DOT_RED: Record<number, number[]> = { 2: [0], 3: [1], 5: [2], 6: [2, 3, 4, 5], 7: [3, 4, 5, 6], 9: [3, 4, 5] };
const DOT_BLACK: Record<number, number[]> = { 8: [0, 1, 2, 3, 4, 5, 6, 7], 9: [0, 1, 2, 6, 7, 8] };
const BAM_RED: Record<number, number[]> = { 5: [2], 7: [0], 9: [1, 4, 7] };

function pips(n: number) {
  if (n === 1) return <i className="t-pip big" />;
  const red = DOT_RED[n] ?? [];
  const black = DOT_BLACK[n] ?? [];
  return Array.from({ length: n }, (_, i) => (
    <i key={i} className={"t-pip" + (red.includes(i) ? " red" : black.includes(i) ? " blue" : "")} />
  ));
}
function sticks(n: number) {
  const red = BAM_RED[n] ?? [];
  return Array.from({ length: n }, (_, i) => (
    <i key={i} className={"t-stick" + (red.includes(i) ? " red" : "")} />
  ));
}
function bird() {
  return (
    <span className="t-bird">
      <i className="b1" />
      <i className="b2" />
      <i className="b3" />
    </span>
  );
}

function face(char: string): React.ReactNode {
  let i = WAN.indexOf(char);
  if (i >= 0) return (<><span className="t-num">{HAN[i]}</span><span className="t-wan">萬</span></>);
  i = BAM.indexOf(char);
  if (i >= 0) return <span className={`t-bamboo mj-n${i + 1}`}>{i === 0 ? bird() : sticks(i + 1)}</span>;
  i = DOT.indexOf(char);
  if (i >= 0) return <span className={`t-dots mj-n${i + 1}`}>{pips(i + 1)}</span>;
  if (WIND[char]) return <span className="t-wind">{WIND[char]}</span>;
  if (char === "🀄") return <span className="t-dragon-r">中</span>;
  if (char === "🀅") return <span className="t-dragon-g">發</span>;
  if (char === "🀆") return <span className="t-white" />;
  if (FLOWERS.includes(char)) return <span className="t-sakura" />;
  return <span className="t-wind">{char}</span>; // fallback
}

export function MahjongTile({
  char,
  size = "md",
  className = "",
  onClick,
}: {
  char: string;
  size?: Size;
  className?: string;
  onClick?: () => void;
}) {
  const sz = size === "sm" ? "tile-sm" : size === "lg" ? "tile-lg" : "";
  return (
    <span
      className={`tile ${sz} ${onClick ? "cursor-pointer active:scale-95" : ""} ${className}`}
      onClick={onClick}
    >
      {face(char)}
    </span>
  );
}

// Convenience: render a row of tiles (e.g. a meld or a whole hand)
export function TileRow({
  tiles,
  size = "sm",
  gap = "gap-1",
}: {
  tiles: (string | undefined)[];
  size?: Size;
  gap?: string;
}) {
  return (
    <div className={`flex flex-wrap items-center ${gap}`}>
      {tiles.filter(Boolean).map((t, i) => (
        <MahjongTile key={i} char={t as string} size={size} />
      ))}
    </div>
  );
}
