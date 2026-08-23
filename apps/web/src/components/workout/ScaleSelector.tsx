interface ScaleSelectorProps {
  label: string
  value: number | null
  onChange: (value: number) => void
  max?: number
}

export function ScaleSelector({ label, value, onChange, max = 5 }: ScaleSelectorProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <div className="flex gap-2">
        {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            aria-pressed={value === n}
            className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm font-medium transition-colors ${
              value === n
                ? "border-primary bg-primary text-primary-foreground"
                : "border-input bg-background text-foreground hover:bg-muted"
            }`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  )
}
