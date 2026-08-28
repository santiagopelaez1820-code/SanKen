import { Link, useLocation } from "react-router-dom"
import { LogOut, Settings } from "lucide-react"
import { useAuthStore } from "@/lib/auth-store"
import { useFeed } from "@/hooks/use-feed"
import { useChatUnread } from "@/hooks/use-chat-unread"
import { useLogout } from "@/hooks/use-logout"
import { buildNavSections } from "@/components/layout/nav-config"
import { cn } from "@/lib/utils"

/** Carril de navegación de escritorio: solo iconos + tooltip, no un sidebar con etiquetas. */
export function IconRail() {
  const user = useAuthStore((state) => state.user)
  const location = useLocation()
  const handleLogout = useLogout()
  const { unreadCount: feedUnread } = useFeed()
  const chatUnread = useChatUnread()

  const sections = buildNavSections(user)
  const badgeCounts = { feed: feedUnread, chat: chatUnread }
  const isActive = (path: string) => location.pathname === path

  return (
    <aside className="sank-rail d-none d-lg-flex flex-column align-items-center flex-shrink-0 vh-100" style={{ position: "sticky", top: 0 }}>
      <Link to="/dashboard" className="d-flex align-items-center justify-content-center py-3">
        <img src="/logo.png" alt="SanKen" width={28} height={28} />
      </Link>

      <nav className="d-flex flex-column align-items-center gap-1 flex-grow-1 overflow-y-auto py-2" style={{ minHeight: 0, width: "100%" }}>
        {sections.map((section, sIdx) => (
          <div key={section.title} className="d-flex flex-column align-items-center gap-1">
            {sIdx > 0 && <div className="my-2" style={{ width: 28, height: 1, background: "var(--bs-border-color)" }} />}
            {section.items.map((item) => {
              const active = isActive(item.path)
              const badgeCount = item.badge ? badgeCounts[item.badge] : 0
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn("sank-rail-link position-relative", active && "sank-rail-link-active")}
                  aria-label={item.label}
                >
                  <item.icon size={19} strokeWidth={2} />
                  {badgeCount > 0 && (
                    <span
                      className="position-absolute rounded-circle"
                      style={{ top: 4, right: 4, width: 7, height: 7, background: active ? "var(--sanken-black)" : "var(--sanken-cyan)" }}
                    />
                  )}
                  <span className="sank-rail-tooltip">{item.label}</span>
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      <div className="d-flex flex-column align-items-center gap-1 py-3">
        <Link to="/settings" className={cn("sank-rail-link", isActive("/settings") && "sank-rail-link-active")} aria-label="Configuración">
          <Settings size={19} />
          <span className="sank-rail-tooltip">Configuración</span>
        </Link>
        <button type="button" onClick={handleLogout} className="sank-rail-link border-0 bg-transparent" aria-label="Cerrar sesión">
          <LogOut size={19} />
          <span className="sank-rail-tooltip">Cerrar sesión</span>
        </button>
      </div>
    </aside>
  )
}
