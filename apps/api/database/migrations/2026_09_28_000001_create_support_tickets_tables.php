<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Solicitudes de soporte (dudas, reclamos, observaciones...) con su
 * conversación, y el check-in semanal. Separado del chat entrenador-cliente
 * (chat_conversations está atado 1:1 a trainer_clients) — ver
 * docs/09-soporte-y-checkin.md.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('weekly_checkins', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            // Semana ISO en la zona de config('support.checkin.timezone'), ej. "2026-W39".
            $table->string('week', 8);
            // pending (creado, sin responder), postponed ("Ahora no"),
            // dismissed (se agotaron los "Ahora no" de la semana), answered.
            $table->string('status', 20)->default('pending');
            $table->string('mood', 20)->nullable();
            $table->string('topic', 20)->nullable();
            $table->unsignedTinyInteger('postpone_count')->default(0);
            $table->timestamp('postponed_until')->nullable();
            $table->timestamp('notified_at')->nullable();
            $table->timestamp('shown_at')->nullable();
            $table->timestamp('answered_at')->nullable();
            // Contexto mínimo de entrenamiento de esa semana (rutina activa,
            // sesiones completadas) — preparado para personalizar rutinas.
            $table->json('context')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'week']);
            $table->index(['week', 'status']);
        });

        Schema::create('support_tickets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('type', 30);
            $table->string('subject', 150);
            $table->string('status', 20)->default('open');
            $table->string('priority', 10)->default('normal');
            $table->string('source', 20)->default('app');
            $table->foreignId('weekly_checkin_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
            $table->json('context')->nullable();
            $table->timestamp('last_message_at')->nullable();
            $table->boolean('last_message_by_staff')->default(false);
            $table->timestamp('first_response_at')->nullable();
            $table->timestamp('resolved_at')->nullable();
            $table->timestamp('closed_at')->nullable();
            $table->timestamps();

            $table->index(['status', 'last_message_at']);
            $table->index(['user_id', 'last_message_at']);
            $table->index('type');
        });

        Schema::create('support_ticket_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('support_ticket_id')->constrained()->cascadeOnDelete();
            // nullOnDelete: si se elimina la cuenta del miembro del equipo que
            // respondió, la respuesta sigue en el historial del usuario.
            $table->foreignId('author_id')->nullable()->constrained('users')->nullOnDelete();
            $table->boolean('is_staff')->default(false);
            $table->text('body');
            $table->timestamps();

            $table->index(['support_ticket_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('support_ticket_messages');
        Schema::dropIfExists('support_tickets');
        Schema::dropIfExists('weekly_checkins');
    }
};
