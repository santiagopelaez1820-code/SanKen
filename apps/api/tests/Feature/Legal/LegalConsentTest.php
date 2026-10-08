<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Feature\Legal.

namespace Tests\Feature\Legal;

// Esta línea sirve para importar la clase UserResource.
use App\Http\Resources\UserResource;
// Esta línea sirve para importar la clase FirebaseTokenClaims.
use App\Infrastructure\Firebase\FirebaseTokenClaims;
// Esta línea sirve para importar la clase FirebaseTokenVerifier.
use App\Infrastructure\Firebase\FirebaseTokenVerifier;
// Esta línea sirve para importar el modelo User.
use App\Models\User;
// Esta línea sirve para importar el modelo UserConsent.
use App\Models\UserConsent;
// Esta línea sirve para importar la clase UserFactory.
use Database\Factories\UserFactory;
// Esta línea sirve para importar el trait que reinicia la base de datos en cada test.
use Illuminate\Foundation\Testing\RefreshDatabase;
// Esta línea sirve para importar la clase Request.
use Illuminate\Http\Request;
// Esta línea sirve para importar la fachada Notification.
use Illuminate\Support\Facades\Notification;
// Esta línea sirve para importar la clase LogicException.
use LogicException;
// Esta línea sirve para importar la clase Mockery.
use Mockery;
// Esta línea sirve para importar la clase base de los tests.
use Tests\TestCase;

// Esta línea sirve para declarar la clase de tests LegalConsentTest.
class LegalConsentTest extends TestCase
{
    // Esta línea sirve para reiniciar la base de datos en cada test.
    use RefreshDatabase;

    // Esta línea sirve para definir los tres consentimientos aceptados.
    private const ALL_CONSENTS = ['accept_terms' => true, 'accept_privacy' => true, 'accept_health_data' => true];

    /**
     * Estos tests necesitan usuarios SIN consentimientos (cuentas previas al
     * sistema legal); el resto de la suite usa la factory que ya los acepta.
     */
    // Esta línea sirve para declarar la preparación que corre antes de cada test.
    protected function setUp(): void
    {
        // Esta línea sirve para ejecutar la preparación base de Laravel.
        parent::setUp();
        // Esta línea sirve para desactivar que la factory acepte los documentos legales.
        UserFactory::$acceptLegalConsents = false;
        // Estos tests prueban el mecanismo de versiones, no la versión
        // publicada hoy: se fijan todas en 1.0 (y cada test sube la que
        // necesite) para que publicar una versión nueva no los rompa.
        // Esta línea sirve para configurar las versiones legales vigentes para este test.
        config([
            // Esta línea sirve para asignar '1.0' al campo "legal.documents.terms.version".
            'legal.documents.terms.version' => '1.0',
            // Esta línea sirve para asignar '1.0' al campo "legal.documents.privacy.version".
            'legal.documents.privacy.version' => '1.0',
            // Esta línea sirve para asignar '1.0' al campo "legal.documents.cookies.version".
            'legal.documents.cookies.version' => '1.0',
        ]);
    }

    // Esta línea sirve para declarar la limpieza que corre después de cada test.
    protected function tearDown(): void
    {
        // Esta línea sirve para volver a activar la aceptación automática en la factory.
        UserFactory::$acceptLegalConsents = true;
        // Esta línea sirve para ejecutar la limpieza base de Laravel.
        parent::tearDown();
    }

    /**
     * @param  array<string, mixed>  $overrides
     * @return array<string, mixed>
     */
    // Esta línea sirve para declarar el método auxiliar que arma los datos de registro.
    private function registrationPayload(array $overrides = []): array
    {
        // Esta línea sirve para devolver los datos de registro por defecto mezclados con los consentimientos y los recibidos.
        return array_merge([
            // Esta línea sirve para asignar 'Santiago Pelaez' al campo "name".
            'name' => 'Santiago Pelaez',
            // Esta línea sirve para asignar 'santiago@example.com' al campo "email".
            'email' => 'santiago@example.com',
            // Esta línea sirve para asignar 'Password!234' al campo "password".
            'password' => 'Password!234',
            // Esta línea sirve para asignar 'Password!234' al campo "password_confirmation".
            'password_confirmation' => 'Password!234',
            // Esta línea sirve para aplicar los datos recibidos encima de los por defecto.
        ], self::ALL_CONSENTS, $overrides);
    }

