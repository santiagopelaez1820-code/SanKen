<?php

// Esta línea sirve para importar la clase base de las migraciones.
use Illuminate\Database\Migrations\Migration;
// Esta línea sirve para importar Blueprint para definir las columnas.
use Illuminate\Database\Schema\Blueprint;
// Esta línea sirve para importar la fachada Schema para crear y modificar tablas.
use Illuminate\Support\Facades\Schema;

/**
 * Estado explícito para "el usuario salió de un entrenamiento sin
 * terminarlo" — antes no existía ninguna forma de distinguir esto de una
 * sesión simplemente abandonada en el limbo (completed=false para
 * siempre, sin ninguna marca). Ver CancelWorkoutSessionAction: nunca pone
 * completed=true, así que nunca dispara feedback/sobrecarga progresiva ni
 * cuenta como entrenada en el calendario (que ya filtra por completed).
 */
// Esta línea sirve para devolver una migración anónima.
return new class extends Migration
{
    // Esta línea sirve para declarar el método que aplica la migración.
    public function up(): void
    {
        // Esta línea sirve para modificar la tabla workout_sessions.
        Schema::table('workout_sessions', function (Blueprint $table) {
            // Esta línea sirve para agregar cuándo se canceló (opcional).
            $table->timestamp('cancelled_at')->nullable()->after('skipped_at');
        });
    }

    // Esta línea sirve para declarar el método que revierte la migración.
    public function down(): void
    {
        // Esta línea sirve para modificar la tabla workout_sessions.
        Schema::table('workout_sessions', function (Blueprint $table) {
            // Esta línea sirve para borrar la columna cancelled_at.
            $table->dropColumn('cancelled_at');
        });
    }
};
