<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Sobrecarga progresiva rediseñada: antes solo se sugería un peso
 * (suggested_weight_kg, columna escalar) porque target_reps era un rango
 * fijo que nunca cambiaba. Ahora la progresión primero rampea las
 * repeticiones SERIE POR SERIE (ver ProgressiveOverloadCalculator) hasta
 * un techo de 12, y recién ahí sube el peso — necesita un objetivo por
 * serie, no un escalar. JSON array de enteros, largo = target_sets,
 * índice 0 = serie 1. Nullable: null significa "todavía no hay objetivo
 * de reps" (antes de la primera sesión, se pide entrada manual).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('routine_exercises', function (Blueprint $table) {
            $table->json('suggested_reps_per_set')->nullable()->after('suggested_weight_kg');
        });

        Schema::table('workout_exercises', function (Blueprint $table) {
            $table->json('suggested_reps_per_set')->nullable()->after('suggested_weight_kg');
        });
    }

    public function down(): void
    {
        Schema::table('routine_exercises', function (Blueprint $table) {
            $table->dropColumn('suggested_reps_per_set');
        });

        Schema::table('workout_exercises', function (Blueprint $table) {
            $table->dropColumn('suggested_reps_per_set');
        });
    }
};
