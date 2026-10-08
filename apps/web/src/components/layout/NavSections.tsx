// Esta línea sirve para importar «Nav» desde «react-bootstrap».
import { Nav } from "react-bootstrap"
// Esta línea sirve para importar «Link, useLocation» desde «react-router-dom».
import { Link, useLocation } from "react-router-dom"
// Esta línea sirve para importar «buildNavSections» desde «@/components/layout/nav-config».
import { buildNavSections } from "@/components/layout/nav-config"
// Esta línea sirve para importar «cn» desde «@/lib/utils».
import { cn } from "@/lib/utils"
// Esta línea sirve para importar los tipos «User» desde «@sanken/core».
import type { User } from "@sanken/core"

// Esta línea sirve para declarar la interfaz «NavSectionsProps».
interface NavSectionsProps {
  // Esta línea sirve para declarar la propiedad «user» con el valor o tipo «User | null».
  user: User | null
  // Esta línea sirve para declarar la propiedad «badgeCounts» con el valor o tipo «{ feed: number; chat: number }».
  badgeCounts: { feed: number; chat: number }
  // Esta línea sirve para declarar la propiedad «onNavigate» con el valor o tipo «() => void».
  onNavigate?: () => void
}

/** Contenido de navegación compartido entre el Sidebar de escritorio y el Offcanvas móvil. */
// Esta línea sirve para declarar el componente de las secciones de navegación.
export function NavSections({ user, badgeCounts, onNavigate }: NavSectionsProps) {
  // Esta línea sirve para obtener «location» con el hook «useLocation».
  const location = useLocation()
  // Esta línea sirve para construir las secciones del menú según el usuario.
  const sections = buildNavSections(user)

  // Esta línea sirve para declarar la función que indica si una ruta está activa.
  const isActive = (path: string) =>
    // Esta línea sirve para comparar la ruta actual con la del ítem, salvo el dashboard.
    location.pathname === path || (path !== "/dashboard" && location.pathname.startsWith(`${path}/`))

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir un fragmento que agrupa elementos sin añadir nodo.
    <>
      {/* Esta línea sirve para recorrer «sections» y mostrar un bloque por elemento. */}
      {sections.map((section) => (
        // Esta línea sirve para abrir el elemento «div».
        <div key={section.title} className="mb-4">
          {/* Esta línea sirve para abrir el elemento «p» con las clases «px-3 pb-1 mb-1 small fw-semibold text-up». */}
          <p className="px-3 pb-1 mb-1 small fw-semibold text-uppercase text-body-secondary" style={{ fontSize: "0.68rem", letterSpacing: "0.08em" }}>
            {/* Esta línea sirve para mostrar el valor «section.title». */}
            {section.title}
          </p>
          {/* Esta línea sirve para abrir el componente «Nav». */}
          <Nav className="flex-column gap-1">
            {/* Esta línea sirve para recorrer los ítems de la sección. */}
            {section.items.map((item) => {
              // Esta línea sirve para calcular si el ítem está activo.
              const active = isActive(item.path)
              // Esta línea sirve para obtener el contador de la insignia del ítem.
              const badgeCount = item.badge ? badgeCounts[item.badge] : 0
              // Esta línea sirve para devolver la interfaz del componente.
              return (
                // Esta línea sirve para abrir el enlace de navegación.
                <Nav.Link
                  // Esta línea sirve para pasar la propiedad «as» con el valor «Link}».
                  as={Link}
                  // Esta línea sirve para identificar el elemento de la lista con «item.path}».
                  key={item.path}
                  // Esta línea sirve para pasar la propiedad «to» con el valor «item.path}».
                  to={item.path}
                  // Esta línea sirve para asignar el manejador del evento «onClick».
                  onClick={onNavigate}
                  // Esta línea sirve para aplicar las clases de estilo calculadas: «cn(».
                  className={cn(
                    // Esta línea sirve para aplicar las clases base del enlace.
                    "d-flex align-items-center gap-2 rounded-3 px-3 py-2 fw-medium",
                    // Esta línea sirve para elegir la clase de activo o inactivo.
                    active ? "sank-nav-link-active" : "sank-nav-link"
                  )}
                >
                  {/* Esta línea sirve para mostrar el ícono del ítem. */}
                  <item.icon size={16} className="flex-shrink-0" />
                  {/* Esta línea sirve para mostrar la etiqueta del ítem. */}
                  <span className="flex-grow-1 text-truncate">{item.label}</span>
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
                        // Esta línea sirve para declarar la propiedad «color» con el valor o tipo «"var(--sanken-black)"».
                        color: "var(--sanken-black)",
                        // Esta línea sirve para declarar la propiedad «padding» con el valor o tipo «"0 5px"».
                        padding: "0 5px",
                      }}
                    >
                      {/* Esta línea sirve para mostrar el contador, con tope en 9+. */}
                      {badgeCount > 9 ? "9+" : badgeCount}
                    </span>
                  )}
                </Nav.Link>
              )
            })}
          </Nav>
        </div>
      ))}
    </>
  )
}
