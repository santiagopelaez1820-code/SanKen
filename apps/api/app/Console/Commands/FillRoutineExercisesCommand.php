<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los comandos de consola.

namespace App\Console\Commands;

// Esta línea sirve para importar el servicio que calcula el volumen de una rutina.
use App\Domain\Routine\Services\RoutineVolumeCalculator;
// Esta línea sirve para importar el modelo Routine (rutina).
use App\Models\Routine;
// Esta línea sirve para importar el modelo RoutineTemplate (plantilla de rutina).
use App\Models\RoutineTemplate;
// Esta línea sirve para importar la clase que arma las claves de caché.
use App\Support\CacheKeys;
// Esta línea sirve para importar la clase base de los comandos de Artisan.
use Illuminate\Console\Command;
// Esta línea sirve para importar la fachada Cache para borrar la caché.
use Illuminate\Support\Facades\Cache;
// Esta línea sirve para importar la fachada DB para usar transacciones.
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
// Esta línea sirve para declarar el comando que completa ejercicios faltantes en las rutinas del motor.
class FillRoutineExercisesCommand extends Command
{
    // Esta línea sirve para definir el nombre del comando y su opción de simulación.
    protected $signature = 'routines:fill-exercises {--dry-run : Solo muestra qué se agregaría, sin guardar}';

    // Esta línea sirve para definir la descripción que se muestra en la ayuda de Artisan.
    protected $description = 'Agrega los ejercicios faltantes (mínimo 6, máximo 8 por día) a las rutinas activas generadas por el motor.';

