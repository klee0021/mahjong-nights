"use client";

import { useRef, useState } from "react";
import { ClickableCard } from "./primitives";

type Props = {
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
};

export function BouncyCard({
  onClick,
  className = "",
  children,
}: Props) {
  const [pressed, setPressed] =
    useState(false);

  const startX =
    useRef<number | null>(null);

  const startY =
    useRef<number | null>(null);

  const timer =
    useRef<NodeJS.Timeout | null>(null);

  function clearPress() {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }

    setPressed(false);
  }

  return (
  <div
    className={`h-full transition-transform duration-100 ${
      pressed
        ? "scale-[0.985]"
        : ""
    }`}
      onClick={onClick}
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
      onMouseUp={() =>
        setPressed(false)
      }
      onMouseLeave={() =>
        setPressed(false)
      }
    >
      <ClickableCard className={className}>
        {children}
      </ClickableCard>
    </div>
  );
}