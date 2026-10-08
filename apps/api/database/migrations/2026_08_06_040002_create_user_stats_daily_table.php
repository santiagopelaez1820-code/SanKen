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
        // Esta línea sirve para crear la tabla user_stats_daily.
        Schema::create('user_stats_daily', function (Blueprint $table) {
            // Esta línea sirve para agregar el id autoincremental.
            $table->id();
            // Esta línea sirve para agregar el usuario (se borra junto con el usuario).
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            // Esta línea sirve para agregar la fecha.
            $table->date('stat_date');
            // Esta línea sirve para agregar la cantidad de entrenamientos.
            $table->unsignedSmallInteger('workouts_count')->default(0);
            // Esta línea sirve para agregar el total de series.
            $table->unsignedSmallInteger('total_sets')->default(0);
            // Esta línea sirve para agregar el volumen total en kilos.
            $table->decimal('total_volume_kg', 10, 2)->default(0);
            // Esta línea sirve para agregar los minutos de entrenamiento.
            $table->unsignedSmallInteger('training_minutes')->default(0);
            // Esta línea sirve para agregar la racha actual en días.
            $table->unsignedSmallInteger('current_streak_days')->default(0);
            // Esta línea sirve para agregar las fechas de creación y actualización.
            $table->timestamps();

            // Esta línea sirve para impedir más de una fila por usuario y día.
            $table->unique(['user_id', 'stat_date']);
        });
    }

    // Esta línea sirve para declarar el método que revierte la migración.
    public function down(): void
    {
        // Esta línea sirve para borrar la tabla si existe.
        Schema::dropIfExists('user_stats_daily');
    }
};
