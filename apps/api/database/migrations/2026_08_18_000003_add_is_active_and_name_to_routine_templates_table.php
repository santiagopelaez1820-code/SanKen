<?php

// Esta línea sirve para importar la clase base de las migraciones.
use Illuminate\Database\Migrations\Migration;
// Esta línea sirve para importar Blueprint para definir las columnas.
use Illuminate\Database\Schema\Blueprint;
// Esta línea sirve para importar la fachada Schema para crear y modificar tablas.
use Illuminate\Support\Facades\Schema;

/**
 * `is_active` default true: las 8 plantillas ya sembradas quedan activas
 * sin tocar una sola fila. Se quita el unique(sex,frequency_days) — Super
 * Admin ahora puede duplicar una plantilla (queda inactiva hasta que se
 * active a propósito), así que puede haber más de una fila por combinación
 * mientras solo UNA esté is_active=true; esa unicidad la garantiza
 * AdminRoutineTemplateController::activate() en una transacción, mismo
 * patrón que ya usa el proyecto para `routines.is_active`.
 */
// Esta línea sirve para devolver una migración anónima.
return new class extends Migration
{
    // Esta línea sirve para declarar el método que aplica la migración.
    public function up(): void
    {
        // Esta línea sirve para modificar la tabla routine_templates.
        Schema::table('routine_templates', function (Blueprint $table) {
            // Esta línea sirve para agregar el nombre (opcional, hasta 150 caracteres).
            $table->string('name', 150)->nullable()->after('id');
            // Esta línea sirve para agregar si está activa (sí por defecto).
            $table->boolean('is_active')->default(true)->after('split_type');
        });

        // Esta línea sirve para modificar la tabla routine_templates.
        Schema::table('routine_templates', function (Blueprint $table) {
            // Esta línea sirve para quitar la restricción de unicidad por sexo y frecuencia.
            $table->dropUnique(['sex', 'frequency_days']);
            // Esta línea sirve para agregar un índice simple por sexo y frecuencia.
            $table->index(['sex', 'frequency_days']);
        });
    }

    // Esta línea sirve para declarar el método que revierte la migración.
    public function down(): void
    {
        // No es seguro revertir el unique si ya existen duplicados activos
        // vía "duplicar" — ver nota de riesgo en el plan de esta feature.
        // Esta línea sirve para modificar la tabla routine_templates.
        Schema::table('routine_templates', function (Blueprint $table) {
            // Esta línea sirve para borrar el índice simple.
            $table->dropIndex(['sex', 'frequency_days']);
            // Esta línea sirve para volver a agregar la restricción de unicidad.
            $table->unique(['sex', 'frequency_days']);
        });

        // Esta línea sirve para modificar la tabla routine_templates.
        Schema::table('routine_templates', function (Blueprint $table) {
            // Esta línea sirve para borrar las columnas name e is_active.
            $table->dropColumn(['name', 'is_active']);
        });
    }
};
