<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los servicios de entrenamiento.

namespace App\Domain\Workout\Services;

// Esta línea sirve para importar el objeto que describe el ajuste de la sesión.
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
// Esta línea sirve para declarar el servicio que ajusta la sesión según cómo llega el usuario.
final class SessionReadinessAdjuster
{
    // Esta línea sirve para definir el umbral de sueño bajo (2 o menos).
    private const LOW_SLEEP_THRESHOLD = 2;

    // Esta línea sirve para definir el umbral de energía baja (2 o menos).
    private const LOW_ENERGY_THRESHOLD = 2;

    // Esta línea sirve para definir el umbral de dolor muscular alto (4 o más).
    private const HIGH_SORENESS_THRESHOLD = 4;

    // Esta línea sirve para definir el RPE mínimo permitido (5).
    private const MIN_RPE = 5.0;

    /**
     * @param  array{sleep_quality?: int|null, energy_level?: int|null, muscle_soreness?: int|null}  $precheck
     */
    // Esta línea sirve para declarar el método que calcula el ajuste según el precheck y el nivel.
    public function adjustmentFor(array $precheck, string $level): SessionAdjustment
    {
        // Esta línea sirve para obtener los motivos de baja recuperación.
        $reasons = $this->lowReadinessReasons($precheck);

        // Esta línea sirve para revisar si no hay motivos.
        if ($reasons === []) {
            // Esta línea sirve para devolver un ajuste neutro (sin cambios).
            return SessionAdjustment::none();
        }

        // Esta línea sirve para considerar el ajuste fuerte si hay 2 o más motivos.
        $strong = count($reasons) >= 2;

        // El 4to elemento (`$changes`) describe qué cambió en criollo, a la
        // par de setsDelta/weightMultiplier/rpeDelta en el mismo lugar donde
        // se decide — así buildNote() no tiene que re-derivar "hubo cambio
        // de series" a partir del signo de setsDelta por separado.
        // Esta línea sirve para elegir cuánto recortar según el nivel.
        [$setsDelta, $weightMultiplier, $rpeDelta, $changes] = match ($level) {
            // Esta línea sirve para recortar al principiante series y peso (más fuerte si hay 2+ motivos).
            'beginner' => $strong ? [-1, 0.80, -1.5, 'series y peso'] : [-1, 0.90, -1.0, 'series y peso'],
            // Esta línea sirve para recortar al avanzado lo mínimo (solo peso si hay un solo motivo).
            'advanced' => $strong ? [-1, 0.90, -1.0, 'series y peso'] : [0, 0.95, -0.5, 'peso'],
            // Esta línea sirve para aplicar al intermedio (por defecto) un recorte medio.
            default => $strong ? [-1, 0.85, -1.0, 'series y peso'] : [0, 0.92, -0.5, 'peso'], // intermediate
        };

        // Esta línea sirve para devolver el ajuste calculado.
        return new SessionAdjustment(
            // Esta línea sirve para pasar cuántas series quitar.
            setsDelta: $setsDelta,
            // Esta línea sirve para pasar el multiplicador del peso.
            weightMultiplier: $weightMultiplier,
            // Esta línea sirve para pasar cuánto bajar el RPE.
            rpeDelta: $rpeDelta,
            // Esta línea sirve para pasar la nota que explica el ajuste.
            note: $this->buildNote($reasons, $changes),
        );
    }

