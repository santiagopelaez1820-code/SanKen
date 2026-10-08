<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las acciones de retos.

namespace App\Application\Challenges\Actions;

// Esta línea sirve para importar el catálogo de retos para usar sus constantes de tipo.
use App\Domain\Challenges\Services\ChallengeCatalog;
// Esta línea sirve para importar el modelo Challenge (reto).
use App\Models\Challenge;
// Esta línea sirve para importar el modelo ChallengeTemplate (plantilla de reto).
use App\Models\ChallengeTemplate;
// Esta línea sirve para importar Carbon para manejar fechas.
use Carbon\Carbon;
// Esta línea sirve para importar la interfaz que permite ejecutar esta acción en cola.
use Illuminate\Contracts\Queue\ShouldQueue;
// Esta línea sirve para importar el trait que permite despachar la acción.
use Illuminate\Foundation\Bus\Dispatchable;
// Esta línea sirve para importar el trait para interactuar con la cola.
use Illuminate\Queue\InteractsWithQueue;
// Esta línea sirve para importar el trait que serializa modelos al encolar.
use Illuminate\Queue\SerializesModels;

/**
 * Crea la instancia de la semana/mes actual de cada plantilla de
 * ChallengeCatalog, si todavía no existe. A diferencia de
 * RecalculateRankingsAction (delete+reinsert completo), acá un reto ya
 * creado y con participantes no debe desaparecer si el comando se corre de
 * nuevo a mitad de semana/mes — por eso se busca antes de crear en vez de
 * borrar todo.
 */
// Esta línea sirve para declarar la acción que crea los retos de la semana o mes actual.
class GenerateChallengesAction implements ShouldQueue
{
    // Esta línea sirve para incluir los traits para poder despacharla y encolarla.
    use Dispatchable, InteractsWithQueue, SerializesModels;

    // Esta línea sirve para declarar el método que ejecuta la acción y devuelve cuántos retos creó.
    public function handle(): int
    {
        // Esta línea sirve para guardar la fecha y hora actual.
        $now = Carbon::now();
        // Esta línea sirve para iniciar el contador de retos creados.
        $created = 0;

        // Esta línea sirve para recorrer cada plantilla de reto activa.
        foreach (ChallengeTemplate::active()->get() as $template) {
            // Esta línea sirve para calcular inicio y fin: si el reto es semanal, usar la semana actual.
            [$startsAt, $endsAt] = $template->type === ChallengeCatalog::TYPE_WEEKLY
                // Esta línea sirve para usar el rango de la semana actual (lunes a domingo).
                ? [$now->clone()->startOfWeek(), $now->clone()->endOfWeek()]
                // Esta línea sirve para usar el rango del mes actual en caso contrario.
                : [$now->clone()->startOfMonth(), $now->clone()->endOfMonth()];

            // No usamos firstOrCreate() con 'starts_at' en el array de
            // búsqueda: el cast `date` persiste como datetime completo
            // (Y-m-d H:i:s) al guardar, así que una igualdad exacta contra
            // el string "Y-m-d" en el WHERE de la búsqueda nunca matchea la
            // fila existente — mismo problema, mismo fix, que
            // AggregateDailyStatsAction con user_stats_daily.stat_date.
            // Esta línea sirve para consultar si ya existe el reto de esta plantilla para este período.
            $exists = Challenge::query()
                // Esta línea sirve para filtrar por el código de la plantilla.
                ->where('code', $template->code)
                // Esta línea sirve para filtrar por la fecha de inicio del período.
                ->whereDate('starts_at', $startsAt->toDateString())
                // Esta línea sirve para devolver verdadero si encontró alguno.
                ->exists();

            // Esta línea sirve para revisar si el reto ya existe.
            if ($exists) {
                // Esta línea sirve para saltar a la siguiente plantilla para no duplicarlo.
                continue;
            }

            // Esta línea sirve para crear el reto del período con los datos de la plantilla.
            Challenge::query()->create([
                // Esta línea sirve para copiar el código de la plantilla.
                'code' => $template->code,
                // Esta línea sirve para copiar el título.
                'title' => $template->title,
                // Esta línea sirve para copiar la descripción.
                'description' => $template->description,
                // Esta línea sirve para copiar el tipo (semanal o mensual).
                'type' => $template->type,
                // Esta línea sirve para guardar el criterio: la métrica a medir y la meta.
                'criteria' => ['metric' => $template->metric, 'target' => (float) $template->target],
                // Esta línea sirve para guardar la fecha de inicio del período.
                'starts_at' => $startsAt->toDateString(),
                // Esta línea sirve para guardar la fecha de fin del período.
                'ends_at' => $endsAt->toDateString(),
            ]);
            // Esta línea sirve para sumar uno al contador de retos creados.
            $created++;
        }

        // Esta línea sirve para devolver cuántos retos se crearon.
        return $created;
    }
}
