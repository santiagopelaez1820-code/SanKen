<?php

namespace App\Http\Controllers\Api\V1\Legal;

use App\Application\Legal\Actions\RecordUserConsentsAction;
use App\Domain\Legal\Services\LegalConsentCatalog;
use App\Http\Controllers\Controller;
use App\Http\Requests\Legal\AcceptConsentsRequest;
use App\Http\Resources\UserConsentResource;
use App\Http\Resources\UserResource;
use App\Models\UserConsent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LegalController extends Controller
{
    /**
     * Público (sin auth): versiones vigentes y qué consentimientos exige
     * crear una cuenta. El texto de los documentos vive en @sanken/core.
     */
    public function documents(LegalConsentCatalog $catalog): JsonResponse
    {
        return response()->json([
            'data' => [
                'documents' => $catalog->documents(),
                'consents' => collect($catalog->consentTypes())
                    ->map(fn (string $type) => [
                        'type' => $type,
                        'document' => $catalog->documentFor($type),
                        'version' => $catalog->currentVersionFor($type),
                    ])
                    ->values(),
            ],
        ]);
    }

    /** Estado legal del propio usuario: qué le falta aceptar y su historial. */
    public function consents(Request $request, LegalConsentCatalog $catalog): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'data' => [
                'pending' => $catalog->pendingFor($user),
                'history' => UserConsentResource::collection(
                    $user->consents()->orderByDesc('recorded_at')->orderByDesc('id')->get()
                ),
            ],
        ]);
    }

    /**
     * Registra la aceptación de los tipos indicados en su versión vigente.
     * Siempre sobre $request->user() — no hay forma de aceptar en nombre de
     * otra cuenta, ni de elegir versión o fecha.
     */
    public function accept(AcceptConsentsRequest $request, RecordUserConsentsAction $action, LegalConsentCatalog $catalog): JsonResponse
    {
        $user = $request->user();

        $action->execute($user, $request->validated('consents'), UserConsent::SOURCE_REACCEPTANCE);

        return response()->json([
            'data' => [
                'pending' => $catalog->pendingFor($user),
                'user' => new UserResource($user),
            ],
        ]);
    }
}
