<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres del manejo de archivos multimedia.

namespace App\Infrastructure\Media;

/**
 * Todas las columnas de la base que guardan multimedia, con el destino de
 * Cloudinary de cada fila. Es la lista que recorre `media:cloudinary`.
 *
 * Las que se suben desde la app (MediaStorage::store) son avatar_url,
 * products.image, exercises.video_url y pr_submissions.video_url. Las demás
 * son campos de texto donde un admin pega un link: solo se migran si
 * alguien dejó ahí una ruta "/storage/..." de este servidor; los links
 * externos se respetan tal cual.
 */
// Esta línea sirve para declarar la clase con la lista de columnas que guardan archivos.
final class MediaColumns
{
    /**
     * @return list<array{table: string, column: string, slot: callable(int): MediaSlot}>
     */
    // Esta línea sirve para declarar el método que devuelve todas esas columnas.
    public static function all(): array
    {
        // Esta línea sirve para devolver la lista.
        return [
            // Esta línea sirve para incluir la foto de perfil de los usuarios.
            ['table' => 'users', 'column' => 'avatar_url', 'slot' => fn (int $id) => MediaSlot::avatar($id)],
            // Esta línea sirve para incluir la imagen de los productos.
            ['table' => 'products', 'column' => 'image', 'slot' => fn (int $id) => MediaSlot::productImage($id)],
            // Esta línea sirve para incluir el video de los ejercicios.
            ['table' => 'exercises', 'column' => 'video_url', 'slot' => fn (int $id) => MediaSlot::exerciseVideo($id)],
            // Esta línea sirve para incluir la imagen de los ejercicios.
            ['table' => 'exercises', 'column' => 'image_url', 'slot' => fn (int $id) => MediaSlot::exerciseImage($id)],
            // Esta línea sirve para incluir el video de las postulaciones de PR.
            ['table' => 'pr_submissions', 'column' => 'video_url', 'slot' => fn (int $id) => MediaSlot::prSubmissionVideo($id)],
            // Esta línea sirve para incluir la imagen de las noticias.
            ['table' => 'news_promotions', 'column' => 'image_url', 'slot' => fn (int $id) => MediaSlot::newsImage($id)],
            // Esta línea sirve para incluir la foto de progreso de las medidas corporales.
            ['table' => 'body_measurements', 'column' => 'progress_photo_url', 'slot' => fn (int $id) => MediaSlot::progressPhoto($id)],
            // Esta línea sirve para incluir la foto de perfil de los perfiles de usuario.
            ['table' => 'user_profiles', 'column' => 'avatar_url', 'slot' => fn (int $id) => MediaSlot::profileAvatar($id)],
        ];
    }
}
