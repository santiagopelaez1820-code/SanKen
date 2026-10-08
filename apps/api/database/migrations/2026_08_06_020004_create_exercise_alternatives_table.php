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
        // Esta línea sirve para crear la tabla de ejercicios alternativos.
        Schema::create('exercise_alternatives', function (Blueprint $table) {
            // Esta línea sirve para agregar el id autoincremental.
            $table->id();
            // Esta línea sirve para agregar el ejercicio (se borra junto con el ejercicio).
            $table->foreignId('exercise_id')->constrained()->cascadeOnDelete();
            // Esta línea sirve para agregar el ejercicio alternativo (se borra junto con ese ejercicio).
            $table->foreignId('alternative_exercise_id')->constrained('exercises')->cascadeOnDelete();

            // Esta línea sirve para impedir repetir la misma alternativa.
            $table->unique(['exercise_id', 'alternative_exercise_id']);
        });
    }

    // Esta línea sirve para declarar el método que revierte la migración.
    public function down(): void
    {
        // Esta línea sirve para borrar la tabla si existe.
        Schema::dropIfExists('exercise_alternatives');
    }
};
