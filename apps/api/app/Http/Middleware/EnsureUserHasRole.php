<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los middleware.

namespace App\Http\Middleware;

// Esta línea sirve para importar Closure para recibir el siguiente paso de la petición.
use Closure;
// Esta línea sirve para importar la clase Request para leer la petición.
use Illuminate\Http\Request;
// Esta línea sirve para importar la clase Response de Symfony para tipar la respuesta.
use Symfony\Component\HttpFoundation\Response;

// Esta línea sirve para declarar el middleware que exige uno de los roles indicados.
class EnsureUserHasRole
{
    /**
     * Restringe una ruta a uno o más roles, ej. `role:trainer,super_admin`.
     */
    // Esta línea sirve para declarar el método que procesa cada petición y recibe los roles permitidos.
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        // Esta línea sirve para obtener el usuario autenticado.
        $user = $request->user();

        // Esta línea sirve para revisar si no hay usuario o si su rol no está entre los permitidos.
        if (! $user || ! in_array($user->role, $roles, true)) {
            // Esta línea sirve para responder 403 con el mensaje de falta de permiso.
            abort(403, 'No tienes permiso para acceder a este recurso.');
        }

        // Esta línea sirve para dejar pasar la petición.
        return $next($request);
    }
}
