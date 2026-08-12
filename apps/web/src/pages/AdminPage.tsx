import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export function AdminPage() {
  return (
    <main className="min-h-svh bg-background px-6 py-8 text-foreground">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <header className="flex items-center justify-between">
          <h1 className="font-heading text-2xl font-medium tracking-tight">Panel admin</h1>
          <Button variant="outline" size="sm" asChild>
            <Link to="/dashboard">Volver</Link>
          </Button>
        </header>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Button variant="outline" asChild>
            <Link to="/admin/users">Usuarios</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/admin/exercises">Ejercicios</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/admin/reports">Reportes</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/admin/news">Noticias</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/admin/stats">Métricas</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/admin/audit-logs">Auditoría</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
