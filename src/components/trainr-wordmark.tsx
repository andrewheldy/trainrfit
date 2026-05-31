import { cn } from "@/lib/utils";

export function TrainrWordmark({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-2xl",
  };
  return (
    <span
      className={cn(
        "font-display font-bold tracking-tight text-foreground lowercase",
        sizes[size],
        className,
      )}
    >
      train<span className="text-lime">r</span>
    </span>
  );
}
