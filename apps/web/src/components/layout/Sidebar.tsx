import { LogOut, Settings } from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuthStore } from "@/lib/auth-store"
import { useFeed } from "@/hooks/use-feed"
import { useChatUnread } from "@/hooks/use-chat-unread"
import { NavSections } from "@/components/layout/NavSections"
import { cn } from "@/lib/utils"

export function Sidebar() {
  const user = useAuthStore((state) => state.user)
  const clearSession = useAuthStore((state) => state.clearSession)
  const location = useLocation()
  const navigate = useNavigate()
  const { unreadCount: feedUnread } = useFeed()
  const chatUnread = useChatUnread()

  const badgeCounts = { feed: feedUnread, chat: chatUnread }
  const isActive = (path: string) => location.pathname === path

  const handleLogout = () => {
    clearSession()
    navigate("/login")
  }

  return (
    <aside
      className="d-none d-lg-flex flex-column flex-shrink-0 vh-100 border-end"
      style={{ width: 264, borderColor: "var(--bs-border-color)", background: "var(--sanken-black-2)", position: "sticky", top: 0 }}
    >
      <Link to="/dashboard" className="d-flex align-items-center gap-2 px-4 py-4 text-decoration-none">
        <img src="/logo.png" alt="" width={32} height={32} />
        <span className="fw-bold fs-5 text-white" style={{ letterSpacing: "-0.01em" }}>
          SANKEN
        </span>
      </Link>

      <nav
        className="flex-grow-1 overflow-y-auto px-3 pb-3"
        style={{
          minHeight: 0,
          maskImage: "linear-gradient(to bottom, transparent, black 12px, black calc(100% - 12px), transparent)",
        }}
      >
        <NavSections user={user} badgeCounts={badgeCounts} />
      </nav>

      <div className="d-flex flex-column gap-1 border-top px-3 py-3" style={{ borderColor: "var(--bs-border-color)" }}>
        <Link
          to="/settings"
          className={cn(
            "d-flex align-items-center gap-2 rounded-3 px-3 py-2 fw-medium text-decoration-none",
            isActive("/settings") ? "sank-nav-link-active" : "sank-nav-link"
          )}
        >
          <Settings size={16} className="flex-shrink-0" />
          Configuración
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="sank-nav-link d-flex align-items-center gap-2 rounded-3 px-3 py-2 fw-medium text-start border-0 bg-transparent"
        >
          <LogOut size={16} className="flex-shrink-0" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
