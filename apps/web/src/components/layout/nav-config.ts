import type { LucideIcon } from "lucide-react"
import {
  Apple,
  BarChart3,
  Bell,
  CalendarDays,
  ClipboardList,
  Dumbbell,
  FileClock,
  FileText,
  Flag,
  LayoutDashboard,
  MessageCircle,
  Newspaper,
  Package,
  ScrollText,
  Shield,
  ShoppingCart,
  Trophy,
  Users,
  UserSquare2,
} from "lucide-react"
import type { User } from "@sanken/core"

export interface NavItem {
  label: string
  path: string
  icon: LucideIcon
  badge?: "feed" | "chat"
}

export interface NavSection {
  title: string
  items: NavItem[]
}

export function buildNavSections(user: User | null): NavSection[] {
  const sections: NavSection[] = [
    {
      title: "Principal",
      items: [
        { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
        { label: "Progreso", path: "/progress", icon: BarChart3 },
        { label: "Entrenar", path: "/workout/precheck", icon: Dumbbell },
        { label: "PR y Rankings", path: "/prs", icon: Trophy },
        { label: "Calendario", path: "/calendar", icon: CalendarDays },
        { label: "Retos", path: "/challenges", icon: Flag },
        { label: "Nutrición", path: "/nutrition", icon: Apple },
      ],
    },
    {
      title: "Social",
      items: [
        { label: "Novedades", path: "/feed", icon: Bell, badge: "feed" },
        { label: "Chat", path: "/chat", icon: MessageCircle, badge: "chat" },
        ...(user?.role !== "trainer"
          ? [{ label: "Mi entrenador", path: "/my-trainer", icon: UserSquare2 }]
          : []),
      ],
    },
  ]

  if (user?.role === "trainer") {
    sections.push({
      title: "Entrenador",
      items: [{ label: "Mis clientes", path: "/trainer", icon: Users }],
    })
  }

  if (user?.role === "super_admin") {
    sections.push({
      title: "Administración",
      items: [
        { label: "Panel", path: "/admin", icon: Shield },
        { label: "Usuarios", path: "/admin/users", icon: Users },
        { label: "Ejercicios", path: "/admin/exercises", icon: Dumbbell },
        { label: "Productos", path: "/admin/products", icon: Package },
        { label: "Pedidos", path: "/admin/orders", icon: ShoppingCart },
        { label: "Plantillas de rutina", path: "/admin/routine-templates", icon: ClipboardList },
        { label: "Plantillas de retos", path: "/admin/challenge-templates", icon: Flag },
        { label: "Solicitudes de PR", path: "/admin/pr-submissions", icon: Trophy },
        { label: "Reportes", path: "/admin/reports", icon: FileText },
        { label: "Novedades", path: "/admin/news", icon: Newspaper },
        { label: "Estadísticas", path: "/admin/stats", icon: ScrollText },
        { label: "Auditoría", path: "/admin/audit-logs", icon: FileClock },
      ],
    })
  }

  return sections
}

/** Etiqueta de la sección actual para el TopBar — cae a "SanKen" si la ruta no matchea ningún item de nav. */
export function findNavLabel(sections: NavSection[], pathname: string): string {
  for (const section of sections) {
    const match = section.items.find((item) => pathname === item.path || pathname.startsWith(`${item.path}/`))
    if (match) return match.label
  }
  return "SanKen"
}
