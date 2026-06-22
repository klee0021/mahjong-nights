// components/mj/MahjongTile.tsx
// ---------------------------------------------------------------------------
// Self-contained Mahjong tile renderer.
//
//   <MahjongTile char="🀄" size="sm" />
//
// • Renders a styled tile FACE from the Unicode character your app already
//   stores (🀇 🀐 🀙 🀀 🀄 🀢 …). No data changes required.
// • ALL colours / strokes / gradients / arrangements are inline — there is
//   NO external CSS dependency.
//
// ── SINGLE RESPONSIVE RENDERING SYSTEM ────────────────────────────────────
//   Every suit is authored ONCE into a canonical content area (FACE_W×FACE_H)
//   using the exact metrics of the design concept. `MahjongTile` then maps
//   that canonical area 1:1 onto the requested tile's content box (sm/md/lg)
//   with a single uniform scale — identical maths for every tile, so the React
//   output is pixel-faithful to the concept at all sizes. No suit has its own
//   size logic; Bamboo 7/8/9 derive stalk height from the grid's row count and
//   the geometric suits share one 0.8 inset, so nothing ever clips.
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
// Canonical content area = the design concept's tile interior. Every face is
// authored at these exact pixel metrics, then scaled as a whole to each size.
const FACE_W = 31;
const FACE_H = 40;
// The geometric suits (dots/bamboo) sit inside this inset — the concept's
// `transform: scale(0.8)` — giving consistent breathing room from the edges.
const GRID_INSET = 0.8;

type Size = "sm" | "md" | "lg";
const BOX: Record<Size, { w: number; h: number; bb: number }> = {
  sm: { w: 28, h: 38, bb: 3 },
  md: { w: 34, h: 46, bb: 4 },
  lg: { w: 40, h: 54, bb: 5 },
};

// One rule for all tiles: map the canonical area onto this tile's content box
// (tile minus its 1px sides / top and `bb` bottom border).
function faceScale(b: { w: number; h: number; bb: number }) {
  return Math.min((b.w - 2) / FACE_W, (b.h - 1 - b.bb) / FACE_H);
}

