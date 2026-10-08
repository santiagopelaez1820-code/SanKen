<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de la integración con Firebase.

namespace App\Infrastructure\Firebase;

// Esta línea sirve para importar la fachada Log para escribir en el log.
use Illuminate\Support\Facades\Log;
// Esta línea sirve para importar la fábrica del SDK de Firebase.
use Kreait\Firebase\Factory;
// Esta línea sirve para importar Throwable para capturar cualquier error.
use Throwable;

/**
 * Borra el usuario de Firebase Authentication vinculado a una cuenta de
 * SanKen que se elimina (login con Google). Best-effort: si Firebase no está
 * configurado o falla, la cuenta de SanKen se elimina igual — no se puede
 * dejar a alguien sin poder borrar su cuenta por un problema del proveedor —
 * y queda registrado en el log para resolverlo a mano.
 */
// Esta línea sirve para declarar el servicio que borra usuarios de Firebase.
class FirebaseUserDeleter
{
    // Esta línea sirve para declarar el método que borra un usuario de Firebase y devuelve si lo logró.
    public function delete(string $firebaseUid): bool
    {
        // Esta línea sirve para leer las credenciales de Firebase de la configuración.
        $credentials = config('services.firebase.credentials');

        // Esta línea sirve para revisar si faltan las credenciales.
        if (! $credentials) {
            // Esta línea sirve para registrar una advertencia en el log.
            Log::warning('No se borró el usuario de Firebase: falta FIREBASE_CREDENTIALS.', ['firebase_uid' => $firebaseUid]);

            // Esta línea sirve para devolver que no se borró.
            return false;
        }

        // Esta línea sirve para intentar borrar el usuario.
        try {
            // Esta línea sirve para crear la fábrica de Firebase con la cuenta de servicio.
            $factory = (new Factory)->withServiceAccount($credentials);

            // Esta línea sirve para revisar si hay un id de proyecto configurado.
            if ($projectId = config('services.firebase.project_id')) {
                // Esta línea sirve para usar ese id de proyecto.
                $factory = $factory->withProjectId($projectId);
            }

            // Esta línea sirve para borrar el usuario en Firebase Authentication.
            $factory->createAuth()->deleteUser($firebaseUid);

            // Esta línea sirve para devolver que se borró.
            return true;
            // Esta línea sirve para capturar cualquier error.
        } catch (Throwable $e) {
            // Esta línea sirve para registrar una advertencia con el error en el log.
            Log::warning('No se pudo borrar el usuario de Firebase.', ['firebase_uid' => $firebaseUid, 'error' => $e->getMessage()]);

            // Esta línea sirve para devolver que no se borró.
            return false;
        }
    }
}
