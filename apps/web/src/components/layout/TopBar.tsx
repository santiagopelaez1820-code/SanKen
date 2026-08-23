import { Bell } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { useAuthStore } from "@/lib/auth-store"
import { useFeed } from "@/hooks/use-feed"
import { buildNavSections, findNavLabel } from "@/components/layout/nav-config"

/** Barra superior persistente — reemplaza el header mobile-only anterior. Vive en desktop y mobile. */
export function TopBar() {
  const user = useAuthStore((state) => state.user)
  const location = useLocation()
  const { unreadCount: feedUnread } = useFeed()

  const sections = buildNavSections(user)
  const title = findNavLabel(sections, location.pathname)
  const initial = user?.name?.trim()?.[0]?.toUpperCase() ?? "?"

  return (
    <header
      className="d-flex align-items-center justify-content-between px-3 px-lg-4"
      style={{ height: 60, borderBottom: "1px solid var(--bs-border-color)", background: "var(--sanken-black)" }}
    >
      <div className="d-flex align-items-center gap-2 d-lg-none">
        <img src="/logo.png" alt="" width={22} height={22} />
        <span className="fw-bold" style={{ fontFamily: "var(--bs-body-font-family)", letterSpacing: "-0.01em" }}>
          SANKEN
        </span>
      </div>
      <span className="d-none d-lg-block sank-eyebrow mb-0">{title}</span>

      <div className="d-flex align-items-center gap-2">
        <Link
          to="/feed"
          className="position-relative d-flex align-items-center justify-content-center rounded-1"
          style={{ width: 36, height: 36, color: "var(--sanken-gray-light)" }}
          aria-label="Novedades"
        >
          <Bell size={18} />
          {feedUnread > 0 && (
            <span
              className="position-absolute rounded-circle"
              style={{ top: 6, right: 6, width: 7, height: 7, background: "var(--sanken-orange)" }}
            />
          )}
        </Link>
        <Link
          to="/settings"
          className="d-flex align-items-center justify-content-center fw-bold"
          style={{
            width: 34,
            height: 34,
            borderRadius: "var(--bs-border-radius-sm)",
            background: "var(--sanken-orange-dim)",
            color: "var(--sanken-orange-light)",
            fontSize: "0.8rem",
          }}
          aria-label="Perfil"
        >
          {initial}
        </Link>
      </div>
    </header>
  )
}
