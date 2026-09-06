<?php

namespace Database\Seeders;

use Database\Seeders\Concerns\SeedsRoutineTemplates;
use Illuminate\Database\Seeder;

/**
 * Nivel "beginner" — mismas 8 combinaciones (sexo x frecuencia) y misma
 * estructura de días/split que RoutineTemplateIntermediateSeeder, pero con
 * ejercicios propios: solo catálogo etiquetado `level=beginner` (máquinas,
 * mancuernas, cables, banda, peso corporal simple) — sin barra libre ni
 * movimientos de alto nivel técnico (peso muerto, sentadilla con barra,
 * dominadas, fondos en paralelas, etc., reservados para el nivel avanzado).
 */
class RoutineTemplateBeginnerSeeder extends Seeder
{
    use SeedsRoutineTemplates;

    private const LEVEL = 'beginner';

    public function run(): void
    {
        $this->loadExerciseIds();

        $pushA = $this->pushA();
        $pullA = $this->pullA();
        $legsMaleA = $this->legsMaleA();
        $legsFemaleA = $this->legsFemaleA();
        $upperMaleA = $this->upperMaleA();
        $lowerMaleA = $this->lowerMaleA();
        $upperMaleB = $this->upperMaleB();
        $lowerMaleB = $this->lowerMaleB();
        $lowerFemaleA = $this->lowerFemaleA();
        $upperFemaleA = $this->upperFemaleA();
        $lowerFemaleB = $this->lowerFemaleB();

        // -------- 3 días (push_pull_legs) --------
        $this->makeTemplate('male', 3, self::LEVEL, 'push_pull_legs', [
            ['Empuje', $pushA],
            ['Tirón', $pullA],
            ['Pierna', $legsMaleA],
        ]);
        $this->makeTemplate('female', 3, self::LEVEL, 'push_pull_legs', [
            ['Empuje', $pushA],
            ['Tirón', $pullA],
            ['Pierna', $legsFemaleA],
        ]);

        // -------- 4 días (upper_lower) --------
        $this->makeTemplate('male', 4, self::LEVEL, 'upper_lower', [
            ['Tren Superior A', $upperMaleA],
            ['Tren Inferior A', $lowerMaleA],
            ['Tren Superior B', $upperMaleB],
            ['Tren Inferior B', $lowerMaleB],
        ]);
        $this->makeTemplate('female', 4, self::LEVEL, 'upper_lower', [
            ['Tren Inferior A', $lowerFemaleA],
            ['Tren Superior', $upperFemaleA],
            ['Tren Inferior B', $lowerFemaleB],
            ['Tren Superior', $upperMaleB],
        ]);

        // -------- 5 días (híbrido PPL + Upper/Lower) --------
        $this->makeTemplate('male', 5, self::LEVEL, 'ppl_upper_lower', [
            ['Empuje', $pushA],
            ['Tirón', $pullA],
            ['Pierna', $legsMaleA],
            ['Tren Superior', $upperMaleA],
            ['Tren Inferior', $lowerMaleA],
        ]);
        $this->makeTemplate('female', 5, self::LEVEL, 'ppl_upper_lower', [
            ['Tren Inferior', $legsFemaleA],
            ['Tren Superior', $upperFemaleA],
            ['Tren Inferior', $lowerFemaleB],
            ['Tren Superior', $upperMaleB],
            ['Tren Inferior', $legsFemaleA],
        ]);

        // -------- 6 días (PPL x2) --------
        $this->makeTemplate('male', 6, self::LEVEL, 'push_pull_legs', [
            ['Empuje A', $pushA],
            ['Tirón A', $pullA],
            ['Pierna A', $legsMaleA],
            ['Empuje B', $this->swap($pushA)],
            ['Tirón B', $this->swap($pullA)],
            ['Pierna B', $this->swap($legsMaleA)],
        ]);
        $this->makeTemplate('female', 6, self::LEVEL, 'push_pull_legs', [
            ['Empuje A', $pushA],
            ['Tirón A', $pullA],
            ['Pierna A', $legsFemaleA],
            ['Empuje B', $this->swap($pushA)],
            ['Tirón B', $this->swap($pullA)],
            ['Pierna B', $lowerFemaleB],
        ]);
    }

    // ---- Bloques de día ----

    private function pushA(): array
    {
        return [
            ['Press banca con mancuernas', 'Press de pecho en máquina'],
            ['Press inclinado con mancuernas', 'Press inclinado en máquina'],
            ['Aperturas con mancuernas', 'Aperturas en máquina'],
            ['Press de hombro con mancuernas', 'Press de hombro en máquina'],
            ['Elevaciones laterales', 'Elevaciones frontales'],
            ['Extensión de tríceps con mancuerna', 'Tríceps en máquina'],
            ['Patada de tríceps', 'Extensión de tríceps en polea'],
        ];
    }

    private function pullA(): array
    {
        return [
            ['Jalón al pecho', 'Jalón en polea alta'],
            ['Remo en polea sentado', 'Remo con mancuerna a una mano'],
            ['Remo con banda de resistencia', 'Jalón en polea con agarre cerrado'],
            ['Face pull', 'Pájaros (deltoide posterior)'],
            ['Curl de bíceps con mancuernas', 'Curl en polea'],
            ['Curl martillo', 'Curl predicador con mancuerna en banco'],
        ];
    }

    private function legsMaleA(): array
    {
        return [
            ['Sentadilla goblet', 'Sentadilla en Smith'],
            ['Prensa de piernas', 'Prensa horizontal'],
            ['Extensión de cuádriceps', null],
            ['Curl femoral', 'Femoral sentado en máquina'],
            ['Peso muerto rumano con mancuernas', null],
            ['Abducción de cadera en máquina', 'Abducción en polea'],
            ['Elevación de talones de pie', 'Elevación de talones sentado'],
        ];
    }

