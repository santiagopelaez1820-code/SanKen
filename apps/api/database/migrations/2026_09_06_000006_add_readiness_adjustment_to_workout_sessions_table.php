<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Guarda si StartWorkoutSessionAction autorreguló esta sesión (bajó series/
 * peso/RPE) a partir del precheck (sleep_quality/energy_level/muscle_soreness)
 * + nivel del usuario — ver SessionReadinessAdjuster. Se persiste en vez de
 * recalcularse en el resource porque es una decisión tomada una sola vez, al
 * arrancar la sesión, no algo derivable después (el usuario puede loguear
 * series con pesos distintos al sugerido sin que eso cambie el motivo).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('workout_sessions', function (Blueprint $table) {
            $table->boolean('readiness_adjusted')->default(false)->after('muscle_soreness');
            $table->string('readiness_note')->nullable()->after('readiness_adjusted');
        });
    }

    public function down(): void
    {
        Schema::table('workout_sessions', function (Blueprint $table) {
            $table->dropColumn(['readiness_adjusted', 'readiness_note']);
        });
    }
};
