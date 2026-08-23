<?php

namespace App\Domain\Auth\Services;

/**
 * Genera y valida códigos de recuperación de 2FA. Los códigos son valores
 * de alta entropía generados por el servidor (no secretos elegidos por
 * humanos), por lo que se hashean con sha256 en vez de bcrypt — mismo
 * criterio que usa Sanctum para sus personal access tokens.
 */
final class RecoveryCodeService
{
    private const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

    /**
     * @return string[] códigos en texto plano, formato XXXX-XXXX
     */
    public function generate(int $count = 8): array
    {
        return array_map(fn () => $this->generateOne(), range(1, $count));
    }

    public function hash(string $code): string
    {
        return hash('sha256', $this->normalize($code));
    }

    /**
     * @param  string[]  $hashedCodes
     * @return array{matched: bool, remaining: string[]}
     */
    public function verifyAndConsume(array $hashedCodes, string $candidate): array
    {
        $candidateHash = $this->hash($candidate);
        $index = array_search($candidateHash, $hashedCodes, true);

        if ($index === false) {
            return ['matched' => false, 'remaining' => $hashedCodes];
        }

        unset($hashedCodes[$index]);

        return ['matched' => true, 'remaining' => array_values($hashedCodes)];
    }

    private function generateOne(): string
    {
        $raw = '';

        for ($i = 0; $i < 8; $i++) {
            $raw .= self::ALPHABET[random_int(0, strlen(self::ALPHABET) - 1)];
        }

        return substr($raw, 0, 4).'-'.substr($raw, 4, 4);
    }

    private function normalize(string $code): string
    {
        return strtoupper(str_replace('-', '', trim($code)));
    }
}
