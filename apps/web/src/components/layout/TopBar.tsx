import { Menu } from "lucide-react"
import { Link } from "react-router-dom"
import { Navbar } from "react-bootstrap"

interface TopBarProps {
  onMenuClick: () => void
}

export function TopBar({ onMenuClick }: TopBarProps) {
  return (
    <Navbar
      className="d-lg-none border-bottom px-3 py-2"
      style={{ background: "var(--sanken-black-2)", borderColor: "var(--bs-border-color)" }}
    >
      <Link to="/dashboard" className="navbar-brand d-flex align-items-center gap-2 text-white mb-0">
        <img src="/logo.png" alt="" width={28} height={28} />
        <span className="fw-bold" style={{ letterSpacing: "-0.01em" }}>
          SANKEN
        </span>
      </Link>
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Abrir menú"
        className="btn btn-outline-secondary border-0 d-flex align-items-center justify-content-center p-0 ms-auto"
        style={{ width: 36, height: 36 }}
      >
        <Menu size={20} />
      </button>
    </Navbar>
  )
}
