<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Domain\Legal\Services\LegalConsentCatalog;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserConsentResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;

/**
 * Solo lectura: el Super Admin puede consultar qué versión de cada documento
 * aceptó un usuario (p. ej. para atender una solicitud de privacidad), pero
 * no puede crear, editar ni borrar consentimientos en su nombre.
 */
class AdminUserConsentController extends Controller
{
    public function index(User $user, LegalConsentCatalog $catalog): JsonResponse
    {
        return response()->json([
            'data' => [
                'pending' => $catalog->pendingFor($user),
                'history' => UserConsentResource::collection(
                    $user->consents()->orderByDesc('recorded_at')->orderByDesc('id')->get()
                ),
            ],
        ]);
    }
}
