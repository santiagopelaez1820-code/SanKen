<?php

namespace App\Domain\Support\Services;

use App\Models\User;
use App\Models\WeeklyCheckin;
use App\Models\WorkoutSession;
use Carbon\CarbonImmutable;
use Carbon\CarbonInterface;
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
class WeeklyCheckinService
{
    public function now(): CarbonImmutable
    {
        return CarbonImmutable::now(config('support.checkin.timezone'));
    }

    public function weekKey(?CarbonInterface $at = null): string
    {
        $local = CarbonImmutable::instance($at ?? $this->now())->setTimezone(config('support.checkin.timezone'));

        return $local->isoFormat('GGGG-[W]WW');
    }

    public function isWindowOpen(?CarbonInterface $at = null): bool
    {
        $local = CarbonImmutable::instance($at ?? $this->now())->setTimezone(config('support.checkin.timezone'));

        return $local->dayOfWeekIso >= (int) config('support.checkin.available_from_iso_day');
    }

    /**
     * @param  Builder<User>  $query
     * @return Builder<User>
     */
    public function eligibleUsersQuery(Builder $query, ?CarbonInterface $at = null): Builder
    {
        $at ??= $this->now();

        return $query
            // El equipo de soporte (super_admin) atiende los check-ins; no se
            // le pregunta a sí mismo (le aparecería encima del panel).
            ->where('role', '!=', 'super_admin')
            ->where('is_banned', false)
            ->whereNull('deactivated_at')
            ->where('created_at', '<=', CarbonImmutable::instance($at)->subDays((int) config('support.checkin.min_account_age_days'))->utc())
            ->whereHas('onboardingResponse', fn (Builder $q) => $q->where('completed', true));
    }

    public function isEligible(User $user, ?CarbonInterface $at = null): bool
    {
        return $this->eligibleUsersQuery(User::query()->whereKey($user->id), $at)->exists();
    }

    /**
     * El check-in de esta semana (lo crea la primera vez), o null si todavía
     * no corresponde (fuera de la ventana o usuario no elegible).
     */
    public function currentFor(User $user, ?CarbonInterface $at = null): ?WeeklyCheckin
    {
        $at ??= $this->now();

        if (! $this->isWindowOpen($at) || ! $this->isEligible($user, $at)) {
            return null;
        }

        return WeeklyCheckin::query()->firstOrCreate(
            ['user_id' => $user->id, 'week' => $this->weekKey($at)],
            ['status' => WeeklyCheckin::STATUS_PENDING, 'context' => $this->trainingContext($user, $at)],
        );
    }

    /** ¿Hay que mostrarlo ahora? Pendiente, o pospuesto y ya pasó el plazo. */
    public function shouldPrompt(WeeklyCheckin $checkin, ?CarbonInterface $at = null): bool
    {
        $at ??= $this->now();

        if ($checkin->week !== $this->weekKey($at)) {
            return false;
        }

        return match ($checkin->status) {
            WeeklyCheckin::STATUS_PENDING => true,
            WeeklyCheckin::STATUS_POSTPONED => $checkin->postponed_until === null || $checkin->postponed_until->lte($at),
            default => false,
        };
    }

    public function isCurrentWeek(WeeklyCheckin $checkin): bool
    {
        return $checkin->week === $this->weekKey();
    }

    public function markShown(WeeklyCheckin $checkin): void
    {
        if (! $checkin->shown_at) {
            $checkin->forceFill(['shown_at' => now()])->save();
        }
    }

    public function postpone(WeeklyCheckin $checkin): WeeklyCheckin
    {
        $count = $checkin->postpone_count + 1;
        $exhausted = $count >= (int) config('support.checkin.max_postpones');

        $checkin->forceFill([
            'postpone_count' => $count,
            'status' => $exhausted ? WeeklyCheckin::STATUS_DISMISSED : WeeklyCheckin::STATUS_POSTPONED,
            'postponed_until' => $exhausted ? null : now()->addHours((int) config('support.checkin.postpone_hours')),
            'shown_at' => $checkin->shown_at ?? now(),
        ])->save();

        return $checkin;
    }

    /**
     * Contexto mínimo de entrenamiento de la semana, útil para interpretar la
     * respuesta (y, a futuro, para personalizar rutinas): rutina activa y
     * cuántas sesiones completó. Nada de datos de salud adicionales.
     *
     * @return array{routine_id: int|null, sessions_completed_this_week: int}
     */
    public function trainingContext(User $user, ?CarbonInterface $at = null): array
    {
        $local = CarbonImmutable::instance($at ?? $this->now())->setTimezone(config('support.checkin.timezone'));

        // Semana ISO explícita (lunes a domingo): en Carbon 3 startOfWeek() sin
        // argumento depende del locale ('en' empieza el domingo).
        return [
            'routine_id' => $user->activeRoutine()->first()?->id,
            'sessions_completed_this_week' => WorkoutSession::query()
                ->where('user_id', $user->id)
                ->where('completed', true)
                ->whereBetween('performed_at', [
                    $local->startOfWeek(CarbonInterface::MONDAY)->toDateString(),
                    $local->endOfWeek(CarbonInterface::SUNDAY)->toDateString(),
                ])
                ->count(),
        ];
    }
}
