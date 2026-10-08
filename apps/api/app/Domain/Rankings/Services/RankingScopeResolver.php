<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los servicios de rankings.

namespace App\Domain\Rankings\Services;

// Esta línea sirve para importar el modelo UserProfile (perfil del usuario).
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
// Esta línea sirve para declarar el servicio que resuelve el país y la ciudad del usuario.
final class RankingScopeResolver
{
    /**
     * @return array{global: null, city: ?string, country: ?string}
     */
    // Esta línea sirve para declarar el método que recibe el perfil y devuelve sus ámbitos.
    public function resolve(?UserProfile $profile): array
    {
        // Esta línea sirve para devolver los ámbitos del usuario.
        return [
            // Esta línea sirve para dejar el ámbito global sin valor.
            'global' => null,
            // Esta línea sirve para devolver la ciudad del usuario como texto, o null.
            'city' => $profile?->city_id ? (string) $profile->city_id : null,
            // Esta línea sirve para devolver el país del usuario como texto, o null.
            'country' => $profile?->city?->country_id ? (string) $profile->city->country_id : null,
        ];
    }
}
