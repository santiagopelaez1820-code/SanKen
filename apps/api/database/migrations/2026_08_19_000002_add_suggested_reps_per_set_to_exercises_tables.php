<?php

// Esta línea sirve para importar la clase base de las migraciones.
use Illuminate\Database\Migrations\Migration;
// Esta línea sirve para importar Blueprint para definir las columnas.
use Illuminate\Database\Schema\Blueprint;
// Esta línea sirve para importar la fachada Schema para crear y modificar tablas.
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
// Esta línea sirve para devolver una migración anónima.
return new class extends Migration
{
    // Esta línea sirve para declarar el método que aplica la migración.
    public function up(): void
    {
        // Esta línea sirve para modificar la tabla routine_exercises.
        Schema::table('routine_exercises', function (Blueprint $table) {
            // Esta línea sirve para agregar las repeticiones sugeridas por serie en JSON (opcional).
            $table->json('suggested_reps_per_set')->nullable()->after('suggested_weight_kg');
        });

        // Esta línea sirve para modificar la tabla workout_exercises.
        Schema::table('workout_exercises', function (Blueprint $table) {
            // Esta línea sirve para agregar las repeticiones sugeridas por serie en JSON (opcional).
            $table->json('suggested_reps_per_set')->nullable()->after('suggested_weight_kg');
        });
    }

    // Esta línea sirve para declarar el método que revierte la migración.
    public function down(): void
    {
        // Esta línea sirve para modificar la tabla routine_exercises.
        Schema::table('routine_exercises', function (Blueprint $table) {
            // Esta línea sirve para borrar la columna suggested_reps_per_set.
            $table->dropColumn('suggested_reps_per_set');
        });

        // Esta línea sirve para modificar la tabla workout_exercises.
        Schema::table('workout_exercises', function (Blueprint $table) {
            // Esta línea sirve para borrar la columna suggested_reps_per_set.
            $table->dropColumn('suggested_reps_per_set');
        });
    }
};
