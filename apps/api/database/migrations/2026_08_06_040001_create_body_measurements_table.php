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
        // Esta línea sirve para crear la tabla body_measurements.
        Schema::create('body_measurements', function (Blueprint $table) {
            // Esta línea sirve para agregar el id autoincremental.
            $table->id();
            // Esta línea sirve para agregar el usuario (se borra junto con el usuario).
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            // Esta línea sirve para agregar la fecha de la medición.
            $table->date('measured_at');
            // Esta línea sirve para agregar el peso (opcional).
            $table->decimal('weight_kg', 5, 2)->nullable();
            // Esta línea sirve para agregar el porcentaje de grasa (opcional).
            $table->decimal('body_fat_pct', 4, 1)->nullable();
            // Esta línea sirve para agregar el pecho (opcional).
            $table->decimal('chest_cm', 5, 1)->nullable();
            // Esta línea sirve para agregar la cintura (opcional).
            $table->decimal('waist_cm', 5, 1)->nullable();
            // Esta línea sirve para agregar la cadera (opcional).
            $table->decimal('hip_cm', 5, 1)->nullable();
            // Esta línea sirve para agregar el brazo (opcional).
            $table->decimal('arm_cm', 5, 1)->nullable();
            // Esta línea sirve para agregar el muslo (opcional).
            $table->decimal('thigh_cm', 5, 1)->nullable();
            // Esta línea sirve para agregar la URL de la foto de progreso (opcional).
            $table->string('progress_photo_url')->nullable();
            // Esta línea sirve para agregar las fechas de creación y actualización.
            $table->timestamps();

            // Esta línea sirve para agregar un índice por usuario y fecha.
            $table->index(['user_id', 'measured_at']);
        });
    }

    // Esta línea sirve para declarar el método que revierte la migración.
    public function down(): void
    {
        // Esta línea sirve para borrar la tabla si existe.
        Schema::dropIfExists('body_measurements');
    }
};
