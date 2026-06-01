import { useEffect, useState } from "react";

export function RotatingWord({
  words,
  className = "",
  intervalMs = 2000,
  reserveWord,
}: {
  words: string[];
  className?: string;
  intervalMs?: number;
  /** Word used to reserve layout space (width/height). Defaults to the longest word. */
  reserveWord?: string;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % words.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [words.length, intervalMs]);

  const reference =
    reserveWord ?? words.reduce((a, b) => (b.length > a.length ? b : a), "");

  return (
    <span className="relative inline-block whitespace-nowrap align-bottom text-left">
      {/* Invisible sizer locks width + height to the longest word */}
      <span aria-hidden className={`invisible ${className}`}>
        {reference}
      </span>
      {/* Animated word is absolutely positioned inside the reserved box */}
      <span
        key={index}
        className={`absolute inset-0 ${className}`}
        style={{ animation: "slide-down-in 0.5s ease-out" }}
      >
        {words[index]}
      </span>
    </span>
  );
}
