import { cn } from "@/lib/utils";

// Import logo from public folder for production, handle both dev and prod
const logoSrc = typeof window !== 'undefined' 
  ? "/loudmouf-logo.png"
  : "/loudmouf-logo.png";

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
      src={logoSrc}
      alt="LOUDMOUF"
      className={cn("w-auto select-none", dims, className)}
      draggable={false}
    />
  );
}
