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
        // Esta línea sirve para crear la tabla news_promotions.
        Schema::create('news_promotions', function (Blueprint $table) {
            // Esta línea sirve para agregar el id autoincremental.
            $table->id();
            // Esta línea sirve para agregar el admin que la creó (se borra junto con el usuario).
            $table->foreignId('admin_id')->constrained('users')->cascadeOnDelete();
            // Esta línea sirve para agregar el título.
            $table->string('title');
            // Esta línea sirve para agregar el cuerpo.
            $table->text('body');
            // Esta línea sirve para agregar la URL de la imagen (opcional).
            $table->string('image_url')->nullable();
            // Esta línea sirve para agregar la fecha de publicación (opcional).
            $table->timestamp('published_at')->nullable();
            // Esta línea sirve para agregar las fechas de creación y actualización.
            $table->timestamps();
        });
    }

    // Esta línea sirve para declarar el método que revierte la migración.
    public function down(): void
    {
        // Esta línea sirve para borrar la tabla si existe.
        Schema::dropIfExists('news_promotions');
    }
};
