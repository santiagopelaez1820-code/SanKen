<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los controllers de administración.

namespace App\Http\Controllers\Api\V1\Admin;

// Esta línea sirve para importar el catálogo de consentimientos legales.
use App\Domain\Legal\Services\LegalConsentCatalog;
// Esta línea sirve para importar el controller base.
use App\Http\Controllers\Controller;
// Esta línea sirve para importar el resource que da formato a un consentimiento.
use App\Http\Resources\UserConsentResource;
// Esta línea sirve para importar el modelo User (usuario).
use App\Models\User;
// Esta línea sirve para importar el atributo Group de Scramble para agrupar en Swagger.
use Dedoc\Scramble\Attributes\Group;
// Esta línea sirve para importar la respuesta JSON de Laravel.
use Illuminate\Http\JsonResponse;

/**
 * Solo lectura: el Super Admin puede consultar qué versión de cada documento
 * aceptó un usuario (p. ej. para atender una solicitud de privacidad), pero
 * no puede crear, editar ni borrar consentimientos en su nombre.
 */
// Esta línea sirve para agrupar este controller en la sección "Admin · Usuarios" de Swagger.
#[Group('Admin · Usuarios', weight: 23)]
// Esta línea sirve para declarar el controller que muestra los consentimientos de un usuario.
class AdminUserConsentController extends Controller
{
    /**
     * Ver los consentimientos legales de un usuario.
     *
     * Pendientes e historial completo; solo lectura.
     */
    // Esta línea sirve para declarar el endpoint que lista los consentimientos de un usuario.
    public function index(User $user, LegalConsentCatalog $catalog): JsonResponse
    {
        // Esta línea sirve para responder con los consentimientos.
        return response()->json([
            // Esta línea sirve para armar los datos.
            'data' => [
                // Esta línea sirve para incluir los consentimientos pendientes.
                'pending' => $catalog->pendingFor($user),
                // Esta línea sirve para incluir el historial de consentimientos con su formato.
                'history' => UserConsentResource::collection(
                    // Esta línea sirve para ordenar el historial del más reciente al más antiguo.
                    $user->consents()->orderByDesc('recorded_at')->orderByDesc('id')->get()
                ),
            ],
        ]);
    }
}
