import { Menu } from "lucide-react"
import { Link } from "react-router-dom"

interface TopBarProps {
  onMenuClick: () => void
}

export function TopBar({ onMenuClick }: TopBarProps) {
  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3 lg:hidden">
      <Link to="/dashboard" className="flex items-center gap-2">
        <img src="/logo.png" alt="" className="h-7 w-7" />
        <span className="font-heading text-base font-bold tracking-tight text-foreground">SANKEN</span>
      </Link>
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Abrir menú"
        className="flex size-9 items-center justify-center rounded-lg text-foreground hover:bg-muted"
      >
        <Menu className="size-5" />
      </button>
    </header>
  )
}
