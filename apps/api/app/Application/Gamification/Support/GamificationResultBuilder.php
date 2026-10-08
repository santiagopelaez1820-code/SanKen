<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de soporte de gamificación.

namespace App\Application\Gamification\Support;

// Esta línea sirve para importar el modelo Achievement (logro).
use App\Models\Achievement;

/**
 * Mezcla el resultado base de AwardXpAction con los logros recién
 * desbloqueados (cada uno con su propio otorgamiento de XP) en un solo
 * payload — el que viaja en meta.gamification de la respuesta HTTP.
 */
// Esta línea sirve para declarar la clase que combina la XP y los logros en un solo resultado.
final class GamificationResultBuilder
{
    /**
     * @param  array{total_xp: int, xp_awarded: int, leveled_up: bool, previous_level: int, new_level: int}  $base
     * @param  array<int, array{achievement: Achievement, xp_result: array{total_xp: int, xp_awarded: int, leveled_up: bool, previous_level: int, new_level: int}}>  $unlocked
     * @return array{xp_awarded: int, leveled_up: bool, new_level: int, achievements_unlocked: array<int, array{code: string, name: string, description: string, xp_bonus: int}>}
     */
    // Esta línea sirve para declarar el método estático que mezcla el resultado base con los logros.
    public static function merge(array $base, array $unlocked): array
    {
        // Esta línea sirve para tomar la XP otorgada por el entrenamiento.
        $xpAwarded = $base['xp_awarded'];
        // Esta línea sirve para tomar si subió de nivel.
        $leveledUp = $base['leveled_up'];
        // Esta línea sirve para tomar el nivel nuevo.
        $newLevel = $base['new_level'];

        // Esta línea sirve para recorrer cada logro recién desbloqueado.
        foreach ($unlocked as $entry) {
            // Esta línea sirve para sumar la XP que otorgó ese logro.
            $xpAwarded += $entry['xp_result']['xp_awarded'];
            // Esta línea sirve para marcar subida de nivel si ese logro también hizo subir.
            $leveledUp = $leveledUp || $entry['xp_result']['leveled_up'];
            // Esta línea sirve para quedarse con el nivel más alto alcanzado.
            $newLevel = max($newLevel, $entry['xp_result']['new_level']);
        }

        // Esta línea sirve para devolver el resultado combinado.
        return [
            // Esta línea sirve para incluir la XP total otorgada.
            'xp_awarded' => $xpAwarded,
            // Esta línea sirve para incluir si subió de nivel.
            'leveled_up' => $leveledUp,
            // Esta línea sirve para incluir el nivel final.
            'new_level' => $newLevel,
            // Esta línea sirve para incluir la lista de logros desbloqueados con sus datos.
            'achievements_unlocked' => array_map(static fn (array $entry) => [
                // Esta línea sirve para incluir el código del logro.
                'code' => $entry['achievement']->code,
                // Esta línea sirve para incluir el nombre del logro.
                'name' => $entry['achievement']->name,
                // Esta línea sirve para incluir la descripción del logro.
                'description' => $entry['achievement']->description,
                // Esta línea sirve para incluir la XP extra que da el logro.
                'xp_bonus' => $entry['achievement']->xp_bonus,
                // Esta línea sirve para terminar la lista indicando que se arma a partir de los logros desbloqueados.
            ], $unlocked),
        ];
    }
}
