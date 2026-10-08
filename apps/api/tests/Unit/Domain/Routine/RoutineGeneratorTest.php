<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Unit\Domain\Routine.

namespace Tests\Unit\Domain\Routine;

// Esta línea sirve para importar la clase RoutineGenerator.
use App\Domain\Routine\RoutineGenerator;
// Esta línea sirve para importar la clase ExerciseSelector.
use App\Domain\Routine\Services\ExerciseSelector;
// Esta línea sirve para importar la clase SetRepRestAssigner.
use App\Domain\Routine\Services\SetRepRestAssigner;
// Esta línea sirve para importar la clase SplitSelector.
use App\Domain\Routine\Services\SplitSelector;
// Esta línea sirve para importar la clase ExerciseData.
use App\Domain\Routine\ValueObjects\ExerciseData;
// Esta línea sirve para importar la clase OnboardingProfile.
use App\Domain\Routine\ValueObjects\OnboardingProfile;
// Esta línea sirve para importar la clase base de los tests.
use Tests\TestCase;

// Esta línea sirve para declarar la clase de tests RoutineGeneratorTest.
class RoutineGeneratorTest extends TestCase
{
    // Esta línea sirve para declarar el método auxiliar que crea el generador de rutinas.
    private function makeGenerator(): RoutineGenerator
    {
        // Esta línea sirve para crear el generador con sus piezas.
        return new RoutineGenerator(
            // Esta línea sirve para usar el selector de división con la configuración.
            splitSelector: new SplitSelector(config('routine_engine.splits')),
            // Esta línea sirve para usar el selector de ejercicios.
            exerciseSelector: new ExerciseSelector,
            // Esta línea sirve para usar el asignador de series, repeticiones y descanso.
            assigner: new SetRepRestAssigner,
            // Esta línea sirve para pasar los parámetros por objetivo.
            goalParametersConfig: config('routine_engine.goal_parameters'),
            // Esta línea sirve para pasar los ejercicios por músculo según el nivel.
            exercisesPerMuscleByLevel: config('routine_engine.exercises_per_muscle_by_level'),
            // Esta línea sirve para pasar el máximo de ejercicios según los minutos de la sesión.
            maxExercisesBySessionMinutes: config('routine_engine.max_exercises_by_session_minutes'),
        );
    }

    /**
     * @return ExerciseData[]
     */
    // Esta línea sirve para declarar el método auxiliar que arma un catálogo de ejercicios de prueba.
    private function fixturePool(): array
    {
        // Esta línea sirve para definir las filas de ejercicios de prueba.
        $rows = [
            // Esta línea sirve para agregar Press banca con barra.
            [1, 'Press banca con barra', 'chest', ['triceps'], 'barbell', 'intermediate', 'compound'],
            // Esta línea sirve para agregar Press banca con mancuernas.
            [2, 'Press banca con mancuernas', 'chest', ['triceps'], 'dumbbells', 'beginner', 'compound'],
            // Esta línea sirve para agregar Aperturas con mancuernas.
            [3, 'Aperturas con mancuernas', 'chest', [], 'dumbbells', 'beginner', 'isolation'],
            // Esta línea sirve para agregar Flexiones.
            [4, 'Flexiones', 'chest', ['triceps'], 'bodyweight_only', 'beginner', 'compound'],
            // Esta línea sirve para agregar Remo con barra.
            [5, 'Remo con barra', 'back', ['biceps'], 'barbell', 'intermediate', 'compound'],
            // Esta línea sirve para agregar Jalón al pecho.
            [6, 'Jalón al pecho', 'back', ['biceps'], 'machines', 'beginner', 'compound'],
            // Esta línea sirve para agregar Dominadas.
            [7, 'Dominadas', 'back', ['biceps'], 'pull_up_bar', 'advanced', 'compound'],
            // Esta línea sirve para agregar Sentadilla con barra.
            [8, 'Sentadilla con barra', 'quads', ['glutes'], 'squat_rack', 'advanced', 'compound'],
            // Esta línea sirve para agregar Sentadilla goblet.
            [9, 'Sentadilla goblet', 'quads', ['glutes'], 'dumbbells', 'beginner', 'compound'],
            // Esta línea sirve para agregar Extensión de cuádriceps.
            [10, 'Extensión de cuádriceps', 'quads', [], 'machines', 'beginner', 'isolation'],
            // Esta línea sirve para agregar Curl de bíceps con mancuernas.
            [11, 'Curl de bíceps con mancuernas', 'biceps', [], 'dumbbells', 'beginner', 'isolation'],
            // Esta línea sirve para agregar Extensión de tríceps en polea.
            [12, 'Extensión de tríceps en polea', 'triceps', [], 'cables', 'beginner', 'isolation'],
            // Esta línea sirve para agregar Press militar con barra.
            [13, 'Press militar con barra', 'shoulders', ['triceps'], 'barbell', 'intermediate', 'compound'],
            // Esta línea sirve para agregar Elevaciones laterales.
            [14, 'Elevaciones laterales', 'shoulders', [], 'dumbbells', 'beginner', 'isolation'],
            // Esta línea sirve para agregar Plancha.
            [15, 'Plancha', 'core', [], 'bodyweight_only', 'beginner', 'isolation'],
            // Esta línea sirve para agregar Curl femoral.
            [16, 'Curl femoral', 'hamstrings', [], 'machines', 'beginner', 'isolation'],
            // Esta línea sirve para agregar Hip thrust.
            [17, 'Hip thrust', 'glutes', ['hamstrings'], 'barbell', 'intermediate', 'compound'],
            // Esta línea sirve para agregar Elevación de talones.
            [18, 'Elevación de talones', 'calves', [], 'machines', 'beginner', 'isolation'],
        ];

        // Esta línea sirve para convertir cada fila en un objeto de ejercicio.
        return array_map(
            // Esta línea sirve para crear el objeto con los datos de la fila.
            fn (array $r) => new ExerciseData($r[0], $r[1], $r[2], $r[3], $r[4], $r[5], $r[6]),
            // Esta línea sirve para pasar las filas a convertir.
            $rows,
        );
    }

