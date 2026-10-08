<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los DTOs de autenticación.

namespace App\Application\Auth\DTOs;

// Esta línea sirve para importar el tipo del token de acceso de Sanctum.
use Laravel\Sanctum\NewAccessToken;

/**
 * Resultado de un intento de login: o bien un token Sanctum ya emitido, o
 * bien un desafío de 2FA pendiente (sin token) que debe resolverse contra
 * POST /auth/2fa/challenge antes de emitir uno, o bien (solo login social
 * que crearía una cuenta nueva) la lista de consentimientos legales que el
 * usuario debe aceptar antes de que la cuenta se cree.
 */
// Esta línea sirve para declarar la clase final que representa el resultado de un login.
final class AuthenticationResult
{
    /**
     * @param  list<array{type: string, document: string, version: string, accepted_version: ?string}>|null  $requiredConsents
     */
    // Esta línea sirve para declarar el constructor privado (se usa a través de los métodos estáticos).
    private function __construct(
        // Esta línea sirve para guardar el token de acceso, si el login terminó.
        public readonly ?NewAccessToken $token,
        // Esta línea sirve para guardar el token del desafío 2FA, si falta el código.
        public readonly ?string $challengeToken,
        // Esta línea sirve para guardar los consentimientos pendientes, si faltan para crear la cuenta.
        public readonly ?array $requiredConsents = null,
    ) {}

    // Esta línea sirve para declarar el método que crea un resultado con token (login completo).
    public static function token(NewAccessToken $token): self
    {
        // Esta línea sirve para devolver un resultado que solo trae el token.
        return new self($token, null);
    }

    // Esta línea sirve para declarar el método que crea un resultado que pide el código 2FA.
    public static function challenge(string $challengeToken): self
    {
        // Esta línea sirve para devolver un resultado que solo trae el desafío 2FA.
        return new self(null, $challengeToken);
    }

    /**
     * @param  list<array{type: string, document: string, version: string, accepted_version: ?string}>  $consents
     */
    // Esta línea sirve para declarar el método que crea un resultado que pide aceptar consentimientos.
    public static function consentRequired(array $consents): self
    {
        // Esta línea sirve para devolver un resultado con la lista de consentimientos pendientes.
        return new self(null, null, $consents);
    }

    // Esta línea sirve para declarar el método que indica si falta el código 2FA.
    public function requiresTwoFactor(): bool
    {
        // Esta línea sirve para devolver verdadero si hay un desafío 2FA pendiente.
        return $this->challengeToken !== null;
    }

    // Esta línea sirve para declarar el método que indica si faltan consentimientos.
    public function requiresConsent(): bool
    {
        // Esta línea sirve para devolver verdadero si hay consentimientos pendientes.
        return $this->requiredConsents !== null;
    }
}
