<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los servicios de soporte.

namespace App\Domain\Support\Services;

// Esta línea sirve para importar el modelo User (usuario).
use App\Models\User;
// Esta línea sirve para importar el modelo WeeklyCheckin (check-in semanal).
use App\Models\WeeklyCheckin;
// Esta línea sirve para importar el modelo WorkoutSession (sesión de entrenamiento).
use App\Models\WorkoutSession;
// Esta línea sirve para importar CarbonImmutable para manejar fechas.
use Carbon\CarbonImmutable;
// Esta línea sirve para importar la interfaz de fechas de Carbon.
use Carbon\CarbonInterface;
// Esta línea sirve para importar el constructor de consultas de Eloquent.
use Illuminate\Database\Eloquent\Builder;

/**
 * Reglas del check-in semanal (ver config/support.php → checkin):
 *
 * - Semana = semana ISO ("2026-W39") en la zona configurada (America/Bogota),
 *   así el cambio de semana, de mes y de año (la semana 1 de un año ISO puede
 *   empezar en diciembre) lo resuelve el calendario ISO y no la fecha suelta.
 * - Se ofrece del viernes al domingo, a cuentas con onboarding completo, no
 *   suspendidas/desactivadas, con al menos N días de antigüedad y que no
 *   sean del equipo de soporte (super_admin). Entrenadores sí lo reciben.
 * - Una sola fila por usuario y semana (índice único): nunca hay dos
 *   check-ins de la misma semana, aunque la app se abra 20 veces.
 * - "Ahora no" lo pospone unas horas, como mucho max_postpones veces; después
 *   queda 'dismissed' y no se insiste más esa semana.
 * - Una semana que termina sin respuesta simplemente queda en el pasado (se
 *   cuenta como "ignorado" en las métricas): no se arrastra a la siguiente.
 */
// Esta línea sirve para declarar el servicio con las reglas del check-in semanal.
class WeeklyCheckinService
{
    // Esta línea sirve para declarar el método que devuelve la fecha actual en la zona del check-in.
    public function now(): CarbonImmutable
    {
        // Esta línea sirve para devolver la fecha actual en la zona configurada (Bogotá).
        return CarbonImmutable::now(config('support.checkin.timezone'));
    }

    // Esta línea sirve para declarar el método que calcula la clave de la semana ISO.
    public function weekKey(?CarbonInterface $at = null): string
    {
        // Esta línea sirve para pasar la fecha a la zona configurada.
        $local = CarbonImmutable::instance($at ?? $this->now())->setTimezone(config('support.checkin.timezone'));

        // Esta línea sirve para devolver la semana con formato "2026-W39".
        return $local->isoFormat('GGGG-[W]WW');
    }

    // Esta línea sirve para declarar el método que revisa si el check-in está disponible.
    public function isWindowOpen(?CarbonInterface $at = null): bool
    {
        // Esta línea sirve para pasar la fecha a la zona configurada.
        $local = CarbonImmutable::instance($at ?? $this->now())->setTimezone(config('support.checkin.timezone'));

        // Esta línea sirve para devolver verdadero si ya es el día de la semana configurado o después.
        return $local->dayOfWeekIso >= (int) config('support.checkin.available_from_iso_day');
    }

    /**
     * @param  Builder<User>  $query
     * @return Builder<User>
     */
    // Esta línea sirve para declarar el método que arma la consulta de usuarios elegibles.
    public function eligibleUsersQuery(Builder $query, ?CarbonInterface $at = null): Builder
    {
        // Esta línea sirve para usar la fecha actual si no se indicó otra.
        $at ??= $this->now();

        // Esta línea sirve para devolver la consulta con los filtros.
        return $query
            // El equipo de soporte (super_admin) atiende los check-ins; no se
            // le pregunta a sí mismo (le aparecería encima del panel).
            // Esta línea sirve para excluir a los super admins.
            ->where('role', '!=', 'super_admin')
            // Esta línea sirve para excluir a los usuarios baneados.
            ->where('is_banned', false)
            // Esta línea sirve para excluir a los usuarios desactivados.
            ->whereNull('deactivated_at')
            // Esta línea sirve para exigir la antigüedad mínima de cuenta configurada.
            ->where('created_at', '<=', CarbonImmutable::instance($at)->subDays((int) config('support.checkin.min_account_age_days'))->utc())
            // Esta línea sirve para exigir que el onboarding esté completo.
            ->whereHas('onboardingResponse', fn (Builder $q) => $q->where('completed', true));
    }

    // Esta línea sirve para declarar el método que revisa si un usuario es elegible.
    public function isEligible(User $user, ?CarbonInterface $at = null): bool
    {
        // Esta línea sirve para devolver verdadero si el usuario cumple los filtros de elegibilidad.
        return $this->eligibleUsersQuery(User::query()->whereKey($user->id), $at)->exists();
    }

    /**
     * El check-in de esta semana (lo crea la primera vez), o null si todavía
     * no corresponde (fuera de la ventana o usuario no elegible).
     */
    // Esta línea sirve para declarar el método que obtiene o crea el check-in de esta semana.
    public function currentFor(User $user, ?CarbonInterface $at = null): ?WeeklyCheckin
    {
        // Esta línea sirve para usar la fecha actual si no se indicó otra.
        $at ??= $this->now();

        // Esta línea sirve para revisar si la ventana está cerrada o el usuario no es elegible.
        if (! $this->isWindowOpen($at) || ! $this->isEligible($user, $at)) {
            // Esta línea sirve para devolver null porque todavía no corresponde.
            return null;
        }

        // Esta línea sirve para buscar el check-in de esta semana o crearlo.
        return WeeklyCheckin::query()->firstOrCreate(
            // Esta línea sirve para buscar por usuario y semana.
            ['user_id' => $user->id, 'week' => $this->weekKey($at)],
            // Esta línea sirve para dejarlo, al crearlo, pendiente y con el contexto de entrenamiento.
            ['status' => WeeklyCheckin::STATUS_PENDING, 'context' => $this->trainingContext($user, $at)],
        );
    }

