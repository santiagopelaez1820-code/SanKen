<?php

namespace Tests\Feature\Auth;

use App\Infrastructure\Firebase\FirebaseTokenClaims;
use App\Infrastructure\Firebase\FirebaseTokenVerifier;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery;
use Tests\TestCase;

class SocialLoginTest extends TestCase
{
    use RefreshDatabase;

    /**
     * No hay credenciales reales de Firebase en este entorno de test —
     * se reemplaza el verificador por un doble que devuelve claims fijos,
     * exactamente como si el ID Token ya hubiera sido verificado. Esto
     * prueba la lógica de vinculación/creación de cuentas, no el SDK de
     * Firebase en sí (eso lo cubre kreait/firebase-php, no nosotros).
     */
    private function fakeVerifier(FirebaseTokenClaims $claims): void
    {
        $mock = Mockery::mock(FirebaseTokenVerifier::class);
        $mock->shouldReceive('verify')->once()->andReturn($claims);
        $this->app->instance(FirebaseTokenVerifier::class, $mock);
    }

    public function test_new_user_is_created_on_first_google_login(): void
    {
        $this->fakeVerifier(new FirebaseTokenClaims(
            uid: 'firebase-uid-1',
            email: 'nuevo@example.com',
            emailVerified: true,
            name: 'Usuario Nuevo',
            picture: 'https://lh3.googleusercontent.com/a/photo.jpg',
        ));

        $response = $this->postJson('/api/v1/auth/social', [
            'id_token' => 'fake-token',
            'provider' => 'google',
        ]);

        $response->assertOk()
            ->assertJsonPath('data.user.email', 'nuevo@example.com')
            ->assertJsonPath('data.user.avatar_url', 'https://lh3.googleusercontent.com/a/photo.jpg')
            ->assertJsonStructure(['data' => ['user', 'token']]);

        $user = User::query()->where('email', 'nuevo@example.com')->firstOrFail();
        $this->assertSame('firebase-uid-1', $user->firebase_uid);
        $this->assertSame('google', $user->auth_provider);
        $this->assertNotNull($user->email_verified_at);
    }

    public function test_existing_user_with_same_firebase_uid_logs_into_the_same_account(): void
    {
        $user = User::factory()->create(['firebase_uid' => 'firebase-uid-2']);

        $this->fakeVerifier(new FirebaseTokenClaims(
            uid: 'firebase-uid-2',
            email: 'otro@example.com', // el email pudo haber cambiado en Google, no debe importar
            emailVerified: true,
            name: 'Otro Nombre',
            picture: null,
        ));

        $response = $this->postJson('/api/v1/auth/social', [
            'id_token' => 'fake-token',
            'provider' => 'google',
        ]);

        $response->assertOk()->assertJsonPath('data.user.id', $user->id);
        $this->assertSame(1, User::query()->count());
    }

    public function test_google_login_links_to_an_existing_email_password_account_instead_of_duplicating(): void
    {
        $user = User::factory()->create(['email' => 'kenneth@example.com', 'firebase_uid' => null]);

        $this->fakeVerifier(new FirebaseTokenClaims(
            uid: 'firebase-uid-3',
            email: 'kenneth@example.com',
            emailVerified: true,
            name: 'Kenneth',
            picture: null,
        ));

        $response = $this->postJson('/api/v1/auth/social', [
            'id_token' => 'fake-token',
            'provider' => 'google',
        ]);

        $response->assertOk()->assertJsonPath('data.user.id', $user->id);
        $this->assertSame(1, User::query()->count());
        $this->assertSame('firebase-uid-3', $user->fresh()->firebase_uid);
    }

    public function test_unverified_email_does_not_link_to_an_existing_account(): void
    {
        $existing = User::factory()->create(['email' => 'target@example.com', 'firebase_uid' => null]);

        $this->fakeVerifier(new FirebaseTokenClaims(
            uid: 'firebase-uid-4',
            email: 'target@example.com',
            emailVerified: false,
            name: 'Impostor',
            picture: null,
        ));

        $response = $this->postJson('/api/v1/auth/social', [
            'id_token' => 'fake-token',
            'provider' => 'google',
        ]);

        $response->assertUnprocessable()->assertJsonValidationErrors('id_token');
        $this->assertSame(1, User::query()->count());
        $this->assertNull($existing->fresh()->firebase_uid);
    }

    public function test_banned_user_cannot_log_in_via_google(): void
    {
        User::factory()->create(['firebase_uid' => 'firebase-uid-5', 'is_banned' => true]);

        $this->fakeVerifier(new FirebaseTokenClaims(
            uid: 'firebase-uid-5',
            email: 'banned@example.com',
            emailVerified: true,
            name: 'Banned',
            picture: null,
        ));

        $response = $this->postJson('/api/v1/auth/social', [
            'id_token' => 'fake-token',
            'provider' => 'google',
        ]);

        $response->assertUnprocessable()->assertJsonValidationErrors('id_token');
    }

    public function test_user_with_two_factor_enabled_gets_a_challenge_instead_of_a_token(): void
    {
        User::factory()->create(['firebase_uid' => 'firebase-uid-6', 'two_factor_enabled' => true]);

        $this->fakeVerifier(new FirebaseTokenClaims(
            uid: 'firebase-uid-6',
            email: '2fa@example.com',
            emailVerified: true,
            name: '2FA User',
            picture: null,
        ));

        $response = $this->postJson('/api/v1/auth/social', [
            'id_token' => 'fake-token',
            'provider' => 'google',
        ]);

        $response->assertOk()
            ->assertJsonPath('data.requires_two_factor', true)
            ->assertJsonStructure(['data' => ['challenge_token']]);
    }

    public function test_facebook_provider_is_rejected_for_now(): void
    {
        $response = $this->postJson('/api/v1/auth/social', [
            'id_token' => 'fake-token',
            'provider' => 'facebook',
        ]);

        $response->assertUnprocessable()->assertJsonValidationErrors('provider');
    }

    public function test_traditional_login_still_works_after_adding_social_login(): void
    {
        $user = User::factory()->create(['password' => bcrypt('Password!234')]);

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => $user->email,
            'password' => 'Password!234',
        ]);

        $response->assertOk()->assertJsonPath('data.user.id', $user->id);
    }
}
