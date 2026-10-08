<?php

// Esta línea sirve para importar la clase base de las migraciones.
use Illuminate\Database\Migrations\Migration;
// Esta línea sirve para importar Blueprint para definir las columnas.
use Illuminate\Database\Schema\Blueprint;
// Esta línea sirve para importar la fachada Schema para crear y modificar tablas.
use Illuminate\Support\Facades\Schema;

/**
 * Necesaria para el plan alimenticio (GenerateNutritionPlanAction) y la
 * sustitución de alimentos: agrupa alimentos por rol nutricional
 * (protein/carb/fat/vegetable/fruit/dairy) para poder armar comidas
 * balanceadas y sugerir alternativas "compatibles" (misma categoría) en
 * vez de una sustitución al azar. Solo se completa para el catálogo
 * curado (food_items.source='manual', ver FoodItemSeeder) — los productos
 * que vienen de Open Food Facts quedan con category=null, no participan
 * de la generación/sustitución del plan.
 */
// Esta línea sirve para devolver una migración anónima.
return new class extends Migration
{
    // Esta línea sirve para declarar el método que aplica la migración.
    public function up(): void
    {
        // Esta línea sirve para modificar la tabla food_items.
        Schema::table('food_items', function (Blueprint $table) {
            // Esta línea sirve para agregar la categoría (opcional).
            $table->string('category')->nullable()->after('brand');
            // Esta línea sirve para agregar un índice por categoría.
            $table->index('category');
        });
    }

    // Esta línea sirve para declarar el método que revierte la migración.
    public function down(): void
    {
        // Esta línea sirve para modificar la tabla food_items.
        Schema::table('food_items', function (Blueprint $table) {
            // Esta línea sirve para borrar la columna category.
            $table->dropColumn('category');
        });
    }
};
