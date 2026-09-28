<?php

namespace Tests\Feature\Legal;

use App\Infrastructure\Firebase\FirebaseUserDeleter;
use App\Models\User;
use App\Models\UserConsent;
use Database\Factories\UserFactory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Mockery;
use Tests\TestCase;

/**
 * Bloqueo en el servidor de cuentas con consentimientos pendientes
 * (EnsureLegalConsentsAccepted) y eliminación de la propia cuenta.
 */
class LegalEnforcementTest extends TestCase
{
    use RefreshDatabase;

    protected function tearDown(): void
    {
        UserFactory::$acceptLegalConsents = true;
        parent::tearDown();
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    private function userWithoutConsents(array $attributes = []): User
    {
        UserFactory::$acceptLegalConsents = false;
        $user = User::factory()->create($attributes);
        UserFactory::$acceptLegalConsents = true;

        return $user;
    }

    // --- Bloqueo -----------------------------------------------------------

    public function test_factory_users_accept_the_current_documents_by_default(): void
    {
        $user = User::factory()->create();

        $this->assertSame(3, $user->consents()->count());
        $this->actingAs($user)->getJson('/api/v1/stats/dashboard')->assertOk();
    }

    public function test_user_with_pending_consents_is_blocked_on_regular_routes(): void
    {
        $user = $this->userWithoutConsents();

        $this->actingAs($user)->getJson('/api/v1/stats/dashboard')
            ->assertForbidden()
            ->assertJsonPath('code', 'consent_required')
            ->assertJsonCount(3, 'pending');

        $this->actingAs($user)->getJson('/api/v1/feed')->assertForbidden();
        $this->actingAs($user)->postJson('/api/v1/rankings/opt-in')->assertForbidden();
    }

    public function test_a_new_document_version_blocks_users_until_they_reaccept(): void
    {
        $user = User::factory()->create();
        config(['legal.documents.terms.version' => '2.0']);

        $this->actingAs($user)->getJson('/api/v1/stats/dashboard')
            ->assertForbidden()
            ->assertJsonPath('pending.0.type', 'terms');

        $this->actingAs($user)->postJson('/api/v1/legal/consents', ['consents' => ['terms']])->assertOk();

        $this->actingAs($user)->getJson('/api/v1/stats/dashboard')->assertOk();
    }

    public function test_routes_needed_to_leave_the_blocked_state_stay_available(): void
    {
        $user = $this->userWithoutConsents();

        $this->actingAs($user)->getJson('/api/v1/auth/me')->assertOk()
            ->assertJsonPath('data.pending_consents', ['terms', 'privacy', 'health_data']);
        $this->actingAs($user)->getJson('/api/v1/legal/consents')->assertOk();
        $this->actingAs($user)->getJson('/api/v1/legal/documents')->assertOk();
    }

    public function test_logout_stays_available_while_blocked(): void
    {
        $user = $this->userWithoutConsents();
        $token = $user->createToken('test')->plainTextToken;

        $this->withToken($token)->postJson('/api/v1/auth/logout')->assertOk();
    }

    public function test_guests_are_not_affected(): void
    {
        $this->getJson('/api/v1/stats/dashboard')->assertUnauthorized();
        $this->getJson('/api/v1/ping')->assertOk();
    }

    // --- Eliminación de la propia cuenta -----------------------------------

    public function test_email_account_requires_password_and_confirmation_word(): void
    {
        $user = User::factory()->create(['password' => 'Password!234', 'auth_provider' => null]);

        $this->actingAs($user)->deleteJson('/api/v1/auth/me', ['confirmation' => 'ELIMINAR'])
            ->assertUnprocessable()->assertJsonValidationErrors('password');

        $this->actingAs($user)->deleteJson('/api/v1/auth/me', ['confirmation' => 'ELIMINAR', 'password' => 'wrong'])
            ->assertUnprocessable()->assertJsonValidationErrors('password');

        $this->actingAs($user)->deleteJson('/api/v1/auth/me', ['confirmation' => 'borrar', 'password' => 'Password!234'])
            ->assertUnprocessable()->assertJsonValidationErrors('confirmation');

        $this->assertDatabaseHas('users', ['id' => $user->id]);
    }

    public function test_email_account_is_deleted_with_its_consents_tokens_and_files(): void
    {
        Storage::fake('public');
        $path = UploadedFile::fake()->image('avatar.jpg')->store('avatars', 'public');
        $user = User::factory()->create([
            'password' => 'Password!234',
            'auth_provider' => null,
            'avatar_url' => '/storage/'.$path,
        ]);
        $user->createToken('test');

        $this->actingAs($user)
            ->deleteJson('/api/v1/auth/me', ['confirmation' => 'ELIMINAR', 'password' => 'Password!234'])
            ->assertOk();

        $this->assertDatabaseMissing('users', ['id' => $user->id]);
        $this->assertSame(0, UserConsent::query()->where('user_id', $user->id)->count());
        $this->assertDatabaseMissing('personal_access_tokens', ['tokenable_id' => $user->id]);
        Storage::disk('public')->assertMissing($path);
    }

    public function test_google_account_is_deleted_with_confirmation_only_and_firebase_user_is_removed(): void
    {
        $user = User::factory()->create(['auth_provider' => 'google', 'firebase_uid' => 'uid-123']);

        $firebase = Mockery::mock(FirebaseUserDeleter::class);
        $firebase->shouldReceive('delete')->once()->with('uid-123')->andReturn(true);
        $this->app->instance(FirebaseUserDeleter::class, $firebase);

        $this->actingAs($user)->deleteJson('/api/v1/auth/me', ['confirmation' => 'ELIMINAR'])->assertOk();

        $this->assertDatabaseMissing('users', ['id' => $user->id]);
    }

    public function test_a_user_with_pending_consents_can_still_delete_the_account(): void
    {
        $user = $this->userWithoutConsents(['password' => 'Password!234', 'auth_provider' => null]);

        $this->actingAs($user)
            ->deleteJson('/api/v1/auth/me', ['confirmation' => 'ELIMINAR', 'password' => 'Password!234'])
            ->assertOk();

        $this->assertDatabaseMissing('users', ['id' => $user->id]);
    }

    public function test_super_admin_cannot_self_delete(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin', 'password' => 'Password!234', 'auth_provider' => null]);

        $this->actingAs($admin)
            ->deleteJson('/api/v1/auth/me', ['confirmation' => 'ELIMINAR', 'password' => 'Password!234'])
            ->assertForbidden();

        $this->assertDatabaseHas('users', ['id' => $admin->id]);
    }

    public function test_deletion_requires_authentication(): void
    {
        $this->deleteJson('/api/v1/auth/me', ['confirmation' => 'ELIMINAR'])->assertUnauthorized();
    }

    public function test_auth_provider_is_exposed_to_the_owner(): void
    {
        $user = User::factory()->create(['auth_provider' => 'google']);

        $this->actingAs($user)->getJson('/api/v1/auth/me')->assertJsonPath('data.auth_provider', 'google');
    }
}
