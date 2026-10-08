<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los seeders.

namespace Database\Seeders;

// Esta línea sirve para importar el trait compartido de las plantillas de rutina.
use Database\Seeders\Concerns\SeedsRoutineTemplates;
// Esta línea sirve para importar la clase base de los seeders.
use Illuminate\Database\Seeder;

/**
 * Nivel "beginner" — mismas 8 combinaciones (sexo x frecuencia) y misma
 * estructura de días/split que RoutineTemplateIntermediateSeeder, pero con
 * ejercicios propios: solo catálogo etiquetado `level=beginner` (máquinas,
 * mancuernas, cables, banda, peso corporal simple) — sin barra libre ni
 * movimientos de alto nivel técnico (peso muerto, sentadilla con barra,
 * dominadas, fondos en paralelas, etc., reservados para el nivel avanzado).
 */
// Esta línea sirve para declarar el seeder de plantillas de rutina de este nivel.
class RoutineTemplateBeginnerSeeder extends Seeder
{
    // Esta línea sirve para usar la lógica compartida de las plantillas de rutina.
    use SeedsRoutineTemplates;

    // Esta línea sirve para definir el nivel de estas plantillas (beginner).
    private const LEVEL = 'beginner';

    // Esta línea sirve para declarar el método que ejecuta el seeder.
    public function run(): void
    {
        // Esta línea sirve para cargar los ids de los ejercicios.
        $this->loadExerciseIds();
        // Esta línea sirve para crear las 8 plantillas de este nivel.
        $this->seedAllCombos(self::LEVEL);
    }

    // ---- Bloques de día ----

    // Esta línea sirve para declarar el bloque de empuje A.
    private function pushA(): array
    {
        // Esta línea sirve para devolver los pares de ejercicio principal y alternativo.
        return [
            // Esta línea sirve para agregar "Press banca con mancuernas" con "Press de pecho en máquina" como alternativa.
            ['Press banca con mancuernas', 'Press de pecho en máquina'],
            // Esta línea sirve para agregar "Press inclinado con mancuernas" con "Press inclinado en máquina" como alternativa.
            ['Press inclinado con mancuernas', 'Press inclinado en máquina'],
            // Esta línea sirve para agregar "Aperturas con mancuernas" con "Aperturas en máquina" como alternativa.
            ['Aperturas con mancuernas', 'Aperturas en máquina'],
            // Esta línea sirve para agregar "Press de hombro con mancuernas" con "Press de hombro en máquina" como alternativa.
            ['Press de hombro con mancuernas', 'Press de hombro en máquina'],
            // Esta línea sirve para agregar "Elevaciones laterales" con "Elevaciones frontales" como alternativa.
            ['Elevaciones laterales', 'Elevaciones frontales'],
            // Esta línea sirve para agregar "Extensión de tríceps con mancuerna" con "Tríceps en máquina" como alternativa.
            ['Extensión de tríceps con mancuerna', 'Tríceps en máquina'],
            // Esta línea sirve para agregar "Patada de tríceps" con "Extensión de tríceps en polea" como alternativa.
            ['Patada de tríceps', 'Extensión de tríceps en polea'],
        ];
    }

    // Esta línea sirve para declarar el bloque de tirón A.
    private function pullA(): array
    {
        // Esta línea sirve para devolver los pares de ejercicio principal y alternativo.
        return [
            // Esta línea sirve para agregar "Jalón al pecho" con "Jalón en polea alta" como alternativa.
            ['Jalón al pecho', 'Jalón en polea alta'],
            // Esta línea sirve para agregar "Remo en polea sentado" con "Remo con mancuerna a una mano" como alternativa.
            ['Remo en polea sentado', 'Remo con mancuerna a una mano'],
            // Esta línea sirve para agregar "Remo con banda de resistencia" con "Jalón en polea con agarre cerrado" como alternativa.
            ['Remo con banda de resistencia', 'Jalón en polea con agarre cerrado'],
            // Esta línea sirve para agregar "Face pull" con "Pájaros (deltoide posterior)" como alternativa.
            ['Face pull', 'Pájaros (deltoide posterior)'],
            // Esta línea sirve para agregar "Curl de bíceps con mancuernas" con "Curl en polea" como alternativa.
            ['Curl de bíceps con mancuernas', 'Curl en polea'],
            // Esta línea sirve para agregar "Curl martillo" con "Curl predicador con mancuerna en banco" como alternativa.
            ['Curl martillo', 'Curl predicador con mancuerna en banco'],
        ];
    }

