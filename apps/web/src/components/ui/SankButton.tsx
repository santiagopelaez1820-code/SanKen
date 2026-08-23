import * as React from "react"
import { Button as BsButton, Spinner } from "react-bootstrap"
import { cn } from "@/lib/utils"

export type SankButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive"
  | "link"

export type SankButtonSize = "sm" | "default" | "lg" | "icon"

const VARIANT_MAP: Record<SankButtonVariant, string> = {
  primary: "primary",
  secondary: "secondary",
  outline: "outline-primary",
  ghost: "outline-secondary",
  destructive: "danger",
  link: "link",
}

const SIZE_CLASS: Record<SankButtonSize, string> = {
  sm: "px-3 py-1",
  default: "",
  lg: "px-4 py-2 fs-6",
  icon: "d-inline-flex align-items-center justify-content-center p-0",
}

interface SankButtonProps extends Omit<React.ComponentProps<typeof BsButton>, "variant" | "size"> {
  variant?: SankButtonVariant
  size?: SankButtonSize
  loading?: boolean
  iconStart?: React.ReactNode
  iconEnd?: React.ReactNode
}

export function SankButton({
  variant = "primary",
  size = "default",
  loading = false,
  iconStart,
  iconEnd,
  className,
  disabled,
  children,
  style,
  ...props
}: SankButtonProps) {
  const isIcon = size === "icon"
  return (
    <BsButton
      variant={VARIANT_MAP[variant]}
      size={size === "sm" ? "sm" : size === "lg" ? "lg" : undefined}
      disabled={disabled || loading}
      className={cn(
        "d-inline-flex align-items-center gap-2 fw-semibold",
        variant === "ghost" && "border-0 bg-transparent",
        SIZE_CLASS[size],
        className
      )}
      style={isIcon ? { width: "2.25rem", height: "2.25rem", ...style } : style}
      {...props}
    >
      {loading ? (
        <Spinner animation="border" size="sm" role="status" aria-hidden="true" />
      ) : (
        iconStart
      )}
      {!isIcon && children}
      {isIcon && !loading ? children : null}
      {!loading && !isIcon ? iconEnd : null}
    </BsButton>
  )
}
