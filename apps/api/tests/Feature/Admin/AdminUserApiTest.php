<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Feature\Admin.

namespace Tests\Feature\Admin;

// Esta línea sirve para importar el modelo City.
use App\Models\City;
// Esta línea sirve para importar el modelo Country.
use App\Models\Country;
// Esta línea sirve para importar el modelo Routine.
use App\Models\Routine;
// Esta línea sirve para importar el modelo State.
use App\Models\State;
// Esta línea sirve para importar el modelo User.
use App\Models\User;
// Esta línea sirve para importar el trait que reinicia la base de datos en cada test.
use Illuminate\Foundation\Testing\RefreshDatabase;
// Esta línea sirve para importar la clase base de los tests.
use Tests\TestCase;

// Esta línea sirve para declarar la clase de tests AdminUserApiTest.
class AdminUserApiTest extends TestCase
{
    // Esta línea sirve para reiniciar la base de datos en cada test.
    use RefreshDatabase;

    // Esta línea sirve para declarar el test que comprueba que un usuario normal no puede usar las rutas de admin.
    public function test_non_admin_cannot_access_admin_user_routes(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para hacer la petición a /api/v1/admin/users como user y exigir que responda 403.
        $this->actingAs($user, 'sanctum')->getJson('/api/v1/admin/users')->assertForbidden();
    }

    // Esta línea sirve para declarar el test que comprueba que se rechaza una petición sin sesión.
    public function test_unauthenticated_request_is_rejected(): void
    {
        // Esta línea sirve para hacer GET sin sesión y exigir que responda 401.
        $this->getJson('/api/v1/admin/users')->assertUnauthorized();
    }

    // Esta línea sirve para declarar el test que comprueba que el admin puede listar usuarios con filtros.
    public function test_admin_can_list_users_with_filters(): void
    {
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear un entrenador.
        User::factory()->create(['name' => 'Carlos Trainer', 'role' => 'trainer']);
        // Esta línea sirve para crear un usuario normal.
        User::factory()->create(['name' => 'Ana Cliente', 'role' => 'user']);
        // Esta línea sirve para crear un usuario baneado.
        User::factory()->create(['name' => 'Beto Baneado', 'is_banned' => true]);

        // Esta línea sirve para hacer GET a /api/v1/admin/users?role=trainer autenticado como admin.
        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/v1/admin/users?role=trainer');
        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "data" tenga 1 elementos.
        $this->assertCount(1, $response->json('data'));
        // Esta línea sirve para exigir que "data.0.name" sea exactamente 'Carlos Trainer'.
        $this->assertSame('Carlos Trainer', $response->json('data.0.name'));

        // Esta línea sirve para hacer GET a /api/v1/admin/users?is_banned=1 autenticado como admin.
        $banned = $this->actingAs($admin, 'sanctum')->getJson('/api/v1/admin/users?is_banned=1');
        // Esta línea sirve para exigir que "data" tenga 1 elementos.
        $this->assertCount(1, $banned->json('data'));

        // Esta línea sirve para hacer GET a /api/v1/admin/users?q=ana autenticado como admin.
        $search = $this->actingAs($admin, 'sanctum')->getJson('/api/v1/admin/users?q=ana');
        // Esta línea sirve para exigir que "data" tenga 1 elementos.
        $this->assertCount(1, $search->json('data'));
    }

    // Esta línea sirve para declarar el test que comprueba que el listado muestra la rutina actual de cada usuario.
    public function test_admin_user_list_exposes_current_routine_for_each_user(): void
    {
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear un usuario de prueba.
        $withRoutine = User::factory()->create();
        // Esta línea sirve para crear una rutina activa para un usuario.
        Routine::query()->create([
            // Esta línea sirve para asignar el usuario, el origen y el objetivo.
            'user_id' => $withRoutine->id, 'source' => 'engine', 'goal' => 'gain_muscle',
            // Esta línea sirve para asignar la división, la frecuencia, la duración y dejarla activa.
            'split_type' => 'full_body', 'frequency_days' => 3, 'duration_weeks' => 6, 'is_active' => true,
        ]);
        // Esta línea sirve para crear un usuario de prueba.
        $withoutRoutine = User::factory()->create();

        // Esta línea sirve para hacer GET a /api/v1/admin/users autenticado como admin.
        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/v1/admin/users');

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para indexar los usuarios de la respuesta por id.
        $byId = collect($response->json('data'))->keyBy('id');
        // Esta línea sirve para exigir que el usuario con rutina muestre "General 3 días".
        $this->assertSame('General 3 días', $byId[$withRoutine->id]['current_routine']['label']);
        // Esta línea sirve para exigir que el usuario sin rutina tenga la rutina en null.
        $this->assertNull($byId[$withoutRoutine->id]['current_routine']);
    }

