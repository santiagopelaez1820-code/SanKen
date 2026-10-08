<?php

// Esta línea sirve para importar la clase base de las migraciones.
use Illuminate\Database\Migrations\Migration;
// Esta línea sirve para importar Blueprint para definir las columnas.
use Illuminate\Database\Schema\Blueprint;
// Esta línea sirve para importar la fachada Schema para crear y modificar tablas.
use Illuminate\Support\Facades\Schema;

/**
 * Plan alimenticio personalizado (opt-in, ver GenerateNutritionPlanAction):
 * un usuario tiene A LO SUMO un plan (unique en user_id) — generarlo de
 * nuevo reemplaza el anterior por completo. Guarda los objetivos diarios
 * usados al generarlo (snapshot de NutritionTargetCalculator en ese
 * momento, no una referencia viva) para que el plan no cambie solo si el
 * usuario edita su perfil después sin volver a generar.
 */
// Esta línea sirve para devolver una migración anónima.
return new class extends Migration
{
    // Esta línea sirve para declarar el método que aplica la migración.
    public function up(): void
    {
        // Esta línea sirve para crear la tabla nutrition_plans.
        Schema::create('nutrition_plans', function (Blueprint $table) {
            // Esta línea sirve para agregar el id autoincremental.
            $table->id();
            // Esta línea sirve para agregar el usuario (único; se borra junto con el usuario).
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            // Esta línea sirve para agregar las calorías diarias.
            $table->unsignedSmallInteger('calories');
            // Esta línea sirve para agregar la proteína diaria.
            $table->unsignedSmallInteger('protein_g');
            // Esta línea sirve para agregar los carbohidratos diarios.
            $table->unsignedSmallInteger('carbs_g');
            // Esta línea sirve para agregar la grasa diaria.
            $table->unsignedSmallInteger('fat_g');
            // Esta línea sirve para agregar las fechas de creación y actualización.
            $table->timestamps();
        });

        // Esta línea sirve para crear la tabla nutrition_plan_meals.
        Schema::create('nutrition_plan_meals', function (Blueprint $table) {
            // Esta línea sirve para agregar el id autoincremental.
            $table->id();
            // Esta línea sirve para agregar el plan (se borra junto con el plan).
            $table->foreignId('nutrition_plan_id')->constrained()->cascadeOnDelete();
            // Esta línea sirve para agregar el tipo de comida.
            $table->string('meal_type', 20);
            // Esta línea sirve para agregar el orden.
            $table->unsignedSmallInteger('order');
            // Esta línea sirve para agregar las calorías objetivo.
            $table->unsignedSmallInteger('target_calories');
            // Esta línea sirve para agregar la proteína objetivo.
            $table->unsignedSmallInteger('target_protein_g');
            // Esta línea sirve para agregar los carbohidratos objetivo.
            $table->unsignedSmallInteger('target_carbs_g');
            // Esta línea sirve para agregar la grasa objetivo.
            $table->unsignedSmallInteger('target_fat_g');
            // Esta línea sirve para agregar las fechas de creación y actualización.
            $table->timestamps();
        });

        // Esta línea sirve para crear la tabla nutrition_plan_meal_items.
        Schema::create('nutrition_plan_meal_items', function (Blueprint $table) {
            // Esta línea sirve para agregar el id autoincremental.
            $table->id();
            // Esta línea sirve para agregar la comida del plan (se borra junto con la comida).
            $table->foreignId('nutrition_plan_meal_id')->constrained()->cascadeOnDelete();
            // restrictOnDelete, no cascade: un food_item con items de plan
            // activos no debería poder desaparecer de golpe (mismo criterio
            // que exercises/routine_exercises).
            // Esta línea sirve para agregar el alimento (impide borrar un alimento usado en un plan).
            $table->foreignId('food_item_id')->constrained()->restrictOnDelete();
            // Esta línea sirve para agregar la cantidad en gramos.
            $table->decimal('quantity_grams', 7, 2);
            // Esta línea sirve para agregar las fechas de creación y actualización.
            $table->timestamps();
        });
    }

    // Esta línea sirve para declarar el método que revierte la migración.
    public function down(): void
    {
        // Esta línea sirve para borrar la tabla de alimentos del plan si existe.
        Schema::dropIfExists('nutrition_plan_meal_items');
        // Esta línea sirve para borrar la tabla de comidas del plan si existe.
        Schema::dropIfExists('nutrition_plan_meals');
        // Esta línea sirve para borrar la tabla de planes si existe.
        Schema::dropIfExists('nutrition_plans');
    }
};
