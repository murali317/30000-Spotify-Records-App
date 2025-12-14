// Utility to highlight matching text in a string for search/filter highlighting
import React from "react";

export function highlightMatch(text: string, search: string) {
  if (!search) return text;
  const regex = new RegExp(
    `(${search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
    "gi"
  );
  const parts = String(text).split(regex);
  return parts.map((part, i) =>
    regex.test(part)
      ? React.createElement(
          "span",
          { key: i, className: "bg-yellow-200 text-black rounded" },
          part
        )
      : part
  );
}
