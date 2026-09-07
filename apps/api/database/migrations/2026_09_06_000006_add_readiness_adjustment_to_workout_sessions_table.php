<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Guarda por qué StartWorkoutSessionAction autorreguló esta sesión (bajó
 * series/peso/RPE) a partir del precheck (sleep_quality/energy_level/
 * muscle_soreness) + nivel del usuario — ver SessionReadinessAdjuster. No
 * hay columna aparte para "se ajustó si/no": SessionReadinessAdjuster
 * siempre produce una nota junto con cualquier ajuste no neutro (y ninguna
 * si el ajuste es neutro), así que ese flag es 100% derivable de
 * `readiness_note !== null` — WorkoutSessionResource lo calcula así en vez
 * de guardar dos columnas que solo pueden quedar en el mismo estado.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('workout_sessions', function (Blueprint $table) {
            $table->string('readiness_note')->nullable()->after('muscle_soreness');
        });
    }

    public function down(): void
    {
        Schema::table('workout_sessions', function (Blueprint $table) {
            $table->dropColumn('readiness_note');
        });
    }
};
