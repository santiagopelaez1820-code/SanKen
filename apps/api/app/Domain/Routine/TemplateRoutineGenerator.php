<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres del dominio de rutinas.

namespace App\Domain\Routine;

// Esta línea sirve para importar el contrato de los motores de rutinas.
use App\Domain\Routine\Contracts\RoutineGeneratorInterface;
// Esta línea sirve para importar el servicio que calcula el volumen de la rutina.
use App\Domain\Routine\Services\RoutineVolumeCalculator;
// Esta línea sirve para importar el objeto que representa un día generado.
use App\Domain\Routine\ValueObjects\GeneratedDay;
// Esta línea sirve para importar el objeto que representa un ejercicio generado.
use App\Domain\Routine\ValueObjects\GeneratedExercise;
// Esta línea sirve para importar el objeto que representa una rutina generada.
use App\Domain\Routine\ValueObjects\GeneratedRoutine;
// Esta línea sirve para importar el objeto con el perfil del onboarding.
use App\Domain\Routine\ValueObjects\OnboardingProfile;
// Esta línea sirve para importar el modelo RoutineTemplate (plantilla de rutina).
use App\Models\RoutineTemplate;
// Esta línea sirve para importar la excepción que se lanza si no hay plantilla.
use RuntimeException;

/**
 * Motor de rutinas por plantillas curadas (sexo + dias/semana -> lista exacta
 * de ejercicios con su alternativa A/B, definidas en RoutineTemplateSeeder).
 * Reemplaza a RoutineGenerator (el motor algoritmico original, que queda sin
 * usar pero intacto en Domain/Routine/RoutineGenerator.php) como
 * implementacion activa de RoutineGeneratorInterface — ver AppServiceProvider.
 *
 * A diferencia del motor viejo, esta clase SI toca Eloquent directamente: no
 * hay nada que "seleccionar" o "rankear" QUÉ ejercicios van (eso lo define
 * la plantilla), solo CUÁNTO de la plantilla se usa y con qué series/reps/
 * descanso -- eso lo decide RoutineVolumeCalculator a partir de nivel +
 * objetivo + tiempo disponible (antes cada ejercicio salía siempre con 3
 * series x "12" reps sin importar quién fuera el usuario).
 */
// Esta línea sirve para declarar el motor de rutinas basado en plantillas (el que está activo).
final class TemplateRoutineGenerator implements RoutineGeneratorInterface
{
    // Esta línea sirve para definir la duración de la rutina en semanas.
    private const DURATION_WEEKS = 6;

    // Esta línea sirve para declarar el constructor que recibe sus dependencias.
    public function __construct(
        // Esta línea sirve para recibir el calculador de volumen (o crear uno por defecto).
        private readonly RoutineVolumeCalculator $volumeCalculator = new RoutineVolumeCalculator,
    ) {}

