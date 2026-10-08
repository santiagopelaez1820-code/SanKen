<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los middleware.

namespace App\Http\Middleware;

// Esta línea sirve para importar el catálogo de documentos y consentimientos legales.
use App\Domain\Legal\Services\LegalConsentCatalog;
// Esta línea sirve para importar Closure para recibir el siguiente paso de la petición.
use Closure;
// Esta línea sirve para importar la clase Request para leer la petición.
use Illuminate\Http\Request;
// Esta línea sirve para importar la clase Response de Symfony para tipar la respuesta.
use Symfony\Component\HttpFoundation\Response;

/**
 * Bloquea en el SERVIDOR (no solo en web/mobile) cualquier request
 * autenticada de un usuario con consentimientos legales pendientes — nunca
 * aceptados (cuenta previa a este sistema) o de una versión anterior a la
 * vigente (ver config/legal.php). Responde 403 con code=consent_required y
 * la lista de pendientes; los clientes lo usan para mostrar la pantalla de
 * re-aceptación.
 *
 * Global en el grupo `api` (igual que TouchLastActive): no-op sin usuario
 * autenticado. Quedan exentas solo las rutas que el usuario necesita para
 * salir de ese estado: ver su sesión, aceptar, cerrar sesión o eliminar la
 * cuenta (no aceptar los documentos nuevos no puede dejarlo sin forma de
 * irse).
 */
// Esta línea sirve para declarar el middleware que exige tener aceptados los documentos legales.
class EnsureLegalConsentsAccepted
{
    // Esta línea sirve para definir las rutas que no exigen consentimientos.
    /** @var list<string> nombres de ruta (o prefijos terminados en '.') exentos */
    private const EXEMPT_ROUTES = [
        // Esta línea sirve para permitir el ping.
        'api.v1.ping',
        // Esta línea sirve para permitir todas las rutas legales.
        'api.v1.legal.',
        // Esta línea sirve para permitir cerrar sesión.
        'api.v1.auth.logout',
        // Esta línea sirve para permitir ver la sesión actual.
        'api.v1.auth.me',
        // Esta línea sirve para permitir eliminar la cuenta.
        'api.v1.auth.me.destroy',
        // Esta línea sirve para permitir verificar el correo y reenviar la verificación.
        'api.v1.auth.email.',
        // Esta línea sirve para permitir eliminar el token de Expo.
        'api.v1.push.expo-token.destroy',
        // Esta línea sirve para permitir eliminar la suscripción Web Push.
        'api.v1.push.web-subscription.destroy',
    ];

    // Esta línea sirve para declarar el constructor.
    public function __construct(
        // Esta línea sirve para recibir el catálogo legal.
        private readonly LegalConsentCatalog $catalog,
    ) {}

    // Esta línea sirve para declarar el método que procesa cada petición.
    public function handle(Request $request, Closure $next): Response
    {
        // Esta línea sirve para obtener el usuario autenticado.
        $user = $request->user();

        // Esta línea sirve para revisar si no hay usuario o si la ruta está exenta.
        if (! $user || $this->isExempt($request->route()?->getName())) {
            // Esta línea sirve para dejar pasar la petición sin revisar nada.
            return $next($request);
        }

        // Esta línea sirve para obtener los consentimientos pendientes del usuario.
        $pending = $this->catalog->pendingFor($user);

        // Esta línea sirve para revisar si tiene alguno pendiente.
        if ($pending !== []) {
            // Esta línea sirve para responder con error 403.
            return response()->json([
                // Esta línea sirve para indicar que debe aceptar los documentos vigentes.
                'message' => 'Debes aceptar la versión vigente de los documentos legales para continuar.',
                // Esta línea sirve para incluir el código de error que usan los clientes.
                'code' => 'consent_required',
                // Esta línea sirve para incluir la lista de pendientes.
                'pending' => $pending,
                // Esta línea sirve para indicar el código HTTP 403.
            ], 403);
        }

        // Esta línea sirve para dejar pasar la petición.
        return $next($request);
    }

    // Esta línea sirve para declarar el método privado que revisa si una ruta está exenta.
    private function isExempt(?string $routeName): bool
    {
        // Esta línea sirve para revisar si la ruta no tiene nombre.
        if (! $routeName) {
            // Esta línea sirve para devolver que no está exenta.
            return false;
        }

        // Esta línea sirve para recorrer las rutas exentas.
        foreach (self::EXEMPT_ROUTES as $exempt) {
            // Esta línea sirve para revisar si coincide exacto o si empieza con un prefijo terminado en punto.
            if ($routeName === $exempt || (str_ends_with($exempt, '.') && str_starts_with($routeName, $exempt))) {
                // Esta línea sirve para devolver que está exenta.
                return true;
            }
        }

        // Esta línea sirve para devolver que no está exenta.
        return false;
    }
}
