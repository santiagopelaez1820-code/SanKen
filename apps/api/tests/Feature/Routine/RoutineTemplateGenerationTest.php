<?php

namespace Tests\Feature\Routine;

use App\Models\User;
use Database\Seeders\ExerciseSeeder;
use Database\Seeders\MuscleGroupSeeder;
use Database\Seeders\RoutineTemplateSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Cubre el motor de plantillas (TemplateRoutineGenerator) que reemplazo al
 * algoritmico (RoutineGenerator, ver RoutineGeneratorTest — sigue intacto y
 * pasando, solo que ya no es el binding activo de RoutineGeneratorInterface).
 */
class RoutineTemplateGenerationTest extends TestCase
{
    use RefreshDatabase;

    private function seedCatalog(): void
    {
        $this->seed(MuscleGroupSeeder::class);
        $this->seed(ExerciseSeeder::class);
        $this->seed(RoutineTemplateSeeder::class);
    }

    private function completeOnboardingFor(User $user, string $sex, int $frequencyDays, string $level = 'intermediate'): void
    {
        $user->profile()->create(['age' => 28, 'sex' => $sex, 'height_cm' => 175, 'weight_kg' => 75]);
        $user->onboardingResponse()->create([
            'level' => $level, 'goals' => ['gain_muscle'], 'frequency_days' => $frequencyDays,
            'completed' => true, 'completed_at' => now(),
        ]);
    }

    public static function sexFrequencyCombos(): array
    {
        return [
            'male 3 days' => ['male', 3],
            'male 4 days' => ['male', 4],
            'male 5 days' => ['male', 5],
            'male 6 days' => ['male', 6],
            'female 3 days' => ['female', 3],
            'female 4 days' => ['female', 4],
            'female 5 days' => ['female', 5],
            'female 6 days' => ['female', 6],
        ];
    }

    /**
     * Las 24 plantillas reales (sexo x frecuencia x nivel) — a diferencia de
     * sexFrequencyCombos() (que fija level=intermediate), este provider
     * habria detectado si RoutineTemplateBeginnerSeeder o
     * RoutineTemplateAdvancedSeeder hubieran quedado incompletos.
     */
    public static function sexFrequencyLevelCombos(): array
    {
        $combos = [];
        foreach (['male', 'female'] as $sex) {
            foreach ([3, 4, 5, 6] as $frequencyDays) {
                foreach (['beginner', 'intermediate', 'advanced'] as $level) {
                    $combos["{$sex} {$frequencyDays} days {$level}"] = [$sex, $frequencyDays, $level];
                }
            }
        }

        return $combos;
    }

    /** @dataProvider sexFrequencyCombos */
    public function test_generates_a_routine_for_every_sex_and_frequency_combination(string $sex, int $frequencyDays): void
    {
        $this->seedCatalog();
        $user = User::factory()->create();
        $this->completeOnboardingFor($user, $sex, $frequencyDays);

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/routines/generate');

        $response->assertCreated()
            ->assertJsonPath('data.source', 'engine')
            ->assertJsonCount($frequencyDays, 'data.days');

        // Cada ejercicio de cada dia trae sets/reps por defecto (8x12, ver
        // RoutineTemplateExercise::default_sets/default_reps) y su exercise_id
        // resuelve a un ejercicio real del catalogo.
        $days = $response->json('data.days');
        foreach ($days as $day) {
            $this->assertNotEmpty($day['exercises']);
            foreach ($day['exercises'] as $exercise) {
                $this->assertSame(3, $exercise['target_sets']);
                $this->assertSame('12', $exercise['target_reps']);
                $this->assertNotEmpty($exercise['exercise']['name']);
            }
        }
    }

    /** @dataProvider sexFrequencyLevelCombos */
    public function test_generates_a_routine_for_every_sex_frequency_and_level_combination(string $sex, int $frequencyDays, string $level): void
    {
        $this->seedCatalog();
        $user = User::factory()->create();
        $this->completeOnboardingFor($user, $sex, $frequencyDays, $level);

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/routines/generate');

        $response->assertCreated()
            ->assertJsonPath('data.source', 'engine')
            ->assertJsonCount($frequencyDays, 'data.days');
    }

    public function test_beginner_and_advanced_templates_use_different_exercises_for_the_same_sex_and_frequency(): void
    {
        $this->seedCatalog();

        $beginner = User::factory()->create();
        $this->completeOnboardingFor($beginner, 'male', 3, 'beginner');
        $beginnerRoutine = $this->actingAs($beginner, 'sanctum')->postJson('/api/v1/routines/generate')->json('data');

        $advanced = User::factory()->create();
        $this->completeOnboardingFor($advanced, 'male', 3, 'advanced');
        $advancedRoutine = $this->actingAs($advanced, 'sanctum')->postJson('/api/v1/routines/generate')->json('data');

        $beginnerExerciseIds = collect($beginnerRoutine['days'])
            ->flatMap(fn ($day) => collect($day['exercises'])->pluck('exercise.id'));
        $advancedExerciseIds = collect($advancedRoutine['days'])
            ->flatMap(fn ($day) => collect($day['exercises'])->pluck('exercise.id'));

        $this->assertNotSame($beginnerExerciseIds->sort()->values()->all(), $advancedExerciseIds->sort()->values()->all());
    }

    public function test_generation_is_fast_and_does_not_require_a_queue_worker(): void
    {
        $this->seedCatalog();
        $user = User::factory()->create();
        $user->profile()->create(['age' => 28, 'sex' => 'male', 'height_cm' => 178, 'weight_kg' => 80]);

        $start = microtime(true);
        $this->actingAs($user, 'sanctum')->postJson('/api/v1/onboarding', [
            'level' => 'intermediate', 'goals' => ['gain_muscle'], 'frequency_days' => 4,
        ]);
        $this->actingAs($user, 'sanctum')->postJson('/api/v1/onboarding/complete')->assertOk();
        $elapsedMs = (microtime(true) - $start) * 1000;

        // La rutina debe existir YA (dispatchSync, ver GenerateRoutineOnOnboardingCompleted)
        // sin depender de que un queue worker la procese despues.
        $this->actingAs($user, 'sanctum')
            ->getJson('/api/v1/routines/active')
            ->assertOk()
            ->assertJsonPath('data.is_active', true);

        $this->assertLessThan(2000, $elapsedMs, 'La generacion no deberia tardar segundos.');
    }

    public function test_female_and_male_templates_differ_in_leg_day_content(): void
    {
        $this->seedCatalog();

        $male = User::factory()->create();
        $this->completeOnboardingFor($male, 'male', 3);
        $maleRoutine = $this->actingAs($male, 'sanctum')->postJson('/api/v1/routines/generate')->json('data');

        $female = User::factory()->create();
        $this->completeOnboardingFor($female, 'female', 3);
        $femaleRoutine = $this->actingAs($female, 'sanctum')->postJson('/api/v1/routines/generate')->json('data');

        $maleLegNames = collect($maleRoutine['days'][2]['exercises'])->pluck('exercise.name');
        $femaleLegNames = collect($femaleRoutine['days'][2]['exercises'])->pluck('exercise.name');

        $this->assertNotSame($maleLegNames->all(), $femaleLegNames->all());
        $this->assertTrue($femaleLegNames->contains('Hip Thrust en máquina'), 'El dia de pierna femenino deberia priorizar gluteo.');
    }
}
