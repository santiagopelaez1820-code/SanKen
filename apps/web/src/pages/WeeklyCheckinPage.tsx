import { useState } from "react"
import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { ArrowLeft } from "lucide-react"
import type { AnswerCheckinResponse, CurrentCheckinResponse } from "@sanken/core"
import { api } from "@/lib/api"
import { useAuthStore } from "@/lib/auth-store"
import { SUPPORT_QUERY_KEYS, supportStrings as t } from "@/lib/support"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { WeeklyCheckinForm } from "@/components/support/WeeklyCheckinForm"

/**
 * /soporte/check-in — destino del aviso semanal (push/Novedades) y de la
 * tarjeta de Soporte. Permite responder aunque el usuario haya tocado
 * "Ahora no" antes, mientras siga siendo la misma semana.
 */
export function WeeklyCheckinPage() {
  const userId = useAuthStore((s) => s.user?.id)
  const [result, setResult] = useState<AnswerCheckinResponse | null>(null)

  const { data, isLoading, isError } = useQuery({
    queryKey: [...SUPPORT_QUERY_KEYS.checkin, userId],
    queryFn: () => api.get<CurrentCheckinResponse>("/support/check-ins/current"),
    enabled: !!userId,
  })

  const checkin = data?.checkin

  return (
    <main className="px-4 py-8 sm:px-6">
      <div className="mx-auto flex max-w-xl flex-col gap-5">
        <Link to="/soporte" className="inline-flex items-center gap-1 text-sm text-muted-foreground no-underline hover:text-foreground">
          <ArrowLeft className="size-4" aria-hidden="true" />
          {t.sectionTitle}
        </Link>
        <h1 className="fs-3 m-0 font-heading font-bold tracking-tight">{t.checkinTitle} 💪</h1>

        <Card variant="flat">
          {isLoading && <Skeleton className="h-40 w-full" />}
          {isError && <p className="m-0 text-sm text-destructive">{t.loadError}</p>}
          {result && (
            <p className="m-0" role="status">
              {result.ticket ? (
                <>
                  {t.checkinThanksWithTicket(result.ticket.id)}{" "}
                  <Link to={`/soporte/${result.ticket.id}`}>{t.requestNumber(result.ticket.id)}</Link>
                </>
              ) : (
                t.checkinThanks
              )}
            </p>
          )}
          {!result && data && !checkin && <p className="m-0 text-muted-foreground">{t.checkinUnavailable}</p>}
          {!result && checkin?.status === "answered" && <p className="m-0 text-muted-foreground">{t.checkinAnswered}</p>}
          {!result && checkin && checkin.status !== "answered" && <WeeklyCheckinForm checkin={checkin} onDone={setResult} />}
        </Card>
      </div>
    </main>
  )
}
