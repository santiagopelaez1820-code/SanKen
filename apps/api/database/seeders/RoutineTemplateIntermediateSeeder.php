<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los seeders.

namespace Database\Seeders;

// Esta línea sirve para importar el trait compartido de las plantillas de rutina.
use Database\Seeders\Concerns\SeedsRoutineTemplates;
// Esta línea sirve para importar la clase base de los seeders.
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
// Esta línea sirve para declarar el seeder de plantillas de rutina de este nivel.
class RoutineTemplateIntermediateSeeder extends Seeder
{
    // Esta línea sirve para usar la lógica compartida de las plantillas de rutina.
    use SeedsRoutineTemplates;

    // Esta línea sirve para definir el nivel de estas plantillas (intermediate).
    private const LEVEL = 'intermediate';

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
            // Esta línea sirve para agregar "Press inclinado con mancuernas" con "Press inclinado en máquina" como alternativa.
            ['Press inclinado con mancuernas', 'Press inclinado en máquina'],
            // Esta línea sirve para agregar "Press de pecho en máquina" con "Press banca con barra" como alternativa.
            ['Press de pecho en máquina', 'Press banca con barra'],
            // Esta línea sirve para agregar "Aperturas en máquina" con "Cruce de poleas" como alternativa.
            ['Aperturas en máquina', 'Cruce de poleas'],
            // Esta línea sirve para agregar "Press de hombro en máquina" con "Press de hombro con mancuernas" como alternativa.
            ['Press de hombro en máquina', 'Press de hombro con mancuernas'],
            // Esta línea sirve para agregar "Elevaciones laterales en polea" con "Elevaciones laterales" como alternativa.
            ['Elevaciones laterales en polea', 'Elevaciones laterales'],
            // Esta línea sirve para agregar "Extensión de tríceps en polea" con "Tríceps en máquina" como alternativa.
            ['Extensión de tríceps en polea', 'Tríceps en máquina'],
            // Esta línea sirve para agregar "Katana en polea" con "Rompecráneos a dos manos con mancuerna" como alternativa.
            ['Katana en polea', 'Rompecráneos a dos manos con mancuerna'],
        ];
    }

    // Esta línea sirve para declarar el bloque de tirón A.
    private function pullA(): array
    {
        // Esta línea sirve para devolver los pares de ejercicio principal y alternativo.
        return [
            // Esta línea sirve para agregar "Jalón en polea alta" con "Jalón al pecho" como alternativa.
            ['Jalón en polea alta', 'Jalón al pecho'],
            // Esta línea sirve para agregar "Remo en T" con "Remo en polea sentado" como alternativa.
            ['Remo en T', 'Remo en polea sentado'],
            // Esta línea sirve para agregar "Pull over en polea" con "Jalón en polea con agarre cerrado" como alternativa.
            ['Pull over en polea', 'Jalón en polea con agarre cerrado'],
            // Esta línea sirve para agregar "Vuelos posteriores en polea" con "Pájaros (deltoide posterior)" como alternativa.
            ['Vuelos posteriores en polea', 'Pájaros (deltoide posterior)'],
            // Esta línea sirve para agregar "Curl bayesiano en polea" con "Curl bayesiano con mancuerna en banco" como alternativa.
            ['Curl bayesiano en polea', 'Curl bayesiano con mancuerna en banco'],
            // Esta línea sirve para agregar "Curl predicador en máquina" con "Curl predicador con mancuerna en banco" como alternativa.
            ['Curl predicador en máquina', 'Curl predicador con mancuerna en banco'],
        ];
    }

    // Esta línea sirve para declarar el bloque de pierna A para hombres.
    private function legsMaleA(): array
    {
        // Esta línea sirve para devolver los pares de ejercicio principal y alternativo.
        return [
            // Esta línea sirve para agregar "Sentadilla en Smith" con "Sentadilla Hack" como alternativa.
            ['Sentadilla en Smith', 'Sentadilla Hack'],
            // Esta línea sirve para agregar "Extensión de cuádriceps" con "Sentadilla Sissy" como alternativa.
            ['Extensión de cuádriceps', 'Sentadilla Sissy'],
            // Esta línea sirve para agregar "Curl femoral" con "Femoral sentado en máquina" como alternativa.
            ['Curl femoral', 'Femoral sentado en máquina'],
            // Esta línea sirve para agregar "Peso muerto rumano con mancuernas" con "Peso muerto rumano con barra" como alternativa.
            ['Peso muerto rumano con mancuernas', 'Peso muerto rumano con barra'],
            // Esta línea sirve para agregar "Abducción de cadera en máquina" sin alternativa.
            ['Abducción de cadera en máquina', null],
            // Esta línea sirve para agregar "Aductores en máquina" sin alternativa.
            ['Aductores en máquina', null],
            // Esta línea sirve para agregar "Pantorrilla sentado en prensa" sin alternativa.
            ['Pantorrilla sentado en prensa', null],
        ];
    }

    // Esta línea sirve para declarar el bloque de pierna A para mujeres.
    private function legsFemaleA(): array
    {
        // Esta línea sirve para devolver los pares de ejercicio principal y alternativo.
        return [
            // Esta línea sirve para agregar "Hip Thrust en máquina" con "Hip thrust" como alternativa.
            ['Hip Thrust en máquina', 'Hip thrust'],
            // Esta línea sirve para agregar "Sentadilla en Smith" con "Sentadilla Hack" como alternativa.
            ['Sentadilla en Smith', 'Sentadilla Hack'],
            // Esta línea sirve para agregar "Prensa de piernas" con "Prensa horizontal" como alternativa.
            ['Prensa de piernas', 'Prensa horizontal'],
            // Esta línea sirve para agregar "Extensión de cuádriceps" con "Sentadilla Sissy" como alternativa.
            ['Extensión de cuádriceps', 'Sentadilla Sissy'],
            // Esta línea sirve para agregar "Curl femoral" con "Femoral sentado en máquina" como alternativa.
            ['Curl femoral', 'Femoral sentado en máquina'],
            // Esta línea sirve para agregar "Peso muerto rumano con mancuernas" con "Peso muerto rumano en Smith" como alternativa.
            ['Peso muerto rumano con mancuernas', 'Peso muerto rumano en Smith'],
            // Esta línea sirve para agregar "Patada de glúteo en polea" con "Patada de glúteo en máquina" como alternativa.
            ['Patada de glúteo en polea', 'Patada de glúteo en máquina'],
            // Esta línea sirve para agregar "Abducción de cadera en máquina" con "Abducción en polea" como alternativa.
            ['Abducción de cadera en máquina', 'Abducción en polea'],
            // Esta línea sirve para agregar "Pantorrilla sentado en prensa" con "Elevación de talones de pie" como alternativa.
            ['Pantorrilla sentado en prensa', 'Elevación de talones de pie'],
        ];
    }

    // Esta línea sirve para declarar el bloque de tren superior A para hombres.
    private function upperMaleA(): array
    {
        // Esta línea sirve para devolver los pares de ejercicio principal y alternativo.
        return [
            // Esta línea sirve para agregar "Press inclinado con mancuernas" con "Press inclinado en máquina" como alternativa.
            ['Press inclinado con mancuernas', 'Press inclinado en máquina'],
            // Esta línea sirve para agregar "Press de pecho en máquina" con "Press banca con barra" como alternativa.
            ['Press de pecho en máquina', 'Press banca con barra'],
            // Esta línea sirve para agregar "Aperturas en máquina" con "Cruce de poleas" como alternativa.
            ['Aperturas en máquina', 'Cruce de poleas'],
            // Esta línea sirve para agregar "Jalón en polea alta" con "Jalón al pecho" como alternativa.
            ['Jalón en polea alta', 'Jalón al pecho'],
            // Esta línea sirve para agregar "Remo en T" con "Remo en polea sentado" como alternativa.
            ['Remo en T', 'Remo en polea sentado'],
            // Esta línea sirve para agregar "Press de hombro en máquina" con "Press de hombro con mancuernas" como alternativa.
            ['Press de hombro en máquina', 'Press de hombro con mancuernas'],
            // Esta línea sirve para agregar "Elevaciones laterales en polea" con "Elevaciones laterales" como alternativa.
            ['Elevaciones laterales en polea', 'Elevaciones laterales'],
            // Esta línea sirve para agregar "Curl predicador en máquina" con "Curl predicador con mancuerna en banco" como alternativa.
            ['Curl predicador en máquina', 'Curl predicador con mancuerna en banco'],
            // Esta línea sirve para agregar "Extensión de tríceps en polea" con "Tríceps en máquina" como alternativa.
            ['Extensión de tríceps en polea', 'Tríceps en máquina'],
        ];
    }

    // Esta línea sirve para declarar el bloque de tren inferior A para hombres.
    private function lowerMaleA(): array
    {
        // Esta línea sirve para devolver los pares de ejercicio principal y alternativo.
        return [
            // Esta línea sirve para agregar "Sentadilla en Smith" con "Sentadilla Hack" como alternativa.
            ['Sentadilla en Smith', 'Sentadilla Hack'],
            // Esta línea sirve para agregar "Prensa de piernas" con "Prensa horizontal" como alternativa.
            ['Prensa de piernas', 'Prensa horizontal'],
            // Esta línea sirve para agregar "Extensión de cuádriceps" con "Sentadilla Sissy" como alternativa.
            ['Extensión de cuádriceps', 'Sentadilla Sissy'],
            // Esta línea sirve para agregar "Curl femoral" con "Femoral sentado en máquina" como alternativa.
            ['Curl femoral', 'Femoral sentado en máquina'],
            // Esta línea sirve para agregar "Peso muerto rumano con mancuernas" con "Peso muerto rumano en Smith" como alternativa.
            ['Peso muerto rumano con mancuernas', 'Peso muerto rumano en Smith'],
            // Esta línea sirve para agregar "Hip Thrust en máquina" con "Hip thrust" como alternativa.
            ['Hip Thrust en máquina', 'Hip thrust'],
            // Esta línea sirve para agregar "Abducción de cadera en máquina" con "Abducción en polea" como alternativa.
            ['Abducción de cadera en máquina', 'Abducción en polea'],
            // Esta línea sirve para agregar "Aductores en máquina" sin alternativa.
            ['Aductores en máquina', null],
            // Esta línea sirve para agregar "Pantorrilla sentado en prensa" con "Elevación de talones de pie" como alternativa.
            ['Pantorrilla sentado en prensa', 'Elevación de talones de pie'],
        ];
    }

    // Esta línea sirve para declarar el bloque de tren superior B para hombres.
    private function upperMaleB(): array
    {
        // Esta línea sirve para devolver los pares de ejercicio principal y alternativo.
        return [
            // Esta línea sirve para agregar "Press inclinado en máquina" con "Press inclinado con barra" como alternativa.
            ['Press inclinado en máquina', 'Press inclinado con barra'],
            // Esta línea sirve para agregar "Press banca con mancuernas" con "Press de pecho en máquina" como alternativa.
            ['Press banca con mancuernas', 'Press de pecho en máquina'],
            // Esta línea sirve para agregar "Cruce de poleas" con "Aperturas en máquina" como alternativa.
            ['Cruce de poleas', 'Aperturas en máquina'],
            // Esta línea sirve para agregar "Jalón en polea con agarre cerrado" con "Pull over en polea" como alternativa.
            ['Jalón en polea con agarre cerrado', 'Pull over en polea'],
            // Esta línea sirve para agregar "Remo en polea sentado" con "Remo en T" como alternativa.
            ['Remo en polea sentado', 'Remo en T'],
            // Esta línea sirve para agregar "Press de hombro con mancuernas" con "Press de hombro en máquina" como alternativa.
            ['Press de hombro con mancuernas', 'Press de hombro en máquina'],
            // Esta línea sirve para agregar "Elevaciones laterales" con "Elevaciones laterales en polea" como alternativa.
            ['Elevaciones laterales', 'Elevaciones laterales en polea'],
            // Esta línea sirve para agregar "Pájaros (deltoide posterior)" con "Vuelos posteriores en polea" como alternativa.
            ['Pájaros (deltoide posterior)', 'Vuelos posteriores en polea'],
            // Esta línea sirve para agregar "Curl bayesiano en polea" con "Curl bayesiano con mancuerna en banco" como alternativa.
            ['Curl bayesiano en polea', 'Curl bayesiano con mancuerna en banco'],
            // Esta línea sirve para agregar "Katana en polea" con "Rompecráneos a dos manos con mancuerna" como alternativa.
            ['Katana en polea', 'Rompecráneos a dos manos con mancuerna'],
        ];
    }

    // Esta línea sirve para declarar el bloque de tren inferior B para hombres.
    private function lowerMaleB(): array
    {
        // Esta línea sirve para devolver los pares de ejercicio principal y alternativo.
        return [
            // Esta línea sirve para agregar "Sentadilla Hack" con "Sentadilla en Smith" como alternativa.
            ['Sentadilla Hack', 'Sentadilla en Smith'],
            // Esta línea sirve para agregar "Prensa horizontal" con "Prensa de piernas" como alternativa.
            ['Prensa horizontal', 'Prensa de piernas'],
            // Esta línea sirve para agregar "Extensión de cuádriceps" sin alternativa.
            ['Extensión de cuádriceps', null],
            // Esta línea sirve para agregar "Femoral sentado en máquina" con "Curl femoral" como alternativa.
            ['Femoral sentado en máquina', 'Curl femoral'],
            // Esta línea sirve para agregar "Peso muerto rumano en Smith" con "Peso muerto rumano con mancuernas" como alternativa.
            ['Peso muerto rumano en Smith', 'Peso muerto rumano con mancuernas'],
            // Esta línea sirve para agregar "Puente de glúteos" con "Hip Thrust en máquina" como alternativa.
            ['Puente de glúteos', 'Hip Thrust en máquina'],
            // Esta línea sirve para agregar "Abducción en polea" con "Abducción de cadera en máquina" como alternativa.
            ['Abducción en polea', 'Abducción de cadera en máquina'],
            // Esta línea sirve para agregar "Aductores en máquina" sin alternativa.
            ['Aductores en máquina', null],
            // Esta línea sirve para agregar "Elevación de talones de pie" con "Pantorrilla sentado en prensa" como alternativa.
            ['Elevación de talones de pie', 'Pantorrilla sentado en prensa'],
        ];
    }

    // Esta línea sirve para declarar el bloque de tren inferior A para mujeres.
    private function lowerFemaleA(): array
    {
        // Esta línea sirve para devolver los pares de ejercicio principal y alternativo.
        return [
            // Esta línea sirve para agregar "Hip Thrust en máquina" con "Hip thrust" como alternativa.
            ['Hip Thrust en máquina', 'Hip thrust'],
            // Esta línea sirve para agregar "Sentadilla en Smith" con "Sentadilla Hack" como alternativa.
            ['Sentadilla en Smith', 'Sentadilla Hack'],
            // Esta línea sirve para agregar "Prensa de piernas" con "Prensa horizontal" como alternativa.
            ['Prensa de piernas', 'Prensa horizontal'],
            // Esta línea sirve para agregar "Peso muerto rumano con mancuernas" con "Peso muerto rumano en Smith" como alternativa.
            ['Peso muerto rumano con mancuernas', 'Peso muerto rumano en Smith'],
            // Esta línea sirve para agregar "Curl femoral" con "Femoral sentado en máquina" como alternativa.
            ['Curl femoral', 'Femoral sentado en máquina'],
            // Esta línea sirve para agregar "Patada de glúteo en máquina" con "Patada de glúteo en polea" como alternativa.
            ['Patada de glúteo en máquina', 'Patada de glúteo en polea'],
            // Esta línea sirve para agregar "Abducción de cadera en máquina" con "Abducción en polea" como alternativa.
            ['Abducción de cadera en máquina', 'Abducción en polea'],
            // Esta línea sirve para agregar "Elevación de talones de pie" con "Pantorrilla sentado en prensa" como alternativa.
            ['Elevación de talones de pie', 'Pantorrilla sentado en prensa'],
        ];
    }

    // Esta línea sirve para declarar el bloque de tren superior A para mujeres.
    private function upperFemaleA(): array
    {
        // Esta línea sirve para devolver los pares de ejercicio principal y alternativo.
        return [
            // Esta línea sirve para agregar "Jalón en polea alta" con "Jalón al pecho" como alternativa.
            ['Jalón en polea alta', 'Jalón al pecho'],
            // Esta línea sirve para agregar "Remo en T" con "Remo en polea sentado" como alternativa.
            ['Remo en T', 'Remo en polea sentado'],
            // Esta línea sirve para agregar "Press inclinado con mancuernas" con "Press inclinado en máquina" como alternativa.
            ['Press inclinado con mancuernas', 'Press inclinado en máquina'],
            // Esta línea sirve para agregar "Press de pecho en máquina" con "Press banca con barra" como alternativa.
            ['Press de pecho en máquina', 'Press banca con barra'],
            // Esta línea sirve para agregar "Elevaciones laterales" con "Elevaciones laterales en polea" como alternativa.
            ['Elevaciones laterales', 'Elevaciones laterales en polea'],
            // Esta línea sirve para agregar "Pájaros (deltoide posterior)" con "Vuelos posteriores en polea" como alternativa.
            ['Pájaros (deltoide posterior)', 'Vuelos posteriores en polea'],
            // Esta línea sirve para agregar "Curl predicador en máquina" con "Curl bayesiano en polea" como alternativa.
            ['Curl predicador en máquina', 'Curl bayesiano en polea'],
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
            // Esta línea sirve para agregar "Peso muerto rumano con mancuernas" con "Peso muerto rumano en Smith" como alternativa.
            ['Peso muerto rumano con mancuernas', 'Peso muerto rumano en Smith'],
            // Esta línea sirve para agregar "Sentadilla búlgara" con "Zancada en Smith" como alternativa.
            ['Sentadilla búlgara', 'Zancada en Smith'],
            // Esta línea sirve para agregar "Extensión de cuádriceps" con "Sentadilla Sissy" como alternativa.
            ['Extensión de cuádriceps', 'Sentadilla Sissy'],
            // Esta línea sirve para agregar "Femoral sentado en máquina" con "Curl femoral" como alternativa.
            ['Femoral sentado en máquina', 'Curl femoral'],
            // Esta línea sirve para agregar "Patada de glúteo en polea" con "Patada de glúteo en máquina" como alternativa.
            ['Patada de glúteo en polea', 'Patada de glúteo en máquina'],
            // Esta línea sirve para agregar "Abducción de cadera en máquina" con "Abducción en polea" como alternativa.
            ['Abducción de cadera en máquina', 'Abducción en polea'],
            // Esta línea sirve para agregar "Aductores en máquina" sin alternativa.
            ['Aductores en máquina', null],
            // Esta línea sirve para agregar "Pantorrilla sentado en prensa" con "Elevación de talones de pie" como alternativa.
            ['Pantorrilla sentado en prensa', 'Elevación de talones de pie'],
        ];
    }
}
