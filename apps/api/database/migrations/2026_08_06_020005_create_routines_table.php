<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('routines', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('created_by_trainer_id')->nullable()->constrained('users')->nullOnDelete();
            $table->enum('source', ['engine', 'trainer'])->default('engine');
            $table->string('goal');
            $table->enum('split_type', ['full_body', 'upper_lower', 'push_pull_legs', 'bro_split']);
            $table->unsignedTinyInteger('frequency_days');
            $table->unsignedTinyInteger('duration_weeks')->default(6);
            $table->boolean('is_active')->default(true);
            $table->date('starts_at')->nullable();
            $table->date('ends_at')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('routines');
    }
};
