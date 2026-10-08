// Esta línea sirve para importar «Offcanvas» desde «react-bootstrap».
import { Offcanvas } from "react-bootstrap"
// Esta línea sirve para importar «LogOut, Settings» desde «lucide-react».
import { LogOut, Settings } from "lucide-react"
// Esta línea sirve para importar «Link» desde «react-router-dom».
import { Link } from "react-router-dom"
// Esta línea sirve para importar «useAuthStore» desde «@/lib/auth-store».
import { useAuthStore } from "@/lib/auth-store"
// Esta línea sirve para importar «useFeed» desde «@/hooks/use-feed».
import { useFeed } from "@/hooks/use-feed"
// Esta línea sirve para importar «useChatUnread» desde «@/hooks/use-chat-unread».
import { useChatUnread } from "@/hooks/use-chat-unread"
// Esta línea sirve para importar «useLogout» desde «@/hooks/use-logout».
import { useLogout } from "@/hooks/use-logout"
// Esta línea sirve para importar «NavSections» desde «@/components/layout/NavSections».
import { NavSections } from "@/components/layout/NavSections"

// Esta línea sirve para declarar la interfaz «MoreSheetProps».
interface MoreSheetProps {
  // Esta línea sirve para declarar la propiedad «open» con el valor o tipo «boolean».
  open: boolean
  // Esta línea sirve para declarar la propiedad «onClose» con el valor o tipo «() => void».
  onClose: () => void
}

/** Hoja inferior con todo lo que no entra en la bottom nav — mismo patrón que la app mobile nativa. */
// Esta línea sirve para declarar el componente del panel «Más» de la navegación móvil.
export function MoreSheet({ open, onClose }: MoreSheetProps) {
  // Esta línea sirve para obtener «user» con el hook «useAuthStore».
  const user = useAuthStore((state) => state.user)
  // Esta línea sirve para obtener «logout» con el hook «useLogout».
  const logout = useLogout()
  // Esta línea sirve para obtener «unreadCount: feedUnread» con el hook «useFeed».
  const { unreadCount: feedUnread } = useFeed()
  // Esta línea sirve para obtener «chatUnread» con el hook «useChatUnread».
  const chatUnread = useChatUnread()

  // Esta línea sirve para declarar la función que cierra la sesión.
  const handleLogout = () => {
    // Esta línea sirve para cerrar la sesión del usuario.
    logout()
    // Esta línea sirve para cerrar el panel.
    onClose()
  }

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «Offcanvas».
    <Offcanvas show={open} onHide={onClose} placement="bottom" className="d-lg-none" style={{ height: "80vh", borderTopLeftRadius: "1rem", borderTopRightRadius: "1rem" }}>
      {/* Esta línea sirve para abrir el componente «Offcanvas.Header». */}
      <Offcanvas.Header closeButton closeVariant="white" className="pb-2">
        {/* Esta línea sirve para mostrar el título del panel. */}
        <Offcanvas.Title className="fw-bold fs-6">Más</Offcanvas.Title>
      </Offcanvas.Header>
      {/* Esta línea sirve para abrir el componente «Offcanvas.Body». */}
      <Offcanvas.Body className="pt-0">
        {/* Esta línea sirve para abrir el componente «NavSections». */}
        <NavSections user={user} badgeCounts={{ feed: feedUnread, chat: chatUnread }} onNavigate={onClose} />
        {/* Esta línea sirve para abrir el elemento «div» con las clases «d-flex flex-column gap-1 border-top pt-3». */}
        <div className="d-flex flex-column gap-1 border-top pt-3 mt-2" style={{ borderColor: "var(--bs-border-color)" }}>
          {/* Esta línea sirve para abrir el componente «Link». */}
          <Link to="/settings" onClick={onClose} className="sank-nav-link d-flex align-items-center gap-2 rounded-1 px-3 py-2 fw-medium text-decoration-none">
            {/* Esta línea sirve para abrir el componente «Settings». */}
            <Settings size={16} />
            {/* Esta línea sirve para mostrar el texto «Configuración». */}
            Configuración
          </Link>
          {/* Esta línea sirve para abrir el elemento «button». */}
          <button type="button" onClick={handleLogout} className="sank-nav-link d-flex align-items-center gap-2 rounded-1 px-3 py-2 fw-medium text-start border-0 bg-transparent">
            {/* Esta línea sirve para abrir el componente «LogOut». */}
            <LogOut size={16} />
            {/* Esta línea sirve para mostrar el texto «Cerrar sesión». */}
            Cerrar sesión
          </button>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  )
}
