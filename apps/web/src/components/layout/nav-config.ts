// Esta línea sirve para importar los tipos «LucideIcon» desde «lucide-react».
import type { LucideIcon } from "lucide-react"
// Esta línea sirve para abrir la importación de íconos.
import {
  // Esta línea sirve para importar el ícono Activity.
  Activity,
  // Esta línea sirve para importar el ícono Apple.
  Apple,
  // Esta línea sirve para importar el ícono BarChart3.
  BarChart3,
  // Esta línea sirve para importar el ícono Bell.
  Bell,
  // Esta línea sirve para importar el ícono CalendarDays.
  CalendarDays,
  // Esta línea sirve para importar el ícono ClipboardList.
  ClipboardList,
  // Esta línea sirve para importar el ícono Dumbbell.
  Dumbbell,
  // Esta línea sirve para importar el ícono FileClock.
  FileClock,
  // Esta línea sirve para importar el ícono FileText.
  FileText,
  // Esta línea sirve para importar el ícono Flag.
  Flag,
  // Esta línea sirve para importar el ícono LayoutDashboard.
  LayoutDashboard,
  // Esta línea sirve para importar el ícono LifeBuoy.
  LifeBuoy,
  // Esta línea sirve para importar el ícono MessageCircle.
  MessageCircle,
  // Esta línea sirve para importar el ícono Newspaper.
  Newspaper,
  // Esta línea sirve para importar el ícono Package.
  Package,
  // Esta línea sirve para importar el ícono PackageSearch.
  PackageSearch,
  // Esta línea sirve para importar el ícono ScrollText.
  ScrollText,
  // Esta línea sirve para importar el ícono Shield.
  Shield,
  // Esta línea sirve para importar el ícono ShoppingBag.
  ShoppingBag,
  // Esta línea sirve para importar el ícono ShoppingCart.
  ShoppingCart,
  // Esta línea sirve para importar el ícono Trophy.
  Trophy,
  // Esta línea sirve para importar el ícono Users.
  Users,
  // Esta línea sirve para importar el ícono UserSquare2.
  UserSquare2,
// Esta línea sirve para terminar la importación desde «lucide-react».
} from "lucide-react"
// Esta línea sirve para importar los tipos «User» desde «@sanken/core».
import type { User } from "@sanken/core"

// Esta línea sirve para declarar la interfaz «NavItem».
export interface NavItem {
  // Esta línea sirve para declarar la propiedad «label» con el valor o tipo «string».
  label: string
  // Esta línea sirve para declarar la propiedad «path» con el valor o tipo «string».
  path: string
  // Esta línea sirve para declarar la propiedad «icon» con el valor o tipo «LucideIcon».
  icon: LucideIcon
  // Esta línea sirve para declarar la propiedad «badge» con el valor o tipo «"feed" | "chat"».
  badge?: "feed" | "chat"
  /** Se muestra directo en la barra superior de escritorio; el resto vive bajo "Más". */
  // Esta línea sirve para declarar la propiedad «primary» con el valor o tipo «boolean».
  primary?: boolean
}

// Esta línea sirve para declarar la interfaz «NavSection».
export interface NavSection {
  // Esta línea sirve para declarar la propiedad «title» con el valor o tipo «string».
  title: string
  // Esta línea sirve para declarar la propiedad «items» con el valor o tipo «NavItem[]».
  items: NavItem[]
}

