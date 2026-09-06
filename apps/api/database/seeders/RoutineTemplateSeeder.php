<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

/**
 * Dispatcher delgado: siembra las 24 plantillas curadas (sexo x frecuencia x
 * nivel) que usa TemplateRoutineGenerator, delegando el contenido real a un
 * seeder por nivel (cada uno con sus propios bloques de día/ejercicios, ver
 * Concerns/SeedsRoutineTemplates para la infraestructura compartida). Se
 * mantiene esta clase como punto de entrada único para no romper
 * DatabaseSeeder ni los tests que hacen `$this->seed(RoutineTemplateSeeder::class)`.
 */
class RoutineTemplateSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RoutineTemplateBeginnerSeeder::class,
            RoutineTemplateIntermediateSeeder::class,
            RoutineTemplateAdvancedSeeder::class,
        ]);
    }
}
