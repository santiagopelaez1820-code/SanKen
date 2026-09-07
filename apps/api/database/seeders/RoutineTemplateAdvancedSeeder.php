<?php

namespace Database\Seeders;

use Database\Seeders\Concerns\SeedsRoutineTemplates;
use Illuminate\Database\Seeder;

/**
 * Nivel "advanced" — mismas 8 combinaciones (sexo x frecuencia) y misma
 * estructura de días/split que RoutineTemplateIntermediateSeeder, pero
 * apoyada en catálogo `level=advanced` (peso muerto, sentadilla con barra,
 * dominadas, fondos en paralelas, sentadilla frontal/sissy, buenos días) más
 * ejercicios `intermediate` de barra libre/técnica exigente (press banca con
 * barra, remo con barra, press militar, etc.). Los accesorios sin equivalente
 * avanzado en el catálogo (curl femoral, pantorrilla, abducción/aducción)
 * se mantienen como en los otros niveles — no tiene sentido dificultar
 * artificialmente un aislamiento que ya cumple su función.
 */
class RoutineTemplateAdvancedSeeder extends Seeder
{
    use SeedsRoutineTemplates;

    private const LEVEL = 'advanced';

    public function run(): void
    {
        $this->loadExerciseIds();
        $this->seedAllCombos(self::LEVEL);
    }

    // ---- Bloques de día ----

    private function pushA(): array
    {
        return [
            ['Press banca con barra', 'Press inclinado con barra'],
            ['Fondos en paralelas', 'Press cerrado'],
            ['Cruce de poleas', null],
            ['Press militar con barra', 'Press Arnold'],
            ['Elevaciones laterales en polea', null],
            ['Press francés', 'Rompecráneos a dos manos con mancuerna'],
            ['Katana en polea', null],
        ];
    }

    private function pullA(): array
    {
        return [
            ['Dominadas', 'Jalón en polea con agarre cerrado'],
            ['Remo con barra', 'Remo en T'],
            ['Pull over en polea', null],
            ['Vuelos posteriores en polea', null],
            ['Curl bayesiano en polea', 'Curl bayesiano con mancuerna en banco'],
            ['Curl en banco Scott', null],
        ];
    }

    private function legsMaleA(): array
    {
        return [
            ['Sentadilla con barra', 'Sentadilla Hack'],
            ['Sentadilla Sissy', 'Extensión de cuádriceps'],
            ['Buenos días', 'Peso muerto rumano en Smith'],
            ['Curl femoral', 'Femoral sentado en máquina'],
            ['Hip thrust', 'Hip Thrust en máquina'],
            ['Abducción de cadera en máquina', null],
            ['Elevación de talones de pie', null],
        ];
    }

    private function legsFemaleA(): array
    {
        return [
            ['Hip thrust', 'Hip Thrust en máquina'],
            ['Sentadilla con barra', 'Sentadilla Hack'],
            ['Peso muerto rumano con barra', 'Peso muerto rumano en Smith'],
            ['Sentadilla búlgara', 'Zancada en Smith'],
            ['Extensión de cuádriceps', 'Sentadilla Sissy'],
            ['Curl femoral', 'Femoral sentado en máquina'],
            ['Buenos días', null],
            ['Abducción de cadera en máquina', 'Abducción en polea'],
            ['Elevación de talones de pie', 'Elevación de talones sentado'],
        ];
    }

    private function upperMaleA(): array
    {
        return [
            ['Press banca con barra', 'Press inclinado con barra'],
            ['Fondos en paralelas', 'Press cerrado'],
            ['Cruce de poleas', null],
            ['Dominadas', 'Jalón en polea con agarre cerrado'],
            ['Remo con barra', 'Remo en T'],
            ['Press militar con barra', 'Press Arnold'],
            ['Elevaciones laterales en polea', null],
            ['Curl en banco Scott', 'Curl bayesiano en polea'],
            ['Press francés', 'Rompecráneos a dos manos con mancuerna'],
        ];
    }

    private function lowerMaleA(): array
    {
        return [
            ['Sentadilla con barra', 'Sentadilla Hack'],
            ['Sentadilla frontal', 'Sentadilla Sissy'],
            ['Extensión de cuádriceps', null],
            ['Curl femoral', 'Femoral sentado en máquina'],
            ['Peso muerto rumano con barra', 'Peso muerto rumano en Smith'],
            ['Hip thrust', 'Hip Thrust en máquina'],
            ['Buenos días', null],
            ['Abducción de cadera en máquina', null],
            ['Elevación de talones de pie', 'Elevación de talones sentado'],
        ];
    }

    private function upperMaleB(): array
    {
        return [
            ['Press inclinado con barra', 'Press banca con barra'],
            ['Press cerrado', 'Fondos en paralelas'],
            ['Jalón en polea con agarre cerrado', 'Dominadas'],
            ['Remo en T', 'Remo con barra'],
            ['Pull over en polea', null],
            ['Press Arnold', 'Press militar con barra'],
            ['Elevaciones laterales en polea', null],
            ['Vuelos posteriores en polea', null],
            ['Curl bayesiano en polea', 'Curl bayesiano con mancuerna en banco'],
            ['Katana en polea', 'Press francés'],
        ];
    }

    private function lowerMaleB(): array
    {
        return [
            ['Sentadilla Hack', 'Sentadilla con barra'],
            ['Sentadilla Sissy', 'Extensión de cuádriceps'],
            ['Femoral sentado en máquina', 'Curl femoral'],
            ['Peso muerto rumano en Smith', 'Peso muerto rumano con barra'],
            ['Buenos días', null],
            ['Hip Thrust en máquina', 'Hip thrust'],
            ['Abducción en polea', 'Abducción de cadera en máquina'],
            ['Aductores en máquina', null],
            ['Elevación de talones sentado', 'Elevación de talones de pie'],
        ];
    }

    private function lowerFemaleA(): array
    {
        return [
            ['Hip thrust', 'Hip Thrust en máquina'],
            ['Sentadilla con barra', 'Sentadilla Hack'],
            ['Peso muerto rumano con barra', 'Peso muerto rumano en Smith'],
            ['Extensión de cuádriceps', 'Sentadilla Sissy'],
            ['Curl femoral', 'Femoral sentado en máquina'],
            ['Buenos días', null],
            ['Abducción de cadera en máquina', 'Abducción en polea'],
            ['Elevación de talones de pie', 'Elevación de talones sentado'],
        ];
    }

    private function upperFemaleA(): array
    {
        return [
            ['Dominadas', 'Jalón en polea con agarre cerrado'],
            ['Remo con barra', 'Remo en T'],
            ['Press banca con barra', 'Press inclinado con barra'],
            ['Cruce de poleas', null],
            ['Elevaciones laterales en polea', null],
            ['Vuelos posteriores en polea', null],
            ['Curl en banco Scott', 'Curl bayesiano en polea'],
            ['Press francés', 'Katana en polea'],
        ];
    }

    private function lowerFemaleB(): array
    {
        return [
            ['Hip Thrust en máquina', 'Hip thrust'],
            ['Peso muerto rumano con barra', 'Peso muerto rumano en Smith'],
            ['Sentadilla búlgara', 'Zancada en Smith'],
            ['Sentadilla Sissy', 'Extensión de cuádriceps'],
            ['Femoral sentado en máquina', 'Curl femoral'],
            ['Buenos días', null],
            ['Abducción de cadera en máquina', 'Abducción en polea'],
            ['Aductores en máquina', null],
            ['Elevación de talones de pie', 'Elevación de talones sentado'],
        ];
    }
}
