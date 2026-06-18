// components/mj/MahjongTile.tsx
// ---------------------------------------------------------------------------
// Self-contained Mahjong tile renderer.
//
//   <MahjongTile char="🀄" size="sm" />
//
// • Renders a styled tile FACE from the Unicode character your app already
//   stores (🀇 🀐 🀙 🀀 🀄 🀢 …). No data changes required.
// • ALL colours / strokes / gradients / arrangements are inline — there is
//   NO external CSS dependency. Drop this one file into a Next.js project.
// • One <MahjongTile> component, with a separate face renderer per suit.
//
// Suit coverage:
//   Characters 萬  🀇-🀏      Bamboo 索  🀐-🀘      Dots 筒  🀙-🀡
//   Winds 東南西北 🀀-🀃      Dragons 中發白 🀄🀅🀆
//   Flowers 🀢-🀥   Seasons 🀦-🀩   Joker 🀪   Back 🀫
// ---------------------------------------------------------------------------
import React from "react";

/* ----------------------------- palette ----------------------------------- */
const C = {
  paper: "#fffdf8",
  edge: "#ddd5c2",
  edgeBottom: "#e6dcc2",
  ink: "#22303a",
  green: "#1f7a48",
  greenDk: "#0c3f25",
  greenDragon: "#1f8a52",
  red: "#cb3a2c",
  redDk: "#6e1b14",
  black: "#222831",
  blue: "#2b3942",
  gold: "#a9853f",
  coral: "#ef9aa2",
  coralCtr: "#ecc84a",
} as const;

/* --------------------------- unicode tables ------------------------------ */
const WAN = ["🀇", "🀈", "🀉", "🀊", "🀋", "🀌", "🀍", "🀎", "🀏"];
const BAM = ["🀐", "🀑", "🀒", "🀓", "🀔", "🀕", "🀖", "🀗", "🀘"];
const DOT = ["🀙", "🀚", "🀛", "🀜", "🀝", "🀞", "🀟", "🀠", "🀡"];
const HAN = ["一", "二", "三", "四", "五", "六", "七", "八", "九"];
const WINDS: Record<string, string> = { "🀀": "東", "🀁": "南", "🀂": "西", "🀃": "北" };
const FLOWERS = ["🀢", "🀣", "🀤", "🀥"]; // plum, orchid, bamboo, chrysanthemum
const SEASONS = ["🀦", "🀧", "🀨", "🀩"]; // spring, summer, autumn, winter

/* ------------------------------ sizing ----------------------------------- */
type Size = "sm" | "md" | "lg";
const BOX: Record<Size, { w: number; h: number; bb: number }> = {
  sm: { w: 28, h: 38, bb: 3 },
  md: { w: 34, h: 46, bb: 4 },
  lg: { w: 40, h: 54, bb: 5 },
};
// inner faces have two metric sets: "sm" and "regular" (md & lg share)
const isSm = (s: Size) => s === "sm";

/* ============================ DOTS (筒) =================================== */
// colour per pip, in render order. g=green r=red b=black
const DOT_COLORS: Record<number, ("g" | "r" | "b")[]> = {
  2: ["r", "g"],
  3: ["g", "r", "g"],
  4: ["g", "g", "g", "g"],
  5: ["g", "g", "r", "g", "g"],
  6: ["g", "g", "r", "r", "r", "r"],
  7: ["g", "g", "g", "r", "r", "r", "r"],
  8: ["b", "b", "b", "b", "b", "b", "b", "b"],
  9: ["b", "b", "b", "r", "r", "r", "b", "b", "b"],
};
// grid template + explicit cell placement (undefined ⇒ auto-flow)
const DOT_GRID: Record<number, { tmpl: string; rel?: boolean; cells?: (string | "ABS")[] }> = {
  1: { tmpl: "1fr / 1fr" },
  2: { tmpl: "repeat(2,1fr) / 1fr" },
  3: { tmpl: "repeat(3,1fr) / repeat(3,1fr)", cells: ["1/1", "2/2", "3/3"] },
  4: { tmpl: "repeat(2,1fr) / repeat(2,1fr)" },
  5: { tmpl: "repeat(2,1fr) / repeat(2,1fr)", rel: true, cells: ["1/1", "1/2", "ABS", "2/1", "2/2"] },
  6: { tmpl: "repeat(3,1fr) / repeat(2,1fr)" },
  7: {
    tmpl: "repeat(3,1fr) / repeat(6,1fr)",
    cells: ["1/1/2/3", "1/3/2/5", "1/5/2/7", "2/2/3/4", "2/4/3/6", "3/2/4/4", "3/4/4/6"],
  },
  8: { tmpl: "repeat(4,1fr) / repeat(2,1fr)" },
  9: { tmpl: "repeat(3,1fr) / repeat(3,1fr)" },
};

