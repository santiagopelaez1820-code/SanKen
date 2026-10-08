<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Unit\Policies.

namespace Tests\Unit\Policies;

// Esta línea sirve para importar el modelo Exercise.
use App\Models\Exercise;
// Esta línea sirve para importar el modelo User.
use App\Models\User;
// Esta línea sirve para importar el modelo WorkoutExercise.
use App\Models\WorkoutExercise;
// Esta línea sirve para importar el modelo WorkoutSession.
use App\Models\WorkoutSession;
// Esta línea sirve para importar el modelo WorkoutSet.
use App\Models\WorkoutSet;
// Esta línea sirve para importar la clase WorkoutSetPolicy.
use App\Policies\WorkoutSetPolicy;
// Esta línea sirve para importar la clase ExerciseSeeder.
use Database\Seeders\ExerciseSeeder;
// Esta línea sirve para importar la clase MuscleGroupSeeder.
use Database\Seeders\MuscleGroupSeeder;
// Esta línea sirve para importar el trait que reinicia la base de datos en cada test.
use Illuminate\Foundation\Testing\RefreshDatabase;
// Esta línea sirve para importar la clase base de los tests.
use Tests\TestCase;

// Esta línea sirve para declarar la clase de tests WorkoutSetPolicyTest.
class WorkoutSetPolicyTest extends TestCase
{
    // Esta línea sirve para reiniciar la base de datos en cada test.
    use RefreshDatabase;

    // Esta línea sirve para guardar la policy de series.
    private WorkoutSetPolicy $policy;

    // Esta línea sirve para declarar la preparación que corre antes de cada test.
    protected function setUp(): void
    {
        // Esta línea sirve para ejecutar la preparación base de Laravel.
        parent::setUp();
        // Esta línea sirve para crear la policy.
        $this->policy = new WorkoutSetPolicy;
        // Esta línea sirve para sembrar los datos de MuscleGroupSeeder.
        $this->seed(MuscleGroupSeeder::class);
        // Esta línea sirve para sembrar los datos de ExerciseSeeder.
        $this->seed(ExerciseSeeder::class);
    }

    // Esta línea sirve para declarar el método auxiliar que crea una serie de un usuario.
    private function makeSet(User $owner): WorkoutSet
    {
        // Esta línea sirve para crear la sesión del usuario.
        $session = WorkoutSession::query()->create(['user_id' => $owner->id, 'performed_at' => now()]);
        // Esta línea sirve para crear el ejercicio de la sesión.
        $exercise = WorkoutExercise::query()->create([
            // Esta línea sirve para asignar $session->id al campo "workout_session_id".
            'workout_session_id' => $session->id,
            // Esta línea sirve para asignar Exercise::query()->first()->id al campo "exercise_id".
            'exercise_id' => Exercise::query()->first()->id,
            // Esta línea sirve para asignar 1 al campo "order".
            'order' => 1,
        ]);

        // Esta línea sirve para crear y devolver la serie.
        return WorkoutSet::query()->create([
            // Esta línea sirve para asignar $exercise->id al campo "workout_exercise_id".
            'workout_exercise_id' => $exercise->id,
            // Esta línea sirve para asignar 1 al campo "set_number".
            'set_number' => 1,
            // Esta línea sirve para asignar 50 al campo "weight_kg".
            'weight_kg' => 50,
            // Esta línea sirve para asignar 10 al campo "reps".
            'reps' => 10,
        ]);
    }

    // Esta línea sirve para declarar el test que comprueba que el dueño puede editar su serie.
    public function test_owner_can_update_their_set(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear la serie del usuario.
        $set = $this->makeSet($user);

        // Esta línea sirve para exigir que el dueño pueda editarla.
        $this->assertTrue($this->policy->update($user, $set));
    }

    // Esta línea sirve para declarar el test que comprueba que otro usuario no puede editar la serie.
    public function test_another_user_cannot_update_the_set(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un usuario de prueba.
        $other = User::factory()->create();
        // Esta línea sirve para crear la serie del usuario.
        $set = $this->makeSet($user);

        // Esta línea sirve para exigir que otro usuario no pueda editarla.
        $this->assertFalse($this->policy->update($other, $set));
    }
}
