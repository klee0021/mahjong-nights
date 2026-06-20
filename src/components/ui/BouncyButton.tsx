"use client";

import { useRef, useState } from "react";
import { TAP } from "./primitives";

type BtnVariant =
  | "primary"
  | "danger"
  | "secondary"
  | "ghost";

type Props =
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: BtnVariant;
  };

export function BouncyButton({
  variant = "primary",
  className = "",
  type = "button",
  children,
  ...props
}: Props) {
  const [pressed, setPressed] =
    useState(false);

  const startX =
    useRef<number | null>(null);

  const startY =
    useRef<number | null>(null);

  const timer =
    useRef<NodeJS.Timeout | null>(
      null
    );

  function clearPress() {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }

    setPressed(false);
  }

  const styles: Record<
    BtnVariant,
    string
  > = {
    primary:
      "bg-mj-green text-[#f4efe2] shadow-[0_12px_24px_-12px_rgba(24,74,53,.7)] hover:brightness-110",
    danger:
      "bg-mj-neg text-[#fdeeec] shadow-[0_12px_24px_-12px_rgba(203,58,44,.7)] hover:brightness-110",
    secondary:
      "bg-mj-card border border-mj-line text-mj-green hover:bg-mj-paper",
    ghost:
      "bg-transparent text-mj-muted hover:text-mj-ink",
  };

  return (
    <button
      type={type}
      className={`${TAP} inline-flex items-center justify-center gap-2 rounded-2xl font-extrabold text-[15px] px-5 py-4 disabled:opacity-50 transition-transform duration-100 ${
        pressed
          ? "scale-[0.985]"
          : ""
      } ${styles[variant]} ${className}`}
      onTouchStart={(e) => {
        const touch = e.touches[0];

        startX.current =
          touch.clientX;

        startY.current =
          touch.clientY;

        timer.current =
          setTimeout(() => {
            setPressed(true);
          }, 60);
      }}
      onTouchMove={(e) => {
        const touch = e.touches[0];

        if (
          startX.current === null ||
          startY.current === null
        ) {
          return;
        }

        const dx = Math.abs(
          touch.clientX -
            startX.current
        );

        const dy = Math.abs(
          touch.clientY -
            startY.current
        );

        if (
          dx > 10 ||
          dy > 10
        ) {
          clearPress();
        }
      }}
      onTouchEnd={clearPress}
      onTouchCancel={clearPress}
      onMouseDown={() =>
        setPressed(true)
      }
      onMouseUp={clearPress}
      onMouseLeave={clearPress}
      {...props}
    >
      {children}
    </button>
  );
}