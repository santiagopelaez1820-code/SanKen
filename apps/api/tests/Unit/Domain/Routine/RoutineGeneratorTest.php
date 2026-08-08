<?php

namespace Tests\Unit\Domain\Routine;

use App\Domain\Routine\RoutineGenerator;
use App\Domain\Routine\Services\ExerciseSelector;
use App\Domain\Routine\Services\SetRepRestAssigner;
use App\Domain\Routine\Services\SplitSelector;
use App\Domain\Routine\ValueObjects\ExerciseData;
use App\Domain\Routine\ValueObjects\OnboardingProfile;
use Tests\TestCase;

class RoutineGeneratorTest extends TestCase
{
    private function makeGenerator(): RoutineGenerator
    {
        return new RoutineGenerator(
            splitSelector: new SplitSelector(config('routine_engine.splits')),
            exerciseSelector: new ExerciseSelector,
            assigner: new SetRepRestAssigner,
            goalParametersConfig: config('routine_engine.goal_parameters'),
            exercisesPerMuscleByLevel: config('routine_engine.exercises_per_muscle_by_level'),
            maxExercisesBySessionMinutes: config('routine_engine.max_exercises_by_session_minutes'),
        );
    }

    /**
     * @return ExerciseData[]
     */
    private function fixturePool(): array
    {
        $rows = [
            [1, 'Press banca con barra', 'chest', ['triceps'], 'barbell', 'intermediate', 'compound'],
            [2, 'Press banca con mancuernas', 'chest', ['triceps'], 'dumbbells', 'beginner', 'compound'],
            [3, 'Aperturas con mancuernas', 'chest', [], 'dumbbells', 'beginner', 'isolation'],
            [4, 'Flexiones', 'chest', ['triceps'], 'bodyweight_only', 'beginner', 'compound'],
            [5, 'Remo con barra', 'back', ['biceps'], 'barbell', 'intermediate', 'compound'],
            [6, 'Jalón al pecho', 'back', ['biceps'], 'machines', 'beginner', 'compound'],
            [7, 'Dominadas', 'back', ['biceps'], 'pull_up_bar', 'advanced', 'compound'],
            [8, 'Sentadilla con barra', 'quads', ['glutes'], 'squat_rack', 'advanced', 'compound'],
            [9, 'Sentadilla goblet', 'quads', ['glutes'], 'dumbbells', 'beginner', 'compound'],
            [10, 'Extensión de cuádriceps', 'quads', [], 'machines', 'beginner', 'isolation'],
            [11, 'Curl de bíceps con mancuernas', 'biceps', [], 'dumbbells', 'beginner', 'isolation'],
            [12, 'Extensión de tríceps en polea', 'triceps', [], 'cables', 'beginner', 'isolation'],
            [13, 'Press militar con barra', 'shoulders', ['triceps'], 'barbell', 'intermediate', 'compound'],
            [14, 'Elevaciones laterales', 'shoulders', [], 'dumbbells', 'beginner', 'isolation'],
            [15, 'Plancha', 'core', [], 'bodyweight_only', 'beginner', 'isolation'],
            [16, 'Curl femoral', 'hamstrings', [], 'machines', 'beginner', 'isolation'],
            [17, 'Hip thrust', 'glutes', ['hamstrings'], 'barbell', 'intermediate', 'compound'],
            [18, 'Elevación de talones', 'calves', [], 'machines', 'beginner', 'isolation'],
        ];

        return array_map(
            fn (array $r) => new ExerciseData($r[0], $r[1], $r[2], $r[3], $r[4], $r[5], $r[6]),
            $rows,
        );
    }

    public function test_generates_a_routine_with_the_right_number_of_days_for_the_frequency(): void
    {
        $profile = new OnboardingProfile(
            level: 'intermediate',
            goals: ['gain_muscle'],
            frequencyDays: 4,
            sessionMinutes: 60,
            place: 'gym',
            equipmentAvailable: ['barbell', 'dumbbells', 'machines', 'cables', 'pull_up_bar', 'squat_rack'],
            injuries: [],
        );

        $routine = $this->makeGenerator()->generate($profile, $this->fixturePool());

        $this->assertSame('upper_lower', $routine->splitType);
        $this->assertCount(4, $routine->days);
        $this->assertNotEmpty($routine->days[0]->exercises);
    }

