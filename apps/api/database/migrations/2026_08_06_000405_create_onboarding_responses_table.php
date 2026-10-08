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
        // Esta línea sirve para crear la tabla onboarding_responses.
        Schema::create('onboarding_responses', function (Blueprint $table) {
            // Esta línea sirve para agregar el id autoincremental.
            $table->id();
            // Esta línea sirve para agregar el usuario (único; se borra junto con el usuario).
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            // Esta línea sirve para agregar el nivel (opcional).
            $table->enum('level', ['beginner', 'intermediate', 'advanced'])->nullable();
            // Esta línea sirve para agregar los objetivos en JSON (opcional).
            $table->json('goals')->nullable();
            // Esta línea sirve para agregar la frecuencia semanal (opcional).
            $table->unsignedTinyInteger('frequency_days')->nullable();
            // Esta línea sirve para agregar la duración de la sesión (opcional).
            $table->unsignedTinyInteger('session_minutes')->nullable();
            // Esta línea sirve para agregar el lugar de entrenamiento (opcional).
            $table->enum('place', ['home', 'gym'])->nullable();
            // Esta línea sirve para agregar el equipamiento en JSON (opcional).
            $table->json('equipment_available')->nullable();
            // Esta línea sirve para agregar las lesiones en JSON (opcional).
            $table->json('injuries')->nullable();
            // Esta línea sirve para agregar las notas de experiencia (opcional).
            $table->text('experience_notes')->nullable();
            // Esta línea sirve para agregar si está completo.
            $table->boolean('completed')->default(false);
            // Esta línea sirve para agregar cuándo se completó (opcional).
            $table->timestamp('completed_at')->nullable();
            // Esta línea sirve para agregar las fechas de creación y actualización.
            $table->timestamps();
        });
    }

    // Esta línea sirve para declarar el método que revierte la migración.
    public function down(): void
    {
        // Esta línea sirve para borrar la tabla si existe.
        Schema::dropIfExists('onboarding_responses');
    }
};
