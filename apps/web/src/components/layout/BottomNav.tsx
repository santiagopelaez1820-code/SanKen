import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { BarChart3, Flag, LayoutDashboard, Menu, ShoppingBag } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCartStore } from "@/lib/cart-store"
import { MoreSheet } from "@/components/layout/MoreSheet"

const TABS = [
  { label: "Inicio", path: "/dashboard", icon: LayoutDashboard },
  { label: "Progreso", path: "/progress", icon: BarChart3 },
] as const

const TABS_RIGHT = [
  { label: "Retos", path: "/challenges", icon: Flag },
] as const

/** Navegación primaria de mobile: 4 tabs + FAB central, reemplaza el patrón hamburguesa+drawer. */
export function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const [moreOpen, setMoreOpen] = useState(false)
  const itemCount = useCartStore((s) => s.getItemCount())

  const isActive = (path: string) => location.pathname === path

  return (
    <>
      <nav className="sank-bottom-nav d-lg-none">
        {TABS.map((tab) => (
          <Link key={tab.path} to={tab.path} className={cn("sank-bottom-nav-link", isActive(tab.path) && "sank-bottom-nav-link-active")}>
            <tab.icon size={20} strokeWidth={isActive(tab.path) ? 2.4 : 2} />
            {tab.label}
          </Link>
        ))}

        <div className="d-flex align-items-center justify-content-center position-relative" style={{ flex: 1 }}>
          <button
            type="button"
            className="sank-bottom-nav-fab"
            onClick={() => navigate("/store")}
            aria-label="Tienda SanKen"
          >
            <ShoppingBag size={22} strokeWidth={2.3} />
          </button>
          {itemCount > 0 && (
            <span
              className="position-absolute d-flex align-items-center justify-content-center rounded-circle fw-bold"
              style={{
                top: -2,
                right: "calc(50% - 26px)",
                minWidth: 18,
                height: 18,
                fontSize: 10,
                background: "var(--bs-danger)",
                color: "#fff",
                padding: "0 4px",
              }}
            >
              {itemCount > 9 ? "9+" : itemCount}
            </span>
          )}
        </div>

        {TABS_RIGHT.map((tab) => (
          <Link key={tab.path} to={tab.path} className={cn("sank-bottom-nav-link", isActive(tab.path) && "sank-bottom-nav-link-active")}>
            <tab.icon size={20} strokeWidth={isActive(tab.path) ? 2.4 : 2} />
            {tab.label}
          </Link>
        ))}

        <button type="button" className="sank-bottom-nav-link border-0 bg-transparent" onClick={() => setMoreOpen(true)}>
          <Menu size={20} />
          Más
        </button>
      </nav>

      <MoreSheet open={moreOpen} onClose={() => setMoreOpen(false)} />
    </>
  )
}
