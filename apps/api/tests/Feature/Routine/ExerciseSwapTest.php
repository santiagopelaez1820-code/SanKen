<?php

namespace Tests\Feature\Routine;

use App\Models\Exercise;
use App\Models\PersonalRecord;
use App\Models\Routine;
use App\Models\RoutineExercise;
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

    private function readyUser(string $level = 'intermediate'): User
    {
        $user = User::factory()->create();
        $user->profile()->create(['age' => 28, 'sex' => 'male', 'height_cm' => 178, 'weight_kg' => 80]);
        $user->onboardingResponse()->create([
            'level' => $level, 'goals' => ['gain_muscle'], 'frequency_days' => 3,
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
        // No se fija un ejercicio puntual por índice/nombre: RoutineVolumeCalculator
        // recorta cuántos ejercicios trae cada día según nivel/objetivo/tiempo,
        // así que cuál cae en qué posición ya no es estable. Cualquiera con
        // alternativa sirve para probar el round-trip.
        $routineExercise = collect($routine['days'][0]['exercises'])->first(fn ($ex) => $ex['alternative'] !== null);
        $this->assertNotNull($routineExercise, 'fixture assumption: al menos un ejercicio del día con alternativa');
        $original = $routineExercise['exercise']['name'];
        $alternative = $routineExercise['alternative']['name'];

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

        // Se arma el fixture a mano en vez de confiar en qué ejercicio del
        // catálogo generado queda sin alternativa: exercise_alternatives es
        // una relación global (no por plantilla), así que un ejercicio sin
        // pareja EN un bloque puntual puede terminar con una de todos modos
        // por aparecer emparejado en otro bloque/nivel -- y además
        // RoutineVolumeCalculator recorta cuántos ejercicios trae cada día,
        // corriendo el riesgo de dejar ese candidato afuera. Elegir acá
        // mismo un Exercise sin ninguna alternativa vincula la prueba a la
        // regla real (RoutineController::swapExercise) sin depender de cómo
        // esté armado el contenido de las plantillas.
        $routine = Routine::query()->create([
            'user_id' => $user->id, 'source' => 'engine', 'goal' => 'gain_muscle',
            'split_type' => 'full_body', 'frequency_days' => 1, 'duration_weeks' => 6, 'is_active' => true,
        ]);
        $day = $routine->days()->create(['day_order' => 1, 'label' => 'Día único', 'target_muscle_groups' => []]);
        $exerciseWithoutAlt = Exercise::query()->whereDoesntHave('alternatives')->firstOrFail();
        $routineExercise = RoutineExercise::query()->create([
            'routine_day_id' => $day->id, 'exercise_id' => $exerciseWithoutAlt->id, 'order' => 1,
            'target_sets' => 3, 'target_reps' => '8-12', 'rest_seconds' => 90, 'target_rpe' => 8.0,
        ]);

        $client->postJson("/api/v1/routines/{$routine->id}/exercises/{$routineExercise->id}/swap")
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