/* ----------------------- shared canonical grid --------------------------- */
// Fills the canonical area, then applies the shared inset. Children placed by
// gridArea. gap:0 + place-items:center matches the concept exactly.
function gridWrap(tmpl: string, rel?: boolean): React.CSSProperties {
  return {
    position: "absolute",
    inset: 0,
    display: "grid",
    placeItems: "center",
    gap: 0,
    gridTemplate: tmpl,
    transform: `scale(${GRID_INSET})`,
    ...(rel ? {} : null),
  };
}
// Rows the layout uses — parsed from the template, NOT hardcoded per number.
function rowCount(tmpl: string): number {
  const m = tmpl.split("/")[0].match(/repeat\((\d+)/);
  return m ? Number(m[1]) : 1;
}

/* ============================ DOTS (筒) =================================== */
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

const PIP = 8; // one diameter for every dot (concept value)
function pipStyle(kind: "g" | "r" | "b"): React.CSSProperties {
  const c = kind === "r" ? C.red : kind === "b" ? C.black : C.green;
  return {
    width: PIP,
    height: PIP,
    borderRadius: "50%",
    background: `radial-gradient(circle, ${c} 0 1.1px, #fff 1.1px 2.1px, ${c} 2.1px 3.1px, #fff 3.1px)`,
    boxShadow: `inset 0 0 0 1px ${c}`,
  };
}
function bigPipStyle(): React.CSSProperties {
  return {
    width: 18,
    height: 18,
    borderRadius: "50%",
    transform: "scale(1.25)",
    boxShadow: `inset 0 0 0 1.5px ${C.green}`,
    background:
      "radial-gradient(circle, #cb3a2c 0 2.4px, #fff 2.4px 4px, #1f7a48 4px 5.4px, #fff 5.4px 6.8px, #cb3a2c 6.8px 8.2px, #fff 8.2px)",
  };
}

function Dots({ n }: { n: number }) {
  if (n === 1) return <span style={gridWrap("1fr / 1fr")}><i style={bigPipStyle()} /></span>;
  const grid = DOT_GRID[n];
  const colors = DOT_COLORS[n] ?? [];
  return (
    <span style={gridWrap(grid.tmpl, grid.rel)}>
      {colors.map((k, i) => {
        const cell = grid.cells?.[i];
        const base = pipStyle(k);
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

function Bird() {
  // concept bird; scale(1.25) cancels the grid's 0.8 inset → natural size
  return (
    <span style={{ position: "relative", width: 18, height: 20, transform: "scale(1.25)" }}>
      <i style={{ position: "absolute", bottom: 1, left: 5, width: 8, height: 13, borderRadius: "60% 60% 50% 50% / 70% 70% 42% 42%", background: C.greenDragon, transform: "rotate(-7deg)" }} />
      <i style={{ position: "absolute", top: 0, left: 9, width: 6, height: 6, borderRadius: "50%", background: C.red }} />
      <i style={{ position: "absolute", bottom: 0, left: 0, width: 9, height: 3, borderRadius: 2, background: C.greenDragon, transform: "rotate(28deg)" }} />
    </span>
  );
}

function Bamboo({ n }: { n: number }) {
  if (n === 1) return <span style={gridWrap("1fr / 1fr")}><Bird /></span>;
  const grid = BAM_GRID[n];
  const red = BAM_RED[n] ?? [];
  // Stalk height derived from row count (concept: 15 for 2-row, 11 for 3-row).
  // A single rule by rows — never per-number — so 7/8/9 fit like the rest.
  const h = rowCount(grid.tmpl) === 3 ? 11 : 15;
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

/* ====================== FLOWERS / SEASONS (花季) ========================== */
function Sakura({ tint, label }: { tint: "pink" | "green"; label?: string }) {
  const fill = tint === "pink" ? "#f2a9b0" : "#a9d8bb";
  const stroke = tint === "pink" ? "#d97a86" : "#6fb38c";
  const petal = (rot: number) => <ellipse key={rot} cx={12} cy={6.2} rx={2.9} ry={4.6} transform={`rotate(${rot} 12 12)`} />;
  return (
    <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {label && (
        <span style={{ position: "absolute", top: 3, left: 4, fontWeight: 800, fontSize: 7.5, lineHeight: 1, color: tint === "pink" ? C.red : C.greenDragon }}>{label}</span>
      )}
      <svg width={25} height={25} viewBox="0.5 0.5 23 23" aria-hidden style={{ display: "block", overflow: "visible" }}>
        <g fill={fill} stroke={stroke} strokeWidth={0.8}>{[0, 72, 144, 216, 288].map(petal)}</g>
        <circle cx={12} cy={12} r={2.3} fill="#ecc84a" stroke="#d9a93a" strokeWidth={0.7} />
      </svg>
    </span>
  );
}

/* ============================== FACE ===================================== */
// Authored in canonical pixels (concept metrics). No size logic lives here.
function Face({ char }: { char: string }): React.ReactElement {
  let i = WAN.indexOf(char);
  if (i >= 0)
    return (
      <span style={{ display: "flex", flexDirection: "column", alignItems: "center", lineHeight: 1 }}>
        <span style={{ color: C.ink, fontWeight: 700, fontSize: 11, marginBottom: 2 }}>{HAN[i]}</span>
        <span style={{ color: C.red, fontWeight: 800, fontSize: 14 }}>萬</span>
      </span>
    );

  i = BAM.indexOf(char);
  if (i >= 0) return <Bamboo n={i + 1} />;

  i = DOT.indexOf(char);
  if (i >= 0) return <Dots n={i + 1} />;

  if (WINDS[char]) return <span style={{ color: C.ink, fontWeight: 800, fontSize: 20, lineHeight: 1 }}>{WINDS[char]}</span>;
  if (char === "🀄") return <span style={{ color: C.red, fontWeight: 800, fontSize: 21, lineHeight: 1 }}>中</span>;
  if (char === "🀅") return <span style={{ color: C.greenDragon, fontWeight: 800, fontSize: 21, lineHeight: 1 }}>發</span>;
  if (char === "🀆")
    return <span style={{ width: 19, height: 21, border: `2.5px solid ${C.blue}`, borderRadius: 3, boxShadow: `inset 0 0 0 1.5px #fff, inset 0 0 0 2.5px ${C.blue}` }} />;

  i = FLOWERS.indexOf(char);
  if (i >= 0) return <Sakura tint="pink" label={String(i + 1)} />;
  i = SEASONS.indexOf(char);
  if (i >= 0) return <Sakura tint="green" label={String(i + 1)} />;

  if (char === "🀪") return <span style={{ color: C.gold, fontWeight: 800, fontSize: 17, lineHeight: 1 }}>★</span>; // joker
  if (char === "🀫")
    return <span style={{ width: 18, height: 24, borderRadius: 3, background: "repeating-linear-gradient(45deg,#2f6f57 0 3px,#256048 3px 6px)" }} />; // back

  return <span style={{ color: C.ink, fontWeight: 800, fontSize: 18 }}>{char}</span>;
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
  const scale = faceScale(b);
  return (
    <span
      className={className}
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flex: "0 0 auto",
        width: b.w,
        height: b.h,
        background: C.paper,
        border: `1px solid ${C.edge}`,
        borderBottom: `${b.bb}px solid ${C.edgeBottom}`,
        borderRadius: 7,
        boxShadow: "0 2px 5px rgba(40,35,20,.12)",
        overflow: "hidden",
        fontFamily: "'Mulish', system-ui, sans-serif",
        cursor: onClick ? "pointer" : undefined,
        userSelect: "none",
      }}
    >
      {/* The single canonical area, mapped 1:1 onto this tile's content box. */}
      <span
        style={{
          position: "relative",
          width: FACE_W,
          height: FACE_H,
          flex: "0 0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${scale})`,
          transformOrigin: "center",
        }}
      >
        <Face char={char} />
      </span>
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
