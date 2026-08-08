<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('exercises', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('primary_muscle_id')->constrained('muscle_groups')->restrictOnDelete();
            $table->enum('equipment', [
                'barbell', 'dumbbells', 'bench', 'squat_rack', 'pull_up_bar',
                'cables', 'machines', 'kettlebells', 'resistance_bands', 'bodyweight_only',
            ]);
            $table->enum('level', ['beginner', 'intermediate', 'advanced']);
            $table->enum('type', ['compound', 'isolation', 'cardio', 'mobility']);
            $table->text('instructions')->nullable();
            $table->text('common_mistakes')->nullable();
            $table->text('tips')->nullable();
            $table->string('video_url')->nullable();
            $table->string('image_url')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['primary_muscle_id', 'equipment', 'level', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('exercises');
    }
};
