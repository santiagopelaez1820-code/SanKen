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
        // Esta línea sirve para crear la tabla user_xp.
        Schema::create('user_xp', function (Blueprint $table) {
            // Esta línea sirve para agregar el id autoincremental.
            $table->id();
            // Esta línea sirve para agregar el usuario (único; se borra junto con el usuario).
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            // Esta línea sirve para agregar la XP total (0 por defecto).
            $table->unsignedInteger('total_xp')->default(0);
            // Esta línea sirve para agregar las fechas de creación y actualización.
            $table->timestamps();
        });
    }

    // Esta línea sirve para declarar el método que revierte la migración.
    public function down(): void
    {
        // Esta línea sirve para borrar la tabla si existe.
        Schema::dropIfExists('user_xp');
    }
};
