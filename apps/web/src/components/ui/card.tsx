import * as React from "react"
import { cn } from "@/lib/utils"

interface CardProps extends React.ComponentProps<"div"> {
  variant?: "default" | "outline" | "flat"
}

function Card({ className, variant = "default", ...props }: CardProps) {
  return (
    <div
      data-slot="card"
      className={cn(
        "rounded-2xl p-5",
        variant === "default" && "border border-border bg-card",
        variant === "outline" && "border border-border bg-transparent",
        variant === "flat" && "bg-card",
        className
      )}
      {...props}
    />
  )
}

export { Card }