    // Esta línea sirve para declarar el método principal que recibe el calculador de volumen.
    public function handle(RoutineVolumeCalculator $calculator): int
    {
        // Esta línea sirve para leer si es una simulación.
        $dryRun = (bool) $this->option('dry-run');
        // Esta línea sirve para iniciar el contador de rutinas modificadas.
        $routinesTouched = 0;
        // Esta línea sirve para iniciar el contador de ejercicios agregados.
        $exercisesAdded = 0;

        // Esta línea sirve para consultar las rutinas a revisar.
        $routines = Routine::query()
            // Esta línea sirve para filtrar solo las generadas por el motor.
            ->where('source', 'engine')
            // Esta línea sirve para filtrar solo las activas.
            ->where('is_active', true)
            // Esta línea sirve para cargar el usuario con su perfil, su onboarding y los días con ejercicios.
            ->with(['user.profile', 'user.onboardingResponse', 'days.exercises'])
            // Esta línea sirve para ejecutar la consulta.
            ->get();

        // Esta línea sirve para recorrer cada rutina.
        foreach ($routines as $routine) {
            // Esta línea sirve para obtener el onboarding del dueño de la rutina.
            $onboarding = $routine->user?->onboardingResponse;
            // Esta línea sirve para obtener el sexo del dueño de la rutina.
            $sex = $routine->user?->profile?->sex;

            // Esta línea sirve para revisar si falta el onboarding o el sexo.
            if (! $onboarding || ! $sex) {
                // Esta línea sirve para avisar que la rutina se omite.
                $this->warn("Rutina #{$routine->id}: el usuario no tiene onboarding/perfil completo, se omite.");

                // Esta línea sirve para saltar a la siguiente rutina.
                continue;
            }

            // Esta línea sirve para buscar la plantilla que corresponde al usuario.
            $template = RoutineTemplate::query()
                // Esta línea sirve para filtrar por el mismo sexo.
                ->where('sex', $sex)
                // Esta línea sirve para filtrar por la misma frecuencia semanal.
                ->where('frequency_days', $routine->frequency_days)
                // Esta línea sirve para filtrar por el mismo nivel.
                ->where('level', $onboarding->level)
                // Esta línea sirve para exigir que la plantilla esté activa.
                ->where('is_active', true)
                // Esta línea sirve para cargar sus días con ejercicios y músculo principal.
                ->with(['days.exercises.exercise.primaryMuscle'])
                // Esta línea sirve para obtener la primera que coincida.
                ->first();

            // Esta línea sirve para revisar si no hay plantilla para esa combinación.
            if (! $template) {
                // Esta línea sirve para avisar que la rutina se omite.
                $this->warn("Rutina #{$routine->id}: no hay plantilla activa para {$sex}/{$routine->frequency_days} días/{$onboarding->level}, se omite.");

                // Esta línea sirve para saltar a la siguiente rutina.
                continue;
            }

            // Esta línea sirve para calcular el volumen (series, repeticiones, descanso) según nivel, objetivo y tiempo.
            $params = $calculator->calculate($onboarding->level, $routine->goal, $onboarding->session_minutes ?? 45);
            // Esta línea sirve para tomar un ejercicio existente como referencia de series y repeticiones.
            $reference = $routine->days->flatMap->exercises->first();
            // Esta línea sirve para iniciar el contador de ejercicios agregados a esta rutina.
            $added = 0;

            // Esta línea sirve para hacer los cambios de la rutina dentro de una transacción.
            DB::transaction(function () use ($routine, $template, $params, $reference, $dryRun, &$added) {
                // Esta línea sirve para recorrer cada día de la rutina.
                foreach ($routine->days as $day) {
                    // Esta línea sirve para buscar el día equivalente en la plantilla.
                    $templateDay = $template->days->firstWhere('day_order', $day->day_order);

                    // Esta línea sirve para revisar si la plantilla no tiene ese día.
                    if (! $templateDay) {
                        // Esta línea sirve para saltar al siguiente día.
                        continue;
                    }

                    // Esta línea sirve para calcular cuántos ejercicios debería tener el día.
                    $target = min($params->maxExercisesPerDay, $templateDay->exercises->count());
                    // Esta línea sirve para obtener los ids de los ejercicios que ya tiene.
                    $existingIds = $day->exercises->pluck('exercise_id')->all();
                    // Esta línea sirve para calcular cuántos faltan.
                    $missing = $target - count($existingIds);

                    // Esta línea sirve para revisar si no falta ninguno.
                    if ($missing <= 0) {
                        // Esta línea sirve para saltar al siguiente día.
                        continue;
                    }

                    // Esta línea sirve para obtener la última posición usada en el día.
                    $order = (int) $day->exercises->max('order');
                    // Esta línea sirve para obtener los grupos musculares del día.
                    $muscles = $day->target_muscle_groups ?? [];

                    // El motor toma los primeros N de la plantilla en orden y un
                    // cambio de ejercicio reemplaza la fila en su lugar, así que las
                    // filas existentes ocupan las posiciones 1..N de la plantilla:
                    // lo que falta es lo que sigue. No se compara contra las
                    // alternativas: son globales (un par de otro bloque/sexo no
                    // significa que ese ejercicio ya esté en este día).
                    // Esta línea sirve para recorrer los ejercicios de la plantilla que siguen después de los existentes.
                    foreach ($templateDay->exercises->slice(count($existingIds)) as $templateExercise) {
                        // Esta línea sirve para revisar si ya no falta ninguno.
                        if ($missing === 0) {
                            // Esta línea sirve para salir del ciclo.
                            break;
                        }

                        // Esta línea sirve para obtener el ejercicio del catálogo.
                        $exercise = $templateExercise->exercise;

                        // Esta línea sirve para revisar si el día ya tiene ese ejercicio.
                        if (in_array($exercise->id, $existingIds, true)) {
                            // Esta línea sirve para saltar al siguiente ejercicio.
                            continue;
                        }

                        // Esta línea sirve para revisar si no es una simulación.
                        if (! $dryRun) {
                            // Esta línea sirve para crear el ejercicio en el día de la rutina.
                            $day->exercises()->create([
                                // Esta línea sirve para guardar qué ejercicio del catálogo es.
                                'exercise_id' => $exercise->id,
                                // Esta línea sirve para guardar la posición siguiente.
                                'order' => ++$order,
                                // Esta línea sirve para copiar las series de la referencia o usar las calculadas.
                                'target_sets' => $reference->target_sets ?? $params->setsPerExercise,
                                // Esta línea sirve para copiar las repeticiones de la referencia o usar las calculadas.
                                'target_reps' => $reference->target_reps ?? $params->targetReps,
                                // Esta línea sirve para copiar el descanso de la referencia o usar el calculado.
                                'rest_seconds' => $reference->rest_seconds ?? $params->restSeconds,
                                // Esta línea sirve para copiar el RPE de la referencia o usar el calculado.
                                'target_rpe' => $reference->target_rpe ?? $params->targetRpe,
                                // Esta línea sirve para dejar sin peso sugerido.
                                'suggested_weight_kg' => null,
                            ]);
                        }

                        // Esta línea sirve para agregar el ejercicio a la lista de existentes.
                        $existingIds[] = $exercise->id;
                        // Esta línea sirve para agregar su músculo principal a los grupos del día.
                        $muscles[] = $exercise->primaryMuscle->slug;
                        // Esta línea sirve para restar uno a los faltantes.
                        $missing--;
                        // Esta línea sirve para sumar uno a los agregados.
                        $added++;
                    }

                    // Esta línea sirve para revisar si no es una simulación.
                    if (! $dryRun) {
                        // Esta línea sirve para actualizar los grupos musculares del día sin repetidos.
                        $day->update(['target_muscle_groups' => array_values(array_unique($muscles))]);
                    }
                }
            });

            // Esta línea sirve para revisar si se agregó algún ejercicio a esta rutina.
            if ($added > 0) {
                // Esta línea sirve para sumar uno a las rutinas modificadas.
                $routinesTouched++;
                // Esta línea sirve para sumar los ejercicios agregados al total.
                $exercisesAdded += $added;
                // Esta línea sirve para mostrar cuántos ejercicios se agregaron a la rutina.
                $this->line("Rutina #{$routine->id} (usuario #{$routine->user_id}): +{$added} ejercicios.");

                // Esta línea sirve para revisar si no es una simulación.
                if (! $dryRun) {
                    // Esta línea sirve para borrar de la caché la rutina activa del usuario.
                    Cache::forget(CacheKeys::activeRoutine($routine->user_id));
                }
            }
        }

        // Esta línea sirve para elegir el texto inicial según si es simulación o no.
        $prefix = $dryRun ? '[dry-run] Se agregarían' : 'Agregados';
        // Esta línea sirve para mostrar el resumen final del comando.
        $this->info("{$prefix} {$exercisesAdded} ejercicios en {$routinesTouched} rutinas (de {$routines->count()} rutinas activas del motor).");

        // Esta línea sirve para terminar con éxito.
        return self::SUCCESS;
    }
}
