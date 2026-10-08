<?php

// Esta línea sirve para importar la clase base de las migraciones.
use Illuminate\Database\Migrations\Migration;
// Esta línea sirve para importar Blueprint para definir las columnas.
use Illuminate\Database\Schema\Blueprint;
// Esta línea sirve para importar la fachada Schema para crear y modificar tablas.
use Illuminate\Support\Facades\Schema;

/**
 * default_sets/default_reps son el "8x12" de cada ejercicio de plantilla,
 * pero configurable en BD (no hardcodeado en frontend/backend) — ver
 * seccion 7 del pedido. La alternativa A/B de cada ejercicio se resuelve
 * via exercise_alternatives (ya existente), no una columna aca.
 */
// Esta línea sirve para devolver una migración anónima.
return new class extends Migration
{
    // Esta línea sirve para declarar el método que aplica la migración.
    public function up(): void
    {
        // Esta línea sirve para crear la tabla routine_template_exercises.
        Schema::create('routine_template_exercises', function (Blueprint $table) {
            // Esta línea sirve para agregar el id autoincremental.
            $table->id();
            // Esta línea sirve para agregar el día de la plantilla (se borra junto con el día).
            $table->foreignId('routine_template_day_id')->constrained()->cascadeOnDelete();
            // Esta línea sirve para agregar el ejercicio (impide borrar un ejercicio usado).
            $table->foreignId('exercise_id')->constrained()->restrictOnDelete();
            // Esta línea sirve para agregar el orden.
            $table->unsignedTinyInteger('order');
            // Esta línea sirve para agregar las series por defecto (8).
            $table->unsignedTinyInteger('default_sets')->default(8);
            // Esta línea sirve para agregar las repeticiones por defecto ("12").
            $table->string('default_reps')->default('12');
            // Esta línea sirve para agregar el descanso en segundos (90 por defecto).
            $table->unsignedSmallInteger('rest_seconds')->default(90);
            // Esta línea sirve para agregar las fechas de creación y actualización.
            $table->timestamps();

            // Esta línea sirve para agregar un índice por día y orden.
            $table->index(['routine_template_day_id', 'order']);
        });
    }

    // Esta línea sirve para declarar el método que revierte la migración.
    public function down(): void
    {
        // Esta línea sirve para borrar la tabla si existe.
        Schema::dropIfExists('routine_template_exercises');
    }
};