    // Esta línea sirve para declarar el método auxiliar que registra todos los consentimientos en una versión.
    private function acceptAllAt(User $user, string $version): void
    {
        // Esta línea sirve para recorrer cada tipo de consentimiento.
        foreach (['terms', 'privacy', 'health_data'] as $type) {
            // Esta línea sirve para crear el consentimiento aceptado.
            UserConsent::query()->create([
                // Esta línea sirve para asignar $user->id al campo "user_id".
                'user_id' => $user->id,
                // Esta línea sirve para asignar $type al campo "consent_type".
                'consent_type' => $type,
                // Esta línea sirve para asignar $version al campo "document_version".
                'document_version' => $version,
                // Esta línea sirve para asignar UserConsent::STATUS_ACCEPTED al campo "status".
                'status' => UserConsent::STATUS_ACCEPTED,
                // Esta línea sirve para asignar UserConsent::SOURCE_REGISTRATION al campo "source".
                'source' => UserConsent::SOURCE_REGISTRATION,
                // Esta línea sirve para asignar now() al campo "recorded_at".
                'recorded_at' => now(),
            ]);
        }
    }

    // Esta línea sirve para declarar el método auxiliar que simula la verificación de Google.
    private function fakeGoogle(string $uid, string $email): void
    {
        // Esta línea sirve para crear un doble de prueba del verificador.
        $mock = Mockery::mock(FirebaseTokenVerifier::class);
        // Esta línea sirve para hacer que devuelva los datos de la cuenta de Google.
        $mock->shouldReceive('verify')->andReturn(new FirebaseTokenClaims(
            // Esta línea sirve para definir el uid.
            uid: $uid,
            // Esta línea sirve para definir el correo.
            email: $email,
            // Esta línea sirve para indicar que el correo está verificado.
            emailVerified: true,
            // Esta línea sirve para definir el nombre.
            name: 'Usuario Google',
            // Esta línea sirve para dejar sin foto.
            picture: null,
        ));
        // Esta línea sirve para registrar el doble en el contenedor.
        $this->app->instance(FirebaseTokenVerifier::class, $mock);
    }

    // --- Registro ---------------------------------------------------------

    // Esta línea sirve para declarar el test que comprueba que registrarse con todos los consentimientos guarda cada uno en la versión vigente.
    public function test_registration_with_all_consents_records_each_one_at_the_current_version(): void
    {
        // Esta línea sirve para simular las notificaciones para no enviarlas de verdad.
        Notification::fake();

        // Esta línea sirve para hacer POST a /api/v1/auth/register sin sesión iniciada.
        $response = $this->postJson('/api/v1/auth/register', $this->registrationPayload());

        // Esta línea sirve para exigir 201 y que "data.user.pending_consents" sea [].
        $response->assertCreated()->assertJsonPath('data.user.pending_consents', []);

        // Esta línea sirve para buscar al usuario registrado.
        $user = User::query()->where('email', 'santiago@example.com')->firstOrFail();
        // Esta línea sirve para recorrer cada tipo de consentimiento.
        foreach (['terms', 'privacy', 'health_data'] as $type) {
            // Esta línea sirve para exigir que la tabla user_consents tenga un registro con estos datos.
            $this->assertDatabaseHas('user_consents', [
                // Esta línea sirve para asignar $user->id al campo "user_id".
                'user_id' => $user->id,
                // Esta línea sirve para asignar $type al campo "consent_type".
                'consent_type' => $type,
                // Esta línea sirve para asignar '1.0' al campo "document_version".
                'document_version' => '1.0',
                // Esta línea sirve para asignar 'accepted' al campo "status".
                'status' => 'accepted',
                // Esta línea sirve para asignar 'registration' al campo "source".
                'source' => 'registration',
            ]);
        }
    }

