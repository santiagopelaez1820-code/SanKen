import * as React from "react"
import { cn } from "@/lib/utils"

interface CardProps extends React.ComponentProps<"div"> {
  variant?: "default" | "outline" | "flat" | "elevated"
}

function Card({ className, variant = "default", ...props }: CardProps) {
  return (
    <div
      data-slot="card"
      className={cn(
        "rounded-2xl p-5 transition-[transform,box-shadow,border-color] duration-200",
        variant === "default" && "border border-border bg-card hover:-translate-y-0.5",
        variant === "outline" &&
          "border border-border bg-transparent hover:-translate-y-0.5 hover:border-border/80 hover:bg-card/40",
        variant === "flat" && "bg-card",
        variant === "elevated" &&
          "border border-primary/25 bg-card shadow-[0_1px_2px_rgba(0,0,0,0.3),0_10px_32px_-10px_rgba(0,0,0,0.6),0_0_0_1px_rgba(0,184,217,0.08)] hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_1px_2px_rgba(0,0,0,0.3),0_14px_40px_-8px_rgba(0,0,0,0.65),0_0_28px_-6px_var(--primary)]",
        className
      )}
      {...props}
    />
  )
}

export { Card }
