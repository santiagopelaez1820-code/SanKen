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
        // Esta línea sirve para crear la tabla cities.
        Schema::create('cities', function (Blueprint $table) {
            // Esta línea sirve para agregar el id autoincremental.
            $table->id();
            // Esta línea sirve para agregar el país (impide borrar un país con ciudades).
            $table->foreignId('country_id')->constrained()->restrictOnDelete();
            // Esta línea sirve para agregar el nombre.
            $table->string('name');
            // Esta línea sirve para agregar las fechas de creación y actualización.
            $table->timestamps();

            // Esta línea sirve para impedir dos ciudades con el mismo nombre en un país.
            $table->unique(['country_id', 'name']);
        });
    }

    // Esta línea sirve para declarar el método que revierte la migración.
    public function down(): void
    {
        // Esta línea sirve para borrar la tabla si existe.
        Schema::dropIfExists('cities');
    }
};
