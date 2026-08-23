<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
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
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('routine_templates', function (Blueprint $table) {
            $table->string('name', 150)->nullable()->after('id');
            $table->boolean('is_active')->default(true)->after('split_type');
        });

        Schema::table('routine_templates', function (Blueprint $table) {
            $table->dropUnique(['sex', 'frequency_days']);
            $table->index(['sex', 'frequency_days']);
        });
    }

    public function down(): void
    {
        // No es seguro revertir el unique si ya existen duplicados activos
        // vía "duplicar" — ver nota de riesgo en el plan de esta feature.
        Schema::table('routine_templates', function (Blueprint $table) {
            $table->dropIndex(['sex', 'frequency_days']);
            $table->unique(['sex', 'frequency_days']);
        });

        Schema::table('routine_templates', function (Blueprint $table) {
            $table->dropColumn(['name', 'is_active']);
        });
    }
};
