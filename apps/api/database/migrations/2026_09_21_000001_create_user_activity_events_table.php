<?php

// Esta línea sirve para importar la clase base de las migraciones.
use Illuminate\Database\Migrations\Migration;
// Esta línea sirve para importar Blueprint para definir las columnas.
use Illuminate\Database\Schema\Blueprint;
// Esta línea sirve para importar la fachada Schema para crear y modificar tablas.
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
// Esta línea sirve para devolver una migración anónima.
return new class extends Migration
{
    // Esta línea sirve para declarar el método que aplica la migración.
    public function up(): void
    {
        // Esta línea sirve para crear la tabla user_activity_events.
        Schema::create('user_activity_events', function (Blueprint $table) {
            // Esta línea sirve para agregar el id autoincremental.
            $table->id();
            // Esta línea sirve para agregar el usuario (se borra junto con el usuario).
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            // Esta línea sirve para agregar el tipo de evento.
            $table->string('event_type', 20);
            // Esta línea sirve para agregar la plataforma (opcional).
            $table->string('platform', 10)->nullable();
            // Esta línea sirve para agregar el momento del evento.
            $table->timestamp('occurred_at');
            // Esta línea sirve para agregar la fecha del evento.
            $table->date('activity_date');

            // Esta línea sirve para agregar un índice por fecha y usuario.
            $table->index(['activity_date', 'user_id']);
            // Esta línea sirve para agregar un índice por tipo de evento y fecha.
            $table->index(['event_type', 'activity_date']);
        });
    }

    // Esta línea sirve para declarar el método que revierte la migración.
    public function down(): void
    {
        // Esta línea sirve para borrar la tabla si existe.
        Schema::dropIfExists('user_activity_events');
    }
};
