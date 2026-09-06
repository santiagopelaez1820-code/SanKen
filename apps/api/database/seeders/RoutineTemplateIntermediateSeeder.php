<?php

namespace Database\Seeders;

use Database\Seeders\Concerns\SeedsRoutineTemplates;
use Illuminate\Database\Seeder;

/**
 * Nivel "intermediate" — contenido ORIGINAL de las 8 plantillas curadas
 * (sexo x frecuencia) que existían antes de que el motor distinguiera por
 * nivel; se deja intacto porque ya es una buena línea base intermedia (ver
 * plan "Rutinas personalizadas por nivel"). RoutineTemplateBeginnerSeeder y
 * RoutineTemplateAdvancedSeeder son sus contrapartes más simple/más
 * exigente, con ejercicios propios.
 *
 * Los bloques de día (pushA, pullA, etc.) se definen una sola vez y se
 * reutilizan/combinan para las 8 plantillas, tal como pide la especificación
 * original para los splits de 5 y 6 días (reutilizar la estructura de 3/4
 * días en vez de inventar una rutina distinta).
 */
class RoutineTemplateIntermediateSeeder extends Seeder
{
    use SeedsRoutineTemplates;

    private const LEVEL = 'intermediate';

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
            ['Tren Superior', $upperMaleB], // misma filosofía de Upper B masculino, ver seccion 11
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
            ['Press inclinado con mancuernas', 'Press inclinado en máquina'],
            ['Press de pecho en máquina', 'Press banca con barra'],
            ['Aperturas en máquina', 'Cruce de poleas'],
            ['Press de hombro en máquina', 'Press de hombro con mancuernas'],
            ['Elevaciones laterales en polea', 'Elevaciones laterales'],
            ['Extensión de tríceps en polea', 'Tríceps en máquina'],
            ['Katana en polea', 'Rompecráneos a dos manos con mancuerna'],
        ];
    }

    private function pullA(): array
    {
        return [
            ['Jalón en polea alta', 'Jalón al pecho'],
            ['Remo en T', 'Remo en polea sentado'],
            ['Pull over en polea', 'Jalón en polea con agarre cerrado'],
            ['Vuelos posteriores en polea', 'Pájaros (deltoide posterior)'],
            ['Curl bayesiano en polea', 'Curl bayesiano con mancuerna en banco'],
            ['Curl predicador en máquina', 'Curl predicador con mancuerna en banco'],
        ];
    }

    private function legsMaleA(): array
    {
        return [
            ['Sentadilla en Smith', 'Sentadilla Hack'],
            ['Extensión de cuádriceps', 'Sentadilla Sissy'],
            ['Curl femoral', 'Femoral sentado en máquina'],
            ['Peso muerto rumano con mancuernas', 'Peso muerto rumano con barra'],
            ['Abducción de cadera en máquina', null],
            ['Aductores en máquina', null],
            ['Pantorrilla sentado en prensa', null],
        ];
    }

    private function legsFemaleA(): array
    {
        return [
            ['Hip Thrust en máquina', 'Hip thrust'],
            ['Sentadilla en Smith', 'Sentadilla Hack'],
            ['Prensa de piernas', 'Prensa horizontal'],
            ['Extensión de cuádriceps', 'Sentadilla Sissy'],
            ['Curl femoral', 'Femoral sentado en máquina'],
            ['Peso muerto rumano con mancuernas', 'Peso muerto rumano en Smith'],
            ['Patada de glúteo en polea', 'Patada de glúteo en máquina'],
            ['Abducción de cadera en máquina', 'Abducción en polea'],
            ['Pantorrilla sentado en prensa', 'Elevación de talones de pie'],
        ];
    }

    private function upperMaleA(): array
    {
        return [
            ['Press inclinado con mancuernas', 'Press inclinado en máquina'],
            ['Press de pecho en máquina', 'Press banca con barra'],
            ['Aperturas en máquina', 'Cruce de poleas'],
            ['Jalón en polea alta', 'Jalón al pecho'],
            ['Remo en T', 'Remo en polea sentado'],
            ['Press de hombro en máquina', 'Press de hombro con mancuernas'],
            ['Elevaciones laterales en polea', 'Elevaciones laterales'],
            ['Curl predicador en máquina', 'Curl predicador con mancuerna en banco'],
            ['Extensión de tríceps en polea', 'Tríceps en máquina'],
        ];
    }

    private function lowerMaleA(): array
    {
        return [
            ['Sentadilla en Smith', 'Sentadilla Hack'],
            ['Prensa de piernas', 'Prensa horizontal'],
            ['Extensión de cuádriceps', 'Sentadilla Sissy'],
            ['Curl femoral', 'Femoral sentado en máquina'],
            ['Peso muerto rumano con mancuernas', 'Peso muerto rumano en Smith'],
            ['Hip Thrust en máquina', 'Hip thrust'],
            ['Abducción de cadera en máquina', 'Abducción en polea'],
            ['Aductores en máquina', null],
            ['Pantorrilla sentado en prensa', 'Elevación de talones de pie'],
        ];
    }

    private function upperMaleB(): array
    {
        return [
            ['Press inclinado en máquina', 'Press inclinado con barra'],
            ['Press banca con mancuernas', 'Press de pecho en máquina'],
            ['Cruce de poleas', 'Aperturas en máquina'],
            ['Jalón en polea con agarre cerrado', 'Pull over en polea'],
            ['Remo en polea sentado', 'Remo en T'],
            ['Press de hombro con mancuernas', 'Press de hombro en máquina'],
            ['Elevaciones laterales', 'Elevaciones laterales en polea'],
            ['Pájaros (deltoide posterior)', 'Vuelos posteriores en polea'],
            ['Curl bayesiano en polea', 'Curl bayesiano con mancuerna en banco'],
            ['Katana en polea', 'Rompecráneos a dos manos con mancuerna'],
        ];
    }

    private function lowerMaleB(): array
    {
        return [
            ['Sentadilla Hack', 'Sentadilla en Smith'],
            ['Prensa horizontal', 'Prensa de piernas'],
            ['Extensión de cuádriceps', null],
            ['Femoral sentado en máquina', 'Curl femoral'],
            ['Peso muerto rumano en Smith', 'Peso muerto rumano con mancuernas'],
            ['Puente de glúteos', 'Hip Thrust en máquina'],
            ['Abducción en polea', 'Abducción de cadera en máquina'],
            ['Aductores en máquina', null],
            ['Elevación de talones de pie', 'Pantorrilla sentado en prensa'],
        ];
    }

    private function lowerFemaleA(): array
    {
        return [
            ['Hip Thrust en máquina', 'Hip thrust'],
            ['Sentadilla en Smith', 'Sentadilla Hack'],
            ['Prensa de piernas', 'Prensa horizontal'],
            ['Peso muerto rumano con mancuernas', 'Peso muerto rumano en Smith'],
            ['Curl femoral', 'Femoral sentado en máquina'],
            ['Patada de glúteo en máquina', 'Patada de glúteo en polea'],
            ['Abducción de cadera en máquina', 'Abducción en polea'],
            ['Elevación de talones de pie', 'Pantorrilla sentado en prensa'],
        ];
    }

    private function upperFemaleA(): array
    {
        return [
            ['Jalón en polea alta', 'Jalón al pecho'],
            ['Remo en T', 'Remo en polea sentado'],
            ['Press inclinado con mancuernas', 'Press inclinado en máquina'],
            ['Press de pecho en máquina', 'Press banca con barra'],
            ['Elevaciones laterales', 'Elevaciones laterales en polea'],
            ['Pájaros (deltoide posterior)', 'Vuelos posteriores en polea'],
            ['Curl predicador en máquina', 'Curl bayesiano en polea'],
            ['Extensión de tríceps en polea', 'Tríceps en máquina'],
        ];
    }

    private function lowerFemaleB(): array
    {
        return [
            ['Puente de glúteos', 'Hip Thrust en máquina'],
            ['Peso muerto rumano con mancuernas', 'Peso muerto rumano en Smith'],
            ['Sentadilla búlgara', 'Zancada en Smith'],
            ['Extensión de cuádriceps', 'Sentadilla Sissy'],
            ['Femoral sentado en máquina', 'Curl femoral'],
            ['Patada de glúteo en polea', 'Patada de glúteo en máquina'],
            ['Abducción de cadera en máquina', 'Abducción en polea'],
            ['Aductores en máquina', null],
            ['Pantorrilla sentado en prensa', 'Elevación de talones de pie'],
        ];
    }
}
