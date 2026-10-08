<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Unit\Policies.

namespace Tests\Unit\Policies;

// Esta línea sirve para importar el modelo TrainerClient.
use App\Models\TrainerClient;
// Esta línea sirve para importar el modelo User.
use App\Models\User;
// Esta línea sirve para importar la clase TrainerClientPolicy.
use App\Policies\TrainerClientPolicy;
// Esta línea sirve para importar el trait que reinicia la base de datos en cada test.
use Illuminate\Foundation\Testing\RefreshDatabase;
// Esta línea sirve para importar la clase base de los tests.
use Tests\TestCase;

// Esta línea sirve para declarar la clase de tests TrainerClientPolicyTest.
class TrainerClientPolicyTest extends TestCase
{
    // Esta línea sirve para reiniciar la base de datos en cada test.
    use RefreshDatabase;

    // Esta línea sirve para guardar la policy de relaciones entrenador-cliente.
    private TrainerClientPolicy $policy;

    // Esta línea sirve para declarar la preparación que corre antes de cada test.
    protected function setUp(): void
    {
        // Esta línea sirve para ejecutar la preparación base de Laravel.
        parent::setUp();
        // Esta línea sirve para crear la policy.
        $this->policy = new TrainerClientPolicy;
    }

    // Esta línea sirve para declarar el método auxiliar que crea una relación entrenador-cliente.
    private function makeRelation(User $trainer, User $client): TrainerClient
    {
        // Esta línea sirve para crear y devolver la relación.
        return TrainerClient::query()->create([
            // Esta línea sirve para asignar $trainer->id al campo "trainer_id".
            'trainer_id' => $trainer->id,
            // Esta línea sirve para asignar $client->id al campo "client_id".
            'client_id' => $client->id,
            // Esta línea sirve para asignar 'active' al campo "status".
            'status' => 'active',
            // Esta línea sirve para asignar now() al campo "started_at".
            'started_at' => now(),
        ]);
    }

    // Esta línea sirve para declarar el test que comprueba que el entrenador puede ver y editar a su cliente.
    public function test_trainer_can_view_and_update_their_own_client(): void
    {
        // Esta línea sirve para crear un usuario entrenador.
        $trainer = User::factory()->create(['role' => 'trainer']);
        // Esta línea sirve para crear un usuario de prueba.
        $client = User::factory()->create();
        // Esta línea sirve para crear la relación.
        $relation = $this->makeRelation($trainer, $client);

        // Esta línea sirve para exigir que el entrenador pueda verla.
        $this->assertTrue($this->policy->view($trainer, $relation));
        // Esta línea sirve para exigir que el entrenador pueda editarla.
        $this->assertTrue($this->policy->update($trainer, $relation));
    }

    // Esta línea sirve para declarar el test que comprueba que otro entrenador no puede ver ni editar al cliente.
    public function test_another_trainer_cannot_view_or_update_the_client(): void
    {
        // Esta línea sirve para crear un usuario entrenador.
        $trainer = User::factory()->create(['role' => 'trainer']);
        // Esta línea sirve para crear un usuario entrenador.
        $otherTrainer = User::factory()->create(['role' => 'trainer']);
        // Esta línea sirve para crear un usuario de prueba.
        $client = User::factory()->create();
        // Esta línea sirve para crear la relación.
        $relation = $this->makeRelation($trainer, $client);

        // Esta línea sirve para exigir que el otro entrenador no pueda verla.
        $this->assertFalse($this->policy->view($otherTrainer, $relation));
        // Esta línea sirve para exigir que el otro entrenador no pueda editarla.
        $this->assertFalse($this->policy->update($otherTrainer, $relation));
    }

    // Esta línea sirve para declarar el test que comprueba que ambos pueden conversar mientras la relación esté activa.
    public function test_both_trainer_and_client_can_converse_while_active(): void
    {
        // Esta línea sirve para crear un usuario entrenador.
        $trainer = User::factory()->create(['role' => 'trainer']);
        // Esta línea sirve para crear un usuario de prueba.
        $client = User::factory()->create();
        // Esta línea sirve para crear la relación.
        $relation = $this->makeRelation($trainer, $client);

        // Esta línea sirve para exigir que el entrenador pueda conversar.
        $this->assertTrue($this->policy->converse($trainer, $relation));
        // Esta línea sirve para exigir que el cliente pueda conversar.
        $this->assertTrue($this->policy->converse($client, $relation));
    }

    // Esta línea sirve para declarar el test que comprueba que un extraño no puede conversar.
    public function test_a_stranger_cannot_converse(): void
    {
        // Esta línea sirve para crear un usuario entrenador.
        $trainer = User::factory()->create(['role' => 'trainer']);
        // Esta línea sirve para crear un usuario de prueba.
        $client = User::factory()->create();
        // Esta línea sirve para crear un usuario de prueba.
        $stranger = User::factory()->create();
        // Esta línea sirve para crear la relación.
        $relation = $this->makeRelation($trainer, $client);

        // Esta línea sirve para exigir que el extraño no pueda conversar.
        $this->assertFalse($this->policy->converse($stranger, $relation));
    }

    // Esta línea sirve para declarar el test que comprueba que nadie conversa si la relación está pausada o terminada.
    public function test_neither_party_can_converse_once_the_relationship_is_paused_or_ended(): void
    {
        // Esta línea sirve para crear un usuario entrenador.
        $trainer = User::factory()->create(['role' => 'trainer']);
        // Esta línea sirve para crear un usuario de prueba.
        $client = User::factory()->create();
        // Esta línea sirve para crear la relación.
        $paused = $this->makeRelation($trainer, $client);
        // Esta línea sirve para pausar la relación.
        $paused->update(['status' => 'paused']);

        // Esta línea sirve para exigir que el entrenador no pueda conversar.
        $this->assertFalse($this->policy->converse($trainer, $paused));
        // Esta línea sirve para exigir que el cliente no pueda conversar.
        $this->assertFalse($this->policy->converse($client, $paused));
    }
}
