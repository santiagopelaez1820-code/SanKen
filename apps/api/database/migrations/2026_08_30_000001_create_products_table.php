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
        // Esta línea sirve para crear la tabla products.
        Schema::create('products', function (Blueprint $table) {
            // Esta línea sirve para agregar el id autoincremental.
            $table->id();
            // Esta línea sirve para agregar el nombre.
            $table->string('name');
            // Esta línea sirve para agregar el slug único.
            $table->string('slug')->unique();
            // Esta línea sirve para agregar la descripción.
            $table->text('description');
            // Esta línea sirve para agregar la descripción corta.
            $table->string('short_description');
            // Esta línea sirve para agregar la imagen (opcional).
            $table->string('image')->nullable();
            // Esta línea sirve para agregar la categoría ("other" por defecto).
            $table->enum('category', ['protein', 'creatine', 'pre_workout', 'amino_acids', 'vitamins', 'other'])->default('other');
            // Esta línea sirve para agregar el precio.
            $table->decimal('price', 10, 2);
            // Esta línea sirve para agregar si está activo (sí por defecto).
            $table->boolean('active')->default(true);
            // Esta línea sirve para agregar la referencia de Dropi (opcional).
            $table->string('dropi_reference')->nullable();
            // Esta línea sirve para agregar las fechas de creación y actualización.
            $table->timestamps();

            // Esta línea sirve para agregar un índice por categoría y estado.
            $table->index(['category', 'active']);
        });
    }

    // Esta línea sirve para declarar el método que revierte la migración.
    public function down(): void
    {
        // Esta línea sirve para borrar la tabla si existe.
        Schema::dropIfExists('products');
    }
};
