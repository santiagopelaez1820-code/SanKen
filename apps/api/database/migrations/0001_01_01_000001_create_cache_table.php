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
    /**
     * Run the migrations.
     */
    // Esta línea sirve para declarar el método que aplica la migración.
    public function up(): void
    {
        // Esta línea sirve para crear la tabla de caché.
        Schema::create('cache', function (Blueprint $table) {
            // Esta línea sirve para agregar la clave como clave primaria.
            $table->string('key')->primary();
            // Esta línea sirve para agregar el valor.
            $table->mediumText('value');
            // Esta línea sirve para agregar el vencimiento (indexado).
            $table->integer('expiration')->index();
        });

        // Esta línea sirve para crear la tabla de bloqueos de la caché.
        Schema::create('cache_locks', function (Blueprint $table) {
            // Esta línea sirve para agregar la clave como clave primaria.
            $table->string('key')->primary();
            // Esta línea sirve para agregar el dueño del bloqueo.
            $table->string('owner');
            // Esta línea sirve para agregar el vencimiento (indexado).
            $table->integer('expiration')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    // Esta línea sirve para declarar el método que revierte la migración.
    public function down(): void
    {
        // Esta línea sirve para borrar la tabla de caché si existe.
        Schema::dropIfExists('cache');
        // Esta línea sirve para borrar la tabla de bloqueos si existe.
        Schema::dropIfExists('cache_locks');
    }
};