    // Esta línea sirve para declarar el test que comprueba que registrarse sin aceptar los Términos se rechaza y no crea cuenta.
    public function test_registration_without_accepting_terms_is_rejected_and_no_account_is_created(): void
    {
        // Esta línea sirve para hacer POST a /api/v1/auth/register sin sesión iniciada.
        $response = $this->postJson('/api/v1/auth/register', $this->registrationPayload(['accept_terms' => false]));

        // Esta línea sirve para exigir 422 con error de validación en "accept_terms".
        $response->assertUnprocessable()->assertJsonValidationErrors('accept_terms');
        // Esta línea sirve para exigir que la tabla users no tenga ese registro.
        $this->assertDatabaseMissing('users', ['email' => 'santiago@example.com']);
        // Esta línea sirve para exigir que la tabla user_consents tenga 0 registros.
        $this->assertDatabaseCount('user_consents', 0);
    }

    // Esta línea sirve para declarar el test que comprueba que cada consentimiento es obligatorio por separado.
    public function test_each_consent_is_required_separately(): void
    {
        // Esta línea sirve para armar los datos de registro.
        $payload = $this->registrationPayload();
        // Esta línea sirve para quitar los consentimientos de privacidad y de datos de salud.
        unset($payload['accept_privacy'], $payload['accept_health_data']);

        // Esta línea sirve para intentar registrarse sin esos consentimientos.
        $this->postJson('/api/v1/auth/register', $payload)
            // Esta línea sirve para exigir que la respuesta sea 422 (datos inválidos).
            ->assertUnprocessable()
            // Esta línea sirve para exigir errores de validación en ['accept_privacy', 'accept_health_data'].
            ->assertJsonValidationErrors(['accept_privacy', 'accept_health_data'])
            // Esta línea sirve para exigir que no haya errores de validación en 'accept_terms'.
            ->assertJsonMissingValidationErrors('accept_terms');
    }

    // Esta línea sirve para declarar el test que comprueba que se rechaza una versión de documento desactualizada.
    public function test_registration_rejects_a_stale_document_version_shown_by_the_client(): void
    {
        // Esta línea sirve para hacer POST a /api/v1/auth/register sin sesión iniciada.
        $response = $this->postJson('/api/v1/auth/register', $this->registrationPayload([
            // Esta línea sirve para enviar una versión vieja de los Términos.
            'legal_versions' => ['terms' => '0.9'],
        ]));

        // Esta línea sirve para exigir 422 con error de validación en "legal_versions.terms".
        $response->assertUnprocessable()->assertJsonValidationErrors('legal_versions.terms');
        // Esta línea sirve para exigir que la tabla users tenga 0 registros.
        $this->assertDatabaseCount('users', 0);
    }

    // Esta línea sirve para declarar el test que comprueba que el cliente no puede elegir la versión que se registra.
    public function test_client_cannot_choose_the_recorded_version(): void
    {
        // Esta línea sirve para simular las notificaciones para no enviarlas de verdad.
        Notification::fake();

        // Campos arbitrarios del cliente (versión/fecha) no se guardan nunca.
        // Esta línea sirve para registrarse enviando una fecha falsa.
        $this->postJson('/api/v1/auth/register', $this->registrationPayload([
            // Esta línea sirve para asignar '99.0' al campo "document_version".
            'document_version' => '99.0',
            // Esta línea sirve para asignar '2000-01-01' al campo "recorded_at".
            'recorded_at' => '2000-01-01',
            // Esta línea sirve para cerrar los datos y exigir 201.
        ]))->assertCreated();

        // Esta línea sirve para exigir que la tabla user_consents no tenga ese registro.
        $this->assertDatabaseMissing('user_consents', ['document_version' => '99.0']);
        // Esta línea sirve para exigir que ningún consentimiento tenga esa fecha falsa.
        $this->assertSame(0, UserConsent::query()->whereDate('recorded_at', '2000-01-01')->count());
    }

