<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los controllers de autenticación.

namespace App\Http\Controllers\Api\V1\Auth;

// Esta línea sirve para importar el contrato del repositorio de usuarios.
use App\Domain\User\Contracts\UserRepositoryInterface;
// Esta línea sirve para importar el controller base.
use App\Http\Controllers\Controller;
// Esta línea sirve para importar el atributo Group de Scramble para agrupar en Swagger.
use Dedoc\Scramble\Attributes\Group;
// Esta línea sirve para importar el evento que avisa que el correo se verificó.
use Illuminate\Auth\Events\Verified;
// Esta línea sirve para importar la respuesta JSON de Laravel.
use Illuminate\Http\JsonResponse;
// Esta línea sirve para importar la clase Request para leer la petición.
use Illuminate\Http\Request;
// Esta línea sirve para importar el limitador de intentos.
use Illuminate\Support\Facades\RateLimiter;

// Esta línea sirve para agrupar este controller en la sección "Autenticación" de Swagger.
#[Group('Autenticación', weight: 2)]
// Esta línea sirve para declarar el controller de verificación de correo.
class EmailVerificationController extends Controller
{
    /**
     * Verificar el correo electrónico.
     *
     * Destino del enlace firmado que llega por correo (válido 60 minutos);
     * `expires` y `signature` los agrega Laravel al firmar la URL. Si hay URL
     * del frontend configurada, la respuesta incluye `redirect`.
     */
    // Esta línea sirve para declarar el endpoint que verifica el correo desde el enlace firmado.
    public function verify(Request $request, UserRepositoryInterface $users, int $id, string $hash): JsonResponse
    {
        // Esta línea sirve para revisar si la firma del enlace no es válida o expiró.
        if (! $request->hasValidSignature()) {
            // Esta línea sirve para responder con error 403.
            return response()->json(['message' => 'El enlace de verificación no es válido o expiró.'], 403);
        }

        // Esta línea sirve para buscar al usuario del enlace.
        $user = $users->findById($id);

        // Esta línea sirve para revisar si el usuario no existe o el hash no coincide con su correo.
        if (! $user || ! hash_equals(sha1($user->getEmailForVerification()), $hash)) {
            // Esta línea sirve para responder con error 403.
            return response()->json(['message' => 'El enlace de verificación no es válido.'], 403);
        }

        // Esta línea sirve para revisar si el correo todavía no estaba verificado.
        if (! $user->hasVerifiedEmail()) {
            // Esta línea sirve para marcar el correo como verificado.
            $user->markEmailAsVerified();
            // Esta línea sirve para disparar el evento de correo verificado.
            event(new Verified($user));
        }

        // Esta línea sirve para leer la URL del frontend configurada.
        $frontendUrl = config('app.frontend_url');

        // Esta línea sirve para revisar si hay URL del frontend.
        if ($frontendUrl) {
            // Esta línea sirve para responder con éxito e indicar a dónde redirigir.
            return response()->json([
                // Esta línea sirve para armar los datos con el mensaje y la redirección.
                'data' => ['message' => 'Correo verificado.', 'redirect' => "{$frontendUrl}/email-verified"],
            ]);
        }

        // Esta línea sirve para responder con el mensaje de éxito.
        return response()->json(['data' => ['message' => 'Correo verificado.']]);
    }

    /**
     * Reenviar el correo de verificación.
     *
     * Máximo 3 reenvíos cada 5 minutos por usuario.
     */
    // Esta línea sirve para declarar el endpoint que reenvía el correo de verificación.
    public function resend(Request $request): JsonResponse
    {
        // Esta línea sirve para obtener el usuario autenticado.
        $user = $request->user();

        // Esta línea sirve para revisar si el correo ya estaba verificado.
        if ($user->hasVerifiedEmail()) {
            // Esta línea sirve para responder que ya está verificado.
            return response()->json(['data' => ['message' => 'El correo ya está verificado.']]);
        }

        // Esta línea sirve para armar la clave del límite de reenvíos del usuario.
        $key = 'verify-email:'.$user->id;

        // Esta línea sirve para revisar si ya hizo 3 intentos.
        if (RateLimiter::tooManyAttempts($key, 3)) {
            // Esta línea sirve para responder con error 429 (demasiados intentos).
            return response()->json(['message' => 'Demasiados intentos, espera antes de reintentar.'], 429);
        }

        // Esta línea sirve para sumar un intento que dura 5 minutos.
        RateLimiter::hit($key, 300);
        // Esta línea sirve para enviar el correo de verificación.
        $user->sendEmailVerificationNotification();

        // Esta línea sirve para responder que el correo se reenvió.
        return response()->json(['data' => ['message' => 'Correo de verificación reenviado.']]);
    }
}
