<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Reemplaza el CALENDAR_EVENTS genérico del ERD original (docs/02):
        // solo los recordatorios creados a mano por el usuario necesitan
        // persistencia — "planeado" (hoy) y "completado" se arman al leer,
        // a partir de routines/workout_sessions ya existentes (ver
        // CalendarController), evitando datos duplicados y desincronizados.
        Schema::create('calendar_reminders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->date('event_date');
            $table->string('title');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'event_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('calendar_reminders');
    }
};
