<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los seeders.

namespace Database\Seeders;

// Esta línea sirve para importar el trait compartido de las plantillas de rutina.
use Database\Seeders\Concerns\SeedsRoutineTemplates;
// Esta línea sirve para importar la clase base de los seeders.
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
// Esta línea sirve para declarar el seeder de plantillas de rutina de este nivel.
class RoutineTemplateAdvancedSeeder extends Seeder
{
    // Esta línea sirve para usar la lógica compartida de las plantillas de rutina.
    use SeedsRoutineTemplates;

    // Esta línea sirve para definir el nivel de estas plantillas (advanced).
    private const LEVEL = 'advanced';

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
            // Esta línea sirve para agregar "Press banca con barra" con "Press inclinado con barra" como alternativa.
            ['Press banca con barra', 'Press inclinado con barra'],
            // Esta línea sirve para agregar "Fondos en paralelas" con "Press cerrado" como alternativa.
            ['Fondos en paralelas', 'Press cerrado'],
            // Esta línea sirve para agregar "Cruce de poleas" sin alternativa.
            ['Cruce de poleas', null],
            // Esta línea sirve para agregar "Press militar con barra" con "Press Arnold" como alternativa.
            ['Press militar con barra', 'Press Arnold'],
            // Esta línea sirve para agregar "Elevaciones laterales en polea" sin alternativa.
            ['Elevaciones laterales en polea', null],
            // Esta línea sirve para agregar "Press francés" con "Rompecráneos a dos manos con mancuerna" como alternativa.
            ['Press francés', 'Rompecráneos a dos manos con mancuerna'],
            // Esta línea sirve para agregar "Katana en polea" sin alternativa.
            ['Katana en polea', null],
        ];
    }

    // Esta línea sirve para declarar el bloque de tirón A.
    private function pullA(): array
    {
        // Esta línea sirve para devolver los pares de ejercicio principal y alternativo.
        return [
            // Esta línea sirve para agregar "Dominadas" con "Jalón en polea con agarre cerrado" como alternativa.
            ['Dominadas', 'Jalón en polea con agarre cerrado'],
            // Esta línea sirve para agregar "Remo con barra" con "Remo en T" como alternativa.
            ['Remo con barra', 'Remo en T'],
            // Esta línea sirve para agregar "Pull over en polea" sin alternativa.
            ['Pull over en polea', null],
            // Esta línea sirve para agregar "Vuelos posteriores en polea" sin alternativa.
            ['Vuelos posteriores en polea', null],
            // Esta línea sirve para agregar "Curl bayesiano en polea" con "Curl bayesiano con mancuerna en banco" como alternativa.
            ['Curl bayesiano en polea', 'Curl bayesiano con mancuerna en banco'],
            // Esta línea sirve para agregar "Curl en banco Scott" sin alternativa.
            ['Curl en banco Scott', null],
        ];
    }

    // Esta línea sirve para declarar el bloque de pierna A para hombres.
    private function legsMaleA(): array
    {
        // Esta línea sirve para devolver los pares de ejercicio principal y alternativo.
        return [
            // Esta línea sirve para agregar "Sentadilla con barra" con "Sentadilla Hack" como alternativa.
            ['Sentadilla con barra', 'Sentadilla Hack'],
            // Esta línea sirve para agregar "Sentadilla Sissy" con "Extensión de cuádriceps" como alternativa.
            ['Sentadilla Sissy', 'Extensión de cuádriceps'],
            // Esta línea sirve para agregar "Buenos días" con "Peso muerto rumano en Smith" como alternativa.
            ['Buenos días', 'Peso muerto rumano en Smith'],
            // Esta línea sirve para agregar "Curl femoral" con "Femoral sentado en máquina" como alternativa.
            ['Curl femoral', 'Femoral sentado en máquina'],
            // Esta línea sirve para agregar "Hip thrust" con "Hip Thrust en máquina" como alternativa.
            ['Hip thrust', 'Hip Thrust en máquina'],
            // Esta línea sirve para agregar "Abducción de cadera en máquina" sin alternativa.
            ['Abducción de cadera en máquina', null],
            // Esta línea sirve para agregar "Elevación de talones de pie" sin alternativa.
            ['Elevación de talones de pie', null],
        ];
    }

    // Esta línea sirve para declarar el bloque de pierna A para mujeres.
    private function legsFemaleA(): array
    {
        // Esta línea sirve para devolver los pares de ejercicio principal y alternativo.
        return [
            // Esta línea sirve para agregar "Hip thrust" con "Hip Thrust en máquina" como alternativa.
            ['Hip thrust', 'Hip Thrust en máquina'],
            // Esta línea sirve para agregar "Sentadilla con barra" con "Sentadilla Hack" como alternativa.
            ['Sentadilla con barra', 'Sentadilla Hack'],
            // Esta línea sirve para agregar "Peso muerto rumano con barra" con "Peso muerto rumano en Smith" como alternativa.
            ['Peso muerto rumano con barra', 'Peso muerto rumano en Smith'],
            // Esta línea sirve para agregar "Sentadilla búlgara" con "Zancada en Smith" como alternativa.
            ['Sentadilla búlgara', 'Zancada en Smith'],
            // Esta línea sirve para agregar "Extensión de cuádriceps" con "Sentadilla Sissy" como alternativa.
            ['Extensión de cuádriceps', 'Sentadilla Sissy'],
            // Esta línea sirve para agregar "Curl femoral" con "Femoral sentado en máquina" como alternativa.
            ['Curl femoral', 'Femoral sentado en máquina'],
            // Esta línea sirve para agregar "Buenos días" sin alternativa.
            ['Buenos días', null],
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
            // Esta línea sirve para agregar "Press banca con barra" con "Press inclinado con barra" como alternativa.
            ['Press banca con barra', 'Press inclinado con barra'],
            // Esta línea sirve para agregar "Fondos en paralelas" con "Press cerrado" como alternativa.
            ['Fondos en paralelas', 'Press cerrado'],
            // Esta línea sirve para agregar "Cruce de poleas" sin alternativa.
            ['Cruce de poleas', null],
            // Esta línea sirve para agregar "Dominadas" con "Jalón en polea con agarre cerrado" como alternativa.
            ['Dominadas', 'Jalón en polea con agarre cerrado'],
            // Esta línea sirve para agregar "Remo con barra" con "Remo en T" como alternativa.
            ['Remo con barra', 'Remo en T'],
            // Esta línea sirve para agregar "Press militar con barra" con "Press Arnold" como alternativa.
            ['Press militar con barra', 'Press Arnold'],
            // Esta línea sirve para agregar "Elevaciones laterales en polea" sin alternativa.
            ['Elevaciones laterales en polea', null],
            // Esta línea sirve para agregar "Curl en banco Scott" con "Curl bayesiano en polea" como alternativa.
            ['Curl en banco Scott', 'Curl bayesiano en polea'],
            // Esta línea sirve para agregar "Press francés" con "Rompecráneos a dos manos con mancuerna" como alternativa.
            ['Press francés', 'Rompecráneos a dos manos con mancuerna'],
        ];
    }

    // Esta línea sirve para declarar el bloque de tren inferior A para hombres.
    private function lowerMaleA(): array
    {
        // Esta línea sirve para devolver los pares de ejercicio principal y alternativo.
        return [
            // Esta línea sirve para agregar "Sentadilla con barra" con "Sentadilla Hack" como alternativa.
            ['Sentadilla con barra', 'Sentadilla Hack'],
            // Esta línea sirve para agregar "Sentadilla frontal" con "Sentadilla Sissy" como alternativa.
            ['Sentadilla frontal', 'Sentadilla Sissy'],
            // Esta línea sirve para agregar "Extensión de cuádriceps" sin alternativa.
            ['Extensión de cuádriceps', null],
            // Esta línea sirve para agregar "Curl femoral" con "Femoral sentado en máquina" como alternativa.
            ['Curl femoral', 'Femoral sentado en máquina'],
            // Esta línea sirve para agregar "Peso muerto rumano con barra" con "Peso muerto rumano en Smith" como alternativa.
            ['Peso muerto rumano con barra', 'Peso muerto rumano en Smith'],
            // Esta línea sirve para agregar "Hip thrust" con "Hip Thrust en máquina" como alternativa.
            ['Hip thrust', 'Hip Thrust en máquina'],
            // Esta línea sirve para agregar "Buenos días" sin alternativa.
            ['Buenos días', null],
            // Esta línea sirve para agregar "Abducción de cadera en máquina" sin alternativa.
            ['Abducción de cadera en máquina', null],
            // Esta línea sirve para agregar "Elevación de talones de pie" con "Elevación de talones sentado" como alternativa.
            ['Elevación de talones de pie', 'Elevación de talones sentado'],
        ];
    }

    // Esta línea sirve para declarar el bloque de tren superior B para hombres.
    private function upperMaleB(): array
    {
        // Esta línea sirve para devolver los pares de ejercicio principal y alternativo.
        return [
            // Esta línea sirve para agregar "Press inclinado con barra" con "Press banca con barra" como alternativa.
            ['Press inclinado con barra', 'Press banca con barra'],
            // Esta línea sirve para agregar "Press cerrado" con "Fondos en paralelas" como alternativa.
            ['Press cerrado', 'Fondos en paralelas'],
            // Esta línea sirve para agregar "Jalón en polea con agarre cerrado" con "Dominadas" como alternativa.
            ['Jalón en polea con agarre cerrado', 'Dominadas'],
            // Esta línea sirve para agregar "Remo en T" con "Remo con barra" como alternativa.
            ['Remo en T', 'Remo con barra'],
            // Esta línea sirve para agregar "Pull over en polea" sin alternativa.
            ['Pull over en polea', null],
            // Esta línea sirve para agregar "Press Arnold" con "Press militar con barra" como alternativa.
            ['Press Arnold', 'Press militar con barra'],
            // Esta línea sirve para agregar "Elevaciones laterales en polea" sin alternativa.
            ['Elevaciones laterales en polea', null],
            // Esta línea sirve para agregar "Vuelos posteriores en polea" sin alternativa.
            ['Vuelos posteriores en polea', null],
            // Esta línea sirve para agregar "Curl bayesiano en polea" con "Curl bayesiano con mancuerna en banco" como alternativa.
            ['Curl bayesiano en polea', 'Curl bayesiano con mancuerna en banco'],
            // Esta línea sirve para agregar "Katana en polea" con "Press francés" como alternativa.
            ['Katana en polea', 'Press francés'],
        ];
    }

    // Esta línea sirve para declarar el bloque de tren inferior B para hombres.
    private function lowerMaleB(): array
    {
        // Esta línea sirve para devolver los pares de ejercicio principal y alternativo.
        return [
            // Esta línea sirve para agregar "Sentadilla Hack" con "Sentadilla con barra" como alternativa.
            ['Sentadilla Hack', 'Sentadilla con barra'],
            // Esta línea sirve para agregar "Sentadilla Sissy" con "Extensión de cuádriceps" como alternativa.
            ['Sentadilla Sissy', 'Extensión de cuádriceps'],
            // Esta línea sirve para agregar "Femoral sentado en máquina" con "Curl femoral" como alternativa.
            ['Femoral sentado en máquina', 'Curl femoral'],
            // Esta línea sirve para agregar "Peso muerto rumano en Smith" con "Peso muerto rumano con barra" como alternativa.
            ['Peso muerto rumano en Smith', 'Peso muerto rumano con barra'],
            // Esta línea sirve para agregar "Buenos días" sin alternativa.
            ['Buenos días', null],
            // Esta línea sirve para agregar "Hip Thrust en máquina" con "Hip thrust" como alternativa.
            ['Hip Thrust en máquina', 'Hip thrust'],
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
            // Esta línea sirve para agregar "Hip thrust" con "Hip Thrust en máquina" como alternativa.
            ['Hip thrust', 'Hip Thrust en máquina'],
            // Esta línea sirve para agregar "Sentadilla con barra" con "Sentadilla Hack" como alternativa.
            ['Sentadilla con barra', 'Sentadilla Hack'],
            // Esta línea sirve para agregar "Peso muerto rumano con barra" con "Peso muerto rumano en Smith" como alternativa.
            ['Peso muerto rumano con barra', 'Peso muerto rumano en Smith'],
            // Esta línea sirve para agregar "Extensión de cuádriceps" con "Sentadilla Sissy" como alternativa.
            ['Extensión de cuádriceps', 'Sentadilla Sissy'],
            // Esta línea sirve para agregar "Curl femoral" con "Femoral sentado en máquina" como alternativa.
            ['Curl femoral', 'Femoral sentado en máquina'],
            // Esta línea sirve para agregar "Buenos días" sin alternativa.
            ['Buenos días', null],
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
            // Esta línea sirve para agregar "Dominadas" con "Jalón en polea con agarre cerrado" como alternativa.
            ['Dominadas', 'Jalón en polea con agarre cerrado'],
            // Esta línea sirve para agregar "Remo con barra" con "Remo en T" como alternativa.
            ['Remo con barra', 'Remo en T'],
            // Esta línea sirve para agregar "Press banca con barra" con "Press inclinado con barra" como alternativa.
            ['Press banca con barra', 'Press inclinado con barra'],
            // Esta línea sirve para agregar "Cruce de poleas" sin alternativa.
            ['Cruce de poleas', null],
            // Esta línea sirve para agregar "Elevaciones laterales en polea" sin alternativa.
            ['Elevaciones laterales en polea', null],
            // Esta línea sirve para agregar "Vuelos posteriores en polea" sin alternativa.
            ['Vuelos posteriores en polea', null],
            // Esta línea sirve para agregar "Curl en banco Scott" con "Curl bayesiano en polea" como alternativa.
            ['Curl en banco Scott', 'Curl bayesiano en polea'],
            // Esta línea sirve para agregar "Press francés" con "Katana en polea" como alternativa.
            ['Press francés', 'Katana en polea'],
        ];
    }

    // Esta línea sirve para declarar el bloque de tren inferior B para mujeres.
    private function lowerFemaleB(): array
    {
        // Esta línea sirve para devolver los pares de ejercicio principal y alternativo.
        return [
            // Esta línea sirve para agregar "Hip Thrust en máquina" con "Hip thrust" como alternativa.
            ['Hip Thrust en máquina', 'Hip thrust'],
            // Esta línea sirve para agregar "Peso muerto rumano con barra" con "Peso muerto rumano en Smith" como alternativa.
            ['Peso muerto rumano con barra', 'Peso muerto rumano en Smith'],
            // Esta línea sirve para agregar "Sentadilla búlgara" con "Zancada en Smith" como alternativa.
            ['Sentadilla búlgara', 'Zancada en Smith'],
            // Esta línea sirve para agregar "Sentadilla Sissy" con "Extensión de cuádriceps" como alternativa.
            ['Sentadilla Sissy', 'Extensión de cuádriceps'],
            // Esta línea sirve para agregar "Femoral sentado en máquina" con "Curl femoral" como alternativa.
            ['Femoral sentado en máquina', 'Curl femoral'],
            // Esta línea sirve para agregar "Buenos días" sin alternativa.
            ['Buenos días', null],
            // Esta línea sirve para agregar "Abducción de cadera en máquina" con "Abducción en polea" como alternativa.
            ['Abducción de cadera en máquina', 'Abducción en polea'],
            // Esta línea sirve para agregar "Aductores en máquina" sin alternativa.
            ['Aductores en máquina', null],
            // Esta línea sirve para agregar "Elevación de talones de pie" con "Elevación de talones sentado" como alternativa.
            ['Elevación de talones de pie', 'Elevación de talones sentado'],
        ];
    }
}
