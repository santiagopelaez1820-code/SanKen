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
        // Esta línea sirve para crear la tabla exercises.
        Schema::create('exercises', function (Blueprint $table) {
            // Esta línea sirve para agregar el id autoincremental.
            $table->id();
            // Esta línea sirve para agregar el nombre.
            $table->string('name');
            // Esta línea sirve para agregar el músculo principal (impide borrar un músculo con ejercicios).
            $table->foreignId('primary_muscle_id')->constrained('muscle_groups')->restrictOnDelete();
            // Esta línea sirve para agregar el equipamiento con sus valores permitidos.
            $table->enum('equipment', [
                // Esta línea sirve para permitir barra, mancuernas, banco, rack y barra de dominadas.
                'barbell', 'dumbbells', 'bench', 'squat_rack', 'pull_up_bar',
                // Esta línea sirve para permitir poleas, máquinas, kettlebells, bandas y peso corporal.
                'cables', 'machines', 'kettlebells', 'resistance_bands', 'bodyweight_only',
            ]);
            // Esta línea sirve para agregar el nivel.
            $table->enum('level', ['beginner', 'intermediate', 'advanced']);
            // Esta línea sirve para agregar el tipo.
            $table->enum('type', ['compound', 'isolation', 'cardio', 'mobility']);
            // Esta línea sirve para agregar las instrucciones (opcional).
            $table->text('instructions')->nullable();
            // Esta línea sirve para agregar los errores comunes (opcional).
            $table->text('common_mistakes')->nullable();
            // Esta línea sirve para agregar los consejos (opcional).
            $table->text('tips')->nullable();
            // Esta línea sirve para agregar la URL del video (opcional).
            $table->string('video_url')->nullable();
            // Esta línea sirve para agregar la URL de la imagen (opcional).
            $table->string('image_url')->nullable();
            // Esta línea sirve para agregar si está activo.
            $table->boolean('is_active')->default(true);
            // Esta línea sirve para agregar las fechas de creación y actualización.
            $table->timestamps();

            // Esta línea sirve para agregar un índice para filtrar por músculo, equipamiento, nivel y estado.
            $table->index(['primary_muscle_id', 'equipment', 'level', 'is_active']);
        });
    }

    // Esta línea sirve para declarar el método que revierte la migración.
    public function down(): void
    {
        // Esta línea sirve para borrar la tabla si existe.
        Schema::dropIfExists('exercises');
    }
};
