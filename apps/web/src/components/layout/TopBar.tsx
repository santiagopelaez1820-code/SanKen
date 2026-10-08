// Esta línea sirve para importar «Bell, LogOut, MoreHorizontal, Moon, Settings, Shield, Sun» desde «lucide-react».
import { Bell, LogOut, MoreHorizontal, Moon, Settings, Shield, Sun } from "lucide-react"
// Esta línea sirve para importar «Dropdown» desde «react-bootstrap».
import { Dropdown } from "react-bootstrap"
// Esta línea sirve para importar «Link, useLocation» desde «react-router-dom».
import { Link, useLocation } from "react-router-dom"
// Esta línea sirve para importar «useAuthStore» desde «@/lib/auth-store».
import { useAuthStore } from "@/lib/auth-store"
// Esta línea sirve para importar «useFeed» desde «@/hooks/use-feed».
import { useFeed } from "@/hooks/use-feed"
// Esta línea sirve para importar «useChatUnread» desde «@/hooks/use-chat-unread».
import { useChatUnread } from "@/hooks/use-chat-unread"
// Esta línea sirve para importar «useLogout» desde «@/hooks/use-logout».
import { useLogout } from "@/hooks/use-logout"
// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from "@/lib/api"
// Esta línea sirve para importar «useResolvedTheme» desde «@/hooks/use-resolved-theme».
import { useResolvedTheme } from "@/hooks/use-resolved-theme"
// Esta línea sirve para importar «useThemeStore» desde «@/lib/theme-store».
import { useThemeStore } from "@/lib/theme-store"
// Esta línea sirve para abrir la importación de utilidades del menú.
import {
  // Esta línea sirve para importar buildNavSections.
  buildNavSections,
  // Esta línea sirve para importar findNavLabel.
  findNavLabel,
  // Esta línea sirve para importar getAdminSection.
  getAdminSection,
  // Esta línea sirve para importar getOverflowSections.
  getOverflowSections,
  // Esta línea sirve para importar getPrimaryNavItems.
  getPrimaryNavItems,
// Esta línea sirve para terminar la importación desde «@/components/layout/nav-config».
} from "@/components/layout/nav-config"
// Esta línea sirve para importar «cn» desde «@/lib/utils».
import { cn } from "@/lib/utils"

/**
 * Toggle rápido claro/oscuro en el header, al lado de la campana de
 * novedades -- a diferencia del selector de Ajustes (Automático/Claro/
 * Oscuro), este es un solo clic entre los dos, como la mayoría de apps: no
 * pasa por "Automático" en cada clic, solo alterna. "Automático" sigue
 * disponible en Ajustes para quien lo prefiera.
 */
// Esta línea sirve para declarar el botón que alterna el tema claro u oscuro.
function ThemeToggleButton() {
  // Esta línea sirve para obtener «setMode» con el hook «useThemeStore».
  const setMode = useThemeStore((state) => state.setMode)
  // Esta línea sirve para obtener «isDark» con el hook «useResolvedTheme».
  const isDark = useResolvedTheme() === "dark"

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «button» con sus atributos en varias líneas.
    <button
      // Esta línea sirve para definir el atributo «type» con el valor «button».
      type="button"
      // Esta línea sirve para asignar el manejador del evento «onClick».
      onClick={() => setMode(isDark ? "light" : "dark")}
      // Esta línea sirve para aplicar las clases de estilo «d-flex align-items-center justify-content-cen».
      className="d-flex align-items-center justify-content-center rounded-1 border-0 bg-transparent flex-shrink-0"
      // Esta línea sirve para pasar la propiedad «style» con el valor «{ width: 36, height: 36, color: "var(--sanken».
      style={{ width: 36, height: 36, color: "var(--sanken-gray-light)" }}
      // Esta línea sirve para pasar la propiedad «aria-label» con el valor «isDark ? "Cambiar a modo claro" : "Cambiar a ».
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    >
      {/* Esta línea sirve para mostrar el sol u la luna según el tema actual. */}
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}