    // Esta línea sirve para declarar el test que comprueba que genera el número correcto de días para la frecuencia.
    public function test_generates_a_routine_with_the_right_number_of_days_for_the_frequency(): void
    {
        // Esta línea sirve para crear el perfil de onboarding.
        $profile = new OnboardingProfile(
            // Esta línea sirve para definir el nivel.
            level: 'intermediate',
            // Esta línea sirve para definir los objetivos.
            goals: ['gain_muscle'],
            // Esta línea sirve para definir 4 días por semana.
            frequencyDays: 4,
            // Esta línea sirve para definir 60 minutos por sesión.
            sessionMinutes: 60,
            // Esta línea sirve para definir que entrena en el gimnasio.
            place: 'gym',
            // Esta línea sirve para definir el equipamiento disponible.
            equipmentAvailable: ['barbell', 'dumbbells', 'machines', 'cables', 'pull_up_bar', 'squat_rack'],
            // Esta línea sirve para definir que no hay lesiones.
            injuries: [],
        );

        // Esta línea sirve para generar la rutina.
        $routine = $this->makeGenerator()->generate($profile, $this->fixturePool());

        // Esta línea sirve para exigir que "splitType" sea exactamente 'upper_lower'.
        $this->assertSame('upper_lower', $routine->splitType);
        // Esta línea sirve para exigir que haya 4 días.
        $this->assertCount(4, $routine->days);
        // Esta línea sirve para exigir que el primer día tenga ejercicios.
        $this->assertNotEmpty($routine->days[0]->exercises);
    }

    // Esta línea sirve para declarar el test que comprueba que el objetivo de hipertrofia aplica su esquema de series y repeticiones.
    public function test_hypertrophy_goal_applies_its_configured_set_rep_scheme(): void
    {
        // Esta línea sirve para crear el perfil de onboarding.
        $profile = new OnboardingProfile(
            // Esta línea sirve para definir el nivel.
            level: 'intermediate',
            // Esta línea sirve para definir los objetivos.
            goals: ['gain_muscle'],
            // Esta línea sirve para definir 3 días por semana.
            frequencyDays: 3,
            // Esta línea sirve para definir 60 minutos por sesión.
            sessionMinutes: 60,
            // Esta línea sirve para definir que entrena en el gimnasio.
            place: 'gym',
            // Esta línea sirve para definir el equipamiento disponible.
            equipmentAvailable: ['barbell', 'dumbbells', 'machines', 'cables'],
            // Esta línea sirve para definir que no hay lesiones.
            injuries: [],
        );

        // Esta línea sirve para generar la rutina.
        $routine = $this->makeGenerator()->generate($profile, $this->fixturePool());
        // Esta línea sirve para obtener los parámetros configurados del objetivo.
        $params = config('routine_engine.goal_parameters.gain_muscle');
        // Esta línea sirve para tomar el primer ejercicio del primer día.
        $exercise = $routine->days[0]->exercises[0];

        // Esta línea sirve para exigir que "targetSets" sea exactamente $params['sets'].
        $this->assertSame($params['sets'], $exercise->targetSets);
        // Esta línea sirve para exigir que "targetReps" sea exactamente $params['target_reps'].
        $this->assertSame($params['target_reps'], $exercise->targetReps);
        // Esta línea sirve para exigir que "restSeconds" sea exactamente $params['rest_seconds'].
        $this->assertSame($params['rest_seconds'], $exercise->restSeconds);
    }

