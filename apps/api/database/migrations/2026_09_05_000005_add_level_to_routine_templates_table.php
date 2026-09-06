<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
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
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('routine_templates', function (Blueprint $table) {
            $table->enum('level', ['beginner', 'intermediate', 'advanced'])
                ->default('intermediate')
                ->after('frequency_days');
        });

        Schema::table('routine_templates', function (Blueprint $table) {
            $table->dropIndex(['sex', 'frequency_days']);
            $table->index(['sex', 'frequency_days', 'level']);
        });
    }

    public function down(): void
    {
        Schema::table('routine_templates', function (Blueprint $table) {
            $table->dropIndex(['sex', 'frequency_days', 'level']);
            $table->index(['sex', 'frequency_days']);
        });

        Schema::table('routine_templates', function (Blueprint $table) {
            $table->dropColumn('level');
        });
    }
};