    // Esta línea sirve para declarar el bloque de pierna A para hombres.
    private function legsMaleA(): array
    {
        // Esta línea sirve para devolver los pares de ejercicio principal y alternativo.
        return [
            // Esta línea sirve para agregar "Sentadilla goblet" con "Sentadilla en Smith" como alternativa.
            ['Sentadilla goblet', 'Sentadilla en Smith'],
            // Esta línea sirve para agregar "Prensa de piernas" con "Prensa horizontal" como alternativa.
            ['Prensa de piernas', 'Prensa horizontal'],
            // Esta línea sirve para agregar "Extensión de cuádriceps" sin alternativa.
            ['Extensión de cuádriceps', null],
            // Esta línea sirve para agregar "Curl femoral" con "Femoral sentado en máquina" como alternativa.
            ['Curl femoral', 'Femoral sentado en máquina'],
            // Esta línea sirve para agregar "Peso muerto rumano con mancuernas" sin alternativa.
            ['Peso muerto rumano con mancuernas', null],
            // Esta línea sirve para agregar "Abducción de cadera en máquina" con "Abducción en polea" como alternativa.
            ['Abducción de cadera en máquina', 'Abducción en polea'],
            // Esta línea sirve para agregar "Elevación de talones de pie" con "Elevación de talones sentado" como alternativa.
            ['Elevación de talones de pie', 'Elevación de talones sentado'],
        ];
    }

    // Esta línea sirve para declarar el bloque de pierna A para mujeres.
    private function legsFemaleA(): array
    {
        // Esta línea sirve para devolver los pares de ejercicio principal y alternativo.
        return [
            // Esta línea sirve para agregar "Hip Thrust en máquina" con "Puente de glúteos" como alternativa.
            ['Hip Thrust en máquina', 'Puente de glúteos'],
            // Esta línea sirve para agregar "Sentadilla goblet" con "Sentadilla en Smith" como alternativa.
            ['Sentadilla goblet', 'Sentadilla en Smith'],
            // Esta línea sirve para agregar "Prensa de piernas" con "Prensa horizontal" como alternativa.
            ['Prensa de piernas', 'Prensa horizontal'],
            // Esta línea sirve para agregar "Extensión de cuádriceps" sin alternativa.
            ['Extensión de cuádriceps', null],
            // Esta línea sirve para agregar "Curl femoral" con "Femoral sentado en máquina" como alternativa.
            ['Curl femoral', 'Femoral sentado en máquina'],
            // Esta línea sirve para agregar "Peso muerto rumano con mancuernas" sin alternativa.
            ['Peso muerto rumano con mancuernas', null],
            // Esta línea sirve para agregar "Patada de glúteo en polea" con "Patada de glúteo en máquina" como alternativa.
            ['Patada de glúteo en polea', 'Patada de glúteo en máquina'],
            // Esta línea sirve para agregar "Abducción de cadera en máquina" con "Abducción en polea" como alternativa.
            ['Abducción de cadera en máquina', 'Abducción en polea'],
            // Esta línea sirve para agregar "Elevación de talones de pie" con "Elevación de talones sentado" como alternativa.
            ['Elevación de talones de pie', 'Elevación de talones sentado'],
        ];
    }

