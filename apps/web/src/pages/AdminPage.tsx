import { Link } from "react-router-dom"
import {
  ClipboardList,
  Dumbbell,
  FileClock,
  FileText,
  Flag,
  Newspaper,
  ScrollText,
  Trophy,
  Users,
} from "lucide-react"
import { Card } from "@/components/ui/card"

const TILES = [
  { label: "Usuarios", to: "/admin/users", icon: Users },
  { label: "Ejercicios", to: "/admin/exercises", icon: Dumbbell },
  { label: "Rutinas generales", to: "/admin/routine-templates", icon: ClipboardList },
  { label: "Reportes", to: "/admin/reports", icon: FileText },
  { label: "PR pendientes", to: "/admin/pr-submissions", icon: Trophy },
  { label: "Retos", to: "/admin/challenge-templates", icon: Flag },
  { label: "Noticias", to: "/admin/news", icon: Newspaper },
  { label: "Métricas", to: "/admin/stats", icon: ScrollText },
  { label: "Auditoría", to: "/admin/audit-logs", icon: FileClock },
]

export function AdminPage() {
  return (
    <main className="px-6 py-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <Link to="/dashboard" className="flex items-center gap-3 text-decoration-none">
          <img src="/logo.png" alt="" className="h-9 w-9" />
          <div>
            <p className="text-xs font-semibold tracking-widest text-primary uppercase">Super Admin</p>
            <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">SANKEN</h1>
          </div>
        </Link>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {TILES.map((tile) => (
            <Link key={tile.to} to={tile.to}>
              <Card className="flex flex-col items-center gap-2 py-6 text-center transition-colors hover:border-primary/40">
                <tile.icon className="size-6 text-primary" />
                <span className="text-sm font-medium text-foreground">{tile.label}</span>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
