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
        $this->seedAllCombos(self::LEVEL);
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
