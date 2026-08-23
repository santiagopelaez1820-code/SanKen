<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * "Saltar entrenamiento" (seccion 4 del pedido) es un estado distinto de
 * completar uno — no debe registrar ejercicios/series/pesos ni tocar la
 * sobrecarga progresiva. `completed` sigue siendo boolean plano (no se
 * convierte a un enum de estado para no tocar todos los lugares que ya lo
 * leen como boolean estricto), esto es aditivo.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('workout_sessions', function (Blueprint $table) {
            $table->timestamp('skipped_at')->nullable()->after('completed_as_planned');
        });
    }

    public function down(): void
    {
        Schema::table('workout_sessions', function (Blueprint $table) {
            $table->dropColumn('skipped_at');
        });
    }
};
