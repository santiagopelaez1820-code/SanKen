<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de la integración con Firebase.

namespace App\Infrastructure\Firebase;

// Esta línea sirve para importar la fábrica del SDK de Firebase.
use Kreait\Firebase\Factory;
// Esta línea sirve para importar la excepción que se lanza si falta configuración.
use RuntimeException;
// Esta línea sirve para importar Throwable para capturar cualquier error.
use Throwable;

/**
 * Único punto del backend que confía en un Firebase ID Token: verifica
 * firma, expiración, issuer y audience contra el Admin SDK antes de leer
 * ningún claim (uid/email) — el controller/Action nunca reciben el token
 * crudo, solo el resultado ya verificado.
 *
 * Falla cerrado a propósito: sin FIREBASE_CREDENTIALS configurado, ninguna
 * request de login social puede completarse (nunca "verificación" falsa).
 */
// Esta línea sirve para declarar el servicio que verifica tokens de Firebase.
class FirebaseTokenVerifier
{
    // Esta línea sirve para declarar el método que verifica un token y devuelve sus datos.
    public function verify(string $idToken): FirebaseTokenClaims
    {
        // Esta línea sirve para leer las credenciales de Firebase de la configuración.
        $credentials = config('services.firebase.credentials');

        // Esta línea sirve para revisar si faltan las credenciales.
        if (! $credentials) {
            // Esta línea sirve para lanzar un error porque Firebase no está configurado.
            throw new RuntimeException(
                // Esta línea sirve para escribir la primera parte del mensaje de error.
                'Firebase no está configurado en el backend (falta FIREBASE_CREDENTIALS). '
                // Esta línea sirve para completar el mensaje de error.
                .'El login social no puede verificarse hasta que se configure la service account.'
            );
        }

        // Esta línea sirve para crear la fábrica de Firebase con la cuenta de servicio.
        $factory = (new Factory)->withServiceAccount($credentials);

        // Esta línea sirve para revisar si hay un id de proyecto configurado.
        if ($projectId = config('services.firebase.project_id')) {
            // Esta línea sirve para usar ese id de proyecto.
            $factory = $factory->withProjectId($projectId);
        }

        // Esta línea sirve para intentar verificar el token.
        try {
            // Esta línea sirve para verificar firma, expiración, issuer y audience del token.
            $verified = $factory->createAuth()->verifyIdToken($idToken);
            // Esta línea sirve para capturar cualquier error de verificación.
        } catch (Throwable $e) {
            // Esta línea sirve para lanzar el error de token inválido o expirado.
            throw new InvalidFirebaseTokenException('Token de Firebase inválido o expirado.', previous: $e);
        }

        // Esta línea sirve para obtener los datos (claims) del token verificado.
        $claims = $verified->claims();

        // Esta línea sirve para devolver los datos del token.
        return new FirebaseTokenClaims(
            // Esta línea sirve para pasar el uid (claim "sub").
            uid: (string) $claims->get('sub'),
            // Esta línea sirve para pasar el correo.
            email: $claims->get('email'),
            // Esta línea sirve para pasar si el correo está verificado.
            emailVerified: (bool) $claims->get('email_verified', false),
            // Esta línea sirve para pasar el nombre.
            name: $claims->get('name'),
            // Esta línea sirve para pasar la foto.
            picture: $claims->get('picture'),
        );
    }
}