    // Esta línea sirve para declarar el bloque de tren superior A para hombres.
    private function upperMaleA(): array
    {
        // Esta línea sirve para devolver los pares de ejercicio principal y alternativo.
        return [
            // Esta línea sirve para agregar "Press banca con mancuernas" con "Press de pecho en máquina" como alternativa.
            ['Press banca con mancuernas', 'Press de pecho en máquina'],
            // Esta línea sirve para agregar "Press inclinado con mancuernas" con "Press inclinado en máquina" como alternativa.
            ['Press inclinado con mancuernas', 'Press inclinado en máquina'],
            // Esta línea sirve para agregar "Aperturas con mancuernas" con "Aperturas en máquina" como alternativa.
            ['Aperturas con mancuernas', 'Aperturas en máquina'],
            // Esta línea sirve para agregar "Jalón al pecho" con "Jalón en polea alta" como alternativa.
            ['Jalón al pecho', 'Jalón en polea alta'],
            // Esta línea sirve para agregar "Remo en polea sentado" con "Remo con mancuerna a una mano" como alternativa.
            ['Remo en polea sentado', 'Remo con mancuerna a una mano'],
            // Esta línea sirve para agregar "Press de hombro con mancuernas" con "Press de hombro en máquina" como alternativa.
            ['Press de hombro con mancuernas', 'Press de hombro en máquina'],
            // Esta línea sirve para agregar "Elevaciones laterales" con "Elevaciones frontales" como alternativa.
            ['Elevaciones laterales', 'Elevaciones frontales'],
            // Esta línea sirve para agregar "Curl predicador en máquina" con "Curl predicador con mancuerna en banco" como alternativa.
            ['Curl predicador en máquina', 'Curl predicador con mancuerna en banco'],
            // Esta línea sirve para agregar "Extensión de tríceps con mancuerna" con "Tríceps en máquina" como alternativa.
            ['Extensión de tríceps con mancuerna', 'Tríceps en máquina'],
        ];
    }

    // Esta línea sirve para declarar el bloque de tren inferior A para hombres.
    private function lowerMaleA(): array
    {
        // Esta línea sirve para devolver los pares de ejercicio principal y alternativo.
        return [
            // Esta línea sirve para agregar "Sentadilla goblet" con "Sentadilla en Smith" como alternativa.
            ['Sentadilla goblet', 'Sentadilla en Smith'],
            // Esta línea sirve para agregar "Prensa de piernas" con "Prensa horizontal" como alternativa.
            ['Prensa de piernas', 'Prensa horizontal'],
            // Esta línea sirve para agregar "Extensión de cuádriceps" sin alternativa.
            ['Extensión de cuádriceps', null],
            // Esta línea sirve para agregar "Curl femoral" con "Femoral sentado en máquina" como alternativa.
            ['Curl femoral', 'Femoral sentado en máquina'],
            // Esta línea sirve para agregar "Peso muerto rumano con mancuernas" sin alternativa.
            ['Peso muerto rumano con mancuernas', null],
            // Esta línea sirve para agregar "Hip Thrust en máquina" con "Puente de glúteos" como alternativa.
            ['Hip Thrust en máquina', 'Puente de glúteos'],
            // Esta línea sirve para agregar "Abducción de cadera en máquina" con "Abducción en polea" como alternativa.
            ['Abducción de cadera en máquina', 'Abducción en polea'],
            // Esta línea sirve para agregar "Aductores en máquina" sin alternativa.
            ['Aductores en máquina', null],
            // Esta línea sirve para agregar "Elevación de talones de pie" con "Elevación de talones sentado" como alternativa.
            ['Elevación de talones de pie', 'Elevación de talones sentado'],
        ];
    }

