<?php

namespace App\Domain\Routine;

use App\Domain\Routine\Contracts\RoutineGeneratorInterface;
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
 * hay nada que "seleccionar" o "rankear", solo leer la plantilla ya armada.
 * Es la razon por la que la generacion pasa de un problema algoritmico a una
 * sola query con eager-load — sub-milisegundo en vez de un pipeline de
 * filtros/loops.
 */
final class TemplateRoutineGenerator implements RoutineGeneratorInterface
{
    private const DURATION_WEEKS = 6;

    public function generate(OnboardingProfile $profile, array $exercisePool): GeneratedRoutine
    {
        $template = RoutineTemplate::query()
            ->where('sex', $profile->sex)
            ->where('frequency_days', $profile->frequencyDays)
            ->where('is_active', true)
            ->with(['days.exercises.exercise.primaryMuscle'])
            ->first();

        if (! $template) {
            throw new RuntimeException(
                "No hay plantilla de rutina para sexo=[{$profile->sex}] frecuencia=[{$profile->frequencyDays}]."
            );
        }

        $days = $template->days->map(function ($day) {
            $exercises = $day->exercises->map(fn ($templateExercise, $index) => new GeneratedExercise(
                exerciseId: $templateExercise->exercise_id,
                order: $index + 1,
                targetSets: $templateExercise->default_sets,
                targetReps: $templateExercise->default_reps,
                restSeconds: $templateExercise->rest_seconds,
                targetRpe: (float) ($templateExercise->default_rpe ?? 8.0),
            ))->values()->all();

            $targetMuscleGroups = $day->exercises
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