/** Link horizontal de la nav superior de escritorio: icono + nombre, nunca solo icono. */
// Esta línea sirve para declarar el enlace de navegación principal de la barra superior.
function TopNavLink({ item, active }: { item: ReturnType<typeof getPrimaryNavItems>[number]; active: boolean }) {
  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «Link» con sus atributos en varias líneas.
    <Link
      // Esta línea sirve para pasar la propiedad «to» con el valor «item.path}».
      to={item.path}
      // Esta línea sirve para aplicar las clases de estilo calculadas: «cn("sank-topnav-link", active && "sank-topnav».
      className={cn("sank-topnav-link", active && "sank-topnav-link-active")}
    >
      {/* Esta línea sirve para mostrar el ícono del ítem. */}
      <item.icon size={16} strokeWidth={active ? 2.4 : 2} className="flex-shrink-0" />
      {/* Esta línea sirve para mostrar la etiqueta del ítem. */}
      <span>{item.label}</span>
    </Link>
  )
}

/** Desplegable "Más" / "Administración": agrupa el resto de módulos por sección, con icono + nombre en cada item. */
// Esta línea sirve para declarar el menú desplegable de ítems adicionales.
function TopNavOverflowMenu({
  // Esta línea sirve para recibir el identificador del menú.
  id,
  // Esta línea sirve para recibir la etiqueta completa.
  label,
  // Esta línea sirve para recibir la etiqueta corta.
  shortLabel,
  // Esta línea sirve para declarar la propiedad «icon» con el valor o tipo «Icon».
  icon: Icon,
  // Esta línea sirve para recibir las secciones a mostrar.
  sections,
  // Esta línea sirve para recibir si el menú está activo.
  active,
  // Esta línea sirve para recibir los contadores de insignias.
  badgeCounts,
  // Esta línea sirve para recibir la alineación del menú.
  align,
// Esta línea sirve para abrir la declaración de tipos de las propiedades.
}: {
  // Esta línea sirve para declarar la propiedad «id» con el valor o tipo «string».
  id: string
  // Esta línea sirve para declarar la propiedad «label» con el valor o tipo «string».
  label: string
  /** Etiqueta corta para laptops (992–1199px), donde la completa no entra. */
  // Esta línea sirve para declarar la propiedad «shortLabel» con el valor o tipo «string».
  shortLabel?: string
  // Esta línea sirve para declarar la propiedad «icon» con el valor o tipo «typeof MoreHorizontal».
  icon: typeof MoreHorizontal
  // Esta línea sirve para declarar el tipo de las secciones.
  sections: { title: string; items: ReturnType<typeof getPrimaryNavItems> }[]
  // Esta línea sirve para declarar la propiedad «active» con el valor o tipo «boolean».
  active: boolean
  // Esta línea sirve para declarar la propiedad «badgeCounts» con el valor o tipo «{ feed: number; chat: number }».
  badgeCounts: { feed: number; chat: number }
  // Esta línea sirve para declarar la propiedad «align» con el valor o tipo «"start" | "end"».
  align?: "start" | "end"
// Esta línea sirve para cerrar la declaración y abrir el cuerpo.
}) {
  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «Dropdown».
    <Dropdown align={align} className="flex-shrink-0">
      {/* Esta línea sirve para abrir el botón que despliega el menú. */}
      <Dropdown.Toggle
        // Esta línea sirve para definir el atributo «as» con el valor «button».
        as="button"
        // Esta línea sirve para pasar la propiedad «id» con el valor «id}».
        id={id}
        // Esta línea sirve para definir el atributo «type» con el valor «button».
        type="button"
        // Esta línea sirve para aplicar las clases de estilo calculadas: «cn("sank-topnav-link border-0 bg-transparent"».
        className={cn("sank-topnav-link border-0 bg-transparent", active && "sank-topnav-link-active")}
        // Esta línea sirve para pasar la propiedad «style» con el valor «{ boxShadow: "none" }}».
        style={{ boxShadow: "none" }}
      >
        {/* Esta línea sirve para abrir el componente «Icon». */}
        <Icon size={16} strokeWidth={active ? 2.4 : 2} className="flex-shrink-0" />
        {/* Esta línea sirve para elegir entre dos bloques según «shortLabel». */}
        {shortLabel ? (
          // Esta línea sirve para abrir un fragmento que agrupa elementos sin añadir nodo.
          <>
            {/* Esta línea sirve para mostrar la etiqueta corta en pantallas medianas. */}
            <span className="d-xl-none">{shortLabel}</span>
            {/* Esta línea sirve para mostrar la etiqueta completa en pantallas grandes. */}
            <span className="d-none d-xl-inline">{label}</span>
          </>
        // Esta línea sirve para mostrar el bloque alternativo.
        ) : (
          // Esta línea sirve para mostrar la etiqueta completa.
          <span>{label}</span>
        )}
      </Dropdown.Toggle>
      {/* Esta línea sirve para abrir el componente «Dropdown.Menu». */}
      <Dropdown.Menu>
        {/* Esta línea sirve para recorrer «sections» y mostrar un bloque por elemento. */}
        {sections.map((section, idx) => (
          // Esta línea sirve para abrir el elemento «div».
          <div key={section.title}>
            {/* Esta línea sirve para mostrar el elemento solo si «idx > 0». */}
            {idx > 0 && <Dropdown.Divider />}
            {/* Esta línea sirve para mostrar el título de la sección. */}
            <Dropdown.Header>{section.title}</Dropdown.Header>
            {/* Esta línea sirve para recorrer los ítems de la sección. */}
            {section.items.map((item) => {
              // Esta línea sirve para obtener el contador de la insignia del ítem.
              const badgeCount = item.badge ? badgeCounts[item.badge] : 0
              // Esta línea sirve para devolver la interfaz del componente.
              return (
                // Esta línea sirve para abrir el componente «Dropdown.Item».
                <Dropdown.Item as={Link} key={item.path} to={item.path} className="d-flex align-items-center gap-2">
                  {/* Esta línea sirve para mostrar el ícono del ítem. */}
                  <item.icon size={16} className="flex-shrink-0" />
                  {/* Esta línea sirve para mostrar la etiqueta del ítem. */}
                  <span className="flex-grow-1">{item.label}</span>
                  {/* Esta línea sirve para mostrar el bloque solo si «badgeCount > 0». */}
                  {badgeCount > 0 && (
                    // Esta línea sirve para abrir el elemento «span» con sus atributos en varias líneas.
                    <span
                      // Esta línea sirve para aplicar las clases de estilo «d-flex align-items-center justify-content-cen».
                      className="d-flex align-items-center justify-content-center rounded-pill fw-bold"
                      // Esta línea sirve para pasar la propiedad «style» con el valor «{».
                      style={{
                        // Esta línea sirve para declarar la propiedad «minWidth» con el valor o tipo «18».
                        minWidth: 18,
                        // Esta línea sirve para declarar la propiedad «height» con el valor o tipo «18».
                        height: 18,
                        // Esta línea sirve para declarar la propiedad «fontSize» con el valor o tipo «"0.65rem"».
                        fontSize: "0.65rem",
                        // Esta línea sirve para declarar la propiedad «background» con el valor o tipo «"var(--sanken-cyan)"».
                        background: "var(--sanken-cyan)",
                        // Esta línea sirve para declarar la propiedad «color» con el valor o tipo «"var(--sanken-on-accent)"».
                        color: "var(--sanken-on-accent)",
                        // Esta línea sirve para declarar la propiedad «padding» con el valor o tipo «"0 5px"».
                        padding: "0 5px",
                      }}
                    >
                      {/* Esta línea sirve para mostrar el contador, con tope en 9+. */}
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
// Esta línea sirve para declarar el menú de la cuenta del usuario.
function AccountMenu({ initial, avatarUrl }: { initial: string; avatarUrl: string | null | undefined }) {
  // Esta línea sirve para obtener «handleLogout» con el hook «useLogout».
  const handleLogout = useLogout()

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «Dropdown».
    <Dropdown align="end">
      {/* Esta línea sirve para abrir el botón que despliega el menú de cuenta. */}
      <Dropdown.Toggle
        // Esta línea sirve para definir el atributo «as» con el valor «button».
        as="button"
        // Esta línea sirve para definir el atributo «id» con el valor «topnav-account-menu».
        id="topnav-account-menu"
        // Esta línea sirve para definir el atributo «type» con el valor «button».
        type="button"
        // Esta línea sirve para aplicar las clases de estilo «d-flex align-items-center justify-content-cen».
        className="d-flex align-items-center justify-content-center fw-bold overflow-hidden border-0 flex-shrink-0"
        // Esta línea sirve para pasar la propiedad «style» con el valor «{».
        style={{
          // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «34».
          width: 34,
          // Esta línea sirve para declarar la propiedad «height» con el valor o tipo «34».
          height: 34,
          // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «"var(--bs-border-radius-sm)"».
          borderRadius: "var(--bs-border-radius-sm)",
          // Esta línea sirve para declarar la propiedad «background» con el valor o tipo «"var(--sanken-cyan-dim)"».
          background: "var(--sanken-cyan-dim)",
          // Esta línea sirve para declarar la propiedad «color» con el valor o tipo «"var(--sanken-cyan-light)"».
          color: "var(--sanken-cyan-light)",
          // Esta línea sirve para declarar la propiedad «fontSize» con el valor o tipo «"0.8rem"».
          fontSize: "0.8rem",
          // Esta línea sirve para declarar la propiedad «boxShadow» con el valor o tipo «"none"».
          boxShadow: "none",
        }}
        // Esta línea sirve para definir el atributo «aria-label» con el valor «Cuenta».
        aria-label="Cuenta"
      >
        {/* Esta línea sirve para elegir entre dos bloques según «avatarUrl». */}
        {avatarUrl ? (
          // Esta línea sirve para abrir el elemento «img».
          <img src={avatarUrl} alt="" className="h-100 w-100" style={{ objectFit: "cover" }} />
        // Esta línea sirve para mostrar el bloque alternativo.
        ) : (
          // Esta línea sirve para mostrar la inicial del usuario si no hay avatar.
          initial
        )}
      </Dropdown.Toggle>
      {/* Esta línea sirve para abrir el componente «Dropdown.Menu». */}
      <Dropdown.Menu>
        {/* Esta línea sirve para abrir el componente «Dropdown.Item». */}
        <Dropdown.Item as={Link} to="/settings" className="d-flex align-items-center gap-2">
          {/* Esta línea sirve para abrir el componente «Settings». */}
          <Settings size={16} />
          {/* Esta línea sirve para mostrar el texto «Configuración». */}
          Configuración
        </Dropdown.Item>
        {/* Esta línea sirve para abrir el componente «Dropdown.Divider». */}
        <Dropdown.Divider />
        {/* Esta línea sirve para abrir el componente «Dropdown.Item». */}
        <Dropdown.Item as="button" type="button" onClick={handleLogout} className="d-flex align-items-center gap-2">
          {/* Esta línea sirve para abrir el componente «LogOut». */}
          <LogOut size={16} />
          {/* Esta línea sirve para mostrar el texto «Cerrar sesión». */}
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
// Esta línea sirve para declarar el componente de la barra superior.
export function TopBar() {
  // Esta línea sirve para obtener «user» con el hook «useAuthStore».
  const user = useAuthStore((state) => state.user)
  // Esta línea sirve para obtener «location» con el hook «useLocation».
  const location = useLocation()
  // Esta línea sirve para obtener «unreadCount: feedUnread» con el hook «useFeed».
  const { unreadCount: feedUnread } = useFeed()
  // Esta línea sirve para obtener «chatUnread» con el hook «useChatUnread».
  const chatUnread = useChatUnread()

  // Esta línea sirve para construir las secciones del menú según el usuario.
  const sections = buildNavSections(user)
  // Esta línea sirve para obtener los ítems principales.
  const primaryItems = getPrimaryNavItems(sections)
  // Esta línea sirve para obtener las secciones del menú «Más».
  const overflowSections = getOverflowSections(sections)
  // Esta línea sirve para obtener la sección de administración.
  const adminSection = getAdminSection(sections)
  // Esta línea sirve para reunir los contadores de novedades y chat.
  const badgeCounts = { feed: feedUnread, chat: chatUnread }
  // Esta línea sirve para calcular el título de la página actual.
  const title = findNavLabel(sections, location.pathname)
  // Esta línea sirve para calcular la inicial del nombre del usuario.
  const initial = user?.name?.trim()?.[0]?.toUpperCase() ?? "?"
  // Esta línea sirve para calcular la URL del avatar pequeño.
  const avatarUrl = api.mediaUrl(user?.avatar_url, "avatarSmall") ?? undefined

  // Esta línea sirve para declarar la función que indica si una ruta está activa.
  const isActive = (path: string) =>
    // Esta línea sirve para comparar la ruta actual con la del ítem, salvo el dashboard.
    location.pathname === path || (path !== "/dashboard" && location.pathname.startsWith(`${path}/`))
  // Esta línea sirve para calcular si alguna ruta del menú «Más» está activa.
  const isOverflowActive = overflowSections.some((section) => section.items.some((item) => isActive(item.path)))
  // Esta línea sirve para calcular si la ruta actual es de administración.
  const isAdminActive = location.pathname.startsWith("/admin")

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «header» con sus atributos en varias líneas.
    <header
      // Esta línea sirve para aplicar las clases de estilo «d-flex align-items-center justify-content-bet».
      className="d-flex align-items-center justify-content-between px-3 px-lg-4 gap-3"
      // Esta línea sirve para pasar la propiedad «style» con el valor «{ height: 60, borderBottom: "1px solid var(--».
      style={{ height: 60, borderBottom: "1px solid var(--bs-border-color)", background: "var(--sanken-black)" }}
    >
      {/* Esta línea sirve para abrir el componente «Link». */}
      <Link to="/dashboard" aria-label="SanKen — Inicio" className="-m-2 d-flex align-items-center gap-2 p-2 text-decoration-none flex-shrink-0" style={{ color: "inherit" }}>
        {/* Esta línea sirve para abrir el elemento «img». */}
        <img src="/logo.png" alt="" width={34} height={34} />
        {/* Esta línea sirve para abrir el elemento «span» con las clases «fw-bold d-none d-sm-inline d-lg-none d-x». */}
        <span className="fw-bold d-none d-sm-inline d-lg-none d-xl-inline" style={{ fontFamily: "var(--bs-body-font-family)", letterSpacing: "-0.01em" }}>
          {/* Esta línea sirve para mostrar el texto «SANKEN». */}
          SANKEN
        </span>
      </Link>

      {/* Esta línea sirve para abrir el comentario que explica el margen que pega el título al logo en móvil. */}
      {/* me-auto: en móvil el título de la sección va pegado al logo (antes
          // Esta línea sirve para continuar el comentario sobre el título en móvil.
          quedaba centrado entre el logo y los íconos de la derecha). */}
      {/* Esta línea sirve para mostrar el título de la sección actual solo en móvil. */}
      <span className="d-lg-none sank-eyebrow mb-0 text-truncate me-auto" style={{ marginLeft: -6, minWidth: 0 }}>{title}</span>

      {/* Esta línea sirve para abrir el elemento «nav» con las clases «d-none d-lg-flex align-items-center gap-». */}
      <nav className="d-none d-lg-flex align-items-center gap-1 flex-grow-1" style={{ minWidth: 0 }}>
        {/* Esta línea sirve para abrir el comentario que explica por qué el contenedor de links usa scroll horizontal. */}
        {/*
          // Esta línea sirve para continuar el comentario sobre el scroll de los links.
          sank-topnav-scroll (nunca overflow-hidden) envuelve SOLO los links
          // Esta línea sirve para continuar el comentario sobre los links primarios.
          primarios: en laptops/ventanas angostas donde no entran todos,
          // Esta línea sirve para continuar el comentario sobre los desplegables.
          deslizan en vez de recortarse. Los desplegables "Más"/"Administración"
          // Esta línea sirve para continuar el comentario sobre la posición de los desplegables.
          quedan fuera de este contenedor a propósito -- overflow-x:auto fija
          // Esta línea sirve para continuar el comentario sobre el overflow.
          también overflow-y:auto (regla CSS), y eso recortaría/ocultaría su
          // Esta línea sirve para continuar el comentario sobre el recorte del menú.
          menú si estuviera adentro.
        // Esta línea sirve para cerrar el comentario sobre el scroll de los links.
        */}
        {/* Esta línea sirve para abrir el elemento «div» con las clases «sank-topnav-scroll d-flex align-items-ce». */}
        <div className="sank-topnav-scroll d-flex align-items-center gap-1" style={{ minWidth: 0 }}>
          {/* Esta línea sirve para recorrer «primaryItems» y mostrar un bloque por elemento. */}
          {primaryItems.map((item) => (
            // Esta línea sirve para abrir el componente «TopNavLink».
            <TopNavLink key={item.path} item={item} active={isActive(item.path)} />
          ))}
        </div>
        {/* Esta línea sirve para mostrar el bloque solo si «overflowSections.length > 0». */}
        {overflowSections.length > 0 && (
          // Esta línea sirve para abrir el elemento «TopNavOverflowMenu» con sus atributos en varias líneas.
          <TopNavOverflowMenu
            // Esta línea sirve para definir el atributo «id» con el valor «topnav-more-menu».
            id="topnav-more-menu"
            // Esta línea sirve para definir el atributo «label» con el valor «Más».
            label="Más"
            // Esta línea sirve para pasar la propiedad «icon» con el valor «MoreHorizontal}».
            icon={MoreHorizontal}
            // Esta línea sirve para pasar la propiedad «sections» con el valor «overflowSections}».
            sections={overflowSections}
            // Esta línea sirve para pasar la propiedad «active» con el valor «isOverflowActive}».
            active={isOverflowActive}
            // Esta línea sirve para pasar la propiedad «badgeCounts» con el valor «badgeCounts}».
            badgeCounts={badgeCounts}
          />
        )}
        {/* Esta línea sirve para mostrar el bloque solo si «adminSection». */}
        {adminSection && (
          // Esta línea sirve para abrir el elemento «TopNavOverflowMenu» con sus atributos en varias líneas.
          <TopNavOverflowMenu
            // Esta línea sirve para definir el atributo «id» con el valor «topnav-admin-menu».
            id="topnav-admin-menu"
            // Esta línea sirve para definir el atributo «label» con el valor «Administración».
            label="Administración"
            // Esta línea sirve para definir el atributo «shortLabel» con el valor «Admin».
            shortLabel="Admin"
            // Esta línea sirve para pasar la propiedad «icon» con el valor «Shield}».
            icon={Shield}
            // Esta línea sirve para pasar la propiedad «sections» con el valor «[adminSection]}».
            sections={[adminSection]}
            // Esta línea sirve para pasar la propiedad «active» con el valor «isAdminActive}».
            active={isAdminActive}
            // Esta línea sirve para pasar la propiedad «badgeCounts» con el valor «badgeCounts}».
            badgeCounts={badgeCounts}
          />
        )}
      </nav>

      {/* Esta línea sirve para abrir el elemento «div» con las clases «d-flex align-items-center gap-2 flex-shr». */}
      <div className="d-flex align-items-center gap-2 flex-shrink-0">
        {/* Esta línea sirve para abrir el elemento «Link» con sus atributos en varias líneas. */}
        <Link
          // Esta línea sirve para definir el atributo «to» con el valor «/feed».
          to="/feed"
          // Esta línea sirve para aplicar las clases de estilo «position-relative d-flex align-items-center j».
          className="position-relative d-flex align-items-center justify-content-center rounded-1"
          // Esta línea sirve para pasar la propiedad «style» con el valor «{ width: 36, height: 36, color: "var(--sanken».
          style={{ width: 36, height: 36, color: "var(--sanken-gray-light)" }}
          // Esta línea sirve para definir el atributo «aria-label» con el valor «Novedades».
          aria-label="Novedades"
        >
          {/* Esta línea sirve para abrir el componente «Bell». */}
          <Bell size={18} />
          {/* Esta línea sirve para mostrar el bloque solo si «feedUnread > 0». */}
          {feedUnread > 0 && (
            // Esta línea sirve para abrir el elemento «span» con sus atributos en varias líneas.
            <span
              // Esta línea sirve para aplicar las clases de estilo «position-absolute rounded-circle».
              className="position-absolute rounded-circle"
              // Esta línea sirve para pasar la propiedad «style» con el valor «{ top: 6, right: 6, width: 7, height: 7, back».
              style={{ top: 6, right: 6, width: 7, height: 7, background: "var(--sanken-cyan)" }}
            />
          )}
        </Link>
        {/* Esta línea sirve para abrir el componente «ThemeToggleButton». */}
        <ThemeToggleButton />

        {/* Esta línea sirve para abrir el elemento «div» con las clases «d-none d-lg-block». */}
        <div className="d-none d-lg-block">
          {/* Esta línea sirve para abrir el componente «AccountMenu». */}
          <AccountMenu initial={initial} avatarUrl={avatarUrl} />
        </div>
        {/* Esta línea sirve para abrir el elemento «Link» con sus atributos en varias líneas. */}
        <Link
          // Esta línea sirve para definir el atributo «to» con el valor «/settings».
          to="/settings"
          // Esta línea sirve para aplicar las clases de estilo «d-lg-none d-flex align-items-center justify-c».
          className="d-lg-none d-flex align-items-center justify-content-center fw-bold overflow-hidden"
          // Esta línea sirve para pasar la propiedad «style» con el valor «{».
          style={{
            // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «34».
            width: 34,
            // Esta línea sirve para declarar la propiedad «height» con el valor o tipo «34».
            height: 34,
            // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «"var(--bs-border-radius-sm)"».
            borderRadius: "var(--bs-border-radius-sm)",
            // Esta línea sirve para declarar la propiedad «background» con el valor o tipo «"var(--sanken-cyan-dim)"».
            background: "var(--sanken-cyan-dim)",
            // Esta línea sirve para declarar la propiedad «color» con el valor o tipo «"var(--sanken-cyan-light)"».
            color: "var(--sanken-cyan-light)",
            // Esta línea sirve para declarar la propiedad «fontSize» con el valor o tipo «"0.8rem"».
            fontSize: "0.8rem",
          }}
          // Esta línea sirve para definir el atributo «aria-label» con el valor «Perfil».
          aria-label="Perfil"
        >
          {/* Esta línea sirve para elegir entre dos bloques según «avatarUrl». */}
          {avatarUrl ? (
            // Esta línea sirve para abrir el elemento «img».
            <img src={avatarUrl} alt="" className="h-100 w-100" style={{ objectFit: "cover" }} />
          // Esta línea sirve para mostrar el bloque alternativo.
          ) : (
            // Esta línea sirve para mostrar la inicial del usuario si no hay avatar.
            initial
          )}
        </Link>
      </div>
    </header>
  )
}
