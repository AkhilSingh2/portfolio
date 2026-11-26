"use client";

import { useState } from "react";

export function Swatch({
  name,
  variable,
  role,
  onSelect,
}: {
  name: string;
  variable: string;
  role: string;
  onSelect?: () => void;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      className="swatch"
      onClick={() => {
        onSelect?.();
        const value = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
        const text = value ? `${variable}: ${value}` : variable;
        const mark = () => {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 2000);
        };
        const fallback = () => {
          const area = document.createElement("textarea");
          area.value = text;
          area.setAttribute("readonly", "");
          area.style.position = "fixed";
          area.style.left = "-999px";
          document.body.appendChild(area);
          area.select();
          const ok = document.execCommand("copy");
          area.remove();
          if (ok) mark();
        };
        if (navigator.clipboard?.writeText) {
          void navigator.clipboard.writeText(text).then(mark).catch(fallback);
        } else {
          fallback();
        }
      }}
    >
      <span className="swatch-chip" style={{ background: `var(${variable})` }} />
      <span className="swatch-name">{name}</span>
      <span className="swatch-var">{copied ? "Copied" : variable}</span>
      <span className="swatch-role">{role}</span>
    </button>
  );
}
