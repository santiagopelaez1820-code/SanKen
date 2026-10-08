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
        // Esta línea sirve para crear la tabla user_achievements.
        Schema::create('user_achievements', function (Blueprint $table) {
            // Esta línea sirve para agregar el id autoincremental.
            $table->id();
            // Esta línea sirve para agregar el usuario (se borra junto con el usuario).
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            // Esta línea sirve para agregar el logro (se borra junto con el logro).
            $table->foreignId('achievement_id')->constrained()->cascadeOnDelete();
            // Esta línea sirve para agregar cuándo se desbloqueó.
            $table->timestamp('achieved_at');
            // Esta línea sirve para agregar las fechas de creación y actualización.
            $table->timestamps();

            // Esta línea sirve para impedir desbloquear dos veces el mismo logro.
            $table->unique(['user_id', 'achievement_id']);
        });
    }

    // Esta línea sirve para declarar el método que revierte la migración.
    public function down(): void
    {
        // Esta línea sirve para borrar la tabla si existe.
        Schema::dropIfExists('user_achievements');
    }
};
