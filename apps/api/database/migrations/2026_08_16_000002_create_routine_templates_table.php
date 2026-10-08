<?php

// Esta línea sirve para importar la clase base de las migraciones.
use Illuminate\Database\Migrations\Migration;
// Esta línea sirve para importar Blueprint para definir las columnas.
use Illuminate\Database\Schema\Blueprint;
// Esta línea sirve para importar la fachada Schema para crear y modificar tablas.
use Illuminate\Support\Facades\Schema;

/**
 * Plantillas curadas de rutina (sexo + días/semana -> estructura de días y
 * ejercicios), reemplazan la seleccion algoritmica (ExerciseSelector) como
 * camino principal de generacion. Ver TemplateRoutineGenerator.
 */
// Esta línea sirve para devolver una migración anónima.
return new class extends Migration
{
    // Esta línea sirve para declarar el método que aplica la migración.
    public function up(): void
    {
        // Esta línea sirve para crear la tabla routine_templates.
        Schema::create('routine_templates', function (Blueprint $table) {
            // Esta línea sirve para agregar el id autoincremental.
            $table->id();
            // Esta línea sirve para agregar el sexo.
            $table->enum('sex', ['male', 'female']);
            // Esta línea sirve para agregar la frecuencia semanal.
            $table->unsignedTinyInteger('frequency_days');
            // Esta línea sirve para agregar el tipo de división.
            $table->string('split_type', 30);
            // Esta línea sirve para agregar las fechas de creación y actualización.
            $table->timestamps();

            // Esta línea sirve para impedir dos plantillas con el mismo sexo y frecuencia.
            $table->unique(['sex', 'frequency_days']);
        });
    }

    // Esta línea sirve para declarar el método que revierte la migración.
    public function down(): void
    {
        // Esta línea sirve para borrar la tabla si existe.
        Schema::dropIfExists('routine_templates');
    }
};
