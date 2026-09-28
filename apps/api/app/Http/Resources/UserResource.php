<?php

namespace App\Http\Resources;

use App\Domain\Legal\Services\LegalConsentCatalog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin User */
class UserResource extends JsonResource
{
    private bool $forOwner = false;

    /**
     * Para respuestas de login/registro: el request todavía no está
     * autenticado ($request->user() es null), pero el resource SÍ describe
     * al dueño de la sesión que se acaba de emitir.
     */
    public static function forOwner(User $user): static
    {
        $resource = new static($user);
        $resource->forOwner = true;

        return $resource;
    }

    private function isOwner(Request $request): bool
    {
        return $this->forOwner || (bool) $request->user()?->is($this->resource);
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'avatar_url' => $this->avatar_url,
            'role' => $this->role,
            'two_factor_enabled' => $this->two_factor_enabled,
            'is_public_profile' => $this->is_public_profile,
            'trainer_verified_at' => $this->trainer_verified_at?->toIso8601String(),
            'email_verified_at' => $this->email_verified_at?->toIso8601String(),
            'onboarding_completed' => (bool) $this->onboardingResponse?->completed,
            'has_location' => (bool) $this->profile?->city_id,
            'created_at' => $this->created_at?->toIso8601String(),
            // Solo para el propio usuario: este resource también se usa para
            // mostrar a OTRO usuario (ej. el entrenador en MyTrainerResource)
            // y su estado legal no le incumbe a nadie más. Web/mobile usan
            // esta lista para pedir la re-aceptación de documentos
            // actualizados (ver config/legal.php).
            // null = cuenta creada con correo/contraseña (eliminarla pide la
            // contraseña, ver DeleteAccountRequest); 'google' = login social.
            'auth_provider' => $this->when($this->isOwner($request), $this->auth_provider),
            'pending_consents' => $this->when(
                $this->isOwner($request),
                fn () => app(LegalConsentCatalog::class)->pendingTypesFor($this->resource),
            ),
        ];
    }
}
