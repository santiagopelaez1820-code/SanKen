import { Nav } from "react-bootstrap"
import { Link, useLocation } from "react-router-dom"
import { buildNavSections } from "@/components/layout/nav-config"
import { cn } from "@/lib/utils"
import type { User } from "@sanken/core"

interface NavSectionsProps {
  user: User | null
  badgeCounts: { feed: number; chat: number }
  onNavigate?: () => void
}

/** Contenido de navegación compartido entre el Sidebar de escritorio y el Offcanvas móvil. */
export function NavSections({ user, badgeCounts, onNavigate }: NavSectionsProps) {
  const location = useLocation()
  const sections = buildNavSections(user)

  const isActive = (path: string) =>
    location.pathname === path || (path !== "/dashboard" && location.pathname.startsWith(`${path}/`))

  return (
    <>
      {sections.map((section) => (
        <div key={section.title} className="mb-4">
          <p className="px-3 pb-1 mb-1 small fw-semibold text-uppercase text-body-secondary" style={{ fontSize: "0.68rem", letterSpacing: "0.08em" }}>
            {section.title}
          </p>
          <Nav className="flex-column gap-1">
            {section.items.map((item) => {
              const active = isActive(item.path)
              const badgeCount = item.badge ? badgeCounts[item.badge] : 0
              return (
                <Nav.Link
                  as={Link}
                  key={item.path}
                  to={item.path}
                  onClick={onNavigate}
                  className={cn(
                    "d-flex align-items-center gap-2 rounded-3 px-3 py-2 fw-medium",
                    active ? "sank-nav-link-active" : "sank-nav-link"
                  )}
                >
                  <item.icon size={16} className="flex-shrink-0" />
                  <span className="flex-grow-1 text-truncate">{item.label}</span>
                  {badgeCount > 0 && (
                    <span
                      className="d-flex align-items-center justify-content-center rounded-pill fw-bold"
                      style={{
                        minWidth: 18,
                        height: 18,
                        fontSize: "0.65rem",
                        background: "var(--sanken-cyan)",
                        color: "var(--sanken-black)",
                        padding: "0 5px",
                      }}
                    >
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
