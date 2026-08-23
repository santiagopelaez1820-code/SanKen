<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
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
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('food_items', function (Blueprint $table) {
            $table->string('category')->nullable()->after('brand');
            $table->index('category');
        });
    }

    public function down(): void
    {
        Schema::table('food_items', function (Blueprint $table) {
            $table->dropColumn('category');
        });
    }
};