    // Esta línea sirve para declarar el test que comprueba que el objetivo de fuerza prioriza ejercicios compuestos.
    public function test_strength_goal_prioritizes_compound_exercises_over_isolation(): void
    {
        // Esta línea sirve para crear el perfil de onboarding.
        $profile = new OnboardingProfile(
            // Esta línea sirve para definir el nivel.
            level: 'advanced',
            // Esta línea sirve para definir los objetivos.
            goals: ['strength'],
            // Esta línea sirve para definir 4 días por semana.
            frequencyDays: 4,
            // Esta línea sirve para definir 90 minutos por sesión.
            sessionMinutes: 90,
            // Esta línea sirve para definir que entrena en el gimnasio.
            place: 'gym',
            // Esta línea sirve para definir el equipamiento disponible.
            equipmentAvailable: ['barbell', 'dumbbells', 'machines', 'cables', 'pull_up_bar', 'squat_rack'],
            // Esta línea sirve para definir que no hay lesiones.
            injuries: [],
        );

        // Esta línea sirve para generar la rutina.
        $routine = $this->makeGenerator()->generate($profile, $this->fixturePool());

        // Upper A del split de 4 días: chest, back, shoulders, biceps, triceps.
        // Esta línea sirve para tomar el primer día.
        $upperDay = $routine->days[0];
        // Esta línea sirve para obtener los ids de sus ejercicios.
        $exerciseIds = array_map(fn ($e) => $e->exerciseId, $upperDay->exercises);
        // Esta línea sirve para indexar el catálogo por id.
        $pool = collect($this->fixturePool())->keyBy('id');

        // Esta línea sirve para contar los ejercicios compuestos.
        $compoundCount = collect($exerciseIds)->filter(fn ($id) => $pool[$id]->type === 'compound')->count();

        // Esta línea sirve para exigir que haya al menos uno.
        $this->assertGreaterThan(0, $compoundCount, 'Strength debe incluir al menos un compuesto en el día superior.');
    }

    // Esta línea sirve para declarar el test que comprueba que excluye ejercicios del área lesionada.
    public function test_excludes_exercises_that_target_an_injured_area(): void
    {
        // Esta línea sirve para crear el perfil de onboarding.
        $profile = new OnboardingProfile(
            // Esta línea sirve para definir el nivel.
            level: 'advanced',
            // Esta línea sirve para definir los objetivos.
            goals: ['gain_muscle'],
            // Esta línea sirve para definir 3 días por semana.
            frequencyDays: 3,
            // Esta línea sirve para definir 90 minutos por sesión.
            sessionMinutes: 90,
            // Esta línea sirve para definir que entrena en el gimnasio.
            place: 'gym',
            // Esta línea sirve para definir el equipamiento disponible.
            equipmentAvailable: ['barbell', 'dumbbells', 'machines', 'cables', 'squat_rack', 'pull_up_bar'],
            // Esta línea sirve para definir una lesión de rodilla derecha.
            injuries: ['rodilla derecha'],
        );

        // Esta línea sirve para generar la rutina.
        $routine = $this->makeGenerator()->generate($profile, $this->fixturePool());
        // Esta línea sirve para indexar el catálogo por id.
        $pool = collect($this->fixturePool())->keyBy('id');

        // Esta línea sirve para recorrer cada día.
        foreach ($routine->days as $day) {
            // Esta línea sirve para recorrer cada ejercicio.
            foreach ($day->exercises as $exercise) {
                // Esta línea sirve para exigir que no sea.
                $this->assertNotSame(
                    // Esta línea sirve para indicar el músculo prohibido (cuádriceps).
                    'quads',
                    // Esta línea sirve para indicar el músculo principal del ejercicio asignado.
                    $pool[$exercise->exerciseId]->primaryMuscle,
                    // Esta línea sirve para mostrar este mensaje si falla.
                    'No debería asignarse ningún ejercicio de cuádriceps con una lesión de rodilla reportada.',
                );
            }
        }
    }

