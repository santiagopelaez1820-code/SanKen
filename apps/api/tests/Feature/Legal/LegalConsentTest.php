<?php

namespace Tests\Feature\Legal;

use App\Http\Resources\UserResource;
use App\Infrastructure\Firebase\FirebaseTokenClaims;
use App\Infrastructure\Firebase\FirebaseTokenVerifier;
use App\Models\User;
use App\Models\UserConsent;
use Database\Factories\UserFactory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use LogicException;
use Mockery;
use Tests\TestCase;

class LegalConsentTest extends TestCase
{
    use RefreshDatabase;

    private const ALL_CONSENTS = ['accept_terms' => true, 'accept_privacy' => true, 'accept_health_data' => true];

    /**
     * Estos tests necesitan usuarios SIN consentimientos (cuentas previas al
     * sistema legal); el resto de la suite usa la factory que ya los acepta.
     */
    protected function setUp(): void
    {
        parent::setUp();
        UserFactory::$acceptLegalConsents = false;
        // Estos tests prueban el mecanismo de versiones, no la versión
        // publicada hoy: se fijan todas en 1.0 (y cada test sube la que
        // necesite) para que publicar una versión nueva no los rompa.
        config([
            'legal.documents.terms.version' => '1.0',
            'legal.documents.privacy.version' => '1.0',
            'legal.documents.cookies.version' => '1.0',
        ]);
    }

    protected function tearDown(): void
    {
        UserFactory::$acceptLegalConsents = true;
        parent::tearDown();
    }

    /**
     * @param  array<string, mixed>  $overrides
     * @return array<string, mixed>
     */
    private function registrationPayload(array $overrides = []): array
    {
        return array_merge([
            'name' => 'Santiago Pelaez',
            'email' => 'santiago@example.com',
            'password' => 'Password!234',
            'password_confirmation' => 'Password!234',
        ], self::ALL_CONSENTS, $overrides);
    }

    private function acceptAllAt(User $user, string $version): void
    {
        foreach (['terms', 'privacy', 'health_data'] as $type) {
            UserConsent::query()->create([
                'user_id' => $user->id,
                'consent_type' => $type,
                'document_version' => $version,
                'status' => UserConsent::STATUS_ACCEPTED,
                'source' => UserConsent::SOURCE_REGISTRATION,
                'recorded_at' => now(),
            ]);
        }
    }

    private function fakeGoogle(string $uid, string $email): void
    {
        $mock = Mockery::mock(FirebaseTokenVerifier::class);
        $mock->shouldReceive('verify')->andReturn(new FirebaseTokenClaims(
            uid: $uid,
            email: $email,
            emailVerified: true,
            name: 'Usuario Google',
            picture: null,
        ));
        $this->app->instance(FirebaseTokenVerifier::class, $mock);
    }

    // --- Registro ---------------------------------------------------------

    public function test_registration_with_all_consents_records_each_one_at_the_current_version(): void
    {
        Notification::fake();

        $response = $this->postJson('/api/v1/auth/register', $this->registrationPayload());

        $response->assertCreated()->assertJsonPath('data.user.pending_consents', []);

        $user = User::query()->where('email', 'santiago@example.com')->firstOrFail();
        foreach (['terms', 'privacy', 'health_data'] as $type) {
            $this->assertDatabaseHas('user_consents', [
                'user_id' => $user->id,
                'consent_type' => $type,
                'document_version' => '1.0',
                'status' => 'accepted',
                'source' => 'registration',
            ]);
        }
    }

    public function test_registration_without_accepting_terms_is_rejected_and_no_account_is_created(): void
    {
        $response = $this->postJson('/api/v1/auth/register', $this->registrationPayload(['accept_terms' => false]));

        $response->assertUnprocessable()->assertJsonValidationErrors('accept_terms');
        $this->assertDatabaseMissing('users', ['email' => 'santiago@example.com']);
        $this->assertDatabaseCount('user_consents', 0);
    }

