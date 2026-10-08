<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Unit\Policies.

namespace Tests\Unit\Policies;

// Esta línea sirve para importar el modelo Routine.
use App\Models\Routine;
// Esta línea sirve para importar el modelo User.
use App\Models\User;
// Esta línea sirve para importar la clase RoutinePolicy.
use App\Policies\RoutinePolicy;
// Esta línea sirve para importar el trait que reinicia la base de datos en cada test.
use Illuminate\Foundation\Testing\RefreshDatabase;
// Esta línea sirve para importar la clase base de los tests.
use Tests\TestCase;

// Esta línea sirve para declarar la clase de tests RoutinePolicyTest.
class RoutinePolicyTest extends TestCase
{
    // Esta línea sirve para reiniciar la base de datos en cada test.
    use RefreshDatabase;

    // Esta línea sirve para guardar la policy de rutinas.
    private RoutinePolicy $policy;

    // Esta línea sirve para declarar la preparación que corre antes de cada test.
    protected function setUp(): void
    {
        // Esta línea sirve para ejecutar la preparación base de Laravel.
        parent::setUp();
        // Esta línea sirve para crear la policy.
        $this->policy = new RoutinePolicy;
    }

    /**
     * @param  array<string, mixed>  $overrides
     */
    // Esta línea sirve para declarar el método auxiliar que crea una rutina de un usuario.
    private function makeRoutine(User $owner, array $overrides = []): Routine
    {
        // Esta línea sirve para crear la rutina mezclando los datos por defecto con los recibidos.
        return Routine::query()->create(array_merge([
            // Esta línea sirve para asignar $owner->id al campo "user_id".
            'user_id' => $owner->id,
            // Esta línea sirve para asignar 'engine' al campo "source".
            'source' => 'engine',
            // Esta línea sirve para asignar 'gain_muscle' al campo "goal".
            'goal' => 'gain_muscle',
            // Esta línea sirve para asignar 'full_body' al campo "split_type".
            'split_type' => 'full_body',
            // Esta línea sirve para asignar 3 al campo "frequency_days".
            'frequency_days' => 3,
            // Esta línea sirve para asignar 6 al campo "duration_weeks".
            'duration_weeks' => 6,
            // Esta línea sirve para asignar true al campo "is_active".
            'is_active' => true,
            // Esta línea sirve para aplicar los datos recibidos encima de los por defecto.
        ], $overrides));
    }

    // Esta línea sirve para declarar el test que comprueba que el dueño puede ver su rutina.
    public function test_owner_can_view_their_routine(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear la rutina del usuario.
        $routine = $this->makeRoutine($user);

        // Esta línea sirve para exigir que el dueño pueda verla.
        $this->assertTrue($this->policy->view($user, $routine));
    }

    // Esta línea sirve para declarar el test que comprueba que otro usuario no puede ver la rutina.
    public function test_another_user_cannot_view_the_routine(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un usuario de prueba.
        $other = User::factory()->create();
        // Esta línea sirve para crear la rutina del usuario.
        $routine = $this->makeRoutine($user);

        // Esta línea sirve para exigir que otro usuario no pueda verla.
        $this->assertFalse($this->policy->view($other, $routine));
    }

    // Esta línea sirve para declarar el test que comprueba que el entrenador puede gestionar una rutina que creó.
    public function test_trainer_can_manage_a_routine_they_created(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $client = User::factory()->create();
        // Esta línea sirve para crear un usuario entrenador.
        $trainer = User::factory()->create(['role' => 'trainer']);
        // Esta línea sirve para crear una rutina de entrenador.
        $routine = $this->makeRoutine($client, ['source' => 'trainer', 'created_by_trainer_id' => $trainer->id]);

        // Esta línea sirve para exigir que el entrenador pueda gestionarla.
        $this->assertTrue($this->policy->manage($trainer, $routine));
    }

    // Esta línea sirve para declarar el test que comprueba que un entrenador no puede gestionar la rutina de otro.
    public function test_trainer_cannot_manage_a_routine_created_by_another_trainer(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $client = User::factory()->create();
        // Esta línea sirve para crear un usuario entrenador.
        $trainer = User::factory()->create(['role' => 'trainer']);
        // Esta línea sirve para crear un usuario entrenador.
        $otherTrainer = User::factory()->create(['role' => 'trainer']);
        // Esta línea sirve para crear una rutina de entrenador.
        $routine = $this->makeRoutine($client, ['source' => 'trainer', 'created_by_trainer_id' => $trainer->id]);

        // Esta línea sirve para exigir que el otro entrenador no pueda gestionarla.
        $this->assertFalse($this->policy->manage($otherTrainer, $routine));
    }

    // Esta línea sirve para declarar el test que comprueba que un entrenador no puede gestionar una rutina del motor.
    public function test_trainer_cannot_manage_an_engine_generated_routine(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $client = User::factory()->create();
        // Esta línea sirve para crear un usuario entrenador.
        $trainer = User::factory()->create(['role' => 'trainer']);
        // Esta línea sirve para crear una rutina del motor.
        $routine = $this->makeRoutine($client, ['source' => 'engine']);

        // Esta línea sirve para exigir que el entrenador no pueda gestionarla.
        $this->assertFalse($this->policy->manage($trainer, $routine));
    }
}