    // --- Google -------------------------------------------------------------

    // Esta línea sirve para declarar el test que comprueba que una cuenta nueva de Google no se crea sin consentimientos.
    public function test_new_google_account_is_not_created_without_consents(): void
    {
        // Esta línea sirve para simular la verificación de Google para un usuario nuevo.
        $this->fakeGoogle('uid-new', 'nuevo@example.com');

        // Esta línea sirve para hacer POST a /api/v1/auth/social sin sesión iniciada.
        $response = $this->postJson('/api/v1/auth/social', ['id_token' => 't', 'provider' => 'google']);

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk()
            // Esta línea sirve para exigir que "data.requires_consent" sea true.
            ->assertJsonPath('data.requires_consent', true)
            // Esta línea sirve para exigir que "data.consents" tenga 3 elementos.
            ->assertJsonCount(3, 'data.consents')
            // Esta línea sirve para exigir que la respuesta no incluya "data.token".
            ->assertJsonMissingPath('data.token');
        // Esta línea sirve para exigir que la tabla users tenga 0 registros.
        $this->assertDatabaseCount('users', 0);
    }

    // Esta línea sirve para declarar el test que comprueba que una cuenta nueva de Google se crea al enviar los consentimientos.
    public function test_new_google_account_is_created_once_consents_are_sent(): void
    {
        // Esta línea sirve para simular las notificaciones para no enviarlas de verdad.
        Notification::fake();
        // Esta línea sirve para simular la verificación de Google para un usuario nuevo.
        $this->fakeGoogle('uid-new', 'nuevo@example.com');

        // Esta línea sirve para hacer POST a /api/v1/auth/social sin sesión iniciada.
        $response = $this->postJson('/api/v1/auth/social', ['id_token' => 't', 'provider' => 'google', ...self::ALL_CONSENTS]);

        // Esta línea sirve para exigir 200 y que "data.user.pending_consents" sea [].
        $response->assertOk()->assertJsonPath('data.user.pending_consents', []);
        // Esta línea sirve para buscar al usuario creado.
        $user = User::query()->where('email', 'nuevo@example.com')->firstOrFail();
        // Esta línea sirve para exigir que tenga 3 consentimientos con origen "social_registration".
        $this->assertSame(3, $user->consents()->where('source', 'social_registration')->count());
    }

    // Esta línea sirve para declarar el test que comprueba que una cuenta de Google existente entra sin reenviar consentimientos.
    public function test_existing_google_account_logs_in_without_resending_consents(): void
    {
        // Esta línea sirve para crear un usuario con ese uid de Firebase.
        $user = User::factory()->create(['firebase_uid' => 'uid-existing']);
        // Esta línea sirve para simular la verificación de Google para ese usuario.
        $this->fakeGoogle('uid-existing', $user->email);

        // Esta línea sirve para iniciar sesión con Google sin enviar consentimientos.
        $this->postJson('/api/v1/auth/social', ['id_token' => 't', 'provider' => 'google'])
            // Esta línea sirve para exigir que la respuesta sea 200 (OK).
            ->assertOk()
            // Esta línea sirve para exigir que "data.user.id" sea $user->id.
            ->assertJsonPath('data.user.id', $user->id)
            // Cuenta previa a este sistema: el login funciona, pero queda
            // marcada con lo que le falta aceptar.
            // Esta línea sirve para exigir que "data.user.pending_consents" sea ['terms', 'privacy', 'health_data'].
            ->assertJsonPath('data.user.pending_consents', ['terms', 'privacy', 'health_data']);
    }

    // --- Versiones / re-aceptación -----------------------------------------

    // Esta línea sirve para declarar el test que comprueba que un usuario con las versiones vigentes no tiene pendientes.
    public function test_user_with_current_versions_has_nothing_pending(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para registrar todos los consentimientos en la versión 1.0.
        $this->acceptAllAt($user, '1.0');

        // Esta línea sirve para exigir que /auth/me no muestre consentimientos pendientes.
        $this->actingAs($user)->getJson('/api/v1/auth/me')->assertJsonPath('data.pending_consents', []);
        // Esta línea sirve para exigir que /legal/consents no muestre pendientes.
        $this->actingAs($user)->getJson('/api/v1/legal/consents')->assertJsonPath('data.pending', []);
    }

