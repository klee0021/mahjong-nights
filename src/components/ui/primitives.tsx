import React from "react";

/* ===========================================================================
   iOS-Safari hardening, shared.
   `TAP` is the base class every <button> must carry: `appearance-none` lets
   Safari lay out button children with flex/grid (its native button box
   otherwise re-centres them — the "Step 1 looks different on iPhone" bug);
   `touch-action: manipulation` kills the 300ms delay / double-tap zoom.
   =========================================================================== */
export const TAP = "appearance-none box-border select-none [touch-action:manipulation]";

export const Sparkle = ({ className = "", size = 14 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden className={`pointer-events-none text-mj-coral ${className}`}>
    <path d="M12 0c1 6 5 10 12 12-7 2-11 6-12 12-1-6-5-10-12-12C7 10 11 6 12 0z" />
  </svg>
);

/** Decorative fret-corner ornaments. Non-interactive → pointer-events-none. */
export const FretCorners = () => (
  <>
    <span aria-hidden className="fret fret-tl pointer-events-none" />
    <span aria-hidden className="fret fret-tr pointer-events-none" />
    <span aria-hidden className="fret fret-bl pointer-events-none" />
    <span aria-hidden className="fret fret-br pointer-events-none" />
  </>
);

export const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="text-[11px] font-extrabold uppercase tracking-[0.13em] text-mj-gold">{children}</div>
);

export function Medal({ rank }: { rank: number }) {
  const tone = rank === 1 ? "medal-gold" : rank === 2 ? "medal-silver" : rank === 3 ? "medal-bronze" : "medal-plain";
  return <span className={`medal ${tone}`}>{rank}</span>;
}

export function ScoreValue({ value, className = "" }: { value: number; className?: string }) {
  const color = value > 0 ? "text-mj-pos" : value < 0 ? "text-mj-neg" : "text-mj-muted";
  const text = value > 0 ? `+${value}` : value < 0 ? `−${Math.abs(value)}` : "0";
  return <span className={`font-display font-bold ${color} ${className}`}>{text}</span>;
}

export function Card({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`bg-mj-card border border-mj-line rounded-2xl overflow-hidden shadow-[0_14px_30px_-24px_rgba(20,18,12,.3)] ${className}`}
    >
      {children}
    </div>
  );
}
export function ClickableCard({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`bg-mj-card border border-mj-line rounded-2xl overflow-hidden shadow-[0_14px_30px_-24px_rgba(20,18,12,.3)] ${className}`}
    >
      {children}
    </div>
  );
}

/** Forest-green panel header with fret-corner ornaments. */
export function PanelHeader({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative bg-mj-green px-4 py-3 text-center ${className}`}>
      <FretCorners />
      <span className="font-display font-bold text-[15px] uppercase tracking-[0.06em] text-[#f4efe2]">{children}</span>
    </div>
  );
}

type BtnVariant = "primary" | "danger" | "secondary" | "ghost";
export function Button({ variant = "primary", className = "", type = "button", ...props }:
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: BtnVariant }) {
  const base = `${TAP} inline-flex items-center justify-center gap-2 rounded-2xl font-extrabold text-[15px] px-5 py-4 disabled:opacity-50`;
  const styles: Record<BtnVariant, string> = {
  primary:   "bg-mj-green text-[#f4efe2] shadow-[0_12px_24px_-12px_rgba(24,74,53,.7)]",
  danger:    "bg-mj-neg text-[#fdeeec] shadow-[0_12px_24px_-12px_rgba(203,58,44,.7)]",
  secondary: "bg-mj-card border border-mj-line text-mj-green",
  ghost:     "bg-transparent text-mj-muted",
};
  return <button type={type} className={`${base} ${styles[variant]} ${className}`} {...props} />;
}

/* ---------------------------------------------------------------------------
   Reusable tap targets (Safari-safe). Variant colours / padding / radius are
   passed via `className` so each screen stays pixel-identical to the concept.
   --------------------------------------------------------------------------- */

/** Full-width selectable row (player select, hand-builder meld row, …).
 *  Base guarantees the Safari-critical bits; caller supplies gap/padding/border/bg. */
export function OptionButton({ onClick, className = "", disabled, children }:
  { onClick?: () => void; className?: string; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={`${TAP} flex w-full items-center text-left ${className}`}>
      {children}
    </button>
  );
}

/** Segmented toggle / chip (self-draw, concealed/exposed, …).
 *  Bakes the active/inactive colours; caller supplies radius/padding/text size. */
export function SegButton({ active = false, onClick, className = "", children }:
  { active?: boolean; onClick?: () => void; className?: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`${TAP} font-bold ${active ? "border-[1.5px] border-mj-green bg-mj-greensoft text-mj-green" : "border border-mj-line bg-white text-mj-muted"} ${className}`}
    >
      {children}
    </button>
  );
}

/** Fixed-size indicator (checkbox square / radio circle). Flexbox-centered,
 *  never grid place-items-center; shrink-0 stops Safari squashing it. */
export function Indicator({ className = "", children }: { className?: string; children?: React.ReactNode }) {
  return <span className={`inline-flex shrink-0 items-center justify-center ${className}`}>{children}</span>;
}
