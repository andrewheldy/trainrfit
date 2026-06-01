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
    <span
      key={index}
      className={`inline-block animate-fade-in ${className}`}
    >
      {words[index]}
    </span>
  );
}
