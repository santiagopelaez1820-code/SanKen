<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las acciones de estadísticas.

namespace App\Application\Stats\Actions;

// Esta línea sirve para importar el servicio que calcula la racha de días entrenados.
use App\Domain\Stats\Services\StreakCalculator;
// Esta línea sirve para importar el evento que avisa que se alcanzó un hito de racha.
use App\Events\StreakMilestone;
// Esta línea sirve para importar el modelo User (usuario).
use App\Models\User;
// Esta línea sirve para importar el modelo UserStatsDaily (estadísticas diarias).
use App\Models\UserStatsDaily;
// Esta línea sirve para importar el modelo WorkoutSession (sesión de entrenamiento).
use App\Models\WorkoutSession;
// Esta línea sirve para importar la clase que arma las claves de caché.
use App\Support\CacheKeys;
// Esta línea sirve para importar CarbonImmutable para manejar fechas.
use Carbon\CarbonImmutable;
// Esta línea sirve para importar la interfaz que permite ejecutar esta acción en cola.
use Illuminate\Contracts\Queue\ShouldQueue;
// Esta línea sirve para importar el trait que permite despachar la acción.
use Illuminate\Foundation\Bus\Dispatchable;
// Esta línea sirve para importar el trait para interactuar con la cola.
use Illuminate\Queue\InteractsWithQueue;
// Esta línea sirve para importar el trait que serializa modelos al encolar.
use Illuminate\Queue\SerializesModels;
// Esta línea sirve para importar la fachada Cache para borrar la caché.
use Illuminate\Support\Facades\Cache;

/**
 * Recalcula el agregado diario (user_stats_daily) de un usuario para una
 * fecha dada. Se dispara al completar una sesión de entrenamiento (ver
 * CompleteWorkoutSessionAction). Corre en cola: agregar no debe bloquear el
 * cierre de la sesión.
 */
// Esta línea sirve para declarar la acción que recalcula las estadísticas de un día.
class AggregateDailyStatsAction implements ShouldQueue
{
    // Esta línea sirve para incluir los traits para poder despacharla y encolarla.
    use Dispatchable, InteractsWithQueue, SerializesModels;

    // Esta línea sirve para declarar el constructor que recibe sus datos.
    public function __construct(
        // Esta línea sirve para guardar el usuario.
        public readonly User $user,
        // Esta línea sirve para guardar la fecha a recalcular.
        public readonly string $date,
    ) {}

    // Esta línea sirve para declarar el método que hace el recálculo usando el calculador de rachas.
    public function handle(StreakCalculator $streakCalculator): UserStatsDaily
    {
        // Esta línea sirve para consultar las sesiones de ese día.
        $sessions = WorkoutSession::query()
            // Esta línea sirve para filtrar por el usuario.
            ->where('user_id', $this->user->id)
            // Esta línea sirve para filtrar por la fecha.
            ->whereDate('performed_at', $this->date)
            // Esta línea sirve para quedarse solo con las completadas.
            ->where('completed', true)
            // Esta línea sirve para cargar sus ejercicios y series.
            ->with('exercises.sets')
            // Esta línea sirve para ejecutar la consulta.
            ->get();

        // Esta línea sirve para obtener las series efectivas del día.
        $workingSets = $sessions
            // Esta línea sirve para juntar los ejercicios de todas las sesiones.
            ->flatMap(fn (WorkoutSession $session) => $session->exercises)
            // Esta línea sirve para juntar las series de todos los ejercicios.
            ->flatMap(fn ($exercise) => $exercise->sets)
            // Esta línea sirve para quedarse con las series completadas que no son de calentamiento.
            ->filter(fn ($set) => $set->completed && ! $set->is_warmup);

        // Esta línea sirve para sumar el volumen total (peso por repeticiones).
        $totalVolumeKg = $workingSets->sum(fn ($set) => (float) $set->weight_kg * $set->reps);

        // Esta línea sirve para consultar las fechas en que el usuario entrenó.
        $workoutDates = WorkoutSession::query()
            // Esta línea sirve para filtrar por el usuario.
            ->where('user_id', $this->user->id)
            // Esta línea sirve para quedarse solo con las sesiones completadas.
            ->where('completed', true)
            // Esta línea sirve para filtrar hasta la fecha que se está recalculando.
            ->whereDate('performed_at', '<=', $this->date)
            // Esta línea sirve para quitar las fechas repetidas.
            ->distinct()
            // Esta línea sirve para obtener solo la fecha de cada sesión.
            ->pluck('performed_at')
            // Esta línea sirve para convertir cada fecha a texto Y-m-d.
            ->map(fn ($date) => $date->toDateString())
            // Esta línea sirve para convertir la colección en un arreglo.
            ->all();

        // Esta línea sirve para calcular la racha de días seguidos hasta esa fecha.
        $streak = $streakCalculator->calculate($workoutDates, CarbonImmutable::parse($this->date));

        // No usamos updateOrCreate() con 'stat_date' en el where: el cast
        // `date` persiste como datetime completo (Y-m-d H:i:s), así que una
        // igualdad exacta contra el string "Y-m-d" nunca matchea la fila
        // existente y termina duplicándola (choca con el índice único).
        // Esta línea sirve para buscar el registro de estadísticas de ese día.
        $stat = UserStatsDaily::query()
            // Esta línea sirve para filtrar por el usuario.
            ->where('user_id', $this->user->id)
            // Esta línea sirve para filtrar por la fecha.
            ->whereDate('stat_date', $this->date)
            // Esta línea sirve para obtener el registro o crear uno nuevo en memoria.
            ->first() ?? new UserStatsDaily(['user_id' => $this->user->id, 'stat_date' => $this->date]);

        // Esta línea sirve para guardar la racha que había antes del recálculo.
        $previousStreak = (int) ($stat->current_streak_days ?? 0);

        // Esta línea sirve para llenar los datos del registro.
        $stat->fill([
            // Esta línea sirve para guardar la cantidad de entrenamientos.
            'workouts_count' => $sessions->count(),
            // Esta línea sirve para guardar la cantidad de series efectivas.
            'total_sets' => $workingSets->count(),
            // Esta línea sirve para guardar el volumen total redondeado a 2 decimales.
            'total_volume_kg' => round($totalVolumeKg, 2),
            // Esta línea sirve para guardar los minutos entrenados.
            'training_minutes' => (int) $sessions->sum('duration_minutes'),
            // Esta línea sirve para guardar la racha actual.
            'current_streak_days' => $streak,
            // Esta línea sirve para guardar el registro en la base de datos.
        ])->save();

        // Esta línea sirve para borrar la caché del dashboard del usuario.
        Cache::forget(CacheKeys::statsDashboard($this->user->id));

        // Solo dispara si el umbral se cruza recién ahora, no en cada
        // recálculo posterior mientras la racha se mantenga por encima.
        // Esta línea sirve para buscar si la racha acaba de cruzar 7, 30 o 100 días.
        $crossedMilestone = collect([7, 30, 100])->first(fn (int $m) => $previousStreak < $m && $streak >= $m);
        // Esta línea sirve para revisar si cruzó algún hito.
        if ($crossedMilestone !== null) {
            // Esta línea sirve para disparar el evento de hito de racha.
            StreakMilestone::dispatch($this->user, $streak);
        }

        // Esta línea sirve para devolver el registro de estadísticas.
        return $stat;
    }
}
