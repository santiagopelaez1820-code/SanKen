import { Bell, LogOut, MoreHorizontal, Moon, Settings, Shield, Sun } from "lucide-react"
import { Dropdown } from "react-bootstrap"
import { Link, useLocation } from "react-router-dom"
import { useAuthStore } from "@/lib/auth-store"
import { useFeed } from "@/hooks/use-feed"
import { useChatUnread } from "@/hooks/use-chat-unread"
import { useLogout } from "@/hooks/use-logout"
import { api } from "@/lib/api"
import { useResolvedTheme } from "@/hooks/use-resolved-theme"
import { useThemeStore } from "@/lib/theme-store"
import {
  buildNavSections,
  findNavLabel,
  getAdminSection,
  getOverflowSections,
  getPrimaryNavItems,
} from "@/components/layout/nav-config"
import { cn } from "@/lib/utils"

/**
 * Toggle rápido claro/oscuro en el header, al lado de la campana de
 * novedades -- a diferencia del selector de Ajustes (Automático/Claro/
 * Oscuro), este es un solo clic entre los dos, como la mayoría de apps: no
 * pasa por "Automático" en cada clic, solo alterna. "Automático" sigue
 * disponible en Ajustes para quien lo prefiera.
 */
function ThemeToggleButton() {
  const setMode = useThemeStore((state) => state.setMode)
  const isDark = useResolvedTheme() === "dark"

  return (
    <button
      type="button"
      onClick={() => setMode(isDark ? "light" : "dark")}
      className="d-flex align-items-center justify-content-center rounded-1 border-0 bg-transparent flex-shrink-0"
      style={{ width: 36, height: 36, color: "var(--sanken-gray-light)" }}
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}

/** Link horizontal de la nav superior de escritorio: icono + nombre, nunca solo icono. */
function TopNavLink({ item, active }: { item: ReturnType<typeof getPrimaryNavItems>[number]; active: boolean }) {
  return (
    <Link
      to={item.path}
      className={cn("sank-topnav-link", active && "sank-topnav-link-active")}
    >
      <item.icon size={16} strokeWidth={active ? 2.4 : 2} className="flex-shrink-0" />
      <span>{item.label}</span>
    </Link>
  )
}

/** Desplegable "Más" / "Administración": agrupa el resto de módulos por sección, con icono + nombre en cada item. */
function TopNavOverflowMenu({
  id,
  label,
  icon: Icon,
  sections,
  active,
  badgeCounts,
  align,
}: {
  id: string
  label: string
  icon: typeof MoreHorizontal
  sections: { title: string; items: ReturnType<typeof getPrimaryNavItems> }[]
  active: boolean
  badgeCounts: { feed: number; chat: number }
  align?: "start" | "end"
}) {
  return (
    <Dropdown align={align} className="flex-shrink-0">
      <Dropdown.Toggle
        as="button"
        id={id}
        type="button"
        className={cn("sank-topnav-link border-0 bg-transparent", active && "sank-topnav-link-active")}
        style={{ boxShadow: "none" }}
      >
        <Icon size={16} strokeWidth={active ? 2.4 : 2} className="flex-shrink-0" />
        <span>{label}</span>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {sections.map((section, idx) => (
          <div key={section.title}>
            {idx > 0 && <Dropdown.Divider />}
            <Dropdown.Header>{section.title}</Dropdown.Header>
            {section.items.map((item) => {
              const badgeCount = item.badge ? badgeCounts[item.badge] : 0
              return (
                <Dropdown.Item as={Link} key={item.path} to={item.path} className="d-flex align-items-center gap-2">
                  <item.icon size={16} className="flex-shrink-0" />
                  <span className="flex-grow-1">{item.label}</span>
                  {badgeCount > 0 && (
                    <span
                      className="d-flex align-items-center justify-content-center rounded-pill fw-bold"
                      style={{
                        minWidth: 18,
                        height: 18,
                        fontSize: "0.65rem",
                        background: "var(--sanken-cyan)",
                        color: "var(--sanken-on-accent)",
                        padding: "0 5px",
                      }}
                    >
                      {badgeCount > 9 ? "9+" : badgeCount}
                    </span>
                  )}
                </Dropdown.Item>
              )
            })}
          </div>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  )
}

/** Menú de cuenta de escritorio (avatar): reemplaza el logout/config que antes vivía en el rail lateral. */
function AccountMenu({ initial, avatarUrl }: { initial: string; avatarUrl: string | null | undefined }) {
  const handleLogout = useLogout()

  return (
    <Dropdown align="end">
      <Dropdown.Toggle
        as="button"
        id="topnav-account-menu"
        type="button"
        className="d-flex align-items-center justify-content-center fw-bold overflow-hidden border-0 flex-shrink-0"
        style={{
          width: 34,
          height: 34,
          borderRadius: "var(--bs-border-radius-sm)",
          background: "var(--sanken-cyan-dim)",
          color: "var(--sanken-cyan-light)",
          fontSize: "0.8rem",
          boxShadow: "none",
        }}
        aria-label="Cuenta"
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt="" className="h-100 w-100" style={{ objectFit: "cover" }} />
        ) : (
          initial
        )}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item as={Link} to="/settings" className="d-flex align-items-center gap-2">
          <Settings size={16} />
          Configuración
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item as="button" type="button" onClick={handleLogout} className="d-flex align-items-center gap-2">
          <LogOut size={16} />
          Cerrar sesión
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )
}

/**
 * Barra superior persistente — nav horizontal completa en escritorio (reemplaza
 * el rail lateral de iconos), y marca + acciones rápidas en mobile (la nav
 * primaria de mobile sigue viviendo en BottomNav/MoreSheet, sin cambios).
 */
export function TopBar() {
  const user = useAuthStore((state) => state.user)
  const location = useLocation()
  const { unreadCount: feedUnread } = useFeed()
  const chatUnread = useChatUnread()

  const sections = buildNavSections(user)
  const primaryItems = getPrimaryNavItems(sections)
  const overflowSections = getOverflowSections(sections)
  const adminSection = getAdminSection(sections)
  const badgeCounts = { feed: feedUnread, chat: chatUnread }
  const title = findNavLabel(sections, location.pathname)
  const initial = user?.name?.trim()?.[0]?.toUpperCase() ?? "?"
  const avatarUrl = api.mediaUrl(user?.avatar_url) ?? undefined

  const isActive = (path: string) =>
    location.pathname === path || (path !== "/dashboard" && location.pathname.startsWith(`${path}/`))
  const isOverflowActive = overflowSections.some((section) => section.items.some((item) => isActive(item.path)))
  const isAdminActive = location.pathname.startsWith("/admin")

  return (
    <header
      className="d-flex align-items-center justify-content-between px-3 px-lg-4 gap-3"
      style={{ height: 60, borderBottom: "1px solid var(--bs-border-color)", background: "var(--sanken-black)" }}
    >
      <Link to="/dashboard" className="d-flex align-items-center gap-2 text-decoration-none flex-shrink-0" style={{ color: "inherit" }}>
        <img src="/logo.png" alt="" width={22} height={22} />
        <span className="fw-bold d-none d-sm-inline" style={{ fontFamily: "var(--bs-body-font-family)", letterSpacing: "-0.01em" }}>
          SANKEN
        </span>
      </Link>

      <span className="d-lg-none sank-eyebrow mb-0 text-truncate">{title}</span>

      <nav className="d-none d-lg-flex align-items-center gap-1 flex-grow-1" style={{ minWidth: 0 }}>
        {/*
          sank-topnav-scroll (nunca overflow-hidden) envuelve SOLO los links
          primarios: en laptops/ventanas angostas donde no entran todos,
          deslizan en vez de recortarse. Los desplegables "Más"/"Administración"
          quedan fuera de este contenedor a propósito -- overflow-x:auto fija
          también overflow-y:auto (regla CSS), y eso recortaría/ocultaría su
          menú si estuviera adentro.
        */}
        <div className="sank-topnav-scroll d-flex align-items-center gap-1" style={{ minWidth: 0 }}>
          {primaryItems.map((item) => (
            <TopNavLink key={item.path} item={item} active={isActive(item.path)} />
          ))}
        </div>
        {overflowSections.length > 0 && (
          <TopNavOverflowMenu
            id="topnav-more-menu"
            label="Más"
            icon={MoreHorizontal}
            sections={overflowSections}
            active={isOverflowActive}
            badgeCounts={badgeCounts}
          />
        )}
        {adminSection && (
          <TopNavOverflowMenu
            id="topnav-admin-menu"
            label="Administración"
            icon={Shield}
            sections={[adminSection]}
            active={isAdminActive}
            badgeCounts={badgeCounts}
          />
        )}
      </nav>

      <div className="d-flex align-items-center gap-2 flex-shrink-0">
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
              style={{ top: 6, right: 6, width: 7, height: 7, background: "var(--sanken-cyan)" }}
            />
          )}
        </Link>
        <ThemeToggleButton />

        <div className="d-none d-lg-block">
          <AccountMenu initial={initial} avatarUrl={avatarUrl} />
        </div>
        <Link
          to="/settings"
          className="d-lg-none d-flex align-items-center justify-content-center fw-bold overflow-hidden"
          style={{
            width: 34,
            height: 34,
            borderRadius: "var(--bs-border-radius-sm)",
            background: "var(--sanken-cyan-dim)",
            color: "var(--sanken-cyan-light)",
            fontSize: "0.8rem",
          }}
          aria-label="Perfil"
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="h-100 w-100" style={{ objectFit: "cover" }} />
          ) : (
            initial
          )}
        </Link>
      </div>
    </header>
  )
}
