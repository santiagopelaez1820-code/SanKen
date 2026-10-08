<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de la integración con Firebase.

namespace App\Infrastructure\Firebase;

/**
 * Subconjunto de claims de un Firebase ID Token ya verificado (firma +
 * expiración + issuer/audience) — nunca se construye a partir de datos
 * enviados sueltos por el cliente, solo desde FirebaseTokenVerifier::verify().
 */
// Esta línea sirve para declarar la clase con los datos de un token de Firebase ya verificado.
final class FirebaseTokenClaims
{
    // Esta línea sirve para declarar el constructor.
    public function __construct(
        // Esta línea sirve para guardar el uid del usuario en Firebase.
        public readonly string $uid,
        // Esta línea sirve para guardar el correo (o null).
        public readonly ?string $email,
        // Esta línea sirve para guardar si el correo está verificado.
        public readonly bool $emailVerified,
        // Esta línea sirve para guardar el nombre (o null).
        public readonly ?string $name,
        // Esta línea sirve para guardar la URL de la foto (o null).
        public readonly ?string $picture,
    ) {}
}
