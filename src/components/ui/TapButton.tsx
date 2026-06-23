"use client";

import { useRef, useState } from "react";
import { Button, TAP } from "./primitives";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  custom?: boolean;
};

export function TapButton({
  children,
  className = "",
  variant = "primary",
  custom = false,
  ...props
}: Props) {
const [pressed, setPressed] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

 const handlers = {
  onTouchStart: () => {
    timerRef.current = setTimeout(() => {
      setPressed(true);
    }, 50);
  },

  onTouchMove: () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setPressed(false);
  },

  onTouchEnd: () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setPressed(false);
  },

  onTouchCancel: () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setPressed(false);
  },

  onMouseDown: () => {
    setPressed(true);
  },

  onMouseUp: () => {
    setPressed(false);
  },

  onMouseLeave: () => {
    setPressed(false);
  },
};

  return (
    <div
      className={`transition-transform duration-100 ${
        pressed ? "scale-[0.97]" : ""
      }`}
      {...handlers}
    >
      {custom ? (
        <button
          className={`${TAP} ${className}`}
          {...props}
        >
          {children}
        </button>
      ) : (
        <Button
          variant={variant}
          className={className}
          {...props}
        >
          {children}
        </Button>
      )}
    </div>
  );
}