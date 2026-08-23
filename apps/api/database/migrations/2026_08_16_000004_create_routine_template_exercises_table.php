<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * default_sets/default_reps son el "8x12" de cada ejercicio de plantilla,
 * pero configurable en BD (no hardcodeado en frontend/backend) — ver
 * seccion 7 del pedido. La alternativa A/B de cada ejercicio se resuelve
 * via exercise_alternatives (ya existente), no una columna aca.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('routine_template_exercises', function (Blueprint $table) {
            $table->id();
            $table->foreignId('routine_template_day_id')->constrained()->cascadeOnDelete();
            $table->foreignId('exercise_id')->constrained()->restrictOnDelete();
            $table->unsignedTinyInteger('order');
            $table->unsignedTinyInteger('default_sets')->default(8);
            $table->string('default_reps')->default('12');
            $table->unsignedSmallInteger('rest_seconds')->default(90);
            $table->timestamps();

            $table->index(['routine_template_day_id', 'order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('routine_template_exercises');
    }
};
