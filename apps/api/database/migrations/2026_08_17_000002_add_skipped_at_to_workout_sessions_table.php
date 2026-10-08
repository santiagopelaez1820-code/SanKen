<?php

// Esta línea sirve para importar la clase base de las migraciones.
use Illuminate\Database\Migrations\Migration;
// Esta línea sirve para importar Blueprint para definir las columnas.
use Illuminate\Database\Schema\Blueprint;
// Esta línea sirve para importar la fachada Schema para crear y modificar tablas.
use Illuminate\Support\Facades\Schema;

/**
 * "Saltar entrenamiento" (seccion 4 del pedido) es un estado distinto de
 * completar uno — no debe registrar ejercicios/series/pesos ni tocar la
 * sobrecarga progresiva. `completed` sigue siendo boolean plano (no se
 * convierte a un enum de estado para no tocar todos los lugares que ya lo
 * leen como boolean estricto), esto es aditivo.
 */
// Esta línea sirve para devolver una migración anónima.
return new class extends Migration
{
    // Esta línea sirve para declarar el método que aplica la migración.
    public function up(): void
    {
        // Esta línea sirve para modificar la tabla workout_sessions.
        Schema::table('workout_sessions', function (Blueprint $table) {
            // Esta línea sirve para agregar cuándo se saltó (opcional).
            $table->timestamp('skipped_at')->nullable()->after('completed_as_planned');
        });
    }

    // Esta línea sirve para declarar el método que revierte la migración.
    public function down(): void
    {
        // Esta línea sirve para modificar la tabla workout_sessions.
        Schema::table('workout_sessions', function (Blueprint $table) {
            // Esta línea sirve para borrar la columna skipped_at.
            $table->dropColumn('skipped_at');
        });
    }
};
