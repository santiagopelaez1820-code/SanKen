<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('workout_sets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('workout_exercise_id')->constrained()->cascadeOnDelete();
            $table->unsignedTinyInteger('set_number');
            $table->decimal('weight_kg', 6, 2);
            $table->unsignedSmallInteger('reps');
            $table->decimal('rpe', 3, 1)->nullable();
            $table->boolean('is_warmup')->default(false);
            $table->boolean('completed')->default(true);
            $table->timestamps();

            $table->index(['workout_exercise_id', 'set_number']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('workout_sets');
    }
};
