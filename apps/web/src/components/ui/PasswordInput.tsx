import { forwardRef, useState, type ComponentProps } from "react"
import { Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"

type PasswordInputProps = Omit<ComponentProps<"input">, "type">

/** Input Tailwind con el ojito para mostrar/ocultar la contraseña, como la mayoría de apps hoy en día. Espejo de PasswordFormControl.tsx para las páginas que usan Tailwind en vez de react-bootstrap. */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(function PasswordInput(
  { className, ...props },
  ref
) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="relative">
      <input
        ref={ref}
        type={isVisible ? "text" : "password"}
        className={cn(
          "w-full rounded-lg border border-input bg-background px-3 py-2 pr-10 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
          className
        )}
        {...props}
      />
      <button
        type="button"
        onClick={() => setIsVisible((v) => !v)}
        aria-label={isVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
        className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground hover:text-foreground"
      >
        {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  )
})
