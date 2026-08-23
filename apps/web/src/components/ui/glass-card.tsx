import * as React from "react"
import { cn } from "@/lib/utils"

interface GlassCardProps extends React.ComponentProps<"div"> {
  /** Tinte del borde/glow — reservado para superficies de énfasis (hero, CTA), no para cards comunes */
  tone?: "lime" | "cyan" | "neutral"
}

const TONE_BORDER: Record<NonNullable<GlassCardProps["tone"]>, string> = {
  lime: "border-primary/20",
  cyan: "border-secondary-accent/20",
  neutral: "border-white/10",
}

function GlassCard({ className, tone = "neutral", ...props }: GlassCardProps) {
  return (
    <div
      data-slot="glass-card"
      className={cn(
        "rounded-2xl border bg-card/60 p-5 backdrop-blur-md",
        TONE_BORDER[tone],
        className
      )}
      {...props}
    />
  )
}

export { GlassCard }