    // Esta línea sirve para declarar el test que comprueba que una versión vieja se detecta cuando cambia un documento.
    public function test_user_with_an_old_version_is_detected_when_a_document_changes(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para registrar todos los consentimientos en la versión 1.0.
        $this->acceptAllAt($user, '1.0');

        // Esta línea sirve para configurar "legal.documents.privacy.version" con el valor '2.0' para este test.
        config(['legal.documents.privacy.version' => '2.0']);

        // Esta línea sirve para pedir los consentimientos del usuario.
        $response = $this->actingAs($user)->getJson('/api/v1/legal/consents');

        // privacy y health_data dependen del documento de privacidad; terms no.
        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk()
            // Esta línea sirve para exigir que "data.pending" tenga 2 elementos.
            ->assertJsonCount(2, 'data.pending')
            // Esta línea sirve para exigir que "data.pending.0.type" sea 'privacy'.
            ->assertJsonPath('data.pending.0.type', 'privacy')
            // Esta línea sirve para exigir que "data.pending.0.version" sea '2.0'.
            ->assertJsonPath('data.pending.0.version', '2.0')
            // Esta línea sirve para exigir que "data.pending.0.accepted_version" sea '1.0'.
            ->assertJsonPath('data.pending.0.accepted_version', '1.0')
            // Esta línea sirve para exigir que "data.pending.1.type" sea 'health_data'.
            ->assertJsonPath('data.pending.1.type', 'health_data');
    }

    // Esta línea sirve para declarar el test que comprueba que el usuario puede re-aceptar documentos actualizados.
    public function test_user_can_reaccept_updated_documents(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para registrar todos los consentimientos en la versión 1.0.
        $this->acceptAllAt($user, '1.0');
        // Esta línea sirve para configurar "legal.documents.privacy.version" con el valor '2.0' para este test.
        config(['legal.documents.privacy.version' => '2.0']);

        // Esta línea sirve para aceptar los documentos actualizados.
        $response = $this->actingAs($user)->postJson('/api/v1/legal/consents', [
            // Esta línea sirve para asignar ['privacy', 'health_data'] al campo "consents".
            'consents' => ['privacy', 'health_data'],
            // Esta línea sirve para enviar la versión nueva de la política de privacidad.
            'legal_versions' => ['privacy' => '2.0'],
        ]);

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk()
            // Esta línea sirve para exigir que "data.pending" sea [].
            ->assertJsonPath('data.pending', [])
            // Esta línea sirve para exigir que "data.user.pending_consents" sea [].
            ->assertJsonPath('data.user.pending_consents', []);
        // Esta línea sirve para exigir que la tabla user_consents tenga un registro con estos datos.
        $this->assertDatabaseHas('user_consents', [
            // Esta línea sirve para asignar $user->id al campo "user_id".
            'user_id' => $user->id,
            // Esta línea sirve para asignar 'privacy' al campo "consent_type".
            'consent_type' => 'privacy',
            // Esta línea sirve para asignar '2.0' al campo "document_version".
            'document_version' => '2.0',
            // Esta línea sirve para asignar 'reacceptance' al campo "source".
            'source' => 'reacceptance',
        ]);
        // El historial anterior se conserva.
        // Esta línea sirve para exigir que la tabla user_consents tenga ese registro.
        $this->assertDatabaseHas('user_consents', ['user_id' => $user->id, 'consent_type' => 'privacy', 'document_version' => '1.0']);
    }

