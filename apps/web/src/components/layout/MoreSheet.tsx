import { Offcanvas } from "react-bootstrap"
import { LogOut, Settings } from "lucide-react"
import { Link } from "react-router-dom"
import { useAuthStore } from "@/lib/auth-store"
import { useFeed } from "@/hooks/use-feed"
import { useChatUnread } from "@/hooks/use-chat-unread"
import { useLogout } from "@/hooks/use-logout"
import { NavSections } from "@/components/layout/NavSections"

interface MoreSheetProps {
  open: boolean
  onClose: () => void
}

/** Hoja inferior con todo lo que no entra en la bottom nav — mismo patrón que la app mobile nativa. */
export function MoreSheet({ open, onClose }: MoreSheetProps) {
  const user = useAuthStore((state) => state.user)
  const logout = useLogout()
  const { unreadCount: feedUnread } = useFeed()
  const chatUnread = useChatUnread()

  const handleLogout = () => {
    logout()
    onClose()
  }

  return (
    <Offcanvas show={open} onHide={onClose} placement="bottom" className="d-lg-none" style={{ height: "80vh", borderTopLeftRadius: "1rem", borderTopRightRadius: "1rem" }}>
      <Offcanvas.Header closeButton closeVariant="white" className="pb-2">
        <Offcanvas.Title className="fw-bold fs-6">Más</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className="pt-0">
        <NavSections user={user} badgeCounts={{ feed: feedUnread, chat: chatUnread }} onNavigate={onClose} />
        <div className="d-flex flex-column gap-1 border-top pt-3 mt-2" style={{ borderColor: "var(--bs-border-color)" }}>
          <Link to="/settings" onClick={onClose} className="sank-nav-link d-flex align-items-center gap-2 rounded-1 px-3 py-2 fw-medium text-decoration-none">
            <Settings size={16} />
            Configuración
          </Link>
          <button type="button" onClick={handleLogout} className="sank-nav-link d-flex align-items-center gap-2 rounded-1 px-3 py-2 fw-medium text-start border-0 bg-transparent">
            <LogOut size={16} />
            Cerrar sesión
          </button>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  )
}
