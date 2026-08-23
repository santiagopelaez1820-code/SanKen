<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('exercise_alternatives', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exercise_id')->constrained()->cascadeOnDelete();
            $table->foreignId('alternative_exercise_id')->constrained('exercises')->cascadeOnDelete();

            $table->unique(['exercise_id', 'alternative_exercise_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('exercise_alternatives');
    }
};