    public function test_hypertrophy_goal_applies_its_configured_set_rep_scheme(): void
    {
        $profile = new OnboardingProfile(
            level: 'intermediate',
            goals: ['gain_muscle'],
            frequencyDays: 3,
            sessionMinutes: 60,
            place: 'gym',
            equipmentAvailable: ['barbell', 'dumbbells', 'machines', 'cables'],
            injuries: [],
        );

        $routine = $this->makeGenerator()->generate($profile, $this->fixturePool());
        $params = config('routine_engine.goal_parameters.gain_muscle');
        $exercise = $routine->days[0]->exercises[0];

        $this->assertSame($params['sets'], $exercise->targetSets);
        $this->assertSame($params['target_reps'], $exercise->targetReps);
        $this->assertSame($params['rest_seconds'], $exercise->restSeconds);
    }

    public function test_strength_goal_prioritizes_compound_exercises_over_isolation(): void
    {
        $profile = new OnboardingProfile(
            level: 'advanced',
            goals: ['strength'],
            frequencyDays: 4,
            sessionMinutes: 90,
            place: 'gym',
            equipmentAvailable: ['barbell', 'dumbbells', 'machines', 'cables', 'pull_up_bar', 'squat_rack'],
            injuries: [],
        );

        $routine = $this->makeGenerator()->generate($profile, $this->fixturePool());

        // Upper A del split de 4 días: chest, back, shoulders, biceps, triceps.
        $upperDay = $routine->days[0];
        $exerciseIds = array_map(fn ($e) => $e->exerciseId, $upperDay->exercises);
        $pool = collect($this->fixturePool())->keyBy('id');

        $compoundCount = collect($exerciseIds)->filter(fn ($id) => $pool[$id]->type === 'compound')->count();

        $this->assertGreaterThan(0, $compoundCount, 'Strength debe incluir al menos un compuesto en el día superior.');
    }

    public function test_excludes_exercises_that_target_an_injured_area(): void
    {
        $profile = new OnboardingProfile(
            level: 'advanced',
            goals: ['gain_muscle'],
            frequencyDays: 3,
            sessionMinutes: 90,
            place: 'gym',
            equipmentAvailable: ['barbell', 'dumbbells', 'machines', 'cables', 'squat_rack', 'pull_up_bar'],
            injuries: ['rodilla derecha'],
        );

        $routine = $this->makeGenerator()->generate($profile, $this->fixturePool());
        $pool = collect($this->fixturePool())->keyBy('id');

        foreach ($routine->days as $day) {
            foreach ($day->exercises as $exercise) {
                $this->assertNotSame(
                    'quads',
                    $pool[$exercise->exerciseId]->primaryMuscle,
                    'No debería asignarse ningún ejercicio de cuádriceps con una lesión de rodilla reportada.',
                );
            }
        }
    }

    public function test_only_uses_bodyweight_exercises_when_no_equipment_is_available(): void
    {
        $profile = new OnboardingProfile(
            level: 'beginner',
            goals: ['health'],
            frequencyDays: 3,
            sessionMinutes: 30,
            place: 'home',
            equipmentAvailable: [],
            injuries: [],
        );

        $routine = $this->makeGenerator()->generate($profile, $this->fixturePool());
        $pool = collect($this->fixturePool())->keyBy('id');

        foreach ($routine->days as $day) {
            foreach ($day->exercises as $exercise) {
                $this->assertSame('bodyweight_only', $pool[$exercise->exerciseId]->equipment);
            }
        }
    }

    public function test_respects_the_maximum_exercise_count_for_the_available_session_time(): void
    {
        $profile = new OnboardingProfile(
            level: 'advanced',
            goals: ['gain_muscle'],
            frequencyDays: 6,
            sessionMinutes: 30,
            place: 'gym',
            equipmentAvailable: ['barbell', 'dumbbells', 'machines', 'cables', 'squat_rack', 'pull_up_bar'],
            injuries: [],
        );

        $routine = $this->makeGenerator()->generate($profile, $this->fixturePool());
        $max = config('routine_engine.max_exercises_by_session_minutes.30');

        foreach ($routine->days as $day) {
            $this->assertLessThanOrEqual($max, count($day->exercises));
        }
    }

    public function test_varies_exercises_across_full_body_days_instead_of_repeating_the_same_ones(): void
    {
        $profile = new OnboardingProfile(
            level: 'advanced',
            goals: ['gain_muscle'],
            frequencyDays: 3,
            sessionMinutes: 90,
            place: 'gym',
            equipmentAvailable: ['barbell', 'dumbbells', 'machines', 'cables', 'squat_rack', 'pull_up_bar'],
            injuries: [],
        );

        $routine = $this->makeGenerator()->generate($profile, $this->fixturePool());

        $dayAIds = array_map(fn ($e) => $e->exerciseId, $routine->days[0]->exercises);
        $dayBIds = array_map(fn ($e) => $e->exerciseId, $routine->days[1]->exercises);

        $this->assertNotSame($dayAIds, $dayBIds, 'Los 3 días de full body no deberían ser idénticos cuando hay alternativas disponibles.');
    }
}
