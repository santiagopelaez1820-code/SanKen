// Esta línea sirve para importar «Link» desde «react-router-dom».
import { Link } from "react-router-dom"
// Esta línea sirve para abrir la importación de íconos.
import {
  // Esta línea sirve para incluir el valor «ClipboardList» en la lista.
  ClipboardList,
  // Esta línea sirve para incluir el valor «Dumbbell» en la lista.
  Dumbbell,
  // Esta línea sirve para incluir el valor «FileClock» en la lista.
  FileClock,
  // Esta línea sirve para incluir el valor «FileText» en la lista.
  FileText,
  // Esta línea sirve para incluir el valor «Flag» en la lista.
  Flag,
  // Esta línea sirve para incluir el valor «Newspaper» en la lista.
  Newspaper,
  // Esta línea sirve para incluir el valor «Package» en la lista.
  Package,
  // Esta línea sirve para incluir el valor «ScrollText» en la lista.
  ScrollText,
  // Esta línea sirve para incluir el valor «ShoppingCart» en la lista.
  ShoppingCart,
  // Esta línea sirve para incluir el valor «Trophy» en la lista.
  Trophy,
  // Esta línea sirve para incluir el valor «Users» en la lista.
  Users,
// Esta línea sirve para terminar la importación desde «lucide-react».
} from "lucide-react"
// Esta línea sirve para importar «Card» desde «@/components/ui/card».
import { Card } from "@/components/ui/card"

// Esta línea sirve para declarar «TILES» con el valor «[».
const TILES = [
  // Esta línea sirve para agregar el acceso «Usuarios» hacia /admin/users.
  { label: "Usuarios", to: "/admin/users", icon: Users },
  // Esta línea sirve para agregar el acceso «Ejercicios» hacia /admin/exercises.
  { label: "Ejercicios", to: "/admin/exercises", icon: Dumbbell },
  // Esta línea sirve para agregar el acceso «Rutinas generales» hacia /admin/routine-templates.
  { label: "Rutinas generales", to: "/admin/routine-templates", icon: ClipboardList },
  // Esta línea sirve para agregar el acceso «Productos» hacia /admin/products.
  { label: "Productos", to: "/admin/products", icon: Package },
  // Esta línea sirve para agregar el acceso «Pedidos» hacia /admin/orders.
  { label: "Pedidos", to: "/admin/orders", icon: ShoppingCart },
  // Esta línea sirve para agregar el acceso «Reportes» hacia /admin/reports.
  { label: "Reportes", to: "/admin/reports", icon: FileText },
  // Esta línea sirve para agregar el acceso «PR pendientes» hacia /admin/pr-submissions.
  { label: "PR pendientes", to: "/admin/pr-submissions", icon: Trophy },
  // Esta línea sirve para agregar el acceso «Retos» hacia /admin/challenge-templates.
  { label: "Retos", to: "/admin/challenge-templates", icon: Flag },
  // Esta línea sirve para agregar el acceso «Noticias» hacia /admin/news.
  { label: "Noticias", to: "/admin/news", icon: Newspaper },
  // Esta línea sirve para agregar el acceso «Métricas» hacia /admin/stats.
  { label: "Métricas", to: "/admin/stats", icon: ScrollText },
  // Esta línea sirve para agregar el acceso «Auditoría» hacia /admin/audit-logs.
  { label: "Auditoría", to: "/admin/audit-logs", icon: FileClock },
]

// Esta línea sirve para declarar la función «AdminPage».
export function AdminPage() {
  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «main» con las clases «px-4 py-6 sm:px-6 sm:py-8».
    <main className="px-4 py-6 sm:px-6 sm:py-8">
      {/* Esta línea sirve para abrir el elemento «div» con las clases «mx-auto flex max-w-3xl flex-col gap-6». */}
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        {/* Esta línea sirve para abrir el componente «Link». */}
        <Link to="/dashboard" className="flex items-center gap-3 text-decoration-none">
          {/* Esta línea sirve para abrir el elemento «img». */}
          <img src="/logo.png" alt="" className="h-9 w-9" />
          {/* Esta línea sirve para abrir el elemento «div». */}
          <div>
            {/* Esta línea sirve para mostrar el texto «Super Admin» dentro de un «p». */}
            <p className="text-xs font-semibold tracking-widest text-primary uppercase">Super Admin</p>
            {/* Esta línea sirve para mostrar el texto «SANKEN» dentro de un «h1». */}
            <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">SANKEN</h1>
          </div>
        </Link>

        {/* Esta línea sirve para abrir el elemento «div» con las clases «grid grid-cols-2 gap-3 sm:grid-cols-3». */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {/* Esta línea sirve para recorrer «TILES» y mostrar un bloque por elemento. */}
          {TILES.map((tile) => (
            // Esta línea sirve para abrir el componente «Link».
            <Link key={tile.to} to={tile.to}>
              {/* Esta línea sirve para abrir el componente «Card». */}
              <Card className="flex flex-col items-center gap-2 py-6 text-center transition-colors hover:border-primary/40">
                {/* Esta línea sirve para mostrar el ícono de la sección. */}
                <tile.icon className="size-6 text-primary" />
                {/* Esta línea sirve para mostrar el valor «tile.label» dentro de un «span». */}
                <span className="text-sm font-medium text-foreground">{tile.label}</span>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
