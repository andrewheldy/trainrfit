import { cn } from "@/lib/utils";
import logo from "@/assets/trainr-logo.png";

export function TrainrWordmark({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "h-5",
    md: "h-6",
    lg: "h-9",
  };
  return (
    <img
      src={logo}
      alt="trainr"
      className={cn("w-auto select-none", sizes[size], className)}
      draggable={false}
    />
  );
}