    // Esta línea sirve para declarar el bloque de tren superior B para hombres.
    private function upperMaleB(): array
    {
        // Esta línea sirve para devolver los pares de ejercicio principal y alternativo.
        return [
            // Esta línea sirve para agregar "Press inclinado en máquina" con "Press inclinado con mancuernas" como alternativa.
            ['Press inclinado en máquina', 'Press inclinado con mancuernas'],
            // Esta línea sirve para agregar "Press de pecho en máquina" con "Press banca con mancuernas" como alternativa.
            ['Press de pecho en máquina', 'Press banca con mancuernas'],
            // Esta línea sirve para agregar "Aperturas en máquina" con "Aperturas con mancuernas" como alternativa.
            ['Aperturas en máquina', 'Aperturas con mancuernas'],
            // Esta línea sirve para agregar "Jalón en polea con agarre cerrado" con "Jalón en polea alta" como alternativa.
            ['Jalón en polea con agarre cerrado', 'Jalón en polea alta'],
            // Esta línea sirve para agregar "Remo con mancuerna a una mano" con "Remo en polea sentado" como alternativa.
            ['Remo con mancuerna a una mano', 'Remo en polea sentado'],
            // Esta línea sirve para agregar "Press de hombro en máquina" con "Press de hombro con mancuernas" como alternativa.
            ['Press de hombro en máquina', 'Press de hombro con mancuernas'],
            // Esta línea sirve para agregar "Elevaciones frontales" con "Elevaciones laterales" como alternativa.
            ['Elevaciones frontales', 'Elevaciones laterales'],
            // Esta línea sirve para agregar "Pájaros (deltoide posterior)" con "Face pull" como alternativa.
            ['Pájaros (deltoide posterior)', 'Face pull'],
            // Esta línea sirve para agregar "Curl de bíceps con mancuernas" con "Curl en polea" como alternativa.
            ['Curl de bíceps con mancuernas', 'Curl en polea'],
            // Esta línea sirve para agregar "Patada de tríceps" con "Extensión de tríceps en polea" como alternativa.
            ['Patada de tríceps', 'Extensión de tríceps en polea'],
        ];
    }

    // Esta línea sirve para declarar el bloque de tren inferior B para hombres.
    private function lowerMaleB(): array
    {
        // Esta línea sirve para devolver los pares de ejercicio principal y alternativo.
        return [
            // Esta línea sirve para agregar "Sentadilla en Smith" con "Sentadilla goblet" como alternativa.
            ['Sentadilla en Smith', 'Sentadilla goblet'],
            // Esta línea sirve para agregar "Prensa horizontal" con "Prensa de piernas" como alternativa.
            ['Prensa horizontal', 'Prensa de piernas'],
            // Esta línea sirve para agregar "Extensión de cuádriceps" sin alternativa.
            ['Extensión de cuádriceps', null],
            // Esta línea sirve para agregar "Femoral sentado en máquina" con "Curl femoral" como alternativa.
            ['Femoral sentado en máquina', 'Curl femoral'],
            // Esta línea sirve para agregar "Peso muerto rumano con mancuernas" sin alternativa.
            ['Peso muerto rumano con mancuernas', null],
            // Esta línea sirve para agregar "Puente de glúteos" con "Hip Thrust en máquina" como alternativa.
            ['Puente de glúteos', 'Hip Thrust en máquina'],
            // Esta línea sirve para agregar "Abducción en polea" con "Abducción de cadera en máquina" como alternativa.
            ['Abducción en polea', 'Abducción de cadera en máquina'],
            // Esta línea sirve para agregar "Aductores en máquina" sin alternativa.
            ['Aductores en máquina', null],
            // Esta línea sirve para agregar "Elevación de talones sentado" con "Elevación de talones de pie" como alternativa.
            ['Elevación de talones sentado', 'Elevación de talones de pie'],
        ];
    }

    // Esta línea sirve para declarar el bloque de tren inferior A para mujeres.
    private function lowerFemaleA(): array
    {
        // Esta línea sirve para devolver los pares de ejercicio principal y alternativo.
        return [
            // Esta línea sirve para agregar "Hip Thrust en máquina" con "Puente de glúteos" como alternativa.
            ['Hip Thrust en máquina', 'Puente de glúteos'],
            // Esta línea sirve para agregar "Sentadilla goblet" con "Sentadilla en Smith" como alternativa.
            ['Sentadilla goblet', 'Sentadilla en Smith'],
            // Esta línea sirve para agregar "Prensa de piernas" con "Prensa horizontal" como alternativa.
            ['Prensa de piernas', 'Prensa horizontal'],
            // Esta línea sirve para agregar "Peso muerto rumano con mancuernas" sin alternativa.
            ['Peso muerto rumano con mancuernas', null],
            // Esta línea sirve para agregar "Curl femoral" con "Femoral sentado en máquina" como alternativa.
            ['Curl femoral', 'Femoral sentado en máquina'],
            // Esta línea sirve para agregar "Patada de glúteo en máquina" con "Patada de glúteo en polea" como alternativa.
            ['Patada de glúteo en máquina', 'Patada de glúteo en polea'],
            // Esta línea sirve para agregar "Abducción de cadera en máquina" con "Abducción en polea" como alternativa.
            ['Abducción de cadera en máquina', 'Abducción en polea'],
            // Esta línea sirve para agregar "Elevación de talones de pie" con "Elevación de talones sentado" como alternativa.
            ['Elevación de talones de pie', 'Elevación de talones sentado'],
        ];
    }

