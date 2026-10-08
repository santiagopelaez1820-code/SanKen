<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los controllers de autenticación.

namespace App\Http\Controllers\Api\V1\Auth;

// Esta línea sirve para importar la acción que valida las credenciales.
use App\Application\Auth\Actions\AuthenticateUserAction;
// Esta línea sirve para importar la acción que elimina la propia cuenta.
use App\Application\Auth\Actions\DeleteOwnAccountAction;
// Esta línea sirve para importar la acción que registra un inicio de sesión.
use App\Application\Auth\Actions\RecordUserSessionAction;
// Esta línea sirve para importar la acción que registra un usuario nuevo.
use App\Application\Auth\Actions\RegisterUserAction;
// Esta línea sirve para importar la acción del inicio de sesión con Google.
use App\Application\Auth\Actions\SocialLoginAction;
// Esta línea sirve para importar el contrato del repositorio de usuarios.
use App\Domain\User\Contracts\UserRepositoryInterface;
// Esta línea sirve para importar el controller base.
use App\Http\Controllers\Controller;
// Esta línea sirve para importar la validación de la eliminación de la cuenta.
use App\Http\Requests\Auth\DeleteAccountRequest;
// Esta línea sirve para importar la validación del login.
use App\Http\Requests\Auth\LoginRequest;
// Esta línea sirve para importar la validación del registro.
use App\Http\Requests\Auth\RegisterRequest;
// Esta línea sirve para importar la validación del login social.
use App\Http\Requests\Auth\SocialLoginRequest;
// Esta línea sirve para importar la validación de la foto de perfil.
use App\Http\Requests\UpdateAvatarRequest;
// Esta línea sirve para importar el resource que da formato a un usuario.
use App\Http\Resources\UserResource;
// Esta línea sirve para importar el helper que define dónde se guarda cada archivo.
use App\Infrastructure\Media\MediaSlot;
// Esta línea sirve para importar la interfaz de almacenamiento de archivos.
use App\Infrastructure\Media\MediaStorage;
// Esta línea sirve para importar el atributo Group de Scramble para agrupar en Swagger.
use Dedoc\Scramble\Attributes\Group;
// Esta línea sirve para importar la respuesta JSON de Laravel.
use Illuminate\Http\JsonResponse;
// Esta línea sirve para importar la clase Request para leer la petición.
use Illuminate\Http\Request;
// Esta línea sirve para importar la fachada Hash para cifrar contraseñas.
use Illuminate\Support\Facades\Hash;
// Esta línea sirve para importar la fachada Password para recuperar contraseñas.
use Illuminate\Support\Facades\Password;
// Esta línea sirve para importar las reglas de contraseña segura (con alias).
use Illuminate\Validation\Rules\Password as PasswordRule;
// Esta línea sirve para importar la excepción de validación para responder errores 422.
use Illuminate\Validation\ValidationException;

// Esta línea sirve para agrupar este controller en la sección "Autenticación" de Swagger.
#[Group('Autenticación', 'Registro, inicio de sesión (correo, Google y 2FA), verificación de correo, recuperación de contraseña y gestión de la propia cuenta.', weight: 2)]
// Esta línea sirve para declarar el controller de autenticación.
class AuthController extends Controller
{
    /**
     * Registrar una cuenta nueva.
     *
     * Crea el usuario con rol `user` y devuelve el usuario y un token Sanctum
     * para usar como `Authorization: Bearer {token}`. Exige marcar cada
     * consentimiento obligatorio (`accept_<tipo>`; la lista vigente está en
     * `GET /legal/documents`).
     */
    // Esta línea sirve para declarar el endpoint que registra una cuenta nueva.
    public function register(RegisterRequest $request, RegisterUserAction $action, RecordUserSessionAction $recordSession): JsonResponse
    {
        // Esta línea sirve para crear el usuario con los datos validados.
        $user = $action->execute($request->validated());
        // Esta línea sirve para crear su token de acceso usando el navegador o app como nombre.
        $token = $user->createToken($request->userAgent() ?? 'api');
        // Esta línea sirve para registrar el inicio de sesión para la analítica.
        $recordSession->execute($user, $request);

        // Esta línea sirve para responder con el usuario y el token.
        return response()->json([
            // Esta línea sirve para armar los datos.
            'data' => [
                // Esta línea sirve para incluir el usuario con su formato.
                'user' => UserResource::forOwner($user),
                // Esta línea sirve para incluir el token en texto plano.
                'token' => $token->plainTextToken,
            ],
            // Esta línea sirve para indicar el código 201 (creado).
        ], 201);
    }

