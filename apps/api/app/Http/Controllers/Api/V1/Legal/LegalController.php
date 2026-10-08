<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los controllers legales.

namespace App\Http\Controllers\Api\V1\Legal;

// Esta línea sirve para importar la acción que registra consentimientos.
use App\Application\Legal\Actions\RecordUserConsentsAction;
// Esta línea sirve para importar el catálogo de documentos y consentimientos legales.
use App\Domain\Legal\Services\LegalConsentCatalog;
// Esta línea sirve para importar el controller base.
use App\Http\Controllers\Controller;
// Esta línea sirve para importar la validación de la aceptación de consentimientos.
use App\Http\Requests\Legal\AcceptConsentsRequest;
// Esta línea sirve para importar el resource que da formato a un consentimiento.
use App\Http\Resources\UserConsentResource;
// Esta línea sirve para importar el resource que da formato a un usuario.
use App\Http\Resources\UserResource;
// Esta línea sirve para importar el modelo UserConsent para usar sus constantes de origen.
use App\Models\UserConsent;
// Esta línea sirve para importar el atributo Group de Scramble para agrupar en Swagger.
use Dedoc\Scramble\Attributes\Group;
// Esta línea sirve para importar la respuesta JSON de Laravel.
use Illuminate\Http\JsonResponse;
// Esta línea sirve para importar la clase Request para leer la petición.
use Illuminate\Http\Request;

// Esta línea sirve para agrupar este controller en la sección "Legal y consentimientos" de Swagger.
#[Group('Legal y consentimientos', 'Documentos legales vigentes y consentimientos del usuario. Mientras falte aceptar alguna versión vigente, el resto de la API responde 403 con `code: consent_required`.', weight: 3)]
// Esta línea sirve para declarar el controller de documentos legales y consentimientos.
class LegalController extends Controller
{
    /**
     * Listar los documentos legales vigentes.
     *
     * Público (sin auth): versiones vigentes y qué consentimientos exige
     * crear una cuenta. El texto de los documentos vive en @sanken/core.
     */
    // Esta línea sirve para declarar el endpoint público que lista los documentos legales vigentes.
    public function documents(LegalConsentCatalog $catalog): JsonResponse
    {
        // Esta línea sirve para responder con los documentos.
        return response()->json([
            // Esta línea sirve para armar los datos.
            'data' => [
                // Esta línea sirve para incluir los documentos con su versión vigente.
                'documents' => $catalog->documents(),
                // Esta línea sirve para incluir los consentimientos que se piden al crear una cuenta.
                'consents' => collect($catalog->consentTypes())
                    // Esta línea sirve para convertir cada tipo de consentimiento en sus datos.
                    ->map(fn (string $type) => [
                        // Esta línea sirve para incluir el tipo.
                        'type' => $type,
                        // Esta línea sirve para incluir el documento al que pertenece.
                        'document' => $catalog->documentFor($type),
                        // Esta línea sirve para incluir la versión vigente.
                        'version' => $catalog->currentVersionFor($type),
                    ])
                    // Esta línea sirve para reindexar la lista.
                    ->values(),
            ],
        ]);
    }

    /**
     * Consultar mis consentimientos.
     *
     * Estado legal del propio usuario: qué le falta aceptar y su historial.
     */
    // Esta línea sirve para declarar el endpoint que muestra el estado legal del usuario.
    public function consents(Request $request, LegalConsentCatalog $catalog): JsonResponse
    {
        // Esta línea sirve para obtener el usuario autenticado.
        $user = $request->user();

        // Esta línea sirve para responder con el estado legal.
        return response()->json([
            // Esta línea sirve para armar los datos.
            'data' => [
                // Esta línea sirve para incluir los consentimientos pendientes.
                'pending' => $catalog->pendingFor($user),
                // Esta línea sirve para incluir el historial con su formato.
                'history' => UserConsentResource::collection(
                    // Esta línea sirve para ordenar el historial del más reciente al más antiguo.
                    $user->consents()->orderByDesc('recorded_at')->orderByDesc('id')->get()
                ),
            ],
        ]);
    }

    /**
     * Aceptar documentos legales.
     *
     * Registra la aceptación de los tipos indicados en su versión vigente.
     * Siempre sobre $request->user() — no hay forma de aceptar en nombre de
     * otra cuenta, ni de elegir versión o fecha.
     */
    // Esta línea sirve para declarar el endpoint que acepta documentos legales.
    public function accept(AcceptConsentsRequest $request, RecordUserConsentsAction $action, LegalConsentCatalog $catalog): JsonResponse
    {
        // Esta línea sirve para obtener el usuario autenticado.
        $user = $request->user();

        // Esta línea sirve para registrar la aceptación de los consentimientos enviados.
        $action->execute($user, $request->validated('consents'), UserConsent::SOURCE_REACCEPTANCE);

        // Esta línea sirve para responder con el estado legal actualizado.
        return response()->json([
            // Esta línea sirve para armar los datos.
            'data' => [
                // Esta línea sirve para incluir lo que todavía queda pendiente.
                'pending' => $catalog->pendingFor($user),
                // Esta línea sirve para incluir el usuario con su formato.
                'user' => new UserResource($user),
            ],
        ]);
    }
}
