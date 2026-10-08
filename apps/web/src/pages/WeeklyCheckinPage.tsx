// Esta línea sirve para importar «useState» desde «react».
import { useState } from "react"
// Esta línea sirve para importar «Link» desde «react-router-dom».
import { Link } from "react-router-dom"
// Esta línea sirve para importar «useQuery» desde «@tanstack/react-query».
import { useQuery } from "@tanstack/react-query"
// Esta línea sirve para importar «ArrowLeft» desde «lucide-react».
import { ArrowLeft } from "lucide-react"
// Esta línea sirve para importar los tipos «AnswerCheckinResponse, CurrentCheckinResponse» desde «@sanken/core».
import type { AnswerCheckinResponse, CurrentCheckinResponse } from "@sanken/core"
// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from "@/lib/api"
// Esta línea sirve para importar «useAuthStore» desde «@/lib/auth-store».
import { useAuthStore } from "@/lib/auth-store"
// Esta línea sirve para importar «SUPPORT_QUERY_KEYS, supportStrings as t» desde «@/lib/support».
import { SUPPORT_QUERY_KEYS, supportStrings as t } from "@/lib/support"
// Esta línea sirve para importar «Card» desde «@/components/ui/card».
import { Card } from "@/components/ui/card"
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from "@/components/ui/skeleton"
// Esta línea sirve para importar «WeeklyCheckinForm» desde «@/components/support/WeeklyCheckinForm».
import { WeeklyCheckinForm } from "@/components/support/WeeklyCheckinForm"

/**
 * /soporte/check-in — destino del aviso semanal (push/Novedades) y de la
 * tarjeta de Soporte. Permite responder aunque el usuario haya tocado
 * "Ahora no" antes, mientras siga siendo la misma semana.
 */
// Esta línea sirve para declarar la función «WeeklyCheckinPage».
export function WeeklyCheckinPage() {
  // Esta línea sirve para obtener «userId» con el hook «useAuthStore».
  const userId = useAuthStore((s) => s.user?.id)
  // Esta línea sirve para crear el estado «result» y su función «setResult».
  const [result, setResult] = useState<AnswerCheckinResponse | null>(null)

  // Esta línea sirve para obtener «data, isLoading, isError» con el hook «useQuery».
  const { data, isLoading, isError } = useQuery({
    // Esta línea sirve para declarar la propiedad «queryKey» con el valor o tipo «[...SUPPORT_QUERY_KEYS.checkin, userId]».
    queryKey: [...SUPPORT_QUERY_KEYS.checkin, userId],
    // Esta línea sirve para pedir a la API los datos de «/support/check-ins/current».
    queryFn: () => api.get<CurrentCheckinResponse>("/support/check-ins/current"),
    // Esta línea sirve para declarar la propiedad «enabled» con el valor o tipo «!!userId».
    enabled: !!userId,
  })

  // Esta línea sirve para extraer «hecki» de «data?.checkin».
  const checkin = data?.checkin

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «main» con las clases «px-4 py-8 sm:px-6».
    <main className="px-4 py-8 sm:px-6">
      {/* Esta línea sirve para abrir el elemento «div» con las clases «mx-auto flex max-w-xl flex-col gap-5». */}
      <div className="mx-auto flex max-w-xl flex-col gap-5">
        {/* Esta línea sirve para abrir el componente «Link». */}
        <Link to="/soporte" className="inline-flex items-center gap-1 text-sm text-muted-foreground no-underline hover:text-foreground">
          {/* Esta línea sirve para abrir el componente «ArrowLeft». */}
          <ArrowLeft className="size-4" aria-hidden="true" />
          {/* Esta línea sirve para mostrar el valor «t.sectionTitle». */}
          {t.sectionTitle}
        </Link>
        {/* Esta línea sirve para abrir el elemento «h1» con sus propiedades. */}
        <h1 className="fs-3 m-0 font-heading font-bold tracking-tight">{t.checkinTitle} 💪</h1>

        {/* Esta línea sirve para abrir el componente «Card». */}
        <Card variant="flat">
          {/* Esta línea sirve para mostrar el elemento solo si «isLoading». */}
          {isLoading && <Skeleton className="h-40 w-full" />}
          {/* Esta línea sirve para mostrar el elemento solo si «isError». */}
          {isError && <p className="m-0 text-sm text-destructive">{t.loadError}</p>}
          {/* Esta línea sirve para mostrar el bloque solo si «result». */}
          {result && (
            // Esta línea sirve para abrir el elemento «p» con las clases «m-0».
            <p className="m-0" role="status">
              {/* Esta línea sirve para elegir entre dos bloques según «result.ticket». */}
              {result.ticket ? (
                // Esta línea sirve para abrir un fragmento que agrupa elementos sin añadir nodo.
                <>
                  {/* Esta línea sirve para mostrar el contenido dinámico «{t.checkinThanksWithTicket(result.ticket.id)}{" "}». */}
                  {t.checkinThanksWithTicket(result.ticket.id)}{" "}
                  {/* Esta línea sirve para mostrar el valor «t.requestNumber(result.ticket.id)» dentro de «Link». */}
                  <Link to={`/soporte/${result.ticket.id}`}>{t.requestNumber(result.ticket.id)}</Link>
                </>
              // Esta línea sirve para mostrar el bloque alternativo.
              ) : (
                // Esta línea sirve para mostrar el agradecimiento por responder el check-in.
                t.checkinThanks
              )}
            </p>
          )}
          {/* Esta línea sirve para mostrar el elemento solo si «!result && data && !checkin». */}
          {!result && data && !checkin && <p className="m-0 text-muted-foreground">{t.checkinUnavailable}</p>}
          {/* Esta línea sirve para mostrar el elemento solo si «!result && checkin?.status === "answered"». */}
          {!result && checkin?.status === "answered" && <p className="m-0 text-muted-foreground">{t.checkinAnswered}</p>}
          {/* Esta línea sirve para mostrar el formulario solo si hay check-in sin responder y no hay resultado. */}
          {!result && checkin && checkin.status !== "answered" && <WeeklyCheckinForm checkin={checkin} onDone={setResult} />}
        </Card>
      </div>
    </main>
  )
}
