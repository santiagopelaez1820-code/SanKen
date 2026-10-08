<?php

// Esta línea sirve para importar la clase base de las migraciones.
use Illuminate\Database\Migrations\Migration;
// Esta línea sirve para importar Blueprint para definir las columnas.
use Illuminate\Database\Schema\Blueprint;
// Esta línea sirve para importar la fachada Schema para crear y modificar tablas.
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
// Esta línea sirve para devolver una migración anónima.
return new class extends Migration
{
    // Esta línea sirve para declarar el método que aplica la migración.
    public function up(): void
    {
        // Esta línea sirve para modificar la tabla workout_sessions.
        Schema::table('workout_sessions', function (Blueprint $table) {
            // Esta línea sirve para agregar la nota del ajuste por el precheck (opcional).
            $table->string('readiness_note')->nullable()->after('muscle_soreness');
        });
    }

    // Esta línea sirve para declarar el método que revierte la migración.
    public function down(): void
    {
        // Esta línea sirve para modificar la tabla workout_sessions.
        Schema::table('workout_sessions', function (Blueprint $table) {
            // Esta línea sirve para borrar la columna readiness_note.
            $table->dropColumn('readiness_note');
        });
    }
};
