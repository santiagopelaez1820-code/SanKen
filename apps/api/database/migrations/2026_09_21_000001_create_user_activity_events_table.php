<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Base del panel "Analítica de uso" (Super Admin). A diferencia de
 * users.last_active_at (un solo timestamp que se pisa, ver TouchLastActive),
 * esta tabla guarda un historial liviano para poder armar la gráfica por
 * hora/día y las comparaciones contra el período anterior.
 *
 * Crece acotado a propósito, no una fila por request:
 * - 'heartbeat': como mucho 1 fila por usuario por hora-calendario (ver
 *   TouchLastActive) — cubre "usuarios activos" (únicos, por COUNT DISTINCT).
 * - 'login': 1 fila por inicio de sesión real (login/registro/social/2FA),
 *   sin throttle — cubre "sesiones/ingresos", que sí puede repetirse varias
 *   veces por usuario en el mismo período a propósito.
 *
 * `activity_date` va aparte de `occurred_at` (no se deriva con DATE() en la
 * query) para poder indexarla directo y agrupar por día sin funciones sobre
 * columna indexada.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_activity_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('event_type', 20);
            $table->string('platform', 10)->nullable();
            $table->timestamp('occurred_at');
            $table->date('activity_date');

            $table->index(['activity_date', 'user_id']);
            $table->index(['event_type', 'activity_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_activity_events');
    }
};
