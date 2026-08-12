import { cn } from "@/lib/utils";

/**
 * LOUDMOUF™ wordmark — official brand lockup.
 * Uses static CDN asset (not Shopify APIs — image URL only).
 */
const LOGO_URL =
  "https://cdn.shopify.com/s/files/1/0779/5369/5849/files/loudmouf-logo.png";

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
      src={LOGO_URL}
      alt="LOUDMOUF"
      className={cn("w-auto select-none", dims, className)}
      draggable={false}
      width={size === "sm" ? 120 : size === "md" ? 150 : size === "lg" ? 200 : 280}
      height={size === "sm" ? 32 : size === "md" ? 40 : size === "lg" ? 64 : 96}
      style={{ aspectRatio: "auto" }}
      loading="eager"
      decoding="async"
    />
  );
}
