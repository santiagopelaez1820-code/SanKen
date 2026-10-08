<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los controllers de autenticación.

namespace App\Http\Controllers\Api\V1\Auth;

// Esta línea sirve para importar la acción que completa el login con el código 2FA.
use App\Application\Auth\Actions\ChallengeTwoFactorAction;
// Esta línea sirve para importar la acción que confirma la activación de 2FA.
use App\Application\Auth\Actions\ConfirmTwoFactorAction;
// Esta línea sirve para importar la acción que desactiva 2FA.
use App\Application\Auth\Actions\DisableTwoFactorAction;
// Esta línea sirve para importar la acción que inicia la activación de 2FA.
use App\Application\Auth\Actions\EnableTwoFactorAction;
// Esta línea sirve para importar la acción que registra un inicio de sesión.
use App\Application\Auth\Actions\RecordUserSessionAction;
// Esta línea sirve para importar el controller base.
use App\Http\Controllers\Controller;
// Esta línea sirve para importar la validación del desafío 2FA.
use App\Http\Requests\Auth\ChallengeTwoFactorRequest;
// Esta línea sirve para importar la validación de la confirmación de 2FA.
use App\Http\Requests\Auth\ConfirmTwoFactorRequest;
// Esta línea sirve para importar la validación de la desactivación de 2FA.
use App\Http\Requests\Auth\DisableTwoFactorRequest;
// Esta línea sirve para importar el resource que da formato a un usuario.
use App\Http\Resources\UserResource;
// Esta línea sirve para importar el atributo Group de Scramble para agrupar en Swagger.
use Dedoc\Scramble\Attributes\Group;
// Esta línea sirve para importar la respuesta JSON de Laravel.
use Illuminate\Http\JsonResponse;
// Esta línea sirve para importar la clase Request para leer la petición.
use Illuminate\Http\Request;

// Esta línea sirve para agrupar este controller en la sección "Autenticación" de Swagger.
#[Group('Autenticación', weight: 2)]
// Esta línea sirve para declarar el controller de la verificación en dos pasos.
class TwoFactorController extends Controller
{
    /**
     * Iniciar la activación de 2FA.
     *
     * Genera el secreto TOTP y devuelve el `otpauth_uri` y el QR (SVG) para
     * registrarlo en la app autenticadora. 2FA no queda activo hasta
     * confirmarlo con `POST /auth/2fa/confirm`.
     */
    // Esta línea sirve para declarar el endpoint que inicia la activación de 2FA.
    public function enable(Request $request, EnableTwoFactorAction $action): JsonResponse
    {
        // Esta línea sirve para responder con el secreto, la URI y el QR generados.
        return response()->json(['data' => $action->execute($request->user())]);
    }

    /**
     * Confirmar la activación de 2FA.
     *
     * Valida un código de la app autenticadora, activa 2FA y devuelve los
     * códigos de recuperación en texto plano (solo se guardan hasheados).
     */
    // Esta línea sirve para declarar el endpoint que confirma la activación de 2FA.
    public function confirm(ConfirmTwoFactorRequest $request, ConfirmTwoFactorAction $action): JsonResponse
    {
        // Esta línea sirve para validar el código y obtener los códigos de recuperación.
        $recoveryCodes = $action->execute($request->user(), $request->string('code')->toString());

        // Esta línea sirve para responder con los códigos de recuperación.
        return response()->json(['data' => ['recovery_codes' => $recoveryCodes]]);
    }

    /**
     * Desactivar 2FA.
     *
     * Requiere la contraseña actual.
     */
    // Esta línea sirve para declarar el endpoint que desactiva 2FA.
    public function disable(DisableTwoFactorRequest $request, DisableTwoFactorAction $action): JsonResponse
    {
        // Esta línea sirve para desactivar 2FA verificando la contraseña.
        $action->execute($request->user(), $request->string('password')->toString());

        // Esta línea sirve para responder que 2FA se desactivó.
        return response()->json(['data' => ['message' => '2FA desactivado.']]);
    }

    /**
     * Completar el inicio de sesión con 2FA.
     *
     * Canjea el `challenge_token` del login (válido 5 minutos, máximo 5
     * intentos) y un código TOTP o de recuperación por el usuario y su token.
     * Un código de recuperación usado deja de servir.
     */
    // Esta línea sirve para declarar el endpoint que completa el login con el código 2FA.
    public function challenge(ChallengeTwoFactorRequest $request, ChallengeTwoFactorAction $action, RecordUserSessionAction $recordSession): JsonResponse
    {
        // Esta línea sirve para canjear el desafío y el código por un token de acceso.
        $token = $action->execute(
            // Esta línea sirve para pasar el token del desafío.
            $request->string('challenge_token')->toString(),
            // Esta línea sirve para pasar el código ingresado.
            $request->string('code')->toString(),
            // Esta línea sirve para pasar el nombre del dispositivo (o el navegador, o "api").
            $request->input('device_name') ?? $request->userAgent() ?? 'api',
        );
        // Esta línea sirve para registrar el inicio de sesión para la analítica.
        $recordSession->execute($token->accessToken->tokenable, $request);

        // Esta línea sirve para responder con el usuario y el token.
        return response()->json([
            // Esta línea sirve para armar los datos.
            'data' => [
                // Esta línea sirve para incluir el usuario con su formato.
                'user' => UserResource::forOwner($token->accessToken->tokenable),
                // Esta línea sirve para incluir el token en texto plano.
                'token' => $token->plainTextToken,
            ],
        ]);
    }
}
