<?php

// Esta línea sirve para importar la clase base de las migraciones.
use Illuminate\Database\Migrations\Migration;
// Esta línea sirve para importar Blueprint para definir las columnas.
use Illuminate\Database\Schema\Blueprint;
// Esta línea sirve para importar la fachada Schema para crear y modificar tablas.
use Illuminate\Support\Facades\Schema;

/**
 * TemplateRoutineGenerator elegía plantilla solo por sexo+frecuencia,
 * ignorando el nivel (beginner/intermediate/advanced) que ya se recolecta
 * en el onboarding — dos usuarios del mismo sexo y frecuencia recibían la
 * rutina idéntica sin importar su nivel. `default('intermediate')` deja
 * las 8 plantillas ya sembradas re-etiquetadas automáticamente (su
 * contenido ya es una buena línea base intermedia) sin tocarlas a mano.
 *
 * Igual que is_active/name (ver 2026_08_18_000003): sin unique constraint
 * — "una plantilla activa por sexo+frecuencia+nivel" se sigue garantizando
 * en la capa de aplicación (AdminRoutineTemplateController::activate()),
 * ahora sobre 3 columnas en vez de 2.
 */
// Esta línea sirve para devolver una migración anónima.
return new class extends Migration
{
    // Esta línea sirve para declarar el método que aplica la migración.
    public function up(): void
    {
        // Esta línea sirve para modificar la tabla routine_templates.
        Schema::table('routine_templates', function (Blueprint $table) {
            // Esta línea sirve para agregar el nivel con sus valores permitidos.
            $table->enum('level', ['beginner', 'intermediate', 'advanced'])
                // Esta línea sirve para dejar "intermediate" como valor por defecto.
                ->default('intermediate')
                // Esta línea sirve para ubicar la columna después de la frecuencia.
                ->after('frequency_days');
        });

        // Esta línea sirve para modificar la tabla routine_templates.
        Schema::table('routine_templates', function (Blueprint $table) {
            // Esta línea sirve para borrar el índice por sexo y frecuencia.
            $table->dropIndex(['sex', 'frequency_days']);
            // Esta línea sirve para agregar un índice por sexo, frecuencia y nivel.
            $table->index(['sex', 'frequency_days', 'level']);
        });
    }

    // Esta línea sirve para declarar el método que revierte la migración.
    public function down(): void
    {
        // Esta línea sirve para modificar la tabla routine_templates.
        Schema::table('routine_templates', function (Blueprint $table) {
            // Esta línea sirve para borrar el índice por sexo, frecuencia y nivel.
            $table->dropIndex(['sex', 'frequency_days', 'level']);
            // Esta línea sirve para volver a agregar el índice por sexo y frecuencia.
            $table->index(['sex', 'frequency_days']);
        });

        // Esta línea sirve para modificar la tabla routine_templates.
        Schema::table('routine_templates', function (Blueprint $table) {
            // Esta línea sirve para borrar la columna level.
            $table->dropColumn('level');
        });
    }
};
