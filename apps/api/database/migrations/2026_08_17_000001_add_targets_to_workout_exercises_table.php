<?php

// Esta línea sirve para importar la clase base de las migraciones.
use Illuminate\Database\Migrations\Migration;
// Esta línea sirve para importar Blueprint para definir las columnas.
use Illuminate\Database\Schema\Blueprint;
// Esta línea sirve para importar la fachada Schema para crear y modificar tablas.
use Illuminate\Support\Facades\Schema;

/**
 * Snapshot de las metas del routine_exercise (o defaults para sesion libre)
 * tomado al iniciar la sesion — ver StartWorkoutSessionAction. Antes la
 * pantalla de entrenamiento dependia de una query aparte a /routines/active
 * cruzada por indice de array; con esto la sesion queda autosuficiente
 * (necesario para el cap estricto de 3 series y para que recargar la pagina
 * no pierda el peso recomendado).
 */
// Esta línea sirve para devolver una migración anónima.
return new class extends Migration
{
    // Esta línea sirve para declarar el método que aplica la migración.
    public function up(): void
    {
        // Esta línea sirve para modificar la tabla workout_exercises.
        Schema::table('workout_exercises', function (Blueprint $table) {
            // Esta línea sirve para agregar las series objetivo (3 por defecto).
            $table->unsignedTinyInteger('target_sets')->default(3)->after('order');
            // Esta línea sirve para agregar las repeticiones objetivo (opcional).
            $table->string('target_reps')->nullable()->after('target_sets');
            // Esta línea sirve para agregar el descanso en segundos (opcional).
            $table->unsignedSmallInteger('rest_seconds')->nullable()->after('target_reps');
            // Esta línea sirve para agregar el RPE objetivo (opcional).
            $table->decimal('target_rpe', 3, 1)->nullable()->after('rest_seconds');
            // Esta línea sirve para agregar el peso sugerido (opcional).
            $table->decimal('suggested_weight_kg', 6, 2)->nullable()->after('target_rpe');
        });
    }

    // Esta línea sirve para declarar el método que revierte la migración.
    public function down(): void
    {
        // Esta línea sirve para modificar la tabla workout_exercises.
        Schema::table('workout_exercises', function (Blueprint $table) {
            // Esta línea sirve para borrar las columnas agregadas.
            $table->dropColumn(['target_sets', 'target_reps', 'rest_seconds', 'target_rpe', 'suggested_weight_kg']);
        });
    }
};
