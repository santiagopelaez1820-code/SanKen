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
        // Esta línea sirve para crear la tabla personal_records.
        Schema::create('personal_records', function (Blueprint $table) {
            // Esta línea sirve para agregar el id autoincremental.
            $table->id();
            // Esta línea sirve para agregar el usuario (se borra junto con el usuario).
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            // Esta línea sirve para agregar el ejercicio (se borra junto con el ejercicio).
            $table->foreignId('exercise_id')->constrained()->cascadeOnDelete();
            // Esta línea sirve para agregar el tipo de récord.
            $table->enum('record_type', ['1rm', 'max_reps', 'max_volume']);
            // Esta línea sirve para agregar el valor.
            $table->decimal('value', 8, 2);
            // Esta línea sirve para agregar la fecha del récord.
            $table->date('achieved_at');
            // Esta línea sirve para agregar la serie que lo logró (opcional).
            $table->foreignId('workout_set_id')->nullable()->constrained()->cascadeOnDelete();
            // Esta línea sirve para agregar las fechas de creación y actualización.
            $table->timestamps();

            // Esta línea sirve para impedir más de un récord del mismo tipo por usuario y ejercicio.
            $table->unique(['user_id', 'exercise_id', 'record_type']);
        });
    }

    // Esta línea sirve para declarar el método que revierte la migración.
    public function down(): void
    {
        // Esta línea sirve para borrar la tabla si existe.
        Schema::dropIfExists('personal_records');
    }
};
