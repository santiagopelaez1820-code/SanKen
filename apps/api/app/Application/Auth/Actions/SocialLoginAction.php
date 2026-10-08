<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las acciones de autenticación.

namespace App\Application\Auth\Actions;

// Esta línea sirve para importar el objeto que representa el resultado del login.
use App\Application\Auth\DTOs\AuthenticationResult;
// Esta línea sirve para importar la acción que registra los consentimientos legales.
use App\Application\Legal\Actions\RecordUserConsentsAction;
// Esta línea sirve para importar el catálogo de consentimientos legales vigentes.
use App\Domain\Legal\Services\LegalConsentCatalog;
// Esta línea sirve para importar el contrato del repositorio de usuarios.
use App\Domain\User\Contracts\UserRepositoryInterface;
// Esta línea sirve para importar los datos (claims) que trae el token de Firebase.
use App\Infrastructure\Firebase\FirebaseTokenClaims;
// Esta línea sirve para importar el servicio que verifica tokens de Firebase.
use App\Infrastructure\Firebase\FirebaseTokenVerifier;
// Esta línea sirve para importar el modelo User (usuario).
use App\Models\User;
// Esta línea sirve para importar el modelo UserConsent para usar sus constantes de origen.
use App\Models\UserConsent;
// Esta línea sirve para importar el evento Registered que se dispara al crear una cuenta.
use Illuminate\Auth\Events\Registered;
// Esta línea sirve para importar la fachada Cache para guardar el desafío 2FA.
use Illuminate\Support\Facades\Cache;
// Esta línea sirve para importar la fachada DB para usar transacciones.
use Illuminate\Support\Facades\DB;
// Esta línea sirve para importar la fachada Hash para cifrar contraseñas.
use Illuminate\Support\Facades\Hash;
// Esta línea sirve para importar el helper Str para manejar textos.
use Illuminate\Support\Str;
// Esta línea sirve para importar la excepción de validación para responder errores 422.
use Illuminate\Validation\ValidationException;

// Esta línea sirve para declarar la acción que inicia sesión con Google (Firebase).
class SocialLoginAction
{
    // Esta línea sirve para declarar el constructor que recibe sus dependencias.
    public function __construct(
        // Esta línea sirve para recibir el repositorio de usuarios.
        private readonly UserRepositoryInterface $users,
        // Esta línea sirve para recibir el verificador de tokens de Firebase.
        private readonly FirebaseTokenVerifier $verifier,
        // Esta línea sirve para recibir el catálogo de consentimientos legales.
        private readonly LegalConsentCatalog $legal,
        // Esta línea sirve para recibir la acción que registra consentimientos.
        private readonly RecordUserConsentsAction $recordConsents,
    ) {}