    /**
     * Iniciar sesión con correo y contraseña.
     *
     * Devuelve el usuario y un token Sanctum. Si la cuenta tiene 2FA activo
     * no emite token: responde `requires_two_factor: true` y un
     * `challenge_token` (válido 5 minutos) que se canjea en
     * `POST /auth/2fa/challenge`.
     */
    // Esta línea sirve para declarar el endpoint que inicia sesión con correo y contraseña.
    public function login(LoginRequest $request, AuthenticateUserAction $action, RecordUserSessionAction $recordSession): JsonResponse
    {
        // Esta línea sirve para validar las credenciales.
        $result = $action->execute(
            // Esta línea sirve para pasar el correo.
            $request->string('email')->toString(),
            // Esta línea sirve para pasar la contraseña.
            $request->string('password')->toString(),
            // Esta línea sirve para pasar el nombre del dispositivo (o el navegador, o "api").
            $request->input('device_name') ?? $request->userAgent() ?? 'api',
        );

        // Esta línea sirve para revisar si la cuenta pide el código 2FA.
        if ($result->requiresTwoFactor()) {
            // Esta línea sirve para responder que falta el código 2FA.
            return response()->json([
                // Esta línea sirve para armar los datos.
                'data' => [
                    // Esta línea sirve para indicar que se requiere el segundo factor.
                    'requires_two_factor' => true,
                    // Esta línea sirve para incluir el token del desafío 2FA.
                    'challenge_token' => $result->challengeToken,
                ],
            ]);
        }

        // Esta línea sirve para registrar el inicio de sesión para la analítica.
        $recordSession->execute($result->token->accessToken->tokenable, $request);

        // Esta línea sirve para responder con el usuario y el token.
        return response()->json([
            // Esta línea sirve para armar los datos.
            'data' => [
                // Esta línea sirve para incluir el usuario con su formato.
                'user' => UserResource::forOwner($result->token->accessToken->tokenable),
                // Esta línea sirve para incluir el token en texto plano.
                'token' => $result->token->plainTextToken,
            ],
        ]);
    }

    /**
     * Iniciar sesión con Google (Firebase).
     *
     * Mismo contrato de respuesta que login()/register() (user+token, o
     * requires_two_factor) — así el mobile reutiliza el mismo manejo de
     * respuesta para los tres. El id_token de Firebase se verifica dentro
     * de SocialLoginAction, nunca se confía en nada más del body.
     *
     * Si el login fuera a crear una cuenta nueva y faltan consentimientos
     * obligatorios, responde `requires_consent: true` sin crear nada; el
     * cliente reenvía el mismo `id_token` con los `accept_*` marcados.
     */
    // Esta línea sirve para declarar el endpoint que inicia sesión con Google.
    public function socialLogin(SocialLoginRequest $request, SocialLoginAction $action, RecordUserSessionAction $recordSession): JsonResponse
    {
        // Esta línea sirve para verificar el token de Google e iniciar sesión.
        $result = $action->execute(
            // Esta línea sirve para pasar el id_token de Firebase.
            $request->string('id_token')->toString(),
            // Esta línea sirve para pasar el proveedor.
            $request->string('provider')->toString(),
            // Esta línea sirve para pasar el nombre del dispositivo (o el navegador, o "api").
            $request->input('device_name') ?? $request->userAgent() ?? 'api',
            // Esta línea sirve para pasar los consentimientos marcados.
            $request->acceptedConsentTypes(),
        );

        // Cuenta nueva sin los consentimientos obligatorios: no se creó
        // nada. Mismo patrón que requires_two_factor — el cliente muestra las
        // casillas y reenvía el mismo id_token con accept_* marcados.
        // Esta línea sirve para revisar si faltan consentimientos para crear la cuenta.
        if ($result->requiresConsent()) {
            // Esta línea sirve para responder que hay que aceptar los consentimientos.
            return response()->json([
                // Esta línea sirve para armar los datos.
                'data' => [
                    // Esta línea sirve para indicar que se requieren consentimientos.
                    'requires_consent' => true,
                    // Esta línea sirve para incluir la lista de consentimientos pendientes.
                    'consents' => $result->requiredConsents,
                ],
            ]);
        }

        // Esta línea sirve para revisar si la cuenta pide el código 2FA.
        if ($result->requiresTwoFactor()) {
            // Esta línea sirve para responder que falta el código 2FA.
            return response()->json([
                // Esta línea sirve para armar los datos.
                'data' => [
                    // Esta línea sirve para indicar que se requiere el segundo factor.
                    'requires_two_factor' => true,
                    // Esta línea sirve para incluir el token del desafío 2FA.
                    'challenge_token' => $result->challengeToken,
                ],
            ]);
        }

        // Esta línea sirve para registrar el inicio de sesión para la analítica.
        $recordSession->execute($result->token->accessToken->tokenable, $request);

        // Esta línea sirve para responder con el usuario y el token.
        return response()->json([
            // Esta línea sirve para armar los datos.
            'data' => [
                // Esta línea sirve para incluir el usuario con su formato.
                'user' => UserResource::forOwner($result->token->accessToken->tokenable),
                // Esta línea sirve para incluir el token en texto plano.
                'token' => $result->token->plainTextToken,
            ],
        ]);
    }

