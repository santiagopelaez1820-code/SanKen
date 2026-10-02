<?php

namespace App\Console\Commands;

use App\Domain\Routine\Services\RoutineVolumeCalculator;
use App\Models\Routine;
use App\Models\RoutineTemplate;
use App\Support\CacheKeys;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

/**
 * Completa las rutinas activas generadas por el motor (source=engine) que
 * quedaron con menos ejercicios por día de los que hoy arma
 * TemplateRoutineGenerator (rango 6-8, ver RoutineVolumeCalculator).
 *
 * Solo AGREGA lo que falta, en el mismo orden de la plantilla del usuario:
 * no borra, no reordena y no revierte los cambios de ejercicio que el
 * usuario ya hizo (una fila cambiada por su alternativa sigue ocupando la
 * posición de ese ejercicio de la plantilla). Los ejercicios nuevos toman las mismas
 * series/reps/descanso/RPE que ya tiene la rutina. Las rutinas asignadas
 * por un entrenador o por Super Admin no se tocan. Es idempotente.
 */
class FillRoutineExercisesCommand extends Command
{
    protected $signature = 'routines:fill-exercises {--dry-run : Solo muestra qué se agregaría, sin guardar}';

    protected $description = 'Agrega los ejercicios faltantes (mínimo 6, máximo 8 por día) a las rutinas activas generadas por el motor.';

    public function handle(RoutineVolumeCalculator $calculator): int
    {
        $dryRun = (bool) $this->option('dry-run');
        $routinesTouched = 0;
        $exercisesAdded = 0;

        $routines = Routine::query()
            ->where('source', 'engine')
            ->where('is_active', true)
            ->with(['user.profile', 'user.onboardingResponse', 'days.exercises'])
            ->get();

        foreach ($routines as $routine) {
            $onboarding = $routine->user?->onboardingResponse;
            $sex = $routine->user?->profile?->sex;

            if (! $onboarding || ! $sex) {
                $this->warn("Rutina #{$routine->id}: el usuario no tiene onboarding/perfil completo, se omite.");

                continue;
            }

            $template = RoutineTemplate::query()
                ->where('sex', $sex)
                ->where('frequency_days', $routine->frequency_days)
                ->where('level', $onboarding->level)
                ->where('is_active', true)
                ->with(['days.exercises.exercise.primaryMuscle'])
                ->first();

            if (! $template) {
                $this->warn("Rutina #{$routine->id}: no hay plantilla activa para {$sex}/{$routine->frequency_days} días/{$onboarding->level}, se omite.");

                continue;
            }

            $params = $calculator->calculate($onboarding->level, $routine->goal, $onboarding->session_minutes ?? 45);
            $reference = $routine->days->flatMap->exercises->first();
            $added = 0;

            DB::transaction(function () use ($routine, $template, $params, $reference, $dryRun, &$added) {
                foreach ($routine->days as $day) {
                    $templateDay = $template->days->firstWhere('day_order', $day->day_order);

                    if (! $templateDay) {
                        continue;
                    }

                    $target = min($params->maxExercisesPerDay, $templateDay->exercises->count());
                    $existingIds = $day->exercises->pluck('exercise_id')->all();
                    $missing = $target - count($existingIds);

                    if ($missing <= 0) {
                        continue;
                    }

                    $order = (int) $day->exercises->max('order');
                    $muscles = $day->target_muscle_groups ?? [];

                    // El motor toma los primeros N de la plantilla en orden y un
                    // cambio de ejercicio reemplaza la fila en su lugar, así que las
                    // filas existentes ocupan las posiciones 1..N de la plantilla:
                    // lo que falta es lo que sigue. No se compara contra las
                    // alternativas: son globales (un par de otro bloque/sexo no
                    // significa que ese ejercicio ya esté en este día).
                    foreach ($templateDay->exercises->slice(count($existingIds)) as $templateExercise) {
                        if ($missing === 0) {
                            break;
                        }

                        $exercise = $templateExercise->exercise;

                        if (in_array($exercise->id, $existingIds, true)) {
                            continue;
                        }

                        if (! $dryRun) {
                            $day->exercises()->create([
                                'exercise_id' => $exercise->id,
                                'order' => ++$order,
                                'target_sets' => $reference->target_sets ?? $params->setsPerExercise,
                                'target_reps' => $reference->target_reps ?? $params->targetReps,
                                'rest_seconds' => $reference->rest_seconds ?? $params->restSeconds,
                                'target_rpe' => $reference->target_rpe ?? $params->targetRpe,
                                'suggested_weight_kg' => null,
                            ]);
                        }

                        $existingIds[] = $exercise->id;
                        $muscles[] = $exercise->primaryMuscle->slug;
                        $missing--;
                        $added++;
                    }

                    if (! $dryRun) {
                        $day->update(['target_muscle_groups' => array_values(array_unique($muscles))]);
                    }
                }
            });

            if ($added > 0) {
                $routinesTouched++;
                $exercisesAdded += $added;
                $this->line("Rutina #{$routine->id} (usuario #{$routine->user_id}): +{$added} ejercicios.");

                if (! $dryRun) {
                    Cache::forget(CacheKeys::activeRoutine($routine->user_id));
                }
            }
        }

        $prefix = $dryRun ? '[dry-run] Se agregarían' : 'Agregados';
        $this->info("{$prefix} {$exercisesAdded} ejercicios en {$routinesTouched} rutinas (de {$routines->count()} rutinas activas del motor).");

        return self::SUCCESS;
    }
}
