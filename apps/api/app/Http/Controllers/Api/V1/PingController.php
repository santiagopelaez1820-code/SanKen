<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los controllers de la API v1.

namespace App\Http\Controllers\Api\V1;

// Esta línea sirve para importar el contrato del repositorio de usuarios.
use App\Domain\User\Contracts\UserRepositoryInterface;
// Esta línea sirve para importar el controller base.
use App\Http\Controllers\Controller;
// Esta línea sirve para importar el atributo Group de Scramble para agrupar en Swagger.
use Dedoc\Scramble\Attributes\Group;
// Esta línea sirve para importar la respuesta JSON de Laravel.
use Illuminate\Http\JsonResponse;

// Esta línea sirve para agrupar este controller en la sección "Sistema" de Swagger.
#[Group('Sistema', 'Estado del servicio.', weight: 1)]
// Esta línea sirve para declarar el controller que comprueba el estado de la API.
class PingController extends Controller
{
    /**
     * Comprobar el estado de la API.
     *
     * Público (sin auth). Responde `status: ok` si la API y la base de datos
     * están disponibles.
     */
    // Esta línea sirve para declarar el método que se ejecuta al llamar al controller.
    public function __invoke(UserRepositoryInterface $users): JsonResponse
    {
        // Esta línea sirve para responder con el estado del servicio.
        return response()->json([
            // Esta línea sirve para armar los datos.
            'data' => [
                // Esta línea sirve para indicar que la API está funcionando.
                'status' => 'ok',
                // Esta línea sirve para incluir el nombre de la aplicación.
                'app' => config('app.name'),
                // Esta línea sirve para incluir cuántos usuarios hay registrados (de paso comprueba la base de datos).
                'users_registered' => $users->count(),
            ],
        ]);
    }
}
