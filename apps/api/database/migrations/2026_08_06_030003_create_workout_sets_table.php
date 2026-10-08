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
        // Esta línea sirve para crear la tabla workout_sets.
        Schema::create('workout_sets', function (Blueprint $table) {
            // Esta línea sirve para agregar el id autoincremental.
            $table->id();
            // Esta línea sirve para agregar el ejercicio de la sesión (se borra junto con él).
            $table->foreignId('workout_exercise_id')->constrained()->cascadeOnDelete();
            // Esta línea sirve para agregar el número de serie.
            $table->unsignedTinyInteger('set_number');
            // Esta línea sirve para agregar el peso.
            $table->decimal('weight_kg', 6, 2);
            // Esta línea sirve para agregar las repeticiones.
            $table->unsignedSmallInteger('reps');
            // Esta línea sirve para agregar el RPE (opcional).
            $table->decimal('rpe', 3, 1)->nullable();
            // Esta línea sirve para agregar si es de calentamiento.
            $table->boolean('is_warmup')->default(false);
            // Esta línea sirve para agregar si se completó (sí por defecto).
            $table->boolean('completed')->default(true);
            // Esta línea sirve para agregar las fechas de creación y actualización.
            $table->timestamps();

            // Esta línea sirve para agregar un índice por ejercicio y número de serie.
            $table->index(['workout_exercise_id', 'set_number']);
        });
    }

    // Esta línea sirve para declarar el método que revierte la migración.
    public function down(): void
    {
        // Esta línea sirve para borrar la tabla si existe.
        Schema::dropIfExists('workout_sets');
    }
};
