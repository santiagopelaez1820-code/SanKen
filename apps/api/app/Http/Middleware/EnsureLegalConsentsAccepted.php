<?php

namespace App\Http\Middleware;

use App\Domain\Legal\Services\LegalConsentCatalog;
use Closure;
use Illuminate\Http\Request;
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
class EnsureLegalConsentsAccepted
{
    /** @var list<string> nombres de ruta (o prefijos terminados en '.') exentos */
    private const EXEMPT_ROUTES = [
        'api.v1.ping',
        'api.v1.legal.',
        'api.v1.auth.logout',
        'api.v1.auth.me',
        'api.v1.auth.me.destroy',
        'api.v1.auth.email.',
        'api.v1.push.expo-token.destroy',
        'api.v1.push.web-subscription.destroy',
    ];

    public function __construct(
        private readonly LegalConsentCatalog $catalog,
    ) {}

    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user || $this->isExempt($request->route()?->getName())) {
            return $next($request);
        }

        $pending = $this->catalog->pendingFor($user);

        if ($pending !== []) {
            return response()->json([
                'message' => 'Debes aceptar la versión vigente de los documentos legales para continuar.',
                'code' => 'consent_required',
                'pending' => $pending,
            ], 403);
        }

        return $next($request);
    }

    private function isExempt(?string $routeName): bool
    {
        if (! $routeName) {
            return false;
        }

        foreach (self::EXEMPT_ROUTES as $exempt) {
            if ($routeName === $exempt || (str_ends_with($exempt, '.') && str_starts_with($routeName, $exempt))) {
                return true;
            }
        }

        return false;
    }
}
