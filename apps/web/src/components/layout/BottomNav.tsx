// Esta línea sirve para importar «useState» desde «react».
import { useState } from "react"
// Esta línea sirve para importar «Link, useLocation, useNavigate» desde «react-router-dom».
import { Link, useLocation, useNavigate } from "react-router-dom"
// Esta línea sirve para importar «BarChart3, LayoutDashboard, Menu, ShoppingBag, Trophy» desde «lucide-react».
import { BarChart3, LayoutDashboard, Menu, ShoppingBag, Trophy } from "lucide-react"
// Esta línea sirve para importar «cn» desde «@/lib/utils».
import { cn } from "@/lib/utils"
// Esta línea sirve para importar «useCartStore» desde «@/lib/cart-store».
import { useCartStore } from "@/lib/cart-store"
// Esta línea sirve para importar «MoreSheet» desde «@/components/layout/MoreSheet».
import { MoreSheet } from "@/components/layout/MoreSheet"

// Esta línea sirve para declarar las pestañas de la izquierda de la barra inferior.
const TABS = [
  // Esta línea sirve para agregar la pestaña «Inicio» hacia /dashboard.
  { label: "Inicio", path: "/dashboard", icon: LayoutDashboard },
  // Esta línea sirve para agregar la pestaña «Progreso» hacia /progress.
  { label: "Progreso", path: "/progress", icon: BarChart3 },
// Esta línea sirve para marcar la lista como constante de solo lectura.
] as const

// Esta línea sirve para declarar las pestañas de la derecha de la barra inferior.
const TABS_RIGHT = [
  // Retos cedió su lugar a PR (pedido del tester) — sigue en el menú "Más".
  // Esta línea sirve para agregar la pestaña «PR» hacia /prs.
  { label: "PR", path: "/prs", icon: Trophy },
// Esta línea sirve para marcar la lista como constante de solo lectura.
] as const

/** Navegación primaria de mobile: 4 tabs + FAB central, reemplaza el patrón hamburguesa+drawer. */
// Esta línea sirve para declarar el componente de la barra de navegación inferior.
export function BottomNav() {
  // Esta línea sirve para obtener «location» con el hook «useLocation».
  const location = useLocation()
  // Esta línea sirve para obtener «navigate» con el hook «useNavigate».
  const navigate = useNavigate()
  // Esta línea sirve para guardar si el menú «Más» está abierto.
  const [moreOpen, setMoreOpen] = useState(false)
  // Esta línea sirve para obtener «itemCount» con el hook «useCartStore».
  const itemCount = useCartStore((s) => s.getItemCount())

  // Esta línea sirve para declarar la función que indica si una pestaña está activa.
  const isActive = (path: string) => location.pathname === path

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir un fragmento que agrupa elementos sin añadir nodo.
    <>
      {/* Esta línea sirve para abrir el elemento «nav» con las clases «sank-bottom-nav d-lg-none». */}
      <nav className="sank-bottom-nav d-lg-none">
        {/* Esta línea sirve para recorrer «TABS» y mostrar un bloque por elemento. */}
        {TABS.map((tab) => (
          // Esta línea sirve para abrir el componente «Link».
          <Link key={tab.path} to={tab.path} className={cn("sank-bottom-nav-link", isActive(tab.path) && "sank-bottom-nav-link-active")}>
            {/* Esta línea sirve para mostrar el ícono de la pestaña, más grueso si está activa. */}
            <tab.icon size={20} strokeWidth={isActive(tab.path) ? 2.4 : 2} />
            {/* Esta línea sirve para mostrar el valor «tab.label». */}
            {tab.label}
          </Link>
        ))}

        {/* Esta línea sirve para abrir el elemento «div» con las clases «d-flex align-items-center justify-conten». */}
        <div className="d-flex align-items-center justify-content-center position-relative" style={{ flex: 1 }}>
          {/* Esta línea sirve para abrir el elemento «button» con sus atributos en varias líneas. */}
          <button
            // Esta línea sirve para definir el atributo «type» con el valor «button».
            type="button"
            // Esta línea sirve para aplicar las clases de estilo «sank-bottom-nav-fab».
            className="sank-bottom-nav-fab"
            // Esta línea sirve para asignar el manejador del evento «onClick».
            onClick={() => navigate("/store")}
            // Esta línea sirve para definir el atributo «aria-label» con el valor «Tienda SanKen».
            aria-label="Tienda SanKen"
          >
            {/* Esta línea sirve para abrir el componente «ShoppingBag». */}
            <ShoppingBag size={22} strokeWidth={2.3} />
          </button>
          {/* Esta línea sirve para mostrar el bloque solo si «itemCount > 0». */}
          {itemCount > 0 && (
            // Esta línea sirve para abrir el elemento «span» con sus atributos en varias líneas.
            <span
              // Esta línea sirve para aplicar las clases de estilo «position-absolute d-flex align-items-center j».
              className="position-absolute d-flex align-items-center justify-content-center rounded-circle fw-bold"
              // Esta línea sirve para pasar la propiedad «style» con el valor «{».
              style={{
                // Esta línea sirve para declarar la propiedad «top» con el valor o tipo «-2».
                top: -2,
                // Esta línea sirve para declarar la propiedad «right» con el valor o tipo «"calc(50% - 26px)"».
                right: "calc(50% - 26px)",
                // Esta línea sirve para declarar la propiedad «minWidth» con el valor o tipo «18».
                minWidth: 18,
                // Esta línea sirve para declarar la propiedad «height» con el valor o tipo «18».
                height: 18,
                // Esta línea sirve para declarar la propiedad «fontSize» con el valor o tipo «10».
                fontSize: 10,
                // Esta línea sirve para declarar la propiedad «background» con el valor o tipo «"var(--bs-danger)"».
                background: "var(--bs-danger)",
                // Esta línea sirve para declarar la propiedad «color» con el valor o tipo «"#fff"».
                color: "#fff",
                // Esta línea sirve para declarar la propiedad «padding» con el valor o tipo «"0 4px"».
                padding: "0 4px",
              }}
            >
              {/* Esta línea sirve para mostrar el contador de elementos, con tope en 9+. */}
              {itemCount > 9 ? "9+" : itemCount}
            </span>
          )}
        </div>

        {/* Esta línea sirve para recorrer «TABS_RIGHT» y mostrar un bloque por elemento. */}
        {TABS_RIGHT.map((tab) => (
          // Esta línea sirve para abrir el componente «Link».
          <Link key={tab.path} to={tab.path} className={cn("sank-bottom-nav-link", isActive(tab.path) && "sank-bottom-nav-link-active")}>
            {/* Esta línea sirve para mostrar el ícono de la pestaña, más grueso si está activa. */}
            <tab.icon size={20} strokeWidth={isActive(tab.path) ? 2.4 : 2} />
            {/* Esta línea sirve para mostrar el valor «tab.label». */}
            {tab.label}
          </Link>
        ))}

        {/* Esta línea sirve para abrir el botón que muestra el menú «Más». */}
        <button type="button" className="sank-bottom-nav-link border-0 bg-transparent" onClick={() => setMoreOpen(true)}>
          {/* Esta línea sirve para abrir el componente «Menu». */}
          <Menu size={20} />
          {/* Esta línea sirve para mostrar el texto «Más». */}
          Más
        </button>
      </nav>

      {/* Esta línea sirve para mostrar el componente «MoreSheet». */}
      <MoreSheet open={moreOpen} onClose={() => setMoreOpen(false)} />
    </>
  )
}
