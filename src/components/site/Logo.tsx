import { cn } from "@/lib/utils";
import logoAsset from "@/assets/loudmouf-logo.png.asset.json";

/**
 * LOUDMOUF™ wordmark — official brand lockup.
 */
export function Logo({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  /** kept for API compat with legacy call sites */
  tone?: "white" | "gradient" | "black";
}) {
  const dims = {
    sm: "h-8",
    md: "h-10",
    lg: "h-16",
    xl: "h-24",
  }[size];

  return (
    <img
      src={logoAsset.url}
      alt="LOUDMOUF"
      className={cn("w-auto select-none", dims, className)}
      draggable={false}
    />
  );
}
