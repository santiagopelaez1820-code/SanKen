<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Feature\Rankings.

namespace Tests\Feature\Rankings;

// Esta línea sirve para importar el modelo User.
use App\Models\User;
// Esta línea sirve para importar el trait que reinicia la base de datos en cada test.
use Illuminate\Foundation\Testing\RefreshDatabase;
// Esta línea sirve para importar la clase base de los tests.
use Tests\TestCase;

// Esta línea sirve para declarar la clase de tests RankingOptInApiTest.
class RankingOptInApiTest extends TestCase
{
    // Esta línea sirve para reiniciar la base de datos en cada test.
    use RefreshDatabase;

    // Esta línea sirve para declarar el test que comprueba que las peticiones sin sesión se rechazan.
    public function test_unauthenticated_requests_are_rejected(): void
    {
        // Esta línea sirve para hacer la petición a /api/v1/rankings/opt-in sin sesión y exigir que responda 401.
        $this->postJson('/api/v1/rankings/opt-in')->assertUnauthorized();
        // Esta línea sirve para hacer la petición a /api/v1/rankings/opt-out sin sesión y exigir que responda 401.
        $this->postJson('/api/v1/rankings/opt-out')->assertUnauthorized();
    }

    // Esta línea sirve para declarar el test que comprueba que mostrar el perfil lo hace público.
    public function test_opt_in_makes_the_users_profile_public(): void
    {
        // Esta línea sirve para crear un usuario con perfil privado.
        $user = User::factory()->create(['is_public_profile' => false]);

        // Esta línea sirve para hacer POST a /api/v1/rankings/opt-in autenticado como user.
        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/rankings/opt-in');

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "data.is_public_profile" sea true.
        $response->assertJsonPath('data.is_public_profile', true);
        // Esta línea sirve para exigir que la tabla users tenga ese registro.
        $this->assertDatabaseHas('users', ['id' => $user->id, 'is_public_profile' => true]);
    }

    // Esta línea sirve para declarar el test que comprueba que ocultar el perfil lo hace privado.
    public function test_opt_out_makes_the_users_profile_private(): void
    {
        // Esta línea sirve para crear un usuario con perfil público.
        $user = User::factory()->create(['is_public_profile' => true]);

        // Esta línea sirve para hacer POST a /api/v1/rankings/opt-out autenticado como user.
        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/rankings/opt-out');

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "data.is_public_profile" sea false.
        $response->assertJsonPath('data.is_public_profile', false);
        // Esta línea sirve para exigir que la tabla users tenga ese registro.
        $this->assertDatabaseHas('users', ['id' => $user->id, 'is_public_profile' => false]);
    }

    // Esta línea sirve para declarar el test que comprueba que mostrar el perfil solo afecta al usuario autenticado.
    public function test_opt_in_only_affects_the_authenticated_user(): void
    {
        // Esta línea sirve para crear un usuario con perfil privado.
        $user = User::factory()->create(['is_public_profile' => false]);
        // Esta línea sirve para crear otro usuario con perfil privado.
        $stranger = User::factory()->create(['is_public_profile' => false]);

        // Esta línea sirve para hacer la petición a /api/v1/rankings/opt-in como user y exigir que responda 200.
        $this->actingAs($user, 'sanctum')->postJson('/api/v1/rankings/opt-in')->assertOk();

        // Esta línea sirve para exigir que la tabla users tenga ese registro.
        $this->assertDatabaseHas('users', ['id' => $user->id, 'is_public_profile' => true]);
        // Esta línea sirve para exigir que la tabla users tenga ese registro.
        $this->assertDatabaseHas('users', ['id' => $stranger->id, 'is_public_profile' => false]);
    }
}
