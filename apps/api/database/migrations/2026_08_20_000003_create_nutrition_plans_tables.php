<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Plan alimenticio personalizado (opt-in, ver GenerateNutritionPlanAction):
 * un usuario tiene A LO SUMO un plan (unique en user_id) — generarlo de
 * nuevo reemplaza el anterior por completo. Guarda los objetivos diarios
 * usados al generarlo (snapshot de NutritionTargetCalculator en ese
 * momento, no una referencia viva) para que el plan no cambie solo si el
 * usuario edita su perfil después sin volver a generar.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('nutrition_plans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->unsignedSmallInteger('calories');
            $table->unsignedSmallInteger('protein_g');
            $table->unsignedSmallInteger('carbs_g');
            $table->unsignedSmallInteger('fat_g');
            $table->timestamps();
        });

        Schema::create('nutrition_plan_meals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('nutrition_plan_id')->constrained()->cascadeOnDelete();
            $table->string('meal_type', 20);
            $table->unsignedSmallInteger('order');
            $table->unsignedSmallInteger('target_calories');
            $table->unsignedSmallInteger('target_protein_g');
            $table->unsignedSmallInteger('target_carbs_g');
            $table->unsignedSmallInteger('target_fat_g');
            $table->timestamps();
        });

        Schema::create('nutrition_plan_meal_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('nutrition_plan_meal_id')->constrained()->cascadeOnDelete();
            // restrictOnDelete, no cascade: un food_item con items de plan
            // activos no debería poder desaparecer de golpe (mismo criterio
            // que exercises/routine_exercises).
            $table->foreignId('food_item_id')->constrained()->restrictOnDelete();
            $table->decimal('quantity_grams', 7, 2);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('nutrition_plan_meal_items');
        Schema::dropIfExists('nutrition_plan_meals');
        Schema::dropIfExists('nutrition_plans');
    }
};
