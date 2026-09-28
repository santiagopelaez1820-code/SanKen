<?php

namespace App\Application\Auth\Actions;

use App\Http\Controllers\Concerns\ReplacesPublicFile;
use App\Infrastructure\Firebase\FirebaseUserDeleter;
use App\Models\PrSubmission;
use App\Models\User;
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
class DeleteOwnAccountAction
{
    use ReplacesPublicFile;

    public function __construct(
        private readonly FirebaseUserDeleter $firebase,
    ) {}

    public function execute(User $user): void
    {
        $files = array_filter([
            $user->avatar_url,
            ...PrSubmission::query()->where('user_id', $user->id)->pluck('video_url')->all(),
            ...$user->bodyMeasurements()->pluck('progress_photo_url')->all(),
        ]);
        $firebaseUid = $user->firebase_uid;

        DB::transaction(function () use ($user) {
            $user->tokens()->delete();
            $user->delete();
        });

        // Después del commit: si el borrado de la fila fallara, los archivos
        // no se pierden.
        foreach ($files as $url) {
            $this->deletePublicFileByUrl($url);
        }

        if ($firebaseUid) {
            $this->firebase->delete($firebaseUid);
        }
    }
}
