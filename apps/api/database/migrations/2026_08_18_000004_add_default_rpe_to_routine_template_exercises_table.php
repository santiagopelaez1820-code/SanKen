<?php

// Esta línea sirve para importar la clase base de las migraciones.
use Illuminate\Database\Migrations\Migration;
// Esta línea sirve para importar Blueprint para definir las columnas.
use Illuminate\Database\Schema\Blueprint;
// Esta línea sirve para importar la fachada Schema para crear y modificar tablas.
use Illuminate\Support\Facades\Schema;

/**
 * Nullable a propósito: las plantillas ya sembradas quedan en null y
 * TemplateRoutineGenerator sigue generando 8.0 exactamente como hoy
 * (`$templateExercise->default_rpe ?? 8.0`) — recién un ejercicio de
 * plantilla editado/creado desde Super Admin puede fijar un valor propio.
 */
// Esta línea sirve para devolver una migración anónima.
return new class extends Migration
{
    // Esta línea sirve para declarar el método que aplica la migración.
    public function up(): void
    {
        // Esta línea sirve para modificar la tabla routine_template_exercises.
        Schema::table('routine_template_exercises', function (Blueprint $table) {
            // Esta línea sirve para agregar el RPE por defecto (opcional).
            $table->decimal('default_rpe', 3, 1)->nullable()->after('rest_seconds');
        });
    }

    // Esta línea sirve para declarar el método que revierte la migración.
    public function down(): void
    {
        // Esta línea sirve para modificar la tabla routine_template_exercises.
        Schema::table('routine_template_exercises', function (Blueprint $table) {
            // Esta línea sirve para borrar la columna default_rpe.
            $table->dropColumn('default_rpe');
        });
    }
};
