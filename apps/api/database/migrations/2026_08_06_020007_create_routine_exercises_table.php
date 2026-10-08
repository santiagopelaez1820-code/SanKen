<?php

// Esta línea sirve para importar la clase base de las migraciones.
use Illuminate\Database\Migrations\Migration;
// Esta línea sirve para importar Blueprint para definir las columnas.
use Illuminate\Database\Schema\Blueprint;
// Esta línea sirve para importar la fachada Schema para crear y modificar tablas.
use Illuminate\Support\Facades\Schema;

// Esta línea sirve para devolver una migración anónima.
return new class extends Migration
{
    // Esta línea sirve para declarar el método que aplica la migración.
    public function up(): void
    {
        // Esta línea sirve para crear la tabla routine_exercises.
        Schema::create('routine_exercises', function (Blueprint $table) {
            // Esta línea sirve para agregar el id autoincremental.
            $table->id();
            // Esta línea sirve para agregar el día de rutina (se borra junto con el día).
            $table->foreignId('routine_day_id')->constrained()->cascadeOnDelete();
            // Esta línea sirve para agregar el ejercicio (impide borrar un ejercicio usado).
            $table->foreignId('exercise_id')->constrained()->restrictOnDelete();
            // Esta línea sirve para agregar el orden.
            $table->unsignedTinyInteger('order');
            // Esta línea sirve para agregar las series objetivo.
            $table->unsignedTinyInteger('target_sets');
            // Esta línea sirve para agregar las repeticiones objetivo.
            $table->string('target_reps');
            // Esta línea sirve para agregar el descanso en segundos.
            $table->unsignedSmallInteger('rest_seconds');
            // Esta línea sirve para agregar el RPE objetivo (opcional).
            $table->decimal('target_rpe', 3, 1)->nullable();
            // Esta línea sirve para agregar el peso sugerido (opcional).
            $table->decimal('suggested_weight_kg', 6, 2)->nullable();
            // Esta línea sirve para agregar las fechas de creación y actualización.
            $table->timestamps();

            // Esta línea sirve para agregar un índice por día y orden.
            $table->index(['routine_day_id', 'order']);
        });
    }

    // Esta línea sirve para declarar el método que revierte la migración.
    public function down(): void
    {
        // Esta línea sirve para borrar la tabla si existe.
        Schema::dropIfExists('routine_exercises');
    }
};