    // Esta línea sirve para declarar el test que comprueba que re-aceptar la misma versión dos veces no duplica filas.
    public function test_reaccepting_the_same_version_twice_does_not_duplicate_rows(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para aceptar los Términos.
        $this->actingAs($user)->postJson('/api/v1/legal/consents', ['consents' => ['terms']])->assertOk();
        // Esta línea sirve para aceptar los Términos otra vez.
        $this->actingAs($user)->postJson('/api/v1/legal/consents', ['consents' => ['terms']])->assertOk();

        // Esta línea sirve para exigir que haya una sola fila de Términos.
        $this->assertSame(1, $user->consents()->where('consent_type', 'terms')->count());
    }

    // --- Seguridad ----------------------------------------------------------

    // Esta línea sirve para declarar el test que comprueba que los endpoints de consentimientos exigen sesión.
    public function test_consent_endpoints_require_authentication(): void
    {
        // Esta línea sirve para hacer la petición a /api/v1/legal/consents sin sesión y exigir que responda 401.
        $this->getJson('/api/v1/legal/consents')->assertUnauthorized();
        // Esta línea sirve para hacer la petición a /api/v1/legal/consents sin sesión y exigir que responda 401.
        $this->postJson('/api/v1/legal/consents', ['consents' => ['terms']])->assertUnauthorized();
    }

    // Esta línea sirve para declarar el test que comprueba que los tipos de consentimiento desconocidos se rechazan.
    public function test_unknown_consent_types_are_rejected(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para hacer la petición como el usuario.
        $this->actingAs($user)
            // Esta línea sirve para hacer POST a /api/v1/legal/consents con los datos enviados.
            ->postJson('/api/v1/legal/consents', ['consents' => ['marketing']])
            // Esta línea sirve para exigir que la respuesta sea 422 (datos inválidos).
            ->assertUnprocessable()
            // Esta línea sirve para exigir errores de validación en 'consents.0'.
            ->assertJsonValidationErrors('consents.0');
    }

    // Esta línea sirve para declarar el test que comprueba que un usuario no puede registrar consentimientos de otra cuenta.
    public function test_a_user_cannot_record_consent_for_another_account(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un usuario de prueba.
        $other = User::factory()->create();

        // Esta línea sirve para aceptar documentos como el usuario.
        $this->actingAs($user)->postJson('/api/v1/legal/consents', [
            // Esta línea sirve para asignar ['terms'] al campo "consents".
            'consents' => ['terms'],
            // Esta línea sirve para asignar $other->id al campo "user_id".
            'user_id' => $other->id,
            // Esta línea sirve para cerrar los datos y exigir 200.
        ])->assertOk();

        // Esta línea sirve para exigir que la otra cuenta no tenga consentimientos.
        $this->assertSame(0, $other->consents()->count());
        // Esta línea sirve para exigir que el usuario tenga solo el suyo.
        $this->assertSame(1, $user->consents()->count());
    }

    // Esta línea sirve para declarar el test que comprueba que un consentimiento registrado no se puede modificar ni borrar.
    public function test_recorded_consents_cannot_be_modified_or_deleted(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para registrar todos los consentimientos en la versión 1.0.
        $this->acceptAllAt($user, '1.0');
        // Esta línea sirve para obtener el primer consentimiento.
        $consent = $user->consents()->firstOrFail();

        // Esta línea sirve para esperar que lance una excepción de lógica.
        $this->expectException(LogicException::class);
        // Esta línea sirve para intentar modificar el consentimiento.
        $consent->update(['document_version' => '9.9']);
    }

    // Esta línea sirve para declarar el test que comprueba que no existen rutas para editar ni borrar consentimientos.
    public function test_there_are_no_routes_to_edit_or_delete_consents(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para registrar todos los consentimientos en la versión 1.0.
        $this->acceptAllAt($user, '1.0');
        // Esta línea sirve para obtener el id de un consentimiento.
        $id = $user->consents()->value('id');

        // Esta línea sirve para intentar editarlo con PATCH y exigir 404.
        $this->actingAs($user)->patchJson("/api/v1/legal/consents/{$id}", ['status' => 'revoked'])->assertNotFound();
        // Esta línea sirve para intentar borrarlo con DELETE y exigir 404.
        $this->actingAs($user)->deleteJson("/api/v1/legal/consents/{$id}")->assertNotFound();
        // Esta línea sirve para exigir que sigan los 3 consentimientos.
        $this->assertSame(3, $user->consents()->count());
    }

