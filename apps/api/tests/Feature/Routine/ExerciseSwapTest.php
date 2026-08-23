<?php

namespace Tests\Feature\Routine;

use App\Models\PersonalRecord;
use App\Models\Routine;
use App\Models\User;
use Database\Seeders\ExerciseSeeder;
use Database\Seeders\MuscleGroupSeeder;
use Database\Seeders\RoutineTemplateSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Swap A/B — a nivel de plantilla de rutina (RoutineController::swapExercise)
 * y a nivel de sesion en curso (WorkoutSessionController::swapExercise).
 * Ver seccion 17/34 del pedido: no debe romper historial ni sobrecarga
 * progresiva (ProgressiveOverloadCalculator / DetectPersonalRecordAction).
 */
class ExerciseSwapTest extends TestCase
{
    use RefreshDatabase;

    private function seedCatalog(): void
    {
        $this->seed(MuscleGroupSeeder::class);
        $this->seed(ExerciseSeeder::class);
        $this->seed(RoutineTemplateSeeder::class);
    }

    private function readyUser(): User
    {
        $user = User::factory()->create();
        $user->profile()->create(['age' => 28, 'sex' => 'male', 'height_cm' => 178, 'weight_kg' => 80]);
        $user->onboardingResponse()->create([
            'level' => 'intermediate', 'goals' => ['gain_muscle'], 'frequency_days' => 3,
            'completed' => true, 'completed_at' => now(),
        ]);

        return $user;
    }

    public function test_swapping_a_routine_exercise_replaces_it_with_its_alternative_and_back(): void
    {
        $this->seedCatalog();
        $user = $this->readyUser();
        $client = $this->actingAs($user, 'sanctum');

        $routine = $client->postJson('/api/v1/routines/generate')->json('data');
        // "Katana en polea" / "Rompecráneos..." — par 1:1 sin contaminación
        // cruzada de otras plantillas (a diferencia de ejercicios como
        // "Press inclinado en máquina", que al aparecer en varios bloques de
        // día termina con más de una alternativa global válida).
        $routineExercise = $routine['days'][0]['exercises'][6];
        $original = $routineExercise['exercise']['name'];
        $alternative = $routineExercise['alternative']['name'];
        $this->assertSame('Katana en polea', $original);

        $swapped = $client->postJson("/api/v1/routines/{$routine['id']}/exercises/{$routineExercise['id']}/swap")
            ->assertOk()
            ->json('data');
        $this->assertSame($alternative, $swapped['exercise']['name']);
        $this->assertSame($original, $swapped['alternative']['name']);

        $back = $client->postJson("/api/v1/routines/{$routine['id']}/exercises/{$routineExercise['id']}/swap")
            ->assertOk()
            ->json('data');
        $this->assertSame($original, $back['exercise']['name']);

        // No se creo una rutina nueva.
        $this->assertSame(1, Routine::query()->where('user_id', $user->id)->count());
    }

    public function test_swapping_an_exercise_without_an_alternative_fails_clearly(): void
    {
        $this->seedCatalog();
        $user = $this->readyUser();
        $client = $this->actingAs($user, 'sanctum');

        $routine = $client->postJson('/api/v1/routines/generate')->json('data');
        $withoutAlt = collect($routine['days'])
            ->flatMap(fn ($day) => $day['exercises'])
            ->first(fn ($ex) => $ex['alternative'] === null);

        $this->assertNotNull($withoutAlt, 'fixture assumption: debe existir al menos un ejercicio sin alternativa');

        $client->postJson("/api/v1/routines/{$routine['id']}/exercises/{$withoutAlt['id']}/swap")
            ->assertUnprocessable()
            ->assertJsonValidationErrors('exercise');
    }

    public function test_another_user_cannot_swap_exercises_on_someone_elses_routine(): void
    {
        $this->seedCatalog();
        $owner = $this->readyUser();
        $routine = $this->actingAs($owner, 'sanctum')->postJson('/api/v1/routines/generate')->json('data');
        $routineExercise = $routine['days'][0]['exercises'][0];

        $intruder = $this->readyUser();
        $this->actingAs($intruder, 'sanctum')
            ->postJson("/api/v1/routines/{$routine['id']}/exercises/{$routineExercise['id']}/swap")
            ->assertForbidden();
    }

    public function test_swapping_the_active_session_exercise_updates_it_without_touching_workout_sets(): void
    {
        $this->seedCatalog();
        $user = $this->readyUser();
        $client = $this->actingAs($user, 'sanctum');
        $client->postJson('/api/v1/routines/generate');

        $routineDayId = $client->getJson('/api/v1/routines/active')->json('data.days.0.id');
        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $routineDayId])->json('data');
        $workoutExercise = $session['exercises'][0];

        $swapped = $client->postJson("/api/v1/workout-sessions/{$session['id']}/exercises/{$workoutExercise['id']}/swap")
            ->assertOk()
            ->json('data');
        $this->assertNotSame($workoutExercise['exercise']['name'], $swapped['exercise']['name']);

        $client->postJson(
            "/api/v1/workout-sessions/{$session['id']}/exercises/{$workoutExercise['id']}/sets",
            ['weight_kg' => 50, 'reps' => 10],
        )->assertCreated();

        // Con una serie ya registrada, el swap queda bloqueado para no
        // corromper retroactivamente el historial de ese slot.
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/exercises/{$workoutExercise['id']}/swap")
            ->assertUnprocessable();

        $this->assertDatabaseHas('workout_sets', ['weight_kg' => 50, 'reps' => 10]);
    }

    public function test_swapping_a_routine_exercise_does_not_alter_existing_personal_records(): void
    {
        $this->seedCatalog();
        $user = $this->readyUser();
        $client = $this->actingAs($user, 'sanctum');
        $routine = $client->postJson('/api/v1/routines/generate')->json('data');

        $routineDayId = $routine['days'][0]['id'];
        $exerciseId = $routine['days'][0]['exercises'][0]['exercise']['id'];
        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $routineDayId])->json('data');
        $workoutExercise = $session['exercises'][0];

        $client->postJson(
            "/api/v1/workout-sessions/{$session['id']}/exercises/{$workoutExercise['id']}/sets",
            ['weight_kg' => 60, 'reps' => 8],
        )->assertCreated();

        $recordBefore = PersonalRecord::query()->where('user_id', $user->id)->where('exercise_id', $exerciseId)->first();
        $this->assertNotNull($recordBefore, 'el primer set en un ejercicio nuevo deberia registrar un PR');

        // Swap de un ejercicio DISTINTO en el mismo dia — no debe tocar el PR ya generado.
        $otherRoutineExercise = collect($routine['days'][0]['exercises'])
            ->first(fn ($ex) => $ex['exercise']['id'] !== $exerciseId && $ex['alternative'] !== null);
        if ($otherRoutineExercise) {
            $client->postJson("/api/v1/routines/{$routine['id']}/exercises/{$otherRoutineExercise['id']}/swap")->assertOk();
        }

        $recordAfter = PersonalRecord::query()->where('user_id', $user->id)->where('exercise_id', $exerciseId)->first();
        $this->assertSame($recordBefore->id, $recordAfter->id);
        $this->assertEquals($recordBefore->value, $recordAfter->value);
    }
}