    // Esta línea sirve para declarar el test que comprueba que solo usa ejercicios de peso corporal si no hay equipamiento.
    public function test_only_uses_bodyweight_exercises_when_no_equipment_is_available(): void
    {
        // Esta línea sirve para crear el perfil de onboarding.
        $profile = new OnboardingProfile(
            // Esta línea sirve para definir el nivel.
            level: 'beginner',
            // Esta línea sirve para definir los objetivos.
            goals: ['health'],
            // Esta línea sirve para definir 3 días por semana.
            frequencyDays: 3,
            // Esta línea sirve para definir 30 minutos por sesión.
            sessionMinutes: 30,
            // Esta línea sirve para definir que entrena en casa.
            place: 'home',
            // Esta línea sirve para definir que no hay equipamiento.
            equipmentAvailable: [],
            // Esta línea sirve para definir que no hay lesiones.
            injuries: [],
        );

        // Esta línea sirve para generar la rutina.
        $routine = $this->makeGenerator()->generate($profile, $this->fixturePool());
        // Esta línea sirve para indexar el catálogo por id.
        $pool = collect($this->fixturePool())->keyBy('id');

        // Esta línea sirve para recorrer cada día.
        foreach ($routine->days as $day) {
            // Esta línea sirve para recorrer cada ejercicio.
            foreach ($day->exercises as $exercise) {
                // Esta línea sirve para exigir que el equipamiento sea solo peso corporal.
                $this->assertSame('bodyweight_only', $pool[$exercise->exerciseId]->equipment);
            }
        }
    }

    // Esta línea sirve para declarar el test que comprueba que respeta el máximo de ejercicios según el tiempo disponible.
    public function test_respects_the_maximum_exercise_count_for_the_available_session_time(): void
    {
        // Esta línea sirve para crear el perfil de onboarding.
        $profile = new OnboardingProfile(
            // Esta línea sirve para definir el nivel.
            level: 'advanced',
            // Esta línea sirve para definir los objetivos.
            goals: ['gain_muscle'],
            // Esta línea sirve para definir 6 días por semana.
            frequencyDays: 6,
            // Esta línea sirve para definir 30 minutos por sesión.
            sessionMinutes: 30,
            // Esta línea sirve para definir que entrena en el gimnasio.
            place: 'gym',
            // Esta línea sirve para definir el equipamiento disponible.
            equipmentAvailable: ['barbell', 'dumbbells', 'machines', 'cables', 'squat_rack', 'pull_up_bar'],
            // Esta línea sirve para definir que no hay lesiones.
            injuries: [],
        );

        // Esta línea sirve para generar la rutina.
        $routine = $this->makeGenerator()->generate($profile, $this->fixturePool());
        // Esta línea sirve para obtener el máximo configurado para 30 minutos.
        $max = config('routine_engine.max_exercises_by_session_minutes.30');

        // Esta línea sirve para recorrer cada día.
        foreach ($routine->days as $day) {
            // Esta línea sirve para exigir que no supere el máximo.
            $this->assertLessThanOrEqual($max, count($day->exercises));
        }
    }

    // Esta línea sirve para declarar el test que comprueba que varía los ejercicios entre días de cuerpo completo.
    public function test_varies_exercises_across_full_body_days_instead_of_repeating_the_same_ones(): void
    {
        // Esta línea sirve para crear el perfil de onboarding.
        $profile = new OnboardingProfile(
            // Esta línea sirve para definir el nivel.
            level: 'advanced',
            // Esta línea sirve para definir los objetivos.
            goals: ['gain_muscle'],
            // Esta línea sirve para definir 3 días por semana.
            frequencyDays: 3,
            // Esta línea sirve para definir 90 minutos por sesión.
            sessionMinutes: 90,
            // Esta línea sirve para definir que entrena en el gimnasio.
            place: 'gym',
            // Esta línea sirve para definir el equipamiento disponible.
            equipmentAvailable: ['barbell', 'dumbbells', 'machines', 'cables', 'squat_rack', 'pull_up_bar'],
            // Esta línea sirve para definir que no hay lesiones.
            injuries: [],
        );

        // Esta línea sirve para generar la rutina.
        $routine = $this->makeGenerator()->generate($profile, $this->fixturePool());

        // Esta línea sirve para obtener los ids de ejercicios del primer día.
        $dayAIds = array_map(fn ($e) => $e->exerciseId, $routine->days[0]->exercises);
        // Esta línea sirve para obtener los ids de ejercicios del segundo día.
        $dayBIds = array_map(fn ($e) => $e->exerciseId, $routine->days[1]->exercises);

        // Esta línea sirve para exigir que los dos días no sean idénticos.
        $this->assertNotSame($dayAIds, $dayBIds, 'Los 3 días de full body no deberían ser idénticos cuando hay alternativas disponibles.');
    }
}