    /**
     * Cerrar sesión.
     *
     * Revoca el token con el que se hizo la petición.
     */
    // Esta línea sirve para declarar el endpoint que cierra la sesión.
    public function logout(Request $request): JsonResponse
    {
        // Esta línea sirve para borrar el token con el que se hizo la petición.
        $request->user()?->currentAccessToken()?->delete();

        // Esta línea sirve para responder que la sesión se cerró.
        return response()->json(['data' => ['message' => 'Sesión cerrada.']]);
    }

    /** Obtener el usuario autenticado. */
    // Esta línea sirve para declarar el endpoint que devuelve el usuario autenticado.
    public function me(Request $request): JsonResponse
    {
        // Esta línea sirve para responder con el usuario.
        return response()->json([
            // Esta línea sirve para incluir el usuario con su formato.
            'data' => new UserResource($request->user()),
        ]);
    }

    /**
     * Subir o reemplazar la foto de perfil.
     *
     * El usuario sube su propia foto — nunca un ID ajeno, $request->user()
     * es siempre el dueño del token actual. MediaStorage::store() confirma
     * que el nuevo archivo quedó guardado (Cloudinary o disco local) ANTES
     * de borrar el anterior — así un upload fallido a mitad de camino nunca
     * deja al usuario sin avatar.
     */
    // Esta línea sirve para declarar el endpoint que sube la foto de perfil.
    public function updateAvatar(UpdateAvatarRequest $request, MediaStorage $media): JsonResponse
    {
        // Esta línea sirve para obtener el usuario autenticado.
        $user = $request->user();

        // Esta línea sirve para guardar la foto y obtener su URL.
        $avatarUrl = $media->store(
            // Esta línea sirve para pasar el archivo subido.
            $request->file('avatar'),
            // Esta línea sirve para pasar el destino del archivo.
            MediaSlot::avatar($user->id),
            // Esta línea sirve para pasar la URL anterior para borrarla después.
            $user->avatar_url,
            // Esta línea sirve para pasar el mensaje de error si falla.
            'No se pudo guardar la foto.',
        );
        // Esta línea sirve para guardar la URL de la foto en el usuario.
        $user->update(['avatar_url' => $avatarUrl]);

        // Esta línea sirve para responder con el usuario recargado.
        return response()->json(['data' => new UserResource($user->fresh())]);
    }

    /**
     * Eliminar la foto de perfil.
     *
     * Borra el archivo y limpia avatar_url — el usuario sigue existiendo y
     * vuelve a mostrar la inicial de su nombre (lo maneja el mobile).
     */
    // Esta línea sirve para declarar el endpoint que elimina la foto de perfil.
    public function deleteAvatar(Request $request, MediaStorage $media): JsonResponse
    {
        // Esta línea sirve para obtener el usuario autenticado.
        $user = $request->user();

        // Esta línea sirve para borrar el archivo de la foto.
        $media->delete($user->avatar_url);
        // Esta línea sirve para limpiar la URL de la foto.
        $user->update(['avatar_url' => null]);

        // Esta línea sirve para responder con el usuario recargado.
        return response()->json(['data' => new UserResource($user->fresh())]);
    }

