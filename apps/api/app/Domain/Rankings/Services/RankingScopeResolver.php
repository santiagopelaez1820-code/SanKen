<?php

namespace App\Domain\Rankings\Services;

use App\Models\UserProfile;

/**
 * Determina a qué "bucket" (país/ciudad) pertenece un usuario para el
 * ranking por ejercicio (ver GetExerciseRankingAction) — puro y sin
 * Eloquent en el cuerpo (salvo leer atributos ya cargados de $profile) para
 * que sea testeable sin DB.
 *
 * Recortado (Bloque 5, Fase 3): antes tenía 7 dimensiones (incluía
 * gym/age_bracket/sex/strength_category) para alimentar un ranking general
 * por volumen de entrenamiento que ya no existe — el único ranking hoy es
 * por ejercicio y basado en PRs aprobados, filtrado por país/ciudad/sexo.
 * sex ya no es una dimensión que se "resuelve" acá (el bucket propio del
 * usuario) sino un filtro explícito que el que consulta elige — ver
 * GetExerciseRankingAction::matchesScope / matchesSex.
 */
final class RankingScopeResolver
{
    /**
     * @return array{global: null, city: ?string, country: ?string}
     */
    public function resolve(?UserProfile $profile): array
    {
        return [
            'global' => null,
            'city' => $profile?->city_id ? (string) $profile->city_id : null,
            'country' => $profile?->city?->country_id ? (string) $profile->city->country_id : null,
        ];
    }
}
