<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres del manejo de archivos multimedia.

namespace App\Infrastructure\Media;

/**
 * Destino de un archivo multimedia: dónde vive cada cosa, en un solo lugar.
 *
 * Cada recurso tiene un public_id ESTABLE derivado de su fila (user_12,
 * product_7…): reemplazar la foto de un usuario sobrescribe el mismo asset
 * en Cloudinary en vez de acumular huérfanos, y la URL nueva cambia de
 * versión (/v123/) así que ningún cliente ve la imagen vieja cacheada.
 *
 * `localDirectory` es la carpeta del disco 'public' que se usa cuando
 * Cloudinary no está configurado (dev/tests) — la misma de siempre.
 */
// Esta línea sirve para declarar la clase que define dónde se guarda cada archivo multimedia.
final class MediaSlot
{
    // Esta línea sirve para declarar el constructor privado (solo se crea con los métodos de abajo).
    private function __construct(
        /** Carpeta dentro de la raíz de Cloudinary (config services.cloudinary.folder). */
        // Esta línea sirve para guardar la carpeta dentro de la raíz de Cloudinary.
        public readonly string $folder,
        // Esta línea sirve para guardar el nombre del archivo (estable por fila).
        public readonly string $name,
        /** 'image' | 'video' — el resource_type de Cloudinary. */
        // Esta línea sirve para guardar el tipo de archivo de Cloudinary (image o video).
        public readonly string $resourceType,
        // Esta línea sirve para guardar la carpeta del disco local que se usa sin Cloudinary.
        public readonly string $localDirectory,
    ) {}

    // Esta línea sirve para declarar el destino de la foto de perfil de un usuario.
    public static function avatar(int $userId): self
    {
        // Esta línea sirve para crear el destino en users/avatars con el nombre user_{id}.
        return new self('users/avatars', "user_{$userId}", 'image', 'avatars');
    }

    /** Columna heredada user_profiles.avatar_url (la app usa users.avatar_url). */
    // Esta línea sirve para declarar el destino de la foto heredada de user_profiles.
    public static function profileAvatar(int $profileId): self
    {
        // Esta línea sirve para crear el destino en users/avatars con el nombre profile_{id}.
        return new self('users/avatars', "profile_{$profileId}", 'image', 'avatars');
    }

    // Esta línea sirve para declarar el destino de la imagen de un producto.
    public static function productImage(int $productId): self
    {
        // Esta línea sirve para crear el destino en store/products con el nombre product_{id}.
        return new self('store/products', "product_{$productId}", 'image', 'product-images');
    }

    // Esta línea sirve para declarar el destino del video de un ejercicio.
    public static function exerciseVideo(int $exerciseId): self
    {
        // Esta línea sirve para crear el destino en exercises/videos con el nombre exercise_{id}.
        return new self('exercises/videos', "exercise_{$exerciseId}", 'video', 'exercise-videos');
    }

    // Esta línea sirve para declarar el destino de la imagen de un ejercicio.
    public static function exerciseImage(int $exerciseId): self
    {
        // Esta línea sirve para crear el destino en exercises/images con el nombre exercise_{id}.
        return new self('exercises/images', "exercise_{$exerciseId}", 'image', 'exercise-images');
    }

    // Esta línea sirve para declarar el destino del video de una postulación de PR.
    public static function prSubmissionVideo(int $submissionId): self
    {
        // Esta línea sirve para crear el destino en pr-submissions/videos con el nombre submission_{id}.
        return new self('pr-submissions/videos', "submission_{$submissionId}", 'video', 'pr-submission-videos');
    }

    // Esta línea sirve para declarar el destino de la imagen de una noticia.
    public static function newsImage(int $newsId): self
    {
        // Esta línea sirve para crear el destino en content/news con el nombre news_{id}.
        return new self('content/news', "news_{$newsId}", 'image', 'news-images');
    }

    // Esta línea sirve para declarar el destino de la foto de progreso de una medida corporal.
    public static function progressPhoto(int $measurementId): self
    {
        // Esta línea sirve para crear el destino en users/progress-photos con el nombre measurement_{id}.
        return new self('users/progress-photos', "measurement_{$measurementId}", 'image', 'progress-photos');
    }

    /** public_id completo, ej. "sanken/users/avatars/user_12". */
    // Esta línea sirve para declarar el método que arma el public_id completo.
    public function publicId(string $rootFolder): string
    {
        // Esta línea sirve para unir la carpeta raíz, la carpeta y el nombre.
        return trim($rootFolder, '/')."/{$this->folder}/{$this->name}";
    }
}