    /**
     * Eliminar la propia cuenta.
     *
     * El propio usuario elimina su cuenta (irreversible). Exenta de
     * EnsureLegalConsentsAccepted: quien no acepta una versión nueva de los
     * documentos debe poder irse. Un Super Admin no puede autoeliminarse
     * desde acá — evita dejar la plataforma sin administración por un
     * descuido; lo hace otro Super Admin desde el panel.
     */
    // Esta línea sirve para declarar el endpoint que elimina la propia cuenta.
    public function destroyMe(DeleteAccountRequest $request, DeleteOwnAccountAction $action): JsonResponse
    {
        // Esta línea sirve para obtener el usuario autenticado.
        $user = $request->user();

        // Esta línea sirve para cortar con error si el usuario es super admin.
        abort_if(
            // Esta línea sirve para evaluar la condición: que el rol sea super_admin.
            $user->role === 'super_admin',
            // Esta línea sirve para indicar el código HTTP 403.
            403,
            // Esta línea sirve para indicar el mensaje que explica por qué no se puede.
            'Una cuenta de Super Admin no se puede eliminar desde la app. Pedíselo a otro Super Admin.',
        );

        // Esta línea sirve para eliminar la cuenta y todos sus datos.
        $action->execute($user);

        // Esta línea sirve para responder que la cuenta se eliminó.
        return response()->json(['data' => ['message' => 'Tu cuenta y tus datos fueron eliminados.']]);
    }

    /**
     * Solicitar un enlace para restablecer la contraseña.
     *
     * Responde lo mismo exista o no la cuenta, para no revelar qué correos
     * están registrados.
     */
    // Esta línea sirve para declarar el endpoint que envía el enlace para restablecer la contraseña.
    public function forgotPassword(Request $request, UserRepositoryInterface $users): JsonResponse
    {
        // Esta línea sirve para validar que venga un correo válido.
        $request->validate(['email' => ['required', 'email']]);

        // Esta línea sirve para revisar si existe una cuenta con ese correo.
        if ($users->findByEmail($request->string('email')->toString())) {
            // Esta línea sirve para enviar el enlace de recuperación.
            Password::sendResetLink($request->only('email'));
        }

        // Respuesta uniforme exista o no la cuenta, para no filtrar qué emails están registrados.
        // Esta línea sirve para responder siempre el mismo mensaje.
        return response()->json([
            // Esta línea sirve para armar los datos con el mensaje genérico.
            'data' => ['message' => 'Si el correo existe, se envió un enlace de recuperación.'],
        ]);
    }

    /**
     * Restablecer la contraseña.
     *
     * Usa el `token` del enlace enviado por `POST /auth/forgot-password`.
     */
    // Esta línea sirve para declarar el endpoint que restablece la contraseña.
    public function resetPassword(Request $request): JsonResponse
    {
        // Esta línea sirve para validar los datos recibidos.
        $request->validate([
            // Esta línea sirve para exigir el token del enlace.
            'token' => ['required', 'string'],
            // Esta línea sirve para exigir un correo válido.
            'email' => ['required', 'email'],
            // Esta línea sirve para exigir una contraseña segura y confirmada.
            'password' => ['required', 'confirmed', PasswordRule::defaults()],
        ]);

        // Esta línea sirve para intentar restablecer la contraseña.
        $status = Password::reset(
            // Esta línea sirve para pasar el correo, la contraseña, su confirmación y el token.
            $request->only('email', 'password', 'password_confirmation', 'token'),
            // Esta línea sirve para definir qué hacer con el usuario si el token es válido.
            function ($user, $password) {
                // Esta línea sirve para guardar la contraseña nueva cifrada.
                $user->forceFill(['password' => Hash::make($password)])->save();
            }
        );

        // Esta línea sirve para revisar si el restablecimiento falló.
        if ($status !== Password::PASSWORD_RESET) {
            // No hay archivos de idioma en esta app (todo el resto de mensajes
            // vive directo en español en el código) — __($status) devolvería
            // el string en inglés de Laravel, el único lugar que rompería
            // ese criterio. Se mapea a mano en su lugar.
            // Esta línea sirve para lanzar un error de validación.
            throw ValidationException::withMessages([
                // Esta línea sirve para elegir el mensaje según el motivo del fallo.
                'email' => [match ($status) {
                    // Esta línea sirve para usar el mensaje de enlace inválido o vencido.
                    Password::INVALID_TOKEN => 'Este enlace de recuperación no es válido o ya expiró.',
                    // Esta línea sirve para usar el mensaje de cuenta inexistente.
                    Password::INVALID_USER => 'No existe una cuenta con ese correo.',
                    // Esta línea sirve para usar el mensaje de demasiados intentos.
                    Password::RESET_THROTTLED => 'Espera un momento antes de volver a intentarlo.',
                    // Esta línea sirve para usar un mensaje genérico en cualquier otro caso.
                    default => 'No se pudo restablecer la contraseña.',
                }],
            ]);
        }

        // Esta línea sirve para responder que la contraseña se actualizó.
        return response()->json([
            // Esta línea sirve para armar los datos con el mensaje de éxito.
            'data' => ['message' => 'Contraseña actualizada correctamente.'],
        ]);
    }
}
