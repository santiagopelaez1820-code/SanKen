<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las acciones de autenticación.

namespace App\Application\Auth\Actions;

// Esta línea sirve para importar la clase que borra usuarios de Firebase.
use App\Infrastructure\Firebase\FirebaseUserDeleter;
// Esta línea sirve para importar la interfaz de almacenamiento de archivos (Cloudinary o disco).
use App\Infrastructure\Media\MediaStorage;
// Esta línea sirve para importar el modelo PrSubmission (postulaciones de récords).
use App\Models\PrSubmission;
// Esta línea sirve para importar el modelo User (usuario).
use App\Models\User;
// Esta línea sirve para importar la fachada DB para usar transacciones.
use Illuminate\Support\Facades\DB;

/**
 * Eliminación de la cuenta por el propio usuario (derecho de supresión;
 * también lo exigen App Store / Google Play para apps con registro).
 *
 * Todas las FKs hacia `users` son cascadeOnDelete o nullOnDelete, así que
 * borrar la fila elimina perfil, onboarding, rutinas, entrenamientos,
 * medidas, nutrición, récords, chat, notificaciones, pedidos, tokens de push
 * y consentimientos. Acá se limpia además lo que vive FUERA de la base de
 * datos: archivos subidos (foto, videos de récords, fotos de progreso) y el
 * usuario de Firebase si inició sesión con Google.
 */
// Esta línea sirve para declarar la acción que elimina la cuenta del propio usuario.
class DeleteOwnAccountAction
{
    // Esta línea sirve para declarar el constructor que recibe sus dependencias.
    public function __construct(
        // Esta línea sirve para recibir el servicio que borra usuarios de Firebase.
        private readonly FirebaseUserDeleter $firebase,
        // Esta línea sirve para recibir el servicio de almacenamiento de archivos.
        private readonly MediaStorage $media,
    ) {}

    // Esta línea sirve para declarar el método que elimina la cuenta del usuario recibido.
    public function execute(User $user): void
    {
        // Esta línea sirve para armar la lista de archivos del usuario a borrar (sin valores vacíos).
        $files = array_filter([
            // Esta línea sirve para incluir la foto de perfil.
            $user->avatar_url,
            // Esta línea sirve para incluir los videos de sus postulaciones de récords.
            ...PrSubmission::query()->where('user_id', $user->id)->pluck('video_url')->all(),
            // Esta línea sirve para incluir las fotos de progreso de sus medidas corporales.
            ...$user->bodyMeasurements()->pluck('progress_photo_url')->all(),
        ]);
        // Esta línea sirve para guardar el id de Firebase antes de borrar al usuario.
        $firebaseUid = $user->firebase_uid;

        // Esta línea sirve para borrar los datos dentro de una transacción.
        DB::transaction(function () use ($user) {
            // Esta línea sirve para revocar todos los tokens de acceso del usuario.
            $user->tokens()->delete();
            // Esta línea sirve para borrar al usuario (la base de datos borra en cascada sus datos).
            $user->delete();
        });

        // Después del commit: si el borrado de la fila fallara, los archivos
        // no se pierden.
        // Esta línea sirve para recorrer los archivos del usuario.
        foreach ($files as $url) {
            // Esta línea sirve para borrar cada archivo del almacenamiento.
            $this->media->delete($url);
        }

        // Esta línea sirve para revisar si el usuario tenía cuenta en Firebase (login con Google).
        if ($firebaseUid) {
            // Esta línea sirve para borrar el usuario de Firebase.
            $this->firebase->delete($firebaseUid);
        }
    }
}