// Esta línea sirve para declarar la función que arma las secciones del menú según el usuario.
export function buildNavSections(user: User | null): NavSection[] {
  // Esta línea sirve para crear la lista de secciones con las comunes a todos.
  const sections: NavSection[] = [
    {
      // Esta línea sirve para declarar la propiedad «title» con el valor o tipo «"Principal"».
      title: "Principal",
      // Esta línea sirve para declarar la propiedad «items» con el valor o tipo «[».
      items: [
        // Esta línea sirve para agregar el enlace «Inicio» hacia /dashboard.
        { label: "Inicio", path: "/dashboard", icon: LayoutDashboard, primary: true },
        // Esta línea sirve para agregar el enlace «Entrenar» hacia /workout/precheck.
        { label: "Entrenar", path: "/workout/precheck", icon: Dumbbell, primary: true },
        // Esta línea sirve para agregar el enlace «Progreso» hacia /progress.
        { label: "Progreso", path: "/progress", icon: BarChart3, primary: true },
        // Esta línea sirve para agregar el enlace «PR y Rankings» hacia /prs.
        { label: "PR y Rankings", path: "/prs", icon: Trophy, primary: true },
        // Esta línea sirve para agregar el enlace «Nutrición» hacia /nutrition.
        { label: "Nutrición", path: "/nutrition", icon: Apple, primary: true },
        // Esta línea sirve para agregar el enlace «Tienda» hacia /store.
        { label: "Tienda", path: "/store", icon: ShoppingBag, primary: true },
        // Esta línea sirve para agregar el enlace «Mis pedidos» hacia /pedidos.
        { label: "Mis pedidos", path: "/pedidos", icon: PackageSearch },
        // Esta línea sirve para agregar el enlace «Retos» hacia /challenges.
        { label: "Retos", path: "/challenges", icon: Flag },
        // Esta línea sirve para agregar el enlace «Calendario» hacia /calendar.
        { label: "Calendario", path: "/calendar", icon: CalendarDays },
      ],
    },
    {
      // Esta línea sirve para declarar la propiedad «title» con el valor o tipo «"Social"».
      title: "Social",
      // Esta línea sirve para declarar la propiedad «items» con el valor o tipo «[».
      items: [
        // Esta línea sirve para agregar el enlace «Novedades» hacia /feed.
        { label: "Novedades", path: "/feed", icon: Bell, badge: "feed" },
        // Esta línea sirve para agregar el enlace «Chat» hacia /chat.
        { label: "Chat", path: "/chat", icon: MessageCircle, badge: "chat" },
        // Esta línea sirve para agregar el enlace «Soporte» hacia /soporte.
        { label: "Soporte", path: "/soporte", icon: LifeBuoy },
        // Esta línea sirve para agregar «Mi entrenador» solo si el usuario no es entrenador.
        ...(user?.role !== "trainer"
          // Esta línea sirve para incluir el enlace «Mi entrenador».
          ? [{ label: "Mi entrenador", path: "/my-trainer", icon: UserSquare2 }]
          // Esta línea sirve para omitir el enlace si el usuario es entrenador.
          : []),
      ],
    },
  ]

  // Esta línea sirve para revisar si el usuario es entrenador.
  if (user?.role === "trainer") {
    // Esta línea sirve para agregar la sección del entrenador.
    sections.push({
      // Esta línea sirve para declarar la propiedad «title» con el valor o tipo «"Entrenador"».
      title: "Entrenador",
      // Esta línea sirve para incluir el enlace «Mis clientes».
      items: [{ label: "Mis clientes", path: "/trainer", icon: Users }],
    })
  }

  // Esta línea sirve para revisar si el usuario es super administrador.
  if (user?.role === "super_admin") {
    // Esta línea sirve para agregar la sección de administración.
    sections.push({
      // Esta línea sirve para declarar la propiedad «title» con el valor o tipo «"Administración"».
      title: "Administración",
      // Esta línea sirve para declarar la propiedad «items» con el valor o tipo «[».
      items: [
        // Esta línea sirve para agregar el enlace «Panel» hacia /admin.
        { label: "Panel", path: "/admin", icon: Shield },
        // Esta línea sirve para agregar el enlace «Analítica de uso» hacia /admin/analytics.
        { label: "Analítica de uso", path: "/admin/analytics", icon: Activity },
        // Esta línea sirve para agregar el enlace «Usuarios» hacia /admin/users.
        { label: "Usuarios", path: "/admin/users", icon: Users },
        // Esta línea sirve para agregar el enlace «Ejercicios» hacia /admin/exercises.
        { label: "Ejercicios", path: "/admin/exercises", icon: Dumbbell },
        // Esta línea sirve para agregar el enlace «Productos» hacia /admin/products.
        { label: "Productos", path: "/admin/products", icon: Package },
        // Esta línea sirve para agregar el enlace «Pedidos» hacia /admin/orders.
        { label: "Pedidos", path: "/admin/orders", icon: ShoppingCart },
        // Esta línea sirve para agregar el enlace «Plantillas de rutina» hacia /admin/routine-templates.
        { label: "Plantillas de rutina", path: "/admin/routine-templates", icon: ClipboardList },
        // Esta línea sirve para agregar el enlace «Plantillas de retos» hacia /admin/challenge-templates.
        { label: "Plantillas de retos", path: "/admin/challenge-templates", icon: Flag },
        // Esta línea sirve para agregar el enlace «Solicitudes de PR» hacia /admin/pr-submissions.
        { label: "Solicitudes de PR", path: "/admin/pr-submissions", icon: Trophy },
        // Esta línea sirve para agregar el enlace «Soporte» hacia /admin/soporte.
        { label: "Soporte", path: "/admin/soporte", icon: LifeBuoy },
        // Esta línea sirve para agregar el enlace «Reportes» hacia /admin/reports.
        { label: "Reportes", path: "/admin/reports", icon: FileText },
        // Esta línea sirve para agregar el enlace «Novedades» hacia /admin/news.
        { label: "Novedades", path: "/admin/news", icon: Newspaper },
        // Esta línea sirve para agregar el enlace «Estadísticas» hacia /admin/stats.
        { label: "Estadísticas", path: "/admin/stats", icon: ScrollText },
        // Esta línea sirve para agregar el enlace «Auditoría» hacia /admin/audit-logs.
        { label: "Auditoría", path: "/admin/audit-logs", icon: FileClock },
      ],
    })
  }

  // Esta línea sirve para devolver las secciones.
  return sections
}