    // Esta línea sirve para declarar el test que comprueba que banear revoca los tokens del usuario.
    public function test_admin_can_ban_a_user_and_it_revokes_their_active_tokens(): void
    {
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crearle un token de acceso al usuario.
        $user->createToken('device');

        // Esta línea sirve para preparar la petición autenticada como admin.
        $response = $this->actingAs($admin, 'sanctum')
            // Esta línea sirve para hacer PATCH a /api/v1/admin/users/{$user->id}/ban.
            ->patchJson("/api/v1/admin/users/{$user->id}/ban");

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "data.is_banned" sea verdadero.
        $this->assertTrue($response->json('data.is_banned'));
        // Esta línea sirve para exigir que la tabla users tenga ese registro.
        $this->assertDatabaseHas('users', ['id' => $user->id, 'is_banned' => true]);
        // Esta línea sirve para exigir que el usuario ya no tenga tokens de acceso.
        $this->assertSame(0, $user->tokens()->count());
    }

    // Esta línea sirve para declarar el test que comprueba que el admin puede desbanear.
    public function test_admin_can_unban_a_user(): void
    {
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear un usuario baneado.
        $user = User::factory()->create(['is_banned' => true]);

        // Esta línea sirve para preparar la petición autenticada como admin.
        $response = $this->actingAs($admin, 'sanctum')
            // Esta línea sirve para hacer PATCH a /api/v1/admin/users/{$user->id}/ban.
            ->patchJson("/api/v1/admin/users/{$user->id}/ban");

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "data.is_banned" sea falso.
        $this->assertFalse($response->json('data.is_banned'));
    }

    // Esta línea sirve para declarar el test que comprueba que el admin no puede banearse a sí mismo.
    public function test_admin_cannot_ban_themselves(): void
    {
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);

