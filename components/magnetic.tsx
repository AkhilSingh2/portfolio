"use client";

import { useReducedMotion } from "framer-motion";
import { useRef } from "react";

export function Magnetic({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();

  return (
    <span
      ref={ref}
      className={className ? `magnetic ${className}` : "magnetic"}
      onPointerMove={(event) => {
        if (reduce || !ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        ref.current.style.transform = `translate(${x * 0.28}px, ${y * 0.42}px)`;
      }}
      onPointerLeave={() => {
        if (ref.current) ref.current.style.transform = "";
      }}
    >
      {children}
    </span>
  );
}