/** Etiqueta de la sección actual para el TopBar — cae a "SanKen" si la ruta no matchea ningún item de nav. */
// Esta línea sirve para declarar la función que encuentra el título de la página actual.
export function findNavLabel(sections: NavSection[], pathname: string): string {
  // Esta línea sirve para recorrer cada sección.
  for (const section of sections) {
    // Esta línea sirve para buscar el ítem que coincide con la ruta actual.
    const match = section.items.find((item) => pathname === item.path || pathname.startsWith(`${item.path}/`))
    // Esta línea sirve para devolver su etiqueta si hay coincidencia.
    if (match) return match.label
  }
  // Esta línea sirve para devolver el nombre de la marca si no hay coincidencia.
  return "SanKen"
}

/** Items marcados `primary` de todas las secciones, en orden — botones directos de la barra superior de escritorio. */
// Esta línea sirve para declarar la función que devuelve los ítems principales.
export function getPrimaryNavItems(sections: NavSection[]): NavItem[] {
  // Esta línea sirve para unir los ítems principales de todas las secciones.
  return sections.flatMap((section) => section.items.filter((item) => item.primary))
}

/**
 * Secciones "Administración" separadas del resto — se muestran en un desplegable
 * propio de escritorio en vez de mezclarse con "Más", ya que solo aplican a un rol.
 */
// Esta línea sirve para declarar la función que devuelve la sección de administración.
export function getAdminSection(sections: NavSection[]): NavSection | undefined {
  // Esta línea sirve para buscar la sección titulada «Administración».
  return sections.find((section) => section.title === "Administración")
}

/** El resto de secciones (sin los items `primary` ni "Administración") — contenido del desplegable "Más". */
// Esta línea sirve para declarar la función que devuelve las secciones del menú desplegable «Más».
export function getOverflowSections(sections: NavSection[]): NavSection[] {
  // Esta línea sirve para partir de las secciones.
  return sections
    // Esta línea sirve para excluir la sección de administración.
    .filter((section) => section.title !== "Administración")
    // Esta línea sirve para quitar los ítems principales de cada sección.
    .map((section) => ({ ...section, items: section.items.filter((item) => !item.primary) }))
    // Esta línea sirve para descartar las secciones que quedaron vacías.
    .filter((section) => section.items.length > 0)
}
