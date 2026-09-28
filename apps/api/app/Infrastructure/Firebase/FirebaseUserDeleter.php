<?php

namespace App\Infrastructure\Firebase;

use Illuminate\Support\Facades\Log;
use Kreait\Firebase\Factory;
use Throwable;

/**
 * Borra el usuario de Firebase Authentication vinculado a una cuenta de
 * SanKen que se elimina (login con Google). Best-effort: si Firebase no está
 * configurado o falla, la cuenta de SanKen se elimina igual — no se puede
 * dejar a alguien sin poder borrar su cuenta por un problema del proveedor —
 * y queda registrado en el log para resolverlo a mano.
 */
class FirebaseUserDeleter
{
    public function delete(string $firebaseUid): bool
    {
        $credentials = config('services.firebase.credentials');

        if (! $credentials) {
            Log::warning('No se borró el usuario de Firebase: falta FIREBASE_CREDENTIALS.', ['firebase_uid' => $firebaseUid]);

            return false;
        }

        try {
            $factory = (new Factory())->withServiceAccount($credentials);

            if ($projectId = config('services.firebase.project_id')) {
                $factory = $factory->withProjectId($projectId);
            }

            $factory->createAuth()->deleteUser($firebaseUid);

            return true;
        } catch (Throwable $e) {
            Log::warning('No se pudo borrar el usuario de Firebase.', ['firebase_uid' => $firebaseUid, 'error' => $e->getMessage()]);

            return false;
        }
    }
}
