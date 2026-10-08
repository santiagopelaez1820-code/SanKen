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
        // Esta línea sirve para crear la tabla routines.
        Schema::create('routines', function (Blueprint $table) {
            // Esta línea sirve para agregar el id autoincremental.
            $table->id();
            // Esta línea sirve para agregar el usuario (se borra junto con el usuario).
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            // Esta línea sirve para agregar el entrenador que la creó (opcional).
            $table->foreignId('created_by_trainer_id')->nullable()->constrained('users')->nullOnDelete();
            // Esta línea sirve para agregar el origen (motor o entrenador; motor por defecto).
            $table->enum('source', ['engine', 'trainer'])->default('engine');
            // Esta línea sirve para agregar el objetivo.
            $table->string('goal');
            // Esta línea sirve para agregar el tipo de división.
            $table->enum('split_type', ['full_body', 'upper_lower', 'push_pull_legs', 'bro_split']);
            // Esta línea sirve para agregar la frecuencia semanal.
            $table->unsignedTinyInteger('frequency_days');
            // Esta línea sirve para agregar la duración en semanas (6 por defecto).
            $table->unsignedTinyInteger('duration_weeks')->default(6);
            // Esta línea sirve para agregar si está activa.
            $table->boolean('is_active')->default(true);
            // Esta línea sirve para agregar la fecha de inicio (opcional).
            $table->date('starts_at')->nullable();
            // Esta línea sirve para agregar la fecha de fin (opcional).
            $table->date('ends_at')->nullable();
            // Esta línea sirve para agregar las fechas de creación y actualización.
            $table->timestamps();

            // Esta línea sirve para agregar un índice por usuario y estado.
            $table->index(['user_id', 'is_active']);
        });
    }

    // Esta línea sirve para declarar el método que revierte la migración.
    public function down(): void
    {
        // Esta línea sirve para borrar la tabla si existe.
        Schema::dropIfExists('routines');
    }
};