    /**
     * Aplica el ajuste a los 4 valores de un ejercicio JUNTOS, en vez de 4
     * métodos sueltos que el caller tenía que invocar en el orden correcto
     * (con el riesgo real de pasarle a applyRepsPerSet el targetSets
     * original en vez del ya ajustado). targetRepsPerSet se recorta acá
     * mismo contra el targetSets YA ajustado, sin que el caller tenga que
     * encadenar el resultado de un método al siguiente.
     *
     * @param  int[]|null  $repsPerSet
     * @return array{targetSets: int, repsPerSet: int[]|null, weightKg: float|null, rpe: float|null}
     */
    // Esta línea sirve para declarar el método que aplica el ajuste a un ejercicio.
    public function adjustExercise(
        // Esta línea sirve para recibir las series objetivo.
        int $targetSets,
        // Esta línea sirve para recibir las repeticiones por serie.
        ?array $repsPerSet,
        // Esta línea sirve para recibir el peso sugerido.
        ?float $weightKg,
        // Esta línea sirve para recibir el RPE objetivo.
        ?float $rpe,
        // Esta línea sirve para recibir el ajuste a aplicar.
        SessionAdjustment $adjustment,
        // Esta línea sirve para indicar que el método devuelve un arreglo.
    ): array {
        // Esta línea sirve para calcular las series nuevas sin bajar de 1.
        $newTargetSets = max(1, $targetSets + $adjustment->setsDelta);

        // Esta línea sirve para devolver los valores ajustados.
        return [
            // Esta línea sirve para incluir las series nuevas.
            'targetSets' => $newTargetSets,
            // Esta línea sirve para recortar las repeticiones por serie a la nueva cantidad de series.
            'repsPerSet' => $repsPerSet === null ? null : array_slice($repsPerSet, 0, $newTargetSets),
            // Esta línea sirve para aplicar el multiplicador al peso.
            'weightKg' => $weightKg === null ? null : round($weightKg * $adjustment->weightMultiplier, 2),
            // Esta línea sirve para bajar el RPE sin pasar del mínimo.
            'rpe' => $rpe === null ? null : max(self::MIN_RPE, $rpe + $adjustment->rpeDelta),
        ];
    }

    /**
     * @param  array{sleep_quality?: int|null, energy_level?: int|null, muscle_soreness?: int|null}  $precheck
     * @return string[]
     */
    // Esta línea sirve para declarar el método privado que detecta los motivos de baja recuperación.
    private function lowReadinessReasons(array $precheck): array
    {
        // Esta línea sirve para iniciar la lista de motivos.
        $reasons = [];

        // Esta línea sirve para revisar si durmió poco.
        if (($precheck['sleep_quality'] ?? null) !== null && $precheck['sleep_quality'] <= self::LOW_SLEEP_THRESHOLD) {
            // Esta línea sirve para agregar el motivo de sueño.
            $reasons[] = 'dormiste poco';
        }

        // Esta línea sirve para revisar si tiene poca energía.
        if (($precheck['energy_level'] ?? null) !== null && $precheck['energy_level'] <= self::LOW_ENERGY_THRESHOLD) {
            // Esta línea sirve para agregar el motivo de energía.
            $reasons[] = 'tenés poca energía';
        }

        // Esta línea sirve para revisar si tiene mucho dolor muscular.
        if (($precheck['muscle_soreness'] ?? null) !== null && $precheck['muscle_soreness'] >= self::HIGH_SORENESS_THRESHOLD) {
            // Esta línea sirve para agregar el motivo de dolor muscular.
            $reasons[] = 'tenés bastante dolor muscular';
        }

        // Esta línea sirve para devolver los motivos encontrados.
        return $reasons;
    }

    /**
     * @param  string[]  $reasons
     */
    // Esta línea sirve para declarar el método privado que arma la nota del ajuste.
    private function buildNote(array $reasons, string $changes): string
    {
        // Esta línea sirve para armar el texto con los motivos.
        return 'Ajustamos tu entrenamiento de hoy porque '.$this->joinReasons($reasons)
            // Esta línea sirve para completar la nota con lo que se recortó.
            .": bajamos {$changes} un poco para cuidarte. En tu próxima sesión volvés a tu plan normal.";
    }

    /**
     * @param  string[]  $reasons
     */
    // Esta línea sirve para declarar el método privado que une los motivos en una frase.
    private function joinReasons(array $reasons): string
    {
        // Esta línea sirve para revisar si hay uno o ningún motivo.
        if (count($reasons) <= 1) {
            // Esta línea sirve para devolver ese motivo (o texto vacío).
            return $reasons[0] ?? '';
        }

        // Esta línea sirve para sacar el último motivo.
        $last = array_pop($reasons);

        // Esta línea sirve para unir los motivos con comas y el último con "y".
        return implode(', ', $reasons).' y '.$last;
    }
}
