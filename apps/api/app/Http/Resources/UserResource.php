<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los resources.

namespace App\Http\Resources;

// Esta línea sirve para importar el catálogo de documentos y consentimientos legales.
use App\Domain\Legal\Services\LegalConsentCatalog;
// Esta línea sirve para importar el modelo User (usuario) para tipar el resource.
use App\Models\User;
// Esta línea sirve para importar la clase Request para leer la petición.
use Illuminate\Http\Request;
// Esta línea sirve para importar la clase base de los resources JSON.
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin User */
// Esta línea sirve para declarar el resource que da formato a un usuario.
class UserResource extends JsonResource
{
    // Esta línea sirve para guardar si el resource describe al dueño de la sesión.
    private bool $forOwner = false;

    /**
     * Para respuestas de login/registro: el request todavía no está
     * autenticado ($request->user() es null), pero el resource SÍ describe
     * al dueño de la sesión que se acaba de emitir.
     */
    // Esta línea sirve para declarar el método que crea el resource marcado como del dueño.
    public static function forOwner(User $user): static
    {
        // Esta línea sirve para crear el resource con el usuario.
        $resource = new static($user);
        // Esta línea sirve para marcarlo como del dueño de la sesión.
        $resource->forOwner = true;

        // Esta línea sirve para devolver el resource.
        return $resource;
    }

    // Esta línea sirve para declarar el método privado que indica si quien pide es el propio usuario.
    private function isOwner(Request $request): bool
    {
        // Esta línea sirve para devolver verdadero si se marcó como dueño o si el usuario autenticado es este.
        return $this->forOwner || (bool) $request->user()?->is($this->resource);
    }

    /**
     * @return array<string, mixed>
     */
    // Esta línea sirve para declarar el método que convierte el usuario en arreglo para la respuesta JSON.
    public function toArray(Request $request): array
    {
        // Esta línea sirve para devolver los datos.
        return [
            // Esta línea sirve para incluir el id.
            'id' => $this->id,
            // Esta línea sirve para incluir el nombre.
            'name' => $this->name,
            // Esta línea sirve para incluir el correo.
            'email' => $this->email,
            // Esta línea sirve para incluir la URL de la foto de perfil.
            'avatar_url' => $this->avatar_url,
            // Esta línea sirve para incluir el rol.
            'role' => $this->role,
            // Esta línea sirve para indicar si tiene activada la verificación en dos pasos.
            'two_factor_enabled' => $this->two_factor_enabled,
            // Esta línea sirve para indicar si su perfil es público en los rankings.
            'is_public_profile' => $this->is_public_profile,
            // Esta línea sirve para incluir cuándo se verificó como entrenador.
            'trainer_verified_at' => $this->trainer_verified_at?->toIso8601String(),
            // Esta línea sirve para incluir cuándo verificó su correo.
            'email_verified_at' => $this->email_verified_at?->toIso8601String(),
            // Esta línea sirve para indicar si completó el onboarding.
            'onboarding_completed' => (bool) $this->onboardingResponse?->completed,
            // Esta línea sirve para indicar si ya eligió su ciudad.
            'has_location' => (bool) $this->profile?->city_id,
            // Esta línea sirve para incluir la fecha de registro.
            'created_at' => $this->created_at?->toIso8601String(),
            // Solo para el propio usuario: este resource también se usa para
            // mostrar a OTRO usuario (ej. el entrenador en MyTrainerResource)
            // y su estado legal no le incumbe a nadie más. Web/mobile usan
            // esta lista para pedir la re-aceptación de documentos
            // actualizados (ver config/legal.php).
            // null = cuenta creada con correo/contraseña (eliminarla pide la
            // contraseña, ver DeleteAccountRequest); 'google' = login social.
            // Esta línea sirve para incluir el proveedor de login solo para el propio usuario.
            'auth_provider' => $this->when($this->isOwner($request), $this->auth_provider),
            // Esta línea sirve para incluir los consentimientos pendientes solo para el propio usuario.
            'pending_consents' => $this->when(
                // Esta línea sirve para revisar si quien pide es el propio usuario.
                $this->isOwner($request),
                // Esta línea sirve para calcular los tipos de consentimiento pendientes.
                fn () => app(LegalConsentCatalog::class)->pendingTypesFor($this->resource),
            ),
        ];
    }
}