    /**
     * @param  list<string>  $acceptedConsents  tipos de consentimiento que el usuario marcó (ver SocialLoginRequest)
     */
    // Esta línea sirve para declarar el método que recibe el token, el proveedor, el dispositivo y los consentimientos.
    public function execute(string $idToken, string $provider, string $deviceName, array $acceptedConsents = []): AuthenticationResult
    {
        // Esta línea sirve para verificar el token con Firebase y obtener sus datos.
        $claims = $this->verifier->verify($idToken);
        // Esta línea sirve para buscar, vincular o crear el usuario de ese token.
        $user = $this->resolveUser($claims, $provider, $acceptedConsents);

        // Esta línea sirve para revisar si no hay usuario porque faltan consentimientos para crearlo.
        if (! $user) {
            // Cuenta nueva sin todos los consentimientos: no se crea nada
            // todavía — el cliente muestra las casillas y reenvía el mismo
            // id_token (válido 1 h) con accept_* marcados.
            // Esta línea sirve para devolver un resultado que pide aceptar los consentimientos.
            return AuthenticationResult::consentRequired(array_map(
                // Esta línea sirve para armar, para cada tipo de consentimiento, sus datos.
                fn (string $type) => [
                    // Esta línea sirve para incluir el tipo de consentimiento.
                    'type' => $type,
                    // Esta línea sirve para incluir el documento legal al que corresponde.
                    'document' => $this->legal->documentFor($type),
                    // Esta línea sirve para incluir la versión vigente del documento.
                    'version' => $this->legal->currentVersionFor($type),
                    // Esta línea sirve para indicar que aún no aceptó ninguna versión.
                    'accepted_version' => null,
                ],
                // Esta línea sirve para pasar la lista de tipos de consentimiento obligatorios a recorrer.
                $this->legal->consentTypes(),
            ));
        }

        // Esta línea sirve para revisar si la cuenta está baneada.
        if ($user->is_banned) {
            // Esta línea sirve para lanzar un error de validación.
            throw ValidationException::withMessages([
                // Esta línea sirve para indicar que la cuenta fue suspendida.
                'id_token' => ['Esta cuenta ha sido suspendida.'],
            ]);
        }

        // Esta línea sirve para revisar si la cuenta está desactivada.
        if ($user->deactivated_at) {
            // Esta línea sirve para lanzar un error de validación.
            throw ValidationException::withMessages([
                // Esta línea sirve para indicar que la cuenta está desactivada.
                'id_token' => ['Esta cuenta está desactivada.'],
            ]);
        }

        // Esta línea sirve para revisar si el usuario tiene activada la verificación en dos pasos.
        if ($user->two_factor_enabled) {
            // Esta línea sirve para generar un token aleatorio para el desafío 2FA.
            $challengeToken = bin2hex(random_bytes(32));
            // Esta línea sirve para guardar en caché por 5 minutos a qué usuario pertenece el desafío.
            Cache::put("2fa_challenge:{$challengeToken}", $user->id, now()->addMinutes(5));

            // Esta línea sirve para devolver un resultado que pide el código 2FA.
            return AuthenticationResult::challenge($challengeToken);
        }

        // Esta línea sirve para crear el token de acceso de Sanctum y devolverlo.
        return AuthenticationResult::token($user->createToken($deviceName));
    }

