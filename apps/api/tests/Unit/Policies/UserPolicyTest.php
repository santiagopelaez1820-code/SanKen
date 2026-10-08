<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Unit\Policies.

namespace Tests\Unit\Policies;

// Esta línea sirve para importar el modelo User.
use App\Models\User;
// Esta línea sirve para importar la clase UserPolicy.
use App\Policies\UserPolicy;
// Esta línea sirve para importar el trait que reinicia la base de datos en cada test.
use Illuminate\Foundation\Testing\RefreshDatabase;
// Esta línea sirve para importar la clase base de los tests.
use Tests\TestCase;

// Esta línea sirve para declarar la clase de tests UserPolicyTest.
class UserPolicyTest extends TestCase
{
    // Esta línea sirve para reiniciar la base de datos en cada test.
    use RefreshDatabase;

    // Esta línea sirve para guardar la policy de usuarios.
    private UserPolicy $policy;

    // Esta línea sirve para declarar la preparación que corre antes de cada test.
    protected function setUp(): void
    {
        // Esta línea sirve para ejecutar la preparación base de Laravel.
        parent::setUp();
        // Esta línea sirve para crear la policy.
        $this->policy = new UserPolicy;
    }

    // Esta línea sirve para declarar el test que comprueba que el usuario puede ver y editar su propio perfil.
    public function test_user_can_view_and_update_their_own_profile(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para exigir que pueda verlo.
        $this->assertTrue($this->policy->view($user, $user));
        // Esta línea sirve para exigir que pueda editarlo.
        $this->assertTrue($this->policy->update($user, $user));
    }

    // Esta línea sirve para declarar el test que comprueba que el usuario no puede ver ni editar el perfil de otro.
    public function test_user_cannot_view_or_update_another_users_profile(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un usuario de prueba.
        $other = User::factory()->create();

        // Esta línea sirve para exigir que no pueda verlo.
        $this->assertFalse($this->policy->view($user, $other));
        // Esta línea sirve para exigir que no pueda editarlo.
        $this->assertFalse($this->policy->update($user, $other));
    }

    // Esta línea sirve para declarar el test que comprueba que el admin puede ver y editar cualquier perfil.
    public function test_admin_can_view_and_update_any_profile(): void
    {
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear un usuario de prueba.
        $other = User::factory()->create();

        // Esta línea sirve para exigir que pueda verlo.
        $this->assertTrue($this->policy->view($admin, $other));
        // Esta línea sirve para exigir que pueda editarlo.
        $this->assertTrue($this->policy->update($admin, $other));
    }

    // Esta línea sirve para declarar el test que comprueba que solo el admin puede banear y nunca a sí mismo.
    public function test_only_admin_can_ban_and_never_themselves(): void
    {
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para exigir que el admin pueda banear a un usuario.
        $this->assertTrue($this->policy->ban($admin, $user));
        // Esta línea sirve para exigir que el admin no pueda banearse a sí mismo.
        $this->assertFalse($this->policy->ban($admin, $admin));
        // Esta línea sirve para exigir que un usuario normal no pueda banear al admin.
        $this->assertFalse($this->policy->ban($user, $admin));
    }
}
