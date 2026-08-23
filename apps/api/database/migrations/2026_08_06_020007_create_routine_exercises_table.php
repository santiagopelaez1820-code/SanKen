<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('routine_exercises', function (Blueprint $table) {
            $table->id();
            $table->foreignId('routine_day_id')->constrained()->cascadeOnDelete();
            $table->foreignId('exercise_id')->constrained()->restrictOnDelete();
            $table->unsignedTinyInteger('order');
            $table->unsignedTinyInteger('target_sets');
            $table->string('target_reps');
            $table->unsignedSmallInteger('rest_seconds');
            $table->decimal('target_rpe', 3, 1)->nullable();
            $table->decimal('suggested_weight_kg', 6, 2)->nullable();
            $table->timestamps();

            $table->index(['routine_day_id', 'order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('routine_exercises');
    }
};
