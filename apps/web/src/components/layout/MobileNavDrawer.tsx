import { AnimatePresence, motion } from "framer-motion"
import { LogOut, Settings, X } from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuthStore } from "@/lib/auth-store"
import { useFeed } from "@/hooks/use-feed"
import { useChatUnread } from "@/hooks/use-chat-unread"
import { buildNavSections } from "@/components/layout/nav-config"
import { cn } from "@/lib/utils"

interface MobileNavDrawerProps {
  open: boolean
  onClose: () => void
}

export function MobileNavDrawer({ open, onClose }: MobileNavDrawerProps) {
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
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col overflow-y-auto border-r border-border bg-card lg:hidden"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
          >
            <div className="flex items-center justify-between px-4 py-4">
              <span className="font-heading text-lg font-bold tracking-tight text-foreground">SANKEN</span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar menú"
                className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
              >
                <X className="size-5" />
              </button>
            </div>

            <nav className="flex-1 px-3 pb-3">
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
                          onClick={onClose}
                          className={cn(
                            "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                            active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          )}
                        >
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
                onClick={onClose}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <Settings className="size-4 shrink-0" />
                Configuración
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <LogOut className="size-4 shrink-0" />
                Cerrar sesión
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
