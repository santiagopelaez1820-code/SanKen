<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Unit\Policies.

namespace Tests\Unit\Policies;

// Esta línea sirve para importar el modelo User.
use App\Models\User;
// Esta línea sirve para importar el modelo WorkoutSession.
use App\Models\WorkoutSession;
// Esta línea sirve para importar la clase WorkoutSessionPolicy.
use App\Policies\WorkoutSessionPolicy;
// Esta línea sirve para importar el trait que reinicia la base de datos en cada test.
use Illuminate\Foundation\Testing\RefreshDatabase;
// Esta línea sirve para importar la clase base de los tests.
use Tests\TestCase;

// Esta línea sirve para declarar la clase de tests WorkoutSessionPolicyTest.
class WorkoutSessionPolicyTest extends TestCase
{
    // Esta línea sirve para reiniciar la base de datos en cada test.
    use RefreshDatabase;

    // Esta línea sirve para guardar la policy de sesiones de entrenamiento.
    private WorkoutSessionPolicy $policy;

    // Esta línea sirve para declarar la preparación que corre antes de cada test.
    protected function setUp(): void
    {
        // Esta línea sirve para ejecutar la preparación base de Laravel.
        parent::setUp();
        // Esta línea sirve para crear la policy.
        $this->policy = new WorkoutSessionPolicy;
    }

    // Esta línea sirve para declarar el test que comprueba que el dueño puede ver su sesión.
    public function test_owner_can_view_their_session(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear la sesión del usuario.
        $session = WorkoutSession::query()->create(['user_id' => $user->id, 'performed_at' => now()]);

        // Esta línea sirve para exigir que el dueño pueda verla.
        $this->assertTrue($this->policy->view($user, $session));
    }

    // Esta línea sirve para declarar el test que comprueba que otro usuario no puede ver la sesión.
    public function test_another_user_cannot_view_the_session(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un usuario de prueba.
        $other = User::factory()->create();
        // Esta línea sirve para crear la sesión del usuario.
        $session = WorkoutSession::query()->create(['user_id' => $user->id, 'performed_at' => now()]);

        // Esta línea sirve para exigir que otro usuario no pueda verla.
        $this->assertFalse($this->policy->view($other, $session));
    }
}