    /** ¿Hay que mostrarlo ahora? Pendiente, o pospuesto y ya pasó el plazo. */
    // Esta línea sirve para declarar el método que decide si hay que mostrar el check-in ahora.
    public function shouldPrompt(WeeklyCheckin $checkin, ?CarbonInterface $at = null): bool
    {
        // Esta línea sirve para usar la fecha actual si no se indicó otra.
        $at ??= $this->now();

        // Esta línea sirve para revisar si el check-in no es de esta semana.
        if ($checkin->week !== $this->weekKey($at)) {
            // Esta línea sirve para devolver falso.
            return false;
        }

        // Esta línea sirve para decidir según el estado del check-in.
        return match ($checkin->status) {
            // Esta línea sirve para mostrarlo si está pendiente.
            WeeklyCheckin::STATUS_PENDING => true,
            // Esta línea sirve para mostrarlo si está pospuesto y ya pasó el plazo.
            WeeklyCheckin::STATUS_POSTPONED => $checkin->postponed_until === null || $checkin->postponed_until->lte($at),
            // Esta línea sirve para ocultarlo en cualquier otro estado.
            default => false,
        };
    }

    // Esta línea sirve para declarar el método que revisa si el check-in es de esta semana.
    public function isCurrentWeek(WeeklyCheckin $checkin): bool
    {
        // Esta línea sirve para comparar la semana del check-in con la actual.
        return $checkin->week === $this->weekKey();
    }

    // Esta línea sirve para declarar el método que registra cuándo se mostró el check-in.
    public function markShown(WeeklyCheckin $checkin): void
    {
        // Esta línea sirve para revisar si todavía no se había registrado.
        if (! $checkin->shown_at) {
            // Esta línea sirve para guardar la fecha actual como momento en que se mostró.
            $checkin->forceFill(['shown_at' => now()])->save();
        }
    }

    // Esta línea sirve para declarar el método que pospone el check-in.
    public function postpone(WeeklyCheckin $checkin): WeeklyCheckin
    {
        // Esta línea sirve para sumar uno a la cantidad de aplazamientos.
        $count = $checkin->postpone_count + 1;
        // Esta línea sirve para revisar si se llegó al máximo permitido.
        $exhausted = $count >= (int) config('support.checkin.max_postpones');

        // Esta línea sirve para actualizar el check-in.
        $checkin->forceFill([
            // Esta línea sirve para guardar la cantidad de aplazamientos.
            'postpone_count' => $count,
            // Esta línea sirve para descartarlo si se agotaron los aplazamientos, si no posponerlo.
            'status' => $exhausted ? WeeklyCheckin::STATUS_DISMISSED : WeeklyCheckin::STATUS_POSTPONED,
            // Esta línea sirve para calcular hasta cuándo se pospone (null si se descartó).
            'postponed_until' => $exhausted ? null : now()->addHours((int) config('support.checkin.postpone_hours')),
            // Esta línea sirve para guardar cuándo se mostró, o ahora si no estaba registrado.
            'shown_at' => $checkin->shown_at ?? now(),
            // Esta línea sirve para guardar los cambios en la base de datos.
        ])->save();

        // Esta línea sirve para devolver el check-in actualizado.
        return $checkin;
    }

    /**
     * Contexto mínimo de entrenamiento de la semana, útil para interpretar la
     * respuesta (y, a futuro, para personalizar rutinas): rutina activa y
     * cuántas sesiones completó. Nada de datos de salud adicionales.
     *
     * @return array{routine_id: int|null, sessions_completed_this_week: int}
     */
    // Esta línea sirve para declarar el método que arma el contexto de entrenamiento de la semana.
    public function trainingContext(User $user, ?CarbonInterface $at = null): array
    {
        // Esta línea sirve para pasar la fecha a la zona configurada.
        $local = CarbonImmutable::instance($at ?? $this->now())->setTimezone(config('support.checkin.timezone'));

        // Semana ISO explícita (lunes a domingo): en Carbon 3 startOfWeek() sin
        // argumento depende del locale ('en' empieza el domingo).
        // Esta línea sirve para devolver el contexto.
        return [
            // Esta línea sirve para incluir el id de la rutina activa (o null).
            'routine_id' => $user->activeRoutine()->first()?->id,
            // Esta línea sirve para contar las sesiones completadas esta semana.
            'sessions_completed_this_week' => WorkoutSession::query()
                // Esta línea sirve para filtrar por el usuario.
                ->where('user_id', $user->id)
                // Esta línea sirve para filtrar solo las completadas.
                ->where('completed', true)
                // Esta línea sirve para filtrar entre el lunes y el domingo de esta semana.
                ->whereBetween('performed_at', [
                    // Esta línea sirve para indicar el lunes como inicio.
                    $local->startOfWeek(CarbonInterface::MONDAY)->toDateString(),
                    // Esta línea sirve para indicar el domingo como fin.
                    $local->endOfWeek(CarbonInterface::SUNDAY)->toDateString(),
                ])
                // Esta línea sirve para contarlas.
                ->count(),
        ];
    }
}
