import { cn } from "@/lib/utils";

/**
 * LOUDMOUF wordmark — inspired by the vertical tall-riser lockup.
 * SVG-based so it scales crisply and matches the brand's oversized
 * condensed display letters.
 */
export function Logo({ className, tone = "white" }: { className?: string; tone?: "white" | "gradient" | "black" }) {
  const fill = tone === "black" ? "#0D0D0D" : "#FFFFFF";
  return (
    <span
      className={cn(
        "inline-flex items-baseline font-display uppercase tracking-tight leading-none select-none",
        tone === "gradient" && "text-gradient-loud",
        className,
      )}
      style={tone !== "gradient" ? { color: fill } : undefined}
      aria-label="LOUDMOUF"
    >
      <span className="[font-stretch:condensed]" style={{ letterSpacing: "-0.04em" }}>
        loud
      </span>
      <span className="ml-[-0.15em] rounded-[2px] bg-current px-1 py-[0.05em] text-[0.55em]" style={{ color: "#0D0D0D", background: fill }}>
        <span style={{ color: fill === "#FFFFFF" ? "#0D0D0D" : "#FFFFFF" }}>MOUF</span>
      </span>
    </span>
  );
}