function pipStyle(kind: "g" | "r" | "b", sm: boolean): React.CSSProperties {
  const c = kind === "r" ? C.red : kind === "b" ? C.black : C.green;
  const d = sm ? 7 : 9;
  const stops = sm
    ? `${c} 0 1px, #fff 1px 1.9px, ${c} 1.9px 2.8px, #fff 2.8px`
    : `${c} 0 1.3px, #fff 1.3px 2.4px, ${c} 2.4px 3.5px, #fff 3.5px`;
  return {
    width: d,
    height: d,
    borderRadius: "50%",
    background: `radial-gradient(circle, ${stops})`,
    boxShadow: `inset 0 0 0 1px ${c}`,
  };
}
function bigPipStyle(sm: boolean): React.CSSProperties {
  return {
    width: sm ? 14 : 17,
    height: sm ? 14 : 17,
    borderRadius: "50%",
    transform: "scale(1.3)",
    boxShadow: `inset 0 0 0 1.5px ${C.green}`,
    background:
      "radial-gradient(circle, #cb3a2c 0 2.2px, #fff 2.2px 3.6px, #1f7a48 3.6px 5px, #fff 5px 6.4px, #cb3a2c 6.4px 7.8px, #fff 7.8px)",
  };
}

function Dots({ n, sm }: { n: number; sm: boolean }) {
  if (n === 1) {
    return <span style={gridWrap("1fr / 1fr", false)}><i style={bigPipStyle(sm)} /></span>;
  }
  const grid = DOT_GRID[n];
  const colors = DOT_COLORS[n] ?? [];
  return (
    <span style={gridWrap(grid.tmpl, grid.rel)}>
      {colors.map((k, i) => {
        const cell = grid.cells?.[i];
        const base = pipStyle(k, sm);
        if (cell === "ABS")
          return <i key={i} style={{ ...base, position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />;
        return <i key={i} style={{ ...base, gridArea: cell }} />;
      })}
    </span>
  );
}

/* ============================ BAMBOO (索) ================================= */
const BAM_RED: Record<number, number[]> = { 5: [2], 7: [0], 9: [1, 4, 7] };
const BAM_GRID: Record<number, { tmpl: string; rel?: boolean; cells?: (string | "ABS")[] }> = {
  2: { tmpl: "repeat(2,1fr) / 1fr" },
  3: { tmpl: "repeat(2,1fr) / repeat(2,1fr)", cells: ["1/1/2/3", "2/1", "2/2"] },
  4: { tmpl: "repeat(2,1fr) / repeat(2,1fr)" },
  5: { tmpl: "repeat(2,1fr) / repeat(2,1fr)", rel: true, cells: ["1/1", "1/2", "ABS", "2/1", "2/2"] },
  6: { tmpl: "repeat(2,1fr) / repeat(3,1fr)" },
  7: { tmpl: "repeat(3,1fr) / repeat(3,1fr)", cells: ["1/2", "2/1", "2/2", "2/3", "3/1", "3/2", "3/3"] },
  8: { tmpl: "repeat(2,1fr) / repeat(4,1fr)" },
  9: { tmpl: "repeat(3,1fr) / repeat(3,1fr)" },
};
const BAM_TALL = new Set([2, 3, 4, 5, 6, 8]); // taller stalks; 7 & 9 are shorter

function stickStyle(red: boolean, height: number): React.CSSProperties {
  const body = red ? C.red : C.green;
  const node = red ? C.redDk : C.greenDk;
  return {
    width: 6,
    height,
    borderRadius: 2.5,
    backgroundColor: body,
    backgroundImage: `linear-gradient(${node},${node}), linear-gradient(${node},${node})`,
    backgroundSize: "100% 1.6px",
    backgroundPosition: "center 33%, center 67%",
    backgroundRepeat: "no-repeat",
  };
}

function Bird({ sm }: { sm: boolean }) {
  return (
    <span style={{ position: "relative", width: 18, height: 20, transform: `scale(${sm ? 1.05 : 1.35})` }}>
      <i style={{ position: "absolute", bottom: 1, left: 5, width: 8, height: 13, borderRadius: "60% 60% 50% 50% / 70% 70% 42% 42%", background: C.greenDragon, transform: "rotate(-7deg)" }} />
      <i style={{ position: "absolute", top: 0, left: 9, width: 6, height: 6, borderRadius: "50%", background: C.red }} />
      <i style={{ position: "absolute", bottom: 0, left: 0, width: 9, height: 3, borderRadius: 2, background: C.greenDragon, transform: "rotate(28deg)" }} />
    </span>
  );
}

function Bamboo({ n, sm }: { n: number; sm: boolean }) {
  if (n === 1) return <span style={gridWrap("1fr / 1fr", false)}><Bird sm={sm} /></span>;
  const grid = BAM_GRID[n];
  const red = BAM_RED[n] ?? [];
  const tall = BAM_TALL.has(n);
  const h = sm ? (tall ? 12 : 10) : tall ? 16 : 14;
  return (
    <span style={gridWrap(grid.tmpl, grid.rel)}>
      {Array.from({ length: n }, (_, i) => {
        const cell = grid.cells?.[i];
        const base = stickStyle(red.includes(i), h);
        if (cell === "ABS")
          return <i key={i} style={{ ...base, position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />;
        return <i key={i} style={{ ...base, gridArea: cell }} />;
      })}
    </span>
  );
}

/* shared grid container for dots & bamboo */
function gridWrap(tmpl: string, rel?: boolean): React.CSSProperties {
  return {
    display: "grid",
    placeItems: "center",
    gap: 2,
    width: "100%",
    height: "100%",
    gridTemplate: tmpl,
    transform: "scale(0.8)",
    position: rel ? "relative" : undefined,
  };
}

/* ====================== FLOWERS / SEASONS (花季) ========================== */
function Sakura({ sm, tint, label }: { sm: boolean; tint: "pink" | "green"; label?: string }) {
  const d = sm ? 20 : 25;
  const fill = tint === "pink" ? "#f2a9b0" : "#a9d8bb";
  const stroke = tint === "pink" ? "#d97a86" : "#6fb38c";
  const petal = (rot: number) => (
    <ellipse key={rot} cx={12} cy={6.2} rx={2.9} ry={4.6} transform={`rotate(${rot} 12 12)`} />
  );
  return (
    <>
      {label && (
        <span style={{ position: "absolute", top: 3, left: 4, fontWeight: 800, fontSize: sm ? 7 : 7.5, lineHeight: 1, color: tint === "pink" ? C.red : C.green }}>{label}</span>
      )}
      <svg width={d} height={d} viewBox="0.5 0.5 23 23" aria-hidden style={{ overflow: "visible", display: "block" }}>
        <g fill={fill} stroke={stroke} strokeWidth={0.8}>
          {[0, 72, 144, 216, 288].map(petal)}
        </g>
        <circle cx={12} cy={12} r={2.3} fill="#ecc84a" stroke="#d9a93a" strokeWidth={0.7} />
      </svg>
    </>
  );
}

/* ============================== FACE ===================================== */
function Face({ char, sm }: { char: string; sm: boolean }): React.ReactElement {
  let i = WAN.indexOf(char);
  if (i >= 0)
    return (
      <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, lineHeight: 1 }}>
        <span style={{ color: C.ink, fontWeight: 700, fontSize: sm ? 10 : 12, marginBottom: 1 }}>{HAN[i]}</span>
        <span style={{ color: C.red, fontWeight: 800, fontSize: sm ? 12 : 15 }}>萬</span>
      </span>
    );

  i = BAM.indexOf(char);
  if (i >= 0) return <Bamboo n={i + 1} sm={sm} />;

  i = DOT.indexOf(char);
  if (i >= 0) return <Dots n={i + 1} sm={sm} />;

  if (WINDS[char]) return <span style={{ color: C.ink, fontWeight: 800, fontSize: sm ? 18 : 22, lineHeight: 1 }}>{WINDS[char]}</span>;
  if (char === "🀄") return <span style={{ color: C.red, fontWeight: 800, fontSize: sm ? 18 : 22, lineHeight: 1 }}>中</span>;
  if (char === "🀅") return <span style={{ color: C.greenDragon, fontWeight: 800, fontSize: sm ? 18 : 22, lineHeight: 1 }}>發</span>;
  if (char === "🀆")
    return <span style={{ width: sm ? 16 : 20, height: sm ? 18 : 22, border: `${sm ? 2 : 2.5}px solid ${C.blue}`, borderRadius: 3, boxShadow: `inset 0 0 0 1.5px #fff, inset 0 0 0 ${sm ? 2 : 2.5}px ${C.blue}` }} />;

  i = FLOWERS.indexOf(char);
  if (i >= 0) return <Sakura sm={sm} tint="pink" label={String(i + 1)} />;
  i = SEASONS.indexOf(char);
  if (i >= 0) return <Sakura sm={sm} tint="green" label={String(i + 1)} />;

  return <span style={{ color: C.ink, fontWeight: 800, fontSize: sm ? 16 : 20 }}>{char}</span>;
}

/* ============================ COMPONENT ================================== */
export function MahjongTile({
  char,
  size = "md",
  className,
  onClick,
}: {
  char: string;
  size?: Size;
  className?: string;
  onClick?: () => void;
}) {
  const b = BOX[size];
  return (
    <span
      className={className}
      onClick={onClick}
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
        flex: "0 0 auto",
        width: b.w,
        height: b.h,
        background: C.paper,
        border: `1px solid ${C.edge}`,
        borderBottom: `${b.bb}px solid ${C.edgeBottom}`,
        borderRadius: 7,
        boxShadow: "0 2px 5px rgba(40,35,20,.12)",
        position: "relative",
        fontFamily: "'Mulish', system-ui, sans-serif",
        cursor: onClick ? "pointer" : undefined,
        userSelect: "none",
      }}
    >
      <Face char={char} sm={isSm(size)} />
    </span>
  );
}

/** Convenience: render a row of tiles (e.g. a meld or a whole hand). */
export function TileRow({
  tiles,
  size = "sm",
  gap = 4,
}: {
  tiles: (string | undefined)[];
  size?: Size;
  gap?: number;
}) {
  return (
    <span style={{ display: "inline-flex", flexWrap: "wrap", alignItems: "center", gap }}>
      {tiles.filter(Boolean).map((t, i) => (
        <MahjongTile key={i} char={t as string} size={size} />
      ))}
    </span>
  );
}

export default MahjongTile;