    // Esta línea sirve para declarar el método que genera la rutina.
    public function generate(OnboardingProfile $profile, array $exercisePool): GeneratedRoutine
    {
        // Esta línea sirve para buscar la plantilla que corresponde al usuario.
        $template = RoutineTemplate::query()
            // Esta línea sirve para filtrar por el mismo sexo.
            ->where('sex', $profile->sex)
            // Esta línea sirve para filtrar por la misma frecuencia semanal.
            ->where('frequency_days', $profile->frequencyDays)
            // Esta línea sirve para filtrar por el mismo nivel.
            ->where('level', $profile->level)
            // Esta línea sirve para exigir que la plantilla esté activa.
            ->where('is_active', true)
            // Esta línea sirve para cargar sus días con ejercicios y músculo principal.
            ->with(['days.exercises.exercise.primaryMuscle'])
            // Esta línea sirve para obtener la primera.
            ->first();

        // Esta línea sirve para revisar si no hay plantilla para esa combinación.
        if (! $template) {
            // Esta línea sirve para lanzar una excepción.
            throw new RuntimeException(
                // Esta línea sirve para armar el mensaje que indica sexo, frecuencia y nivel.
                "No hay plantilla de rutina para sexo=[{$profile->sex}] frecuencia=[{$profile->frequencyDays}] nivel=[{$profile->level}]."
            );
        }

        // Esta línea sirve para calcular series, repeticiones, descanso y cantidad de ejercicios.
        $params = $this->volumeCalculator->calculate($profile->level, $profile->primaryGoal(), $profile->sessionMinutes);

        // Esta línea sirve para transformar cada día de la plantilla en un día generado.
        $days = $template->days->map(function ($day) use ($params) {
            // take() sobre exercises ya ordenados por `order` -- los
            // primeros de cada bloque son siempre los compuestos (ver
            // Database\Seeders\Concerns\SeedsRoutineTemplates), así que
            // recortar por tiempo/nivel nunca sacrifica el movimiento
            // principal del día antes que sus variantes de aislamiento.
            // Esta línea sirve para tomar solo la cantidad de ejercicios permitida.
            $selected = $day->exercises->take($params->maxExercisesPerDay);

            // Esta línea sirve para convertir cada ejercicio de la plantilla en un ejercicio generado.
            $exercises = $selected->map(fn ($templateExercise, $index) => new GeneratedExercise(
                // Esta línea sirve para pasar el id del ejercicio.
                exerciseId: $templateExercise->exercise_id,
                // Esta línea sirve para pasar su posición.
                order: $index + 1,
                // Esta línea sirve para pasar las series calculadas.
                targetSets: $params->setsPerExercise,
                // Esta línea sirve para pasar las repeticiones calculadas.
                targetReps: $params->targetReps,
                // Esta línea sirve para pasar el descanso calculado.
                restSeconds: $params->restSeconds,
                // Esta línea sirve para pasar el RPE calculado.
                targetRpe: $params->targetRpe,
                // Esta línea sirve para reindexar y convertir en arreglo.
            ))->values()->all();

            // Se computa sobre $selected (el subset real), no sobre
            // $day->exercises completo -- si el recorte por tiempo deja
            // afuera al único ejercicio de un grupo muscular secundario del
            // día, ese grupo no debe aparecer como "trabajado hoy".
            // Esta línea sirve para calcular los grupos musculares que realmente se trabajan.
            $targetMuscleGroups = $selected
                // Esta línea sirve para tomar el músculo principal de cada ejercicio elegido.
                ->map(fn ($templateExercise) => $templateExercise->exercise->primaryMuscle->slug)
                // Esta línea sirve para quitar los repetidos.
                ->unique()
                // Esta línea sirve para reindexar la lista.
                ->values()
                // Esta línea sirve para convertir en arreglo.
                ->all();

            // Esta línea sirve para devolver el día generado.
            return new GeneratedDay(
                // Esta línea sirve para pasar el orden del día.
                order: $day->day_order,
                // Esta línea sirve para pasar la etiqueta del día.
                label: $day->label,
                // Esta línea sirve para pasar los grupos musculares.
                targetMuscleGroups: $targetMuscleGroups,
                // Esta línea sirve para pasar los ejercicios.
                exercises: $exercises,
            );
            // Esta línea sirve para reindexar los días y convertirlos en arreglo.
        })->values()->all();

        // Esta línea sirve para devolver la rutina generada.
        return new GeneratedRoutine(
            // Esta línea sirve para pasar el objetivo principal.
            goal: $profile->primaryGoal(),
            // Esta línea sirve para pasar el tipo de división de la plantilla.
            splitType: $template->split_type,
            // Esta línea sirve para pasar los días por semana.
            frequencyDays: $profile->frequencyDays,
            // Esta línea sirve para pasar la duración en semanas.
            durationWeeks: self::DURATION_WEEKS,
            // Esta línea sirve para pasar los días generados.
            days: $days,
        );
    }
}