    public function test_each_consent_is_required_separately(): void
    {
        $payload = $this->registrationPayload();
        unset($payload['accept_privacy'], $payload['accept_health_data']);

        $this->postJson('/api/v1/auth/register', $payload)
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['accept_privacy', 'accept_health_data'])
            ->assertJsonMissingValidationErrors('accept_terms');
    }

    public function test_registration_rejects_a_stale_document_version_shown_by_the_client(): void
    {
        $response = $this->postJson('/api/v1/auth/register', $this->registrationPayload([
            'legal_versions' => ['terms' => '0.9'],
        ]));

        $response->assertUnprocessable()->assertJsonValidationErrors('legal_versions.terms');
        $this->assertDatabaseCount('users', 0);
    }

    public function test_client_cannot_choose_the_recorded_version(): void
    {
        Notification::fake();

        // Campos arbitrarios del cliente (versión/fecha) no se guardan nunca.
        $this->postJson('/api/v1/auth/register', $this->registrationPayload([
            'document_version' => '99.0',
            'recorded_at' => '2000-01-01',
        ]))->assertCreated();

        $this->assertDatabaseMissing('user_consents', ['document_version' => '99.0']);
        $this->assertSame(0, UserConsent::query()->whereDate('recorded_at', '2000-01-01')->count());
    }

    // --- Google -------------------------------------------------------------

    public function test_new_google_account_is_not_created_without_consents(): void
    {
        $this->fakeGoogle('uid-new', 'nuevo@example.com');

        $response = $this->postJson('/api/v1/auth/social', ['id_token' => 't', 'provider' => 'google']);

        $response->assertOk()
            ->assertJsonPath('data.requires_consent', true)
            ->assertJsonCount(3, 'data.consents')
            ->assertJsonMissingPath('data.token');
        $this->assertDatabaseCount('users', 0);
    }

    public function test_new_google_account_is_created_once_consents_are_sent(): void
    {
        Notification::fake();
        $this->fakeGoogle('uid-new', 'nuevo@example.com');

        $response = $this->postJson('/api/v1/auth/social', ['id_token' => 't', 'provider' => 'google', ...self::ALL_CONSENTS]);

        $response->assertOk()->assertJsonPath('data.user.pending_consents', []);
        $user = User::query()->where('email', 'nuevo@example.com')->firstOrFail();
        $this->assertSame(3, $user->consents()->where('source', 'social_registration')->count());
    }

    public function test_existing_google_account_logs_in_without_resending_consents(): void
    {
        $user = User::factory()->create(['firebase_uid' => 'uid-existing']);
        $this->fakeGoogle('uid-existing', $user->email);

        $this->postJson('/api/v1/auth/social', ['id_token' => 't', 'provider' => 'google'])
            ->assertOk()
            ->assertJsonPath('data.user.id', $user->id)
            // Cuenta previa a este sistema: el login funciona, pero queda
            // marcada con lo que le falta aceptar.
            ->assertJsonPath('data.user.pending_consents', ['terms', 'privacy', 'health_data']);
    }

    // --- Versiones / re-aceptación -----------------------------------------

    public function test_user_with_current_versions_has_nothing_pending(): void
    {
        $user = User::factory()->create();
        $this->acceptAllAt($user, '1.0');

        $this->actingAs($user)->getJson('/api/v1/auth/me')->assertJsonPath('data.pending_consents', []);
        $this->actingAs($user)->getJson('/api/v1/legal/consents')->assertJsonPath('data.pending', []);
    }

    public function test_user_with_an_old_version_is_detected_when_a_document_changes(): void
    {
        $user = User::factory()->create();
        $this->acceptAllAt($user, '1.0');

        config(['legal.documents.privacy.version' => '2.0']);

        $response = $this->actingAs($user)->getJson('/api/v1/legal/consents');

        // privacy y health_data dependen del documento de privacidad; terms no.
        $response->assertOk()
            ->assertJsonCount(2, 'data.pending')
            ->assertJsonPath('data.pending.0.type', 'privacy')
            ->assertJsonPath('data.pending.0.version', '2.0')
            ->assertJsonPath('data.pending.0.accepted_version', '1.0')
            ->assertJsonPath('data.pending.1.type', 'health_data');
    }

    public function test_user_can_reaccept_updated_documents(): void
    {
        $user = User::factory()->create();
        $this->acceptAllAt($user, '1.0');
        config(['legal.documents.privacy.version' => '2.0']);

        $response = $this->actingAs($user)->postJson('/api/v1/legal/consents', [
            'consents' => ['privacy', 'health_data'],
            'legal_versions' => ['privacy' => '2.0'],
        ]);

        $response->assertOk()
            ->assertJsonPath('data.pending', [])
            ->assertJsonPath('data.user.pending_consents', []);
        $this->assertDatabaseHas('user_consents', [
            'user_id' => $user->id,
            'consent_type' => 'privacy',
            'document_version' => '2.0',
            'source' => 'reacceptance',
        ]);
        // El historial anterior se conserva.
        $this->assertDatabaseHas('user_consents', ['user_id' => $user->id, 'consent_type' => 'privacy', 'document_version' => '1.0']);
    }

    public function test_reaccepting_the_same_version_twice_does_not_duplicate_rows(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->postJson('/api/v1/legal/consents', ['consents' => ['terms']])->assertOk();
        $this->actingAs($user)->postJson('/api/v1/legal/consents', ['consents' => ['terms']])->assertOk();

        $this->assertSame(1, $user->consents()->where('consent_type', 'terms')->count());
    }

    // --- Seguridad ----------------------------------------------------------

    public function test_consent_endpoints_require_authentication(): void
    {
        $this->getJson('/api/v1/legal/consents')->assertUnauthorized();
        $this->postJson('/api/v1/legal/consents', ['consents' => ['terms']])->assertUnauthorized();
    }

    public function test_unknown_consent_types_are_rejected(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->postJson('/api/v1/legal/consents', ['consents' => ['marketing']])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('consents.0');
    }

    public function test_a_user_cannot_record_consent_for_another_account(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();

        $this->actingAs($user)->postJson('/api/v1/legal/consents', [
            'consents' => ['terms'],
            'user_id' => $other->id,
        ])->assertOk();

        $this->assertSame(0, $other->consents()->count());
        $this->assertSame(1, $user->consents()->count());
    }

    public function test_recorded_consents_cannot_be_modified_or_deleted(): void
    {
        $user = User::factory()->create();
        $this->acceptAllAt($user, '1.0');
        $consent = $user->consents()->firstOrFail();

        $this->expectException(LogicException::class);
        $consent->update(['document_version' => '9.9']);
    }

    public function test_there_are_no_routes_to_edit_or_delete_consents(): void
    {
        $user = User::factory()->create();
        $this->acceptAllAt($user, '1.0');
        $id = $user->consents()->value('id');

        $this->actingAs($user)->patchJson("/api/v1/legal/consents/{$id}", ['status' => 'revoked'])->assertNotFound();
        $this->actingAs($user)->deleteJson("/api/v1/legal/consents/{$id}")->assertNotFound();
        $this->assertSame(3, $user->consents()->count());
    }

    public function test_pending_consents_are_not_exposed_when_showing_another_user(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();

        $request = Request::create('/');
        $request->setUserResolver(fn () => $user);

        $this->assertArrayNotHasKey('pending_consents', (new UserResource($other))->resolve($request));
        $this->assertArrayHasKey('pending_consents', (new UserResource($user))->resolve($request));
    }

    public function test_admin_consent_history_endpoint_is_restricted_to_super_admins(): void
    {
        $target = User::factory()->create();
        $this->acceptAllAt($target, '1.0');

        $regular = User::factory()->create(['role' => 'user']);
        $trainer = User::factory()->create(['role' => 'trainer']);
        $admin = User::factory()->create(['role' => 'super_admin']);
        // El propio admin también pasa por EnsureLegalConsentsAccepted.
        $this->acceptAllAt($admin, '1.0');

        $this->getJson("/api/v1/admin/users/{$target->id}/consents")->assertUnauthorized();
        $this->actingAs($regular)->getJson("/api/v1/admin/users/{$target->id}/consents")->assertForbidden();
        $this->actingAs($trainer)->getJson("/api/v1/admin/users/{$target->id}/consents")->assertForbidden();
        $this->actingAs($admin)->getJson("/api/v1/admin/users/{$target->id}/consents")
            ->assertOk()
            ->assertJsonCount(3, 'data.history')
            ->assertJsonPath('data.pending', []);
    }

    // --- Documentos ---------------------------------------------------------

    public function test_documents_endpoint_is_public_and_lists_current_versions(): void
    {
        $this->getJson('/api/v1/legal/documents')
            ->assertOk()
            ->assertJsonPath('data.documents.terms.version', '1.0')
            ->assertJsonPath('data.documents.privacy.version', '1.0')
            ->assertJsonPath('data.documents.cookies.version', '1.0')
            ->assertJsonCount(3, 'data.consents');
    }
}
