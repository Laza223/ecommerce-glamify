// components/ui/skeleton.tsx
import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  animation?: "pulse" | "wave" | "none";
  width?: number | string;
  height?: number | string;
}

export function Skeleton({
  className,
  variant = "rectangular",
  animation = "pulse",
  width,
  height,
}: SkeletonProps) {
  const baseClasses = "bg-gray-200";

  const animationClasses = {
    pulse: "animate-pulse",
    wave: "animate-shimmer",
    none: "",
  };

  const variantClasses = {
    text: "rounded",
    circular: "rounded-full",
    rectangular: "rounded-lg",
  };

  const style: React.CSSProperties = {
    width: width
      ? typeof width === "number"
        ? `${width}px`
        : width
      : undefined,
    height: height
      ? typeof height === "number"
        ? `${height}px`
        : height
      : undefined,
  };

  return (
    <div
      className={cn(
        baseClasses,
        animationClasses[animation],
        variantClasses[variant],
        className,
      )}
      style={style}
      aria-busy="true"
      aria-live="polite"
    />
  );
}

// Añadir en globals.css:
// @keyframes shimmer {
//   0% {
//     background-position: -200% 0;
//   }
//   100% {
//     background-position: 200% 0;
//   }
// }
//
// .animate-shimmer {
//   animation: shimmer 1.5s infinite;
//   background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
//   background-size: 200% 100%;
// }
