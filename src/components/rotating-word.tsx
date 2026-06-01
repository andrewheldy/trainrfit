import { useEffect, useState } from "react";

export function RotatingWord({
  words,
  className = "",
  intervalMs = 2000,
}: {
  words: string[];
  className?: string;
  intervalMs?: number;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % words.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [words.length, intervalMs]);

  return (
    <span className={`relative inline-block overflow-hidden align-bottom ${className}`}>
      <span
        key={index}
        className="inline-block"
        style={{ animation: "slide-down-in 0.5s ease-out" }}
      >
        {words[index]}
      </span>
    </span>
  );
}
