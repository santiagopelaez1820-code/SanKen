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
        // Hace también de "barcode_cache" (mencionado como tabla aparte en el
        // boceto original de docs/02) — un lookup por barcode o texto primero
        // busca acá, y solo pega contra Open Food Facts en un miss, cacheando
        // el resultado. Una sola tabla, no dos.
        // Esta línea sirve para crear la tabla food_items.
        Schema::create('food_items', function (Blueprint $table) {
            // Esta línea sirve para agregar el id autoincremental.
            $table->id();
            // Esta línea sirve para agregar el código de barras (opcional y único).
            $table->string('barcode')->nullable()->unique();
            // Esta línea sirve para agregar el nombre.
            $table->string('name');
            // Esta línea sirve para agregar la marca (opcional).
            $table->string('brand')->nullable();
            // Esta línea sirve para agregar las calorías por 100 g.
            $table->decimal('calories_per_100g', 8, 2);
            // Esta línea sirve para agregar la proteína por 100 g.
            $table->decimal('protein_per_100g', 8, 2);
            // Esta línea sirve para agregar los carbohidratos por 100 g.
            $table->decimal('carbs_per_100g', 8, 2);
            // Esta línea sirve para agregar la grasa por 100 g.
            $table->decimal('fat_per_100g', 8, 2);
            // Esta línea sirve para agregar el origen del dato (Open Food Facts por defecto).
            $table->string('source', 20)->default('open_food_facts');
            // Esta línea sirve para agregar el id en el origen (opcional).
            $table->string('source_id')->nullable();
            // Esta línea sirve para agregar las fechas de creación y actualización.
            $table->timestamps();
        });
    }

    // Esta línea sirve para declarar el método que revierte la migración.
    public function down(): void
    {
        // Esta línea sirve para borrar la tabla si existe.
        Schema::dropIfExists('food_items');
    }
};
