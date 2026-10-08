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
        // Esta línea sirve para crear la tabla workout_sessions.
        Schema::create('workout_sessions', function (Blueprint $table) {
            // Esta línea sirve para agregar el id autoincremental.
            $table->id();
            // Esta línea sirve para agregar el usuario (se borra junto con el usuario).
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            // Esta línea sirve para agregar el día de rutina (opcional; queda en null si se borra el día).
            $table->foreignId('routine_day_id')->nullable()->constrained()->nullOnDelete();
            // Esta línea sirve para agregar la fecha del entrenamiento.
            $table->date('performed_at');
            // Esta línea sirve para agregar la duración en minutos (opcional).
            $table->unsignedSmallInteger('duration_minutes')->nullable();
            // Esta línea sirve para agregar si se completó.
            $table->boolean('completed')->default(false);
            // Esta línea sirve para agregar la calidad del sueño (opcional).
            $table->unsignedTinyInteger('sleep_quality')->nullable();
            // Esta línea sirve para agregar el nivel de energía (opcional).
            $table->unsignedTinyInteger('energy_level')->nullable();
            // Esta línea sirve para agregar el dolor muscular (opcional).
            $table->unsignedTinyInteger('muscle_soreness')->nullable();
            // Esta línea sirve para agregar las notas (opcional).
            $table->text('notes')->nullable();
            // Esta línea sirve para agregar las fechas de creación y actualización.
            $table->timestamps();

            // Esta línea sirve para agregar un índice por usuario y fecha.
            $table->index(['user_id', 'performed_at']);
        });
    }

    // Esta línea sirve para declarar el método que revierte la migración.
    public function down(): void
    {
        // Esta línea sirve para borrar la tabla si existe.
        Schema::dropIfExists('workout_sessions');
    }
};
