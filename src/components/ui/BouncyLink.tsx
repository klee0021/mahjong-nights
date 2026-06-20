"use client";

import Link from "next/link";
import { useRef, useState } from "react";

type Props = {
  href: string;
  className?: string;
  children: React.ReactNode;
};

export function BouncyLink({
  href,
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
    <Link
      href={href}
      className={`inline-block transition-transform duration-100 ${
        pressed ? "scale-[0.985]" : ""
      } ${className}`}
      onTouchStart={(e) => {
        const touch = e.touches[0];

        startX.current = touch.clientX;
        startY.current = touch.clientY;

        timer.current = setTimeout(() => {
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
          touch.clientX - startX.current
        );

        const dy = Math.abs(
          touch.clientY - startY.current
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
    >
      {children}
    </Link>
  );
}