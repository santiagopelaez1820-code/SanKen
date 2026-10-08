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
        // Esta línea sirve para crear la tabla de músculos secundarios de cada ejercicio.
        Schema::create('exercise_secondary_muscles', function (Blueprint $table) {
            // Esta línea sirve para agregar el id autoincremental.
            $table->id();
            // Esta línea sirve para agregar el ejercicio (se borra junto con el ejercicio).
            $table->foreignId('exercise_id')->constrained()->cascadeOnDelete();
            // Esta línea sirve para agregar el grupo muscular (se borra junto con el músculo).
            $table->foreignId('muscle_group_id')->constrained('muscle_groups')->cascadeOnDelete();

            // Esta línea sirve para impedir repetir el mismo músculo en un ejercicio.
            $table->unique(['exercise_id', 'muscle_group_id']);
        });
    }

    // Esta línea sirve para declarar el método que revierte la migración.
    public function down(): void
    {
        // Esta línea sirve para borrar la tabla si existe.
        Schema::dropIfExists('exercise_secondary_muscles');
    }
};
