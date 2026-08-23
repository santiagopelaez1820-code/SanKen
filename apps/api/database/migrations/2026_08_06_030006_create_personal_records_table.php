<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('personal_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('exercise_id')->constrained()->cascadeOnDelete();
            $table->enum('record_type', ['1rm', 'max_reps', 'max_volume']);
            $table->decimal('value', 8, 2);
            $table->date('achieved_at');
            $table->foreignId('workout_set_id')->nullable()->constrained()->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['user_id', 'exercise_id', 'record_type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('personal_records');
    }
};
