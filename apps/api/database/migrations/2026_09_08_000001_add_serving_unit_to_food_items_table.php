<?php

// Esta línea sirve para importar la clase base de las migraciones.
use Illuminate\Database\Migrations\Migration;
// Esta línea sirve para importar Blueprint para definir las columnas.
use Illuminate\Database\Schema\Blueprint;
// Esta línea sirve para importar la fachada Schema para crear y modificar tablas.
use Illuminate\Support\Facades\Schema;

/**
 * El front de nutrición mostraba únicamente gramos ("150g"), que no dice
 * nada intuitivo sobre la porción real. Estas columnas dejan que el
 * catálogo curado (food_items.source='manual') declare su unidad natural
 * (p.ej. "huevo" a 50g) para que el front pueda mostrar "2 huevos" además
 * del gramaje. Nullable porque solo se completa para el catálogo curado —
 * los productos de Open Food Facts (barcode/búsqueda) no tienen una unidad
 * natural conocida y siguen mostrándose solo en gramos.
 */
// Esta línea sirve para devolver una migración anónima.
return new class extends Migration
{
    // Esta línea sirve para declarar el método que aplica la migración.
    public function up(): void
    {
        // Esta línea sirve para modificar la tabla food_items.
        Schema::table('food_items', function (Blueprint $table) {
            // Esta línea sirve para agregar el tamaño de la porción en gramos (opcional).
            $table->decimal('serving_size_grams', 6, 2)->nullable()->after('fat_per_100g');
            // Esta línea sirve para agregar el nombre de la unidad en singular (opcional).
            $table->string('serving_unit_singular', 40)->nullable()->after('serving_size_grams');
            // Esta línea sirve para agregar el nombre de la unidad en plural (opcional).
            $table->string('serving_unit_plural', 40)->nullable()->after('serving_unit_singular');
        });
    }

    // Esta línea sirve para declarar el método que revierte la migración.
    public function down(): void
    {
        // Esta línea sirve para modificar la tabla food_items.
        Schema::table('food_items', function (Blueprint $table) {
            // Esta línea sirve para borrar las tres columnas.
            $table->dropColumn(['serving_size_grams', 'serving_unit_singular', 'serving_unit_plural']);
        });
    }
};