    private function legsFemaleA(): array
    {
        return [
            ['Hip Thrust en máquina', 'Puente de glúteos'],
            ['Sentadilla goblet', 'Sentadilla en Smith'],
            ['Prensa de piernas', 'Prensa horizontal'],
            ['Extensión de cuádriceps', null],
            ['Curl femoral', 'Femoral sentado en máquina'],
            ['Peso muerto rumano con mancuernas', null],
            ['Patada de glúteo en polea', 'Patada de glúteo en máquina'],
            ['Abducción de cadera en máquina', 'Abducción en polea'],
            ['Elevación de talones de pie', 'Elevación de talones sentado'],
        ];
    }

    private function upperMaleA(): array
    {
        return [
            ['Press banca con mancuernas', 'Press de pecho en máquina'],
            ['Press inclinado con mancuernas', 'Press inclinado en máquina'],
            ['Aperturas con mancuernas', 'Aperturas en máquina'],
            ['Jalón al pecho', 'Jalón en polea alta'],
            ['Remo en polea sentado', 'Remo con mancuerna a una mano'],
            ['Press de hombro con mancuernas', 'Press de hombro en máquina'],
            ['Elevaciones laterales', 'Elevaciones frontales'],
            ['Curl predicador en máquina', 'Curl predicador con mancuerna en banco'],
            ['Extensión de tríceps con mancuerna', 'Tríceps en máquina'],
        ];
    }

    private function lowerMaleA(): array
    {
        return [
            ['Sentadilla goblet', 'Sentadilla en Smith'],
            ['Prensa de piernas', 'Prensa horizontal'],
            ['Extensión de cuádriceps', null],
            ['Curl femoral', 'Femoral sentado en máquina'],
            ['Peso muerto rumano con mancuernas', null],
            ['Hip Thrust en máquina', 'Puente de glúteos'],
            ['Abducción de cadera en máquina', 'Abducción en polea'],
            ['Aductores en máquina', null],
            ['Elevación de talones de pie', 'Elevación de talones sentado'],
        ];
    }

    private function upperMaleB(): array
    {
        return [
            ['Press inclinado en máquina', 'Press inclinado con mancuernas'],
            ['Press de pecho en máquina', 'Press banca con mancuernas'],
            ['Aperturas en máquina', 'Aperturas con mancuernas'],
            ['Jalón en polea con agarre cerrado', 'Jalón en polea alta'],
            ['Remo con mancuerna a una mano', 'Remo en polea sentado'],
            ['Press de hombro en máquina', 'Press de hombro con mancuernas'],
            ['Elevaciones frontales', 'Elevaciones laterales'],
            ['Pájaros (deltoide posterior)', 'Face pull'],
            ['Curl de bíceps con mancuernas', 'Curl en polea'],
            ['Patada de tríceps', 'Extensión de tríceps en polea'],
        ];
    }

    private function lowerMaleB(): array
    {
        return [
            ['Sentadilla en Smith', 'Sentadilla goblet'],
            ['Prensa horizontal', 'Prensa de piernas'],
            ['Extensión de cuádriceps', null],
            ['Femoral sentado en máquina', 'Curl femoral'],
            ['Peso muerto rumano con mancuernas', null],
            ['Puente de glúteos', 'Hip Thrust en máquina'],
            ['Abducción en polea', 'Abducción de cadera en máquina'],
            ['Aductores en máquina', null],
            ['Elevación de talones sentado', 'Elevación de talones de pie'],
        ];
    }

    private function lowerFemaleA(): array
    {
        return [
            ['Hip Thrust en máquina', 'Puente de glúteos'],
            ['Sentadilla goblet', 'Sentadilla en Smith'],
            ['Prensa de piernas', 'Prensa horizontal'],
            ['Peso muerto rumano con mancuernas', null],
            ['Curl femoral', 'Femoral sentado en máquina'],
            ['Patada de glúteo en máquina', 'Patada de glúteo en polea'],
            ['Abducción de cadera en máquina', 'Abducción en polea'],
            ['Elevación de talones de pie', 'Elevación de talones sentado'],
        ];
    }

    private function upperFemaleA(): array
    {
        return [
            ['Jalón al pecho', 'Jalón en polea alta'],
            ['Remo en polea sentado', 'Remo con mancuerna a una mano'],
            ['Press banca con mancuernas', 'Press de pecho en máquina'],
            ['Press inclinado con mancuernas', 'Press inclinado en máquina'],
            ['Elevaciones laterales', 'Elevaciones frontales'],
            ['Pájaros (deltoide posterior)', 'Face pull'],
            ['Curl predicador en máquina', 'Curl en polea'],
            ['Extensión de tríceps en polea', 'Tríceps en máquina'],
        ];
    }

    private function lowerFemaleB(): array
    {
        return [
            ['Puente de glúteos', 'Hip Thrust en máquina'],
            ['Peso muerto rumano con mancuernas', null],
            ['Zancadas', 'Sentadilla con kettlebell'],
            ['Extensión de cuádriceps', null],
            ['Femoral sentado en máquina', 'Curl femoral'],
            ['Patada de glúteo en polea', 'Patada de glúteo en máquina'],
            ['Abducción de cadera en máquina', 'Abducción en polea'],
            ['Aductores en máquina', null],
            ['Elevación de talones de pie', 'Elevación de talones sentado'],
        ];
    }
}