    /**
     * 1) ¿Ya hay una cuenta vinculada a este firebase_uid? esa.
     * 2) Si no, ¿existe una cuenta con el mismo email — y Firebase lo
     *    marca como verificado? se vincula esa cuenta (evita duplicar la
     *    cuenta de alguien que ya se había registrado con email+password).
     * 3) Si no, se crea una cuenta nueva — SOLO si el usuario aceptó todos
     *    los consentimientos obligatorios (mismo requisito que el registro
     *    con email). Si faltan, devuelve null y no se crea nada.
     *
     * Solo se confía en el email para el paso 2 cuando viene con
     * email_verified=true en el token ya verificado por Firebase — nunca
     * en un email suelto enviado por el cliente.
     *
     * @param  list<string>  $acceptedConsents
     */
    // Esta línea sirve para declarar el método privado que busca, vincula o crea al usuario.
    private function resolveUser(FirebaseTokenClaims $claims, string $provider, array $acceptedConsents): ?User
    {
        // Esta línea sirve para buscar una cuenta ya vinculada a este usuario de Firebase.
        if ($existing = $this->users->findByFirebaseUid($claims->uid)) {
            // Esta línea sirve para devolver esa cuenta si existe.
            return $existing;
        }

        // Esta línea sirve para revisar si Google no devolvió un correo.
        if (! $claims->email) {
            // Esta línea sirve para lanzar un error de validación.
            throw ValidationException::withMessages([
                // Esta línea sirve para indicar que no se pudo obtener el correo.
                'id_token' => ['No se pudo obtener un correo desde la cuenta de Google.'],
            ]);
        }

        // Esta línea sirve para buscar una cuenta existente con el mismo correo.
        $byEmail = $this->users->findByEmail($claims->email);

        // Esta línea sirve para revisar si existe una cuenta con ese correo.
        if ($byEmail) {
            // Ya existe una cuenta con este email pero Firebase no lo marca
            // como verificado: no la vinculamos (agujero de seguridad) ni
            // podemos crear una cuenta nueva con el mismo email (columna
            // unique) — se rechaza con un mensaje claro.
            // Esta línea sirve para revisar si Firebase no confirma que el correo esté verificado.
            if (! $claims->emailVerified) {
                // Esta línea sirve para lanzar un error de validación.
                throw ValidationException::withMessages([
                    // Esta línea sirve para pedir que inicie sesión con su contraseña para vincular la cuenta.
                    'id_token' => ['Ya existe una cuenta con este correo. Inicia sesión con tu contraseña para vincularla.'],
                ]);
            }

            // Esta línea sirve para vincular la cuenta existente con Firebase.
            $byEmail->forceFill([
                // Esta línea sirve para guardar el id del usuario de Firebase.
                'firebase_uid' => $claims->uid,
                // Esta línea sirve para guardar el proveedor con el que inició sesión.
                'auth_provider' => $provider,
                // Esta línea sirve para guardar los cambios en la base de datos.
            ])->save();

            // Esta línea sirve para devolver la cuenta vinculada.
            return $byEmail;
        }

        // Esta línea sirve para obtener la lista de consentimientos obligatorios.
        $required = $this->legal->consentTypes();
        // Esta línea sirve para revisar si falta aceptar alguno de los consentimientos obligatorios.
        if (array_diff($required, $acceptedConsents) !== []) {
            // Esta línea sirve para devolver null para no crear la cuenta todavía.
            return null;
        }

        // Esta línea sirve para crear la cuenta y sus consentimientos dentro de una transacción.
        $user = DB::transaction(function () use ($claims, $provider, $required) {
            // Esta línea sirve para crear el usuario con los siguientes datos.
            $user = $this->users->create([
                // Esta línea sirve para usar el nombre de Google, o la parte del correo antes de la arroba.
                'name' => $claims->name ?: Str::before($claims->email, '@'),
                // Esta línea sirve para guardar el correo.
                'email' => $claims->email,
                // Esta línea sirve para dejar el teléfono vacío.
                'phone' => null,
                // Esta línea sirve para usar la foto de perfil de Google.
                'avatar_url' => $claims->picture,
                // Esta línea sirve para guardar el id del usuario de Firebase.
                'firebase_uid' => $claims->uid,
                // Esta línea sirve para guardar el proveedor del login.
                'auth_provider' => $provider,
                // Cuenta creada por login social: nunca inicia sesión con esta
                // password, pero la columna es NOT NULL — se genera una al azar
                // e inutilizable en vez de tocar el esquema de `users`.
                // Esta línea sirve para guardar una contraseña aleatoria e inutilizable.
                'password' => Hash::make(Str::random(40)),
                // Esta línea sirve para asignar el rol de usuario normal.
                'role' => 'user',
                // Esta línea sirve para dejar el perfil como no público.
                'is_public_profile' => false,
                // Esta línea sirve para marcar la cuenta como no baneada.
                'is_banned' => false,
                // Esta línea sirve para dejar la verificación en dos pasos desactivada.
                'two_factor_enabled' => false,
            ]);

            // Esta línea sirve para registrar la aceptación de los consentimientos obligatorios.
            $this->recordConsents->execute($user, $required, UserConsent::SOURCE_SOCIAL_REGISTRATION);

            // Esta línea sirve para devolver el usuario creado desde la transacción.
            return $user;
        });

        // Esta línea sirve para revisar si Firebase confirma el correo como verificado.
        if ($claims->emailVerified) {
            // Esta línea sirve para marcar el correo del usuario como verificado.
            $user->markEmailAsVerified();
        }

        // Esta línea sirve para disparar el evento de registro.
        event(new Registered($user));

        // Esta línea sirve para devolver el usuario creado.
        return $user;
    }
}
