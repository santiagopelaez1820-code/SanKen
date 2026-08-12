<?php

namespace App\Domain\Rankings\Services;

use App\Models\UserProfile;

/**
 * Determina a qué "bucket" pertenece un usuario para cada una de las 7
 * vistas de ranking (Sprint 9). Puro y sin Eloquent en el cuerpo (salvo leer
 * atributos ya cargados de $profile) para que sea testeable sin DB y para
 * que tanto el job de recálculo como el endpoint de lectura (que necesita
 * saber el bucket del usuario que consulta) compartan una única fuente de
 * verdad.
 */
final class RankingScopeResolver
{
    /**
     * @return array{global: null, city: ?string, country: ?string, gym: ?string, age_bracket: ?string, sex: ?string, strength_category: ?string}
     */
    public function resolve(?UserProfile $profile, ?float $bestOneRepMax): array
    {
        return [
            'global' => null,
            'city' => $profile?->city_id ? (string) $profile->city_id : null,
            'country' => $profile?->city?->country_id ? (string) $profile->city->country_id : null,
            'gym' => $profile?->gym_id ? (string) $profile->gym_id : null,
            'age_bracket' => $this->resolveAgeBracket($profile?->age),
            'sex' => in_array($profile?->sex, ['male', 'female'], true) ? $profile->sex : null,
            'strength_category' => $this->resolveStrengthCategory(
                $profile?->weight_kg !== null ? (float) $profile->weight_kg : null,
                $bestOneRepMax,
            ),
        ];
    }

    private function resolveAgeBracket(?int $age): ?string
    {
        if ($age === null || $age < 18) {
            return null;
        }

        foreach (config('rankings.age_brackets') as $bracket) {
            if ($age >= $bracket['min'] && ($bracket['max'] === null || $age <= $bracket['max'])) {
                return $bracket['label'];
            }
        }

        return null;
    }

    private function resolveStrengthCategory(?float $weightKg, ?float $bestOneRepMax): ?string
    {
        if (! $weightKg || ! $bestOneRepMax || $bestOneRepMax <= 0) {
            return null;
        }

        $ratio = $bestOneRepMax / $weightKg;

        foreach (config('rankings.strength_tiers') as $tier) {
            if ($tier['max_ratio'] === null || $ratio < $tier['max_ratio']) {
                return $tier['label'];
            }
        }

        return null;
    }
}
