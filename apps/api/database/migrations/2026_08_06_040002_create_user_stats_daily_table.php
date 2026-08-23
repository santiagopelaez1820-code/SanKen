<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_stats_daily', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->date('stat_date');
            $table->unsignedSmallInteger('workouts_count')->default(0);
            $table->unsignedSmallInteger('total_sets')->default(0);
            $table->decimal('total_volume_kg', 10, 2)->default(0);
            $table->unsignedSmallInteger('training_minutes')->default(0);
            $table->unsignedSmallInteger('current_streak_days')->default(0);
            $table->timestamps();

            $table->unique(['user_id', 'stat_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_stats_daily');
    }
};
