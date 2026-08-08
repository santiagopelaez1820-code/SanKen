<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('onboarding_responses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->enum('level', ['beginner', 'intermediate', 'advanced'])->nullable();
            $table->json('goals')->nullable();
            $table->unsignedTinyInteger('frequency_days')->nullable();
            $table->unsignedTinyInteger('session_minutes')->nullable();
            $table->enum('place', ['home', 'gym'])->nullable();
            $table->json('equipment_available')->nullable();
            $table->json('injuries')->nullable();
            $table->text('experience_notes')->nullable();
            $table->boolean('completed')->default(false);
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('onboarding_responses');
    }
};