    // Esta línea sirve para declarar el test que comprueba que los consentimientos pendientes no se muestran al ver a otro usuario.
    public function test_pending_consents_are_not_exposed_when_showing_another_user(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un usuario de prueba.
        $other = User::factory()->create();

        // Esta línea sirve para crear una petición simulada.
        $request = Request::create('/');
        // Esta línea sirve para hacer que el usuario autenticado sea el primero.
        $request->setUserResolver(fn () => $user);

        // Esta línea sirve para exigir que el recurso de otro usuario no incluya los pendientes.
        $this->assertArrayNotHasKey('pending_consents', (new UserResource($other))->resolve($request));
        // Esta línea sirve para exigir que el recurso del propio usuario sí los incluya.
        $this->assertArrayHasKey('pending_consents', (new UserResource($user))->resolve($request));
    }

    // Esta línea sirve para declarar el test que comprueba que el historial de consentimientos es solo para super admins.
    public function test_admin_consent_history_endpoint_is_restricted_to_super_admins(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $target = User::factory()->create();
        // Esta línea sirve para registrar los consentimientos del usuario objetivo.
        $this->acceptAllAt($target, '1.0');

        // Esta línea sirve para crear un usuario con rol normal.
        $regular = User::factory()->create(['role' => 'user']);
        // Esta línea sirve para crear un usuario entrenador.
        $trainer = User::factory()->create(['role' => 'trainer']);
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // El propio admin también pasa por EnsureLegalConsentsAccepted.
        // Esta línea sirve para registrar los consentimientos del admin.
        $this->acceptAllAt($admin, '1.0');

        // Esta línea sirve para hacer la petición a /api/v1/admin/users/{$target->id}/consents sin sesión y exigir que responda 401.
        $this->getJson("/api/v1/admin/users/{$target->id}/consents")->assertUnauthorized();
        // Esta línea sirve para hacer GET como usuario normal y exigir 403.
        $this->actingAs($regular)->getJson("/api/v1/admin/users/{$target->id}/consents")->assertForbidden();
        // Esta línea sirve para hacer GET como entrenador y exigir 403.
        $this->actingAs($trainer)->getJson("/api/v1/admin/users/{$target->id}/consents")->assertForbidden();
        // Esta línea sirve para hacer GET como admin.
        $this->actingAs($admin)->getJson("/api/v1/admin/users/{$target->id}/consents")
            // Esta línea sirve para exigir que la respuesta sea 200 (OK).
            ->assertOk()
            // Esta línea sirve para exigir que "data.history" tenga 3 elementos.
            ->assertJsonCount(3, 'data.history')
            // Esta línea sirve para exigir que "data.pending" sea [].
            ->assertJsonPath('data.pending', []);
    }

    // --- Documentos ---------------------------------------------------------

    // Esta línea sirve para declarar el test que comprueba que el endpoint de documentos es público y lista las versiones vigentes.
    public function test_documents_endpoint_is_public_and_lists_current_versions(): void
    {
        // Esta línea sirve para hacer GET a los documentos legales sin sesión.
        $this->getJson('/api/v1/legal/documents')
            // Esta línea sirve para exigir que la respuesta sea 200 (OK).
            ->assertOk()
            // Esta línea sirve para exigir que "data.documents.terms.version" sea '1.0'.
            ->assertJsonPath('data.documents.terms.version', '1.0')
            // Esta línea sirve para exigir que "data.documents.privacy.version" sea '1.0'.
            ->assertJsonPath('data.documents.privacy.version', '1.0')
            // Esta línea sirve para exigir que "data.documents.cookies.version" sea '1.0'.
            ->assertJsonPath('data.documents.cookies.version', '1.0')
            // Esta línea sirve para exigir que "data.consents" tenga 3 elementos.
            ->assertJsonCount(3, 'data.consents');
    }
}
