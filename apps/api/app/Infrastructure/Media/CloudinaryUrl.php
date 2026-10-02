<?php

namespace App\Infrastructure\Media;

/**
 * Lee resource_type y public_id de un secure_url de Cloudinary tal como lo
 * devuelve una subida:
 *   https://res.cloudinary.com/{cloud}/{image|video}/upload/v{n}/{public_id}.{ext}
 * Solo acepta URLs de NUESTRA cuenta — cualquier otra cosa devuelve null.
 */
final class CloudinaryUrl
{
    /**
     * @return array{public_id: string, resource_type: string}|null
     */
    public static function parse(?string $url, string $cloudName): ?array
    {
        if (! $url || $cloudName === '') {
            return null;
        }

        $pattern = '#^https://res\.cloudinary\.com/'.preg_quote($cloudName, '#')
            .'/(image|video)/upload/(?:v\d+/)?(.+?)(?:\.[A-Za-z0-9]+)?$#';

        if (! preg_match($pattern, $url, $matches)) {
            return null;
        }

        return ['resource_type' => $matches[1], 'public_id' => $matches[2]];
    }

    public static function isCloudinary(?string $url): bool
    {
        return is_string($url) && str_starts_with($url, 'https://res.cloudinary.com/');
    }
}
