<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los seeders.

namespace Database\Seeders;

// Esta línea sirve para importar la clase base de los seeders.
use Illuminate\Database\Seeder;

/**
 * Dispatcher delgado: siembra las 24 plantillas curadas (sexo x frecuencia x
 * nivel) que usa TemplateRoutineGenerator, delegando el contenido real a un
 * seeder por nivel (cada uno con sus propios bloques de día/ejercicios, ver
 * Concerns/SeedsRoutineTemplates para la infraestructura compartida). Se
 * mantiene esta clase como punto de entrada único para no romper
 * DatabaseSeeder ni los tests que hacen `$this->seed(RoutineTemplateSeeder::class)`.
 */
// Esta línea sirve para declarar el seeder que siembra las plantillas de rutina de los 3 niveles.
class RoutineTemplateSeeder extends Seeder
{
    // Esta línea sirve para declarar el método que ejecuta el seeder.
    public function run(): void
    {
        // Esta línea sirve para ejecutar los seeders de cada nivel en orden.
        $this->call([
            // Esta línea sirve para cargar las plantillas de nivel principiante.
            RoutineTemplateBeginnerSeeder::class,
            // Esta línea sirve para cargar las plantillas de nivel intermedio.
            RoutineTemplateIntermediateSeeder::class,
            // Esta línea sirve para cargar las plantillas de nivel avanzado.
            RoutineTemplateAdvancedSeeder::class,
        ]);
    }
}
