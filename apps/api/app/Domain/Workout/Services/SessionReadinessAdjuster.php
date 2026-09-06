<?php

namespace App\Domain\Workout\Services;

use App\Domain\Workout\ValueObjects\SessionAdjustment;

/**
 * Traduce el precheck pre-entrenamiento (sleep_quality/energy_level/
 * muscle_soreness, escala 1-5 cada uno) + el nivel del usuario en un recorte
 * puntual para la sesión de HOY — series, peso sugerido y RPE objetivo.
 *
 * No genera una rutina nueva ni toca routine_exercises: el ajuste se aplica
 * una sola vez, al copiar los ejercicios a workout_exercises en
 * StartWorkoutSessionAction, así que la rutina de base y la progresión de
 * las próximas semanas quedan intactas.
 *
 * El nivel modula qué tan agresivo es el recorte: un principiante tiene
 * menos control técnico bajo fatiga (más riesgo de lesión, y una mala
 * sesión temprano pesa más en si abandona o no), así que se lo protege
 * incluso ante una sola señal de baja recuperación. Un avanzado ya sabe
 * autorregular su propio esfuerzo día a día, así que con una sola señal
 * el recorte es mínimo — recién se vuelve notorio cuando hay 2 o más.
 */
final class SessionReadinessAdjuster
{
    private const LOW_SLEEP_THRESHOLD = 2;

    private const LOW_ENERGY_THRESHOLD = 2;

    private const HIGH_SORENESS_THRESHOLD = 4;

    private const MIN_RPE = 5.0;

    /**
     * @param  array{sleep_quality?: int|null, energy_level?: int|null, muscle_soreness?: int|null}  $precheck
     */
    public function adjustmentFor(array $precheck, string $level): SessionAdjustment
    {
        $reasons = $this->lowReadinessReasons($precheck);

        if ($reasons === []) {
            return SessionAdjustment::none();
        }

        $strong = count($reasons) >= 2;

        [$setsDelta, $weightMultiplier, $rpeDelta] = match ($level) {
            'beginner' => $strong ? [-1, 0.80, -1.5] : [-1, 0.90, -1.0],
            'advanced' => $strong ? [-1, 0.90, -1.0] : [0, 0.95, -0.5],
            default => $strong ? [-1, 0.85, -1.0] : [0, 0.92, -0.5], // intermediate
        };

        return new SessionAdjustment(
            setsDelta: $setsDelta,
            weightMultiplier: $weightMultiplier,
            rpeDelta: $rpeDelta,
            note: $this->buildNote($reasons, $setsDelta),
        );
    }

    public function applySets(int $targetSets, SessionAdjustment $adjustment): int
    {
        return max(1, $targetSets + $adjustment->setsDelta);
    }

    /**
     * @param  int[]|null  $repsPerSet
     * @return int[]|null
     */
    public function applyRepsPerSet(?array $repsPerSet, int $newTargetSets): ?array
    {
        return $repsPerSet === null ? null : array_slice($repsPerSet, 0, $newTargetSets);
    }

    public function applyWeight(?float $weightKg, SessionAdjustment $adjustment): ?float
    {
        return $weightKg === null ? null : round($weightKg * $adjustment->weightMultiplier, 2);
    }

    public function applyRpe(?float $rpe, SessionAdjustment $adjustment): ?float
    {
        return $rpe === null ? null : max(self::MIN_RPE, $rpe + $adjustment->rpeDelta);
    }

    /**
     * @param  array{sleep_quality?: int|null, energy_level?: int|null, muscle_soreness?: int|null}  $precheck
     * @return string[]
     */
    private function lowReadinessReasons(array $precheck): array
    {
        $reasons = [];

        if (($precheck['sleep_quality'] ?? null) !== null && $precheck['sleep_quality'] <= self::LOW_SLEEP_THRESHOLD) {
            $reasons[] = 'dormiste poco';
        }

        if (($precheck['energy_level'] ?? null) !== null && $precheck['energy_level'] <= self::LOW_ENERGY_THRESHOLD) {
            $reasons[] = 'tenés poca energía';
        }

        if (($precheck['muscle_soreness'] ?? null) !== null && $precheck['muscle_soreness'] >= self::HIGH_SORENESS_THRESHOLD) {
            $reasons[] = 'tenés bastante dolor muscular';
        }

        return $reasons;
    }

    /**
     * @param  string[]  $reasons
     */
    private function buildNote(array $reasons, int $setsDelta): string
    {
        $changes = $setsDelta < 0 ? 'series y peso' : 'peso';

        return 'Ajustamos tu entrenamiento de hoy porque '.$this->joinReasons($reasons)
            .": bajamos {$changes} un poco para cuidarte. En tu próxima sesión volvés a tu plan normal.";
    }

    /**
     * @param  string[]  $reasons
     */
    private function joinReasons(array $reasons): string
    {
        if (count($reasons) <= 1) {
            return $reasons[0] ?? '';
        }

        $last = array_pop($reasons);

        return implode(', ', $reasons).' y '.$last;
    }
}