        // Esta línea sirve para preparar la petición autenticada como admin.
        $this->actingAs($admin, 'sanctum')
            // Esta línea sirve para hacer PATCH a /api/v1/admin/users/{$admin->id}/ban.
            ->patchJson("/api/v1/admin/users/{$admin->id}/ban")
            // Esta línea sirve para exigir que la respuesta sea 403 (prohibido).
            ->assertForbidden();
    }

    // Esta línea sirve para declarar el test que comprueba que el admin puede activar y quitar la verificación de entrenador.
    public function test_admin_can_toggle_trainer_verification(): void
    {
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear un usuario entrenador.
        $trainer = User::factory()->create(['role' => 'trainer']);

        // Esta línea sirve para preparar la petición autenticada como admin.
        $response = $this->actingAs($admin, 'sanctum')
            // Esta línea sirve para hacer PATCH a /api/v1/admin/users/{$trainer->id}/verify-trainer.
            ->patchJson("/api/v1/admin/users/{$trainer->id}/verify-trainer");

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "data.trainer_verified_at" no sea null.
        $this->assertNotNull($response->json('data.trainer_verified_at'));

        // Esta línea sirve para preparar la petición autenticada como admin.
        $toggledOff = $this->actingAs($admin, 'sanctum')
            // Esta línea sirve para hacer PATCH a /api/v1/admin/users/{$trainer->id}/verify-trainer.
            ->patchJson("/api/v1/admin/users/{$trainer->id}/verify-trainer");
        // Esta línea sirve para exigir que "data.trainer_verified_at" sea null.
        $this->assertNull($toggledOff->json('data.trainer_verified_at'));
    }

    // Esta línea sirve para declarar el test que comprueba que verificar a alguien que no es entrenador falla.
    public function test_verifying_a_non_trainer_fails(): void
    {
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear un usuario con rol normal.
        $regular = User::factory()->create(['role' => 'user']);

        // Esta línea sirve para preparar la petición autenticada como admin.
        $this->actingAs($admin, 'sanctum')
            // Esta línea sirve para hacer PATCH a /api/v1/admin/users/{$regular->id}/verify-trainer.
            ->patchJson("/api/v1/admin/users/{$regular->id}/verify-trainer")
            // Esta línea sirve para exigir que la respuesta sea 422.
            ->assertStatus(422);
    }

    // Esta línea sirve para declarar el test que comprueba el filtro por país y ciudad.
    public function test_admin_can_filter_users_by_country_and_city(): void
    {
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear un país.
        $country = Country::factory()->create();
        // Esta línea sirve para crear otro país.
        $otherCountry = Country::factory()->create();
        // Esta línea sirve para crear una ciudad del primer país.
        $city = City::factory()->create(['country_id' => $country->id]);
        // Esta línea sirve para crear una ciudad del otro país.
        $otherCity = City::factory()->create(['country_id' => $otherCountry->id]);

        // Esta línea sirve para crear un usuario de la ciudad.
        $inCity = User::factory()->create(['name' => 'En la ciudad']);
        // Esta línea sirve para crearle el perfil con esa ciudad.
        $inCity->profile()->create(['age' => 25, 'sex' => 'male', 'city_id' => $city->id]);
        // Esta línea sirve para crear un usuario de otro lado.
        $elsewhere = User::factory()->create(['name' => 'En otro lado']);
        // Esta línea sirve para crearle el perfil con la otra ciudad.
        $elsewhere->profile()->create(['age' => 25, 'sex' => 'male', 'city_id' => $otherCity->id]);

        // Esta línea sirve para hacer GET a /api/v1/admin/users?city_id={$city->id} autenticado como admin.
        $byCity = $this->actingAs($admin, 'sanctum')->getJson("/api/v1/admin/users?city_id={$city->id}");
        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $byCity->assertOk();
        // Esta línea sirve para exigir que "data" tenga 1 elementos.
        $this->assertCount(1, $byCity->json('data'));
        // Esta línea sirve para exigir que "data.0.name" sea exactamente 'En la ciudad'.
        $this->assertSame('En la ciudad', $byCity->json('data.0.name'));
        // Esta línea sirve para exigir que "data.0.city" sea exactamente $city->name.
        $this->assertSame($city->name, $byCity->json('data.0.city'));
        // Esta línea sirve para exigir que "data.0.country" sea exactamente $country->name.
        $this->assertSame($country->name, $byCity->json('data.0.country'));

        // Esta línea sirve para hacer GET a /api/v1/admin/users?country_id={$country->id} autenticado como admin.
        $byCountry = $this->actingAs($admin, 'sanctum')->getJson("/api/v1/admin/users?country_id={$country->id}");
        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $byCountry->assertOk();
        // Esta línea sirve para exigir que "data" tenga 1 elementos.
        $this->assertCount(1, $byCountry->json('data'));
    }

    // Esta línea sirve para declarar el test que comprueba el filtro por departamento/estado.
    public function test_admin_can_filter_users_by_state(): void
    {
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear un país.
        $country = Country::factory()->create();
        // Esta línea sirve para crear el estado Antioquia.
        $antioquia = State::factory()->create(['country_id' => $country->id, 'name' => 'Antioquia']);
        // Esta línea sirve para crear el estado Cundinamarca.
        $cundinamarca = State::factory()->create(['country_id' => $country->id, 'name' => 'Cundinamarca']);
        // Esta línea sirve para crear Medellín en Antioquia.
        $medellin = City::factory()->create(['country_id' => $country->id, 'state_id' => $antioquia->id]);
        // Esta línea sirve para crear Bogotá en Cundinamarca.
        $bogota = City::factory()->create(['country_id' => $country->id, 'state_id' => $cundinamarca->id]);

        // Esta línea sirve para crear un usuario de Antioquia.
        $inAntioquia = User::factory()->create(['name' => 'En Antioquia']);
        // Esta línea sirve para crearle el perfil en Medellín.
        $inAntioquia->profile()->create(['age' => 25, 'sex' => 'male', 'city_id' => $medellin->id]);
        // Esta línea sirve para crear un usuario de Cundinamarca.
        $inCundinamarca = User::factory()->create(['name' => 'En Cundinamarca']);
        // Esta línea sirve para crearle el perfil en Bogotá.
        $inCundinamarca->profile()->create(['age' => 25, 'sex' => 'male', 'city_id' => $bogota->id]);

        // Esta línea sirve para hacer GET a /api/v1/admin/users?state_id={$antioquia->id} autenticado como admin.
        $response = $this->actingAs($admin, 'sanctum')->getJson("/api/v1/admin/users?state_id={$antioquia->id}");

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "data" tenga 1 elementos.
        $this->assertCount(1, $response->json('data'));
        // Esta línea sirve para exigir que "data.0.name" sea exactamente 'En Antioquia'.
        $this->assertSame('En Antioquia', $response->json('data.0.name'));
        // Esta línea sirve para exigir que "data.0.state" sea exactamente 'Antioquia'.
        $this->assertSame('Antioquia', $response->json('data.0.state'));
    }

    // Esta línea sirve para declarar el test que comprueba que el admin ve el detalle del usuario con entrenamientos y PRs.
    public function test_admin_can_view_user_detail_with_trainings_and_prs(): void
    {
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crearle un perfil al usuario.
        $user->profile()->create(['age' => 28, 'sex' => 'female']);

        // Esta línea sirve para hacer GET a /api/v1/admin/users/{$user->id} autenticado como admin.
        $response = $this->actingAs($admin, 'sanctum')->getJson("/api/v1/admin/users/{$user->id}");

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "data.id" sea $user->id.
        $response->assertJsonPath('data.id', $user->id);
        // Esta línea sirve para exigir que "data.age" sea 28.
        $response->assertJsonPath('data.age', 28);
        // Esta línea sirve para exigir que "data.trainings_completed" sea 0.
        $response->assertJsonPath('data.trainings_completed', 0);
        // Esta línea sirve para exigir que "data.personal_records" sea [].
        $response->assertJsonPath('data.personal_records', []);
    }

    // Esta línea sirve para declarar el test que comprueba que el admin puede ascender a entrenador y volver a usuario.
    public function test_admin_can_promote_a_user_to_trainer_and_demote_back(): void
    {
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear un usuario con rol normal.
        $user = User::factory()->create(['role' => 'user']);

        // Esta línea sirve para preparar la petición autenticada como admin.
        $promoted = $this->actingAs($admin, 'sanctum')
            // Esta línea sirve para hacer PATCH a /api/v1/admin/users/{$user->id}/role con los datos enviados.
            ->patchJson("/api/v1/admin/users/{$user->id}/role", ['role' => 'trainer']);
        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $promoted->assertOk();
        // Esta línea sirve para exigir que "data.role" sea 'trainer'.
        $promoted->assertJsonPath('data.role', 'trainer');

        // Esta línea sirve para preparar la petición autenticada como admin.
        $demoted = $this->actingAs($admin, 'sanctum')
            // Esta línea sirve para hacer PATCH a /api/v1/admin/users/{$user->id}/role con los datos enviados.
            ->patchJson("/api/v1/admin/users/{$user->id}/role", ['role' => 'user']);
        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $demoted->assertOk();
        // Esta línea sirve para exigir que "data.role" sea 'user'.
        $demoted->assertJsonPath('data.role', 'user');
    }

    // Esta línea sirve para declarar el test que comprueba que nadie puede asignar el rol super_admin, ni un super admin.
    public function test_role_change_to_super_admin_is_rejected_even_by_a_super_admin(): void
    {
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear un usuario con rol normal.
        $user = User::factory()->create(['role' => 'user']);

        // Esta línea sirve para preparar la petición autenticada como admin.
        $this->actingAs($admin, 'sanctum')
            // Esta línea sirve para hacer PATCH a /api/v1/admin/users/{$user->id}/role con los datos enviados.
            ->patchJson("/api/v1/admin/users/{$user->id}/role", ['role' => 'super_admin'])
            // Esta línea sirve para exigir que la respuesta sea 422.
            ->assertStatus(422);

        // Esta línea sirve para exigir que en la base de datos "role" sea 'user'.
        $this->assertSame('user', $user->fresh()->role);
    }

    // Esta línea sirve para declarar el test que comprueba que el admin no puede cambiar su propio rol.
    public function test_admin_cannot_change_their_own_role(): void
    {
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);

        // Esta línea sirve para preparar la petición autenticada como admin.
        $this->actingAs($admin, 'sanctum')
            // Esta línea sirve para hacer PATCH a /api/v1/admin/users/{$admin->id}/role con los datos enviados.
            ->patchJson("/api/v1/admin/users/{$admin->id}/role", ['role' => 'user'])
            // Esta línea sirve para exigir que la respuesta sea 403 (prohibido).
            ->assertForbidden();

        // Esta línea sirve para exigir que en la base de datos "role" sea 'super_admin'.
        $this->assertSame('super_admin', $admin->fresh()->role);
    }

    // Esta línea sirve para declarar el test que comprueba que el admin puede desactivar y reactivar una cuenta.
    public function test_admin_can_deactivate_and_reactivate_a_user(): void
    {
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crearle un token de acceso al usuario.
        $user->createToken('device');

        // Esta línea sirve para preparar la petición autenticada como admin.
        $deactivated = $this->actingAs($admin, 'sanctum')
            // Esta línea sirve para hacer PATCH a /api/v1/admin/users/{$user->id}/deactivate.
            ->patchJson("/api/v1/admin/users/{$user->id}/deactivate");
        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $deactivated->assertOk();
        // Esta línea sirve para exigir que "data.is_deactivated" sea verdadero.
        $this->assertTrue($deactivated->json('data.is_deactivated'));
        // Esta línea sirve para exigir que el usuario ya no tenga tokens de acceso.
        $this->assertSame(0, $user->tokens()->count());

        // Esta línea sirve para preparar la petición autenticada como admin.
        $reactivated = $this->actingAs($admin, 'sanctum')
            // Esta línea sirve para hacer PATCH a /api/v1/admin/users/{$user->id}/activate.
            ->patchJson("/api/v1/admin/users/{$user->id}/activate");
        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $reactivated->assertOk();
        // Esta línea sirve para exigir que "data.is_deactivated" sea falso.
        $this->assertFalse($reactivated->json('data.is_deactivated'));
    }

    // Esta línea sirve para declarar el test que comprueba que una cuenta desactivada no puede iniciar sesión.
    public function test_a_deactivated_user_cannot_log_in(): void
    {
        // Esta línea sirve para crear un usuario desactivado con contraseña conocida.
        $user = User::factory()->create(['deactivated_at' => now(), 'password' => bcrypt('password123')]);

        // Esta línea sirve para intentar iniciar sesión con sus credenciales.
        $this->postJson('/api/v1/auth/login', ['email' => $user->email, 'password' => 'password123'])
            // Esta línea sirve para exigir que la respuesta sea 422.
            ->assertStatus(422);
    }

    // Esta línea sirve para declarar el test que comprueba que el admin puede eliminar una cuenta.
    public function test_admin_can_delete_a_user_account(): void
    {
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crearle un token de acceso al usuario.
        $user->createToken('device');

        // Esta línea sirve para hacer DELETE a /api/v1/admin/users/{$user->id} autenticado como admin.
        $response = $this->actingAs($admin, 'sanctum')->deleteJson("/api/v1/admin/users/{$user->id}");

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que la tabla users no tenga ese registro.
        $this->assertDatabaseMissing('users', ['id' => $user->id]);
    }

    // Esta línea sirve para declarar el test que comprueba que el admin no puede eliminarse a sí mismo.
    public function test_admin_cannot_delete_themselves(): void
    {
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);

        // Esta línea sirve para preparar la petición autenticada como admin.
        $this->actingAs($admin, 'sanctum')
            // Esta línea sirve para hacer DELETE a /api/v1/admin/users/{$admin->id}.
            ->deleteJson("/api/v1/admin/users/{$admin->id}")
            // Esta línea sirve para exigir que la respuesta sea 403 (prohibido).
            ->assertForbidden();

        // Esta línea sirve para exigir que la tabla users tenga ese registro.
        $this->assertDatabaseHas('users', ['id' => $admin->id]);
    }
}
