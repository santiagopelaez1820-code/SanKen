import { Offcanvas } from "react-bootstrap"
import { LogOut, Settings } from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuthStore } from "@/lib/auth-store"
import { useFeed } from "@/hooks/use-feed"
import { useChatUnread } from "@/hooks/use-chat-unread"
import { NavSections } from "@/components/layout/NavSections"
import { cn } from "@/lib/utils"

interface MobileNavDrawerProps {
  open: boolean
  onClose: () => void
}

export function MobileNavDrawer({ open, onClose }: MobileNavDrawerProps) {
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
    onClose()
    navigate("/login")
  }

  return (
    <Offcanvas show={open} onHide={onClose} placement="start" className="d-lg-none" style={{ width: 280 }}>
      <Offcanvas.Header closeButton closeVariant="white" className="pb-2">
        <Offcanvas.Title className="fw-bold fs-5">SANKEN</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className="d-flex flex-column pt-0">
        <nav className="flex-grow-1">
          <NavSections user={user} badgeCounts={badgeCounts} onNavigate={onClose} />
        </nav>
        <div className="d-flex flex-column gap-1 border-top pt-3 mt-2" style={{ borderColor: "var(--bs-border-color)" }}>
          <Link
            to="/settings"
            onClick={onClose}
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
      </Offcanvas.Body>
    </Offcanvas>
  )
}
