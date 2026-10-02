<?php

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
final class MediaSlot
{
    private function __construct(
        /** Carpeta dentro de la raíz de Cloudinary (config services.cloudinary.folder). */
        public readonly string $folder,
        public readonly string $name,
        /** 'image' | 'video' — el resource_type de Cloudinary. */
        public readonly string $resourceType,
        public readonly string $localDirectory,
    ) {}

    public static function avatar(int $userId): self
    {
        return new self('users/avatars', "user_{$userId}", 'image', 'avatars');
    }

    public static function productImage(int $productId): self
    {
        return new self('store/products', "product_{$productId}", 'image', 'product-images');
    }

    public static function exerciseVideo(int $exerciseId): self
    {
        return new self('exercises/videos', "exercise_{$exerciseId}", 'video', 'exercise-videos');
    }

    public static function exerciseImage(int $exerciseId): self
    {
        return new self('exercises/images', "exercise_{$exerciseId}", 'image', 'exercise-images');
    }

    public static function prSubmissionVideo(int $submissionId): self
    {
        return new self('pr-submissions/videos', "submission_{$submissionId}", 'video', 'pr-submission-videos');
    }

    public static function newsImage(int $newsId): self
    {
        return new self('content/news', "news_{$newsId}", 'image', 'news-images');
    }

    public static function progressPhoto(int $measurementId): self
    {
        return new self('users/progress-photos', "measurement_{$measurementId}", 'image', 'progress-photos');
    }

    /** public_id completo, ej. "sanken/users/avatars/user_12". */
    public function publicId(string $rootFolder): string
    {
        return trim($rootFolder, '/')."/{$this->folder}/{$this->name}";
    }
}
