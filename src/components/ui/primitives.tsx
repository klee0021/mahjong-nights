import React from "react";

export const Sparkle = ({ className = "", size = 14 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden className={`text-mj-coral ${className}`}>
    <path d="M12 0c1 6 5 10 12 12-7 2-11 6-12 12-1-6-5-10-12-12C7 10 11 6 12 0z" />
  </svg>
);

export const FretCorners = () => (
  <><span className="fret fret-tl" /><span className="fret fret-tr" /><span className="fret fret-bl" /><span className="fret fret-br" /></>
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

export function Card({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={`bg-mj-card border border-mj-line rounded-2xl overflow-hidden shadow-[0_14px_30px_-24px_rgba(20,18,12,.3)] ${className}`}>{children}</div>;
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
export function Button({ variant = "primary", className = "", ...props }:
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: BtnVariant }) {
  const base = "inline-flex items-center justify-center gap-2 rounded-2xl font-extrabold text-[15px] px-5 py-4 transition disabled:opacity-50";
  const styles: Record<BtnVariant, string> = {
    primary:   "bg-mj-green text-[#f4efe2] shadow-[0_12px_24px_-12px_rgba(24,74,53,.7)] hover:brightness-110",
    danger:    "bg-mj-neg text-[#fdeeec] shadow-[0_12px_24px_-12px_rgba(203,58,44,.7)] hover:brightness-110",
    secondary: "bg-mj-card border border-mj-line text-mj-green hover:bg-mj-paper",
    ghost:     "text-mj-muted hover:text-mj-ink",
  };
  return <button className={`${base} ${styles[variant]} ${className}`} {...props} />;
}
