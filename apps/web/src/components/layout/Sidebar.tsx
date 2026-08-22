import { LogOut, Settings } from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuthStore } from "@/lib/auth-store"
import { useFeed } from "@/hooks/use-feed"
import { useChatUnread } from "@/hooks/use-chat-unread"
import { buildNavSections } from "@/components/layout/nav-config"
import { cn } from "@/lib/utils"

export function Sidebar() {
  const user = useAuthStore((state) => state.user)
  const clearSession = useAuthStore((state) => state.clearSession)
  const location = useLocation()
  const navigate = useNavigate()
  const { unreadCount: feedUnread } = useFeed()
  const chatUnread = useChatUnread()

  const sections = buildNavSections(user)
  const badgeCounts = { feed: feedUnread, chat: chatUnread }

  const isActive = (path: string) =>
    location.pathname === path || (path !== "/dashboard" && location.pathname.startsWith(`${path}/`))

  const handleLogout = () => {
    clearSession()
    navigate("/login")
  }

  return (
    <aside className="hidden h-svh w-64 shrink-0 flex-col border-r border-border bg-card lg:flex">
      <Link to="/dashboard" className="flex items-center gap-2.5 px-5 py-5">
        <img src="/logo.png" alt="" className="h-8 w-8" />
        <span className="font-heading text-lg font-bold tracking-tight text-foreground">SANKEN</span>
      </Link>

      <nav className="flex-1 overflow-y-auto px-3 pb-3">
        {sections.map((section) => (
          <div key={section.title} className="mb-4">
            <p className="px-3 pb-1.5 text-[0.65rem] font-semibold tracking-widest text-muted-foreground uppercase">
              {section.title}
            </p>
            <div className="flex flex-col gap-0.5">
              {section.items.map((item) => {
                const active = isActive(item.path)
                const badgeCount = item.badge ? badgeCounts[item.badge] : 0
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {active && <span className="absolute top-1/2 left-0 h-4 w-0.5 -translate-y-1/2 rounded-full bg-primary" />}
                    <item.icon className="size-4 shrink-0" />
                    <span className="flex-1 truncate">{item.label}</span>
                    {badgeCount > 0 && (
                      <span className="flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-primary px-1 text-[0.65rem] font-bold text-primary-foreground">
                        {badgeCount > 9 ? "9+" : badgeCount}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="flex flex-col gap-0.5 border-t border-border px-3 py-3">
        <Link
          to="/settings"
          className={cn(
            "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            isActive("/settings")
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <Settings className="size-4 shrink-0" />
          Configuración
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <LogOut className="size-4 shrink-0" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
