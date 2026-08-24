import * as React from "react"
import { Badge } from "react-bootstrap"
import { cn } from "@/lib/utils"

export type SankBadgeVariant = "orange" | "neutral" | "success" | "warning" | "danger" | "outline"

const VARIANT_CLASS: Record<SankBadgeVariant, string> = {
  orange: "text-bg-primary",
  neutral: "bg-secondary-subtle text-body",
  success: "text-bg-success",
  warning: "text-bg-warning",
  danger: "text-bg-danger",
  outline: "border border-secondary-subtle text-body-secondary bg-transparent",
}

interface SankBadgeProps extends React.ComponentProps<typeof Badge> {
  variant?: SankBadgeVariant
  icon?: React.ReactNode
}

export function SankBadge({ variant = "neutral", icon, className, children, ...props }: SankBadgeProps) {
  return (
    <Badge
      pill
      bg=""
      className={cn(
        "d-inline-flex align-items-center gap-1 fw-semibold py-1 px-2",
        VARIANT_CLASS[variant],
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </Badge>
  )
}
