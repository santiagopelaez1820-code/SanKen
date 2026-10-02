<?php

namespace Tests\Feature\Routine;

use App\Models\Routine;
use App\Models\User;
use Database\Seeders\ExerciseSeeder;
use Database\Seeders\MuscleGroupSeeder;
use Database\Seeders\RoutineTemplateSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FillRoutineExercisesCommandTest extends TestCase
{
    use RefreshDatabase;

    private function engineRoutineFor(int $sessionMinutes = 90): Routine
    {
        $this->seed(MuscleGroupSeeder::class);
        $this->seed(ExerciseSeeder::class);
        $this->seed(RoutineTemplateSeeder::class);

        $user = User::factory()->create();
        $user->profile()->create(['age' => 28, 'sex' => 'male', 'height_cm' => 175, 'weight_kg' => 75]);
        $user->onboardingResponse()->create([
            'level' => 'intermediate', 'goals' => ['gain_muscle'], 'frequency_days' => 3,
            'session_minutes' => $sessionMinutes, 'completed' => true, 'completed_at' => now(),
        ]);

        $this->actingAs($user, 'sanctum')->postJson('/api/v1/routines/generate')->assertCreated();

        return Routine::query()->where('user_id', $user->id)->where('is_active', true)->with('days.exercises')->firstOrFail();
    }

    /** Simula una rutina vieja (generada cuando el motor armaba 4-5 ejercicios por día). */
    private function trimTo(Routine $routine, int $perDay): void
    {
        foreach ($routine->days as $day) {
            $day->exercises()->where('order', '>', $perDay)->delete();
        }
    }

    public function test_adds_only_the_missing_exercises_keeping_existing_ones_and_their_settings(): void
    {
        $routine = $this->engineRoutineFor();
        $expected = $routine->days->mapWithKeys(fn ($day) => [$day->id => $day->exercises->pluck('exercise_id')->all()]);
        $this->trimTo($routine, 4);

        // Un ejercicio cambiado por su alternativa no debe volver a agregarse duplicado.
        $firstDay = $routine->days->first();
        $swapped = $firstDay->exercises()->where('order', 1)->first();
        $alternativeId = $swapped->exercise->alternatives()->value('exercises.id');
        $swapped->update(['exercise_id' => $alternativeId, 'target_sets' => 3]);

        $this->artisan('routines:fill-exercises')->assertSuccessful();

        foreach ($routine->fresh('days.exercises')->days as $day) {
            $ids = $day->exercises->pluck('exercise_id')->all();
            $this->assertSame(count($expected[$day->id]), count($ids), "Día '{$day->label}' no quedó completo.");
            $this->assertSame(count($ids), count(array_unique($ids)));
            $this->assertSame(range(1, count($ids)), $day->exercises->pluck('order')->all());
            $this->assertCount(1, $day->exercises->unique(fn ($e) => $e->target_sets.'|'.$e->target_reps.'|'.$e->rest_seconds));
        }

        $this->assertSame($alternativeId, $firstDay->exercises()->where('order', 1)->value('exercise_id'));
    }

    /**
     * Regresión: "Curl predicador en máquina" figura como alternativa de
     * "Curl bayesiano en polea" en otra plantilla (alternativas globales);
     * eso no debe impedir completar el día de Tirón con su 6.º ejercicio.
     */
    public function test_completes_a_pull_day_even_when_the_missing_exercise_is_a_global_alternative_of_an_existing_one(): void
    {
        $routine = $this->engineRoutineFor();
        $this->trimTo($routine, 5);
        $pullDay = $routine->days->firstWhere('label', 'Tirón');

        $this->artisan('routines:fill-exercises')->assertSuccessful();

        $names = $pullDay->exercises()->with('exercise')->get()->pluck('exercise.name');
        $this->assertCount(6, $names);
        $this->assertSame('Curl predicador en máquina', $names->last());
    }

    public function test_is_idempotent_and_ignores_trainer_routines(): void
    {
        $routine = $this->engineRoutineFor();
        $this->trimTo($routine, 4);
        $routine->update(['source' => 'trainer']);

        $this->artisan('routines:fill-exercises')->assertSuccessful();
        $this->assertSame(4, $routine->days->first()->exercises()->count());

        $routine->update(['source' => 'engine']);
        $this->artisan('routines:fill-exercises')->assertSuccessful();
        $count = $routine->days->first()->exercises()->count();
        $this->artisan('routines:fill-exercises')->assertSuccessful();

        $this->assertGreaterThanOrEqual(6, $count);
        $this->assertSame($count, $routine->days->first()->exercises()->count());
    }
}
