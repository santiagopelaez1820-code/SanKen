<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de la documentación de la API.

namespace App\Http\ApiDocs;

// Esta línea sirve para importar la clase base de las extensiones de operación de Scramble.
use Dedoc\Scramble\Extensions\OperationExtension;
// Esta línea sirve para importar la clase que representa una operación (endpoint) de OpenAPI.
use Dedoc\Scramble\Support\Generator\Operation;
// Esta línea sirve para importar la clase que representa un parámetro de OpenAPI.
use Dedoc\Scramble\Support\Generator\Parameter;
// Esta línea sirve para importar la clase que representa el cuerpo de una petición.
use Dedoc\Scramble\Support\Generator\RequestBodyObject;
// Esta línea sirve para importar la clase que representa un schema de OpenAPI.
use Dedoc\Scramble\Support\Generator\Schema;
// Esta línea sirve para importar la información de la ruta que está documentando Scramble.
use Dedoc\Scramble\Support\RouteInfo;

/**
 * Scramble no admite body en un DELETE: documenta sus reglas de validación
 * como query params. Pero los DELETE de esta API que validan algo
 * (DELETE /auth/me, /push/expo-token, /push/web-subscription) lo reciben en
 * el body JSON — así lo mandan web y mobile, ver
 * packages/core/src/api/client.ts —, y documentar la contraseña de
 * DELETE /auth/me como query param invitaría a mandarla en la URL.
 *
 * Mueve al body solo los parámetros que salen de las reglas de validación:
 * los declarados como query a propósito (#[QueryParameter] o
 * $request->query()) llegan marcados con `nonBody`/`isInQuery` y se quedan
 * donde están. Registrada en config('scramble.extensions').
 */
// Esta línea sirve para declarar la extensión que documenta en el body los parámetros de los DELETE.
class DeleteRequestBodyExtension extends OperationExtension
{
    // Esta línea sirve para declarar el método que Scramble llama para cada endpoint.
    public function handle(Operation $operation, RouteInfo $routeInfo): void
    {
        // Esta línea sirve para revisar si el endpoint no es un DELETE.
        if ($operation->method !== 'delete') {
            // Esta línea sirve para terminar sin cambios.
            return;
        }

        // Esta línea sirve para separar los parámetros que van al body de los demás.
        [$bodyParameters, $otherParameters] = collect($operation->parameters)->partition(
            // Esta línea sirve para exigir que el parámetro esté en la query.
            fn (Parameter $parameter) => $parameter->in === 'query'
                // Esta línea sirve para exigir que no esté marcado como no-body.
                && ! $parameter->getAttribute('nonBody')
                // Esta línea sirve para exigir que no se haya declarado como query a propósito.
                && ! $parameter->getAttribute('isInQuery'),
        );

        // Esta línea sirve para revisar si no hay parámetros para mover.
        if ($bodyParameters->isEmpty()) {
            // Esta línea sirve para terminar sin cambios.
            return;
        }

        // Esta línea sirve para dejar en la operación solo los demás parámetros.
        $operation->parameters = $otherParameters->values()->all();
        // Esta línea sirve para agregar el cuerpo de la petición a la operación.
        $operation->addRequestBodyObject(
            // Esta línea sirve para crear el cuerpo de la petición.
            RequestBodyObject::make()
                // Esta línea sirve para definir un schema JSON armado con los parámetros movidos.
                ->setContent('application/json', Schema::createFromParameters($bodyParameters->values()->all()))
                // Esta línea sirve para marcar el cuerpo como obligatorio si algún parámetro lo es.
                ->required($bodyParameters->contains(fn (Parameter $parameter) => $parameter->required)),
        );
    }
}
