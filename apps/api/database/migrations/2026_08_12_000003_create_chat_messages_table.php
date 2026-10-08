<?php

// Esta línea sirve para importar la clase base de las migraciones.
use Illuminate\Database\Migrations\Migration;
// Esta línea sirve para importar Blueprint para definir las columnas.
use Illuminate\Database\Schema\Blueprint;
// Esta línea sirve para importar la fachada Schema para crear y modificar tablas.
use Illuminate\Support\Facades\Schema;

// Esta línea sirve para devolver una migración anónima.
return new class extends Migration
{
    // Esta línea sirve para declarar el método que aplica la migración.
    public function up(): void
    {
        // Esta línea sirve para crear la tabla chat_messages.
        Schema::create('chat_messages', function (Blueprint $table) {
            // Esta línea sirve para agregar el id autoincremental.
            $table->id();
            // Esta línea sirve para agregar la conversación (se borra junto con la conversación).
            $table->foreignId('conversation_id')->constrained('chat_conversations')->cascadeOnDelete();
            // Esta línea sirve para agregar quién lo envió (se borra junto con el usuario).
            $table->foreignId('sender_id')->constrained('users')->cascadeOnDelete();
            // Esta línea sirve para agregar el texto.
            $table->text('body');
            // Esta línea sirve para agregar cuándo se leyó (opcional).
            $table->timestamp('read_at')->nullable();
            // Esta línea sirve para agregar las fechas de creación y actualización.
            $table->timestamps();

            // Esta línea sirve para agregar un índice por conversación y fecha.
            $table->index(['conversation_id', 'created_at']);
        });
    }

    // Esta línea sirve para declarar el método que revierte la migración.
    public function down(): void
    {
        // Esta línea sirve para borrar la tabla si existe.
        Schema::dropIfExists('chat_messages');
    }
};
