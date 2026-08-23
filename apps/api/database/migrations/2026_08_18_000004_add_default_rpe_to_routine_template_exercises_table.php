<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Nullable a propósito: las plantillas ya sembradas quedan en null y
 * TemplateRoutineGenerator sigue generando 8.0 exactamente como hoy
 * (`$templateExercise->default_rpe ?? 8.0`) — recién un ejercicio de
 * plantilla editado/creado desde Super Admin puede fijar un valor propio.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('routine_template_exercises', function (Blueprint $table) {
            $table->decimal('default_rpe', 3, 1)->nullable()->after('rest_seconds');
        });
    }

    public function down(): void
    {
        Schema::table('routine_template_exercises', function (Blueprint $table) {
            $table->dropColumn('default_rpe');
        });
    }
};
