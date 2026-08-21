import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "bg-primary/15 text-primary",
        accent2: "bg-secondary-accent/15 text-secondary-accent",
        success: "bg-success/15 text-success",
        warning: "bg-warning/15 text-warning",
        error: "bg-destructive/15 text-destructive",
        neutral: "bg-muted text-muted-foreground",
        outline: "border border-border text-foreground",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  }
)

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span data-slot="badge" className={cn(badgeVariants({ variant, className }))} {...props} />
}

export { Badge, badgeVariants }
