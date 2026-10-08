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
        // Esta línea sirve para crear la tabla trainer_clients.
        Schema::create('trainer_clients', function (Blueprint $table) {
            // Esta línea sirve para agregar el id autoincremental.
            $table->id();
            // Esta línea sirve para agregar el entrenador (se borra junto con el usuario).
            $table->foreignId('trainer_id')->constrained('users')->cascadeOnDelete();
            // Esta línea sirve para agregar el cliente (se borra junto con el usuario).
            $table->foreignId('client_id')->constrained('users')->cascadeOnDelete();
            // Esta línea sirve para agregar el estado (activo por defecto).
            $table->enum('status', ['pending', 'active', 'paused', 'ended'])->default('active');
            // Esta línea sirve para agregar la fecha de inicio (opcional).
            $table->timestamp('started_at')->nullable();
            // Esta línea sirve para agregar la fecha de fin (opcional).
            $table->timestamp('ended_at')->nullable();
            // Esta línea sirve para agregar las fechas de creación y actualización.
            $table->timestamps();

            // Esta línea sirve para agregar un índice por entrenador y estado.
            $table->index(['trainer_id', 'status']);
            // Esta línea sirve para agregar un índice por cliente y estado.
            $table->index(['client_id', 'status']);
        });
    }

    // Esta línea sirve para declarar el método que revierte la migración.
    public function down(): void
    {
        // Esta línea sirve para borrar la tabla si existe.
        Schema::dropIfExists('trainer_clients');
    }
};
