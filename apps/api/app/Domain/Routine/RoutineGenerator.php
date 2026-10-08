<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres del dominio de rutinas.

namespace App\Domain\Routine;

// Esta línea sirve para importar el contrato de los motores de rutinas.
use App\Domain\Routine\Contracts\RoutineGeneratorInterface;
// Esta línea sirve para importar el servicio que elige los ejercicios.
use App\Domain\Routine\Services\ExerciseSelector;
// Esta línea sirve para importar el servicio que asigna series, repeticiones y descanso.
use App\Domain\Routine\Services\SetRepRestAssigner;
// Esta línea sirve para importar el servicio que elige la división (split).
use App\Domain\Routine\Services\SplitSelector;
// Esta línea sirve para importar la fábrica de estrategias por objetivo.
use App\Domain\Routine\Strategies\RoutineStrategyFactory;
// Esta línea sirve para importar el objeto que representa un día generado.
use App\Domain\Routine\ValueObjects\GeneratedDay;
// Esta línea sirve para importar el objeto que representa una rutina generada.
use App\Domain\Routine\ValueObjects\GeneratedRoutine;
// Esta línea sirve para importar el objeto con el perfil del onboarding.
use App\Domain\Routine\ValueObjects\OnboardingProfile;

/**
 * Orquesta el pipeline completo del motor de rutinas (ver docs/01-arquitectura.md §6):
 * perfil -> estrategia por objetivo -> split -> selección de ejercicios -> series/reps/descanso.
 * Pura lógica de dominio: no toca Eloquent ni la base de datos.
 */
// Esta línea sirve para declarar el motor algorítmico de rutinas (implementa el contrato).
final class RoutineGenerator implements RoutineGeneratorInterface
{
    // Esta línea sirve para definir la duración de la rutina en semanas.
    private const DURATION_WEEKS = 6;

    /**
     * @param  array<string, array{target_reps: string, sets: int, rir: float, rest_seconds: int}>  $goalParametersConfig
     * @param  array<string, int>  $exercisesPerMuscleByLevel
     * @param  array<int, int>  $maxExercisesBySessionMinutes
     */
    // Esta línea sirve para declarar el constructor que recibe sus dependencias.
    public function __construct(
        // Esta línea sirve para recibir el selector de división.
        private readonly SplitSelector $splitSelector,
        // Esta línea sirve para recibir el selector de ejercicios.
        private readonly ExerciseSelector $exerciseSelector,
        // Esta línea sirve para recibir el asignador de series y repeticiones.
        private readonly SetRepRestAssigner $assigner,
        // Esta línea sirve para recibir la configuración de parámetros por objetivo.
        private readonly array $goalParametersConfig,
        // Esta línea sirve para recibir cuántos ejercicios por músculo según el nivel.
        private readonly array $exercisesPerMuscleByLevel,
        // Esta línea sirve para recibir el máximo de ejercicios según los minutos por sesión.
        private readonly array $maxExercisesBySessionMinutes,
    ) {}

    // Esta línea sirve para declarar el método que genera la rutina.
    public function generate(OnboardingProfile $profile, array $exercisePool): GeneratedRoutine
    {
        // Esta línea sirve para obtener el objetivo principal del perfil.
        $goal = $profile->primaryGoal();
        // Esta línea sirve para crear la estrategia de ese objetivo.
        $strategy = RoutineStrategyFactory::make($goal, $this->goalParametersConfig);
        // Esta línea sirve para elegir la división según los días por semana.
        $split = $this->splitSelector->selectFor($profile->frequencyDays);

        // Esta línea sirve para obtener cuántos ejercicios por músculo según el nivel (1 por defecto).
        $perMuscle = $this->exercisesPerMuscleByLevel[$profile->level] ?? 1;
        // Esta línea sirve para obtener el máximo de ejercicios por sesión según los minutos (5 por defecto).
        $maxTotal = $this->maxExercisesBySessionMinutes[$profile->sessionMinutes] ?? 5;

        // Esta línea sirve para iniciar la lista de días.
        $days = [];
        // Esta línea sirve para iniciar la lista de ejercicios ya usados en la rutina.
        $usedAcrossRoutine = [];

        // Esta línea sirve para recorrer cada día de la división.
        foreach ($split->days as $index => $dayDefinition) {
            // Esta línea sirve para elegir los ejercicios del día.
            $selectedIds = $this->exerciseSelector->select(
                // Esta línea sirve para pasar todos los ejercicios disponibles.
                pool: $exercisePool,
                // Esta línea sirve para pasar los músculos objetivo del día.
                targetMuscles: $dayDefinition->muscles,
                // Esta línea sirve para pasar el nivel del usuario.
                level: $profile->level,
                // Esta línea sirve para pasar el equipamiento disponible.
                equipmentAvailable: $profile->equipmentAvailable,
                // Esta línea sirve para pasar las lesiones del usuario.
                injuries: $profile->injuries,
                // Esta línea sirve para pasar cuántos ejercicios por músculo.
                perMuscle: $perMuscle,
                // Esta línea sirve para pasar el máximo de ejercicios del día.
                maxTotal: $maxTotal,
                // Esta línea sirve para pasar la proporción de compuestos de la estrategia.
                compoundRatio: $strategy->preferredCompoundRatio(),
                // Esta línea sirve para pasar los ejercicios ya usados para variar.
                excludeIds: $usedAcrossRoutine,
            );

            // Esta línea sirve para sumar los elegidos a los ya usados.
            $usedAcrossRoutine = [...$usedAcrossRoutine, ...$selectedIds];

            // Esta línea sirve para agregar el día generado a la lista.
            $days[] = new GeneratedDay(
                // Esta línea sirve para pasar el número de orden del día.
                order: $index + 1,
                // Esta línea sirve para pasar la etiqueta del día.
                label: $dayDefinition->label,
                // Esta línea sirve para pasar los grupos musculares del día.
                targetMuscleGroups: $dayDefinition->muscles,
                // Esta línea sirve para asignar series, repeticiones y descanso a los ejercicios.
                exercises: $this->assigner->assign($selectedIds, $strategy->goalParameters()),
            );
        }

        // Esta línea sirve para devolver la rutina generada.
        return new GeneratedRoutine(
            // Esta línea sirve para pasar el objetivo.
            goal: $goal,
            // Esta línea sirve para pasar el tipo de división.
            splitType: $split->type,
            // Esta línea sirve para pasar los días por semana.
            frequencyDays: $profile->frequencyDays,
            // Esta línea sirve para pasar la duración en semanas.
            durationWeeks: self::DURATION_WEEKS,
            // Esta línea sirve para pasar los días generados.
            days: $days,
        );
    }
}
