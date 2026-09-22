<?php

namespace App\Domain\Routine;

use App\Domain\Routine\Contracts\RoutineGeneratorInterface;
use App\Domain\Routine\Services\RoutineVolumeCalculator;
use App\Domain\Routine\ValueObjects\GeneratedDay;
use App\Domain\Routine\ValueObjects\GeneratedExercise;
use App\Domain\Routine\ValueObjects\GeneratedRoutine;
use App\Domain\Routine\ValueObjects\OnboardingProfile;
use App\Models\RoutineTemplate;
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
final class TemplateRoutineGenerator implements RoutineGeneratorInterface
{
    private const DURATION_WEEKS = 6;

    public function __construct(
        private readonly RoutineVolumeCalculator $volumeCalculator = new RoutineVolumeCalculator(),
    ) {}

    public function generate(OnboardingProfile $profile, array $exercisePool): GeneratedRoutine
    {
        $template = RoutineTemplate::query()
            ->where('sex', $profile->sex)
            ->where('frequency_days', $profile->frequencyDays)
            ->where('level', $profile->level)
            ->where('is_active', true)
            ->with(['days.exercises.exercise.primaryMuscle'])
            ->first();

        if (! $template) {
            throw new RuntimeException(
                "No hay plantilla de rutina para sexo=[{$profile->sex}] frecuencia=[{$profile->frequencyDays}] nivel=[{$profile->level}]."
            );
        }

        $params = $this->volumeCalculator->calculate($profile->level, $profile->primaryGoal(), $profile->sessionMinutes);

        $days = $template->days->map(function ($day) use ($params) {
            // take() sobre exercises ya ordenados por `order` -- los
            // primeros de cada bloque son siempre los compuestos (ver
            // Database\Seeders\Concerns\SeedsRoutineTemplates), así que
            // recortar por tiempo/nivel nunca sacrifica el movimiento
            // principal del día antes que sus variantes de aislamiento.
            $selected = $day->exercises->take($params->maxExercisesPerDay);

            $exercises = $selected->map(fn ($templateExercise, $index) => new GeneratedExercise(
                exerciseId: $templateExercise->exercise_id,
                order: $index + 1,
                targetSets: $params->setsPerExercise,
                targetReps: $params->targetReps,
                restSeconds: $params->restSeconds,
                targetRpe: $params->targetRpe,
            ))->values()->all();

            // Se computa sobre $selected (el subset real), no sobre
            // $day->exercises completo -- si el recorte por tiempo deja
            // afuera al único ejercicio de un grupo muscular secundario del
            // día, ese grupo no debe aparecer como "trabajado hoy".
            $targetMuscleGroups = $selected
                ->map(fn ($templateExercise) => $templateExercise->exercise->primaryMuscle->slug)
                ->unique()
                ->values()
                ->all();

            return new GeneratedDay(
                order: $day->day_order,
                label: $day->label,
                targetMuscleGroups: $targetMuscleGroups,
                exercises: $exercises,
            );
        })->values()->all();

        return new GeneratedRoutine(
            goal: $profile->primaryGoal(),
            splitType: $template->split_type,
            frequencyDays: $profile->frequencyDays,
            durationWeeks: self::DURATION_WEEKS,
            days: $days,
        );
    }
}
