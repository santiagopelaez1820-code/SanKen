<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los controllers de la API v1.

namespace App\Http\Controllers\Api\V1;

// Esta línea sirve para importar el controller base.
use App\Http\Controllers\Controller;
// Esta línea sirve para importar la validación del registro de un token de Expo.
use App\Http\Requests\Push\StoreExpoTokenRequest;
// Esta línea sirve para importar la validación del registro de una suscripción Web Push.
use App\Http\Requests\Push\StoreWebSubscriptionRequest;
// Esta línea sirve para importar el modelo PushDeviceToken (token de un celular).
use App\Models\PushDeviceToken;
// Esta línea sirve para importar el modelo PushSubscription (suscripción de un navegador).
use App\Models\PushSubscription;
// Esta línea sirve para importar el atributo Group de Scramble para agrupar en Swagger.
use Dedoc\Scramble\Attributes\Group;
// Esta línea sirve para importar la respuesta JSON de Laravel.
use Illuminate\Http\JsonResponse;
// Esta línea sirve para importar la clase Request para leer la petición.
use Illuminate\Http\Request;

// Esta línea sirve para agrupar este controller en la sección "Notificaciones push" de Swagger.
#[Group('Notificaciones push', 'Registro de dispositivos para notificaciones push: tokens de Expo (móvil) y suscripciones Web Push (navegador).', weight: 18)]
// Esta línea sirve para declarar el controller que registra dispositivos para notificaciones push.
class PushController extends Controller
{
    /** Registrar un token de Expo. */
    // Esta línea sirve para declarar el endpoint que registra el token de Expo del celular.
    public function storeExpoToken(StoreExpoTokenRequest $request): JsonResponse
    {
        // updateOrCreate por token (no por user_id): reinstalar la app en el
        // mismo device suele generar el mismo token: evita duplicados.
        // Esta línea sirve para crear el token, o actualizarlo si ya existía.
        PushDeviceToken::query()->updateOrCreate(
            // Esta línea sirve para buscar el registro por el token enviado.
            ['token' => $request->validated('token')],
            // Esta línea sirve para asignarle el usuario actual y la plataforma Expo.
            ['user_id' => $request->user()->id, 'platform' => 'expo'],
        );

        // Esta línea sirve para responder que el token quedó registrado con código 201.
        return response()->json(['data' => ['message' => 'Token registrado.']], 201);
    }

    /** Eliminar un token de Expo. */
    // Esta línea sirve para declarar el endpoint que elimina un token de Expo.
    public function destroyExpoToken(Request $request): JsonResponse
    {
        // Esta línea sirve para validar que se envió el token.
        $request->validate(['token' => ['required', 'string']]);

        // Esta línea sirve para consultar los tokens.
        PushDeviceToken::query()
            // Esta línea sirve para filtrar solo los del usuario autenticado.
            ->where('user_id', $request->user()->id)
            // Esta línea sirve para filtrar por el token enviado.
            ->where('token', $request->input('token'))
            // Esta línea sirve para borrar los que coincidan.
            ->delete();

        // Esta línea sirve para responder con código 204 (sin contenido).
        return response()->json(status: 204);
    }

    /** Registrar una suscripción Web Push. */
    // Esta línea sirve para declarar el endpoint que registra la suscripción Web Push del navegador.
    public function storeWebSubscription(StoreWebSubscriptionRequest $request): JsonResponse
    {
        // Esta línea sirve para crear la suscripción, o actualizarla si ya existía.
        PushSubscription::query()->updateOrCreate(
            // Esta línea sirve para buscar el registro por el endpoint del navegador.
            ['endpoint' => $request->validated('endpoint')],
            [
                // Esta línea sirve para asignarle el usuario actual.
                'user_id' => $request->user()->id,
                // Esta línea sirve para guardar la clave pública del navegador.
                'public_key' => $request->validated('keys.p256dh'),
                // Esta línea sirve para guardar el token de autenticación del navegador.
                'auth_token' => $request->validated('keys.auth'),
            ],
        );

        // Esta línea sirve para responder que la suscripción quedó registrada con código 201.
        return response()->json(['data' => ['message' => 'Suscripción registrada.']], 201);
    }

    /** Eliminar una suscripción Web Push. */
    // Esta línea sirve para declarar el endpoint que elimina una suscripción Web Push.
    public function destroyWebSubscription(Request $request): JsonResponse
    {
        // Esta línea sirve para validar que se envió el endpoint.
        $request->validate(['endpoint' => ['required', 'string']]);

        // Esta línea sirve para consultar las suscripciones.
        PushSubscription::query()
            // Esta línea sirve para filtrar solo las del usuario autenticado.
            ->where('user_id', $request->user()->id)
            // Esta línea sirve para filtrar por el endpoint enviado.
            ->where('endpoint', $request->input('endpoint'))
            // Esta línea sirve para borrar las que coincidan.
            ->delete();

        // Esta línea sirve para responder con código 204 (sin contenido).
        return response()->json(status: 204);
    }
}
