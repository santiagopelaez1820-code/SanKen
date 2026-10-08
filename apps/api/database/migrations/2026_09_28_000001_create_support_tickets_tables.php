<?php

// Esta línea sirve para importar la clase base de las migraciones.
use Illuminate\Database\Migrations\Migration;
// Esta línea sirve para importar Blueprint para definir las columnas.
use Illuminate\Database\Schema\Blueprint;
// Esta línea sirve para importar la fachada Schema para crear y modificar tablas.
use Illuminate\Support\Facades\Schema;

/**
 * Solicitudes de soporte (dudas, reclamos, observaciones...) con su
 * conversación, y el check-in semanal. Separado del chat entrenador-cliente
 * (chat_conversations está atado 1:1 a trainer_clients) — ver
 * docs/09-soporte-y-checkin.md.
 */
// Esta línea sirve para devolver una migración anónima.
return new class extends Migration
{
    // Esta línea sirve para declarar el método que aplica la migración.
    public function up(): void
    {
        // Esta línea sirve para crear la tabla weekly_checkins.
        Schema::create('weekly_checkins', function (Blueprint $table) {
            // Esta línea sirve para agregar el id autoincremental.
            $table->id();
            // Esta línea sirve para agregar el usuario (se borra junto con el usuario).
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            // Semana ISO en la zona de config('support.checkin.timezone'), ej. "2026-W39".
            // Esta línea sirve para agregar la semana ISO.
            $table->string('week', 8);
            // pending (creado, sin responder), postponed ("Ahora no"),
            // dismissed (se agotaron los "Ahora no" de la semana), answered.
            // Esta línea sirve para agregar el estado ("pending" por defecto).
            $table->string('status', 20)->default('pending');
            // Esta línea sirve para agregar el estado de ánimo (opcional).
            $table->string('mood', 20)->nullable();
            // Esta línea sirve para agregar el tema (opcional).
            $table->string('topic', 20)->nullable();
            // Esta línea sirve para agregar cuántas veces se pospuso.
            $table->unsignedTinyInteger('postpone_count')->default(0);
            // Esta línea sirve para agregar hasta cuándo se pospuso (opcional).
            $table->timestamp('postponed_until')->nullable();
            // Esta línea sirve para agregar cuándo se notificó (opcional).
            $table->timestamp('notified_at')->nullable();
            // Esta línea sirve para agregar cuándo se mostró (opcional).
            $table->timestamp('shown_at')->nullable();
            // Esta línea sirve para agregar cuándo se respondió (opcional).
            $table->timestamp('answered_at')->nullable();
            // Contexto mínimo de entrenamiento de esa semana (rutina activa,
            // sesiones completadas) — preparado para personalizar rutinas.
            // Esta línea sirve para agregar el contexto en JSON (opcional).
            $table->json('context')->nullable();
            // Esta línea sirve para agregar las fechas de creación y actualización.
            $table->timestamps();

            // Esta línea sirve para impedir dos check-ins del mismo usuario en la misma semana.
            $table->unique(['user_id', 'week']);
            // Esta línea sirve para agregar un índice por semana y estado.
            $table->index(['week', 'status']);
        });

        // Esta línea sirve para crear la tabla support_tickets.
        Schema::create('support_tickets', function (Blueprint $table) {
            // Esta línea sirve para agregar el id autoincremental.
            $table->id();
            // Esta línea sirve para agregar el usuario (se borra junto con el usuario).
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            // Esta línea sirve para agregar el tipo.
            $table->string('type', 30);
            // Esta línea sirve para agregar el asunto.
            $table->string('subject', 150);
            // Esta línea sirve para agregar el estado ("open" por defecto).
            $table->string('status', 20)->default('open');
            // Esta línea sirve para agregar la prioridad ("normal" por defecto).
            $table->string('priority', 10)->default('normal');
            // Esta línea sirve para agregar el origen ("app" por defecto).
            $table->string('source', 20)->default('app');
            // Esta línea sirve para agregar el check-in que la originó (opcional).
            $table->foreignId('weekly_checkin_id')->nullable()->constrained()->nullOnDelete();
            // Esta línea sirve para agregar el responsable asignado (opcional).
            $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
            // Esta línea sirve para agregar el contexto en JSON (opcional).
            $table->json('context')->nullable();
            // Esta línea sirve para agregar la fecha del último mensaje (opcional).
            $table->timestamp('last_message_at')->nullable();
            // Esta línea sirve para agregar si el último mensaje fue del equipo.
            $table->boolean('last_message_by_staff')->default(false);
            // Esta línea sirve para agregar la fecha de la primera respuesta (opcional).
            $table->timestamp('first_response_at')->nullable();
            // Esta línea sirve para agregar la fecha de resolución (opcional).
            $table->timestamp('resolved_at')->nullable();
            // Esta línea sirve para agregar la fecha de cierre (opcional).
            $table->timestamp('closed_at')->nullable();
            // Esta línea sirve para agregar las fechas de creación y actualización.
            $table->timestamps();

            // Esta línea sirve para agregar un índice por estado y último mensaje.
            $table->index(['status', 'last_message_at']);
            // Esta línea sirve para agregar un índice por usuario y último mensaje.
            $table->index(['user_id', 'last_message_at']);
            // Esta línea sirve para agregar un índice por tipo.
            $table->index('type');
        });

        // Esta línea sirve para crear la tabla support_ticket_messages.
        Schema::create('support_ticket_messages', function (Blueprint $table) {
            // Esta línea sirve para agregar el id autoincremental.
            $table->id();
            // Esta línea sirve para agregar la solicitud (se borra junto con la solicitud).
            $table->foreignId('support_ticket_id')->constrained()->cascadeOnDelete();
            // nullOnDelete: si se elimina la cuenta del miembro del equipo que
            // respondió, la respuesta sigue en el historial del usuario.
            // Esta línea sirve para agregar el autor (opcional; queda en null si se borra su cuenta).
            $table->foreignId('author_id')->nullable()->constrained('users')->nullOnDelete();
            // Esta línea sirve para agregar si lo escribió el equipo.
            $table->boolean('is_staff')->default(false);
            // Esta línea sirve para agregar el texto.
            $table->text('body');
            // Esta línea sirve para agregar las fechas de creación y actualización.
            $table->timestamps();

            // Esta línea sirve para agregar un índice por solicitud y fecha.
            $table->index(['support_ticket_id', 'created_at']);
        });
    }

    // Esta línea sirve para declarar el método que revierte la migración.
    public function down(): void
    {
        // Esta línea sirve para borrar la tabla de mensajes si existe.
        Schema::dropIfExists('support_ticket_messages');
        // Esta línea sirve para borrar la tabla de solicitudes si existe.
        Schema::dropIfExists('support_tickets');
        // Esta línea sirve para borrar la tabla de check-ins si existe.
        Schema::dropIfExists('weekly_checkins');
    }
};