    // Esta línea sirve para declarar el bloque de tren superior A para mujeres.
    private function upperFemaleA(): array
    {
        // Esta línea sirve para devolver los pares de ejercicio principal y alternativo.
        return [
            // Esta línea sirve para agregar "Jalón al pecho" con "Jalón en polea alta" como alternativa.
            ['Jalón al pecho', 'Jalón en polea alta'],
            // Esta línea sirve para agregar "Remo en polea sentado" con "Remo con mancuerna a una mano" como alternativa.
            ['Remo en polea sentado', 'Remo con mancuerna a una mano'],
            // Esta línea sirve para agregar "Press banca con mancuernas" con "Press de pecho en máquina" como alternativa.
            ['Press banca con mancuernas', 'Press de pecho en máquina'],
            // Esta línea sirve para agregar "Press inclinado con mancuernas" con "Press inclinado en máquina" como alternativa.
            ['Press inclinado con mancuernas', 'Press inclinado en máquina'],
            // Esta línea sirve para agregar "Elevaciones laterales" con "Elevaciones frontales" como alternativa.
            ['Elevaciones laterales', 'Elevaciones frontales'],
            // Esta línea sirve para agregar "Pájaros (deltoide posterior)" con "Face pull" como alternativa.
            ['Pájaros (deltoide posterior)', 'Face pull'],
            // Esta línea sirve para agregar "Curl predicador en máquina" con "Curl en polea" como alternativa.
            ['Curl predicador en máquina', 'Curl en polea'],
            // Esta línea sirve para agregar "Extensión de tríceps en polea" con "Tríceps en máquina" como alternativa.
            ['Extensión de tríceps en polea', 'Tríceps en máquina'],
        ];
    }

    // Esta línea sirve para declarar el bloque de tren inferior B para mujeres.
    private function lowerFemaleB(): array
    {
        // Esta línea sirve para devolver los pares de ejercicio principal y alternativo.
        return [
            // Esta línea sirve para agregar "Puente de glúteos" con "Hip Thrust en máquina" como alternativa.
            ['Puente de glúteos', 'Hip Thrust en máquina'],
            // Esta línea sirve para agregar "Peso muerto rumano con mancuernas" sin alternativa.
            ['Peso muerto rumano con mancuernas', null],
            // Esta línea sirve para agregar "Zancadas" con "Sentadilla con kettlebell" como alternativa.
            ['Zancadas', 'Sentadilla con kettlebell'],
            // Esta línea sirve para agregar "Extensión de cuádriceps" sin alternativa.
            ['Extensión de cuádriceps', null],
            // Esta línea sirve para agregar "Femoral sentado en máquina" con "Curl femoral" como alternativa.
            ['Femoral sentado en máquina', 'Curl femoral'],
            // Esta línea sirve para agregar "Patada de glúteo en polea" con "Patada de glúteo en máquina" como alternativa.
            ['Patada de glúteo en polea', 'Patada de glúteo en máquina'],
            // Esta línea sirve para agregar "Abducción de cadera en máquina" con "Abducción en polea" como alternativa.
            ['Abducción de cadera en máquina', 'Abducción en polea'],
            // Esta línea sirve para agregar "Aductores en máquina" sin alternativa.
            ['Aductores en máquina', null],
            // Esta línea sirve para agregar "Elevación de talones de pie" con "Elevación de talones sentado" como alternativa.
            ['Elevación de talones de pie', 'Elevación de talones sentado'],
        ];
    }
}
